import React from 'react';
import { useProperties } from '../context/PropertyContext';
import { X, Heart, Trash2, ArrowRight, PhoneCall, ShieldCheck, Clock } from 'lucide-react';

export const FavoritesDrawer: React.FC = () => {
  const {
    isFavoritesDrawerOpen,
    setIsFavoritesDrawerOpen,
    favorites,
    properties,
    toggleFavorite,
    viewPropertyDetail,
    openConciergeModal,
    setCurrentView,
  } = useProperties();

  if (!isFavoritesDrawerOpen) return null;

  const favoriteProperties = properties.filter((p) => favorites.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#0A2540]/70 backdrop-blur-xs animate-in fade-in flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#0A2540] text-base">Saved Residences</h3>
              <p className="text-xs text-slate-500 font-medium">
                {favoriteProperties.length} doctor-friendly {favoriteProperties.length === 1 ? 'shortlist' : 'shortlists'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsFavoritesDrawerOpen(false)}
            className="p-1.5 rounded-full border border-slate-200 text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-3.5">
          {favoriteProperties.length > 0 ? (
            favoriteProperties.map((prop) => (
              <div
                key={prop.id}
                onClick={() => {
                  viewPropertyDetail(prop);
                  setIsFavoritesDrawerOpen(false);
                }}
                className="group flex gap-3.5 p-3 rounded-2xl border border-slate-200/80 hover:border-teal-500/50 hover:shadow-md transition-all cursor-pointer bg-white"
              >
                <div className="relative w-22 h-22 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={prop.image_url}
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-xs text-[10px] text-white font-mono px-1.5 py-0.5 rounded">
                    {prop.beds} BHK
                  </span>
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <h4 className="font-bold text-[#0A2540] text-xs sm:text-sm group-hover:text-[#008374] truncate transition-colors">
                      {prop.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{prop.address}</p>
                    {prop.hospital_distance && (
                      <p className="text-[10px] text-[#008374] font-semibold flex items-center gap-1 mt-1 truncate">
                        <Clock className="w-3 h-3 shrink-0" />
                        <span className="truncate">{prop.hospital_distance}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                    <span className="text-sm font-extrabold text-[#0A2540] font-serif">
                      ₹{prop.category === 'buy' ? `${(prop.price / 10000000).toFixed(2)} Cr` : prop.price.toLocaleString('en-IN')}
                      <span className="text-[10px] text-slate-400 font-normal font-sans">
                        {prop.category === 'buy' ? ' guide' : `/${prop.period || 'mo'}`}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(prop.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove from shortlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 space-y-3.5">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Heart className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-[#0A2540] text-sm">No saved residences yet</p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Click the heart icon on any doctor residence to bookmark it for accompanied shift viewing.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsFavoritesDrawerOpen(false);
                  setCurrentView('explore');
                }}
                className="mt-2 px-5 py-2.5 bg-[#008374] hover:bg-[#007063] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Browse Audited Homes
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {favoriteProperties.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-slate-50/70 space-y-2.5">
            <button
              onClick={() => {
                setIsFavoritesDrawerOpen(false);
                openConciergeModal();
              }}
              className="w-full py-3 bg-[#008374] hover:bg-[#007063] text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Book VIP Viewing Tour for Shortlist</span>
            </button>

            <button
              onClick={() => {
                setIsFavoritesDrawerOpen(false);
                setCurrentView('explore');
              }}
              className="w-full py-2 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Explore More Hospital Corridors</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
