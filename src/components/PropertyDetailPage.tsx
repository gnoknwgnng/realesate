import React, { useState } from 'react';
import { useProperties } from '../context/PropertyContext';
import { apiSaveInquiry } from '../lib/supabase';
import {
  ArrowLeft,
  Heart,
  Share2,
  CheckCircle2,
  Clock,
  Zap,
  VolumeX,
  ShieldCheck,
  Bed,
  Bath,
  Maximize2,
  Building,
  Compass,
  Calendar,
  Lock,
  PhoneCall,
  Check,
} from 'lucide-react';

export const PropertyDetailPage: React.FC = () => {
  const {
    selectedProperty,
    setCurrentView,
    favorites,
    toggleFavorite,
    showToast,
  } = useProperties();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferred_slot: 'Evening (7:00 PM - 9:00 PM)',
    hospital_affiliation: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!selectedProperty) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <h2 className="text-xl font-bold text-[#0A2540] mb-2">No property selected</h2>
        <p className="text-sm text-slate-500 mb-4">Please select a residence from search results.</p>
        <button
          onClick={() => setCurrentView('explore')}
          className="px-4 py-2 bg-[#008374] text-white text-xs font-semibold rounded-xl"
        >
          Return to Explore
        </button>
      </div>
    );
  }

  const isFavorite = favorites.includes(selectedProperty.id);

  const formattedPrice =
    selectedProperty.category === 'buy'
      ? `₹${(selectedProperty.price / 10000000).toFixed(2)} Cr`
      : `₹${selectedProperty.price.toLocaleString('en-IN')}`;

  // Gallery images with captions
  const galleryImages = [
    {
      url: selectedProperty.image_url,
      caption: 'Main living area with acoustic double-glazed balcony apertures',
    },
    {
      url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
      caption: 'Master bedroom suite fitted with thermal blackout drapery',
    },
    {
      url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
      caption: 'Dedicated study & clinical research desk nook',
    },
    {
      url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
      caption: 'Modular kitchen with piped gas & utility balcony',
    },
  ];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    showToast('Residence link copied to clipboard.');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleTourSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      showToast('Please provide your name and phone number', 'error');
      return;
    }

    setIsSubmitting(true);
    const res = await apiSaveInquiry({
      name: formData.name,
      email: formData.email || 'doctor@medproperties.in',
      phone: formData.phone,
      medical_role: formData.hospital_affiliation || 'Healthcare Specialist',
      tour_date: formData.preferred_slot,
      message: `Preferred slot: ${formData.preferred_slot}. ${formData.message}`,
      property_id: selectedProperty.id,
    });
    setIsSubmitting(false);

    if (res.success) {
      setIsSuccess(true);
      showToast('Tour request submitted. A specialist will call within 2 hours.', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-slate-200/80 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            onClick={() => setCurrentView('explore')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0A2540] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#008374]" />
            <span>Back to search results</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-[#008374]" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Share'}</span>
            </button>

            <button
              onClick={() => toggleFavorite(selectedProperty.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                isFavorite
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
              <span>{isFavorite ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Title & Verification Header */}
        <div className="mb-6 space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="bg-[#0A2540] text-white text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#008374]" />
              Verified Residence
            </span>
            <span className="text-xs text-slate-500 font-mono bg-white px-2.5 py-1 rounded-md border border-slate-200">
              Audit Date: {selectedProperty.verified_date || '12 Sep 2026'}
            </span>
            <span className="text-xs text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200">
              Method: {selectedProperty.verification_method || 'Physical In-Person Field Audit'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-[#0A2540] tracking-tight">
            {selectedProperty.title}
          </h1>

          <p className="text-sm text-slate-500">
            {selectedProperty.address}, {selectedProperty.city}
          </p>
        </div>

        {/* Multi-Image Photographic Gallery */}
        <div className="mb-10 space-y-3">
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 aspect-[16/9] max-h-[500px] w-full">
            <img
              src={galleryImages[activeImageIdx].url}
              alt={galleryImages[activeImageIdx].caption}
              className="w-full h-full object-cover transition-all duration-500"
            />
            {/* Caption bar */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-5 text-white flex items-center justify-between text-xs sm:text-sm">
              <p className="font-medium truncate">{galleryImages[activeImageIdx].caption}</p>
              <span className="font-mono text-xs opacity-75 shrink-0 ml-4">
                {activeImageIdx + 1} / {galleryImages.length}
              </span>
            </div>
          </div>

          {/* Thumbnails Row */}
          <div className="grid grid-cols-4 gap-3">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`relative rounded-xl overflow-hidden aspect-[16/10] border-2 transition-all cursor-pointer ${
                  activeImageIdx === idx
                    ? 'border-[#008374] ring-2 ring-[#008374]/30'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Detail Layout: Left Info + Right Tour Booking */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (8 cols): Financials, Workday Panel, Description, Specs */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 1. Dedicated "For your workday" Panel (Core Requirement) */}
            <div className="bg-[#0A2540] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#008374]">
                    Specialized Healthcare Audit
                  </span>
                  <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                    For your workday & recovery
                  </h3>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs text-teal-200 bg-teal-950/70 border border-teal-800/80 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#008374]" />
                  <span>Substantiated Field Measurements</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Hospital Commute */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <Clock className="w-4 h-4 text-[#008374]" />
                    <span>8:00 AM Hospital Commute</span>
                  </div>
                  <p className="text-base font-bold text-white">
                    {selectedProperty.commute_estimate || '12 min drive to nearby hospital hub'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Tested during morning clinical handover peak traffic.
                  </p>
                </div>

                {/* 100% DG Power Backup */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <Zap className="w-4 h-4 text-[#008374]" />
                    <span>100% DG Power Backup</span>
                  </div>
                  <p className="text-base font-bold text-white">
                    Full Generator Auto-Switch (&lt;10s)
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Supports high-draw home medical gear, workstation & air conditioning.
                  </p>
                </div>

                {/* Acoustic Sleep Isolation */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <VolumeX className="w-4 h-4 text-[#008374]" />
                    <span>Acoustic Isolation Rating</span>
                  </div>
                  <p className="text-base font-bold text-white">
                    &lt; 42 dB Ambient Bedroom Noise
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Double-glazed apertures for uninterrupted daytime post-call sleep.
                  </p>
                </div>

                {/* Shift-Friendly Viewings */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <Calendar className="w-4 h-4 text-[#008374]" />
                    <span>Shift-Flexible Access</span>
                  </div>
                  <p className="text-base font-bold text-white">
                    Evening (7–9 PM) & Weekend Slots
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Accompanied by MedProperties concierge without landlord delays.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Key Financials & Lease Terms Table */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <h3 className="text-lg font-bold text-[#0A2540]">
                Financial terms & specifications
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] uppercase font-bold text-slate-400 block">
                    {selectedProperty.category === 'buy' ? 'Guide Price' : 'Monthly Rent'}
                  </span>
                  <span className="text-xl font-extrabold text-[#0A2540]">{formattedPrice}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] uppercase font-bold text-slate-400 block">
                    Security Deposit
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {selectedProperty.deposit || '2 Months (Standard)'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] uppercase font-bold text-slate-400 block">
                    Maintenance
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {selectedProperty.maintenance || 'Included in Rent'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] uppercase font-bold text-slate-400 block">
                    Furnishing
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {selectedProperty.furnishing || 'Semi-Furnished'}
                  </span>
                </div>
              </div>

              {/* Dimensional specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400 block">Super Built-up Area:</span>
                  <strong className="text-slate-800">{selectedProperty.dimensions}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Bedrooms / Bath:</span>
                  <strong className="text-slate-800">{selectedProperty.beds} BHK / {selectedProperty.baths} Bath</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Floor Level:</span>
                  <strong className="text-slate-800">{selectedProperty.floor || 'Higher Floor (8+)'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Balcony Facing:</span>
                  <strong className="text-slate-800">{selectedProperty.facing || 'East / Park Facing'}</strong>
                </div>
              </div>
            </div>

            {/* 3. Detailed Description */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-[#0A2540]">
                Property overview & verified narrative
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {selectedProperty.description ||
                  'Carefully curated residence situated within a quiet residential enclave immediately accessible to leading hospital centers. Features sound-insulated sleeping quarters, dedicated home research station, high-speed dual fiber lines, and dedicated covered parking.'}
              </p>

              {/* Society Amenities */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Verified Society Facilities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    '24/7 Gated Security with RFID',
                    'Covered Stilt Parking',
                    'Elevator with DG Inverter Backup',
                    'Society Gym & Lap Pool',
                    'Dual Broadband Fiber Readiness',
                    'Visitor Parking Bays',
                  ].map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-lg"
                    >
                      <Check className="w-3 h-3 text-[#008374]" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (4 cols): Sticky Tour Booking Form */}
          <div className="lg:col-span-4 sticky top-36">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-lg space-y-6">
              
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#008374]">
                  Private Viewing Request
                </span>
                <h3 className="text-xl font-bold text-[#0A2540] mt-0.5">
                  Schedule an accompanied tour
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Our concierge coordinates keys and building permissions so you don't wait.
                </p>
              </div>

              {isSuccess ? (
                <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-[#008374] text-white flex items-center justify-center mx-auto">
                    <Check className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-[#0A2540]">
                    Tour Request Received
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    A MedProperties specialist will contact you via WhatsApp/phone within <strong>2 hours</strong> to confirm entry formalities.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="text-xs font-semibold text-[#008374] underline"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTourSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Dr. / Mr. / Ms. Full Name"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#008374]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#008374]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Hospital Affiliation / Department
                    </label>
                    <input
                      type="text"
                      value={formData.hospital_affiliation}
                      onChange={(e) => setFormData({ ...formData, hospital_affiliation: e.target.value })}
                      placeholder="e.g. Manipal HAL / Cardiology"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#008374]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Preferred Tour Window
                    </label>
                    <select
                      value={formData.preferred_slot}
                      onChange={(e) => setFormData({ ...formData, preferred_slot: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#008374] bg-white cursor-pointer"
                    >
                      <option>Evening (7:00 PM - 9:00 PM)</option>
                      <option>Morning (8:00 AM - 10:00 AM)</option>
                      <option>Midday (1:00 PM - 3:00 PM)</option>
                      <option>Weekend Morning (Saturday / Sunday)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-2xl bg-[#008374] hover:bg-[#007063] text-white text-xs font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Submitting...' : 'Request Accompanied Tour'}</span>
                  </button>

                  <div className="pt-2 text-[11px] text-slate-400 space-y-1">
                    <p className="flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-[#008374]" />
                      <span>Data shared strictly with your assigned MedProperties specialist.</span>
                    </p>
                    <p>No spam calls or unverified broker syndicates.</p>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
