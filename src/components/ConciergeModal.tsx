import React, { useState } from 'react';
import { useProperties } from '../context/PropertyContext';
import { apiSaveInquiry } from '../lib/supabase';
import { X, PhoneCall, ShieldCheck, CheckCircle2, Clock, Lock } from 'lucide-react';

export const ConciergeModal: React.FC = () => {
  const { isConciergeOpen, setIsConciergeOpen, showToast } = useProperties();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    hospital: '',
    role: 'Physician / Specialist',
    timeline: 'Within 30 days',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isConciergeOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      showToast('Please provide your name and phone number', 'error');
      return;
    }

    setIsSubmitting(true);
    await apiSaveInquiry({
      name: formData.name,
      email: formData.email || 'doctor@medproperties.in',
      phone: formData.phone,
      medical_role: `${formData.role} - Hospital: ${formData.hospital || 'Unspecified'}`,
      tour_date: formData.timeline,
      message: `Relocation inquiry. Target hospital: ${formData.hospital}. Timeline: ${formData.timeline}. Notes: ${formData.notes}`,
      property_id: 'concierge-relocation',
    });
    setIsSubmitting(false);
    setIsSuccess(true);
    showToast('Your request has been registered with our senior relocation specialist.', 'success');
  };

  const handleClose = () => {
    setIsConciergeOpen(false);
    setIsSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0A2540]/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-[#008374]">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0A2540]">
                Talk through your move
              </h3>
              <p className="text-xs text-slate-500">
                Personalized relocation assistance for medical professionals
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-full border border-slate-200 text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-teal-50 border border-teal-200 text-[#008374] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-[#0A2540]">
                  Relocation Request Registered
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Our senior relocation coordinator will review nearby verified inventory and reach out to you via WhatsApp or call within <strong>2 business hours</strong>.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 text-left space-y-1">
                <p className="font-semibold text-slate-700">Next Steps:</p>
                <p>1. We confirm your hospital rotation or fellowship commute perimeter.</p>
                <p>2. We assemble 3 audited residences matching your quiet-hour & DG backup criteria.</p>
                <p>3. We coordinate flexible evening or weekend accompanied viewing passes.</p>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 rounded-xl bg-[#008374] text-white text-xs font-bold hover:bg-[#007063] transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Dr. / Mr. / Ms."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#008374]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Phone Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#008374]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Target Hospital or Institution
                  </label>
                  <input
                    type="text"
                    value={formData.hospital}
                    onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                    placeholder="e.g. Manipal, AIIMS, Apollo"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#008374]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Move-in Target
                  </label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#008374] bg-white cursor-pointer"
                  >
                    <option>Immediately (Within 7 days)</option>
                    <option>Within 30 days</option>
                    <option>Within 60 days</option>
                    <option>Next Rotation / Semester</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Specific Requirements or Shift Constraints
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Need sound-isolated study room, 2 BHK, covered parking, night-shift viewing"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#008374] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-[#008374] hover:bg-[#007063] text-white text-xs font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
              >
                <span>{isSubmitting ? 'Registering...' : 'Request Specialist Callback'}</span>
              </button>

              <div className="pt-2 text-[11px] text-slate-400 space-y-1 text-center">
                <p className="flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3 text-[#008374]" />
                  <span>Strictly confidential. No third-party broker broadcasts.</span>
                </p>
                <p>Standard response SLA: within 2 business hours.</p>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
