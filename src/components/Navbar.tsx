import React, { useState } from 'react';
import { useProperties } from '../context/PropertyContext';
import { Menu, X, Heart, Building2, Crown, ChevronDown, User, Sparkles, PhoneCall } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    favorites,
    setIsFavoritesDrawerOpen,
    openAuthModal,
    openConciergeModal,
    setFilters,
    user,
    signOut,
    currentView,
    setCurrentView,
  } = useProperties();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const navigateTo = (view: 'home' | 'explore' | 'buy' | 'landlord' | 'how-it-works' | 'financing' | 'resources') => {
    setMobileMenuOpen(false);
    if (view === 'explore') {
      setFilters((prev) => ({ ...prev, tab: 'rent' }));
      setCurrentView('explore');
    } else if (view === 'buy') {
      setFilters((prev) => ({ ...prev, tab: 'buy' }));
      setCurrentView('buy');
    } else {
      setCurrentView(view);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { label: 'Explore homes', view: 'explore' as const, active: currentView === 'explore' },
    { label: 'Buy', view: 'buy' as const, active: currentView === 'buy' },
    { label: 'For landlords', view: 'landlord' as const, active: currentView === 'landlord' },
    { label: 'How it works', view: 'how-it-works' as const, active: currentView === 'how-it-works' },
    { label: 'Financing & EMI', view: 'financing' as const, active: currentView === 'financing' },
    { label: 'Resources', view: 'resources' as const, active: currentView === 'resources' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/70 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-3 text-left group cursor-pointer"
              aria-label="MedProperties Home"
            >
              <img
                src="/logo.png"
                alt="MedProperties"
                className="h-10 sm:h-11 w-auto object-contain"
                onError={(e) => {
                  // Fallback if logo fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-[#0A2540] group-hover:text-[#008374] transition-colors leading-tight">
                  MedProperties
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                  Built for those who care
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7" aria-label="Main Navigation">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => navigateTo(item.view)}
                className={`text-[14px] font-medium transition-all py-1.5 cursor-pointer relative ${
                  item.active
                    ? 'text-[#008374] font-semibold'
                    : 'text-slate-700 hover:text-[#0A2540]'
                }`}
              >
                {item.label}
                {item.active && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#008374] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden sm:flex items-center space-x-4">
            {/* Talk to a specialist Concierge CTA */}
            <button
              onClick={openConciergeModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#008374] bg-teal-50/80 hover:bg-teal-100/70 border border-teal-200/60 transition-all cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#008374]" />
              <span>Talk to a specialist</span>
            </button>

            {/* Saved residences heart badge */}
            <button
              onClick={() => setIsFavoritesDrawerOpen(true)}
              className="relative p-2 text-slate-600 hover:text-[#008374] transition-colors cursor-pointer rounded-lg hover:bg-slate-50"
              title="Saved Residences"
              aria-label={`Saved residences (${favorites.length})`}
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[10px] font-bold text-white bg-[#008374] rounded-full flex items-center justify-center animate-in zoom-in">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Account authentication state */}
            {user ? (
              <div className="relative" onMouseLeave={() => setUserDropdown(false)}>
                <button
                  onMouseEnter={() => setUserDropdown(true)}
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 bg-white transition-all text-xs font-semibold text-[#0A2540] cursor-pointer"
                  aria-expanded={userDropdown}
                >
                  <div
                    className={`w-6 h-6 rounded-full text-white flex items-center justify-center text-xs font-bold ${
                      user.role === 'superadmin' ? 'bg-purple-600' : 'bg-[#008374]'
                    }`}
                  >
                    {user.role === 'superadmin' ? (
                      <Crown className="w-3 h-3 text-amber-300" />
                    ) : (
                      user.email.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="max-w-[100px] truncate">{user.email.split('@')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdown && (
                  <div className="absolute right-0 top-full w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 mt-1 animate-in fade-in z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                        {user.role === 'superadmin' ? 'Super Administrator' : 'Healthcare Member'}
                      </p>
                      <p className="text-xs font-bold text-[#0A2540] truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentView('dashboard');
                        setUserDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center gap-2 cursor-pointer"
                    >
                      <Building2 className="w-4 h-4 text-[#008374]" />
                      Management Dashboard
                    </button>

                    <button
                      onClick={() => {
                        signOut();
                        setUserDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-rose-50 text-xs font-medium text-rose-600 flex items-center gap-2 cursor-pointer border-t border-slate-100 mt-1"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#0A2540] hover:bg-[#0c2f54] transition-all cursor-pointer shadow-xs"
              >
                Sign in
              </button>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setIsFavoritesDrawerOpen(true)}
              className="p-2 text-slate-600 hover:text-[#008374] relative"
              aria-label="Favorites"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 text-[9px] font-bold text-white bg-[#008374] rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-[#0A2540] rounded-lg"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2">
          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => navigateTo(item.view)}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  item.active
                    ? 'bg-teal-50 text-[#008374] font-semibold'
                    : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openConciergeModal();
              }}
              className="w-full py-2.5 px-4 text-center rounded-xl text-xs font-semibold text-[#008374] bg-teal-50 border border-teal-200"
            >
              Talk to a specialist (Concierge)
            </button>

            {user ? (
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    setCurrentView('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-semibold text-[#0A2540] hover:text-[#008374]"
                >
                  Dashboard ({user.email.split('@')[0]})
                </button>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-medium text-rose-600"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className="w-full py-2.5 px-4 text-center rounded-xl text-xs font-semibold text-white bg-[#0A2540]"
              >
                Sign in to MedProperties
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
