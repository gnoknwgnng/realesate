import React, { useState } from 'react';
import { useProperties } from '../context/PropertyContext';
import { Search, MapPin, Building, Clock, Bed, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { VERIFIED_HOSPITAL_HUBS } from '../lib/mockData';

export const Hero: React.FC = () => {
  const { filters, setFilters, setCurrentView } = useProperties();
  const [activeTab, setActiveTab] = useState<'rent' | 'buy'>(
    filters.tab === 'buy' ? 'buy' : 'rent'
  );
  const [hospitalQuery, setHospitalQuery] = useState(filters.hospital || '');
  const [selectedCity, setSelectedCity] = useState(filters.city || 'all');
  const [commuteTime, setCommuteTime] = useState(filters.maxCommuteTime || 'all');
  const [beds, setBeds] = useState(filters.beds || 'all');
  const [showHospitalDropdown, setShowHospitalDropdown] = useState(false);

  const handleTabChange = (tab: 'rent' | 'buy') => {
    setActiveTab(tab);
    setFilters((prev) => ({ ...prev, tab }));
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      tab: activeTab,
      hospital: hospitalQuery,
      city: selectedCity,
      maxCommuteTime: commuteTime,
      beds,
    }));
    setCurrentView(activeTab === 'buy' ? 'buy' : 'explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectHospital = (hospitalName: string, city: string) => {
    setHospitalQuery(hospitalName);
    setSelectedCity(city);
    setShowHospitalDropdown(false);
  };

  const filteredHospitals = VERIFIED_HOSPITAL_HUBS.filter(
    (h) =>
      h.name.toLowerCase().includes(hospitalQuery.toLowerCase()) ||
      h.locality.toLowerCase().includes(hospitalQuery.toLowerCase()) ||
      h.city.toLowerCase().includes(hospitalQuery.toLowerCase())
  );

  return (
    <section className="relative bg-[#0A2540] text-white pt-10 pb-16 lg:pt-14 lg:pb-24 overflow-hidden">
      {/* Subtle architectural grid pattern background */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#008374_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Bold Architectural Statement & Search Console */}
          <div className="lg:col-span-7 space-y-7">
            {/* Verified Reassurance Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-[#008374]" />
              <span className="font-medium tracking-wide">Physician & Healthcare Housing Network</span>
            </div>

            {/* Main Editorial Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-bold text-white tracking-tight leading-[1.12]">
                A home closer to the <br />
                <span className="text-[#008374] font-serif italic font-normal">work that matters.</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
                Explore verified residences near the hospitals that shape your day. We assist with
                shift-calibrated search, private viewings, and seamless relocation.
              </p>
            </div>

            {/* Search Console Panel */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] text-slate-900 border border-white/40 max-w-2xl">
              {/* Rent / Buy Tab Selector */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleTabChange('rent')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'rent'
                        ? 'bg-[#0A2540] text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200/70'
                    }`}
                  >
                    Rent near Hospital
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabChange('buy')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'buy'
                        ? 'bg-[#0A2540] text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200/70'
                    }`}
                  >
                    Buy a Home
                  </button>
                </div>

                <span className="text-xs font-medium text-slate-400 hidden sm:inline">
                  Verified commute calculations
                </span>
              </div>

              {/* Form Grid */}
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  
                  {/* Hospital or Locality Input with Typeahead */}
                  <div className="relative">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Hospital or Landmark
                    </label>
                    <div className="relative flex items-center">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="text"
                        value={hospitalQuery}
                        onChange={(e) => {
                          setHospitalQuery(e.target.value);
                          setShowHospitalDropdown(true);
                        }}
                        onFocus={() => setShowHospitalDropdown(true)}
                        placeholder="e.g. Manipal, AIIMS, Apollo"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#008374] focus:ring-1 focus:ring-[#008374] transition-all bg-slate-50/50 hover:bg-white focus:bg-white"
                      />
                    </div>

                    {/* Hospital Hubs Dropdown */}
                    {showHospitalDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 max-h-56 overflow-y-auto z-50">
                        <div className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                          Major Hospital Hubs
                        </div>
                        {filteredHospitals.map((h, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => selectHospital(h.name, h.city)}
                            className="w-full text-left px-3.5 py-2 hover:bg-teal-50 flex items-start justify-between text-xs cursor-pointer group transition-colors"
                          >
                            <div>
                              <p className="font-semibold text-slate-800 group-hover:text-[#008374]">
                                {h.name}
                              </p>
                              <p className="text-xs text-slate-400">{h.locality}</p>
                            </div>
                            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {h.city}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* City Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      City
                    </label>
                    <div className="relative flex items-center">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#008374] focus:ring-1 focus:ring-[#008374] bg-slate-50/50 hover:bg-white focus:bg-white cursor-pointer transition-all"
                      >
                        <option value="all">All Cities</option>
                        <option value="Bengaluru">Bengaluru</option>
                        <option value="Delhi NCR">Delhi NCR / Gurugram</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Chennai">Chennai</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Sub-row: Commute Time & BHK */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Max 8 AM Commute
                    </label>
                    <div className="relative flex items-center">
                      <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <select
                        value={commuteTime}
                        onChange={(e) => setCommuteTime(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#008374] focus:ring-1 focus:ring-[#008374] bg-slate-50/50 hover:bg-white focus:bg-white cursor-pointer transition-all"
                      >
                        <option value="all">Any Commute Distance</option>
                        <option value="15">Within 15 mins</option>
                        <option value="20">Within 20 mins</option>
                        <option value="30">Within 30 mins</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Bedrooms (BHK)
                    </label>
                    <div className="relative flex items-center">
                      <Bed className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <select
                        value={beds}
                        onChange={(e) => setBeds(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#008374] focus:ring-1 focus:ring-[#008374] bg-slate-50/50 hover:bg-white focus:bg-white cursor-pointer transition-all"
                      >
                        <option value="all">Any Configuration</option>
                        <option value="2">2 BHK</option>
                        <option value="3">3 BHK</option>
                        <option value="4">4+ BHK</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-5 rounded-2xl bg-[#008374] hover:bg-[#007063] text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>Explore Verified Homes</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Hospital Tags */}
              <div className="pt-3 mt-3.5 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs text-slate-500">
                <span className="font-semibold text-slate-600 shrink-0">Popular hubs:</span>
                {[
                  { name: 'Manipal HAL', city: 'Bengaluru' },
                  { name: 'AIIMS', city: 'Delhi NCR' },
                  { name: 'Apollo Jubilee', city: 'Hyderabad' },
                  { name: 'Lilavati', city: 'Mumbai' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectHospital(item.name, item.city)}
                    className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-[#008374] text-slate-700 transition-colors cursor-pointer text-xs font-medium"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Photography Panel (Inspired by Reference 2) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="Verified Doctor Residence in Bengaluru"
                className="w-full h-[460px] lg:h-[540px] object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
              />

              {/* Subtle Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/90 via-[#0A2540]/30 to-transparent" />

              {/* In-Frame Featured Residence Fact Card */}
              <div className="absolute bottom-5 inset-x-5 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 text-slate-900 border border-white/20 shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#008374]">
                    <CheckCircle2 className="w-4 h-4 text-[#008374]" />
                    <span>Physical Field Audit Complete</span>
                  </div>
                  <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md font-semibold">
                    12 Sep 2026
                  </span>
                </div>

                <h4 className="text-base font-bold text-[#0A2540] truncate">
                  The Belmond Tower Residence
                </h4>
                <p className="text-xs text-slate-500 truncate">
                  Old Airport Road, Bengaluru • 3 BHK (2,100 sq ft)
                </p>

                {/* Audit highlights */}
                <div className="mt-2.5 flex items-center gap-2">
                  <span className="text-xs bg-teal-50 text-[#008374] font-medium px-2 py-0.5 rounded border border-teal-100">
                    100% DG Auto-Switch
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded">
                    &lt; 40 dB Acoustic Suite
                  </span>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-[#008374]" />
                    <span>8 min drive to Manipal Hospital</span>
                  </div>
                  <span className="text-sm font-extrabold text-[#0A2540]">₹85,000/mo</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
