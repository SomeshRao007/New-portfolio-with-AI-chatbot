import React, { useEffect, useRef } from 'react';

export const OrbVisualizer: React.FC<{ analyser: AnalyserNode | null; isLive: boolean }> = ({ analyser, isLive }) => {
  const orbRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!analyser || !isLive) {
      if (orbRef.current) {
         orbRef.current.style.transform = `scale(1)`;
         orbRef.current.style.opacity = `0.3`;
         orbRef.current.style.boxShadow = `0 0 10px 2px rgba(59, 130, 246, 0.3)`;
      }
      return;
    }
    
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    let animationId: number;

    const renderLoop = () => {
      // getByteTimeDomainData or getByteFrequencyData
      analyser.getByteFrequencyData(dataArray);
      
      // Calculate average volume focusing on lower frequencies
      let sum = 0;
      for (let i = 0; i < 30; i++) {
        sum += dataArray[i];
      }
      const average = sum / 30;
      
      // Base scale 1.0, max scale ~1.6
      const scale = 1 + (average / 255) * 0.6;
      const opacity = 0.5 + (average / 255) * 0.5;
      
      if (orbRef.current) {
        orbRef.current.style.transform = `scale(${scale})`;
        orbRef.current.style.opacity = `${opacity}`;
        orbRef.current.style.boxShadow = `0 0 ${average * 0.6}px ${average * 0.3}px rgba(59, 130, 246, 0.8)`;
      }

      animationId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [analyser, isLive]);

  if (!isLive) return null;

  return (
    <div ref={containerRef} className="flex justify-center items-center py-4 w-full h-16 transition-all duration-500 ease-in-out z-10 relative bg-slate-900/10">
      <div 
        ref={orbRef}
        className="w-10 h-10 rounded-full bg-blue-400 blur-[1px]"
        style={{
          transition: 'transform 0.05s linear',
          boxShadow: '0 0 10px 2px rgba(59, 130, 246, 0.3)'
        }}
      />
    </div>
  );
};
