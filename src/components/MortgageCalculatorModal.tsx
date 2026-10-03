import React, { useState } from 'react';
import { useProperties } from '../context/PropertyContext';
import { X, Calculator, DollarSign, Stethoscope, CheckCircle2, ArrowRight } from 'lucide-react';

interface MortgageCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrice?: number;
}

export const MortgageCalculatorModal: React.FC<MortgageCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialPrice = 8500000,
}) => {
  const { showToast } = useProperties();
  const [homePrice, setHomePrice] = useState<number>(initialPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(15);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [loanTermYears, setLoanTermYears] = useState<number>(20);

  if (!isOpen) return null;

  const downPaymentAmount = (homePrice * downPaymentPercent) / 100;
  const loanAmount = homePrice - downPaymentAmount;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;

  const monthlyEMI =
    monthlyRate > 0
      ? (loanAmount *
          (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
      : loanAmount / numberOfPayments;

  const estimatedMaintenance = 3500;
  const totalMonthlyPayment = monthlyEMI + estimatedMaintenance;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#008374] flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0A2540]">Doctor Home Loan EMI Calculator</h3>
              <p className="text-xs text-slate-500">SBI, HDFC Bank & ICICI Bank Preferred Financing for Healthcare Professionals</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full border border-slate-200 text-slate-400 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Top highlight card */}
          <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                Estimated Monthly EMI
              </span>
              <span className="text-3xl font-extrabold text-[#008374]">
                ₹{Math.round(monthlyEMI).toLocaleString('en-IN')}
                <span className="text-xs text-slate-500 font-normal"> /month</span>
              </span>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-full shadow-xs border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Zero Processing Fee for Doctors
              </span>
            </div>
          </div>

          {/* Form Sliders & Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1.5">
                <span>Property Value</span>
                <span className="text-[#008374]">₹{homePrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="1500000"
                max="50000000"
                step="250000"
                value={homePrice}
                onChange={(e) => setHomePrice(Number(e.target.value))}
                className="w-full accent-[#008374] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1.5">
                <span>Down Payment ({downPaymentPercent}%)</span>
                <span className="text-[#008374]">₹{downPaymentAmount.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                step="5"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full accent-[#008374] cursor-pointer"
              />
              <span className="text-xs text-slate-400 block mt-1">
                *Up to 90% funding available for MBBS, MD, MS, DM, and MCh doctors.
              </span>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1.5">
                <span>Annual Interest Rate</span>
                <span className="text-[#008374]">{interestRate}%</span>
              </div>
              <input
                type="range"
                min="7.0"
                max="12.0"
                step="0.05"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-[#008374] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1.5">
                <span>Loan Tenure</span>
                <span className="text-[#008374]">{loanTermYears} Years</span>
              </div>
              <div className="flex gap-2">
                {[10, 15, 20, 25].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setLoanTermYears(term)}
                    className={`flex-1 py-1.5 rounded-lg font-bold border transition-all ${
                      loanTermYears === term
                        ? 'border-[#008374] bg-emerald-50 text-[#008374]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {term} Yrs
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Breakdown List */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <h4 className="font-bold text-slate-800 text-xs">Payment & Loan Breakdown:</h4>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-400 block font-semibold">Net Loan Amount</span>
                <span className="text-sm font-extrabold text-slate-800">₹{Math.round(loanAmount).toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-400 block font-semibold">Monthly EMI</span>
                <span className="text-sm font-extrabold text-[#008374]">₹{Math.round(monthlyEMI).toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-400 block font-semibold">Total Payable</span>
                <span className="text-sm font-extrabold text-slate-800">₹{Math.round(monthlyEMI * numberOfPayments).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Physician Perks */}
          <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
            <h4 className="font-bold text-[#0A2540] flex items-center gap-1.5 text-xs">
              <Stethoscope className="w-4 h-4 text-[#008374]" />
              Doctor Home Loan Advantages (SBI / HDFC / ICICI)
            </h4>
            <ul className="space-y-1 text-slate-600 text-xs">
              <li>✓ Concessional interest rate for medical practitioners and post-graduate residents</li>
              <li>✓ Minimal documentation with fast-track digital approval in 48 hours</li>
              <li>✓ Zero prepayment penalty on floating rate loans</li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <span className="text-xs text-slate-500">Need instant loan sanction?</span>
          <button
            onClick={() => {
              showToast('Loan assistance request submitted! Our banking partner will connect with you within 2 hours.', 'success');
              onClose();
            }}
            className="px-5 py-2.5 bg-[#008374] hover:bg-[#007063] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            Apply with Doctor Banking Desk
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
