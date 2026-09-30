import React from 'react';
import { useProperties } from '../context/PropertyContext';
import { PropertyCard } from './PropertyCard';

export const PropertyGrid: React.FC = () => {
  const { filteredProperties, resetFilters } = useProperties();
  const [showAll, setShowAll] = React.useState(false);

  const handleBrowseMore = () => {
    resetFilters();
    setShowAll((prev) => !prev);
  };

  const displayedProperties = showAll ? filteredProperties : filteredProperties.slice(0, 6);

  return (
    <section id="properties-section" className="py-16 lg:py-24 bg-[#FAFCFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching ui.pdf */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div className="space-y-1">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A2540] tracking-tight">
              Based on your location
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-normal">
              Some of our picked properties near your location
            </p>
          </div>

          <div>
            <button
              onClick={handleBrowseMore}
              className="px-6 py-3 bg-[#008374] hover:bg-[#007063] text-white text-sm font-bold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              {showAll ? 'Show top properties' : 'Browse more properties'}
            </button>
          </div>
        </div>

        {/* Properties Grid matching ui.pdf (3 columns x 2 rows or all) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

      </div>
    </section>
  );
};
