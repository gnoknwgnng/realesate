import React from 'react';
import { useProperties } from '../context/PropertyContext';
import { Key, Home, IndianRupee } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const { setIsMortgageModalOpen, setInfoModalType } = useProperties();

  const handleHouseClick = () => {
    const el = document.getElementById('properties-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column matching ui.pdf */}
          <div className="lg:col-span-6 space-y-8">
            
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0A2540] leading-tight tracking-tight">
                Residential Real <br />
                Estate Tailored to a <br />
                Doctor's Lifestyle
              </h2>
              <p className="text-sm sm:text-base text-slate-400 font-normal max-w-md">
                Find your dream place to live in with <br className="hidden sm:inline" />
                more than 10k+ properties listed.
              </p>
            </div>

            {/* 3 Metric Columns matching ui.pdf */}
            <div className="grid grid-cols-3 gap-6 pt-4">
              <div>
                <span className="text-3xl sm:text-4xl font-extrabold text-[#008374] block tracking-tight">
                  7.4%
                </span>
                <span className="text-xs text-slate-500 font-medium mt-1.5 block leading-snug">
                  Property Return Rate
                </span>
              </div>

              <div>
                <span className="text-3xl sm:text-4xl font-extrabold text-[#008374] block tracking-tight">
                  3,856
                </span>
                <span className="text-xs text-slate-500 font-medium mt-1.5 block leading-snug">
                  Property in Sell & Rent
                </span>
              </div>

              <div>
                <span className="text-3xl sm:text-4xl font-extrabold text-[#008374] block tracking-tight">
                  2,540
                </span>
                <span className="text-xs text-slate-500 font-medium mt-1.5 block leading-snug">
                  Daily Completed Transactions
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Looping Track with 3 Interactive Circular Nodes matching ui.pdf */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-[440px] h-[320px] flex items-center justify-center">
              
              {/* Smooth Curved Loop SVG track matching ui.pdf */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 440 320" fill="none">
                <path
                  d="M 60,200 C 120,80 240,60 320,120 C 390,170 360,270 260,260 C 170,250 160,180 210,140 C 270,90 380,120 400,200"
                  stroke="#008374"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {/* Node 1: Green icon with Key (Left) - Relocation Guide */}
              <button
                type="button"
                onClick={() => setInfoModalType('relocation')}
                className="absolute left-8 bottom-16 w-14 h-14 rounded-full bg-white shadow-xl border border-slate-100 flex items-center justify-center z-10 hover:scale-110 transition-transform cursor-pointer group"
                title="View Healthcare Relocation Checklist"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#008374] flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                  <Key className="w-5 h-5" />
                </div>
              </button>

              {/* Node 2: Teal icon with House (Center) - Browse Properties */}
              <button
                type="button"
                onClick={handleHouseClick}
                className="absolute top-16 left-48 w-16 h-16 rounded-full bg-white shadow-xl border border-slate-100 flex items-center justify-center z-10 hover:scale-110 transition-transform cursor-pointer group"
                title="Browse Verified Doctor Homes"
              >
                <div className="w-12 h-12 rounded-full bg-teal-50 text-[#008374] flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                  <Home className="w-6 h-6" />
                </div>
              </button>

              {/* Node 3: Rupee icon (Right/Bottom) - Doctor Home Loan EMI Calculator */}
              <button
                type="button"
                onClick={() => setIsMortgageModalOpen(true)}
                className="absolute right-12 bottom-12 w-14 h-14 rounded-full bg-white shadow-xl border border-slate-100 flex items-center justify-center z-10 hover:scale-110 transition-transform cursor-pointer group"
                title="Launch Doctor Home Loan EMI Calculator"
              >
                <div className="w-10 h-10 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-100 transition-colors">
                  <IndianRupee className="w-5 h-5" />
                </div>
              </button>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
