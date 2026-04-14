import React, { useEffect, useRef } from 'react';

const BlueprintGrid: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    // Start at center
    let targetX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
    let targetY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;
    let currentX = targetX;
    let currentY = targetY;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      // Smooth lerping effect
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;

      if (containerRef.current) {
         containerRef.current.style.setProperty('--mouse-x', `${currentX}px`);
         containerRef.current.style.setProperty('--mouse-y', `${currentY}px`);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full z-[-1] pointer-events-none overflow-hidden transition-colors duration-500 bg-white dark:bg-[#060913]"
    >
      {/* Light Mode Inversion Masking */}
      <div className="absolute inset-0 dark:hidden bg-slate-100 opacity-90"></div>

      {/* Main Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.2] dark:opacity-[0.07]" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #3b82f6 1px, transparent 1px),
            linear-gradient(to bottom, #3b82f6 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: 'center center'
        }}
      />
      
      {/* Sub-grid precise detailing */}
      <div 
        className="absolute inset-0 opacity-[0.1] dark:opacity-[0.03]" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #3b82f6 1px, transparent 1px),
            linear-gradient(to bottom, #3b82f6 1px, transparent 1px)
          `,
          backgroundSize: '10px 10px',
          backgroundPosition: 'center center'
        }}
      />

      {/* The Dynamic Interactive Spotlight */}
      <div 
        className="absolute inset-0 opacity-100 mix-blend-multiply dark:mix-blend-screen"
        style={{
          background: `radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59, 130, 246, 0.12), transparent 40%)`
        }}
      />

      {/* Second darker/tighter spotlight for depth */}
      <div 
        className="absolute inset-0 opacity-100 mix-blend-multiply dark:mix-blend-screen"
        style={{
          background: `radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(29, 78, 216, 0.15), transparent 50%)`
        }}
      />
      
      {/* Horizontal & Vertical Crosshairs locked to mouse */}
      <div className="absolute inset-0 opacity-0 dark:opacity-30 mix-blend-screen">
          <div 
            className="absolute h-[1px] bg-blue-500/40 w-full"
            style={{ top: 'var(--mouse-y, 50%)' }}
          />
          <div 
            className="absolute w-[1px] bg-blue-500/40 h-full"
            style={{ left: 'var(--mouse-x, 50%)' }}
          />
      </div>

      {/* Vignette Edges so grid fades to black at screen borders */}
      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(255,255,255,1)] dark:shadow-[inset_0_0_150px_rgba(6,9,19,1)]"></div>
    </div>
  );
};

export default BlueprintGrid;
