import React, { useState } from 'react';
import { useProperties } from '../context/PropertyContext';
import {
  Compass,
  Clock,
  VolumeX,
  Zap,
  CheckCircle2,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Building,
  Sparkles,
} from 'lucide-react';

interface HospitalTelemetry {
  [key: string]: {
    name: string;
    city: string;
    shifts: {
      [shiftKey: string]: {
        time: string;
        dist: string;
        db: string;
        rec: string;
        price: string;
        bhk: string;
      };
    };
  };
}

const CLINICAL_TELEMETRY: HospitalTelemetry = {
  manipal: {
    name: 'Manipal Hospital HAL',
    city: 'Bengaluru',
    shifts: {
      morning: {
        time: '14 mins',
        dist: '3.2 km via HAL Old Airport Rd',
        db: '38 dB',
        rec: 'The Belmond Tower Residence',
        price: '₹85,000/mo',
        bhk: '3 BHK',
      },
      oncall: {
        time: '8 mins',
        dist: '3.2 km (Clear Rapid Corridors)',
        db: '36 dB',
        rec: 'Indiranagar Doctor Retreat',
        price: '₹65,000/mo',
        bhk: '3 BHK',
      },
      night: {
        time: '10 mins',
        dist: '3.2 km via HAL Bypass',
        db: '35 dB',
        rec: 'Whitefield Medical Penthouse',
        price: '₹1,10,000/mo',
        bhk: '4 BHK',
      },
      opd: {
        time: '12 mins',
        dist: '3.2 km Main Avenue',
        db: '39 dB',
        rec: 'Palm Meadows Villa',
        price: '₹65,000/mo',
        bhk: '3 BHK',
      },
    },
  },
  aiims: {
    name: 'AIIMS Ansari Nagar',
    city: 'Delhi NCR',
    shifts: {
      morning: {
        time: '16 mins',
        dist: '4.1 km via Ring Road Flyover',
        db: '41 dB',
        rec: 'Safdarjung Enclave Doctor Residence',
        price: '₹95,000/mo',
        bhk: '3 BHK',
      },
      oncall: {
        time: '9 mins',
        dist: '4.1 km Rapid Access Route',
        db: '39 dB',
        rec: 'Hauz Khas Specialist Garden Suite',
        price: '₹85,000/mo',
        bhk: '3 BHK',
      },
      night: {
        time: '11 mins',
        dist: '4.1 km via Aurobindo Marg',
        db: '37 dB',
        rec: 'South Extension Luxury Penthouse',
        price: '₹1,40,000/mo',
        bhk: '4 BHK',
      },
      opd: {
        time: '14 mins',
        dist: '4.1 km Ring Road',
        db: '40 dB',
        rec: 'Green Park Medical Duplex',
        price: '₹78,000/mo',
        bhk: '3 BHK',
      },
    },
  },
  apollo: {
    name: 'Apollo Hospitals Jubilee Hills',
    city: 'Hyderabad',
    shifts: {
      morning: {
        time: '11 mins',
        dist: '2.8 km via Road No. 36',
        db: '37 dB',
        rec: 'Jubilee Enclave Villa',
        price: '₹85,000/mo',
        bhk: '4 BHK',
      },
      oncall: {
        time: '6 mins',
        dist: '2.8 km Immediate Portico Exit',
        db: '34 dB',
        rec: 'Banjara Hills Consultant Penthouse',
        price: '₹75,000/mo',
        bhk: '3 BHK',
      },
      night: {
        time: '8 mins',
        dist: '2.8 km via Film Nagar Rd',
        db: '35 dB',
        rec: 'Financial District Doctor Suite',
        price: '₹60,000/mo',
        bhk: '3 BHK',
      },
      opd: {
        time: '9 mins',
        dist: '2.8 km Jubilee Avenue',
        db: '38 dB',
        rec: 'Gachibowli Green Enclave',
        price: '₹55,000/mo',
        bhk: '3 BHK',
      },
    },
  },
  hinduja: {
    name: 'Hinduja Hospital Mahim',
    city: 'Mumbai',
    shifts: {
      morning: {
        time: '15 mins',
        dist: '3.5 km via Cadell Road',
        db: '40 dB',
        rec: 'Worli Sea Face Specialist Suite',
        price: '₹1,45,000/mo',
        bhk: '3 BHK',
      },
      oncall: {
        time: '9 mins',
        dist: '3.5 km Coastal Corridor',
        db: '38 dB',
        rec: 'Bandra West Doctor Sanctuary',
        price: '₹1,35,000/mo',
        bhk: '3 BHK',
      },
      night: {
        time: '11 mins',
        dist: '3.5 km Sea Link Access',
        db: '36 dB',
        rec: 'Parel Hospital Hub High-Rise',
        price: '₹1,20,000/mo',
        bhk: '3 BHK',
      },
      opd: {
        time: '13 mins',
        dist: '3.5 km Mahim Corridor',
        db: '39 dB',
        rec: 'Dadar West Executive Residence',
        price: '₹85,000/mo',
        bhk: '2 BHK',
      },
    },
  },
};

export const ClinicalShiftPlanner: React.FC = () => {
  const { openConciergeModal, setCurrentView, setFilters } = useProperties();
  const [selectedHospital, setSelectedHospital] = useState<string>('manipal');
  const [selectedShift, setSelectedShift] = useState<string>('morning');
  const [budgetTarget, setBudgetTarget] = useState<number>(75000);

  const activeHub = CLINICAL_TELEMETRY[selectedHospital] || CLINICAL_TELEMETRY.manipal;
  const currentTelemetry = activeHub.shifts[selectedShift] || activeHub.shifts.morning;

  const handleExploreCorridor = () => {
    setFilters((p) => ({
      ...p,
      tab: 'rent',
      hospital: activeHub.name,
      city: activeHub.city,
    }));
    setCurrentView('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-16 sm:py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-xs font-bold text-[#008374]">
              <Compass className="w-3.5 h-3.5 text-[#008374]" />
              <span>Interactive Clinical Telemetry</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0A2540] tracking-tight">
              Hospital shift commute & <span className="font-serif italic font-normal text-[#008374]">residence planner.</span>
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Test transit times calibrated for morning handover peak traffic, acoustic sleep isolation, and 100% DG generator response before scheduling private viewings.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 font-semibold">
              Live Field Calibrated v2.6
            </span>
          </div>
        </div>

        {/* Interactive Console Card */}
        <div className="bg-slate-50/70 rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Interactive Selectors (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Row 1: Hospital Corridor Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Select Hospital Hub Corridor
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'manipal', label: 'Manipal HAL', city: 'Bengaluru' },
                    { id: 'aiims', label: 'AIIMS', city: 'Delhi NCR' },
                    { id: 'apollo', label: 'Apollo Jubilee', city: 'Hyderabad' },
                    { id: 'hinduja', label: 'Hinduja Mahim', city: 'Mumbai' },
                  ].map((hub) => (
                    <button
                      key={hub.id}
                      type="button"
                      onClick={() => setSelectedHospital(hub.id)}
                      className={`p-2.5 sm:p-3 rounded-xl text-left border transition-all cursor-pointer min-w-0 ${
                        selectedHospital === hub.id
                          ? 'border-[#008374] bg-white text-[#008374] shadow-xs font-bold ring-1 ring-[#008374]'
                          : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
                      }`}
                    >
                      <span className="block text-xs truncate font-bold">{hub.label}</span>
                      <span className="block text-xs text-slate-400 truncate">{hub.city}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 2: Clinical Duty Window */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Clinical Duty & Shift Window
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'morning', label: '08:00 AM Handover', sub: 'Peak Morning' },
                    { id: 'oncall', label: 'Emergency On-Call', sub: 'Fast Track' },
                    { id: 'night', label: '08:00 PM Night Shift', sub: 'Low Traffic' },
                    { id: 'opd', label: '11:00 AM Elective OPD', sub: 'Midday' },
                  ].map((shift) => (
                    <button
                      key={shift.id}
                      type="button"
                      onClick={() => setSelectedShift(shift.id)}
                      className={`p-2.5 sm:p-3 rounded-xl text-left border transition-all cursor-pointer min-w-0 ${
                        selectedShift === shift.id
                          ? 'border-[#008374] bg-white text-[#008374] shadow-xs font-bold ring-1 ring-[#008374]'
                          : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
                      }`}
                    >
                      <span className="block text-xs font-bold leading-tight truncate">{shift.label}</span>
                      <span className="block text-xs text-slate-400 truncate mt-0.5">{shift.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 3: Target Monthly Budget Slider */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Monthly Budget Calibration</span>
                  <span className="text-sm font-bold text-[#008374] font-mono">
                    ₹{budgetTarget.toLocaleString('en-IN')}/mo
                  </span>
                </div>
                <input
                  type="range"
                  min={35000}
                  max={200000}
                  step={5000}
                  value={budgetTarget}
                  onChange={(e) => setBudgetTarget(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#008374]"
                />
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>₹35k (2 BHK Standard)</span>
                  <span>₹85k (3 BHK Luxury)</span>
                  <span>₹2.0L+ (Penthouse Suite)</span>
                </div>
              </div>

            </div>

            {/* Right Column: Live Calibrated Output Card (5 cols) */}
            <div className="lg:col-span-5 bg-[#0A2540] text-white rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#008374]">
                    Corridor Telemetry
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {activeHub.name}
                  </h3>
                </div>
                <span className="text-xs font-mono text-teal-300 bg-teal-950/80 px-2.5 py-1 rounded-full border border-teal-800">
                  98% Fit Rating
                </span>
              </div>

              {/* 3 Metric Pills */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <div className="flex items-center justify-center gap-1 text-slate-300 text-xs mb-1">
                    <Clock className="w-3.5 h-3.5 text-[#008374]" />
                    <span>Commute</span>
                  </div>
                  <span className="text-xl font-bold text-white font-mono block">
                    {currentTelemetry.time}
                  </span>
                  <span className="text-xs text-slate-400 block truncate">
                    {currentTelemetry.dist.split(' ')[0]} km
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <div className="flex items-center justify-center gap-1 text-slate-300 text-xs mb-1">
                    <VolumeX className="w-3.5 h-3.5 text-[#008374]" />
                    <span>Acoustic</span>
                  </div>
                  <span className="text-xl font-bold text-white font-mono block">
                    {currentTelemetry.db}
                  </span>
                  <span className="text-xs text-teal-300 block">
                    Day-Sleep Pass
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <div className="flex items-center justify-center gap-1 text-slate-300 text-xs mb-1">
                    <Zap className="w-3.5 h-3.5 text-[#008374]" />
                    <span>DG Backup</span>
                  </div>
                  <span className="text-xl font-bold text-white font-mono block">
                    &lt; 8 sec
                  </span>
                  <span className="text-xs text-slate-400 block">
                    100% Load
                  </span>
                </div>
              </div>

              {/* Interactive Commute Route Visualizer (Generative UI) */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-teal-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Door-to-Ward Transit Route
                  </span>
                  <span className="text-slate-300 text-[11px] font-mono bg-white/10 px-2 py-0.5 rounded">
                    Peak Verified
                  </span>
                </div>

                {/* Stepped Route Progress */}
                <div className="grid grid-cols-4 gap-1 text-[11px] relative pt-1">
                  <div className="text-center space-y-1">
                    <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/40 flex items-center justify-center mx-auto font-mono text-[10px] font-bold">
                      01
                    </div>
                    <span className="text-slate-300 block font-medium leading-tight">Private Lift</span>
                    <span className="text-[10px] text-teal-400 font-mono">1.5 min</span>
                  </div>

                  <div className="text-center space-y-1">
                    <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/40 flex items-center justify-center mx-auto font-mono text-[10px] font-bold">
                      02
                    </div>
                    <span className="text-slate-300 block font-medium leading-tight">Priority Exit</span>
                    <span className="text-[10px] text-teal-400 font-mono">2 min</span>
                  </div>

                  <div className="text-center space-y-1">
                    <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/40 flex items-center justify-center mx-auto font-mono text-[10px] font-bold">
                      03
                    </div>
                    <span className="text-slate-300 block font-medium leading-tight">Main Corridor</span>
                    <span className="text-[10px] text-teal-400 font-mono">
                      {parseInt(currentTelemetry.time) > 6 ? `${parseInt(currentTelemetry.time) - 5} min` : '4 min'}
                    </span>
                  </div>

                  <div className="text-center space-y-1">
                    <div className="w-6 h-6 rounded-full bg-[#008374] text-white flex items-center justify-center mx-auto font-mono text-[10px] font-bold shadow-xs">
                      🏥
                    </div>
                    <span className="text-white block font-bold leading-tight">Hospital Gate</span>
                    <span className="text-[10px] text-emerald-300 font-mono">Arrived</span>
                  </div>
                </div>
              </div>

              {/* Optimal Residence Recommendation */}
              <div className="bg-white/10 rounded-2xl p-4 border border-white/15 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Recommended Audit Match:</span>
                  <span className="text-teal-300 font-bold">{currentTelemetry.bhk}</span>
                </div>
                <h4 className="text-base font-bold text-white truncate">
                  {currentTelemetry.rec}
                </h4>
                <div className="flex items-center justify-between text-xs text-slate-300 pt-1 border-t border-white/10">
                  <span>{currentTelemetry.dist}</span>
                  <span className="font-bold text-white">{currentTelemetry.price}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-1">
                <button
                  onClick={handleExploreCorridor}
                  className="w-full py-3 rounded-xl bg-[#008374] hover:bg-[#007063] text-white text-xs font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Explore Verified Homes in this Corridor</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={openConciergeModal}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/20 transition-colors cursor-pointer"
                >
                  Request Custom Shift Sourcing
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
