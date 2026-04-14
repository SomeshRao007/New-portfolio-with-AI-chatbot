import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

export interface GalleryItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  image: string;
}

export default function CoverFlowCarousel({
  heading = "My Projects",
  items,
}: {
  heading?: string;
  items: GalleryItem[];
}) {
  const [currentIndex, setCurrentIndex] = useState(Math.floor(items.length / 2));
  const [cardOffset, setCardOffset] = useState(250);

  useEffect(() => {
    const handleResize = () => {
      setCardOffset(window.innerWidth < 640 ? 120 : window.innerWidth < 1024 ? 200 : 250);
    };
    handleResize(); // Set initial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNext = () => setCurrentIndex((prev) => Math.min(prev + 1, items.length - 1));
  const handlePrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  return (
    <section className="py-20 bg-transparent relative z-10 pointer-events-auto overflow-hidden">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm text-blue-500 font-bold tracking-widest uppercase mb-2">&gt; HIGHLIGHTS</p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-50 drop-shadow-lg">{heading}</h2>
        </div>

        {/* 3D Carousel Container */}
        <div className="relative w-full h-[400px] flex justify-center items-center" style={{ perspective: "1200px" }}>
          <AnimatePresence initial={false}>
            {items.map((item, i) => {
              const offset = i - currentIndex;
              const isCenter = offset === 0;

              return (
                <motion.div
                  key={item.id}
                  className={`absolute w-[280px] sm:w-[350px] h-[350px] cursor-pointer rounded-2xl overflow-hidden shadow-2xl group border border-slate-700/50 bg-slate-900`}
                  initial={{ opacity: 0, x: offset * cardOffset, scale: 0.8 }}
                  animate={{
                    opacity: Math.abs(offset) > 2 ? 0 : 1,
                    x: offset * cardOffset,
                    scale: isCenter ? 1 : 0.85 - Math.abs(offset) * 0.05,
                    rotateY: offset === 0 ? 0 : offset > 0 ? -40 : 40,
                    zIndex: items.length - Math.abs(offset),
                    filter: isCenter ? "blur(0px) brightness(1)" : "blur(4px) brightness(0.5)"
                  }}
                  transition={{ duration: 0.6, type: "spring", bounce: 0.15 }}
                  onClick={() => {
                    if (isCenter) {
                      window.open(item.url, '_blank');
                    } else {
                      setCurrentIndex(i);
                    }
                  }}
                >
                  {/* Image Background */}
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-all duration-700" />
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500 border border-slate-700">No Image</div>
                  )}

                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Hover Info Panel (Reveals exactly like previous implementation) */}
                  <div className="absolute bottom-0 left-0 w-full p-6 transition-all duration-500 transform translate-y-[50%] group-hover:translate-y-0 opacity-0 group-hover:opacity-100 bg-[#0d1117]/95 backdrop-blur-md border-t border-slate-700">
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-slate-300 text-sm line-clamp-2 md:line-clamp-3 mb-4">{item.summary}</p>
                    <div className="w-8 h-8 rounded-full border border-slate-500 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 ml-auto">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                  
                  {/* Default State Info (Visible when NOT hovering and is center card) */}
                  <div className={`absolute bottom-0 left-0 w-full p-6 transition-all duration-500 group-hover:opacity-0 group-hover:translate-y-4 ${isCenter ? 'opacity-100' : 'opacity-0'}`}>
                    <h3 className="text-xl font-bold text-white drop-shadow-md">{item.title}</h3>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-6 mt-12">
          <button 
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="w-12 h-12 rounded-full border border-slate-700 bg-slate-900 shadow-lg flex items-center justify-center text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 hover:text-blue-400 transition-colors z-20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={handleNext}
            disabled={currentIndex === items.length - 1}
            className="w-12 h-12 rounded-full border border-slate-700 bg-slate-900 shadow-lg flex items-center justify-center text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 hover:text-blue-400 transition-colors z-20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
