import React, { useState, useEffect } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid';
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { Button as MovingButton } from "./ui/moving-border.tsx";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";


const BlurInText = ({ text, className }: { text: string; className?: string }) => {
  const words = text.split(" ");

  return (
    <motion.div 
      className={cn("inline-block", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }} 
      variants={{
        visible: { transition: { staggerChildren: 0.03 } },
        hidden: {}
      }}
    >
      {words.map((word, idx) => (
        <motion.span
          key={idx}
          variants={{
            hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
            visible: { 
              opacity: 1, 
              filter: "blur(0px)", 
              y: 0, 
              transition: { duration: 1, ease: "easeOut" } 
            }
          }}
          className="inline-block mr-1.5"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

// --- Advanced Typewriter Component ---
const Typewriter = ({ 
  words, 
  className 
}: { 
  words: string[]; 
  className?: string 
}) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [blink, setBlink] = useState(true);
  const [reverse, setReverse] = useState(false);

  // Blinking cursor effect
  useEffect(() => {
    const timeout2 = setTimeout(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearTimeout(timeout2);
  }, [blink]);

  // Typing logic
  useEffect(() => {
    if (index >= words.length) {
      setIndex(0);
      return;
    }

    const typeSpeed = Math.floor(Math.random() * (150 - 80 + 1) + 80); 
    const deleteSpeed = Math.floor(Math.random() * (60 - 30 + 1) + 30);
    const pauseEnd = 2000; 
    
    if (subIndex === words[index].length + 1 && !reverse) {
      const timeout = setTimeout(() => {
        setReverse(true);
      }, pauseEnd);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? deleteSpeed : typeSpeed);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words]);

  return (
    <span className={className}>
      {`${words[index].substring(0, subIndex)}`}
      <span className={cn("ml-1 font-light text-slate-400", blink ? "opacity-100" : "opacity-0")}>|</span>
    </span>
  );
};

// --- Main Hero Component ---
type HeroProps = {
  data: {
    name: string;
    title: string;
    profileImageUrl: string;
    bio: string;
    socialLinks: { name: string; url: string; icon: string }[];
    cvUrl: string;
  };
};

const Hero: React.FC<HeroProps> = ({ data }) => {
  if (!data) return null; 

  const cycleWords = [
    "Scale More, Spend Less",
    "Optimize Cloud, Minimize Waste",
    "Slash Bills, Not Performance",
    "Redefining the Workflows of Tomorrow"
  ];

  return (
    <section className="py-10 md:py-20"> 
      <div className="flex flex-col overflow-hidden"> 
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="text-l font-semibold text-black dark:text-white">
                What I Do ?<br />
                <span className="text-xl md:text-[4rem] font-bold mt-1 leading-none">
                  <Typewriter 
                    words={cycleWords} 
                    className="text-black dark:text-white"
                  />
                </span>
              </h1>
            </>
          }
        >
          <img
            src={data.profileImageUrl}
            alt="hero"
            height={720}
            width={1400}
            className="mx-auto rounded-2xl object-cover h-full object-left-top"
            draggable={false}
          />
        </ContainerScroll>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 items-center px-4 md:px-0">
        <div className="md:col-span-3 text-center md:text-left">          
          <BlurInText 
            text={data.bio}
            className="mt-6 text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed"
          />

          <div className="mt-8 flex justify-center md:justify-start items-center space-x-4">
            <MovingButton
              as="a"
              href={data.cvUrl}
              download="cv.pdf" 
              rel="noopener noreferrer"
              borderRadius="1.75rem"
              containerClassName="w-48 h-14" 
              className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800 flex items-center justify-center gap-2 text-sm font-semibold"
            >
              <ArrowDownTrayIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Download CV</span>
            </MovingButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;