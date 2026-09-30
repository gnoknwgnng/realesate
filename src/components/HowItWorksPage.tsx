import React from 'react';
import { useProperties } from '../context/PropertyContext';
import { HowItWorks } from './HowItWorks';
import { WhyMedProperties } from './WhyMedProperties';
import { ShieldCheck, MapPin, Clock, ArrowRight, PhoneCall } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const { setCurrentView, openConciergeModal } = useProperties();

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      
      {/* Header */}
      <section className="bg-[#0A2540] text-white pt-14 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs uppercase tracking-widest font-bold text-[#008374]">
              Relocation Methodology
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              A transparent, doctor-first <br />
              <span className="text-[#008374] font-serif italic font-normal">housing journey.</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              From fellowship transitions to senior consultant appointments, we handle the friction of city transfers, commute validation, and lease documentation.
            </p>
          </div>
        </div>
      </section>

      {/* Main How it Works component */}
      <HowItWorks />

      {/* Why MedProperties 4 Pillars */}
      <WhyMedProperties />

      {/* City Hub Relocation Coverage */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs uppercase tracking-widest font-bold text-[#008374]">
              Active Clinical Hubs
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0A2540]">
              Relocation coverage across India's premier hospital corridors
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Our on-ground field specialists operate dedicated inspection routes across these metropolitan medical corridors.
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
                className="bg-slate-50 rounded-2xl p-5 border border-slate-200/70 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#008374]" />
                  <h3 className="text-base font-bold text-[#0A2540]">{hub.city}</h3>
                </div>
                <p className="text-xs text-slate-700 leading-snug">
                  <strong>Key Hubs:</strong> {hub.hospitals}
                </p>
                <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                  {hub.features}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Need assistance for a hospital corridor not listed above?
            </p>
            <button
              onClick={openConciergeModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#008374] text-white text-xs font-bold hover:bg-[#007063] transition-colors cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Request Custom Corridor Sourcing</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
