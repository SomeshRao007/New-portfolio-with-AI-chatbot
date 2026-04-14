import React, { useState, useEffect, useRef } from 'react';
import type { Testimonial } from '../types';
import { motion, useInView } from 'framer-motion';

type TestimonialsProps = {
  data: Testimonial[];
};

const ScrambleText: React.FC<{ text: string; speed?: number }> = ({ text, speed = 30 }) => {
  const [displayText, setDisplayText] = useState('');
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  useEffect(() => {
    if (!isInView) {
      setDisplayText(text.replace(/[a-zA-Z0-9]/g, '-'));
      return;
    }
    
    let iteration = 0;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            // Keep spaces intact
            if (char === ' ') return ' ';
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      
      if (iteration >= text.length) {
        clearInterval(interval);
      }
      
      // longer text decrypts faster so it doesn't take forever
      iteration += Math.max(1, text.length / speed); 
    }, 30);
    
    return () => clearInterval(interval);
  }, [isInView, text, speed]);

  return <span ref={ref} className="font-mono">{displayText}</span>;
};


const TestimonialLog: React.FC<{ testimonial: Testimonial; index: number }> = ({ testimonial, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-[#0d1117] border border-slate-800 rounded-lg p-5 font-mono shadow-xl relative overflow-hidden group hover:border-slate-600 transition-colors"
    >
      {/* Decorative vertical bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-800 group-hover:bg-blue-500 transition-colors"></div>
      
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Source Avatar Block */}
        <div className="shrink-0 flex flex-col items-center gap-2 w-20">
           {testimonial.imgSrc ? (
              <img src={testimonial.imgSrc} alt={testimonial.author} className="w-12 h-12 rounded bg-slate-800 object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all border border-slate-700" />
           ) : (
              <div className="w-12 h-12 rounded bg-slate-800 flex items-center justify-center text-slate-500 border border-slate-700">USER</div>
           )}
           <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider bg-blue-900/30 px-1 rounded">AUTH_ID: {index + 1}</span>
        </div>
        
        {/* Log Content */}
        <div className="flex-1 min-w-0">
           <div className="flex flex-wrap items-center gap-2 mb-3 text-sm sm:text-base">
              <span className="text-pink-400">root@endorsement:~$</span>
              <span className="text-yellow-300">tail -f</span>
              <span className="text-slate-400">/logs/{testimonial.company.toLowerCase().replace(/\s+/g, '-')}.log</span>
           </div>
           
           {/* Transmission Meta */}
           <div className="text-xs sm:text-sm text-slate-500 mb-3 border-b border-slate-800 pb-3 leading-relaxed">
             SOURCE: <strong className="text-slate-300">{testimonial.author}</strong> [{testimonial.role}]<br/>
             ENCRYPTION: <span className="text-green-500">Standard</span>
           </div>
           
           {/* The Decrypting Quote */}
           <div className="text-slate-300 text-sm leading-relaxed border-l-2 border-slate-700 pl-3 py-1">
             <ScrambleText text={`"${testimonial.quote}"`} />
           </div>
        </div>
      </div>
    </motion.div>
  );
};


const Testimonials: React.FC<TestimonialsProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <section className="py-20 md:py-24 bg-transparent relative z-10 pointer-events-auto">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <p className="text-sm text-blue-500 font-bold tracking-widest uppercase mb-2">&gt; DECRYPTING_TRANSMISSIONS</p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-50 drop-shadow-lg leading-tight">
            Encrypted Logs
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 font-mono">
            Intercepted feedback from allied networks.
          </p>
        </div>

        <div className="space-y-6">
          {data.map((t, index) => (
             <TestimonialLog key={t.author + index} testimonial={t} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;