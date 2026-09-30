export interface PropertyImage {
  id?: string;
  property_id?: string;
  r2_key?: string;
  r2_url: string;
  is_primary?: boolean;
  display_order?: number;
  caption?: string;
  file_size?: number;
  mime_type?: string;
  created_at?: string;
}

export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  price: number;
  period: string;
  beds: number;
  baths: number;
  dimensions: string;
  image_url: string;
  images?: PropertyImage[];
  is_popular?: boolean;
  category: 'rent' | 'buy' | 'sell';
  property_type: string;
  description?: string;
  hospital_distance?: string;
  virtual_tour_url?: string;
  owner_email?: string;
  owner_id?: string;
  status?: 'active' | 'pending' | 'rented';
  created_at?: string;
}

export interface SearchFilters {
  tab: 'rent' | 'buy' | 'sell';
  location: string;
  moveInDate: string;
  propertyType: string;
  priceRange: string;
  beds: string;
}

export interface InquiryFormData {
  property_id: string;
  name: string;
  email: string;
  phone: string;
  medical_role: string;
  tour_date: string;
  message: string;
  created_at?: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
}

export type UserRole = 'doctor' | 'landlord' | 'superadmin';

export interface UserProfile {
  id: string;
  email: string;
  role?: UserRole;
  full_name?: string;
  phone?: string;
  location?: string;
  hospital?: string;
  last_login?: string;
  status?: 'online' | 'offline';
  device?: string;
}
