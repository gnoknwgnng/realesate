import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Property, SearchFilters, UserProfile } from '../types';
import {
  apiGetProperties,
  apiAddProperty,
  apiDeleteProperty,
  getStoredSupabaseConfig,
  getSupabaseClient,
  apiGetUsers,
  apiRecordUserLogin,
  apiRecordUserLogout,
  apiDeleteUser,
} from '../lib/supabase';
import { INITIAL_PROPERTIES } from '../lib/mockData';

export type InfoModalType = 'faq' | 'relocation' | 'about' | 'terms' | 'privacy' | 'contact' | 'trust' | null;

export type ViewType =
  | 'home'
  | 'explore'
  | 'buy'
  | 'property-detail'
  | 'financing'
  | 'landlord'
  | 'how-it-works'
  | 'resources'
  | 'dashboard';

interface PropertyContextType {
  properties: Property[];
  filteredProperties: Property[];
  favorites: string[];
  toggleFavorite: (id: string) => void;
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  resetFilters: () => void;
  selectedProperty: Property | null;
  setSelectedProperty: (property: Property | null) => void;
  viewPropertyDetail: (property: Property) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'signup';
  setAuthMode: (mode: 'login' | 'signup') => void;
  openAuthModal: (mode?: 'login' | 'signup') => void;
  isConciergeOpen: boolean;
  setIsConciergeOpen: (open: boolean) => void;
  openConciergeModal: () => void;
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  allUsers: UserProfile[];
  refreshUsers: () => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  signOut: () => Promise<void>;
  isSupabaseModalOpen: boolean;
  setIsSupabaseModalOpen: (open: boolean) => void;
  isFavoritesDrawerOpen: boolean;
  setIsFavoritesDrawerOpen: (open: boolean) => void;
  isMortgageModalOpen: boolean;
  setIsMortgageModalOpen: (open: boolean) => void;
  isSellModalOpen: boolean;
  setIsSellModalOpen: (open: boolean) => void;
  infoModalType: InfoModalType;
  setInfoModalType: (type: InfoModalType) => void;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  addNewProperty: (newProp: Omit<Property, 'id' | 'created_at'>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  refreshProperties: () => Promise<void>;
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  supabaseConfig: { url: string; anonKey: string; isCustomConfigured: boolean };
  reloadSupabaseConfig: () => void;
}

const defaultFilters: SearchFilters = {
  tab: 'rent',
  location: '',
  hospital: '',
  city: 'all',
  moveInDate: '',
  propertyType: 'all',
  priceRange: 'all',
  beds: 'all',
  maxCommuteTime: 'all',
  sortBy: 'relevance',
};

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('medproperties_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [isMortgageModalOpen, setIsMortgageModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState<InfoModalType>(null);
  const [currentView, setCurrentView] = useState<ViewType>('home');

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('medproperties_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isFavoritesDrawerOpen, setIsFavoritesDrawerOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [supabaseConfig, setSupabaseConfig] = useState(getStoredSupabaseConfig());

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const openConciergeModal = () => {
    setIsConciergeOpen(true);
  };

  const viewPropertyDetail = (property: Property) => {
    setSelectedProperty(property);
    setCurrentView('property-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);

  const loadUsers = async () => {
    const data = await apiGetUsers();
    setAllUsers(data);
  };

  const deleteUser = async (id: string) => {
    const updated = await apiDeleteUser(id);
    setAllUsers(updated);
    showToast('User record updated in platform registry.');
  };

  const loadProperties = async () => {
    try {
      const data = await apiGetProperties();
      if (data && data.length > 0) {
        setProperties(data);
      }
    } catch {
      setProperties(INITIAL_PROPERTIES);
    }
  };

  useEffect(() => {
    loadProperties();
    loadUsers();
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(id);
      const next = isFav ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem('medproperties_favorites', JSON.stringify(next));
      showToast(isFav ? 'Removed from saved residences' : 'Saved to your private shortlist');
      return next;
    });
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const addNewProperty = async (newProp: Omit<Property, 'id' | 'created_at'>) => {
    const created = await apiAddProperty(newProp);
    setProperties((prev) => [created, ...prev]);
    showToast('Property listing created and submitted for verification audit.');
  };

  const deleteProperty = async (id: string) => {
    await apiDeleteProperty(id);
    setProperties((prev) => prev.filter((p) => p.id !== id));
    showToast('Property deleted successfully.');
  };

  const signOut = async () => {
    if (user?.email) {
      await apiRecordUserLogout(user.email);
    }
    const client = getSupabaseClient();
    if (client) {
      await client.auth.signOut().catch(() => {});
    }
    setUser(null);
    localStorage.removeItem('medproperties_user');
    showToast('Signed out of MedProperties.');
  };

  const reloadSupabaseConfig = () => {
    setSupabaseConfig(getStoredSupabaseConfig());
    loadProperties();
  };

  // Filter and Sort properties
  const filteredProperties = useMemo(() => {
    const isBuyCategory = currentView === 'buy' || filters.tab === 'buy';
    const targetCategory = isBuyCategory ? 'buy' : 'rent';

    const matched = properties.filter((item) => {
      // 1. Category check
      if (item.category !== targetCategory) {
        // Fallback check if user toggled Buy tab
        if (!isBuyCategory && item.category === 'buy') return false;
        if (isBuyCategory && item.category === 'rent') return false;
      }

      // 2. City filter
      if (filters.city && filters.city !== 'all') {
        if (!item.city.toLowerCase().includes(filters.city.toLowerCase())) {
          return false;
        }
      }

      // 3. Hospital filter
      if (filters.hospital && filters.hospital.trim()) {
        const hQuery = filters.hospital.toLowerCase().trim();
        const matchesHospital =
          (item.hospital_name && item.hospital_name.toLowerCase().includes(hQuery)) ||
          (item.hospital_distance && item.hospital_distance.toLowerCase().includes(hQuery)) ||
          item.description?.toLowerCase().includes(hQuery);
        if (!matchesHospital) return false;
      }

      // 4. Locality / Title text search
      if (filters.location && filters.location.trim()) {
        const query = filters.location.toLowerCase().trim();
        const matchCity = item.city.toLowerCase().includes(query);
        const matchAddress = item.address.toLowerCase().includes(query);
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchHosp = item.hospital_name?.toLowerCase().includes(query);
        if (!matchCity && !matchAddress && !matchTitle && !matchHosp) return false;
      }

      // 5. Property Type
      if (filters.propertyType !== 'all') {
        if (!item.property_type.toLowerCase().includes(filters.propertyType.toLowerCase())) {
          return false;
        }
      }

      // 6. Beds (BHK)
      if (filters.beds !== 'all') {
        const numBeds = parseInt(filters.beds, 10);
        if (item.beds < numBeds) return false;
      }

      // 7. Max Commute Time
      if (filters.maxCommuteTime && filters.maxCommuteTime !== 'all') {
        const maxMins = parseInt(filters.maxCommuteTime, 10);
        const estStr = item.commute_estimate || item.hospital_distance || '';
        const matchNum = estStr.match(/(\d+)\s*(?:min|minute)/i);
        if (matchNum && parseInt(matchNum[1], 10) > maxMins) {
          return false;
        }
      }

      // 8. Price range
      if (filters.priceRange !== 'all') {
        if (targetCategory === 'rent') {
          if (filters.priceRange === 'under-40k' && item.price >= 40000) return false;
          if (filters.priceRange === '40k-75k' && (item.price < 40000 || item.price > 75000)) return false;
          if (filters.priceRange === 'above-75k' && item.price <= 75000) return false;
        } else {
          // Buy pricing
          if (filters.priceRange === 'under-2cr' && item.price >= 20000000) return false;
          if (filters.priceRange === '2cr-4cr' && (item.price < 20000000 || item.price > 40000000)) return false;
          if (filters.priceRange === 'above-4cr' && item.price <= 40000000) return false;
        }
      }

      return true;
    });

    // Apply Sorting
    return [...matched].sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'commute') {
        const getMins = (p: Property) => {
          const m = (p.commute_estimate || '').match(/(\d+)\s*(?:min|minute)/i);
          return m ? parseInt(m[1], 10) : 999;
        };
        return getMins(a) - getMins(b);
      }
      if (filters.sortBy === 'newest') {
        return (new Date(b.created_at || 0).getTime()) - (new Date(a.created_at || 0).getTime());
      }
      // default: relevance (is_popular first)
      if (a.is_popular && !b.is_popular) return -1;
      if (!a.is_popular && b.is_popular) return 1;
      return 0;
    });
  }, [properties, filters, currentView]);

  return (
    <PropertyContext.Provider
      value={{
        properties,
        filteredProperties,
        favorites,
        toggleFavorite,
        filters,
        setFilters,
        resetFilters,
        selectedProperty,
        setSelectedProperty,
        viewPropertyDetail,
        isAddModalOpen,
        setIsAddModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        openAuthModal,
        isConciergeOpen,
        setIsConciergeOpen,
        openConciergeModal,
        user,
        setUser,
        allUsers,
        refreshUsers: loadUsers,
        deleteUser,
        signOut,
        isSupabaseModalOpen,
        setIsSupabaseModalOpen,
        isFavoritesDrawerOpen,
        setIsFavoritesDrawerOpen,
        isMortgageModalOpen,
        setIsMortgageModalOpen,
        isSellModalOpen,
        setIsSellModalOpen,
        infoModalType,
        setInfoModalType,
        currentView,
        setCurrentView,
        addNewProperty,
        deleteProperty,
        refreshProperties: loadProperties,
        toast,
        showToast,
        supabaseConfig,
        reloadSupabaseConfig,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
};
