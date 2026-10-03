import React, { useState } from 'react';
import { useProperties } from '../context/PropertyContext';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  Users,
  CalendarCheck,
  FileCheck,
  ArrowRight,
  PlusCircle,
  HelpCircle,
  Sparkles,
  Clock,
  Key,
  BadgeCheck,
} from 'lucide-react';

export const LandlordPage: React.FC = () => {
  const { setIsAddModalOpen, openAuthModal, user, setCurrentView } = useProperties();
  const [estimatedRent, setEstimatedRent] = useState<number>(65000);
  const [bhkType, setBhkType] = useState<number>(3);

  const handleStartListing = () => {
    if (!user) {
      openAuthModal('signup');
    } else {
      setIsAddModalOpen(true);
    }
  };

  const landlordBenefits = [
    {
      icon: Users,
      title: 'Verified Medical Practitioners',
      description:
        'Connect with verified doctors, surgeons, senior residents, and medical leadership who value quiet, well-maintained homes close to their hospital.',
    },
    {
      icon: CalendarCheck,
      title: 'Long-Term Predictable Leases',
      description:
        'Residency programs, fellowship tenures, and hospital appointments average 2 to 5 years, providing continuous occupancy and timely payments.',
    },
    {
      icon: ShieldCheck,
      title: 'Discreet Concierge Handling',
      description:
        'No public display of your private phone number or chaotic broker spam. Our concierge coordinates pre-vetted viewings on your schedule.',
    },
    {
      icon: FileCheck,
      title: 'Physical In-Person Verification Audit',
      description:
        'Our field team visits your residence to certify acoustic isolation, power backup, and hospital commute times—commanding higher tenant trust.',
    },
  ];

  const listingSteps = [
    {
      step: '01',
      title: 'Submit Residence Profile',
      desc: 'Enter property specifications, nearby hospital hubs, lease terms, and photographs.',
    },
    {
      step: '02',
      title: 'Physical Verification Audit',
      desc: 'Our Bangalore/Delhi/Mumbai field inspector verifies title, measures sound levels, and confirms DG backup.',
    },
    {
      step: '03',
      title: 'Published to Medical Network',
      desc: 'Your residence is featured with the MedProperties Verified badge and 8 AM commute rating.',
    },
    {
      step: '04',
      title: 'Accompanied Private Viewings',
      desc: 'We accompany interested doctors during their shift-free windows and assist with standard documentation.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFC] pb-24 text-stone-800">
      
      {/* 2-Column Balanced Architectural Hero */}
      <section className="bg-[#09131F] text-white pt-16 pb-20 relative overflow-hidden border-b border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column (7 cols): Editorial Headline & Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-teal-300">
                <Building2 className="w-3.5 h-3.5 text-[#008374]" />
                <span>MedProperties Landlord Network</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold font-serif text-white tracking-tight leading-tight">
                List your property for India’s <br />
                <span className="text-[#008374] font-serif italic font-normal">healthcare community.</span>
              </h1>

              <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal max-w-xl">
                We connect owners of residential spaces situated near hospital corridors with vetted doctors and healthcare fellows seeking quiet, dependable long-term homes.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={handleStartListing}
                  className="px-7 py-4 rounded-2xl bg-[#008374] hover:bg-[#007063] text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-lg hover:shadow-xl flex items-center gap-2.5 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>List a Property for Audit</span>
                </button>

                {user ? (
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Go to Landlord Dashboard
                  </button>
                ) : (
                  <button
                    onClick={() => openAuthModal('login')}
                    className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Sign in to View Listings
                  </button>
                )}
              </div>

              <div className="pt-4 flex items-center gap-6 text-xs text-stone-400 font-medium border-t border-white/10">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#008374]" />
                  Zero Public Number Exposure
                </span>
                <span className="flex items-center gap-1.5">
                  <BadgeCheck className="w-3.5 h-3.5 text-[#008374]" />
                  Certified Field Audit
                </span>
              </div>
            </div>

            {/* Right Column (5 cols): Visual Landlord Telemetry & Yield Card (Fills Void) */}
            <div className="lg:col-span-5 relative">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-7 border border-white/20 shadow-2xl space-y-6 text-white">
                <div className="flex items-center justify-between pb-4 border-b border-white/15">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-widest text-[#008374]">
                      Physician Tenant Metric
                    </span>
                    <h3 className="text-xl font-bold font-serif mt-0.5">
                      Tenancy Quality Standard
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
                    A+ Rated
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-xs text-stone-300 block mb-1">Average Lease Tenure</span>
                    <strong className="text-xl font-bold font-serif text-white">2.8 Years</strong>
                    <span className="text-[11px] text-stone-400 block mt-0.5 font-mono">Matched to training cycles</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-xs text-stone-300 block mb-1">Average Sourcing Time</span>
                    <strong className="text-xl font-bold font-serif text-white">48 Hours</strong>
                    <span className="text-[11px] text-stone-400 block mt-0.5 font-mono">Direct hospital match</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-teal-950/60 border border-teal-800/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-teal-200">
                    <Sparkles className="w-4 h-4 text-[#008374]" />
                    <span>Free Physical Audit Included</span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Our field inspector tests acoustic isolation, 100% DG backup transfer, and records 8:00 AM hospital drive times at no upfront cost to the owner.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mb-14">
          <span className="text-xs uppercase tracking-widest font-bold text-[#008374]">
            Why Landlords Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#09131F] tracking-tight mt-1.5">
            Built for peace of mind, not high volume.
          </h2>
          <p className="text-sm sm:text-base text-stone-500 mt-2 leading-relaxed">
            We avoid unqualified guarantees of 100% placement or instant rent. Instead, we provide rigorous verification, dignified tenant matching, and transparent communication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          {landlordBenefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-7 border border-stone-200/80 shadow-xs hover:shadow-xl hover:border-teal-700/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-[#008374]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold font-serif text-[#09131F]">{b.title}</h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                    {b.description}
                  </p>
                </div>
                <div className="pt-4 mt-6 border-t border-stone-100 text-xs font-mono text-stone-400">
                  Standard 0{idx + 1}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4-Step Listing Journey */}
      <section className="bg-stone-50/80 border-y border-stone-200/80 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <span className="text-xs uppercase tracking-widest font-bold text-[#008374]">
              Guided Listing Flow
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#09131F] tracking-tight mt-1.5">
              From submission to verified listing.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {listingSteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-7 border border-stone-200/80 shadow-xs space-y-4"
              >
                <span className="text-3xl font-mono font-bold text-stone-300">
                  {step.step}
                </span>
                <h3 className="text-lg font-bold font-serif text-[#09131F]">{step.title}</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Action CTA */}
          <div className="mt-14 text-center">
            <button
              onClick={handleStartListing}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-[#008374] hover:bg-[#007063] text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-md hover:shadow-xl cursor-pointer"
            >
              <span>Start Listing Your Property</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Landlord FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-8">
        <div className="text-center space-y-2.5">
          <span className="text-xs uppercase tracking-widest font-bold text-[#008374]">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#09131F]">
            Landlord inquiries answered
          </h2>
        </div>

        <div className="space-y-4 pt-4">
          {[
            {
              q: 'Who can list properties on MedProperties?',
              a: 'Individual property owners, certified builders, and institutional property managers whose homes are situated within a reasonable commute radius (typically under 30 minutes) of major hospital centers in Bengaluru, Delhi NCR, Mumbai, Hyderabad, or Chennai.',
            },
            {
              q: 'What is involved in the physical verification audit?',
              a: 'A MedProperties field inspector visits the premises to check title documentation, inspect and test 100% DG generator backup under load, measure master suite ambient noise levels with sound meters, and record peak 8:00 AM transit times.',
            },
            {
              q: 'Are there exclusive listing requirements?',
              a: 'No, MedProperties operates on a non-exclusive basis. However, verified properties receive prioritized placement across our doctor network.',
            },
            {
              q: 'How are viewings managed?',
              a: 'Our concierge coordinates viewing requests around doctor shift windows (such as evening 7–9 PM slots or weekends). All viewings are accompanied by a MedProperties specialist.',
            },
          ].map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-2.5"
            >
              <h3 className="text-sm font-bold text-[#09131F] flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-[#008374] shrink-0" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 pl-6 leading-relaxed font-normal">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
