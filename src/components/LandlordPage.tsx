import React from 'react';
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
} from 'lucide-react';

export const LandlordPage: React.FC = () => {
  const { setIsAddModalOpen, openAuthModal, user, setCurrentView } = useProperties();

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
        'Connect with verified doctors, surgeons, senior residents, and healthcare leadership who value quiet, well-maintained homes close to their hospital.',
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
    <div className="min-h-screen bg-slate-50/70 pb-20">
      
      {/* Hero Section */}
      <section className="bg-[#0A2540] text-white pt-16 pb-20 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-teal-300">
              <Building2 className="w-3.5 h-3.5" />
              <span>MedProperties Landlord Network</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              List your property for India’s <br />
              <span className="text-[#008374] font-serif italic font-normal">healthcare community.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              We connect owners of quality residential spaces near major medical hubs with doctors seeking quiet, dependable homes. No broad cold calling or unvetted walk-ins.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={handleStartListing}
                className="px-6 py-3.5 rounded-2xl bg-[#008374] hover:bg-[#007063] text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>List a Property for Audit</span>
              </button>

              {user ? (
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  Go to Landlord Dashboard
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  Sign in to View Listings
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mb-12">
          <span className="text-xs uppercase tracking-widest font-bold text-[#008374]">
            Why Landlords Choose Us
          </span>
          <h2 className="text-3xl font-bold text-[#0A2540] tracking-tight mt-1">
            Built for peace of mind, not high volume.
          </h2>
          <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
            We avoid unqualified guarantees of 100% placement or instant rent. Instead, we provide rigorous verification, dignified tenant matching, and transparent communication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {landlordBenefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-[#008374]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#0A2540]">{b.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {b.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4-Step Listing Journey */}
      <section className="bg-white border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs uppercase tracking-widest font-bold text-[#008374]">
              Guided Listing Flow
            </span>
            <h2 className="text-3xl font-bold text-[#0A2540] tracking-tight mt-1">
              From submission to verified listing.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {listingSteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200/70 space-y-3"
              >
                <span className="text-2xl font-mono font-bold text-slate-300">
                  {step.step}
                </span>
                <h3 className="text-base font-bold text-[#0A2540]">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Action CTA */}
          <div className="mt-12 text-center">
            <button
              onClick={handleStartListing}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#008374] hover:bg-[#007063] text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-md cursor-pointer"
            >
              <span>Start Listing Your Property</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Landlord FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest font-bold text-[#008374]">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0A2540]">
            Landlord inquiries answered
          </h2>
        </div>

        <div className="space-y-4 pt-4">
          {[
            {
              q: 'Who can list properties on MedProperties?',
              a: 'Individual property owners, certified builders, and institutional property managers whose homes are situated within reasonable commute radius (typically under 30 minutes) of major hospital centers in Bengaluru, Delhi NCR, Mumbai, Hyderabad, or Chennai.',
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
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2"
            >
              <h3 className="text-sm font-bold text-[#0A2540] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#008374] shrink-0" />
                {faq.q}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 pl-6 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
