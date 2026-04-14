import React, { useState, useMemo, useRef } from 'react';
import type { TimelineEvent } from '../types';
import { XMarkIcon, BriefcaseIcon, AcademicCapIcon, StarIcon } from '@heroicons/react/24/solid';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

type TimelineProps = {
  data: TimelineEvent[];
};

const iconMap: { [key in TimelineEvent['icon']]: React.ReactNode } = {
  work: <BriefcaseIcon className="w-5 h-5 text-current" />,
  education: <AcademicCapIcon className="w-5 h-5 text-current" />,
  milestone: <StarIcon className="w-5 h-5 text-current" />,
};

const TimelineModal: React.FC<{ event: TimelineEvent; onClose: () => void }> = ({ event, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in pointer-events-auto" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-slate-900 border border-slate-700 rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.15)] max-w-2xl w-full p-6 md:p-8 relative" 
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors"
          aria-label="Close modal"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        <div>
          <p className="text-blue-400 font-bold mb-2 uppercase tracking-widest text-xs">{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
          <h3 className="text-2xl font-bold text-slate-100 mb-4">{event.title}</h3>
          <p className="text-slate-300 leading-relaxed text-sm md:text-base">{event.fullDescription}</p>
        </div>
      </motion.div>
    </div>
  );
};

const TimelineItem: React.FC<{ event: TimelineEvent; index: number; onReadMore: (event: TimelineEvent) => void }> = ({ event, index, onReadMore }) => {
  const isRightAligned = index % 2 === 0;

  return (
    <motion.div 
      className="relative pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-x-12 items-start group pb-4"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* RPG Skill Node (Icon) */}
      <motion.div 
        className="absolute left-4 md:left-1/2 top-4 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center z-20 border-[3px] border-slate-700 bg-slate-900 text-slate-500 transition-colors duration-500"
        whileInView={{
          borderColor: "#3b82f6",
          backgroundColor: "#1e3a8a", // dark blue
          boxShadow: "0 0 20px rgba(59,130,246,0.8)",
          color: "#ffffff"
        }}
        viewport={{ margin: "-50% 0px -50% 0px" }} // Lights up exactly when crossing center of screen
      >
        {iconMap[event.icon]}
      </motion.div>
      
      {/* Skill Node Details */}
      <div className={`${isRightAligned ? 'md:col-start-2' : 'md:col-start-1 md:row-start-1 md:text-right'}`}>
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl border border-slate-700 shadow-lg relative overflow-hidden group-hover:border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300"
        >
          {/* Subtle glow inside card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500"></div>
          
          <p className="text-blue-400 font-bold mb-1 tracking-wider text-xs uppercase">{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
          <h3 className="text-xl font-bold text-slate-100 mb-2 relative z-10">{event.title}</h3>
          <p className="text-slate-400 text-sm relative z-10 mb-4">{event.description}</p>
          
          <button 
            onClick={() => onReadMore(event)} 
            className="relative z-10 text-xs font-bold text-slate-300 hover:text-white px-4 py-2 rounded border border-slate-600 hover:border-blue-500 hover:bg-blue-500/20 transition-all"
          >
            OPEN NODE
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Timeline: React.FC<TimelineProps> = ({ data }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data]);

  const handleReadMore = (event: TimelineEvent) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <section className="py-20 md:py-24 bg-transparent relative z-10 pointer-events-auto">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-sm text-blue-600 dark:text-blue-500 font-bold tracking-widest uppercase mb-2">&gt; SELECT_PATHWAY</p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-50 drop-shadow-lg">My Journey</h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Scroll to unlock experiential milestones.</p>
        </div>
        
        <div className="relative max-w-4xl mx-auto" ref={containerRef}>
          {/* Background Track line */}
          <div className="absolute left-4 md:left-1/2 top-4 bottom-0 w-[4px] -translate-x-1/2 bg-slate-800 rounded-full overflow-hidden">
            {/* Glowing active line bound to scroll progress */}
            <motion.div 
               className="w-full absolute top-0 bg-gradient-to-b from-blue-400 to-indigo-600 shadow-[0_0_15px_rgba(59,130,246,1)] origin-top rounded-full"
               style={{
                  height: useTransform(smoothProgress, [0, 1], ["0%", "100%"]),
               }}
            />
          </div>

          <div className="space-y-12">
            {sortedData.map((event, index) => (
              <TimelineItem key={index} event={event} index={index} onReadMore={handleReadMore} />
            ))}
          </div>
        </div>
        
        {modalOpen && selectedEvent && <TimelineModal event={selectedEvent} onClose={handleCloseModal} />}
      </div>
    </section>
  );
};

export default Timeline;