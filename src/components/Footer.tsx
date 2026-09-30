import React from 'react';
import { useProperties } from '../context/PropertyContext';

export const Footer: React.FC = () => {
  const {
    setIsSellModalOpen,
    setIsMortgageModalOpen,
    setInfoModalType,
    setFilters,
    user,
    setCurrentView,
    openAuthModal,
  } = useProperties();

  const handleSellClick = () => {
    if (user) {
      setCurrentView('dashboard');
    } else {
      openAuthModal('login');
    }
  };

  const handleNavCategory = (tab: 'rent' | 'buy') => {
    setFilters((prev) => ({ ...prev, tab }));
    const el = document.getElementById('properties-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-12 text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo Row matching ui.pdf */}
        <div className="pb-10">
          <img src="/logo.png" alt="MedProperties" className="h-11 w-auto object-contain" />
        </div>

        {/* 6 Structured Columns matching ui.pdf with all working options */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 pb-14 text-xs">
          
          {/* SELL A HOME */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-[#0A2540] uppercase tracking-wider text-[11px]">
              SELL A HOME
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={handleSellClick}
                  className="hover:text-[#008374] transition-colors text-left cursor-pointer"
                >
                  Request an offer
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('properties-section')}
                  className="hover:text-[#008374] transition-colors text-left cursor-pointer"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('testimonials-section')}
                  className="hover:text-[#008374] transition-colors text-left cursor-pointer"
                >
                  Reviews
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('testimonials-section')}
                  className="hover:text-[#008374] transition-colors text-left cursor-pointer"
                >
                  Stories
                </button>
              </li>
            </ul>
          </div>

          {/* BUY A HOME */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-[#0A2540] uppercase tracking-wider text-[11px]">
              BUY A HOME
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => handleNavCategory('buy')}
                  className="hover:text-[#008374] transition-colors text-left cursor-pointer"
                >
                  Buy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsMortgageModalOpen(true)}
                  className="hover:text-[#008374] transition-colors text-left cursor-pointer"
                >
                  Finance
                </button>
              </li>
            </ul>
          </div>

          {/* BUY, RENT AND SELL */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-[#0A2540] uppercase tracking-wider text-[11px]">
              BUY, RENT AND SELL
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('properties-section')}
                  className="hover:text-[#008374] transition-colors text-left cursor-pointer"
                >
                  Buy and sell properties
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavCategory('rent')}
                  className="hover:text-[#008374] transition-colors text-left cursor-pointer"
                >
                  Rent home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsSellModalOpen(true)}
                  className="hover:text-[#008374] transition-colors text-left cursor-pointer"
                >
                  Builder trade-up
                </button>
              </li>
            </ul>
          </div>

          {/* TERMS & PRIVACY */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-[#0A2540] uppercase tracking-wider text-[11px]">
              TERMS & PRIVACY
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => setInfoModalType('trust')}
                  className="hover:text-[#008374] transition-colors text-left cursor-pointer"
                >
                  Trust & Safety
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setInfoModalType('terms')}
                  className="hover:text-[#008374] transition-colors text-left cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setInfoModalType('privacy')}
                  className="hover:text-[#008374] transition-colors text-left cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* ABOUT */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-[#0A2540] uppercase tracking-wider text-[11px]">
              ABOUT
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => setInfoModalType('about')}
                  className="hover:text-[#008374] transition-colors text-left cursor-pointer"
                >
                  Company
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setInfoModalType('relocation')}
                  className="hover:text-[#008374] transition-colors text-left cursor-pointer"
                >
                  How it works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setInfoModalType('contact')}
                  className="hover:text-[#008374] transition-colors text-left cursor-pointer"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setInfoModalType('about')}
                  className="hover:text-[#008374] transition-colors text-left cursor-pointer"
                >
                  Investors
                </button>
              </li>
            </ul>
          </div>

          {/* RESOURCES */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-[#0A2540] uppercase tracking-wider text-[11px]">
              RESOURCES
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => setInfoModalType('relocation')}
                  className="hover:text-[#008374] transition-colors text-left cursor-pointer"
                >
                  Blog
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setInfoModalType('relocation')}
                  className="hover:text-[#008374] transition-colors text-left cursor-pointer"
                >
                  Guides
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setInfoModalType('faq')}
                  className="hover:text-[#008374] transition-colors text-left cursor-pointer"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setInfoModalType('contact')}
                  className="hover:text-[#008374] transition-colors text-left cursor-pointer"
                >
                  Help Center
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Social & Copyright matching ui.pdf */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 MedProperties India. Built for Healthcare Professionals. All rights reserved.</p>
          
          <div className="flex items-center gap-5 text-slate-400">
            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#008374] transition-colors" title="Facebook">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
              </svg>
            </a>
            {/* Twitter */}
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#008374] transition-colors" title="Twitter / X">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#008374] transition-colors" title="Instagram">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#008374] transition-colors" title="LinkedIn">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
