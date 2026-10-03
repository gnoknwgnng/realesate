import React, { useState } from 'react';
import { useProperties } from '../context/PropertyContext';
import {
  Calculator,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  Info,
  Sparkles,
  ChevronDown,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const FinancingPage: React.FC = () => {
  const { openConciergeModal } = useProperties();

  // Financial inputs (Defaults: ₹2.25 Cr property, 20% down, 8.40% interest, 20 yrs tenure)
  const [propertyPrice, setPropertyPrice] = useState<number>(22500000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(8.4);
  const [tenureYears, setTenureYears] = useState<number>(20);
  const [showAmortization, setShowAmortization] = useState<boolean>(false);

  // Quick Preset Handlers
  const applyPreset = (preset: 'residency' | 'consultant' | 'clinic') => {
    if (preset === 'residency') {
      setPropertyPrice(15000000);
      setDownPaymentPercent(10);
      setInterestRate(8.35);
      setTenureYears(25);
    } else if (preset === 'consultant') {
      setPropertyPrice(25000000);
      setDownPaymentPercent(20);
      setInterestRate(8.4);
      setTenureYears(15);
    } else if (preset === 'clinic') {
      setPropertyPrice(40000000);
      setDownPaymentPercent(30);
      setInterestRate(8.5);
      setTenureYears(20);
    }
  };

  // Calculations
  const downPaymentAmount = (propertyPrice * downPaymentPercent) / 100;
  const loanAmount = propertyPrice - downPaymentAmount;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = tenureYears * 12;

  const monthlyEMI =
    monthlyRate > 0
      ? (loanAmount *
          (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
      : loanAmount / numberOfPayments;

  const totalRepayment = monthlyEMI * numberOfPayments;
  const totalInterest = Math.max(0, totalRepayment - loanAmount);

  const principalRatio = totalRepayment > 0 ? (loanAmount / totalRepayment) * 100 : 50;
  const interestRatio = totalRepayment > 0 ? (totalInterest / totalRepayment) * 100 : 50;

  // SVG Donut calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const principalStrokeDash = (principalRatio / 100) * circumference;
  const interestStrokeDash = circumference - principalStrokeDash;

  // Format currency in Indian notation
  const formatINR = (val: number) => {
    return `₹${Math.round(val).toLocaleString('en-IN')}`;
  };

  const formatLakhsCr = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)}\u00A0Cr`;
    }
    return `₹${(val / 100000).toFixed(2)}\u00A0Lakhs`;
  };

  return (
    <div className="min-h-screen bg-[#FDFDFC] pb-24 text-stone-800">
      
      {/* Editorial Luxury Header */}
      <section className="bg-[#09131F] text-white pt-16 pb-16 relative overflow-hidden border-b border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-teal-300">
              <ShieldCheck className="w-3.5 h-3.5 text-[#008374]" />
              <span>Medical Professional Mortgage Advisory</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold font-serif text-white tracking-tight leading-tight">
              Physician home loans & <br />
              <span className="text-[#008374] font-serif italic font-normal">financing simulator.</span>
            </h1>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
              Medical careers have unique earning trajectories. Partner lenders recognize clinical fellowship stipends, consultant retainers, and private OPD revenue for preferential underwriting.
            </p>

            {/* Quick Profile Presets */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <span className="text-xs text-stone-400 font-semibold mr-1">Doctor Profiles:</span>
              <button
                onClick={() => applyPreset('residency')}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs text-white font-medium transition-all cursor-pointer"
              >
                Postgraduate / Resident (10% Down)
              </button>
              <button
                onClick={() => applyPreset('consultant')}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs text-white font-medium transition-all cursor-pointer"
              >
                Senior Consultant (Fast Equity)
              </button>
              <button
                onClick={() => applyPreset('clinic')}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs text-white font-medium transition-all cursor-pointer"
              >
                Private Practice & Clinic
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Calculator Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Sliders & Parameter Controls (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-7 sm:p-9 border border-stone-200/80 shadow-sm space-y-8">
            <div className="flex items-center justify-between pb-5 border-b border-stone-100">
              <h2 className="text-lg font-bold font-serif text-[#09131F] flex items-center gap-2.5">
                <Calculator className="w-5 h-5 text-[#008374]" />
                Loan Structure Parameters
              </h2>
              <span className="text-xs font-mono text-stone-400 font-medium">
                Live Re-calculation
              </span>
            </div>

            {/* 1. Property Valuation Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Target Property Valuation
                </label>
                <span className="text-base font-bold text-[#09131F] font-serif">
                  {formatLakhsCr(propertyPrice)} <span className="text-xs text-stone-400 font-mono font-normal">({formatINR(propertyPrice)})</span>
                </span>
              </div>
              <input
                type="range"
                min={3000000}
                max={80000000}
                step={500000}
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#008374]"
              />
              <div className="flex justify-between text-xs text-stone-400 font-mono">
                <span>₹30 Lakhs</span>
                <span>₹4.0 Crore</span>
                <span>₹8.0 Crore</span>
              </div>
            </div>

            {/* 2. Down Payment Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Down Payment ({downPaymentPercent}%)
                </label>
                <span className="text-base font-bold text-[#09131F] font-serif">
                  {formatINR(downPaymentAmount)}
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={50}
                step={5}
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#008374]"
              />
              <div className="flex justify-between text-xs text-stone-400 font-mono">
                <span className="text-[#008374] font-semibold">10% (Doctor Special LTV)</span>
                <span>20% (Standard)</span>
                <span>50%</span>
              </div>
            </div>

            {/* 3. Interest Rate & Tenure Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
              {/* Interest Rate */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Annual Interest Rate
                  </label>
                  <span className="text-base font-bold text-[#09131F] font-serif">
                    {interestRate.toFixed(2)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={7.5}
                  max={11.0}
                  step={0.05}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#008374]"
                />
                <p className="text-xs text-stone-400 leading-snug">
                  Indicative benchmark rate across SBI, HDFC & ICICI healthcare partner programs.
                </p>
              </div>

              {/* Loan Tenure */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Loan Tenure
                  </label>
                  <span className="text-base font-bold text-[#09131F] font-serif">
                    {tenureYears} Years <span className="text-xs text-stone-400 font-mono font-normal">({numberOfPayments} mos)</span>
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={1}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#008374]"
                />
                <p className="text-xs text-stone-400 leading-snug">
                  Extended retirement-age repayment horizons up to 70 years for specialists.
                </p>
              </div>
            </div>

            {/* Disclaimer & Amortization toggle */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-stone-100">
              <div className="flex items-start gap-2 text-xs text-stone-500">
                <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <span>
                  Calculations use reducing-balance amortization. Evidenced partner terms apply.
                </span>
              </div>
              <button
                onClick={() => setShowAmortization(!showAmortization)}
                className="text-xs font-bold text-[#008374] hover:text-[#007063] flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <span>{showAmortization ? 'Hide Breakdown Table' : 'View Year-by-Year Table'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAmortization ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Optional Year-by-Year Amortization Schedule */}
            {showAmortization && (
              <div className="pt-4 border-t border-stone-100 space-y-3 animate-in fade-in">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Sample Multi-Year Schedule
                </h4>
                <div className="overflow-x-auto max-h-56 overflow-y-auto rounded-2xl border border-stone-200">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-stone-100 text-stone-600 font-semibold sticky top-0">
                      <tr>
                        <th className="p-2.5">Year</th>
                        <th className="p-2.5">Principal Paid</th>
                        <th className="p-2.5">Interest Paid</th>
                        <th className="p-2.5">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-mono">
                      {[1, 2, 3, 5, 10, 15, 20].filter(y => y <= tenureYears).map((yr) => (
                        <tr key={yr} className="hover:bg-stone-50">
                          <td className="p-2.5 font-bold">Year {yr}</td>
                          <td className="p-2.5 text-emerald-700">{formatINR((loanAmount / tenureYears) * yr)}</td>
                          <td className="p-2.5 text-indigo-700">{formatINR((totalInterest / tenureYears) * yr)}</td>
                          <td className="p-2.5 text-stone-600">{formatINR(Math.max(0, loanAmount - (loanAmount / tenureYears) * yr))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Visual Radial Donut & VIP Outlay Card (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#09131F] text-white rounded-3xl p-7 sm:p-9 shadow-2xl space-y-7 border border-white/10 relative overflow-hidden">
              
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-[#008374]">
                  Estimated Monthly Outlay
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-5xl font-extrabold font-serif text-white tracking-tight">
                    {formatINR(monthlyEMI)}
                  </span>
                  <span className="text-xs text-stone-400 font-mono font-medium">/month</span>
                </div>
              </div>

              {/* Radial Donut Visualization */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col sm:flex-row items-center gap-6">
                <div className="relative w-32 h-32 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                    {/* Background circle */}
                    <circle
                      cx="64"
                      cy="64"
                      r={radius}
                      className="text-stone-800"
                      strokeWidth="14"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    {/* Principal circle */}
                    <circle
                      cx="64"
                      cy="64"
                      r={radius}
                      stroke="#008374"
                      strokeWidth="14"
                      strokeDasharray={`${principalStrokeDash} ${circumference}`}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                    {/* Interest circle */}
                    <circle
                      cx="64"
                      cy="64"
                      r={radius}
                      stroke="#818cf8"
                      strokeWidth="14"
                      strokeDasharray={`${interestStrokeDash} ${circumference}`}
                      strokeDashoffset={`-${principalStrokeDash}`}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xs text-stone-400 font-mono uppercase">Repayment</span>
                    <span className="text-sm font-bold font-serif text-white">{principalRatio.toFixed(0)}% P</span>
                  </div>
                </div>

                <div className="space-y-3 flex-1 text-xs">
                  <div>
                    <div className="flex items-center justify-between text-stone-300 font-semibold mb-1">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#008374]" />
                        <span>Principal Loan</span>
                      </span>
                      <span className="font-mono text-white">{formatINR(loanAmount)}</span>
                    </div>
                    <div className="text-[11px] text-stone-400 font-mono pl-4">{principalRatio.toFixed(1)}% of total</div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-stone-300 font-semibold mb-1">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#818cf8]" />
                        <span>Total Interest</span>
                      </span>
                      <span className="font-mono text-white">{formatINR(totalInterest)}</span>
                    </div>
                    <div className="text-[11px] text-stone-400 font-mono pl-4">{interestRatio.toFixed(1)}% of total</div>
                  </div>
                </div>
              </div>

              {/* Consultation Action */}
              <button
                onClick={openConciergeModal}
                className="w-full py-4 px-6 rounded-2xl bg-[#008374] hover:bg-[#007063] text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Request Private Financing Advisory</span>
              </button>

              <p className="text-xs text-stone-400 text-center">
                Discreet private banking liaison with zero broker markups.
              </p>
            </div>

            {/* Doctor Privilege Financing Highlights */}
            <div className="bg-white rounded-3xl p-7 border border-stone-200/80 shadow-sm space-y-4">
              <h3 className="text-base font-bold font-serif text-[#09131F] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#008374]" />
                Physician Underwriting Privileges
              </h3>
              <ul className="space-y-3 text-xs text-stone-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#008374] shrink-0 mt-0.5" />
                  <span>
                    <strong>Up to 90% Loan-to-Value (LTV):</strong> Lowers upfront equity hurdle for junior doctors and senior residents transitioning to fellowship.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#008374] shrink-0 mt-0.5" />
                  <span>
                    <strong>Multi-Source Clinical Revenue:</strong> Both institutional retainer and private OPD receipts are recognized without multi-year ITR delays.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#008374] shrink-0 mt-0.5" />
                  <span>
                    <strong>0% Pre-payment Penalties:</strong> Accelerate repayment anytime hospital annual incentives or consulting fees clear.
                  </span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
