import React, { useState } from 'react';
import { useProperties } from '../context/PropertyContext';
import { X, HelpCircle, FileText, Shield, Info, Phone, Mail, ChevronDown, CheckCircle2 } from 'lucide-react';

export type InfoModalType = 'faq' | 'relocation' | 'about' | 'terms' | 'privacy' | 'contact' | 'trust' | null;

export const GeneralInfoModal: React.FC = () => {
  const { infoModalType, setInfoModalType } = useProperties();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  if (!infoModalType) return null;

  const faqs = [
    {
      q: 'How do Doctor Home Loans work in India?',
      a: 'Specialized Doctor Home Loans offered by leading Indian banks (such as SBI, HDFC Bank, and ICICI Bank) provide preferential interest rates (starting ~8.50%), concessions on processing charges, high loan-to-value limits, and relaxed eligibility metrics customized for MBBS, MD, MS, DM, and DNB physicians.'
    },
    {
      q: 'Can junior residents and DNB postgraduates apply before joining?',
      a: 'Yes! Partner banking channels process home loan sanctions and lease agreements based on institutional appointment letters and NEET-PG / DNB counseling seat allotment letters up to 60 days before reporting.'
    },
    {
      q: 'How does the Guaranteed Landlord Placement program work?',
      a: 'We work directly with premier hospital administrations (AIIMS, Manipal, Apollo, Max, Fortis) to place attending consultants and postgraduate fellows into verified homes, ensuring 100% on-time rent payment and zero vacancy downtime.'
    },
    {
      q: 'Are properties checked for hospital on-call distance?',
      a: 'Yes. Every property in our catalog includes a verified hospital commute time and emergency 15-minute radius badge.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#008374] flex items-center justify-center">
              {infoModalType === 'faq' && <HelpCircle className="w-5 h-5" />}
              {infoModalType === 'relocation' && <FileText className="w-5 h-5" />}
              {infoModalType === 'about' && <Info className="w-5 h-5" />}
              {infoModalType === 'trust' && <Shield className="w-5 h-5" />}
              {infoModalType === 'contact' && <Phone className="w-5 h-5" />}
              {(infoModalType === 'terms' || infoModalType === 'privacy') && <FileText className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0A2540]">
                {infoModalType === 'faq' && 'Frequently Asked Questions'}
                {infoModalType === 'relocation' && 'Healthcare Relocation Guide'}
                {infoModalType === 'about' && 'About MedProperties'}
                {infoModalType === 'trust' && 'Trust & Safety Standards'}
                {infoModalType === 'contact' && 'Contact Concierge Team'}
                {infoModalType === 'terms' && 'Terms of Service'}
                {infoModalType === 'privacy' && 'Privacy Policy'}
              </h3>
              <p className="text-xs text-slate-500">MedProperties Healthcare Real Estate Network</p>
            </div>
          </div>
          <button
            onClick={() => setInfoModalType(null)}
            className="p-1.5 rounded-full border border-slate-200 text-slate-400 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs text-slate-600 leading-relaxed">
          
          {/* FAQ Modal */}
          {infoModalType === 'faq' && (
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    className="w-full p-3.5 text-left font-bold text-slate-800 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaqIndex === index ? 'rotate-180 text-[#008374]' : ''}`} />
                  </button>
                  {openFaqIndex === index && (
                    <div className="p-3.5 pt-0 text-slate-600 text-xs border-t border-slate-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Relocation Guide */}
          {infoModalType === 'relocation' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 text-sm">Residency & Fellowship Transition Checklist</h4>
              <p>Relocating for medical training or an attending position requires timing that aligns with hospital contracts.</p>
              
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#008374] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800">1. On-Call Proximity Radius:</strong> Confirm your property is under 15-20 minutes travel time from the emergency trauma center.
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#008374] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800">2. Night-Shift Sleep Quality:</strong> Look for homes with acoustic glazing and master bedroom blackout capability.
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#008374] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800">3. Flexible Fellowship Terms:</strong> Seek leases offering break clauses or fellow-to-fellow transfers in July.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* About MedProperties */}
          {infoModalType === 'about' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 text-sm">Founded by Doctors, Built for Those Who Care</h4>
              <p>
                MedProperties was founded by practicing physicians who experienced firsthand the hurdles of relocating during demanding residency schedules and securing mortgages with deferred student loans.
              </p>
              <p>
                Today, our network serves thousands of residents, fellows, surgeons, and healthcare professionals nationwide with specialized housing and verified landlord partnerships.
              </p>
            </div>
          )}

          {/* Contact Us */}
          {infoModalType === 'contact' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 text-sm">Get in Touch with our Physician Concierge</h4>
              <p>Our dedicated advisors are available 24/7 to accommodate surgical schedules and on-call rotations.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href="tel:+9118002003627"
                  className="p-4 bg-slate-50 hover:bg-emerald-50 rounded-2xl border border-slate-100 hover:border-emerald-200 flex items-center gap-3 transition-colors cursor-pointer group"
                >
                  <Phone className="w-5 h-5 text-[#008374]" />
                  <div>
                    <span className="font-bold text-slate-800 block text-xs group-hover:text-[#008374]">Direct Concierge</span>
                    <span className="text-slate-500 text-[11px]">+91 1800 200 3627</span>
                  </div>
                </a>
                <a
                  href="mailto:care@medproperties.com"
                  className="p-4 bg-slate-50 hover:bg-emerald-50 rounded-2xl border border-slate-100 hover:border-emerald-200 flex items-center gap-3 transition-colors cursor-pointer group"
                >
                  <Mail className="w-5 h-5 text-[#008374]" />
                  <div>
                    <span className="font-bold text-slate-800 block text-xs group-hover:text-[#008374]">Concierge Email</span>
                    <span className="text-slate-500 text-[11px]">care@medproperties.com</span>
                  </div>
                </a>
              </div>
            </div>
          )}

          {/* Trust & Safety */}
          {infoModalType === 'trust' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 text-sm">Our Verification & Security Protocol</h4>
              <p>Every landlord listing is verified through public deed records and our hospital network standards.</p>
              <ul className="space-y-1.5 list-disc pl-4 text-slate-600">
                <li>Strict background and deed verification for all property managers</li>
                <li>Data secured with Supabase PostgreSQL Row Level Security (RLS)</li>
                <li>Guaranteed security deposits and transparent physician-backed escrow</li>
              </ul>
            </div>
          )}

          {/* Terms & Privacy */}
          {(infoModalType === 'terms' || infoModalType === 'privacy') && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 text-sm">
                {infoModalType === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
              </h4>
              <p>
                MedProperties respects the confidentiality and demanding privacy requirements of healthcare providers. We do not sell your personal data or medical specialty details to third-party marketing firms.
              </p>
              <p>
                All inquiries submitted through our platform are encrypted and routed exclusively to certified property concierges.
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex justify-end">
          <button
            onClick={() => setInfoModalType(null)}
            className="px-5 py-2 bg-[#008374] text-white font-bold rounded-xl text-xs hover:bg-[#007063] transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
