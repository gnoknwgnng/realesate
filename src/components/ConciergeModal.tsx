import React, { useState } from 'react';
import { useProperties } from '../context/PropertyContext';
import { apiSaveInquiry } from '../lib/supabase';
import { X, PhoneCall, ShieldCheck, CheckCircle2, Clock, Lock } from 'lucide-react';

export const ConciergeModal: React.FC = () => {
  const { isConciergeOpen, setIsConciergeOpen, showToast, user } = useProperties();

  const [formData, setFormData] = useState({
    name: user?.full_name || '',
    phone: '',
    email: user?.email || '',
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
      email: formData.email || user?.email || '',
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0A2540]/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200/90 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-[#008374] shadow-xs">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-[#0A2540]">
                  Physician Relocation Concierge
                </h3>
                <span className="text-[10px] font-bold bg-teal-50 text-[#008374] px-2 py-0.5 rounded-full border border-teal-200">
                  Free
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Dedicated assistance calibrated around your hospital shift rotation
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-full border border-slate-200 text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {isSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 text-[#008374] flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-[#0A2540]">
                  Relocation Request Registered
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Our senior relocation coordinator will review nearby audited inventory and reach out to you via WhatsApp or call within <strong>2 business hours</strong>.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-600 text-left space-y-2">
                <p className="font-bold text-[#0A2540] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#008374]" />
                  <span>Next Steps for Your Move:</span>
                </p>
                <p>1. We confirm your hospital rotation or fellowship commute perimeter.</p>
                <p>2. We assemble 3 audited residences matching your quiet-hour & DG backup criteria.</p>
                <p>3. We coordinate flexible evening or post-call accompanied viewing passes.</p>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 rounded-xl bg-[#008374] text-white text-xs font-bold hover:bg-[#007063] transition-colors cursor-pointer shadow-md"
              >
                Return to Exploration
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Clinical Role Preset Chips */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">
                  Clinical Designation
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {[
                    'Resident / PG',
                    'Consultant',
                    'Fellow / HOD',
                    'Healthcare Admin',
                  ].map((roleTitle) => (
                    <button
                      key={roleTitle}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: roleTitle })}
                      className={`py-1.5 px-2 rounded-xl text-center border text-[11px] font-semibold transition-all cursor-pointer ${
                        formData.role === roleTitle
                          ? 'border-[#008374] bg-teal-50 text-[#008374] font-bold shadow-xs'
                          : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      {roleTitle}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Rajesh Sharma"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#008374] text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Phone (WhatsApp Priority) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#008374] text-xs font-medium"
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
                    placeholder="e.g. Manipal, AIIMS, Apollo, Lilavati"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#008374] text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Relocation Timeline
                  </label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#008374] text-xs font-medium bg-white cursor-pointer"
                  >
                    <option value="Immediate (Within 10 days)">Immediate (Within 10 days)</option>
                    <option value="Within 30 days">Within 30 days</option>
                    <option value="Next Rotation (60 days)">Next Rotation (60 days)</option>
                    <option value="Exploring for later">Exploring for later</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Specific Shift Constraints or Quiet Requirements
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Need sound-isolated study room, 2 BHK, covered parking, night-shift viewing"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#008374] resize-none text-xs font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-[#008374] hover:bg-[#007063] text-white text-xs font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
              >
                <span>{isSubmitting ? 'Registering with Concierge...' : 'Request Specialist Callback & Viewing'}</span>
              </button>

              <div className="pt-2 text-[11px] text-slate-400 space-y-1 text-center">
                <p className="flex items-center justify-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#008374]" />
                  <span>Strictly confidential. No spam or commercial broker broadcasts.</span>
                </p>
                <p>Standard doctor inquiry response SLA: within 2 business hours.</p>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
