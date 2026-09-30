import React, { useState } from 'react';
import { useProperties } from '../context/PropertyContext';
import { PropertyCard } from './PropertyCard';
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  Search,
  MapPin,
  Clock,
  Bed,
  CheckCircle2,
  ArrowUpDown,
  Zap,
  VolumeX,
} from 'lucide-react';
import { VERIFIED_HOSPITAL_HUBS } from '../lib/mockData';

export const SearchResultsPage: React.FC = () => {
  const {
    filteredProperties,
    filters,
    setFilters,
    resetFilters,
    currentView,
    setCurrentView,
    openConciergeModal,
  } = useProperties();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Natural Language Header Calculation
  const isBuy = currentView === 'buy' || filters.tab === 'buy';
  const bhkLabel = filters.beds && filters.beds !== 'all' ? `${filters.beds} BHK ` : '';
  const modeLabel = isBuy ? 'homes for sale' : 'verified rentals';
  const hospitalLabel = filters.hospital ? ` near ${filters.hospital}` : '';
  const cityLabel = filters.city && filters.city !== 'all' ? `, ${filters.city}` : '';
  const commuteLabel =
    filters.maxCommuteTime && filters.maxCommuteTime !== 'all'
      ? ` within ${filters.maxCommuteTime} min peak commute`
      : '';

  const naturalLanguageQuery = `${bhkLabel}${modeLabel}${hospitalLabel}${cityLabel}${commuteLabel}`;

  // Active filter chips detection
  const hasActiveFilters =
    filters.hospital ||
    (filters.city && filters.city !== 'all') ||
    (filters.beds && filters.beds !== 'all') ||
    (filters.maxCommuteTime && filters.maxCommuteTime !== 'all') ||
    (filters.priceRange && filters.priceRange !== 'all');

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Top Search Banner */}
      <section className="bg-white border-b border-slate-200/80 pt-8 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb / Category switcher */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <button
                onClick={() => {
                  setFilters((prev) => ({ ...prev, tab: 'rent' }));
                  setCurrentView('explore');
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  !isBuy ? 'bg-[#0A2540] text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Rent near Hospitals
              </button>
              <button
                onClick={() => {
                  setFilters((prev) => ({ ...prev, tab: 'buy' }));
                  setCurrentView('buy');
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  isBuy ? 'bg-[#0A2540] text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Buy a Residence
              </button>
            </div>

            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#008374]" />
              <span>Filters</span>
            </button>
          </div>

          {/* Natural language summary */}
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0A2540] tracking-tight capitalize">
            {naturalLanguageQuery}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 pt-3 border-t border-slate-100">
            {/* Active Filter Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Filters:</span>

              {filters.hospital && (
                <span className="inline-flex items-center gap-1 text-xs bg-teal-50 text-[#008374] font-medium px-2.5 py-1 rounded-full border border-teal-100">
                  Hospital: {filters.hospital}
                  <button
                    onClick={() => setFilters((p) => ({ ...p, hospital: '' }))}
                    className="hover:text-teal-900 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.city && filters.city !== 'all' && (
                <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-full">
                  City: {filters.city}
                  <button
                    onClick={() => setFilters((p) => ({ ...p, city: 'all' }))}
                    className="hover:text-slate-900 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.beds && filters.beds !== 'all' && (
                <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-full">
                  {filters.beds} BHK
                  <button
                    onClick={() => setFilters((p) => ({ ...p, beds: 'all' }))}
                    className="hover:text-slate-900 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.maxCommuteTime && filters.maxCommuteTime !== 'all' && (
                <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-full">
                  &lt; {filters.maxCommuteTime} mins at 8 AM
                  <button
                    onClick={() => setFilters((p) => ({ ...p, maxCommuteTime: 'all' }))}
                    className="hover:text-slate-900 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 ml-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset all
                </button>
              )}
            </div>

            {/* Sort & Count */}
            <div className="flex items-center gap-4 text-xs">
              <span className="text-slate-500 font-medium">
                <strong className="text-[#0A2540]">{filteredProperties.length}</strong> verified residences
              </span>

              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={filters.sortBy || 'relevance'}
                  onChange={(e) =>
                    setFilters((p) => ({
                      ...p,
                      sortBy: e.target.value as any,
                    }))
                  }
                  className="bg-transparent border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-[#008374] cursor-pointer"
                >
                  <option value="relevance">Sort: Relevance</option>
                  <option value="commute">Sort: Fastest Commute</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Sort: Newest Audits</option>
                </select>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Filter Sidebar (3 cols) */}
          <aside className="hidden lg:block lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs sticky top-24 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#0A2540] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#008374]" />
                Filter Criteria
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-slate-400 hover:text-slate-700 font-medium cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Hospital Search */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Hospital Hub
              </label>
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={filters.hospital}
                  onChange={(e) => setFilters((p) => ({ ...p, hospital: e.target.value }))}
                  placeholder="e.g. Manipal, Apollo, AIIMS"
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#008374]"
                />
              </div>
              <div className="pt-1 flex flex-wrap gap-1">
                {['Manipal', 'AIIMS', 'Apollo', 'Lilavati'].map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setFilters((p) => ({ ...p, hospital: name }))}
                    className="text-[10px] font-medium bg-slate-100 hover:bg-teal-50 hover:text-[#008374] px-2 py-0.5 rounded cursor-pointer transition-colors"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* City Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Metropolitan Area
              </label>
              <select
                value={filters.city}
                onChange={(e) => setFilters((p) => ({ ...p, city: e.target.value }))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#008374] bg-white cursor-pointer"
              >
                <option value="all">All Cities</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Delhi NCR">Delhi NCR / Gurugram</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Chennai">Chennai</option>
              </select>
            </div>

            {/* Max Commute Time */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Max 8:00 AM Commute</span>
                <span className="text-[#008374] font-semibold text-[11px]">
                  {filters.maxCommuteTime === 'all' ? 'Any' : `< ${filters.maxCommuteTime} min`}
                </span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: 'Any', value: 'all' },
                  { label: '<15 min', value: '15' },
                  { label: '<30 min', value: '30' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setFilters((p) => ({ ...p, maxCommuteTime: item.value }))}
                    className={`py-1.5 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                      filters.maxCommuteTime === item.value
                        ? 'border-[#008374] bg-teal-50 text-[#008374] font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bedrooms (BHK) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Bedrooms (BHK)
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { label: 'All', value: 'all' },
                  { label: '2', value: '2' },
                  { label: '3', value: '3' },
                  { label: '4+', value: '4' },
                ].map((bhk) => (
                  <button
                    key={bhk.value}
                    type="button"
                    onClick={() => setFilters((p) => ({ ...p, beds: bhk.value }))}
                    className={`py-1.5 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                      filters.beds === bhk.value
                        ? 'border-[#008374] bg-teal-50 text-[#008374] font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {bhk.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Verification Standard Reassurance */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0A2540]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#008374]" />
                <span>Audited Features</span>
              </div>
              <ul className="text-[11px] text-slate-500 space-y-1">
                <li className="flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-[#008374]" />
                  <span>100% DG Generator Backup</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <VolumeX className="w-3 h-3 text-[#008374]" />
                  <span>&lt;42 dB Acoustic Suite Noise</span>
                </li>
              </ul>
            </div>

          </aside>

          {/* Right Results Grid (9 cols) */}
          <main className="lg:col-span-9">
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              /* Helpful Empty State */
              <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-slate-200 max-w-2xl mx-auto space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 text-[#008374] flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold text-[#0A2540]">
                    No verified residences match your exact criteria
                  </h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                    We only display residences that have passed our physical verification audit. Broaden your search or let our concierge source a tailored home for your hospital rotation.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={resetFilters}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Reset all filters
                  </button>
                  <button
                    onClick={openConciergeModal}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#008374] hover:bg-[#007063] transition-colors cursor-pointer shadow-xs"
                  >
                    Request Concierge Sourcing
                  </button>
                </div>
              </div>
            )}
          </main>

        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white h-full p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-[#0A2540]">Filter Residences</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* City */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">City</label>
                <select
                  value={filters.city}
                  onChange={(e) => setFilters((p) => ({ ...p, city: e.target.value }))}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white"
                >
                  <option value="all">All Cities</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Delhi NCR">Delhi NCR / Gurugram</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Chennai">Chennai</option>
                </select>
              </div>

              {/* Hospital */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Hospital</label>
                <input
                  type="text"
                  value={filters.hospital}
                  onChange={(e) => setFilters((p) => ({ ...p, hospital: e.target.value }))}
                  placeholder="e.g. Manipal, AIIMS, Apollo"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
                />
              </div>

              {/* Commute */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Max Commute (8 AM)</label>
                <div className="grid grid-cols-3 gap-2">
                  {['all', '15', '30'].map((val) => (
                    <button
                      key={val}
                      onClick={() => setFilters((p) => ({ ...p, maxCommuteTime: val }))}
                      className={`p-2 rounded-xl text-xs font-medium border ${
                        filters.maxCommuteTime === val
                          ? 'border-[#008374] bg-teal-50 text-[#008374] font-bold'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      {val === 'all' ? 'Any' : `< ${val} min`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Beds */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Bedrooms</label>
                <div className="grid grid-cols-4 gap-2">
                  {['all', '2', '3', '4'].map((bhk) => (
                    <button
                      key={bhk}
                      onClick={() => setFilters((p) => ({ ...p, beds: bhk }))}
                      className={`p-2 rounded-xl text-xs font-medium border ${
                        filters.beds === bhk
                          ? 'border-[#008374] bg-teal-50 text-[#008374] font-bold'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      {bhk === 'all' ? 'All' : `${bhk} BHK`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <button
                onClick={() => {
                  resetFilters();
                  setMobileFilterOpen(false);
                }}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 rounded-xl bg-[#008374] text-xs font-bold text-white shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
