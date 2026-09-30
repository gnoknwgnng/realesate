import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Property, InquiryFormData, UserProfile } from '../types';
import { INITIAL_PROPERTIES } from './mockData';

const STORAGE_KEYS = {
  SUPABASE_URL: 'medproperties_supabase_url',
  SUPABASE_KEY: 'medproperties_supabase_key',
  PROPERTIES: 'medproperties_local_properties_india_v1',
  FAVORITES: 'medproperties_local_favorites',
  LEADS: 'medproperties_local_leads',
  INQUIRIES: 'medproperties_local_inquiries',
  USERS: 'medproperties_registered_users_v2',
};

// Retrieve configured Supabase credentials
export function getStoredSupabaseConfig() {
  const envUrl =
    import.meta.env.VITE_SUPABASE_URL ||
    import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://aeifhcefqohynganitxo.supabase.co';
  const envKey =
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    'sb_publishable_zCspGYW4wGnE-h0JTlFBBQ_pz5tiKoQ';

  const localUrl = localStorage.getItem(STORAGE_KEYS.SUPABASE_URL) || '';
  const localKey = localStorage.getItem(STORAGE_KEYS.SUPABASE_KEY) || '';

  const activeUrl = localUrl || envUrl;
  const activeKey = localKey || envKey;

  return {
    url: activeUrl,
    anonKey: activeKey,
    isCustomConfigured: Boolean(activeUrl && activeKey),
  };
}

export function saveSupabaseConfig(url: string, key: string) {
  localStorage.setItem(STORAGE_KEYS.SUPABASE_URL, url.trim());
  localStorage.setItem(STORAGE_KEYS.SUPABASE_KEY, key.trim());
}

export function clearSupabaseConfig() {
  localStorage.removeItem(STORAGE_KEYS.SUPABASE_URL);
  localStorage.removeItem(STORAGE_KEYS.SUPABASE_KEY);
}

// Singleton client
let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getStoredSupabaseConfig();
  if (url && anonKey) {
    try {
      if (!supabaseInstance) {
        supabaseInstance = createClient(url, anonKey);
      }
      return supabaseInstance;
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }
  return null;
}

export async function testConnection(url: string, key: string): Promise<{ success: boolean; message: string }> {
  try {
    const client = createClient(url, key);
    const { error } = await client.from('properties').select('id').limit(1);
    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Connected successfully to Supabase!' };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { success: false, message: errorMsg || 'Unable to connect to Supabase.' };
  }
}

// Local storage helpers
function getLocalProperties(): Property[] {
  const stored = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(INITIAL_PROPERTIES));
    return INITIAL_PROPERTIES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_PROPERTIES;
  }
}

function saveLocalProperties(props: Property[]) {
  localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(props));
}

// API methods
export async function apiGetProperties(): Promise<Property[]> {
  try {
    const res = await fetch('/api/properties');
    if (res.ok) {
      const data = await res.json();
      if (data.properties && Array.isArray(data.properties) && data.properties.length > 0) {
        return data.properties as Property[];
      }
    }
  } catch (err) {
    console.warn('Backend API fetch failed, checking Supabase / local fallback:', err);
  }

  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Property[];
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local dataset:', err);
    }
  }
  return getLocalProperties();
}

export async function apiAddProperty(property: Omit<Property, 'id' | 'created_at'>): Promise<Property> {
  try {
    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(property),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.property) {
        return data.property as Property;
      }
    }
  } catch (err) {
    console.warn('Backend API insert failed, trying Supabase / local:', err);
  }

  const newProp: Property = {
    ...property,
    id: 'prop-' + Math.random().toString(36).substring(2, 9),
    created_at: new Date().toISOString(),
  };

  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('properties')
        .insert([property])
        .select()
        .single();

      if (!error && data) {
        return data as Property;
      }
    } catch (err) {
      console.warn('Supabase insert failed, saving locally:', err);
    }
  }

  const localList = getLocalProperties();
  const updated = [newProp, ...localList];
  saveLocalProperties(updated);
  return newProp;
}

export async function apiSaveLead(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, type: 'landlord' }),
    });
    if (res.ok) {
      return { success: true, message: 'Thank you! You have been added to our landlord network.' };
    }
  } catch (e) {
    // fallback
  }

  const client = getSupabaseClient();
  if (client) {
    try {
      const { error } = await client.from('leads').insert([{ email, type: 'landlord' }]);
      if (error) throw error;
      return { success: true, message: 'Thank you! You have been added to our landlord network.' };
    } catch (err: unknown) {
      console.warn('Supabase leads insert failed, falling back to local:', err);
    }
  }

  // Local fallback
  const leads: string[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEADS) || '[]');
  if (!leads.includes(email)) {
    leads.push(email);
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
  }
  return { success: true, message: 'Thank you! You have been added to our landlord network.' };
}

export async function apiSaveInquiry(data: InquiryFormData): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      return { success: true, message: 'Inquiry received! A physician concierge will contact you within 2 hours.' };
    }
  } catch (e) {
    // fallback
  }

  const client = getSupabaseClient();
  if (client) {
    try {
      const { error } = await client.from('inquiries').insert([data]);
      if (error) throw error;
      return { success: true, message: 'Inquiry received! A physician concierge will contact you within 2 hours.' };
    } catch (err: unknown) {
      console.warn('Supabase inquiry insert failed, fallback to local:', err);
    }
  }

  const inquiries = JSON.parse(localStorage.getItem(STORAGE_KEYS.INQUIRIES) || '[]');
  inquiries.push({ ...data, created_at: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
  return { success: true, message: 'Inquiry received! A physician concierge will contact you within 2 hours.' };
}

export async function apiDeleteProperty(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' });
    if (res.ok) return true;
  } catch (e) {
    // fallback
  }

  const client = getSupabaseClient();
  if (client) {
    try {
      const { error } = await client.from('properties').delete().eq('id', id);
      if (!error) return true;
    } catch (err) {
      console.warn('Supabase delete failed, deleting locally:', err);
    }
  }

  const localList = getLocalProperties().filter((p) => p.id !== id);
  saveLocalProperties(localList);
  return true;
}

export async function apiGetInquiries(): Promise<InquiryFormData[]> {
  try {
    const res = await fetch('/api/inquiries');
    if (res.ok) {
      const data = await res.json();
      if (data.inquiries && Array.isArray(data.inquiries)) {
        return data.inquiries;
      }
    }
  } catch (e) {
    // fallback
  }

  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.from('inquiries').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as InquiryFormData[];
    } catch (err) {
      console.warn('Supabase inquiries fetch failed:', err);
    }
  }
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.INQUIRIES) || '[]');
}

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-doc-1',
    email: 'rajesh.sharma@aiims.edu',
    full_name: 'Dr. Rajesh Sharma, MD',
    role: 'doctor',
    phone: '+91 98101 23456',
    hospital: 'AIIMS New Delhi',
    location: 'Ansari Nagar, New Delhi',
    last_login: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    status: 'online',
    device: 'Desktop (Chrome / macOS)',
  },
  {
    id: 'user-doc-2',
    email: 'sneha.patel@manipal.org',
    full_name: 'Dr. Sneha Patel, MS',
    role: 'doctor',
    phone: '+91 98450 87654',
    hospital: 'Manipal Hospital Bengaluru',
    location: 'HAL Old Airport Rd, Bengaluru',
    last_login: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    status: 'online',
    device: 'Mobile (iPhone 15 / Safari)',
  },
  {
    id: 'user-doc-3',
    email: 'priya.nair@apollo.com',
    full_name: 'Dr. Priya Nair, MS',
    role: 'doctor',
    phone: '+91 97412 34567',
    hospital: 'Apollo Hospitals Jubilee Hills',
    location: 'Jubilee Hills, Hyderabad',
    last_login: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    status: 'offline',
    device: 'Tablet (iPad Pro / Chrome)',
  },
  {
    id: 'user-landlord-1',
    email: 'kavitha.reddy@gmail.com',
    full_name: 'Kavitha Reddy',
    role: 'landlord',
    phone: '+91 99001 12233',
    location: 'Indiranagar, Bengaluru, KA',
    hospital: 'Near Manipal Hospital (HAL)',
    last_login: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    status: 'online',
    device: 'Desktop (Windows / Edge)',
  },
  {
    id: 'user-landlord-2',
    email: 'vikram.malhotra@realty.in',
    full_name: 'Vikram Malhotra',
    role: 'landlord',
    phone: '+91 98200 44556',
    location: 'Bandra West, Mumbai, MH',
    hospital: 'Near Lilavati Hospital',
    last_login: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    status: 'offline',
    device: 'Desktop (Mac / Safari)',
  },
  {
    id: 'user-admin-1',
    email: 'superadmin@medproperties.com',
    full_name: 'Super Admin Console',
    role: 'superadmin',
    phone: '+91 1800 200 3627',
    location: 'Central Headquarters, Bengaluru',
    hospital: 'MedProperties Platform Operations',
    last_login: new Date().toISOString(),
    status: 'online',
    device: 'Admin Workstation (Secure Session)',
  },
];

export async function apiGetUsers(): Promise<UserProfile[]> {
  try {
    const res = await fetch('/api/users');
    if (res.ok) {
      const data = await res.json();
      if (data.users && Array.isArray(data.users) && data.users.length > 0) {
        return data.users;
      }
    }
  } catch (err) {
    // fallback
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_USERS;
  } catch {
    return INITIAL_USERS;
  }
}

export async function apiRecordUserLogin(profile: UserProfile): Promise<UserProfile[]> {
  try {
    await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: profile.email,
        role: profile.role,
        full_name: profile.full_name,
        hospital: profile.hospital,
        phone: profile.phone,
      }),
    });
  } catch (err) {
    // fallback
  }

  const users = await apiGetUsers();
  const existingIndex = users.findIndex(
    (u) => (profile.id && u.id === profile.id) || (profile.email && u.email.toLowerCase() === profile.email.toLowerCase())
  );

  const updatedProfile: UserProfile = {
    ...profile,
    status: 'online',
    last_login: new Date().toISOString(),
    device: profile.device || 'Web Browser (Active)',
  };

  let updatedList: UserProfile[];
  if (existingIndex >= 0) {
    updatedList = [...users];
    updatedList[existingIndex] = {
      ...updatedList[existingIndex],
      ...updatedProfile,
    };
  } else {
    updatedList = [updatedProfile, ...users];
  }

  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedList));
  return updatedList;
}

export async function apiRecordUserLogout(emailOrId: string): Promise<UserProfile[]> {
  try {
    await fetch('/api/users/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailOrId, id: emailOrId }),
    });
  } catch (err) {
    // fallback
  }

  const users = await apiGetUsers();
  const updatedList = users.map((u) => {
    if (u.id === emailOrId || u.email.toLowerCase() === emailOrId.toLowerCase()) {
      return { ...u, status: 'offline' as const };
    }
    return u;
  });

  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedList));
  return updatedList;
}

export async function apiDeleteUser(id: string): Promise<UserProfile[]> {
  const users = await apiGetUsers();
  const updated = users.filter((u) => u.id !== id);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
  return updated;
}
