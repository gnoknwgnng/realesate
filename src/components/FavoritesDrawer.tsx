import React from 'react';
import { useProperties } from '../context/PropertyContext';
import { X, Heart, Trash2, ArrowRight } from 'lucide-react';

export const FavoritesDrawer: React.FC = () => {
  const {
    isFavoritesDrawerOpen,
    setIsFavoritesDrawerOpen,
    favorites,
    properties,
    toggleFavorite,
    setSelectedProperty,
  } = useProperties();

  if (!isFavoritesDrawerOpen) return null;

  const favoriteProperties = properties.filter((p) => favorites.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-navy-950/60 backdrop-blur-sm animate-in fade-in flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-100 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-current" />
            <h3 className="font-extrabold text-navy-900 text-lg">Saved Properties</h3>
            <span className="text-xs font-bold bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full">
              {favorites.length}
            </span>
          </div>
          <button
            onClick={() => setIsFavoritesDrawerOpen(false)}
            className="p-2 rounded-full border border-slate-200 text-slate-400 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {favoriteProperties.length > 0 ? (
            favoriteProperties.map((prop) => (
              <div
                key={prop.id}
                onClick={() => {
                  setSelectedProperty(prop);
                  setIsFavoritesDrawerOpen(false);
                }}
                className="group flex gap-3 p-3 rounded-2xl border border-slate-100 hover:border-brand-200 hover:shadow-md transition-all cursor-pointer bg-slate-50/50"
              >
                <img
                  src={prop.image_url}
                  alt={prop.title}
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-navy-900 text-sm group-hover:text-brand-700 truncate">
                      {prop.title}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">{prop.address}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-extrabold text-[#008374]">
                      ₹{prop.price.toLocaleString('en-IN')}
                      <span className="text-[11px] text-slate-400 font-normal">/{prop.period || 'mo'}</span>
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(prop.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 space-y-3">
              <Heart className="w-12 h-12 text-slate-200 mx-auto" />
              <p className="font-bold text-slate-700 text-sm">No saved properties yet</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Click the heart icon on any property card to save it for easy comparison.
              </p>
              <button
                onClick={() => {
                  setIsFavoritesDrawerOpen(false);
                  const el = document.getElementById('properties-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="mt-3 px-5 py-2.5 bg-[#008374] hover:bg-[#007063] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Browse Properties
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {favoriteProperties.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50/60">
            <button
              onClick={() => {
                setIsFavoritesDrawerOpen(false);
                const el = document.getElementById('properties-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-3 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              Compare All Saved Homes
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
