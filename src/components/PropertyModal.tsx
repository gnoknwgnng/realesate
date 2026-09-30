import React, { useState } from 'react';
import { useProperties } from '../context/PropertyContext';
import { apiSaveInquiry } from '../lib/supabase';
import { InquiryFormData } from '../types';
import {
  X,
  Bed,
  Bath,
  Maximize2,
  Heart,
  Sparkles,
  MapPin,
  Calendar,
  Phone,
  Mail,
  User,
  Stethoscope,
  CheckCircle2,
  Calculator,
  ShieldCheck,
} from 'lucide-react';

export const PropertyModal: React.FC = () => {
  const {
    selectedProperty,
    setSelectedProperty,
    favorites,
    toggleFavorite,
    showToast,
  } = useProperties();

  const [formData, setFormData] = useState<Omit<InquiryFormData, 'property_id'>>({
    name: '',
    email: '',
    phone: '',
    medical_role: 'Resident Physician',
    tour_date: '',
    message: 'Hello, I am interested in scheduling a physician relocation tour for this property.',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!selectedProperty) return null;

  const isFavorite = favorites.includes(selectedProperty.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      showToast('Please provide your name and email', 'error');
      return;
    }

    setIsSubmitting(true);
    const res = await apiSaveInquiry({
      ...formData,
      property_id: selectedProperty.id,
    });
    setIsSubmitting(false);

    if (res.success) {
      setIsSuccess(true);
      showToast(res.message, 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-100">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase font-extrabold tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded-md">
              For {selectedProperty.category}
            </span>
            <h3 className="text-lg font-bold text-navy-900 truncate">
              {selectedProperty.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(selectedProperty.id)}
              className={`p-2 rounded-full border transition-all ${
                isFavorite
                  ? 'bg-rose-50 border-rose-200 text-rose-500'
                  : 'border-slate-200 text-slate-400 hover:text-rose-500'
              }`}
              title="Save property"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => setSelectedProperty(null)}
              className="p-2 rounded-full border border-slate-200 text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          
          {/* Main Visual */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#008374] text-white">
                Photo Gallery
              </span>

              {selectedProperty.is_popular && (
                <div className="bg-purple-100 text-indigo-700 text-xs font-extrabold px-3 py-1 rounded-lg flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  POPULAR LISTING
                </div>
              )}
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-slate-900 border border-slate-100 shadow-inner">
              <img
                src={selectedProperty.image_url}
                alt={selectedProperty.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Pricing & Specs */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Left Info */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#008374]">
                    ₹{selectedProperty.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm font-semibold text-slate-400">
                    /{selectedProperty.period || 'month'}
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-navy-900 mt-1">
                  {selectedProperty.title}
                </h2>
                <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                  <MapPin className="w-4 h-4 text-[#008374] shrink-0" />
                  {selectedProperty.address}
                </p>
              </div>

              {/* Specs Chips */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-700">
                  <Bed className="w-4 h-4 text-[#008374]" />
                  {selectedProperty.beds} BHK
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-700">
                  <Bath className="w-4 h-4 text-[#008374]" />
                  {selectedProperty.baths} Bathrooms
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-700">
                  <Maximize2 className="w-4 h-4 text-[#008374]" />
                  {selectedProperty.dimensions}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 pt-2">
                <h4 className="text-sm font-bold text-navy-900">Property Overview</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {selectedProperty.description ||
                    'Premium residential relocation residence optimized for medical professionals, attending physicians, and hospital fellows.'}
                </p>
              </div>

              {/* Healthcare Specific Perks */}
              <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <Stethoscope className="w-4 h-4 text-[#008374]" />
                  Healthcare Concierge Highlights
                </div>
                <div className="text-xs text-slate-700 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#008374] shrink-0" />
                    <span>
                      {selectedProperty.hospital_distance || 'Within 10-minute emergency on-call commute'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#008374] shrink-0" />
                    <span>Eligible for Doctor Home Loan with SBI / HDFC Bank tie-ups</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#008374] shrink-0" />
                    <span>Flexible lease agreement aligned with residency & medical rotation</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Booking / Inquiry Form */}
            <div className="md:col-span-5 bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
              <h4 className="font-extrabold text-navy-900 text-sm mb-1">
                Schedule a Private Tour
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Exclusive service for medical doctors and healthcare staff.
              </p>

              {isSuccess ? (
                <div className="text-center py-6 space-y-3 bg-emerald-50 rounded-xl border border-emerald-200 p-4 animate-in fade-in">
                  <CheckCircle2 className="w-10 h-10 text-brand-700 mx-auto" />
                  <h5 className="font-bold text-navy-900 text-sm">Tour Request Sent!</h5>
                  <p className="text-xs text-slate-600">
                    A dedicated medical relocation specialist will reach out within 2 hours.
                  </p>
                  <div className="pt-2 flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsSuccess(false)}
                      className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Send Another Note
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedProperty(null)}
                      className="px-5 py-2 bg-[#008374] hover:bg-[#007063] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="Dr. Rajesh Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 bg-white rounded-xl text-xs font-semibold border border-slate-200 focus:outline-none focus:border-brand-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="doctor@aiims.edu / hospital.org"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 bg-white rounded-xl text-xs font-semibold border border-slate-200 focus:outline-none focus:border-brand-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Phone Number (+91)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 bg-white rounded-xl text-xs font-semibold border border-slate-200 focus:outline-none focus:border-brand-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">
                        Role
                      </label>
                      <select
                        value={formData.medical_role}
                        onChange={(e) => setFormData({ ...formData, medical_role: e.target.value })}
                        className="w-full px-2 py-2 bg-white rounded-xl text-xs font-semibold border border-slate-200 focus:outline-none focus:border-brand-700 cursor-pointer"
                      >
                        <option value="Junior Resident / DNB">Resident (JR / DNB)</option>
                        <option value="Senior Resident / Fellow">Fellow / Senior Resident</option>
                        <option value="Consultant Physician">Consultant Physician</option>
                        <option value="Surgeon / Specialist">Surgeon / Specialist</option>
                        <option value="Nursing / Hospital Staff">Nursing / Hospital Staff</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={formData.tour_date}
                        onChange={(e) => setFormData({ ...formData, tour_date: e.target.value })}
                        className="w-full px-2 py-2 bg-white rounded-xl text-xs font-semibold border border-slate-200 focus:outline-none focus:border-brand-700"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending Request...' : 'Request Tour / Info'}
                  </button>
                </form>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
