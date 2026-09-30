import React, { createContext, useContext, useState, useEffect } from 'react';
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

export type InfoModalType = 'faq' | 'relocation' | 'about' | 'terms' | 'privacy' | 'contact' | 'trust' | null;

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
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'signup';
  setAuthMode: (mode: 'login' | 'signup') => void;
  openAuthModal: (mode?: 'login' | 'signup') => void;
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
  currentView: 'home' | 'dashboard';
  setCurrentView: (view: 'home' | 'dashboard') => void;
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
  moveInDate: '',
  propertyType: 'all',
  priceRange: 'all',
  beds: 'all',
};

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
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
  const [isMortgageModalOpen, setIsMortgageModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState<InfoModalType>(null);
  const [currentView, setCurrentView] = useState<'home' | 'dashboard'>('home');

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
    const data = await apiGetProperties();
    setProperties(data);
  };

  // Sync Supabase Auth state
  useEffect(() => {
    loadProperties();
    loadUsers();

    const client = getSupabaseClient();
    if (client) {
      client.auth.getSession().then(({ data }) => {
        if (data.session?.user) {
          const profile: UserProfile = {
            id: data.session.user.id,
            email: data.session.user.email || '',
            role: data.session.user.user_metadata?.role || 'doctor',
            full_name: data.session.user.user_metadata?.full_name || '',
          };
          setUser(profile);
          localStorage.setItem('medproperties_user', JSON.stringify(profile));
        }
      });

      const { data: authListener } = client.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const profile: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            role: session.user.user_metadata?.role || 'doctor',
            full_name: session.user.user_metadata?.full_name || '',
          };
          setUser(profile);
          localStorage.setItem('medproperties_user', JSON.stringify(profile));
        } else {
          setUser(null);
          localStorage.removeItem('medproperties_user');
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  // Update online presence in registry whenever active user changes
  useEffect(() => {
    if (user?.email) {
      apiRecordUserLogin(user).then((list) => {
        setAllUsers(list);
      });
    }
  }, [user?.email, user?.role]);

  const signOut = async () => {
    const client = getSupabaseClient();
    if (client) {
      await client.auth.signOut();
    }
    if (user?.email) {
      await apiRecordUserLogout(user.email);
      await loadUsers();
    }
    setUser(null);
    setCurrentView('home');
    localStorage.removeItem('medproperties_user');
    showToast('Signed out successfully.');
  };

  const reloadSupabaseConfig = () => {
    setSupabaseConfig(getStoredSupabaseConfig());
    loadProperties();
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem('medproperties_favorites', JSON.stringify(next));
      showToast(exists ? 'Removed from saved properties' : 'Saved to your favorite properties!');
      return next;
    });
  };

  const addNewProperty = async (propData: Omit<Property, 'id' | 'created_at'>) => {
    const created = await apiAddProperty(propData);
    setProperties((prev) => [created, ...prev]);
    showToast('Property listed successfully in database!');
  };

  const deleteProperty = async (id: string) => {
    await apiDeleteProperty(id);
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // Filter properties logic with seamless Buy/Rent support
  const filteredProperties = properties.map((item) => {
    // If in Buy mode, adapt purchase pricing
    if (filters.tab === 'buy') {
      const purchasePriceMap: Record<string, number> = {
        'Indiranagar Doctor Retreat': 18500000,
        'Whitefield Medical Penthouse': 24000000,
        'Jubilee Hills Physician Estate': 45000000,
        'Bandra West Coastal Suites': 38000000,
        'South Ext Residency Suite': 12500000,
        'Nungambakkam Clinical Haven': 9500000,
      };
      return {
        ...item,
        category: 'buy' as const,
        price: purchasePriceMap[item.title] || item.price * 250,
        period: '',
      };
    }
    return item;
  }).filter((item) => {
    if (filters.location.trim()) {
      const query = filters.location.toLowerCase();
      const matchCity = item.city.toLowerCase().includes(query);
      const matchAddress = item.address.toLowerCase().includes(query);
      const matchTitle = item.title.toLowerCase().includes(query);
      if (!matchCity && !matchAddress && !matchTitle) return false;
    }

    if (filters.propertyType !== 'all') {
      if (!item.property_type.toLowerCase().includes(filters.propertyType.toLowerCase())) {
        return false;
      }
    }

    if (filters.beds !== 'all') {
      const numBeds = parseInt(filters.beds, 10);
      if (item.beds < numBeds) return false;
    }

    if (filters.priceRange !== 'all') {
      if (filters.tab === 'rent') {
        if (filters.priceRange === 'under-2000' && item.price >= 50000) return false;
        if (filters.priceRange === '2000-3000' && (item.price < 50000 || item.price > 100000)) return false;
        if (filters.priceRange === 'above-3000' && item.price <= 100000) return false;
      } else {
        if (filters.priceRange === 'under-2000' && item.price >= 15000000) return false;
        if (filters.priceRange === '2000-3000' && (item.price < 15000000 || item.price > 30000000)) return false;
        if (filters.priceRange === 'above-3000' && item.price <= 30000000) return false;
      }
    }

    return true;
  });

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
        isAddModalOpen,
        setIsAddModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        openAuthModal,
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
