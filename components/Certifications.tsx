import React, { useState, useEffect, useCallback } from 'react';
import type { Certification } from '../types';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

type CertificationsProps = {
  data: Certification[];
};

const Certifications: React.FC<CertificationsProps> = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Fix: Replaced `NodeJS.Timeout` with `number` because `setInterval` in a browser environment returns a number, resolving the 'Cannot find namespace NodeJS' error.
  const intervalRef = React.useRef<number | null>(null);

  const nextCard = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
  }, [data.length]);

  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      nextCard();
    }, 4000); // Change card every 4 seconds
  }, [nextCard]);

  const resetAutoPlay = useCallback(() => {
    startAutoPlay();
  }, [startAutoPlay]);

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startAutoPlay]);

  const handleNextClick = () => {
    nextCard();
    resetAutoPlay();
  };

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <section className="py-20 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-right mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50">Licenses & Certifications</h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">My commitment to continuous learning and professional development.</p>
        </div>
        
        <div className="relative h-[400px] sm:h-[500px] max-w-xl mx-auto flex items-center justify-center">          
          {data.map((cert, index) => {
            const stackIndex = (index - currentIndex + data.length) % data.length;
            const isVisible = stackIndex < 4; // Only show top 4 cards for performance
            const isTopCard = stackIndex === 0;

            const getStyle = () => {
              if (!isVisible) {
                return {
                  opacity: 0,
                  transform: `translateY(40px) scale(0.8) rotate(0deg)`,
                  zIndex: 0,
                  pointerEvents: 'none' as const,
                };
              }
              return {
                opacity: 1,
                transform: `translateY(${stackIndex * -12}px) scale(${1 - stackIndex * 0.05}) rotate(${stackIndex * -3}deg)`,
                zIndex: data.length - stackIndex,
                pointerEvents: isTopCard ? 'auto' as const : 'none' as const,
              };
            };
            
            const style = getStyle();

            return (
              <a
                key={cert.title + index}
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute w-[90%] sm:w-full max-w-lg cursor-pointer transition-all duration-500 ease-in-out"
                style={style}
                onClick={resetAutoPlay}
                draggable="false"
              >
                <div className="block bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/50 overflow-hidden">
                  <div className="relative pt-[100%]">
                    <img
                      src={cert.imageUrl}
                      alt={cert.title}
                      loading="lazy"
                      className="absolute top-0 left-0 w-full h-full object-cover"
                      draggable="false"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                      {cert.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{cert.issuer}</p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        <div className="flex justify-center mt-20">
            <button
                onClick={handleNextClick}
                className="w-14 h-14 bg-white dark:bg-slate-700 rounded-full shadow-md hover:shadow-lg flex items-center justify-center text-blue-600 dark:text-blue-400 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                aria-label="Next certification"
            >
                <ArrowRightIcon className="w-6 h-6" />
            </button>
        </div>
      </div>
    </section>
  );
};

export default Certifications;
