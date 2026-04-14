import React, { useState } from 'react';
import type { Certification } from '../types';
import { motion } from 'framer-motion';

type CertificationsProps = {
  data: Certification[];
};

const BadgeCard: React.FC<{ cert: Certification; index: number }> = ({ cert, index }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="group relative w-full h-80 sm:h-96 cursor-pointer"
      style={{ perspective: '1000px' }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onTouchStart={() => setIsFlipped(true)}
      onTouchEnd={() => setIsFlipped(false)}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Lanyard Hole Mockup - shared between front and back */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-3 bg-black/20 rounded-full z-20 shadow-inner"></div>

        {/* FRONT OF BADGE */}
        <div 
          className="absolute inset-0 backface-hidden w-full h-full bg-slate-900 border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden flex flex-col"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Holographic Header */}
          <div className="h-1/3 w-full bg-gradient-to-br from-blue-600/30 to-indigo-900/30 border-b border-indigo-500/20 flex flex-col items-center justify-center p-4">
             <span className="text-blue-400 text-[10px] tracking-[0.25em] font-bold uppercase mb-1">Security Level [L{index + 1}]</span>
             <h3 className="text-white font-bold text-center leading-tight line-clamp-2">{cert.title}</h3>
          </div>
          
          <div className="flex-1 p-4 flex flex-col items-center justify-center bg-[#0d1117] relative overflow-hidden">
             {/* Holographic Glare */}
             <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-100%] group-hover:translate-x-[100%] duration-1000 ease-in-out z-10"></div>
             
             {/* Certificate Logo */}
             <div className="w-24 h-24 sm:w-32 sm:h-32 p-2 bg-white rounded-xl shadow-inner flex items-center justify-center mb-4">
               {cert.imageUrl ? (
                 <img src={cert.imageUrl} alt={cert.title} className="max-w-full max-h-full object-contain" />
               ) : (
                 <span className="text-slate-400 font-bold">NO IMG</span>
               )}
             </div>
             
             <p className="text-slate-400 text-xs font-mono uppercase tracking-wider">{cert.issuer}</p>
             <p className="text-slate-600 font-mono text-[10px] mt-1 shrink-0 break-all">{Math.random().toString(36).substring(2, 15).toUpperCase()}</p>
          </div>
        </div>

        {/* BACK OF BADGE */}
        <div 
          className="absolute inset-0 backface-hidden w-full h-full bg-slate-200 border border-slate-300 rounded-2xl shadow-xl flex flex-col items-center justify-center p-6 text-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
           <div className="w-full border-b-4 border-black mb-4"></div>
           <p className="text-slate-500 font-mono text-xs uppercase mb-2 block">Authorization Verified</p>
           <h3 className="text-slate-900 font-bold text-lg mb-6">{cert.title}</h3>
           
           {/* Mock Barcode */}
           <div className="w-full flex justify-between h-12 mb-4 px-2 opacity-50">
              {Array.from({length: 20}).map((_, i) => (
                <div key={i} className={`h-full bg-black ${Math.random() > 0.5 ? 'w-2' : 'w-1'}`}></div>
              ))}
           </div>
           
           <a 
             href={cert.link} 
             target="_blank" 
             rel="noopener noreferrer"
             className="mt-auto block w-full py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-[background-color] relative z-20"
             onClick={(e) => e.stopPropagation()} // Let the user actually click the link without flipping back
           >
             VERIFY CREDENTIAL
           </a>
        </div>
      </motion.div>
    </div>
  );
};

const Certifications: React.FC<CertificationsProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <section className="py-20 md:py-24 bg-transparent relative z-10 pointer-events-auto">
      <div className="container mx-auto px-4">
        <div className="mb-16">
          <p className="text-sm text-blue-500 font-bold tracking-widest uppercase mb-2">&gt; IDENTITY_VERIFICATION</p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-50 drop-shadow-lg">Access Badges</h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Security clearance modules & recognized certifications.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">          
          {data.map((cert, index) => (
             <BadgeCard key={cert.title + index} cert={cert} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
