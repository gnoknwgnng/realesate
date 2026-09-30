import fs from 'fs';
import path from 'path';
import { Property, UserProfile, InquiryFormData } from '../../src/types';
import { INITIAL_PROPERTIES } from '../../src/lib/mockData';
import { INITIAL_USERS } from '../../src/lib/supabase';

// In-memory fallbacks (critical for Vercel Serverless read-only filesystems)
let memProperties: Property[] = [...INITIAL_PROPERTIES];
let memUsers: UserProfile[] = [...INITIAL_USERS];
let memInquiries: any[] = [];
let memLeads: any[] = [];
let memFavorites: any[] = [];

// Choose data directory (/tmp for serverless, ./data for local)
const isVercel = Boolean(process.env.VERCEL);
const dataDir = isVercel ? path.join('/tmp', 'medproperties_data') : path.join(process.cwd(), 'data');

try {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
} catch {
  // Read-only filesystem, rely on in-memory storage
}

const propsFile = path.join(dataDir, 'properties.json');
const usersFile = path.join(dataDir, 'users.json');
const inquiriesFile = path.join(dataDir, 'inquiries.json');
const leadsFile = path.join(dataDir, 'leads.json');
const favoritesFile = path.join(dataDir, 'favorites.json');

// Initialize initial files safely
try {
  if (!fs.existsSync(propsFile)) {
    fs.writeFileSync(propsFile, JSON.stringify(INITIAL_PROPERTIES, null, 2));
  }
  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify(INITIAL_USERS, null, 2));
  }
  if (!fs.existsSync(inquiriesFile)) {
    fs.writeFileSync(inquiriesFile, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(leadsFile)) {
    fs.writeFileSync(leadsFile, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(favoritesFile)) {
    fs.writeFileSync(favoritesFile, JSON.stringify([], null, 2));
  }
} catch {
  // If filesystem write fails on serverless, memory fallback is used seamlessly
}

export const store = {
  // Properties
  getProperties(): Property[] {
    try {
      if (fs.existsSync(propsFile)) {
        return JSON.parse(fs.readFileSync(propsFile, 'utf8'));
      }
    } catch {
      // fallback
    }
    return memProperties;
  },
  saveProperties(props: Property[]) {
    memProperties = props;
    try {
      fs.writeFileSync(propsFile, JSON.stringify(props, null, 2));
    } catch {
      // Memory fallback active
    }
  },
  getPropertyById(id: string): Property | undefined {
    return this.getProperties().find((p) => p.id === id);
  },
  createProperty(prop: Partial<Property>): Property {
    const properties = this.getProperties();
    const newProp: Property = {
      id: prop.id || 'prop-' + Math.random().toString(36).substring(2, 9),
      title: prop.title || '',
      address: prop.address || '',
      city: prop.city || 'Bengaluru',
      state: prop.state || 'KA',
      price: prop.price || 0,
      period: prop.period || 'month',
      beds: prop.beds || 1,
      baths: prop.baths || 1,
      dimensions: prop.dimensions || '1,000 sq.ft',
      image_url: prop.image_url || '',
      images: prop.images || [],
      is_popular: prop.is_popular || false,
      category: prop.category || 'rent',
      property_type: prop.property_type || 'Apartment',
      description: prop.description || '',
      hospital_distance: prop.hospital_distance || '',
      created_at: prop.created_at || new Date().toISOString(),
      status: prop.status || 'active',
      owner_email: prop.owner_email,
      owner_id: prop.owner_id,
    };
    properties.unshift(newProp);
    this.saveProperties(properties);
    return newProp;
  },
  updateProperty(id: string, updates: Partial<Property>): Property | null {
    const properties = this.getProperties();
    const index = properties.findIndex((p) => p.id === id);
    if (index === -1) return null;
    properties[index] = { ...properties[index], ...updates };
    this.saveProperties(properties);
    return properties[index];
  },
  deleteProperty(id: string): boolean {
    const properties = this.getProperties();
    const filtered = properties.filter((p) => p.id !== id);
    if (filtered.length === properties.length) return false;
    this.saveProperties(filtered);
    return true;
  },

  // Users
  getUsers(): UserProfile[] {
    try {
      if (fs.existsSync(usersFile)) {
        return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
      }
    } catch {
      // fallback
    }
    return memUsers;
  },
  getUserById(id: string): UserProfile | undefined {
    return this.getUsers().find((u) => u.id === id);
  },
  getUserByEmail(email: string): UserProfile | undefined {
    return this.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
  },
  createUser(userData: Partial<UserProfile>): UserProfile {
    const users = this.getUsers();
    const newUser: UserProfile = {
      id: userData.id || 'user-' + Math.random().toString(36).substring(2, 9),
      email: userData.email || '',
      role: userData.role || 'doctor',
      full_name: userData.full_name || '',
      hospital: userData.hospital,
      phone: userData.phone,
      status: userData.status || 'online',
      last_login: userData.last_login || new Date().toISOString(),
      device: userData.device || 'Web Session',
    };
    users.unshift(newUser);
    memUsers = users;
    try {
      fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    } catch {
      // In-memory active
    }
    return newUser;
  },
  updateUser(id: string, updates: Partial<UserProfile>): UserProfile | null {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    users[index] = { ...users[index], ...updates };
    memUsers = users;
    try {
      fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    } catch {
      // In-memory active
    }
    return users[index];
  },

  // Inquiries
  getInquiries(): InquiryFormData[] {
    try {
      if (fs.existsSync(inquiriesFile)) {
        return JSON.parse(fs.readFileSync(inquiriesFile, 'utf8'));
      }
    } catch {
      // fallback
    }
    return memInquiries;
  },
  createInquiry(inq: any): any {
    const inqs = this.getInquiries();
    const newInq = {
      ...inq,
      id: inq.id || 'inq-' + Math.random().toString(36).substring(2, 9),
      created_at: inq.created_at || new Date().toISOString(),
    };
    inqs.unshift(newInq);
    memInquiries = inqs;
    try {
      fs.writeFileSync(inquiriesFile, JSON.stringify(inqs, null, 2));
    } catch {
      // fallback
    }
    return newInq;
  },

  // Leads
  getLeads(): any[] {
    try {
      if (fs.existsSync(leadsFile)) {
        return JSON.parse(fs.readFileSync(leadsFile, 'utf8'));
      }
    } catch {
      // fallback
    }
    return memLeads;
  },
  createLead(lead: { email: string; type?: string; created_at?: string }): any {
    const leads = this.getLeads();
    const newLead = {
      id: 'lead-' + Math.random().toString(36).substring(2, 9),
      email: lead.email,
      type: lead.type || 'landlord',
      created_at: lead.created_at || new Date().toISOString(),
    };
    leads.unshift(newLead);
    memLeads = leads;
    try {
      fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2));
    } catch {
      // fallback
    }
    return newLead;
  },

  // Favorites
  getFavorites(userId?: string): any[] {
    try {
      if (fs.existsSync(favoritesFile)) {
        const allFavs: any[] = JSON.parse(fs.readFileSync(favoritesFile, 'utf8'));
        if (userId) {
          return allFavs.filter((f) => f.user_id === userId);
        }
        return allFavs;
      }
    } catch {
      // fallback
    }
    return userId ? memFavorites.filter((f) => f.user_id === userId) : memFavorites;
  },
  toggleFavorite(property_id: string, user_id: string): { favorited: boolean } {
    const favs = this.getFavorites();
    const index = favs.findIndex((f) => f.property_id === property_id && f.user_id === user_id);
    if (index >= 0) {
      favs.splice(index, 1);
      memFavorites = favs;
      try {
        fs.writeFileSync(favoritesFile, JSON.stringify(favs, null, 2));
      } catch {
        // fallback
      }
      return { favorited: false };
    } else {
      const newFav = {
        id: 'fav-' + Math.random().toString(36).substring(2, 9),
        property_id,
        user_id,
        created_at: new Date().toISOString(),
      };
      favs.unshift(newFav);
      memFavorites = favs;
      try {
        fs.writeFileSync(favoritesFile, JSON.stringify(favs, null, 2));
      } catch {
        // fallback
      }
      return { favorited: true };
    }
  },
};

export const localStore = store;
