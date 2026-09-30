import React, { useState } from 'react';
import { useProperties } from '../context/PropertyContext';
import { saveSupabaseConfig, testConnection } from '../lib/supabase';
import { X, Database, Check, AlertCircle, Copy, RefreshCw, ExternalLink } from 'lucide-react';

const SQL_SCHEMA = `-- MedProperties Supabase Schema
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    price NUMERIC NOT NULL,
    period TEXT DEFAULT 'month',
    beds INTEGER NOT NULL,
    baths NUMERIC NOT NULL,
    dimensions TEXT NOT NULL,
    image_url TEXT NOT NULL,
    is_popular BOOLEAN DEFAULT false,
    category TEXT DEFAULT 'rent',
    property_type TEXT DEFAULT 'House',
    description TEXT,
    hospital_distance TEXT,
    virtual_tour_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    user_id TEXT DEFAULT 'anonymous_user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(property_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    type TEXT DEFAULT 'landlord',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    medical_role TEXT,
    tour_date TEXT,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read properties" ON public.properties;
CREATE POLICY "Public can read properties" ON public.properties FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert properties" ON public.properties;
CREATE POLICY "Public can insert properties" ON public.properties FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update properties" ON public.properties;
CREATE POLICY "Public can update properties" ON public.properties FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public can manage favorites" ON public.favorites;
CREATE POLICY "Public can manage favorites" ON public.favorites FOR ALL USING (true);

DROP POLICY IF EXISTS "Public can read leads" ON public.leads;
CREATE POLICY "Public can read leads" ON public.leads FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert leads" ON public.leads;
CREATE POLICY "Public can insert leads" ON public.leads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read inquiries" ON public.inquiries;
CREATE POLICY "Public can read inquiries" ON public.inquiries FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert inquiries" ON public.inquiries;
CREATE POLICY "Public can insert inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);

INSERT INTO public.properties (id, title, address, city, state, price, period, beds, baths, dimensions, image_url, is_popular, category, property_type, description, hospital_distance)
VALUES
('a1111111-1111-1111-1111-111111111111', 'Indiranagar Doctor Retreat', '104, 100ft Road, Indiranagar', 'Bengaluru', 'KA', 65000, 'month', 3, 3, '1,650 sq.ft', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', true, 'rent', 'Independent Floor', 'Quiet premium residence with soundproof windows located 5 minutes from Manipal Hospital.', '1.2 km to Manipal Hospital (HAL)'),
('a2222222-2222-2222-2222-222222222222', 'Whitefield Medical Penthouse', '402 Prestige Ozone, Whitefield', 'Bengaluru', 'KA', 82000, 'month', 4, 4, '2,400 sq.ft', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', true, 'rent', 'Luxury Penthouse', 'Spacious executive home with dedicated home study and power backup.', '2.1 km to Manipal Hospital Whitefield'),
('a3333333-3333-3333-3333-333333333333', 'Jubilee Hills Physician Estate', 'Road No. 36, Jubilee Hills', 'Hyderabad', 'TS', 145000, 'month', 4, 4, '3,200 sq.ft', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', true, 'rent', 'Bespoke Villa', 'Ultra-premium gated villa with private lift and 24x7 security.', '1.5 km to Apollo Hospitals Jubilee Hills'),
('a4444444-4444-4444-4444-444444444444', 'Bandra West Coastal Suites', '72 Perry Cross Road, Bandra West', 'Mumbai', 'MH', 125000, 'month', 3, 3, '1,450 sq.ft', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', false, 'rent', 'Sea-View Apartment', 'High-speed connectivity and concierge service.', '1.8 km to Lilavati Hospital & Research Centre'),
('a5555555-5555-5555-5555-555555555555', 'South Ext Residency Suite', 'B-12 South Extension Part II', 'Delhi NCR', 'DL', 48000, 'month', 2, 2, '1,100 sq.ft', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80', false, 'rent', 'Serviced Builder Floor', 'Turnkey quiet flat designed for postgraduate medical residents.', '2.3 km to AIIMS New Delhi'),
('a6666666-6666-6666-6666-666666666666', 'Nungambakkam Clinical Haven', '18 Wallace Garden, Nungambakkam', 'Chennai', 'TN', 38000, 'month', 2, 2, '1,200 sq.ft', 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80', false, 'rent', 'Greenview Flat', 'Peaceful, tree-lined residential community.', '1.4 km to Apollo Main Hospital (Greams Road)')
ON CONFLICT (id) DO NOTHING;`;

export const SupabaseConfigModal: React.FC = () => {
  const {
    isSupabaseModalOpen,
    setIsSupabaseModalOpen,
    supabaseConfig,
    reloadSupabaseConfig,
    showToast,
  } = useProperties();

  const [url, setUrl] = useState(supabaseConfig.url);
  const [anonKey, setAnonKey] = useState(supabaseConfig.anonKey);
  const [testing, setTesting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isSupabaseModalOpen) return null;

  const handleTest = async () => {
    if (!url || !anonKey) {
      setTestResult({ success: false, message: 'Please enter both Supabase URL and Anon Key' });
      return;
    }
    setTesting(true);
    setTestResult(null);
    const res = await testConnection(url.trim(), anonKey.trim());
    setTesting(false);
    setTestResult(res);
  };

  const handleSave = () => {
    if (!url || !anonKey) {
      showToast('Please provide both URL and Anon Key', 'error');
      return;
    }
    saveSupabaseConfig(url, anonKey);
    reloadSupabaseConfig();
    showToast('Supabase settings saved and active!', 'success');
    setIsSupabaseModalOpen(false);
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SQL_SCHEMA);
    setCopied(true);
    showToast('SQL schema copied to clipboard! Paste in Supabase SQL editor.');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy-900">Supabase Database Settings</h3>
              <p className="text-xs text-slate-500">Live PostgreSQL Database Connection</p>
            </div>
          </div>
          <button
            onClick={() => setIsSupabaseModalOpen(false)}
            className="p-1.5 rounded-full border border-slate-200 text-slate-400 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Status Box */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-600">Connected Project:</span>
            <span className="font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Supabase Active
            </span>
          </div>
          <p className="text-slate-500 text-[11px] truncate">
            {url || 'https://aeifhcefqohynganitxo.supabase.co'}
          </p>
        </div>

        {/* Input fields */}
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Supabase Project URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 rounded-xl font-semibold border border-slate-200 focus:outline-none focus:border-brand-700"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Supabase Publishable / Anon API Key
            </label>
            <input
              type="password"
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 rounded-xl font-semibold border border-slate-200 focus:outline-none focus:border-brand-700 font-mono"
            />
          </div>
        </div>

        {/* Test Result Message */}
        {testResult && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
              testResult.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {testResult.success ? (
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{testResult.message}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={handleTest}
            disabled={testing}
            className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 font-bold rounded-xl text-slate-700 text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
            {testing ? 'Testing...' : 'Test Connection'}
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2.5 px-4 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            Save & Connect
          </button>
        </div>

        {/* Quick Copy Schema Box */}
        <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-950">Setup Supabase Tables</span>
            <button
              type="button"
              onClick={handleCopySchema}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-700 bg-white px-2.5 py-1 rounded-lg border border-brand-200 hover:bg-brand-50 transition-colors shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy SQL Schema'}
            </button>
          </div>
          <p className="text-[11px] text-emerald-900 leading-relaxed">
            Click <strong>Copy SQL Schema</strong> and paste it into your{' '}
            <a
              href="https://supabase.com/dashboard/project/aeifhcefqohynganitxo/sql"
              target="_blank"
              rel="noreferrer"
              className="underline font-bold text-brand-700 inline-flex items-center gap-0.5"
            >
              Supabase SQL Editor <ExternalLink className="w-3 h-3" />
            </a>{' '}
            to instantly create the tables and seed properties.
          </p>
        </div>

      </div>
    </div>
  );
};
