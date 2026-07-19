import React, { useState, useEffect, useRef } from 'react';

type Stat = {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
};

type StatsProps = {
  data: Stat[];
};

const CountUp: React.FC<{ end: number; decimals?: number }> = ({ end, decimals }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  // Fix: Initialize useRef with a value (null) and update the type to allow null.
  // This resolves the error "Expected 1 arguments, but got 0" because useRef<T>() with a generic
  // type requires an initial value if T cannot be undefined.
  const animationFrameRef = useRef<number | null>(null);

  const easeOutExpo = (t: number) => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const duration = 2000; // 2 seconds
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            setCount(easeOutExpo(progress) * end);

            if (progress < 1) {
              animationFrameRef.current = requestAnimationFrame(animate);
            } else {
              setCount(end); // Ensure it ends on the exact number
            }
          };
          
          animationFrameRef.current = requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [end]);

  return <span ref={ref}>{decimals ? count.toFixed(decimals) : Math.floor(count).toLocaleString()}</span>;
};

const Stats: React.FC<StatsProps> = ({ data }) => {
  return (
    <section className="my-20 md:my-24">
      <div className="relative bg-fixed bg-cover bg-center rounded-2xl shadow-lg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
        <div className="absolute inset-0 bg-slate-900/50 dark:bg-black/70 rounded-2xl"></div>
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center p-8 md:p-16">
          {data.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <p className="text-4xl md:text-6xl font-bold">
                <CountUp end={stat.value} decimals={stat.decimals} />{stat.suffix}
              </p>
              <p className="mt-2 text-md md:text-lg text-slate-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;