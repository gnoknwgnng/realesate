import React, { useState } from 'react';
import { useProperties } from '../context/PropertyContext';
import { ChevronDown, Menu, X, Heart, Database, PlusCircle, LogOut, Calculator, FileText, HelpCircle, Building2, Crown } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    favorites,
    setIsFavoritesDrawerOpen,
    openAuthModal,
    setIsAddModalOpen,
    setIsSupabaseModalOpen,
    setIsMortgageModalOpen,
    setIsSellModalOpen,
    setInfoModalType,
    setFilters,
    user,
    signOut,
    currentView,
    setCurrentView,
  } = useProperties();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [manageDropdown, setManageDropdown] = useState(false);
  const [resourcesDropdown, setResourcesDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const handleTabClick = (tab: 'rent' | 'buy' | 'sell') => {
    if (tab === 'sell') {
      if (user) {
        setCurrentView('dashboard');
      } else {
        openAuthModal('login');
      }
    } else {
      setCurrentView('home');
      setFilters((prev) => ({ ...prev, tab }));
      const el = document.getElementById('properties-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo matching logo.png */}
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentView('home')} className="flex items-center cursor-pointer">
              <img
                src="/logo.png"
                alt="MedProperties - BUILT FOR THOSE WHO CARE"
                className="h-11 sm:h-12 w-auto object-contain"
              />
            </button>
          </div>

          {/* Desktop Navigation Links matching ui.pdf */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleTabClick('rent')}
              className="text-[15px] font-semibold text-slate-800 hover:text-brand-700 transition-colors cursor-pointer"
            >
              Rent
            </button>
            <button
              onClick={() => handleTabClick('buy')}
              className="text-[15px] font-semibold text-slate-800 hover:text-brand-700 transition-colors cursor-pointer"
            >
              Buy
            </button>
            <button
              onClick={() => handleTabClick('sell')}
              className="text-[15px] font-semibold text-slate-800 hover:text-brand-700 transition-colors cursor-pointer"
            >
              Sell
            </button>

            {/* Manage Property Dropdown */}
            <div className="relative" onMouseLeave={() => setManageDropdown(false)}>
              <button
                onMouseEnter={() => setManageDropdown(true)}
                onClick={() => setManageDropdown(!manageDropdown)}
                className="flex items-center gap-1 text-[15px] font-semibold text-slate-800 hover:text-brand-700 transition-colors py-2 cursor-pointer"
              >
                Manage Property
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${manageDropdown ? 'rotate-180' : ''}`} />
              </button>

              {manageDropdown && (
                <div className="absolute top-full left-0 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-2.5 mt-1 animate-in fade-in z-50">
                  <button
                    onClick={() => {
                      setIsAddModalOpen(true);
                      setManageDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-brand-50 hover:text-brand-700 text-sm font-medium text-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4 text-brand-700" />
                    List a Property
                  </button>
                  <button
                    onClick={() => {
                      setIsSellModalOpen(true);
                      setManageDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-brand-50 hover:text-brand-700 text-sm font-medium text-slate-700 cursor-pointer"
                  >
                    Landlord Valuation Tool
                  </button>
                  <button
                    onClick={() => {
                      setInfoModalType('relocation');
                      setManageDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-brand-50 hover:text-brand-700 text-sm font-medium text-slate-700 cursor-pointer"
                  >
                    Healthcare Relocation
                  </button>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div className="relative" onMouseLeave={() => setResourcesDropdown(false)}>
              <button
                onMouseEnter={() => setResourcesDropdown(true)}
                onClick={() => setResourcesDropdown(!resourcesDropdown)}
                className="flex items-center gap-1 text-[15px] font-semibold text-slate-800 hover:text-brand-700 transition-colors py-2 cursor-pointer"
              >
                Resources
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${resourcesDropdown ? 'rotate-180' : ''}`} />
              </button>

              {resourcesDropdown && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2.5 mt-1 animate-in fade-in z-50">
                  <button
                    onClick={() => {
                      setIsMortgageModalOpen(true);
                      setResourcesDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-brand-50 hover:text-brand-700 text-sm font-medium text-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <Calculator className="w-4 h-4 text-brand-700" />
                    Physician Mortgage Calculator
                  </button>
                  <button
                    onClick={() => {
                      setInfoModalType('faq');
                      setResourcesDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-brand-50 hover:text-brand-700 text-sm font-medium text-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4 text-brand-700" />
                    Healthcare Real Estate FAQ
                  </button>
                  <a
                    href="#testimonials-section"
                    onClick={() => setResourcesDropdown(false)}
                    className="block px-4 py-2 hover:bg-brand-50 hover:text-brand-700 text-sm font-medium text-slate-700 cursor-pointer"
                  >
                    Doctor Testimonials
                  </a>
                  <button
                    onClick={() => {
                      setIsSupabaseModalOpen(true);
                      setResourcesDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-brand-50 hover:text-brand-700 text-sm font-medium text-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <Database className="w-4 h-4 text-brand-700" />
                    Supabase Database Settings
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Buttons matching ui.pdf */}
          <div className="hidden md:flex items-center space-x-6">
            {favorites.length > 0 && (
              <button
                onClick={() => setIsFavoritesDrawerOpen(true)}
                className="relative p-2 text-slate-600 hover:text-brand-700 transition-colors cursor-pointer"
                title="Saved Homes"
              >
                <Heart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold text-white bg-brand-700 rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              </button>
            )}

            {/* Check if user is logged in */}
            {user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentView(currentView === 'dashboard' ? 'home' : 'dashboard')}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                    user.role === 'superadmin'
                      ? 'border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700'
                      : 'border-brand-200 bg-brand-50 hover:bg-brand-100 text-[#008374]'
                  }`}
                >
                  {user.role === 'superadmin' ? (
                    <Crown className="w-3.5 h-3.5 text-purple-600" />
                  ) : (
                    <Building2 className="w-3.5 h-3.5" />
                  )}
                  {currentView === 'dashboard'
                    ? 'Explore Marketplace'
                    : user.role === 'superadmin'
                    ? 'Super Admin Console'
                    : 'My Listed Properties'}
                </button>

                <div className="relative" onMouseLeave={() => setUserDropdown(false)}>
                  <button
                    onMouseEnter={() => setUserDropdown(true)}
                    onClick={() => setUserDropdown(!userDropdown)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-slate-200 hover:border-brand-300 bg-slate-50 transition-all text-xs font-bold text-slate-800 cursor-pointer"
                  >
                    <div className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-xs font-extrabold shadow-sm ${
                      user.role === 'superadmin' ? 'bg-gradient-to-tr from-purple-600 to-indigo-600' : 'bg-[#008374]'
                    }`}>
                      {user.role === 'superadmin' ? <Crown className="w-3.5 h-3.5 text-amber-300" /> : user.email.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[120px] truncate">
                      {user.role === 'superadmin' ? 'Super Admin' : user.email.split('@')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdown && (
                    <div className="absolute right-0 top-full w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 mt-1 animate-in fade-in z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[11px] text-slate-400 font-semibold">Signed in as</p>
                          {user.role === 'superadmin' && (
                            <span className="text-[9px] font-extrabold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-md">
                              Super Admin
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-slate-800 truncate">{user.email}</p>
                      </div>

                      <button
                        onClick={() => {
                          setCurrentView('dashboard');
                          setUserDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-bold flex items-center gap-2 cursor-pointer ${
                          user.role === 'superadmin' ? 'text-purple-700' : 'text-[#008374]'
                        }`}
                      >
                        {user.role === 'superadmin' ? (
                          <>
                            <Crown className="w-4 h-4 text-purple-600" />
                            Super Admin Console
                          </>
                        ) : (
                          <>
                            <Building2 className="w-4 h-4 text-[#008374]" />
                            My Listed Properties
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setIsFavoritesDrawerOpen(true);
                          setUserDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center gap-2 cursor-pointer"
                      >
                        <Heart className="w-4 h-4 text-rose-500" />
                        Saved Properties ({favorites.length})
                      </button>

                      <button
                        onClick={() => {
                          setIsAddModalOpen(true);
                          setUserDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center gap-2 cursor-pointer"
                      >
                        <PlusCircle className="w-4 h-4 text-brand-700" />
                        List New Property
                      </button>

                      <div className="border-t border-slate-100 my-1" />

                      <button
                        onClick={() => {
                          signOut();
                          setUserDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-rose-50 text-xs font-bold text-rose-600 flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => openAuthModal('login')}
                  className="text-[15px] font-bold text-slate-800 hover:text-brand-700 transition-colors cursor-pointer"
                >
                  Login
                </button>

                <button
                  onClick={() => openAuthModal('signup')}
                  className="px-6 py-2.5 bg-brand-700 hover:bg-brand-800 text-white text-[15px] font-bold rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  Sign up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {user ? (
              <button
                onClick={() => signOut()}
                className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
              >
                Sign out
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('signup')}
                className="px-4 py-1.5 bg-brand-700 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Sign up
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-5 space-y-3">
          <div className="flex gap-2">
            <button
              onClick={() => { handleTabClick('rent'); setMobileMenuOpen(false); }}
              className="flex-1 py-2 text-center font-bold bg-brand-50 text-brand-700 rounded-lg text-sm cursor-pointer"
            >
              Rent
            </button>
            <button
              onClick={() => { handleTabClick('buy'); setMobileMenuOpen(false); }}
              className="flex-1 py-2 text-center font-bold text-slate-700 hover:bg-slate-50 rounded-lg text-sm cursor-pointer"
            >
              Buy
            </button>
            <button
              onClick={() => { handleTabClick('sell'); setMobileMenuOpen(false); }}
              className="flex-1 py-2 text-center font-bold text-slate-700 hover:bg-slate-50 rounded-lg text-sm cursor-pointer"
            >
              Sell
            </button>
          </div>

          <div className="space-y-1 pt-1">
            <button
              onClick={() => { setIsMortgageModalOpen(true); setMobileMenuOpen(false); }}
              className="w-full text-left py-2 px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
            >
              <Calculator className="w-4 h-4 text-brand-700" />
              Mortgage Calculator
            </button>
            <button
              onClick={() => { setInfoModalType('faq'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2 px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-brand-700" />
              FAQ
            </button>
            <button
              onClick={() => { setIsSupabaseModalOpen(true); setMobileMenuOpen(false); }}
              className="w-full text-left py-2 px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
            >
              <Database className="w-4 h-4 text-brand-700" />
              Database Settings
            </button>
          </div>

          {user ? (
            <div className="p-3 bg-slate-50 rounded-xl space-y-2">
              <p className="text-xs font-bold text-slate-800">Signed in as {user.email}</p>
              
              <button
                onClick={() => {
                  setCurrentView('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 text-left font-bold text-[#008374] hover:bg-brand-50 rounded-lg text-xs flex items-center gap-2 cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-[#008374]" />
                My Listed Properties
              </button>

              <button
                onClick={() => {
                  setIsAddModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 text-left font-medium text-slate-700 hover:bg-slate-100 rounded-lg text-xs flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-brand-700" />
                List New Property
              </button>

              <button
                onClick={() => {
                  setIsFavoritesDrawerOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 text-left font-medium text-slate-700 hover:bg-slate-100 rounded-lg text-xs flex items-center gap-2 cursor-pointer"
              >
                <Heart className="w-4 h-4 text-rose-500" />
                Saved Properties ({favorites.length})
              </button>

              <button
                onClick={() => { signOut(); setMobileMenuOpen(false); }}
                className="w-full py-2 text-center font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs cursor-pointer mt-1"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => { openAuthModal('login'); setMobileMenuOpen(false); }}
                className="flex-1 py-2.5 text-center font-bold border border-slate-200 text-slate-800 rounded-lg text-sm cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => { openAuthModal('signup'); setMobileMenuOpen(false); }}
                className="flex-1 py-2.5 text-center font-bold bg-brand-700 text-white rounded-lg text-sm cursor-pointer"
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
