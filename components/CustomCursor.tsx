import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  // Smooth springs for cursor movement
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mousePosition.x, springConfig);
  const cursorY = useSpring(mousePosition.y, springConfig);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Check if we are hovering over clickable items
      const target = e.target as HTMLElement;
      if (
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button'
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  useEffect(() => {
    // The tip of the arrow will be the exact coordinate. 
    // We add a tiny offset inside the component styling.
    cursorX.set(mousePosition.x);
    cursorY.set(mousePosition.y);
  }, [mousePosition, cursorX, cursorY]);

  // We only run this on devices with hover (not mobile)
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) return null;

  return (
    <>
      <style>{`
        body *, a, button {
          cursor: none !important;
        }
      `}</style>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference text-white drop-shadow-xl"
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={{
          scale: isHovered ? 1.4 : 1,
          rotate: isHovered ? -15 : 0
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      >
        <svg 
           width="28" height="28" 
           viewBox="0 0 24 24" 
           fill="currentColor" 
           xmlns="http://www.w3.org/2000/svg"
           style={{ transform: 'translate(-2px, -2px)' }} 
        >
          <path d="M4.5 1.5L21.5 9.5L12 12.5L9.5 22L4.5 1.5Z" stroke="black" strokeWidth="1" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </>
  );
};
