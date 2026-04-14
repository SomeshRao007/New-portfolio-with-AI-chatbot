
import React, { Suspense, lazy, useMemo, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import { INITIAL_DATA, createChatbotSystemInstruction } from './constants';
import { ThemeProvider } from './hooks/useTheme';
import { WebGLShader } from "./components/ui/web-gl-shader";
import { LiquidButton } from './components/ui/liquid-glass-button';
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"
import { CustomCursor } from './components/CustomCursor';
import { ParticleNetwork } from './components/ParticleNetwork';
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

const IntroScreen: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  return (
    <div className="relative flex w-full h-screen flex-col items-center justify-center overflow-hidden bg-black">
      <WebGLShader/>
      <div className="relative z-10 p-2 w-full mx-auto max-w-3xl">
        <main className="relative border border-white/20 bg-transparent backdrop-blur-md py-10 overflow-hidden rounded-xl shadow-2xl">
            <h1 className="mb-3 text-white text-center text-7xl font-extrabold tracking-tighter md:text-[clamp(2rem,8vw,7rem)]">Somesh Rao Coka</h1>
            <p className="text-white/60 px-6 text-center text-xs md:text-sm lg:text-lg">Speed Security Stability - DevOps Done Right!</p>
            <div className="my-8 flex items-center justify-center gap-1">
                <span className="relative flex h-3 w-3 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                <p className="text-xs text-green-500">Available for New Projects</p>
            </div>

            <div className="flex justify-center pb-6">
                <LiquidButton className="text-white border border-white/30 rounded-full font-bold tracking-wide" size={'xl'} onClick={onEnter}>Let's Go</LiquidButton>
            </div>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const portfolioData = INITIAL_DATA;

  const chatbotInstruction = useMemo(() => createChatbotSystemInstruction(portfolioData), [portfolioData]);

  if (showIntro) {
    return <IntroScreen onEnter={() => setShowIntro(false)} />;
  }

  return (
    <ThemeProvider>
      <CustomCursor />
      <ParticleNetwork />
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
