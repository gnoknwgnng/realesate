import React from 'react';
import { PropertyProvider, useProperties } from './context/PropertyContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TenantLandlord } from './components/TenantLandlord';
import { StatsSection } from './components/StatsSection';
import { PropertyGrid } from './components/PropertyGrid';
import { Testimonials } from './components/Testimonials';
import { LandlordCta } from './components/LandlordCta';
import { Footer } from './components/Footer';
import { PropertyModal } from './components/PropertyModal';
import { AddPropertyModal } from './components/AddPropertyModal';
import { AuthModal } from './components/AuthModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { MortgageCalculatorModal } from './components/MortgageCalculatorModal';
import { SellValuationModal } from './components/SellValuationModal';
import { GeneralInfoModal } from './components/GeneralInfoModal';
import { DashboardPage } from './components/DashboardPage';
import { Toast } from './components/Toast';

export const AppContent: React.FC = () => {
  const { isMortgageModalOpen, setIsMortgageModalOpen, currentView } = useProperties();

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-brand-100 selection:text-brand-900">
      {currentView === 'dashboard' ? (
        <DashboardPage />
      ) : (
        <>
          {/* 1. Header / Navbar */}
          <Navbar />

          <main className="flex-1">
            {/* 2. Hero Section */}
            <Hero />

            {/* 3. Tenants & Landlords Section */}
            <TenantLandlord />

            {/* 4. Doctor Lifestyle Stats Section */}
            <StatsSection />

            {/* 5. Based on your location - Property Grid */}
            <PropertyGrid />

            {/* 6. Testimonials */}
            <Testimonials />

            {/* 7. Landlord Call to Action */}
            <LandlordCta />
          </main>

          {/* 8. Footer */}
          <Footer />
        </>
      )}

      {/* Interactive Modals & Drawers */}
      <PropertyModal />
      <AddPropertyModal />
      <AuthModal />
      <SupabaseConfigModal />
      <FavoritesDrawer />
      <MortgageCalculatorModal
        isOpen={isMortgageModalOpen}
        onClose={() => setIsMortgageModalOpen(false)}
      />
      <SellValuationModal />
      <GeneralInfoModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <PropertyProvider>
      <AppContent />
    </PropertyProvider>
  );
}
