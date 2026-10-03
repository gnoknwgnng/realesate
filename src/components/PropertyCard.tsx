import React from 'react';
import { Property } from '../types';
import { useProperties } from '../context/PropertyContext';
import { Bed, Bath, Maximize2, Heart, CheckCircle2, Clock, Zap, VolumeX, ShieldCheck } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { favorites, toggleFavorite, viewPropertyDetail } = useProperties();
  const isFavorite = favorites.includes(property.id);

  const formattedPrice =
    property.category === 'buy'
      ? `₹${(property.price / 10000000).toFixed(2)} Cr`
      : `₹${property.price.toLocaleString('en-IN')}`;

  return (
    <article
      onClick={() => viewPropertyDetail(property)}
      className="group bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Property Image with Verified Overlay */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={property.image_url}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Verified Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <div className="bg-[#0A2540]/90 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm border border-white/10">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#008374]" />
            <span>Verified residence</span>
          </div>
          {property.verified_date && (
            <span className="text-xs text-slate-200 bg-[#0A2540]/80 backdrop-blur-xs px-2 py-0.5 rounded font-mono font-medium">
              Audited {property.verified_date}
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(property.id);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
            isFavorite
              ? 'bg-rose-50/95 text-rose-600 shadow-md'
              : 'bg-white/80 text-slate-600 hover:bg-white hover:text-rose-600'
          }`}
          aria-label={isFavorite ? 'Remove from saved residences' : 'Save residence to shortlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Hospital Commute Banner at bottom of image */}
        {property.commute_estimate && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0A2540]/95 via-[#0A2540]/75 to-transparent pt-6 pb-2.5 px-3.5 text-white flex items-center gap-1.5 text-xs font-medium">
            <Clock className="w-3.5 h-3.5 text-[#008374] shrink-0" />
            <span className="truncate">{property.commute_estimate}</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          {/* Price & Category */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-[#0A2540]">
                {formattedPrice}
              </span>
              <span className="text-xs font-medium text-slate-500">
                {property.category === 'buy' ? 'guide price' : `/${property.period || 'month'}`}
              </span>
            </div>
            {property.furnishing && (
              <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                {property.furnishing}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-[#0A2540] group-hover:text-[#008374] transition-colors line-clamp-1">
            {property.title}
          </h3>

          {/* Address */}
          <p className="text-xs text-slate-500 font-normal line-clamp-1">
            {property.address}, {property.city}
          </p>

          {/* Workday Amenities Tags */}
          <div className="pt-1 flex flex-wrap gap-1.5">
            {property.workday_amenities?.slice(0, 2).map((amenity, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-xs font-medium bg-teal-50 text-[#008374] px-2 py-0.5 rounded border border-teal-100"
              >
                {amenity.includes('DG') || amenity.includes('backup') ? (
                  <Zap className="w-3 h-3 text-[#008374]" />
                ) : amenity.includes('Quiet') || amenity.includes('acoustic') ? (
                  <VolumeX className="w-3 h-3 text-[#008374]" />
                ) : (
                  <ShieldCheck className="w-3 h-3 text-[#008374]" />
                )}
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Divider & Specs Row */}
        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-1.5">
            <Bed className="w-4 h-4 text-slate-400" />
            <span>{property.beds} BHK</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Bath className="w-4 h-4 text-slate-400" />
            <span>{property.baths} Bath</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Maximize2 className="w-4 h-4 text-slate-400" />
            <span>{property.dimensions}</span>
          </div>
        </div>
      </div>
    </article>
  );
};
