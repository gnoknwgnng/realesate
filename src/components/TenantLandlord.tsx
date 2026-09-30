import React, { useState } from 'react';
import { useProperties } from '../context/PropertyContext';
import { Video, Home, ChevronRight } from 'lucide-react';

export const TenantLandlord: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tenants' | 'landlords'>('tenants');
  const {
    setIsSellModalOpen,
    setFilters,
    properties,
    setSelectedProperty,
    setInfoModalType,
    user,
    setCurrentView,
    openAuthModal,
  } = useProperties();

  const handleSeeMore = () => {
    if (activeTab === 'landlords') {
      if (user) {
        setCurrentView('dashboard');
      } else {
        openAuthModal('login');
      }
    } else {
      setInfoModalType('relocation');
    }
  };

  const handleVirtualTourClick = () => {
    if (properties.length > 0) {
      setSelectedProperty(properties[0]);
    }
  };

  const handleFindDealClick = () => {
    setFilters((prev) => ({ ...prev, tab: 'rent' }));
    const el = document.getElementById('properties-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="doctor-section" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Collage & Floating Badges matching ui.pdf */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg">
              
              {/* Main House Image */}
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-lg shadow-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
                  alt="Doctor lifestyle residence"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Badge 1: Virtual home tour (Top-Left) - Clickable */}
              <button
                type="button"
                onClick={handleVirtualTourClick}
                className="absolute -top-4 -left-2 sm:-left-6 bg-white rounded-2xl shadow-xl shadow-slate-200/70 border border-slate-100 p-3 sm:p-4 flex items-center gap-3 text-left hover:scale-105 transition-all cursor-pointer group"
                title="Click to launch interactive virtual tour"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0 group-hover:bg-cyan-100 transition-colors">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight group-hover:text-[#008374] transition-colors">
                    Virtual home tour
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">We provide you with virtual tour</p>
                </div>
              </button>

              {/* Floating Badge 2: Find the best deal (Bottom-Right) - Clickable */}
              <button
                type="button"
                onClick={handleFindDealClick}
                className="absolute -bottom-4 -right-2 sm:-right-6 bg-white rounded-2xl shadow-xl shadow-slate-200/70 border border-slate-100 p-3 sm:p-4 flex items-center gap-3 text-left hover:scale-105 transition-all cursor-pointer group"
                title="Click to view all deals"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight group-hover:text-[#008374] transition-colors">
                    Find the best deal
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Browse thousands of properties</p>
                </div>
              </button>

            </div>
          </div>

          {/* Right Column matching ui.pdf */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Pill Switcher */}
            <div className="inline-flex p-1 bg-slate-100/90 rounded-full">
              <button
                type="button"
                onClick={() => setActiveTab('tenants')}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'tenants'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                For tenants
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('landlords')}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'landlords'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                For landlords
              </button>
            </div>

            {/* Heading matching ui.pdf exactly */}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A2540] tracking-tight leading-snug">
              We make it easy for <br />
              tenants and landlords.
            </h2>

            {/* Paragraph matching Indian healthcare context */}
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-xl">
              We specialize in Doctor Home Loans and premium residential housing across Indian healthcare hubs. Whether you are looking for a luxury 3 or 4 BHK flat near AIIMS, Manipal, or Apollo Hospitals, or a quiet gated home during your residency or consultancy, our doctor-led concierge handles the search while you focus on your patients.
            </p>

            {/* CTA Button matching ui.pdf */}
            <div className="pt-2">
              <button
                onClick={handleSeeMore}
                className="inline-flex items-center gap-1.5 px-6 py-3 bg-[#008374] hover:bg-[#007063] text-white text-sm font-bold rounded-lg shadow-sm transition-all cursor-pointer"
              >
                See more
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
