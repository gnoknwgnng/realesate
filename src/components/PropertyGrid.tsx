import React from 'react';
import { useProperties } from '../context/PropertyContext';
import { PropertyCard } from './PropertyCard';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export const PropertyGrid: React.FC = () => {
  const { filteredProperties, setCurrentView, setFilters } = useProperties();
  const displayedProperties = filteredProperties.slice(0, 6);

  const handleExploreAll = () => {
    setFilters((p) => ({ ...p, tab: 'rent' }));
    setCurrentView('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="properties-section" className="py-16 sm:py-20 bg-slate-50/50 border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#008374] mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Available Inventory</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0A2540] tracking-tight">
              Verified residences <span className="font-serif italic font-normal">available now.</span>
            </h2>
            <p className="text-sm text-slate-500 max-w-xl mt-1 leading-relaxed">
              Every home is physically audited for acoustic decibel levels, 100% generator backup, and peak morning hospital commute.
            </p>
          </div>

          <div>
            <button
              onClick={handleExploreAll}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#008374] hover:bg-[#007063] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <span>Explore all {filteredProperties.length} homes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayedProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

      </div>
    </section>
  );
};
