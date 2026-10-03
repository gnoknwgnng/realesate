import React, { useState } from 'react';
import { useProperties } from '../context/PropertyContext';
import {
  FileText,
  ShieldCheck,
  HelpCircle,
  Lock,
  FileCheck,
  CheckCircle2,
  ChevronDown,
  PhoneCall,
  VolumeX,
  Zap,
  Clock,
  Search,
  BadgeCheck,
  Award,
} from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  const { openConciergeModal } = useProperties();
  const [activeTab, setActiveTab] = useState<'verification' | 'relocation' | 'faq' | 'privacy' | 'terms'>('verification');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [faqSearch, setFaqSearch] = useState<string>('');

  const faqs = [
    {
      q: 'Are MedProperties homes restricted exclusively to doctors?',
      a: 'While our platform is curated specifically around healthcare requirements (hospital proximity, quiet sleep environments, shift viewings), anyone seeking verified, high-quality housing is welcome. Landlords on our network specifically prefer healthcare professionals as tenants.',
    },
    {
      q: 'Do you charge a brokerage fee to doctors renting a home?',
      a: 'We operate with complete fee transparency. Most rentals carry a standard transparent service charge for concierge viewing coordination, title vetting, and lease drafting, clearly stated before booking.',
    },
    {
      q: 'How do you measure hospital commute times?',
      a: 'We use real-time peak navigation telemetry recorded specifically at 8:00 AM on typical working weekdays between the residence and the hospital main entrance or casualty gates.',
    },
    {
      q: 'Can I view residences after 7:00 PM when my OPD ends?',
      a: 'Yes. All verified landlords on our network agree to shift-friendly viewing windows between 7:00 PM and 9:00 PM, accompanied by our concierge.',
    },
    {
      q: 'How does doctor home-loan financing work?',
      a: 'We connect buyers directly with dedicated healthcare vertical desks at partnering banks (e.g. SBI, HDFC, ICICI) that offer higher LTVs and accept clinical revenue statements without retail banking red tape.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDFDFC] pb-24 text-stone-800">
      
      {/* 2-Column Balanced Architectural Hero */}
      <section className="bg-[#09131F] text-white pt-16 pb-20 relative overflow-hidden border-b border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column (7 cols): Editorial Title */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs uppercase tracking-widest font-bold text-[#008374]">
                Knowledge & Trust Center
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold font-serif text-white tracking-tight leading-tight">
                Policies, guides & <br />
                <span className="text-[#008374] font-serif italic font-normal">verification standards.</span>
              </h1>
              <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal max-w-xl">
                Transparent operational standards for physicians, medical fellows, healthcare administrators, and participating residential landlords.
              </p>
            </div>

            {/* Right Column (5 cols): Trust Certification Seal Card */}
            <div className="lg:col-span-5 relative">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-7 border border-white/20 shadow-2xl space-y-4 text-white">
                <div className="flex items-center gap-3 pb-3 border-b border-white/15">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-[#008374] flex items-center justify-center border border-teal-500/30">
                    <Award className="w-5 h-5 text-teal-300" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold font-serif">Certified Quality Protocol</h4>
                    <p className="text-xs text-stone-300">Audited under ISO-calibrated metrics</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-stone-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#008374] shrink-0" />
                    <span>Acoustic Ambient Sleep Threshold (&lt;42 dB)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#008374] shrink-0" />
                    <span>100% Automatic Generator Transfer (&lt;10s)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#008374] shrink-0" />
                    <span>8:00 AM Rush-Hour Hospital Telemetry</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Tabs Bar */}
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 sm:space-x-4 overflow-x-auto py-3 text-xs sm:text-sm font-semibold">
            {[
              { id: 'verification', label: 'Verification Standard', icon: ShieldCheck },
              { id: 'relocation', label: 'Doctor Relocation Guide', icon: FileText },
              { id: 'faq', label: 'Frequently Asked Questions', icon: HelpCircle },
              { id: 'privacy', label: 'Privacy & Disclosures', icon: Lock },
              { id: 'terms', label: 'Terms of Platform', icon: FileCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#09131F] text-white shadow-sm font-bold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80 font-medium'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#008374]" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content Body */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        
        {/* 1. Verification Standard */}
        {activeTab === 'verification' && (
          <div className="bg-white rounded-3xl p-7 sm:p-10 border border-stone-200/80 shadow-sm space-y-8 animate-in fade-in">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest font-bold text-[#008374]">
                Audit Protocol
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#09131F]">
                The MedProperties Physical Verification Standard
              </h2>
              <p className="text-sm text-stone-500 leading-relaxed font-normal">
                Unlike mass listing aggregators where anyone can upload scraped photos, every home marked “Verified” on MedProperties has been visited in person by an authorised field specialist.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2.5">
                <div className="flex items-center gap-2 text-[#008374] font-bold text-sm">
                  <VolumeX className="w-5 h-5" />
                  <span>Acoustic Decibel Threshold (&lt;42 dB)</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  We measure ambient background sound levels in the primary sleeping quarters during daytime hours to certify suitability for post-night-call restorative sleep.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2.5">
                <div className="flex items-center gap-2 text-[#008374] font-bold text-sm">
                  <Zap className="w-5 h-5" />
                  <span>100% DG Power Backup Certification</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  We verify generator transfer time (&lt;10 seconds) and check whether high-wattage circuits, power outlets for medical research setups, and climate control are on the backup grid.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2.5">
                <div className="flex items-center gap-2 text-[#008374] font-bold text-sm">
                  <Clock className="w-5 h-5" />
                  <span>8:00 AM Morning Peak Commute Audit</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  We record actual transit times during morning peak shift hours to nearby hospitals, accounting for major bottlenecks, U-turns, and metro access.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2.5">
                <div className="flex items-center gap-2 text-[#008374] font-bold text-sm">
                  <FileCheck className="w-5 h-5" />
                  <span>Ownership Title & Documentation Vetting</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  We inspect municipal tax receipts, society NOCs, and property title proof to protect healthcare tenants from subletting disputes or premature evictions.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>Audits re-certified every 180 days or upon tenant turnover.</span>
              <button
                onClick={openConciergeModal}
                className="font-bold text-[#008374] hover:underline cursor-pointer"
              >
                Inquire about property audits →
              </button>
            </div>
          </div>
        )}

        {/* 2. Doctor Relocation Guide */}
        {activeTab === 'relocation' && (
          <div className="bg-white rounded-3xl p-7 sm:p-10 border border-stone-200/80 shadow-sm space-y-8 animate-in fade-in">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest font-bold text-[#008374]">
                Practical Playbook
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#09131F]">
                Healthcare Professional Relocation Guide
              </h2>
              <p className="text-sm text-stone-500 leading-relaxed font-normal">
                Relocating across cities for senior residency, superspecialty training (DM/MCh), or a hospital department appointment requires structured timing.
              </p>
            </div>

            <div className="space-y-6 pt-2">
              <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2">
                <h3 className="text-base font-bold font-serif text-[#09131F]">
                  1. Calibrate Your Peak Morning Commute Perimeter
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  Emergency on-call duties demand residences within 15–20 minutes at any hour. If you are doing scheduled elective surgeries, expanding to a 30-minute radius opens up larger gated communities with dedicated studies.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2">
                <h3 className="text-base font-bold font-serif text-[#09131F]">
                  2. Standard Medical Diplomatic Break Clauses
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  Ensure your lease includes a standard 1-month notice clause in case of rotational government postings or sudden fellowship transfers to another city or medical center.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2">
                <h3 className="text-base font-bold font-serif text-[#09131F]">
                  3. Use Our Turnkey Relocation Concierge
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  If you cannot visit before joining, our specialists conduct accompanied video walkthroughs, inspect society generator switchboards, and organize key collection prior to your arrival.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={openConciergeModal}
                className="px-6 py-3 rounded-2xl bg-[#008374] text-white text-xs font-bold hover:bg-[#007063] transition-colors shadow-md cursor-pointer"
              >
                Schedule Relocation Planning Call
              </button>
            </div>
          </div>
        )}

        {/* 3. Frequently Asked Questions with Animated Accordion & Search */}
        {activeTab === 'faq' && (
          <div className="bg-white rounded-3xl p-7 sm:p-10 border border-stone-200/80 shadow-sm space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-stone-100">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest font-bold text-[#008374]">
                  Help & Clarifications
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#09131F]">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#008374]"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {filteredFaqs.map((item, i) => {
                const isOpen = expandedFaq === i;
                return (
                  <div
                    key={i}
                    className="rounded-2xl border border-stone-200/80 overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setExpandedFaq(isOpen ? null : i)}
                      className="w-full text-left p-5 flex items-center justify-between gap-4 bg-stone-50/60 hover:bg-stone-50 transition-colors cursor-pointer"
                    >
                      <span className="text-sm font-bold text-[#09131F] flex items-center gap-2.5">
                        <HelpCircle className="w-4 h-4 text-[#008374] shrink-0" />
                        <span>{item.q}</span>
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-stone-400 transition-transform shrink-0 ${
                          isOpen ? 'rotate-180 text-[#008374]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-5 pt-3 bg-white text-xs sm:text-sm text-stone-600 leading-relaxed pl-11 animate-in fade-in">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. Privacy & Disclosures */}
        {activeTab === 'privacy' && (
          <div className="bg-white rounded-3xl p-7 sm:p-10 border border-stone-200/80 shadow-sm space-y-6 animate-in fade-in">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest font-bold text-[#008374]">
                Discreet & Confidential
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#09131F]">
                Privacy Policy & Doctor Data Protection
              </h2>
              <p className="text-xs text-stone-400 font-mono">
                Last updated: October 2026 • Compliant with Digital Personal Data Protection (DPDP) Act
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed pt-2">
              <p>
                <strong>1. No Public Number Broadcasting:</strong> We never sell, broadcast, or syndicate your phone number or email address to open broker WhatsApp groups or lead aggregators. Your contact details are shared strictly with your assigned MedProperties concierge.
              </p>
              <p>
                <strong>2. Medical Credential Confidentiality:</strong> Hospital affiliations and specialization details submitted for relocation verification are encrypted and utilized solely to validate eligibility for landlord partner programs.
              </p>
              <p>
                <strong>3. Tour Scheduling Privacy:</strong> Viewing requests do not reveal your personal schedule to the general public. Building gate security is provided only your name for entry clearance.
              </p>
              <p>
                <strong>4. Account Deletion:</strong> You may request complete erasure of your profile and inquiry history at any time by contacting privacy@medproperties.in.
              </p>
            </div>
          </div>
        )}

        {/* 5. Terms of Service */}
        {activeTab === 'terms' && (
          <div className="bg-white rounded-3xl p-7 sm:p-10 border border-stone-200/80 shadow-sm space-y-6 animate-in fade-in">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest font-bold text-[#008374]">
                Platform Terms
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#09131F]">
                Terms of Platform
              </h2>
              <p className="text-xs text-stone-400">
                Applicable to all renters, buyers, and listing partners.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed pt-2">
              <p>
                <strong>1. Verification Scope:</strong> The MedProperties Verified badge certifies that an authorised representative physically inspected the property on the specified audit date. It does not replace independent legal due diligence or municipal title checks before outright purchase.
              </p>
              <p>
                <strong>2. Accurate Representation:</strong> Landlords warrant that all provided details, photos, and maintenance figures are truthful. Listings found to have misleading claims or altered sound ratings are immediately suspended.
              </p>
              <p>
                <strong>3. Safe Accompanied Viewings:</strong> All scheduled tours are accompanied by MedProperties personnel. Both parties agree to professional conduct and mutual punctuality.
              </p>
            </div>
          </div>
        )}

      </main>

    </div>
  );
};
