import React from 'react';
import { Property } from '../types';
import { useProperties } from '../context/PropertyContext';
import { Bed, Bath, Maximize2, Heart, Sparkles } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { favorites, toggleFavorite, setSelectedProperty } = useProperties();
  const isFavorite = favorites.includes(property.id);

  return (
    <div
      onClick={() => setSelectedProperty(property)}
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Property Image with POPULAR badge overlay */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={property.image_url}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* POPULAR Badge matching ui.pdf */}
        {property.is_popular && (
          <div className="absolute bottom-3 left-3 bg-[#EDE9FE] text-[#6366F1] text-[11px] font-extrabold px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3 text-[#6366F1]" />
            POPULAR
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          
          {/* Price & Heart Row matching ui.pdf */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-[#008374]">
                ₹{property.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-medium text-slate-400">/{property.period || 'month'}</span>
            </div>

            {/* Favorite Heart Button matching ui.pdf */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(property.id);
              }}
              className={`w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center transition-colors ${
                isFavorite
                  ? 'bg-rose-50 border-rose-200 text-rose-500'
                  : 'bg-white text-slate-400 hover:text-rose-500 hover:border-slate-300'
              }`}
              title={isFavorite ? 'Remove from saved' : 'Save property'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current text-rose-500' : ''}`} />
            </button>
          </div>

          {/* Title matching ui.pdf */}
          <h3 className="text-xl font-bold text-[#0A2540] group-hover:text-[#008374] transition-colors pt-0.5">
            {property.title}
          </h3>

          {/* Address matching ui.pdf */}
          <p className="text-xs text-slate-400 font-normal">
            {property.address}
          </p>
        </div>

        {/* Divider & Specs Row matching ui.pdf */}
        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <Bed className="w-4 h-4 text-[#008374]" />
            <span>{property.beds} BHK</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Bath className="w-4 h-4 text-[#008374]" />
            <span>{property.baths} Bathrooms</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Maximize2 className="w-4 h-4 text-[#008374]" />
            <span>{property.dimensions}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
