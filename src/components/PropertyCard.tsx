import React, { useState, useMemo } from 'react';
import { Property } from '../types';
import { useProperties } from '../context/PropertyContext';
import { Bed, Bath, Maximize2, Heart, CheckCircle2, Clock, Zap, VolumeX, ShieldCheck, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { favorites, toggleFavorite, viewPropertyDetail } = useProperties();
  const isFavorite = favorites.includes(property.id);

  // Collect unique photos for micro-carousel
  const allImages = useMemo(() => {
    const list: string[] = [property.image_url];
    if (property.images && Array.isArray(property.images)) {
      property.images.forEach((img: any) => {
        const url = typeof img === 'string' ? img : img?.r2_url;
        if (url && typeof url === 'string' && !list.includes(url)) {
          list.push(url);
        }
      });
    }
    return list;
  }, [property.image_url, property.images]);

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  // Use non-breaking space before Cr to prevent awkward line breaks
  const formattedPrice =
    property.category === 'buy'
      ? `₹${(property.price / 10000000).toFixed(2)}\u00A0Cr`
      : `₹${property.price.toLocaleString('en-IN')}`;

  return (
    <article
      onClick={() => viewPropertyDetail(property)}
      className="group bg-white rounded-3xl border border-stone-200/80 hover:border-teal-700/40 shadow-xs hover:shadow-2xl hover:shadow-stone-900/10 hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Property Image with Verified Overlay & Photo Micro-Carousel */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100 select-none">
        <img
          src={allImages[activePhotoIdx] || property.image_url}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
        />

        {/* Carousel Chevrons (visible on hover if multiple photos) */}
        {allImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevPhoto}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105 z-20"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextPhoto}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105 z-20"
              aria-label="Next photo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Photo Pagination Dots */}
            <div className="absolute bottom-11 inset-x-0 flex items-center justify-center gap-1.5 z-10 pointer-events-none">
              {allImages.slice(0, 5).map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    idx === activePhotoIdx ? 'w-4 bg-white shadow-xs' : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Verified Badge */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10">
          <div className="bg-[#09131F]/90 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md border border-white/15">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#008374]" />
            <span className="tracking-wide">Verified Residence</span>
          </div>
          {property.verified_date && (
            <span className="text-[11px] text-stone-300 bg-[#09131F]/80 backdrop-blur-md px-2.5 py-0.5 rounded-lg font-mono border border-white/10 self-start">
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
          className={`absolute top-3.5 right-3.5 w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-200 z-10 ${
            isFavorite
              ? 'bg-rose-50/95 text-rose-600 shadow-md ring-2 ring-rose-200 scale-105'
              : 'bg-white/85 text-stone-600 hover:bg-white hover:text-rose-600 hover:scale-110 active:scale-95 shadow-sm'
          }`}
          aria-label={isFavorite ? 'Remove from saved residences' : 'Save residence to shortlist'}
        >
          <Heart className={`w-4 h-4 transition-transform duration-200 ${isFavorite ? 'fill-current scale-110' : ''}`} />
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
