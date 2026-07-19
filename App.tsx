
import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import { INITIAL_DATA, createChatbotSystemInstruction } from './constants';
import { ThemeProvider } from './hooks/useTheme';
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"
import BlueprintGrid from './components/BlueprintGrid';
import { AnimatedSection } from './components/AnimatedSection';

// Lazy-loaded below-fold components for better initial load performance
const Skills = lazy(() => import('./components/Skills'));
const Certifications = lazy(() => import('./components/Certifications'));
const Chatbot = lazy(() => import('./components/Chatbot'));
const Stats = lazy(() => import('./components/Stats'));
const Timeline = lazy(() => import('./components/Timeline'));
const Projects = lazy(() => import('./components/Projects'));
const LearningList = lazy(() => import('./components/LearningList'));
const Contact = lazy(() => import('./components/Contact'));
const Testimonials = lazy(() => import('./components/Testimonials'));

const SectionFallback = () => (
  <div className="flex items-center justify-center py-20">
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const BOOT_LINES: [string, string, boolean][] = [
  // [dmesg timestamp, message, shows OK]
  ['0.000000', 'SomeshOS v2.4.1 (build: cloud-native) booting...', false],
  ['0.041627', 'Loading kernel modules: aws k8s docker terraform ansible', true],
  ['0.183210', 'Mounting /dev/career (8 milestones, journaled)', true],
  ['0.284551', 'Starting container runtime: 3,000 servers migrated', true],
  ['0.395117', 'Optimizing ci/cd pipelines: build time -40%', true],
  ['0.446902', 'Decrypting endorsements from allied networks', true],
  ['0.517263', 'Arming AI subsystems: agentic workflows online', true],
  ['0.598884', 'Starting somesh-portfolio.service', true],
  ['0.612001', 'Boot complete. Uptime target: 99.99%', false],
];

const IntroScreen: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [lineCount, setLineCount] = useState(reducedMotion ? BOOT_LINES.length : 0);
  const booted = lineCount >= BOOT_LINES.length;

  useEffect(() => {
    if (booted) return;
    const t = setTimeout(() => setLineCount((c) => c + 1), lineCount === 0 ? 350 : 150);
    return () => clearTimeout(t);
  }, [lineCount, booted]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Enter') onEnter(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onEnter]);

  return (
    <div className="flex w-full min-h-screen flex-col items-center justify-center bg-[#05070a] px-4 py-10">
      <div className="w-full max-w-2xl font-mono text-[13px] sm:text-sm leading-relaxed">
        {BOOT_LINES.slice(0, lineCount).map(([time, text, ok], i) => (
          <p key={i} className="flex items-baseline gap-2 text-slate-400">
            <span className="text-slate-600 shrink-0">[{time.padStart(8, ' ')}]</span>
            <span>{text}</span>
            {ok && <span className="ml-auto shrink-0 text-green-500">[ OK ]</span>}
          </p>
        ))}
        {!booted && <p className="text-slate-400 animate-pulse">▊</p>}

        {booted && (
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 12, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="mt-8 border-t border-slate-800 pt-8"
          >
            <p className="text-slate-600 text-xs mb-3">Welcome to SomeshOS — message of the day:</p>
            <h1 className="text-white text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter font-sans">Somesh Rao Coka</h1>
            <p className="mt-3 text-slate-500">Speed · Security · Stability — DevOps done right.</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="relative flex h-3 w-3 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              <p className="text-xs text-green-500">Available for New Projects</p>
            </div>
            <button
              onClick={onEnter}
              className="mt-8 inline-flex items-center gap-3 rounded border border-slate-700 px-5 py-3 text-slate-200 transition-colors hover:border-green-500 hover:text-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-500"
            >
              <span className="text-green-500">$</span> ./enter --portfolio
              <kbd className="rounded border border-slate-700 px-1.5 py-0.5 text-[10px] text-slate-500">ENTER</kbd>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(() => sessionStorage.getItem('introSeen') !== '1');
  const portfolioData = INITIAL_DATA;

  const chatbotInstruction = useMemo(() => createChatbotSystemInstruction(portfolioData), [portfolioData]);

  if (showIntro) {
    return <IntroScreen onEnter={() => { sessionStorage.setItem('introSeen', '1'); setShowIntro(false); }} />;
  }

  return (
    <ThemeProvider>
      <BlueprintGrid />
      <div className="min-h-screen flex flex-col font-sans animate-in fade-in duration-1000">
        <Header name={portfolioData.personalInfo.name} />
        <main className="flex-grow container mx-auto px-4 md:px-8 py-8">
          <AnimatedSection id="home" className="pt-20 -mt-20">
            <Hero data={portfolioData.personalInfo} />
          </AnimatedSection>
          <Suspense fallback={<SectionFallback />}>
            <AnimatedSection delay={0.2}>
              <Stats data={portfolioData.stats} />
            </AnimatedSection>
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <AnimatedSection id="skills" className="pt-20 -mt-20">
              <Skills data={portfolioData.skills} />
            </AnimatedSection>
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <AnimatedSection id="timeline" className="pt-20 -mt-20">
              <Timeline data={portfolioData.timeline} />
            </AnimatedSection>
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <AnimatedSection id="projects" className="pt-20 -mt-20">
              <Projects data={portfolioData.projects} />
            </AnimatedSection>
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <AnimatedSection id="certifications" className="pt-20 -mt-20">
              <Certifications data={portfolioData.certifications} />
            </AnimatedSection>
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <AnimatedSection id="testimonials" className="pt-20 -mt-20">
              <Testimonials data={portfolioData.testimonials} />
            </AnimatedSection>
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <AnimatedSection id="learning" className="pt-20 -mt-20">
              <LearningList data={portfolioData.learning} />
            </AnimatedSection>
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <AnimatedSection id="contact" className="pt-20 -mt-20">
              <Contact formspreeEndpoint={portfolioData.personalInfo.formspreeEndpoint} />
            </AnimatedSection>
          </Suspense>
        </main>
        <Footer name={portfolioData.personalInfo.name} />
        <Suspense fallback={null}>
          <Chatbot systemInstruction={chatbotInstruction} />
        </Suspense>
      </div>
      <SpeedInsights/>
      <Analytics/>
    </ThemeProvider>
  );
};

export default App;
