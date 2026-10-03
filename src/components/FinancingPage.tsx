import React, { useState } from 'react';
import { useProperties } from '../context/PropertyContext';
import {
  Calculator,
  Percent,
  Calendar,
  CreditCard,
  Building,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  Clock,
  ArrowRight,
  Info,
} from 'lucide-react';

export const FinancingPage: React.FC = () => {
  const { openConciergeModal, showToast } = useProperties();

  // Financial inputs (Defaults: ₹2.25 Cr property, 20% down, 8.40% interest, 20 yrs tenure)
  const [propertyPrice, setPropertyPrice] = useState<number>(22500000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(8.4);
  const [tenureYears, setTenureYears] = useState<number>(20);

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
  const totalInterest = totalRepayment - loanAmount;

  const principalRatio = (loanAmount / totalRepayment) * 100;
  const interestRatio = (totalInterest / totalRepayment) * 100;

  // Format currency in Indian notation
  const formatINR = (val: number) => {
    return `₹${Math.round(val).toLocaleString('en-IN')}`;
  };

  const formatLakhsCr = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(val / 100000).toFixed(2)} L`;
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      
      {/* Editorial Header */}
      <section className="bg-white border-b border-slate-200/80 pt-12 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-xs font-semibold text-[#008374]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Medical Professional Mortgage Advisory</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold text-[#0A2540] tracking-tight">
              Physician home loans & <br />
              <span className="font-serif italic font-normal text-[#008374]">financing simulator.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
              Medical careers have unique earning trajectories. Partner lenders recognize clinical fellowship income, consultant retainers, and private practice revenue for preferential underwriting.
            </p>
          </div>
        </div>
      </section>

      {/* Main Interactive Calculator Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Sliders & Parameter Controls (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-7">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-[#0A2540] flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#008374]" />
                Loan Structure Parameters
              </h2>
              <span className="text-xs font-mono text-slate-500 font-medium">
                Live Re-calculation
              </span>
            </div>

            {/* 1. Property Valuation Slider */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Property Value
                </label>
                <span className="text-sm font-bold text-[#0A2540] font-mono">
                  {formatLakhsCr(propertyPrice)} ({formatINR(propertyPrice)})
                </span>
              </div>
              <input
                type="range"
                min={3000000}
                max={80000000}
                step={500000}
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#008374]"
              />
              <div className="flex justify-between text-xs text-slate-500 font-mono">
                <span>₹30 Lakhs</span>
                <span>₹4 Crore</span>
                <span>₹8 Crore</span>
              </div>
            </div>

            {/* 2. Down Payment Slider */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Down Payment ({downPaymentPercent}%)
                </label>
                <span className="text-sm font-bold text-[#0A2540] font-mono">
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
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#008374]"
              />
              <div className="flex justify-between text-xs text-slate-500 font-mono">
                <span>10% (Doctor Special)</span>
                <span>20% (Standard)</span>
                <span>50%</span>
              </div>
            </div>

            {/* 3. Interest Rate & Tenure Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {/* Interest Rate */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Annual Interest Rate
                  </label>
                  <span className="text-sm font-bold text-[#0A2540] font-mono">
                    {interestRate.toFixed(2)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={7.5}
                  max={11.0}
                  step={0.1}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#008374]"
                />
                <p className="text-xs text-slate-500">
                  Indicative benchmark rate across SBI, HDFC & ICICI healthcare programs.
                </p>
              </div>

              {/* Loan Tenure */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Loan Tenure
                  </label>
                  <span className="text-sm font-bold text-[#0A2540] font-mono">
                    {tenureYears} Years ({numberOfPayments} Months)
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={1}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#008374]"
                />
                <p className="text-xs text-slate-500">
                  Extended repayment horizons up to age 70 for medical specialists.
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-2 text-xs text-slate-500">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Calculations are indicative based on standard reducing-balance amortisation. Actual interest rates, processing terms, and maximum LTV depend on credit profile and institutional underwriting.
              </span>
            </div>
          </div>

          {/* Right Column: Dynamic Results Card (Inspired by Reference 3) (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0A2540] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-[#008374]">
                  Estimated Monthly Outlay
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">
                    {formatINR(monthlyEMI)}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">/month</span>
                </div>
              </div>

              {/* Progress bar breakdown: Principal vs Interest */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Repayment Breakdown</span>
                  <span className="font-mono text-slate-400">{formatINR(totalRepayment)}</span>
                </div>
                <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${principalRatio}%` }}
                    className="bg-[#008374] h-full"
                    title={`Principal: ${principalRatio.toFixed(1)}%`}
                  />
                  <div
                    style={{ width: `${interestRatio}%` }}
                    className="bg-indigo-400/80 h-full"
                    title={`Interest: ${interestRatio.toFixed(1)}%`}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-300 pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#008374]" />
                    <span>Principal: {formatINR(loanAmount)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-400/80" />
                    <span>Interest: {formatINR(totalInterest)}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={openConciergeModal}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#008374] hover:bg-[#007063] text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Request Financing Advisory</span>
              </button>

              <p className="text-xs text-slate-400 text-center">
                Free specialist consultation. Direct bank liaison without broker commissions.
              </p>
            </div>

            {/* Doctor Financing Specifics Box */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#0A2540]">
                Doctor Privilege Financing Highlights
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#008374] shrink-0 mt-0.5" />
                  <span>
                    <strong>Up to 90% Loan-to-Value (LTV):</strong> Lower upfront equity barrier for postgraduates and senior residents.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#008374] shrink-0 mt-0.5" />
                  <span>
                    <strong>Clinical Income Assessment:</strong> Fellowship stipends, private OPD, and consultation retainers recognized.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#008374] shrink-0 mt-0.5" />
                  <span>
                    <strong>Zero Foreclosure Penalties:</strong> Repay faster whenever clinical annual incentives or gratuities clear.
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
