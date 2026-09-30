import React, { useState } from 'react';
import { useProperties } from '../context/PropertyContext';
import { ChevronLeft, ChevronRight, Clock, ShieldCheck, Zap, ArrowRight, Bed, Maximize2 } from 'lucide-react';

export const CinematicShowcase: React.FC = () => {
  const { properties, viewPropertyDetail } = useProperties();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter curated luxury verified residences
  const showcaseList = properties.slice(0, 5);

  if (showcaseList.length === 0) return null;

  const current = showcaseList[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % showcaseList.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + showcaseList.length) % showcaseList.length);
  };

  const formattedPrice =
    current.category === 'buy'
      ? `₹${(current.price / 10000000).toFixed(2)} Cr`
      : `₹${current.price.toLocaleString('en-IN')}`;

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[#008374]">
              Verified Curations
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0A2540] tracking-tight mt-1">
              Curated residences near <span className="font-serif italic font-normal">clinical hubs.</span>
            </h2>
            <p className="text-sm text-slate-500 max-w-xl mt-1.5 leading-relaxed">
              Every home is physically audited for acoustic quietude, 100% backup generator power, and verifiable 8:00 AM hospital drive times.
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400 mr-2">
              0{currentIndex + 1} / 0{showcaseList.length}
            </span>
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-slate-300 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors shadow-xs cursor-pointer"
              aria-label="Previous showcase residence"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-slate-300 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors shadow-xs cursor-pointer"
              aria-label="Next showcase residence"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cinematic Wide Stage (Inspired by Reference 1) */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-[#0A2540] group">
          {/* Main Stage Image */}
          <div className="relative h-[480px] sm:h-[540px] lg:h-[600px] w-full overflow-hidden">
            <img
              src={current.image_url}
              alt={current.title}
              className="w-full h-full object-cover transition-all duration-700 ease-out"
            />
            {/* Deep Navy Atmospheric Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540] via-[#0A2540]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A2540]/80 via-transparent to-transparent hidden md:block" />
          </div>

          {/* Overlaid Editorial Content */}
          <div className="absolute inset-0 p-6 sm:p-10 lg:p-14 flex flex-col justify-between text-white pointer-events-none">
            
            {/* Top Status Indicators */}
            <div className="flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
              <div className="flex items-center gap-2">
                <span className="bg-[#008374] text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  MedProperties Verified
                </span>
                {current.verified_date && (
                  <span className="bg-[#0A2540]/80 backdrop-blur-md text-slate-300 text-xs px-3 py-1 rounded-full border border-white/10 font-mono">
                    Audit Date: {current.verified_date}
                  </span>
                )}
              </div>

              {current.workday_amenities && current.workday_amenities.length > 0 && (
                <div className="hidden sm:flex items-center gap-2">
                  <span className="bg-white/15 backdrop-blur-md text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#008374]" />
                    {current.workday_amenities[0]}
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Primary Details Panel */}
            <div className="max-w-2xl space-y-4 pointer-events-auto">
              {/* Commute Tag */}
              {current.commute_estimate && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-950/80 backdrop-blur-md text-[#008374] text-xs font-medium border border-teal-800/60">
                  <Clock className="w-3.5 h-3.5 text-[#008374]" />
                  <span>{current.commute_estimate}</span>
                </div>
              )}

              {/* Title & Locality */}
              <div>
                <h3 className="text-2xl sm:text-4xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
                  {current.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-300 mt-1">
                  {current.address}, {current.city}
                </p>
              </div>

              {/* Quick Specs Grid */}
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm text-slate-200">
                <div className="flex items-center gap-1.5">
                  <Bed className="w-4 h-4 text-[#008374]" />
                  <span>{current.beds} Bedrooms</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Maximize2 className="w-4 h-4 text-[#008374]" />
                  <span>{current.dimensions}</span>
                </div>
                {current.furnishing && (
                  <span className="text-slate-300 bg-white/10 px-2.5 py-0.5 rounded text-xs">
                    {current.furnishing}
                  </span>
                )}
              </div>

              {/* Pricing & CTA Row */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/15">
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-400 block font-mono">
                    {current.category === 'buy' ? 'Valuation Guide' : 'Monthly Rental'}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white">
                      {formattedPrice}
                    </span>
                    <span className="text-xs text-slate-400">
                      {current.category === 'buy' ? 'all-inclusive' : `/${current.period || 'month'}`}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => viewPropertyDetail(current)}
                  className="px-6 py-3 rounded-2xl bg-[#008374] hover:bg-[#007063] text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-lg hover:shadow-xl flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Residence</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

          {/* Bottom Slide Selectors */}
          <div className="absolute bottom-4 right-6 sm:right-10 hidden md:flex items-center gap-2 z-20">
            {showcaseList.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentIndex === i ? 'w-8 bg-[#008374]' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
