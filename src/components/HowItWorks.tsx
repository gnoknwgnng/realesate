import React from 'react';
import { Search, ListChecks, Calendar, Key, ArrowRight } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';

export const HowItWorks: React.FC = () => {
  const { setCurrentView, openConciergeModal } = useProperties();

  const steps = [
    {
      step: '01',
      icon: Search,
      title: 'Hospital-Centred Search',
      description:
        'Select your hospital, department, or medical college. Filter by peak-hour 8:00 AM transit times and essential workday amenities.',
    },
    {
      step: '02',
      icon: ListChecks,
      title: 'Curated Verified Shortlist',
      description:
        'Review residences audited for acoustic noise levels (<42 dB), 100% DG generator backup, and clear title documentation.',
    },
    {
      step: '03',
      icon: Calendar,
      title: 'Shift-Friendly Accompanied Viewing',
      description:
        'Tour on your schedule—including evening post-call slots and Sunday mornings. A MedProperties specialist accompanies you with keys ready.',
    },
    {
      step: '04',
      icon: Key,
      title: 'Transparent Lease & Move-In',
      description:
        'Standardised doctor-friendly agreements with transparent security deposits, verified landlord credentials, and move-in support.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[#008374]">
              Guided Relocation Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0A2540] tracking-tight mt-1">
              How MedProperties guides <span className="font-serif italic font-normal">your relocation.</span>
            </h2>
            <p className="text-sm text-slate-500 max-w-xl mt-1.5 leading-relaxed">
              Designed from first principles to save medical professionals dozens of hours of unnecessary viewing and negotiation.
            </p>
          </div>

          <button
            onClick={openConciergeModal}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#008374] hover:text-[#0A2540] transition-colors cursor-pointer"
          >
            <span>Speak with a relocation specialist</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Steps Timeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-2xl font-mono font-bold text-slate-300">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-[#008374]">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[#0A2540] mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Step {idx + 1} of 4</span>
                  <span className="text-[#008374] font-semibold">Assisted</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reassuring Concierge Banner */}
        <div className="mt-12 bg-[#0A2540] text-white rounded-3xl p-8 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#008374]">
              Discreet Relocation Assistance
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Relocating to a new city for residency or practice?
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Our specialists coordinate multi-city transitions across Bengaluru, Delhi NCR, Mumbai, Hyderabad, and Chennai. Let us prepare your home before your first clinical rotation begins.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
            <button
              onClick={() => {
                setCurrentView('explore');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 transition-colors text-center cursor-pointer"
            >
              Browse Available Homes
            </button>
            <button
              onClick={openConciergeModal}
              className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-[#008374] hover:bg-[#007063] transition-colors text-center cursor-pointer shadow-md"
            >
              Request Relocation Concierge
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
