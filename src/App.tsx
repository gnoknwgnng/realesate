import React from 'react';
import { PropertyProvider, useProperties } from './context/PropertyContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CinematicShowcase } from './components/CinematicShowcase';
import { WhyMedProperties } from './components/WhyMedProperties';
import { HowItWorks } from './components/HowItWorks';
import { PropertyGrid } from './components/PropertyGrid';
import { SearchResultsPage } from './components/SearchResultsPage';
import { PropertyDetailPage } from './components/PropertyDetailPage';
import { FinancingPage } from './components/FinancingPage';
import { LandlordPage } from './components/LandlordPage';
import { HowItWorksPage } from './components/HowItWorksPage';
import { ResourcesPage } from './components/ResourcesPage';
import { DashboardPage } from './components/DashboardPage';
import { ConciergeModal } from './components/ConciergeModal';
import { AddPropertyModal } from './components/AddPropertyModal';
import { AuthModal } from './components/AuthModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { MortgageCalculatorModal } from './components/MortgageCalculatorModal';
import { ClinicalShiftPlanner } from './components/ClinicalShiftPlanner';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

export const AppContent: React.FC = () => {
  const { currentView, isMortgageModalOpen, setIsMortgageModalOpen } = useProperties();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardPage />;
      case 'explore':
      case 'buy':
        return (
          <>
            <Navbar />
            <main className="flex-1">
              <SearchResultsPage />
            </main>
            <Footer />
          </>
        );
      case 'property-detail':
        return (
          <>
            <Navbar />
            <main className="flex-1">
              <PropertyDetailPage />
            </main>
            <Footer />
          </>
        );
      case 'financing':
        return (
          <>
            <Navbar />
            <main className="flex-1">
              <FinancingPage />
            </main>
            <Footer />
          </>
        );
      case 'landlord':
        return (
          <>
            <Navbar />
            <main className="flex-1">
              <LandlordPage />
            </main>
            <Footer />
          </>
        );
      case 'how-it-works':
        return (
          <>
            <Navbar />
            <main className="flex-1">
              <HowItWorksPage />
            </main>
            <Footer />
          </>
        );
      case 'resources':
        return (
          <>
            <Navbar />
            <main className="flex-1">
              <ResourcesPage />
            </main>
            <Footer />
          </>
        );
      case 'home':
      default:
        return (
          <>
            <Navbar />
            <main className="flex-1">
              {/* 1. Architectural Hero with Hospital Search Console */}
              <Hero />

              {/* 2. Reference 1-inspired Cinematic Property Showcase */}
              <CinematicShowcase />

              {/* 3. Why MedProperties: 4 Substantiated Pillars */}
              <WhyMedProperties />

              {/* 4. 4-Step Guided Relocation Sequence */}
              <HowItWorks />

              {/* 5. Interactive Clinical Shift Commute & Residence Planner */}
              <ClinicalShiftPlanner />

              {/* 6. Complete Verified Inventory Grid */}
              <PropertyGrid />
            </main>
            <Footer />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-teal-100 selection:text-[#008374]">
      {renderCurrentView()}

      {/* Global Interactive Modals & Drawers */}
      <ConciergeModal />
      <AddPropertyModal />
      <AuthModal />
      <FavoritesDrawer />
      <MortgageCalculatorModal
        isOpen={isMortgageModalOpen}
        onClose={() => setIsMortgageModalOpen(false)}
      />
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
