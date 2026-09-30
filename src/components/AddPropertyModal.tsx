import React, { useState, useRef } from 'react';
import { useProperties } from '../context/PropertyContext';
import { apiUploadMultipleImages, UploadResponse } from '../lib/api';
import {
  X,
  PlusCircle,
  Building,
  Image as ImageIcon,
  MapPin,
  IndianRupee,
  Bed,
  Bath,
  Maximize2,
  UploadCloud,
  CheckCircle,
  Trash2,
  Star,
  Loader2,
} from 'lucide-react';

interface LocalUploadedImage {
  key: string;
  url: string;
  fileName: string;
  fileSize: number;
  isPrimary: boolean;
}

export const AddPropertyModal: React.FC = () => {
  const { isAddModalOpen, setIsAddModalOpen, addNewProperty, showToast } = useProperties();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    address: '',
    city: 'Bengaluru',
    state: 'KA',
    price: '',
    period: 'month',
    beds: '3',
    baths: '2',
    dimensions: '1,650 sq.ft',
    category: 'rent' as 'rent' | 'buy' | 'sell',
    property_type: 'Independent Floor',
    image_url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    description: '',
    hospital_distance: '1.5 km to Manipal Hospital',
    is_popular: false,
  });

  const [uploadedImages, setUploadedImages] = useState<LocalUploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAddModalOpen) return null;

  // Handle file selection and upload to Cloudflare R2
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate size and mime types
    const validFiles = files.filter((f) => {
      const isImg = f.type.startsWith('image/');
      const isUnder10MB = f.size <= 10 * 1024 * 1024;
      return isImg && isUnder10MB;
    });

    if (validFiles.length < files.length) {
      showToast('Some files were ignored. Images must be under 10MB.', 'info');
    }

    if (validFiles.length === 0) return;

    try {
      setIsUploading(true);
      const responses: UploadResponse[] = await apiUploadMultipleImages(validFiles, 'properties');

      const newImages: LocalUploadedImage[] = responses.map((res, index) => ({
        key: res.key,
        url: res.url,
        fileName: res.fileName,
        fileSize: res.fileSize,
        isPrimary: uploadedImages.length === 0 && index === 0,
      }));

      setUploadedImages((prev) => [...prev, ...newImages]);

      // Set first uploaded image as primary cover image URL
      if (newImages.length > 0 && (!formData.image_url || formData.image_url.includes('unsplash.com'))) {
        setFormData((prev) => ({ ...prev, image_url: newImages[0].url }));
      }

      showToast(`Uploaded ${responses.length} media file(s) to Cloudflare R2!`, 'success');
    } catch (err: any) {
      console.error('Upload failed:', err);
      showToast(err.message || 'Image upload failed', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSetPrimary = (index: number) => {
    setUploadedImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
    if (uploadedImages[index]) {
      setFormData((prev) => ({ ...prev, image_url: uploadedImages[index].url }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      // Ensure at least one primary remains if any left
      if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
        filtered[0].isPrimary = true;
        setFormData((f) => ({ ...f, image_url: filtered[0].url }));
      }
      return filtered;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.address || !formData.price) return;

    const primaryImg = uploadedImages.find((img) => img.isPrimary);
    const coverUrl = primaryImg?.url || formData.image_url;

    const imagesPayload = uploadedImages.map((img, idx) => ({
      r2_key: img.key,
      r2_url: img.url,
      is_primary: img.isPrimary,
      display_order: idx,
      file_size: img.fileSize,
    }));

    setIsSubmitting(true);
    try {
      await addNewProperty({
        title: formData.title,
        address: formData.address,
        city: formData.city || 'Bengaluru',
        state: formData.state || 'KA',
        price: parseFloat(formData.price),
        period: formData.period,
        beds: parseInt(formData.beds, 10),
        baths: parseFloat(formData.baths),
        dimensions: formData.dimensions,
        category: formData.category,
        property_type: formData.property_type,
        image_url: coverUrl,
        images: imagesPayload.length > 0 ? imagesPayload : undefined,
        description: formData.description || 'Verified property for healthcare professionals and medical relocation.',
        hospital_distance: formData.hospital_distance,
        is_popular: formData.is_popular,
      });

      showToast('Property created successfully in PostgreSQL & Cloudflare R2!', 'success');
      setIsAddModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to save property', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-brand-700" />
            <div>
              <h3 className="text-lg font-bold text-navy-900">List a Medical Property</h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Saves structured data in PostgreSQL & media in Cloudflare R2
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddModalOpen(false)}
            className="p-2 rounded-full border border-slate-200 text-slate-400 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 flex-1 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-600 mb-1">Property Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Indiranagar Luxury Doctor Suites"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 rounded-xl font-semibold border border-slate-200 focus:outline-none focus:border-brand-700"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Listing Type</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2.5 bg-slate-50 rounded-xl font-semibold border border-slate-200 focus:outline-none focus:border-brand-700 cursor-pointer"
              >
                <option value="rent">For Rent</option>
                <option value="buy">For Sale</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-600 mb-1">Street Address *</label>
            <input
              type="text"
              required
              placeholder="e.g. 100 Feet Rd, HAL 2nd Stage, Indiranagar"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-50 rounded-xl font-semibold border border-slate-200 focus:outline-none focus:border-brand-700"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-bold text-slate-600 mb-1">City</label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 rounded-xl font-semibold border border-slate-200 focus:outline-none focus:border-brand-700 cursor-pointer"
              >
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Chennai">Chennai</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Pune">Pune</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-600 mb-1">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 rounded-xl font-semibold border border-slate-200 focus:outline-none focus:border-brand-700"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-600 mb-1">Price (₹) *</label>
              <input
                type="number"
                required
                placeholder="65000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 rounded-xl font-semibold border border-slate-200 focus:outline-none focus:border-brand-700"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-600 mb-1">Period</label>
              <select
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 rounded-xl font-semibold border border-slate-200 focus:outline-none focus:border-brand-700 cursor-pointer"
              >
                <option value="month">/ month</option>
                <option value="total">Total</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-600 mb-1">Bedrooms (BHK)</label>
              <input
                type="number"
                value={formData.beds}
                onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 rounded-xl font-semibold border border-slate-200 focus:outline-none focus:border-brand-700"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-600 mb-1">Bathrooms</label>
              <input
                type="number"
                step="1"
                value={formData.baths}
                onChange={(e) => setFormData({ ...formData, baths: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 rounded-xl font-semibold border border-slate-200 focus:outline-none focus:border-brand-700"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-600 mb-1">Dimensions</label>
              <input
                type="text"
                placeholder="1,650 sq.ft"
                value={formData.dimensions}
                onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 rounded-xl font-semibold border border-slate-200 focus:outline-none focus:border-brand-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-600 mb-1">Property Type</label>
              <select
                value={formData.property_type}
                onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 rounded-xl font-semibold border border-slate-200 focus:outline-none focus:border-brand-700 cursor-pointer"
              >
                <option value="Independent Floor">Independent Floor</option>
                <option value="Luxury Apartment">Luxury Apartment</option>
                <option value="Gated Villa">Gated Villa</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Studio / 1 BHK Flat">Studio / 1 BHK Flat</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Hospital Proximity</label>
              <input
                type="text"
                placeholder="e.g. 1.5 km to Manipal Hospital"
                value={formData.hospital_distance}
                onChange={(e) => setFormData({ ...formData, hospital_distance: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 rounded-xl font-semibold border border-slate-200 focus:outline-none focus:border-brand-700"
              />
            </div>
          </div>

          {/* Cloudflare R2 Media Uploader */}
          <div className="border border-brand-200 bg-brand-50/30 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-brand-700" />
                <label className="font-bold text-slate-800">
                  Cloudflare R2 Media Gallery (Multiple Images)
                </label>
              </div>
              <span className="text-[11px] text-brand-700 font-bold bg-brand-100/70 px-2 py-0.5 rounded-full">
                S3-Compatible R2 Storage
              </span>
            </div>

            <p className="text-[11px] text-slate-500 mb-3">
              Upload property photos directly to Cloudflare R2. Supports JPEG, PNG, WebP up to 10MB each.
            </p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="hidden"
            />

            <div className="flex flex-wrap gap-2 items-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2 px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl font-bold transition-all shadow-sm disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading to R2...
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    Select & Upload Photos
                  </>
                )}
              </button>

              <span className="text-slate-400 text-[11px]">
                {uploadedImages.length} image(s) uploaded
              </span>
            </div>

            {/* Thumbnail previews */}
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                {uploadedImages.map((img, idx) => (
                  <div
                    key={img.key || idx}
                    className={`relative group rounded-xl overflow-hidden border-2 transition-all ${
                      img.isPrimary ? 'border-brand-700 ring-2 ring-brand-400' : 'border-slate-200'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.fileName}
                      className="w-full h-24 object-cover"
                    />

                    {img.isPrimary && (
                      <span className="absolute top-1 left-1 bg-brand-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow flex items-center gap-1">
                        <Star className="w-3 h-3 fill-white" /> Primary Cover
                      </span>
                    )}

                    <div className="absolute inset-0 bg-navy-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {!img.isPrimary && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(idx)}
                          title="Set as Primary"
                          className="p-1.5 bg-white text-brand-700 rounded-lg hover:bg-brand-50"
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        title="Remove Image"
                        className="p-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block font-bold text-slate-600 mb-1">
              Cover Image URL (Auto-set or Custom External URL)
            </label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-50 rounded-xl font-semibold border border-slate-200 focus:outline-none focus:border-brand-700"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_popular"
              checked={formData.is_popular}
              onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
              className="w-4 h-4 text-brand-700 rounded border-slate-300 focus:ring-brand-700"
            />
            <label htmlFor="is_popular" className="font-bold text-slate-700">
              Highlight as "POPULAR" listing
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-brand-700 hover:bg-brand-800 transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving to PostgreSQL...
                </>
              ) : (
                'Save to PostgreSQL & R2'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
