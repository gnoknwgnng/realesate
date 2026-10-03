import React from 'react';
import { Property } from '../types';
import { useProperties } from '../context/PropertyContext';
import { Bed, Bath, Maximize2, Heart, CheckCircle2, Clock, Zap, VolumeX, ShieldCheck, ArrowUpRight } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { favorites, toggleFavorite, viewPropertyDetail } = useProperties();
  const isFavorite = favorites.includes(property.id);

  // Use non-breaking space before Cr to prevent awkward line breaks
  const formattedPrice =
    property.category === 'buy'
      ? `₹${(property.price / 10000000).toFixed(2)}\u00A0Cr`
      : `₹${property.price.toLocaleString('en-IN')}`;

  return (
    <article
      onClick={() => viewPropertyDetail(property)}
      className="group bg-white rounded-3xl border border-stone-200/80 hover:border-teal-700/40 shadow-xs hover:shadow-2xl hover:shadow-stone-900/10 transition-all duration-400 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Property Image with Verified Overlay */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
        <img
          src={property.image_url}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
        />

        {/* Verified Badge */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10">
          <div className="bg-[#09131F]/90 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md border border-white/15">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#008374]" />
            <span className="tracking-wide">Verified Residence</span>
          </div>
          {property.verified_date && (
            <span className="text-xs text-stone-300 bg-[#09131F]/80 backdrop-blur-md px-2.5 py-0.5 rounded-lg font-mono border border-white/10 self-start">
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
          className={`absolute top-3.5 right-3.5 w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all z-10 ${
            isFavorite
              ? 'bg-rose-50/95 text-rose-600 shadow-md ring-2 ring-rose-200'
              : 'bg-white/85 text-stone-600 hover:bg-white hover:text-rose-600 hover:scale-105'
          }`}
          aria-label={isFavorite ? 'Remove from saved residences' : 'Save residence to shortlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Hospital Commute Banner at bottom of image */}
        {property.commute_estimate && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#09131F]/95 via-[#09131F]/70 to-transparent pt-8 pb-3 px-4 text-white flex items-center justify-between text-xs font-medium">
            <div className="flex items-center gap-1.5 truncate">
              <Clock className="w-3.5 h-3.5 text-[#008374] shrink-0" />
              <span className="truncate">{property.commute_estimate}</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-stone-300 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between bg-white">
        <div className="space-y-3">
          {/* Price & Category */}
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-1.5 whitespace-nowrap">
              <span className="text-2xl font-bold tracking-tight text-[#09131F] font-serif">
                {formattedPrice}
              </span>
              <span className="text-xs font-medium text-stone-500">
                {property.category === 'buy' ? 'guide price' : `/${property.period || 'month'}`}
              </span>
            </div>
            {property.furnishing && (
              <span className="text-xs font-semibold text-stone-600 bg-stone-100/80 px-2.5 py-1 rounded-lg border border-stone-200/60 shrink-0">
                {property.furnishing}
              </span>
            )}
          </div>

          {/* Title - 2 lines allowed with graceful serif font */}
          <h3 className="text-base font-bold text-[#09131F] group-hover:text-[#008374] transition-colors line-clamp-2 min-h-[2.5rem] leading-snug">
            {property.title}
          </h3>

          {/* Address */}
          <p className="text-xs text-stone-500 font-normal line-clamp-1">
            {property.address}, {property.city}
          </p>

          {/* Workday Amenities Tags */}
          <div className="pt-1 flex flex-wrap gap-1.5">
            {property.workday_amenities?.slice(0, 2).map((amenity, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-xs font-semibold bg-teal-50/80 text-[#008374] px-2.5 py-1 rounded-lg border border-teal-200/60"
              >
                {amenity.includes('DG') || amenity.includes('backup') ? (
                  <Zap className="w-3 h-3 text-[#008374]" />
                ) : amenity.includes('Quiet') || amenity.includes('acoustic') ? (
                  <VolumeX className="w-3 h-3 text-[#008374]" />
                ) : (
                  <ShieldCheck className="w-3 h-3 text-[#008374]" />
                )}
                <span>{amenity}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Divider & Specs Row */}
        <div className="pt-4 mt-5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600 font-semibold">
          <div className="flex items-center gap-1.5">
            <Bed className="w-4 h-4 text-[#008374]" />
            <span>{property.beds} BHK</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Bath className="w-4 h-4 text-[#008374]" />
            <span>{property.baths} Bath</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Maximize2 className="w-4 h-4 text-[#008374]" />
            <span>{property.dimensions}</span>
          </div>
        </div>
      </div>
    </article>
  );
};
