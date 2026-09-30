import React, { useState } from 'react';
import { useProperties } from '../context/PropertyContext';
import {
  FileText,
  ShieldCheck,
  HelpCircle,
  Lock,
  FileCheck,
  CheckCircle2,
  ChevronRight,
  PhoneCall,
  VolumeX,
  Zap,
  Clock,
} from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  const { openConciergeModal } = useProperties();
  const [activeTab, setActiveTab] = useState<'verification' | 'relocation' | 'faq' | 'privacy' | 'terms'>('verification');

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      
      {/* Page Header */}
      <section className="bg-[#0A2540] text-white pt-14 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs uppercase tracking-widest font-bold text-[#008374]">
              Knowledge & Trust Center
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Policies, guides & <br />
              <span className="text-[#008374] font-serif italic font-normal">verification standards.</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Transparent operational standards for doctors, healthcare administrators, and participating residential landlords.
            </p>
          </div>
        </div>
      </section>

      {/* Tabs Bar */}
      <div className="sticky top-20 z-30 bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 sm:space-x-6 overflow-x-auto py-3 text-xs sm:text-sm font-semibold">
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
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#0A2540] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content Body */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* 1. Verification Standard */}
        {activeTab === 'verification' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-8 animate-in fade-in">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest font-bold text-[#008374]">
                Audit Protocol
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0A2540]">
                The MedProperties Physical Verification Standard
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Unlike mass listing aggregators where anyone can upload scraped photos, every home marked “Verified” on MedProperties has been visited in person by an authorised field specialist.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                <div className="flex items-center gap-2 text-[#008374] font-bold text-sm">
                  <VolumeX className="w-4 h-4" />
                  <span>Acoustic Decibel Threshold (&lt;42 dB)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We measure ambient background sound levels in the primary sleeping quarters during daytime hours to certify suitability for post-night-call restorative sleep.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                <div className="flex items-center gap-2 text-[#008374] font-bold text-sm">
                  <Zap className="w-4 h-4" />
                  <span>100% DG Power Backup Certification</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We verify generator transfer time (&lt;10 seconds) and check whether high-wattage circuits, power outlets for medical research setups, and climate control are on the backup grid.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                <div className="flex items-center gap-2 text-[#008374] font-bold text-sm">
                  <Clock className="w-4 h-4" />
                  <span>8:00 AM Morning Peak Commute Audit</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We record actual transit times during morning peak shift hours to nearby hospitals, accounting for major bottlenecks, U-turns, and metro access.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                <div className="flex items-center gap-2 text-[#008374] font-bold text-sm">
                  <FileCheck className="w-4 h-4" />
                  <span>Ownership Title & Documentation Vetting</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We inspect municipal tax receipts, society NOCs, and property title proof to protect healthcare tenants from subletting disputes or premature evictions.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Audits re-certified every 180 days or upon tenant turnover.
              </span>
              <button
                onClick={openConciergeModal}
                className="text-xs font-bold text-[#008374] hover:underline"
              >
                Inquire about property audits →
              </button>
            </div>
          </div>
        )}

        {/* 2. Doctor Relocation Guide */}
        {activeTab === 'relocation' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-8 animate-in fade-in">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest font-bold text-[#008374]">
                Practical Playbook
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0A2540]">
                Healthcare Professional Relocation Guide
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Relocating across cities for senior residency, superspecialty training (DM/MCh), or a hospital department chair requires structured timing. Here is how to plan your move.
              </p>
            </div>

            <div className="space-y-6 pt-2">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                <h3 className="text-sm font-bold text-[#0A2540]">
                  1. Determine Your Primary Commute Radius
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Emergency on-call duties demand residences within 15–20 minutes at any hour. If you are doing general OPD or scheduled elective surgeries, expanding to a 30-minute radius opens up larger gated communities with dedicated studies.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                <h3 className="text-sm font-bold text-[#0A2540]">
                  2. Negotiate Standard Medical Diplomatic Clauses
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ensure your lease includes a reasonable 1-month notice clause in case of rotational government postings or sudden fellowship transfers to another city or medical center.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                <h3 className="text-sm font-bold text-[#0A2540]">
                  3. Use Our Turnkey Concierge Service
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  If you cannot visit before joining, our specialists conduct accompanied video walkthroughs, inspect society generator switchboards, and organize key collection prior to your arrival.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={openConciergeModal}
                className="px-5 py-2.5 rounded-xl bg-[#008374] text-white text-xs font-bold hover:bg-[#007063] transition-colors"
              >
                Schedule Relocation Planning Call
              </button>
            </div>
          </div>
        )}

        {/* 3. Frequently Asked Questions */}
        {activeTab === 'faq' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest font-bold text-[#008374]">
                Help & Clarifications
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0A2540]">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4 pt-4">
              {[
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
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <h3 className="text-sm font-bold text-[#0A2540] flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#008374] shrink-0" />
                    {item.q}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 pl-6 leading-relaxed">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Privacy & Disclosures */}
        {activeTab === 'privacy' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest font-bold text-[#008374]">
                Discreet & Confidential
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0A2540]">
                Privacy Policy & Doctor Data Protection
              </h2>
              <p className="text-xs text-slate-400">
                Last updated: September 2026 • Compliant with Digital Personal Data Protection (DPDP) Act
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
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
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest font-bold text-[#008374]">
                Platform Terms
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0A2540]">
                Terms of Service
              </h2>
              <p className="text-xs text-slate-400">
                Applicable to all renters, buyers, and listing partners.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
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
