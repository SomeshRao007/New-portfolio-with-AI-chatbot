import React, { useMemo } from 'react';
import type { Testimonial } from '../types';
import { StaggerTestimonials } from './ui/stagger-testimonials';

type TestimonialsProps = {
  data: Testimonial[];
};

const Testimonials: React.FC<TestimonialsProps> = ({ data }) => {

  const animationData = useMemo(() => data.concat(data).concat(data).map((t, index) => ({
    tempId: index,
    testimonial: t.quote,
    author: t.author,
    role: t.role,
    company: t.company,
    imgSrc: t.imgSrc
  })), [data]);

  return (
    <section className="py-20 md:py-24 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">Testimonials</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mt-2">What Others Say</h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Feedback from clients and colleagues I've had the pleasure of working with.
          </p>
        </div>

        <div className="w-full">
           <StaggerTestimonials items={animationData} />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;