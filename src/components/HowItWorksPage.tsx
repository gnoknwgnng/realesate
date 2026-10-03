import React, { useState } from 'react';
import { useProperties } from '../context/PropertyContext';
import {
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight,
  PhoneCall,
  Search,
  CheckCircle2,
  FileCheck,
  Zap,
  VolumeX,
  Key,
  Calendar,
  Sparkles,
  Layers,
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const { setCurrentView, openConciergeModal } = useProperties();
  const [activeStage, setActiveStage] = useState<number>(0);

  const stages = [
    {
      step: 'Stage 01',
      title: 'Hospital Corridor & Commute Perimeter Mapping',
      desc: 'We start by pinning your hospital center, department rotation, and call frequency. Instead of radial distance, we calculate real peak-hour drive and metro durations specifically at 8:00 AM clinical handover time.',
      metrics: ['Peak 8 AM transit telemetry', 'Casualty gate access mapping', 'Metro corridor alignment'],
      icon: Clock,
    },
    {
      step: 'Stage 02',
      title: 'Physical In-Person Verification & Acoustic Audit',
      desc: 'Our Bangalore, Delhi, Mumbai, Hyderabad, and Chennai field teams inspect the residence before listing. We measure daytime master-suite ambient decibels, test 100% DG generator switchover under load, and review municipal title records.',
      metrics: ['<42 dB quiet-sleep rating', '100% DG power transfer under 10s', 'Municipal title & society NOC vetting'],
      icon: ShieldCheck,
    },
    {
      step: 'Stage 03',
      title: 'Shift-Friendly Accompanied Walkthroughs',
      desc: 'Medical duties do not match standard 10 AM – 5 PM agent hours. Our private client specialist coordinates viewing keys around your duty schedule, including 7:00 PM – 9:00 PM post-OPD slots and Sunday mornings.',
      metrics: ['Pre-cleared gate RFID entry', '7-9 PM evening tour slots', 'Zero unsolicited broker calls'],
      icon: Calendar,
    },
    {
      step: 'Stage 04',
      title: 'Medical Diplomatic Lease & Turnkey Relocation',
      desc: 'We standardize doctor-friendly lease agreements featuring fair 1-month break clauses for government rotational postings or fellowship transfers, transparent deposit terms, and turnkey move-in concierge.',
      metrics: ['Rotational transfer break clauses', 'Direct landlord negotiation', 'Move-in utility and fiber setup'],
      icon: Key,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFC] pb-24 text-stone-800">
      
      {/* Editorial Luxury Header */}
      <section className="bg-[#09131F] text-white pt-16 pb-20 relative overflow-hidden border-b border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs uppercase tracking-widest font-bold text-[#008374]">
              Relocation Methodology
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight text-white leading-tight">
              A transparent, doctor-first <br />
              <span className="text-[#008374] font-serif italic font-normal">housing journey.</span>
            </h1>
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal max-w-2xl">
              From residency matching and superspecialty fellowship transfers to department chair appointments, we eliminate the friction of commute uncertainty, deceptive photos, and inflexible viewing hours.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive 4-Stage Deep Dive */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-2.5">
          <span className="text-xs uppercase tracking-widest font-bold text-[#008374]">
            End-to-End Methodology
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#09131F]">
            The 4 pillars of your relocation journey
          </h2>
          <p className="text-sm sm:text-base text-stone-500 leading-relaxed font-normal">
            Click each stage to explore how MedProperties validates every home before you ever step inside.
          </p>
        </div>

        {/* Stage Navigation Pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stages.map((stg, i) => (
            <button
              key={i}
              onClick={() => setActiveStage(i)}
              className={`p-5 rounded-3xl text-left border transition-all cursor-pointer ${
                activeStage === i
                  ? 'bg-[#09131F] text-white border-[#09131F] shadow-lg scale-102'
                  : 'bg-white text-stone-700 border-stone-200/80 hover:bg-stone-50'
              }`}
            >
              <span className={`text-xs font-mono font-bold block mb-1 ${activeStage === i ? 'text-[#008374]' : 'text-stone-400'}`}>
                {stg.step}
              </span>
              <h4 className="text-sm font-bold font-serif leading-snug line-clamp-2">
                {stg.title}
              </h4>
            </button>
          ))}
        </div>

        {/* Active Stage Featured Detail Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/80 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-mono font-bold text-[#008374] bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                {stages[activeStage].step} Detail Protocol
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-[#09131F]">
                {stages[activeStage].title}
              </h3>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
                {stages[activeStage].desc}
              </p>

              <div className="space-y-2.5 pt-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Substantiated Standards
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {stages[activeStage].metrics.map((m, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-stone-700 bg-stone-50 p-2.5 rounded-xl border border-stone-200/60">
                      <CheckCircle2 className="w-4 h-4 text-[#008374] shrink-0" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-stone-50 rounded-2xl p-8 border border-stone-200/70 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-[#008374]">
                  {React.createElement(stages[activeStage].icon, { className: 'w-6 h-6' })}
                </div>
                <div>
                  <h4 className="text-base font-bold font-serif text-[#09131F]">Physician Reassurance</h4>
                  <p className="text-xs text-stone-500">Zero broker harassment guarantee</p>
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                Your contact details are encrypted and handled exclusively by our private relocation desk. No syndication to unverified third-party property brokers.
              </p>

              <button
                onClick={openConciergeModal}
                className="w-full py-3.5 rounded-xl bg-[#008374] hover:bg-[#007063] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Talk Through Your Move</span>
              </button>
            </div>
          </div>
        </div>

      </section>

      {/* City Hub Relocation Coverage */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/80 shadow-xs space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs uppercase tracking-widest font-bold text-[#008374]">
              Active Clinical Corridors
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#09131F]">
              Relocation coverage across India's premier hospital corridors
            </h2>
            <p className="text-sm text-stone-500 leading-relaxed font-normal">
              Our on-ground field specialists operate dedicated inspection routes across these metropolitan medical hubs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                city: 'Bengaluru',
                hospitals: 'Manipal Hospital (HAL & Whitefield), St. John’s Medical College, Narayana Health, Aster CMI',
                features: 'Purple & Green Metro corridor alignments, Old Airport Road acoustic audits',
              },
              {
                city: 'Delhi NCR',
                hospitals: 'AIIMS New Delhi, Safdarjung, Max Super Speciality Saket, Fortis Memorial Gurugram, Medanta',
                features: 'Yellow line & Rapid Metro connectivity, South Delhi & DLF Phase residences',
              },
              {
                city: 'Mumbai',
                hospitals: 'Lilavati Hospital Bandra, Hinduja Mahim, Tata Memorial Parel, Kokilaben Dhirubhai Ambani',
                features: 'Coastal Road & Western Line access, Bandra West & Lower Parel vetted towers',
              },
              {
                city: 'Hyderabad',
                hospitals: 'Apollo Hospitals Jubilee Hills, Yashoda Secunderabad, KIMS Hospitals Gachibowli',
                features: 'ORR proximity, quiet gated enclaves in Jubilee Hills and Financial District',
              },
              {
                city: 'Chennai',
                hospitals: 'Apollo Hospitals Greams Road, MGM Healthcare, MIOT International, SIMS Hospital',
                features: 'Nungambakkam & Anna Nagar residential sanctuaries with 100% DG backup',
              },
            ].map((hub, idx) => (
              <div
                key={idx}
                className="bg-stone-50 rounded-2xl p-6 border border-stone-200/70 space-y-2.5"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#008374]" />
                  <h3 className="text-base font-bold font-serif text-[#09131F]">{hub.city}</h3>
                </div>
                <p className="text-xs text-stone-700 leading-snug">
                  <strong>Key Hubs:</strong> {hub.hospitals}
                </p>
                <p className="text-xs text-stone-500 pt-2 border-t border-stone-200/60 font-mono">
                  {hub.features}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-stone-100">
            <p className="text-xs text-stone-500">
              Need relocation assistance for a medical campus not listed above?
            </p>
            <button
              onClick={openConciergeModal}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#008374] text-white text-xs font-bold hover:bg-[#007063] transition-colors shadow-md cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Request Custom Corridor Sourcing</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
