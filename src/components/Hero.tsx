import React, { useState } from 'react';
import { useProperties } from '../context/PropertyContext';
import { Calendar, Bed, Bath, Maximize2 } from 'lucide-react';

export const Hero: React.FC = () => {
  const {
    filters,
    setFilters,
    properties,
    setSelectedProperty,
    setIsSellModalOpen,
    user,
    setCurrentView,
    openAuthModal,
  } = useProperties();
  const [location, setLocation] = useState('Bengaluru, Karnataka');
  const [moveInDate, setMoveInDate] = useState('');

  // The 2 preview properties from Indian dataset
  const beverlyProp = properties.find((p) => p.title.includes('Jubilee') || p.title.includes('Whitefield')) || properties[1] || properties[0];
  const tarponProp = properties.find((p) => p.title.includes('Nungambakkam') || p.title.includes('Indiranagar')) || properties[5] || properties[0];

  const handleTabClick = (tab: 'rent' | 'buy' | 'sell') => {
    if (tab === 'sell') {
      if (user) {
        setCurrentView('dashboard');
      } else {
        openAuthModal('login');
      }
    } else {
      setFilters((prev) => ({ ...prev, tab }));
      const el = document.getElementById('properties-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBrowseProperties = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      location: location === 'Bengaluru, Karnataka' ? '' : location,
      moveInDate,
    }));
    const el = document.getElementById('properties-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-6 pb-16 lg:py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column matching ui.pdf */}
          <div className="lg:col-span-7 space-y-7">
            
            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold text-[#0A2540] leading-[1.12] tracking-tight">
                Exclusive Real Estate <br />
                Solutions for <br />
                <span className="text-[#008374]">Healthcare <br className="hidden sm:inline" />Professionals</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-500 max-w-xl leading-relaxed pt-1">
                Founded by doctors, for doctors. We understand your demanding schedule and unique financing needs to help you secure the perfect home or private practice space
              </p>
            </div>

            {/* Stats Row matching ui.pdf */}
            <div className="flex items-center gap-12 pt-1">
              <div>
                <span className="text-3xl sm:text-4xl font-extrabold text-[#008374] block leading-none">
                  50k+
                </span>
                <span className="text-xs sm:text-sm font-medium text-slate-400 mt-1 block">
                  renters
                </span>
              </div>

              <div>
                <span className="text-3xl sm:text-4xl font-extrabold text-[#008374] block leading-none">
                  10k+
                </span>
                <span className="text-xs sm:text-sm font-medium text-slate-400 mt-1 block">
                  properties
                </span>
              </div>
            </div>

            {/* Search Box matching ui.pdf */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-100 p-4 sm:p-5 max-w-xl">
              
              {/* Tabs: Rent | Buy | Sell */}
              <div className="flex items-center gap-8 border-b border-slate-100 pb-3">
                {(['rent', 'buy', 'sell'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => handleTabClick(tab)}
                    className={`relative text-sm font-bold capitalize transition-colors pb-1 ${
                      filters.tab === tab ? 'text-[#008374]' : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    {tab}
                    {filters.tab === tab && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#008374] rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              {/* Controls Row */}
              <form onSubmit={handleBrowseProperties} className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                
                {/* Location */}
                <div className="flex-1 w-full text-left">
                  <span className="block text-[11px] font-semibold text-slate-400 mb-0.5">
                    Location
                  </span>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-sm font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="Bengaluru, KA">Bengaluru, Karnataka</option>
                    <option value="Mumbai, MH">Mumbai, Maharashtra</option>
                    <option value="New Delhi, DL">New Delhi / NCR</option>
                    <option value="Hyderabad, TS">Hyderabad, Telangana</option>
                    <option value="Chennai, TN">Chennai, Tamil Nadu</option>
                    <option value="">All Indian Cities</option>
                  </select>
                </div>

                {/* Vertical Divider */}
                <div className="hidden sm:block w-px h-8 bg-slate-200" />

                {/* When */}
                <div className="flex-1 w-full text-left">
                  <span className="block text-[11px] font-semibold text-slate-400 mb-0.5">
                    When
                  </span>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                    <input
                      type="date"
                      value={moveInDate}
                      onChange={(e) => setMoveInDate(e.target.value)}
                      placeholder="Select Move-in Date"
                      className="w-full bg-transparent text-xs font-semibold text-slate-700 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Browse Properties Button */}
                <div className="w-full sm:w-auto">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 bg-[#008374] hover:bg-[#007063] text-white text-sm font-bold rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer"
                  >
                    Browse Properties
                  </button>
                </div>

              </form>

            </div>

          </div>

          {/* Right Column: Visual Map & Floating Cards matching ui.pdf */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-[420px] h-[540px]">
              
              {/* Map Route SVG Illustration matching ui.pdf */}
              <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 400 520" fill="none">
                  <path
                    d="M 330,60 C 270,110 320,180 270,240 C 220,300 180,330 200,420"
                    stroke="#008374"
                    strokeWidth="3"
                    strokeDasharray="6 6"
                    strokeLinecap="round"
                  />
                  <circle cx="330" cy="60" r="14" fill="#008374" fillOpacity="0.2" />
                  <circle cx="330" cy="60" r="7" fill="#008374" />
                  
                  <circle cx="270" cy="240" r="16" fill="#008374" fillOpacity="0.2" />
                  <circle cx="270" cy="240" r="8" fill="#008374" />

                  <circle cx="200" cy="420" r="14" fill="#008374" fillOpacity="0.2" />
                  <circle cx="200" cy="420" r="7" fill="#008374" />
                </svg>
              </div>

              {/* Card 1: Beverly Springfield (Top Left/Center) */}
              {beverlyProp && (
                <div
                  onClick={() => setSelectedProperty(beverlyProp)}
                  className="absolute top-2 left-0 sm:-left-4 w-[260px] bg-white rounded-2xl shadow-xl shadow-slate-200/70 border border-slate-100 p-2.5 cursor-pointer hover:shadow-2xl transition-all z-20 group"
                  title="Click to view physician property details"
                >
                  <div className="rounded-xl overflow-hidden h-28 mb-2">
                    <img
                      src={beverlyProp.image_url}
                      alt={beverlyProp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-extrabold text-[#008374]">
                        ₹{beverlyProp.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">/{beverlyProp.period || 'month'}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-xs truncate">{beverlyProp.title}</h3>
                    <p className="text-[10px] text-slate-400 truncate">{beverlyProp.address}</p>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Bed className="w-3 h-3 text-[#008374]" /> {beverlyProp.beds} BHK
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-3 h-3 text-[#008374]" /> {beverlyProp.baths} Bath
                    </span>
                    <span className="flex items-center gap-1">
                      <Maximize2 className="w-3 h-3 text-[#008374]" /> {beverlyProp.dimensions}
                    </span>
                  </div>
                </div>
              )}

              {/* Card 2: Anna Nagar Heritage Villa (Bottom Right) */}
              {tarponProp && (
                <div
                  onClick={() => setSelectedProperty(tarponProp)}
                  className="absolute bottom-4 right-0 sm:-right-4 w-[240px] bg-white rounded-2xl shadow-xl shadow-slate-200/70 border border-slate-100 p-2.5 cursor-pointer hover:shadow-2xl transition-all z-20 group"
                  title="Click to view details"
                >
                  <div className="rounded-xl overflow-hidden h-24 mb-2">
                    <img
                      src={tarponProp.image_url}
                      alt={tarponProp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs font-extrabold text-[#008374]">
                        ₹{tarponProp.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium">/{tarponProp.period || 'month'}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-[11px] truncate">{tarponProp.title}</h3>
                    <p className="text-[9px] text-slate-400 truncate">{tarponProp.address}</p>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Bed className="w-2.5 h-2.5 text-[#008374]" /> {tarponProp.beds} BHK
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-2.5 h-2.5 text-[#008374]" /> {tarponProp.baths} Bath
                    </span>
                    <span className="flex items-center gap-1">
                      <Maximize2 className="w-2.5 h-2.5 text-[#008374]" /> {tarponProp.dimensions}
                    </span>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
