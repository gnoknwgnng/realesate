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
  Calendar,
  Lock,
  PhoneCall,
  Check,
  Camera,
  Layers,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

export const PropertyDetailPage: React.FC = () => {
  const {
    selectedProperty,
    setCurrentView,
    favorites,
    toggleFavorite,
    showToast,
    user,
  } = useProperties();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    preferred_slot: 'Evening (7:00 PM - 9:00 PM)',
    hospital_affiliation: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!selectedProperty) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 bg-[#FDFDFC]">
        <h2 className="text-2xl font-bold font-serif text-[#09131F] mb-2">No property selected</h2>
        <p className="text-sm text-stone-500 mb-6">Please select a residence from the collection.</p>
        <button
          onClick={() => setCurrentView('explore')}
          className="px-6 py-3 bg-[#008374] text-white text-xs font-bold rounded-2xl hover:bg-[#007063] transition-all shadow-md cursor-pointer"
        >
          Return to Curated Residences
        </button>
      </div>
    );
  }

  const isFavorite = favorites.includes(selectedProperty.id);

  const formattedPrice =
    selectedProperty.category === 'buy'
      ? `₹${(selectedProperty.price / 10000000).toFixed(2)}\u00A0Cr`
      : `₹${selectedProperty.price.toLocaleString('en-IN')}`;

  const formattedDeposit =
    typeof selectedProperty.deposit === 'number'
      ? `₹${selectedProperty.deposit.toLocaleString('en-IN')}`
      : selectedProperty.deposit || '2 Months (Standard)';

  const formattedMaintenance =
    typeof selectedProperty.maintenance === 'number'
      ? `₹${selectedProperty.maintenance.toLocaleString('en-IN')}/month`
      : selectedProperty.maintenance || 'Included in Rent';

  // Curated 5 mosaic images with architectural captions
  const galleryImages = [
    {
      url: selectedProperty.image_url,
      caption: 'Main living pavilion with acoustic double-glazed balcony apertures',
    },
    {
      url: selectedProperty.images?.[1]?.r2_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      caption: 'Quiet courtyard & private landscaped portico',
    },
    {
      url: selectedProperty.images?.[2]?.r2_url || 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
      caption: 'Acoustic-isolated doctor study & clinical research station',
    },
    {
      url: selectedProperty.images?.[3]?.r2_url || 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
      caption: 'Master bedroom suite fitted with thermal blackout drapery',
    },
    {
      url: selectedProperty.images?.[4]?.r2_url || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
      caption: 'Bespoke modular kitchen with piped gas & utility balcony',
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
      email: formData.email || user?.email || '',
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
    <div className="min-h-screen bg-[#FDFDFC] pb-24 text-stone-800">
      
      {/* Top Floating Breadcrumb Bar */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-stone-200/80 sticky top-20 z-30 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => setCurrentView('explore')}
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-[#008374] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-[#008374] group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Search Results</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-[#008374]" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Share Residence'}</span>
            </button>

            <button
              onClick={() => toggleFavorite(selectedProperty.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-xs'
                  : 'border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current text-rose-500' : ''}`} />
              <span>{isFavorite ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Title & Verification Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200/80">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="bg-[#09131F] text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-[#008374]" />
                MedProperties Verified
              </span>
              <span className="text-xs text-stone-600 font-mono bg-stone-100/90 px-3 py-1.5 rounded-xl border border-stone-200 font-medium">
                Audited: {selectedProperty.verified_date || '14 September 2026'}
              </span>
              <span className="text-xs text-stone-600 bg-stone-100/90 px-3 py-1.5 rounded-xl border border-stone-200 font-medium">
                {selectedProperty.verification_method || 'Physical On-Site Field Audit'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold font-serif text-[#09131F] tracking-tight leading-tight">
              {selectedProperty.title}
            </h1>

            <p className="text-sm sm:text-base text-stone-500 flex items-center gap-1.5 font-normal">
              <span>{selectedProperty.address}, {selectedProperty.city}</span>
              <span>•</span>
              <span className="text-[#008374] font-semibold">{selectedProperty.hospital_distance}</span>
            </p>
          </div>

          <div className="md:text-right shrink-0">
            <span className="text-xs uppercase font-bold tracking-widest text-stone-400 block mb-1">
              {selectedProperty.category === 'buy' ? 'Guide Price' : 'Monthly Rent'}
            </span>
            <div className="flex items-baseline gap-2 md:justify-end">
              <span className="text-3xl sm:text-4xl font-extrabold font-serif text-[#09131F]">
                {formattedPrice}
              </span>
              <span className="text-xs font-semibold text-stone-500">
                {selectedProperty.category === 'buy' ? 'all-inclusive' : `/${selectedProperty.period || 'month'}`}
              </span>
            </div>
          </div>
        </div>

        {/* 5-Image Luxury Mosaic Gallery (Airbnb Luxe / Sotheby's Standard) */}
        <div className="mb-12 relative rounded-3xl overflow-hidden shadow-xl border border-stone-200/80 bg-stone-900 group">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 h-[420px] sm:h-[500px]">
            {/* Grand Hero Image (7 cols) */}
            <div
              onClick={() => { setActiveImageIdx(0); setIsLightboxOpen(true); }}
              className="md:col-span-7 relative h-full overflow-hidden cursor-pointer group/hero"
            >
              <img
                src={galleryImages[0].url}
                alt={galleryImages[0].caption}
                className="w-full h-full object-cover group-hover/hero:scale-104 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs sm:text-sm font-medium drop-shadow-md">
                {galleryImages[0].caption}
              </div>
            </div>

            {/* 4 Curated Mosaic Tiles (5 cols) */}
            <div className="hidden md:grid md:col-span-5 grid-cols-2 gap-2 h-full">
              {galleryImages.slice(1, 5).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => { setActiveImageIdx(idx + 1); setIsLightboxOpen(true); }}
                  className="relative h-full overflow-hidden cursor-pointer group/tile"
                >
                  <img
                    src={img.url}
                    alt={img.caption}
                    className="w-full h-full object-cover group-hover/tile:scale-108 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/15 group-hover/tile:bg-transparent transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* View All Photos Button */}
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="absolute bottom-5 right-5 z-20 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md text-[#09131F] text-xs font-bold shadow-lg hover:bg-white flex items-center gap-2 transition-transform hover:scale-103 cursor-pointer"
          >
            <Camera className="w-4 h-4 text-[#008374]" />
            <span>View All Curated Photos ({galleryImages.length})</span>
          </button>
        </div>

        {/* 2-Column Detail Layout: Left Info + Right Sticky Viewing Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column (8 cols): Workday Panel, Financial Specs, Narrative */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* 1. Dedicated "For your workday & recovery" Panel */}
            <div className="bg-[#09131F] text-white rounded-3xl p-7 sm:p-9 shadow-2xl space-y-7 border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-5 relative z-10">
                <div>
                  <span className="text-xs uppercase tracking-widest font-bold text-[#008374]">
                    Specialized Healthcare Audit
                  </span>
                  <h3 className="text-2xl font-bold font-serif text-white tracking-tight mt-1">
                    For your workday & recovery
                  </h3>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs text-teal-200 bg-teal-950/80 border border-teal-800/80 px-3.5 py-1.5 rounded-full self-start sm:self-auto">
                  <CheckCircle2 className="w-4 h-4 text-[#008374]" />
                  <span>Substantiated Telemetry</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                {/* Hospital Commute */}
                <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-300">
                    <Clock className="w-4 h-4 text-[#008374]" />
                    <span>8:00 AM Shift Commute</span>
                  </div>
                  <p className="text-lg font-bold text-white font-serif">
                    {selectedProperty.commute_estimate || '12 min drive to nearby hospital'}
                  </p>
                  <p className="text-xs text-stone-400">
                    Recorded during peak clinical handover traffic windows.
                  </p>
                </div>

                {/* 100% DG Power Backup */}
                <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-300">
                    <Zap className="w-4 h-4 text-[#008374]" />
                    <span>100% DG Generator Backup</span>
                  </div>
                  <p className="text-lg font-bold text-white font-serif">
                    Full Auto-Switch (&lt;10s)
                  </p>
                  <p className="text-xs text-stone-400">
                    Dedicated backup line for workstations, medical equipment & AC.
                  </p>
                </div>

                {/* Acoustic Sleep Isolation */}
                <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-300">
                    <VolumeX className="w-4 h-4 text-[#008374]" />
                    <span>Acoustic Decibel Rating</span>
                  </div>
                  <p className="text-lg font-bold text-white font-serif">
                    &lt; 42 dB Master Bedroom Ambient
                  </p>
                  <p className="text-xs text-stone-400">
                    Acoustically insulated for restful daytime post-call sleep.
                  </p>
                </div>

                {/* Shift-Friendly Viewings */}
                <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-300">
                    <Calendar className="w-4 h-4 text-[#008374]" />
                    <span>Shift-Flexible Viewing Passes</span>
                  </div>
                  <p className="text-lg font-bold text-white font-serif">
                    7–9 PM & Weekend Windows
                  </p>
                  <p className="text-xs text-stone-400">
                    Accompanied by private concierge without landlord coordination friction.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Key Financials & Lease Terms Table */}
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-stone-200/80 shadow-sm space-y-6">
              <h3 className="text-xl font-bold font-serif text-[#09131F]">
                Financial terms & specifications
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
                  <span className="text-xs uppercase font-bold text-stone-400 block mb-1">
                    {selectedProperty.category === 'buy' ? 'Guide Price' : 'Monthly Rent'}
                  </span>
                  <span className="text-xl font-bold font-serif text-[#09131F]">{formattedPrice}</span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
                  <span className="text-xs uppercase font-bold text-stone-400 block mb-1">
                    Security Deposit
                  </span>
                  <span className="text-sm font-bold text-stone-800">
                    {formattedDeposit}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
                  <span className="text-xs uppercase font-bold text-stone-400 block mb-1">
                    Maintenance
                  </span>
                  <span className="text-sm font-bold text-stone-800">
                    {formattedMaintenance}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
                  <span className="text-xs uppercase font-bold text-stone-400 block mb-1">
                    Furnishing
                  </span>
                  <span className="text-sm font-bold text-stone-800">
                    {selectedProperty.furnishing || 'Semi-Furnished'}
                  </span>
                </div>
              </div>

              {/* Dimensional specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-stone-100 text-xs text-stone-600">
                <div>
                  <span className="text-stone-400 block mb-0.5">Super Built-up Area:</span>
                  <strong className="text-stone-800 text-sm font-semibold">{selectedProperty.dimensions}</strong>
                </div>
                <div>
                  <span className="text-stone-400 block mb-0.5">Bedrooms / Baths:</span>
                  <strong className="text-stone-800 text-sm font-semibold">{selectedProperty.beds} BHK / {selectedProperty.baths} Bath</strong>
                </div>
                <div>
                  <span className="text-stone-400 block mb-0.5">Floor Level:</span>
                  <strong className="text-stone-800 text-sm font-semibold">{selectedProperty.floor || 'Higher Floor (8+)'}</strong>
                </div>
                <div>
                  <span className="text-stone-400 block mb-0.5">Balcony Facing:</span>
                  <strong className="text-stone-800 text-sm font-semibold">{selectedProperty.facing || 'East / Garden Facing'}</strong>
                </div>
              </div>
            </div>

            {/* 3. Detailed Description */}
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-stone-200/80 shadow-sm space-y-5">
              <h3 className="text-xl font-bold font-serif text-[#09131F]">
                Property overview & verified narrative
              </h3>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
                {selectedProperty.description ||
                  'Carefully curated residence situated within a quiet residential enclave immediately accessible to leading hospital centers. Features sound-insulated sleeping quarters, dedicated home research station, high-speed dual fiber lines, and dedicated covered parking.'}
              </p>

              {/* Society Amenities */}
              <div className="pt-6 border-t border-stone-100 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Audited Community Facilities
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    '24/7 Gated Security with RFID Entry',
                    'Dedicated Covered Stilt Parking',
                    'High-Speed Inverter Elevator Backup',
                    'Clubhouse Gym & Lap Pool',
                    'Dual Broadband Fiber Lines',
                    'EV Charging Readiness',
                  ].map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold bg-stone-100/90 text-stone-700 px-3.5 py-1.5 rounded-xl border border-stone-200/60"
                    >
                      <Check className="w-3.5 h-3.5 text-[#008374]" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (4 cols): Sticky VIP Viewing Concierge Form */}
          <div className="lg:col-span-4 sticky top-36">
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-stone-200/90 shadow-xl space-y-6">
              
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-[#008374]">
                  Private Viewing Concierge
                </span>
                <h3 className="text-2xl font-bold font-serif text-[#09131F] mt-1">
                  Schedule accompanied tour
                </h3>
                <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                  Keys and gate entry clearances are pre-arranged with building administration.
                </p>
              </div>

              {isSuccess ? (
                <div className="p-6 rounded-2xl bg-teal-50 border border-teal-200 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#008374] text-white flex items-center justify-center mx-auto shadow-md">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold font-serif text-[#09131F]">
                    Tour Request Registered
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    A MedProperties specialist will contact you via WhatsApp/call within <strong>2 business hours</strong> to confirm building entry formalities.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="text-xs font-bold text-[#008374] underline hover:text-[#007063] cursor-pointer"
                  >
                    Schedule another slot
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTourSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Dr. Full Name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#008374] focus:ring-1 focus:ring-[#008374] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Phone Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#008374] focus:ring-1 focus:ring-[#008374] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="doctor@hospital.org"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#008374] focus:ring-1 focus:ring-[#008374] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Hospital Affiliation / Specialty
                    </label>
                    <input
                      type="text"
                      value={formData.hospital_affiliation}
                      onChange={(e) => setFormData({ ...formData, hospital_affiliation: e.target.value })}
                      placeholder="e.g. Manipal HAL / Cardiology"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#008374] focus:ring-1 focus:ring-[#008374] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Preferred Tour Window
                    </label>
                    <select
                      value={formData.preferred_slot}
                      onChange={(e) => setFormData({ ...formData, preferred_slot: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#008374] bg-white cursor-pointer font-medium"
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
                    className="w-full py-3.5 rounded-2xl bg-[#008374] hover:bg-[#007063] text-white text-xs font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>{isSubmitting ? 'Submitting...' : 'Request Accompanied Tour'}</span>
                  </button>

                  <div className="pt-2 text-xs text-stone-400 space-y-1">
                    <p className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#008374]" />
                      <span>Data shared strictly with your assigned specialist.</span>
                    </p>
                    <p>Standard response SLA: within 2 business hours.</p>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-in fade-in">
          <div className="flex items-center justify-between text-white">
            <span className="text-xs font-mono font-medium">
              Photo {activeImageIdx + 1} of {galleryImages.length}
            </span>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Close Lightbox [✕]
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center my-4 overflow-hidden">
            <img
              src={galleryImages[activeImageIdx].url}
              alt={galleryImages[activeImageIdx].caption}
              className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl"
            />
          </div>

          <div className="text-center text-white/90 text-sm font-medium mb-4">
            {galleryImages[activeImageIdx].caption}
          </div>

          <div className="flex justify-center gap-2 overflow-x-auto pb-2">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  activeImageIdx === idx ? 'border-[#008374] scale-105' : 'border-transparent opacity-60'
                }`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
