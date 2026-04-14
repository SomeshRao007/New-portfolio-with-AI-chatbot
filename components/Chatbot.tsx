import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import type { ChatMessage } from '../types';
import { MicrophoneIcon, XMarkIcon, ChatBubbleOvalLeftEllipsisIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { OrbVisualizer } from './OrbVisualizer';

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds
const MAX_REQUESTS = 5; // Max requests per window

// Lazy singleton — only initializes when first called, returns null if key is missing
let _ai: GoogleGenAI | null = null;

function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!_ai) {
    _ai = new GoogleGenAI({ apiKey });
  }
  return _ai;
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

// --- Component ---

type ChatbotProps = {
  systemInstruction: string;
};

const initialMessage: ChatMessage = { role: 'model', text: "Hello! I'm Jarvis. How can I assist you with Somesh's portfolio today?" };

const Chatbot: React.FC<ChatbotProps> = ({ systemInstruction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [status, setStatus] = useState('Idle. Press the mic to start.');
  const [history, setHistory] = useState<ChatMessage[]>([initialMessage]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const requestTimestampsRef = useRef<number[]>([]);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  
  const nextStartTimeRef = useRef(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [activeAnalyser, setActiveAnalyser] = useState<AnalyserNode | null>(null);
  
  const currentInputTranscriptionRef = useRef('');
  const currentOutputTranscriptionRef = useRef('');

  const stopConversation = useCallback(async () => {
    setStatus('Closing...');
    if (sessionPromiseRef.current) {
        const session = await sessionPromiseRef.current;
        session.close();
        sessionPromiseRef.current = null;
    }
    
    if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
    }

    if (scriptProcessorRef.current) {
        scriptProcessorRef.current.disconnect();
        scriptProcessorRef.current = null;
    }
    if (mediaStreamSourceRef.current) {
        mediaStreamSourceRef.current.disconnect();
        mediaStreamSourceRef.current = null;
    }
    
    if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
        await inputAudioContextRef.current.close();
        inputAudioContextRef.current = null;
    }
    if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
        await outputAudioContextRef.current.close();
        outputAudioContextRef.current = null;
    }
    
    if (analyserRef.current) {
        analyserRef.current.disconnect();
        analyserRef.current = null;
    }
    setActiveAnalyser(null);
    
    setIsLive(false);
    setStatus('Idle. Press the mic to start.');
  }, []);

  const checkRateLimit = useCallback(() => {
    const now = Date.now();
    // Filter out timestamps that are older than the 1-minute window
    const recentRequests = requestTimestampsRef.current.filter(
      (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
    );

    if (recentRequests.length >= MAX_REQUESTS) {
      return false; // Limit reached
    }

    // Add current timestamp and update ref
    requestTimestampsRef.current = [...recentRequests, now];
    return true; // Request allowed
  }, []);

  const startConversation = useCallback(async () => {
    if (!checkRateLimit()) {
        setHistory(prev => [...prev, { role: 'model', text: "⚠️ Rate limit reached." }]);
        return;
    }

    const ai = getAI();
    if (!ai) {
      setHistory(prev => [...prev, { role: 'model', text: "⚠️ Chatbot unavailable: GEMINI_API_KEY is not configured." }]);
      return;
    }

    setIsLive(true);
    setStatus('Connecting...');

    currentInputTranscriptionRef.current = '';
    currentOutputTranscriptionRef.current = '';

    try {
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      sessionPromiseRef.current = ai.live.connect({
        model: 'gemini-3.1-flash-live-preview',
        callbacks: {
          onopen: async () => {
            setStatus('Listening...');
            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;
            
            mediaStreamSourceRef.current = inputAudioContextRef.current.createMediaStreamSource(stream);
            scriptProcessorRef.current = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
            
            scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromiseRef.current?.then((session) => {
                // Send as an array of media chunks to fix listening
                session.sendRealtimeInput([pcmBlob]);
              });
            };
            
            mediaStreamSourceRef.current.connect(scriptProcessorRef.current);
            scriptProcessorRef.current.connect(inputAudioContextRef.current.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
                currentInputTranscriptionRef.current += message.serverContent.inputTranscription.text;
                setHistory(prev => {
                    const last = prev[prev.length - 1];
                    if (last?.role === 'user') {
                        return [...prev.slice(0, -1), { role: 'user', text: currentInputTranscriptionRef.current }];
                    }
                    return [...prev, { role: 'user', text: currentInputTranscriptionRef.current }];
                });
            }
            if (message.serverContent?.outputTranscription) {
                setStatus('Replying...');
                currentOutputTranscriptionRef.current += message.serverContent.outputTranscription.text;
                setHistory(prev => {
                    const last = prev[prev.length - 1];
                    if (last?.role === 'model') {
                        return [...prev.slice(0, -1), { role: 'model', text: currentOutputTranscriptionRef.current }];
                    }
                    return [...prev, { role: 'model', text: currentOutputTranscriptionRef.current }];
                });
            }

            if (message.serverContent?.turnComplete) {
                currentInputTranscriptionRef.current = '';
                currentOutputTranscriptionRef.current = '';
                setStatus('Listening...');
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
                const ctx = outputAudioContextRef.current;
                
                if (!analyserRef.current) {
                    analyserRef.current = ctx.createAnalyser();
                    analyserRef.current.fftSize = 256;
                    analyserRef.current.connect(ctx.destination);
                    setActiveAnalyser(analyserRef.current);
                }

                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(analyserRef.current);
                source.addEventListener('ended', () => audioSourcesRef.current.delete(source));
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                audioSourcesRef.current.add(source);
            }
             if (message.serverContent?.interrupted) {
                audioSourcesRef.current.forEach(source => {
                    source.stop();
                    audioSourcesRef.current.delete(source);
                });
                nextStartTimeRef.current = 0;
            }
          },
          onerror: (_e: ErrorEvent) => {
            console.error('Gemini Live API connection error');
            setStatus('Connection error. Please try again.');
            stopConversation();
          },
          onclose: () => {
             console.log('Session closed.');
          },
        },
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
            systemInstruction: systemInstruction,
            inputAudioTranscription: {},
            outputAudioTranscription: {},
        },
      });
    } catch (error) {
      console.error("Failed to start conversation");
      setStatus("Error: Couldn't access microphone.");
      setIsLive(false);
    }
  }, [systemInstruction, stopConversation, checkRateLimit]);
  
  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = textInput.trim();
    if (!prompt || isReplying || isLive) return;

    if (!checkRateLimit()) {
      setHistory(prev => [...prev, {
        role: 'model',
        text: "⚠️ Rate limit reached. Dayam API keys are so costly!"
      }]);
      return;
    }

    const sanitizedPrompt = prompt.slice(0, 500);
    const ai = getAI();
    if (!ai) {
      setHistory(prev => [...prev, { role: 'model', text: "⚠️ Dayam API keys are so costly, anyways forgot to configure one" }]);
      return;
    }

    setIsReplying(true);
    const currentHistory = [...history, { role: 'user' as const, text: sanitizedPrompt }];
    setHistory(currentHistory);
    setTextInput('');

    try {
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: currentHistory.map(msg => ({ role: msg.role, parts: [{ text: msg.text }] })),
            config: {
                systemInstruction: systemInstruction
            }
        });

        const modelResponse = response.text;
        setHistory(prev => [...prev, { role: 'model', text: modelResponse }]);
    } catch (error) {
        console.error("Text generation error");
        setHistory(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
        setIsReplying(false);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [history]);
  
  const toggleOpen = () => {
    const nextIsOpen = !isOpen;
    setIsOpen(nextIsOpen);
    if (!nextIsOpen && isLive) {
      stopConversation();
    }
  };
  
  const toggleConversation = () => {
    if (isLive) {
      stopConversation();
    } else {
      startConversation();
    }
  };

  const getStatusText = () => {
    if (isReplying) return 'Jarvis is typing...';
    if (isLive) return status;
    return 'Ask a question or press the mic.';
  };

  return (
    <>
      <button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 w-16 h-16 bg-[#0d1117]/80 backdrop-blur-md text-blue-400 border border-blue-500/50 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center justify-center hover:bg-blue-900/50 hover:text-blue-300 transition-all transform hover:scale-110 focus:outline-none z-50 group"
        aria-label="Open Chatbot"
      >
        {/* Adds a slight scanning line effect on hover */}
        <div className="absolute inset-0 rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
           <div className="w-full h-[2px] bg-blue-400 absolute animate-[scan_2s_linear_infinite]"></div>
        </div>
        <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8 relative z-10" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[calc(100%-3rem)] max-w-sm h-[70vh] max-h-[600px] bg-[#0d1117]/95 backdrop-blur-xl rounded-xl border border-slate-700/50 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col z-50 overflow-hidden animate-fade-in-up font-mono">
          <header className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-gray-800 text-slate-300">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               <h3 className="font-bold text-sm tracking-wider">JARVIS_TERMINAL</h3>
            </div>
            <button onClick={toggleOpen} className="hover:bg-slate-700 hover:text-white p-1 rounded transition-colors">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </header>

          <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
            {history.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-lg text-sm ${
                    msg.role === 'user' ? 'bg-blue-900/40 border border-blue-500/30 text-blue-100' 
                    : 'bg-slate-800/60 border border-slate-700/50 text-slate-300'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          <OrbVisualizer analyser={activeAnalyser} isLive={isLive} />

          <div className="p-4 border-t border-slate-800 bg-[#0d1117]/80">
             <p className="text-center text-[10px] text-slate-500 uppercase tracking-widest mb-3 h-3 flex items-center justify-center">
                 {isLive ? <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse mr-2"></span> : null}
                 {getStatusText()}
             </p>
             <div className="flex items-center gap-2">
                <form onSubmit={handleTextSubmit} className="flex-grow flex items-center">
                    <span className="text-green-500 mr-2 font-bold select-none">&gt;</span>
                    <input
                        type="text"
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Enter command..."
                        maxLength={500}
                        disabled={isLive || isReplying}
                        className="w-full bg-transparent border-none text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-0 disabled:opacity-50 text-sm"
                    />
                    <button
                        type="submit"
                        disabled={isLive || isReplying || !textInput.trim()}
                        className="w-8 h-8 flex-shrink-0 flex items-center justify-center text-slate-500 hover:text-blue-400 disabled:text-slate-700 disabled:cursor-not-allowed transition-colors"
                        aria-label="Send message"
                    >
                        <PaperAirplaneIcon className="w-4 h-4" />
                    </button>
                </form>
                <div className="w-px h-6 bg-slate-700 mx-1"></div>
                <button
                    onClick={toggleConversation}
                    className={`w-10 h-10 flex-shrink-0 rounded flex items-center justify-center transition-all duration-300 border ${
                        isLive 
                        ? 'border-red-500/50 bg-red-900/30 text-red-500 hover:bg-red-900/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]' 
                        : 'border-slate-700 bg-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/50'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    aria-label={isLive ? 'Stop conversation' : 'Start conversation'}
                    disabled={isReplying}
                >
                    {isLive ? (
                        <div className="w-3 h-3 bg-red-500 rounded-sm animate-pulse"></div>
                    ) : (
                        <MicrophoneIcon className="w-5 h-5" />
                    )}
                </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
        @keyframes scan {
          0% { top: -20%; }
          100% { top: 120%; }
        }
      `}</style>
    </>
  );
};

export default Chatbot;
