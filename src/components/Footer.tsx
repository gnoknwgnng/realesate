import React from 'react';
import { useProperties } from '../context/PropertyContext';
import { ShieldCheck, PhoneCall, Heart, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, setFilters, openConciergeModal } = useProperties();

  const navigateTo = (view: any, tab?: 'rent' | 'buy') => {
    if (tab) {
      setFilters((prev) => ({ ...prev, tab }));
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0A2540] text-slate-300 border-t border-slate-800 pt-16 pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Brand & Reassurance Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-12 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="MedProperties"
                className="h-9 w-auto object-contain brightness-0 invert"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="text-xl font-bold tracking-tight text-white">
                MedProperties
              </span>
            </div>
            <p className="text-xs text-slate-400">
              India's verified real estate and relocation network for healthcare professionals.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={openConciergeModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#008374] hover:bg-[#007063] text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Talk to a specialist</span>
            </button>
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white transition-colors cursor-pointer"
              title="Return to top"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 5 Column Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 py-12">
          
          {/* Explore Homes */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Explore Homes
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => navigateTo('explore', 'rent')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Verified Hospital Rentals
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('buy', 'buy')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Doctor Home Purchases
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilters((p) => ({ ...p, city: 'Bengaluru' }));
                    navigateTo('explore', 'rent');
                  }}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Bengaluru Medical Corridors
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilters((p) => ({ ...p, city: 'Delhi NCR' }));
                    navigateTo('explore', 'rent');
                  }}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Delhi NCR & Gurugram Hubs
                </button>
              </li>
            </ul>
          </div>

          {/* For Landlords */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              For Landlords
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => navigateTo('landlord')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  List a Property
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('landlord')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Physical Audit Process
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('landlord')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Doctor Tenant Standards
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('dashboard')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Owner Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Relocation & How It Works */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Relocation
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => navigateTo('how-it-works')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  4-Step Guided Process
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('how-it-works')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Shift-Friendly Viewings
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('resources')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Healthcare Relocation Guide
                </button>
              </li>
              <li>
                <button
                  onClick={openConciergeModal}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Talk Through Your Move
                </button>
              </li>
            </ul>
          </div>

          {/* Financing */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Financing & Loans
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => navigateTo('financing')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Physician EMI Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('financing')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Doctor Loan Underwriting
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('financing')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  90% LTV Special Programs
                </button>
              </li>
              <li>
                <button
                  onClick={openConciergeModal}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Schedule Advisory Session
                </button>
              </li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Trust & Legal
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => navigateTo('resources')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Verification Standard
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('resources')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Privacy & Data Protection
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('resources')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Platform Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('resources')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Frequently Asked Questions
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 MedProperties Technologies India Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Bengaluru</span>
            <span>•</span>
            <span>Delhi NCR</span>
            <span>•</span>
            <span>Mumbai</span>
            <span>•</span>
            <span>Hyderabad</span>
            <span>•</span>
            <span>Chennai</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
