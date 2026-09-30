import React, { useState } from 'react';
import { TESTIMONIALS } from '../lib/mockData';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section id="testimonials-section" className="py-20 bg-white text-center relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header matching ui.pdf */}
        <div className="space-y-1.5">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A2540] tracking-tight">
            Testimonials
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-normal">
            See what our property managers, landlords, and tenants have to say
          </p>
        </div>

        {/* Quote matching ui.pdf with subtle slide transition */}
        <div className="pt-2 max-w-3xl mx-auto space-y-6">
          <blockquote className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium min-h-[64px] flex items-center justify-center">
            "{current.quote}"
          </blockquote>

          {/* Author info matching ui.pdf */}
          <div className="flex flex-col items-center space-y-2">
            <div className="relative">
              <img
                src={current.avatar}
                alt={current.author}
                className="w-14 h-14 rounded-full object-cover shadow-sm border border-slate-100"
              />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">{current.author}</h4>
              <p className="text-[11px] text-slate-400">{current.role}</p>
            </div>
          </div>

          {/* Carousel controls matching clean aesthetic */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={prevTestimonial}
              className="p-1.5 rounded-full border border-slate-200 text-slate-400 hover:text-[#008374] hover:border-[#008374] transition-colors cursor-pointer"
              title="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx ? 'w-5 bg-[#008374]' : 'w-1.5 bg-slate-200 hover:bg-slate-300'
                  }`}
                  title={`View testimonial ${idx + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={nextTestimonial}
              className="p-1.5 rounded-full border border-slate-200 text-slate-400 hover:text-[#008374] hover:border-[#008374] transition-colors cursor-pointer"
              title="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
