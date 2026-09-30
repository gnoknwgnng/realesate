import React, { useState } from 'react';
import { apiSaveLead } from '../lib/supabase';
import { useProperties } from '../context/PropertyContext';
import { Check } from 'lucide-react';

export const LandlordCta: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { showToast } = useProperties();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    setIsSubmitting(true);
    const res = await apiSaveLead(email.trim());
    setIsSubmitting(false);

    if (res.success) {
      setIsSubmitted(true);
      showToast(res.message, 'success');
      setEmail('');
    } else {
      showToast('Error saving lead, please try again.', 'error');
    }
  };

  return (
    <section id="landlord-section" className="py-20 bg-[#0E3B43] text-white text-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        
        {/* No Spam Promise Pill matching ui.pdf */}
        <div className="inline-block text-xs font-semibold text-[#2DD4BF] tracking-wide">
          No Spam Promise
        </div>

        {/* Heading matching ui.pdf */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
          Are you a landlord?
        </h2>

        {/* Subtitle matching ui.pdf */}
        <p className="text-xs sm:text-sm text-cyan-100/80 max-w-lg mx-auto font-normal">
          Discover ways to increase your home's value and get listed. No Spam.
        </p>

        {/* Input Form matching ui.pdf */}
        <div className="pt-2 max-w-md mx-auto">
          {isSubmitted ? (
            <div className="bg-emerald-500/20 border border-emerald-400/40 rounded-xl p-3 flex items-center justify-center gap-2 text-emerald-200 text-xs font-semibold">
              <Check className="w-4 h-4 text-emerald-400" />
              Thank you! You have been added to our landlord network.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2 bg-white rounded-xl p-1.5 shadow-lg">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-2.5 bg-transparent text-slate-800 placeholder-slate-400 text-xs sm:text-sm focus:outline-none"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#008374] hover:bg-[#007063] text-white font-bold text-xs sm:text-sm rounded-lg transition-all whitespace-nowrap disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          )}
        </div>

        {/* Footnote */}
        <p className="text-[11px] text-cyan-200/60 font-normal pt-1">
          Join 10,000+ verified landlords across India in our healthcare housing network.
        </p>

      </div>
    </section>
  );
};
