import React, { useState } from 'react';
import { useProperties } from '../context/PropertyContext';
import { apiSaveLead } from '../lib/supabase';
import { X, Building2, DollarSign, CheckCircle2, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

interface SellValuationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SellValuationModal: React.FC = () => {
  const { isSellModalOpen, setIsSellModalOpen, showToast } = useProperties();
  const [address, setAddress] = useState('');
  const [propertyType, setPropertyType] = useState('Single Family Home');
  const [bedrooms, setBedrooms] = useState('4');
  const [estimatedValue, setEstimatedValue] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');

  if (!isSellModalOpen) return null;

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    // Realistic valuation simulation based on bedrooms and Indian metro real estate
    const base = 7500000;
    const bedBonus = parseInt(bedrooms, 10) * 2000000;
    const randomVariance = Math.floor(Math.random() * 500000);
    const calculated = base + bedBonus + randomVariance;
    setEstimatedValue(calculated);
  };

  const handleRequestOffer = async () => {
    if (!email || !email.includes('@')) {
      showToast('Please enter your email to receive your official cash offer.', 'error');
      return;
    }
    setIsSubmitting(true);
    await apiSaveLead(email);
    setIsSubmitting(false);
    showToast('Offer request submitted! An acquisition specialist will reach out within 4 hours.');
    setIsSellModalOpen(false);
    setEstimatedValue(null);
    setAddress('');
    setEmail('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#008374] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0A2540]">Sell or Value Your Property</h3>
              <p className="text-xs text-slate-500">Instant Valuation & Guaranteed Physician Network Placement</p>
            </div>
          </div>
          <button
            onClick={() => setIsSellModalOpen(false)}
            className="p-1.5 rounded-full border border-slate-200 text-slate-400 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          
          {!estimatedValue ? (
            <form onSubmit={handleCalculate} className="space-y-4">
              <p className="text-slate-600 leading-relaxed">
                Thinking of selling or renting to verified medical professionals? Enter your address to calculate your property's value and rental yield.
              </p>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Property Street Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 104 Indiranagar 100ft Road, Bengaluru, KA"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl font-semibold border border-slate-200 focus:outline-none focus:border-[#008374]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Property Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl font-semibold border border-slate-200 focus:outline-none focus:border-[#008374]"
                  >
                    <option value="Single Family Home">Independent House / Villa</option>
                    <option value="Luxury Villa">Gated Community Villa</option>
                    <option value="Townhouse">Row House</option>
                    <option value="Condo">Apartment / Flat</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bedrooms</label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl font-semibold border border-slate-200 focus:outline-none focus:border-[#008374]"
                  >
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4 BHK</option>
                    <option value="5">5+ BHK</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#008374] hover:bg-[#007063] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
              >
                <TrendingUp className="w-4 h-4" />
                Calculate Instant Valuation
              </button>
            </form>
          ) : (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Estimated Market Value
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#008374]">
                  ₹{estimatedValue.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-emerald-700 font-medium">
                  Estimated Guaranteed Physician Monthly Rent: <strong>₹{Math.round(estimatedValue * 0.0035).toLocaleString('en-IN')}/month</strong>
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 text-xs">Receive Official Cash Offer or List Guaranteed:</h4>
                <div className="space-y-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl font-semibold border border-slate-200 focus:outline-none focus:border-[#008374]"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEstimatedValue(null)}
                      className="px-4 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50"
                    >
                      Recalculate
                    </button>
                    <button
                      type="button"
                      onClick={handleRequestOffer}
                      disabled={isSubmitting}
                      className="flex-1 py-2.5 bg-[#008374] hover:bg-[#007063] text-white font-bold rounded-xl shadow-sm transition-all"
                    >
                      {isSubmitting ? 'Submitting...' : 'Request Cash Offer'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#008374]" />
                  Zero Commission Option
                </div>
                <p>We match your home directly with incoming hospital chiefs, attendings, and fellows.</p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
