import React from 'react';
import { ShieldCheck, Clock, CalendarCheck, FileCheck, VolumeX, Zap } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';

export const WhyMedProperties: React.FC = () => {
  const { openConciergeModal, setCurrentView } = useProperties();

  const pillars = [
    {
      icon: ShieldCheck,
      title: 'Physical In-Person Verification',
      description:
        'Every listed property undergoes physical field inspection. We verify owner title, test 100% DG power backup under load, measure bedroom noise levels (<42 dB), and document actual dimensions.',
      tag: 'Zero Unverified Listings',
    },
    {
      icon: Clock,
      title: 'Peak-Hour Hospital Commute Calibrated',
      description:
        'We calculate drive and metro transit durations specifically at 8:00 AM peak clinical handover times, not deceptive straight-line distances. Know your real commute before visiting.',
      tag: '8:00 AM Shift Timing',
    },
    {
      icon: CalendarCheck,
      title: 'Shift-Friendly Accompanied Viewings',
      description:
        'Tours scheduled around rotation hours, including 7:00 PM – 9:00 PM evening slots and weekend mornings. A dedicated concierge collects keys and coordinates building access.',
      tag: 'Flexible Timings',
    },
    {
      icon: FileCheck,
      title: 'Specialized Doctor Mortgage Guidance',
      description:
        'Mortgage advisory recognizing clinical fellowship earnings, consultant retainers, and private OPD revenue—enabling fast-track loan sanctions with preferential institutional terms.',
      tag: 'Doctor Mortgage Advisory',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-[#008374]">
            Why MedProperties
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0A2540] tracking-tight mt-1.5">
            A more considered way to find a home <br className="hidden sm:inline" />
            <span className="font-serif italic font-normal">close to care.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-2 leading-relaxed">
            Medical practitioners have demanding hours, rigorous documentation, and no time for deceptive listings or endless broker calls. We created an architectural standard designed for your reality.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/70 hover:border-slate-300 hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-[#008374]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#0A2540] leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200/60 text-[11px] font-mono text-slate-400">
                  Standard 0{idx + 1}
                </div>
              </div>
            );
          })}
        </div>

        {/* Verification Definition Callout Panel */}
        <div className="mt-12 bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1 max-w-2xl">
            <h4 className="text-sm sm:text-base font-bold text-[#0A2540]">
              What does "Verified" mean on MedProperties?
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Every home bearing the MedProperties Verified badge has been physically inspected by our field team. We verify ownership documentation, measure acoustic levels, confirm 100% DG generator backup, and validate actual transit times to nearby hospital hubs.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setCurrentView('resources');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#0A2540] bg-white border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
            >
              Read Verification Policy
            </button>
            <button
              onClick={openConciergeModal}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#008374] hover:bg-[#007063] transition-colors cursor-pointer shadow-xs"
            >
              Talk through your move
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
