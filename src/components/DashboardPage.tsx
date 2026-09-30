import React, { useState, useEffect, useMemo } from 'react';
import { useProperties } from '../context/PropertyContext';
import { apiGetInquiries } from '../lib/supabase';
import { Property, InquiryFormData, UserProfile, UserRole } from '../types';
import {
  Building2,
  PlusCircle,
  Trash2,
  Heart,
  Mail,
  Phone,
  ArrowLeft,
  Sparkles,
  Stethoscope,
  ShieldCheck,
  Bed,
  Bath,
  Maximize2,
  Clock,
  Eye,
  LogOut,
  Users,
  Crown,
  Search,
  CheckCircle,
  MapPin,
  Laptop,
  CheckCircle2,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    user,
    properties,
    favorites,
    setCurrentView,
    setIsAddModalOpen,
    setSelectedProperty,
    addNewProperty,
    deleteProperty,
    showToast,
    signOut,
    allUsers,
    deleteUser,
  } = useProperties();

  const isSuperAdmin = user?.role === 'superadmin';

  const [activeTab, setActiveTab] = useState<'users' | 'all_properties' | 'listings' | 'inquiries' | 'favorites'>(
    isSuperAdmin ? 'users' : 'listings'
  );
  const [inquiries, setInquiries] = useState<InquiryFormData[]>([]);
  const [loading, setLoading] = useState(false);

  // User search & filters for Superadmin
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'online' | UserRole>('all');

  // Property search & filters for Master Catalog
  const [propertySearchQuery, setPropertySearchQuery] = useState('');
  const [propertyCategoryFilter, setPropertyCategoryFilter] = useState<'all' | 'rent' | 'buy'>('all');
  const [propertyCityFilter, setPropertyCityFilter] = useState<string>('all');

  useEffect(() => {
    apiGetInquiries().then(setInquiries);
  }, []);

  // Ensure superadmin defaults to 'users' tab if on regular 'listings'
  useEffect(() => {
    if (isSuperAdmin && activeTab === 'listings') {
      setActiveTab('users');
    }
  }, [isSuperAdmin]);

  // Normal user listings
  const userListings = useMemo(() => {
    return properties.filter((p) => {
      if (user?.email && p.owner_email === user.email) return true;
      if (
        user?.email === 'doctor.demo@medproperties.com' &&
        (!p.owner_email || p.owner_email === 'doctor.demo@medproperties.com')
      ) {
        return p.title === 'Indiranagar Doctor Retreat' || p.title === 'Whitefield Medical Penthouse';
      }
      return false;
    });
  }, [properties, user?.email]);

  const savedProperties = properties.filter((p) => favorites.includes(p.id));

  // Superadmin: Filtered Users List
  const filteredUsers = useMemo(() => {
    return allUsers.filter((u) => {
      // Role or Online filter
      if (userRoleFilter === 'online' && u.status !== 'online') return false;
      if (userRoleFilter !== 'all' && userRoleFilter !== 'online' && u.role !== userRoleFilter) return false;

      // Text search
      if (userSearchQuery.trim()) {
        const query = userSearchQuery.toLowerCase();
        const matchName = u.full_name?.toLowerCase().includes(query) || false;
        const matchEmail = u.email.toLowerCase().includes(query);
        const matchHospital = u.hospital?.toLowerCase().includes(query) || false;
        const matchLocation = u.location?.toLowerCase().includes(query) || false;
        return matchName || matchEmail || matchHospital || matchLocation;
      }
      return true;
    });
  }, [allUsers, userRoleFilter, userSearchQuery]);

  // Superadmin: Filtered All Properties
  const filteredAllProperties = useMemo(() => {
    return properties.filter((p) => {
      if (propertyCategoryFilter !== 'all' && p.category !== propertyCategoryFilter) return false;
      if (propertyCityFilter !== 'all' && !p.city.toLowerCase().includes(propertyCityFilter.toLowerCase())) return false;
      if (propertySearchQuery.trim()) {
        const query = propertySearchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(query);
        const matchAddress = p.address.toLowerCase().includes(query);
        const matchCity = p.city.toLowerCase().includes(query);
        const matchOwner = p.owner_email?.toLowerCase().includes(query) || false;
        return matchTitle || matchAddress || matchCity || matchOwner;
      }
      return true;
    });
  }, [properties, propertyCategoryFilter, propertyCityFilter, propertySearchQuery]);

  // Online users count
  const onlineUsersCount = useMemo(() => {
    return allUsers.filter((u) => u.status === 'online').length;
  }, [allUsers]);

  const doctorCount = useMemo(() => allUsers.filter((u) => u.role === 'doctor').length, [allUsers]);
  const landlordCount = useMemo(() => allUsers.filter((u) => u.role === 'landlord').length, [allUsers]);

  const handleDeleteListing = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to remove "${title}" from the platform listings?`)) return;
    setLoading(true);
    await deleteProperty(id);
    setLoading(false);
    showToast(`Removed "${title}" from listings.`);
  };

  const handleDeleteUser = async (u: UserProfile) => {
    if (u.id === user?.id || u.email === user?.email) {
      showToast('Cannot deactivate your own active Super Admin session.', 'error');
      return;
    }
    if (!window.confirm(`Are you sure you want to deactivate and remove user "${u.full_name || u.email}"?`)) return;
    await deleteUser(u.id);
  };

  const handleClaimSampleListings = async () => {
    if (!user) return;
    setLoading(true);
    await addNewProperty({
      title: 'Koramangala Medical Suites',
      address: '80ft Road, 4th Block Koramangala',
      city: 'Bengaluru',
      state: 'Karnataka',
      price: 52000,
      period: 'month',
      beds: 3,
      baths: 2,
      dimensions: '1,550 sq.ft',
      image_url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      category: 'rent',
      property_type: 'High-Rise Apartment',
      is_popular: true,
      description: 'Serene physician residence situated under 10 minutes from St. John\'s Medical College Hospital.',
      hospital_distance: '1.8 km to St. John\'s Medical College',
      owner_email: user.email,
      status: 'active',
    });
    setLoading(false);
  };

  // Helper formatting for time
  const formatTimeAgo = (dateStr?: string) => {
    if (!dateStr) return 'Recently';
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 2) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex flex-col lg:flex-row">
      
      {/* Integrated Full-Height Left Sidebar */}
      <aside className="w-full lg:w-60 xl:w-64 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between shrink-0 lg:h-screen lg:sticky lg:top-0 z-30">
        
        {/* Sidebar Top: Logo + Back to Explore */}
        <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <img src="/logo.png" alt="MedProperties" className="h-8 w-auto object-contain" />
          </button>

          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-[#008374] transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-slate-50"
            title="Return to Marketplace"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Explore</span>
          </button>
        </div>

        {/* Sidebar Middle: Options stacked one by one */}
        <div className="px-3 py-4 flex-1 overflow-y-auto space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between px-2.5 mb-1.5">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                {isSuperAdmin ? 'Admin Management' : 'Menu'}
              </span>
              {isSuperAdmin && (
                <span className="text-[9px] font-extrabold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                  <Crown className="w-2.5 h-2.5" />
                  Super Admin
                </span>
              )}
            </div>

            {/* Super Admin Tab 1: All Logged In Users */}
            {isSuperAdmin && (
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  activeTab === 'users'
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/20'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Users className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'users' ? 'text-white' : 'text-purple-600'}`} />
                  <span className="truncate">All Logged In Users</span>
                </div>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${
                    activeTab === 'users'
                      ? 'bg-white/20 text-white'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {onlineUsersCount} Online
                </span>
              </button>
            )}

            {/* Super Admin Tab 2: Master Properties Catalog */}
            {isSuperAdmin && (
              <button
                onClick={() => setActiveTab('all_properties')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  activeTab === 'all_properties'
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/20'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Building2 className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'all_properties' ? 'text-white' : 'text-purple-600'}`} />
                  <span className="truncate">All Properties</span>
                </div>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                    activeTab === 'all_properties' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {properties.length}
                </span>
              </button>
            )}

            {/* Standard User Tab 1: My Listed Properties */}
            {!isSuperAdmin && (
              <button
                onClick={() => setActiveTab('listings')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  activeTab === 'listings'
                    ? 'bg-[#008374] text-white shadow-sm shadow-[#008374]/20'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Building2 className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'listings' ? 'text-white' : 'text-[#008374]'}`} />
                  <span className="truncate">My Listed Properties</span>
                </div>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                    activeTab === 'listings' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {userListings.length}
                </span>
              </button>
            )}

            {/* Tenant Inquiries Tab */}
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === 'inquiries'
                  ? isSuperAdmin
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/20'
                    : 'bg-[#008374] text-white shadow-sm shadow-[#008374]/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Mail
                  className={`w-3.5 h-3.5 shrink-0 ${
                    activeTab === 'inquiries'
                      ? 'text-white'
                      : isSuperAdmin
                      ? 'text-purple-600'
                      : 'text-[#008374]'
                  }`}
                />
                <span className="truncate">Tenant Inquiries</span>
              </div>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                  activeTab === 'inquiries' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {inquiries.length > 0 ? inquiries.length : 2}
              </span>
            </button>

            {/* Saved Homes Tab */}
            <button
              onClick={() => setActiveTab('favorites')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === 'favorites'
                  ? isSuperAdmin
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/20'
                    : 'bg-[#008374] text-white shadow-sm shadow-[#008374]/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Heart className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'favorites' ? 'text-white' : 'text-rose-500'}`} />
                <span className="truncate">Saved Homes</span>
              </div>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                  activeTab === 'favorites' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {favorites.length}
              </span>
            </button>
          </div>

          {/* List New Property Action Button */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className={`w-full flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer shadow-xs ${
                isSuperAdmin
                  ? 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-[#008374] border-emerald-200'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{isSuperAdmin ? '+ Add Platform Listing' : 'List New Property'}</span>
            </button>
          </div>
        </div>

        {/* Sidebar Bottom Left Corner: Profile & Sign Out */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-8 h-8 rounded-xl text-white flex items-center justify-center text-xs font-extrabold shadow-sm shrink-0 ${
                  isSuperAdmin
                    ? 'bg-gradient-to-tr from-purple-700 to-indigo-600'
                    : 'bg-gradient-to-tr from-[#008374] to-emerald-400'
                }`}
              >
                {isSuperAdmin ? (
                  <Crown className="w-4 h-4 text-amber-300" />
                ) : user?.email ? (
                  user.email.charAt(0).toUpperCase()
                ) : (
                  'D'
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-[#0A2540] text-xs leading-tight truncate block">
                    {isSuperAdmin
                      ? 'Super Admin Console'
                      : user?.full_name ||
                        (user?.email === 'doctor.demo@medproperties.com'
                          ? 'Dr. Rajesh Sharma, MD'
                          : user?.email ? user.email.split('@')[0] : 'Dr. Member')}
                  </span>
                  {isSuperAdmin ? (
                    <Crown className="w-3 h-3 text-purple-600 shrink-0" />
                  ) : (
                    <ShieldCheck className="w-3 h-3 text-[#008374] shrink-0" />
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-medium truncate">
                  {user?.email || 'superadmin@medproperties.com'}
                </p>
              </div>
            </div>

            <button
              onClick={() => signOut()}
              className="p-1.5 border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-500 hover:text-rose-600 rounded-lg transition-all cursor-pointer shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area (Right Side, Integrated Full Screen) */}
      <main className="flex-1 min-w-0 bg-[#F8FAFB] min-h-screen p-6 sm:p-8 lg:p-10 space-y-8 overflow-y-auto">
        
        {/* Metric Cards Banner */}
        {isSuperAdmin ? (
          /* Super Admin Metrics */
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-xs font-bold text-slate-400 block mb-1">Total Users Registered</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0A2540]">{allUsers.length}</span>
              <span className="text-[11px] text-purple-700 font-semibold block mt-1">Platform Account Registry</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-xs font-bold text-slate-400 block mb-1">Users Logged In Now</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{onlineUsersCount}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
              </div>
              <span className="text-[11px] text-slate-400 font-medium block mt-1">Active Real-Time Sessions</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-xs font-bold text-slate-400 block mb-1">Total Platform Properties</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#008374]">{properties.length}</span>
              <span className="text-[11px] text-slate-400 font-medium block mt-1">Across 5 Indian Metros</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-xs font-bold text-slate-400 block mb-1">Physician Inquiries</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0A2540]">
                {inquiries.length > 0 ? inquiries.length : 2}
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold block mt-1">100% Doctor Verification</span>
            </div>
          </div>
        ) : (
          /* Normal User Metrics */
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-xs font-bold text-slate-400 block mb-1">My Active Listings</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0A2540]">{userListings.length}</span>
              <span className="text-[11px] text-emerald-600 font-semibold block mt-1">Live in PostgreSQL</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-xs font-bold text-slate-400 block mb-1">Inquiries Received</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#008374]">
                {inquiries.length > 0 ? inquiries.length : 2}
              </span>
              <span className="text-[11px] text-slate-400 font-medium block mt-1">From Doctors & Residents</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-xs font-bold text-slate-400 block mb-1">Saved Properties</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0A2540]">{favorites.length}</span>
              <span className="text-[11px] text-slate-400 font-medium block mt-1">In your personal drawer</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-xs font-bold text-slate-400 block mb-1">Monthly Placement Rate</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#008374]">100%</span>
              <span className="text-[11px] text-emerald-600 font-semibold block mt-1">Physician Guarantee</span>
            </div>
          </div>
        )}

        {/* TAB 1: SUPER ADMIN - ALL LOGGED IN USERS */}
        {isSuperAdmin && activeTab === 'users' && (
          <div className="space-y-6">
            
            {/* Header & Controls */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-extrabold text-[#0A2540] flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    All Users Logged In & Registered Sessions
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Live visibility into all active physicians, landlords, and platform administrators authenticated on MedProperties India.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5" />
                    Super Admin Visibility
                  </span>
                </div>
              </div>

              {/* Search & Role Filter Tabs */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="Search by name, email, hospital (e.g. AIIMS, Manipal), or city..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl text-xs font-semibold border border-slate-200 focus:outline-none focus:border-purple-600 text-slate-900"
                  />
                  {userSearchQuery && (
                    <button
                      onClick={() => setUserSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 bg-slate-100 rounded-xl shrink-0 text-xs font-bold">
                  <button
                    onClick={() => setUserRoleFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      userRoleFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    All ({allUsers.length})
                  </button>
                  <button
                    onClick={() => setUserRoleFilter('online')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                      userRoleFilter === 'online' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Online ({onlineUsersCount})
                  </button>
                  <button
                    onClick={() => setUserRoleFilter('doctor')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      userRoleFilter === 'doctor' ? 'bg-white text-[#008374] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Doctors ({doctorCount})
                  </button>
                  <button
                    onClick={() => setUserRoleFilter('landlord')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      userRoleFilter === 'landlord' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Landlords ({landlordCount})
                  </button>
                </div>
              </div>
            </div>

            {/* Users Table / Grid */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                      <th className="py-3.5 px-6">User & Profile</th>
                      <th className="py-3.5 px-4">Role</th>
                      <th className="py-3.5 px-4">Hospital / Location</th>
                      <th className="py-3.5 px-4">Current Status</th>
                      <th className="py-3.5 px-4">Last Login</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((u) => {
                        const isCurrent = u.email === user?.email;
                        const isOnline = u.status === 'online';

                        return (
                          <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                            {/* User details */}
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <div
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-white text-xs shadow-xs ${
                                      u.role === 'superadmin'
                                        ? 'bg-gradient-to-tr from-purple-600 to-indigo-600'
                                        : u.role === 'landlord'
                                        ? 'bg-gradient-to-tr from-blue-600 to-cyan-600'
                                        : 'bg-gradient-to-tr from-[#008374] to-teal-500'
                                    }`}
                                  >
                                    {u.role === 'superadmin' ? (
                                      <Crown className="w-4 h-4 text-amber-300" />
                                    ) : (
                                      u.full_name?.charAt(0) || u.email.charAt(0).toUpperCase()
                                    )}
                                  </div>
                                  <span
                                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                                      isOnline ? 'bg-emerald-500' : 'bg-slate-300'
                                    }`}
                                  />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-[#0A2540] truncate block">
                                      {u.full_name || u.email.split('@')[0]}
                                    </span>
                                    {isCurrent && (
                                      <span className="text-[9px] font-extrabold bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded-md">
                                        You
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] text-slate-400 block truncate">{u.email}</span>
                                </div>
                              </div>
                            </td>

                            {/* Role badge */}
                            <td className="py-4 px-4">
                              {u.role === 'superadmin' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200">
                                  <Crown className="w-3 h-3 text-purple-600" />
                                  Super Admin
                                </span>
                              )}
                              {u.role === 'doctor' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-[#008374] border border-emerald-200">
                                  <Stethoscope className="w-3 h-3" />
                                  Physician / Resident
                                </span>
                              )}
                              {u.role === 'landlord' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                                  <ShieldCheck className="w-3 h-3" />
                                  Property Owner
                                </span>
                              )}
                            </td>

                            {/* Hospital / Posting Location */}
                            <td className="py-4 px-4">
                              <div>
                                <span className="font-semibold text-slate-800 block text-xs">
                                  {u.hospital || 'Hospital Network Partner'}
                                </span>
                                <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-3 h-3 text-slate-400" />
                                  {u.location || 'India'}
                                </span>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-4 px-4">
                              {isOnline ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  Online Now
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                  Offline
                                </span>
                              )}
                            </td>

                            {/* Last Login & Device */}
                            <td className="py-4 px-4">
                              <div className="text-[11px]">
                                <span className="font-bold text-slate-700 block">
                                  {formatTimeAgo(u.last_login)}
                                </span>
                                <span className="text-slate-400 flex items-center gap-1 mt-0.5 truncate max-w-[160px]">
                                  <Laptop className="w-3 h-3 shrink-0" />
                                  {u.device || 'Web Session'}
                                </span>
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-6 text-right">
                              {isCurrent ? (
                                <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">
                                  Active Session
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleDeleteUser(u)}
                                  className="p-1.5 border border-slate-200 hover:border-rose-300 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="Deactivate and remove user"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-slate-400">
                          <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <p className="font-bold text-slate-600 text-sm">No users match your search criteria</p>
                          <p className="text-xs text-slate-400 mt-1">Try searching a different name, hospital, or reset filters.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: SUPER ADMIN - MASTER ALL PROPERTIES */}
        {isSuperAdmin && activeTab === 'all_properties' && (
          <div className="space-y-6">
            
            {/* Header & Master Filter Bar */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-extrabold text-[#0A2540] flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-purple-600" />
                    Master Real Estate Catalog ({properties.length} Properties)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Super Admin oversight across all hospital-adjacent properties listed for rent or purchase in Bengaluru, Mumbai, Delhi NCR, Hyderabad, and Chennai.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <PlusCircle className="w-4 h-4" />
                  + Add Property to Master Catalog
                </button>
              </div>

              {/* Filter controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {/* Search query */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={propertySearchQuery}
                    onChange={(e) => setPropertySearchQuery(e.target.value)}
                    placeholder="Search title, address, owner..."
                    className="w-full pl-10 pr-3 py-2 bg-slate-50 rounded-xl text-xs font-semibold border border-slate-200 focus:outline-none focus:border-purple-600 text-slate-900"
                  />
                </div>

                {/* Category filter */}
                <div>
                  <select
                    value={propertyCategoryFilter}
                    onChange={(e) => setPropertyCategoryFilter(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs font-semibold border border-slate-200 focus:outline-none focus:border-purple-600 text-slate-900 cursor-pointer"
                  >
                    <option value="all">All Categories (Rent & Buy)</option>
                    <option value="rent">For Rent Only</option>
                    <option value="buy">For Buy / Sale Only</option>
                  </select>
                </div>

                {/* City filter */}
                <div>
                  <select
                    value={propertyCityFilter}
                    onChange={(e) => setPropertyCityFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs font-semibold border border-slate-200 focus:outline-none focus:border-purple-600 text-slate-900 cursor-pointer"
                  >
                    <option value="all">All Cities across India</option>
                    <option value="Bengaluru">Bengaluru, Karnataka</option>
                    <option value="Mumbai">Mumbai, Maharashtra</option>
                    <option value="Delhi">Delhi NCR (AIIMS / Max)</option>
                    <option value="Hyderabad">Hyderabad, Telangana</option>
                    <option value="Chennai">Chennai, Tamil Nadu</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Properties Grid */}
            {filteredAllProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAllProperties.map((property) => (
                  <div
                    key={property.id}
                    className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all"
                  >
                    <div>
                      <div className="relative aspect-[16/10] bg-slate-100">
                        <img
                          src={property.image_url}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 left-3 bg-emerald-500/95 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md shadow-xs">
                          ● Active Listing
                        </span>
                        <span className="absolute top-3 right-3 bg-navy-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                          For {property.category}
                        </span>
                      </div>

                      <div className="p-5 space-y-2">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-extrabold text-[#008374]">
                            ₹{property.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-slate-400">/{property.period || 'month'}</span>
                        </div>

                        <h3 className="font-bold text-[#0A2540] text-base leading-snug">{property.title}</h3>
                        <p className="text-xs text-slate-400 truncate">{property.address}</p>

                        {property.hospital_distance && (
                          <div className="text-[11px] font-semibold text-[#008374] bg-emerald-50/70 px-2.5 py-1 rounded-lg">
                            {property.hospital_distance}
                          </div>
                        )}

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                          <span className="flex items-center gap-1">
                            <Bed className="w-3.5 h-3.5 text-[#008374]" /> {property.beds} BHK
                          </span>
                          <span className="flex items-center gap-1">
                            <Bath className="w-3.5 h-3.5 text-[#008374]" /> {property.baths} Baths
                          </span>
                          <span className="flex items-center gap-1">
                            <Maximize2 className="w-3.5 h-3.5 text-[#008374]" /> {property.dimensions}
                          </span>
                        </div>

                        {/* Owner Information */}
                        <div className="pt-2 border-t border-slate-50 text-[10px] text-slate-400 flex items-center justify-between">
                          <span className="truncate">Listed By: {property.owner_email || 'Verified Landlord'}</span>
                          <span className="font-bold text-slate-500">{property.city}</span>
                        </div>
                      </div>
                    </div>

                    {/* Admin Actions */}
                    <div className="p-4 pt-0 border-t border-slate-50 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedProperty(property)}
                        className="flex-1 py-2 bg-slate-50 hover:bg-purple-50 hover:text-purple-700 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Preview Details
                      </button>
                      <button
                        onClick={() => handleDeleteListing(property.id, property.title)}
                        className="p-2 border border-slate-200 hover:border-rose-300 text-slate-400 hover:text-rose-600 rounded-xl transition-colors cursor-pointer"
                        title="Remove listing from master catalog"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200 space-y-3">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="font-bold text-[#0A2540]">No Properties Found</h4>
                <p className="text-xs text-slate-500">No properties matched the selected filters.</p>
                <button
                  onClick={() => {
                    setPropertySearchQuery('');
                    setPropertyCategoryFilter('all');
                    setPropertyCityFilter('all');
                  }}
                  className="px-4 py-2 bg-purple-600 text-white font-bold text-xs rounded-xl"
                >
                  Reset Filters
                </button>
              </div>
            )}

          </div>
        )}

        {/* TAB 3: NORMAL USER - MY LISTED PROPERTIES */}
        {!isSuperAdmin && activeTab === 'listings' && (
          <div className="space-y-6">
            {userListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {userListings.map((property) => (
                  <div
                    key={property.id}
                    className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all"
                  >
                    <div>
                      <div className="relative aspect-[16/10] bg-slate-100">
                        <img
                          src={property.image_url}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 left-3 bg-emerald-500/95 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md shadow-xs">
                          ● Active Listing
                        </span>
                        <span className="absolute top-3 right-3 bg-navy-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                          For {property.category}
                        </span>
                      </div>

                      <div className="p-5 space-y-2">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-extrabold text-[#008374]">
                            ₹{property.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-slate-400">/{property.period || 'month'}</span>
                        </div>

                        <h3 className="font-bold text-[#0A2540] text-base">{property.title}</h3>
                        <p className="text-xs text-slate-400 truncate">{property.address}</p>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                          <span className="flex items-center gap-1">
                            <Bed className="w-3.5 h-3.5 text-[#008374]" /> {property.beds} BHK
                          </span>
                          <span className="flex items-center gap-1">
                            <Bath className="w-3.5 h-3.5 text-[#008374]" /> {property.baths} Baths
                          </span>
                          <span className="flex items-center gap-1">
                            <Maximize2 className="w-3.5 h-3.5 text-[#008374]" /> {property.dimensions}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="p-4 pt-0 border-t border-slate-50 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedProperty(property)}
                        className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Preview
                      </button>
                      <button
                        onClick={() => handleDeleteListing(property.id, property.title)}
                        className="p-2 border border-slate-200 hover:border-rose-300 text-slate-400 hover:text-rose-600 rounded-xl transition-colors cursor-pointer"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200 space-y-4 max-w-xl mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#008374] flex items-center justify-center mx-auto">
                  <Building2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0A2540]">You haven't listed any properties yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Connect your real estate with verified Indian doctors, medical postgraduates, and hospital fellows.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#008374] hover:bg-[#007063] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    + Add New Listing
                  </button>
                  <button
                    onClick={handleClaimSampleListings}
                    disabled={loading}
                    className="w-full sm:w-auto px-5 py-2.5 border border-brand-200 bg-brand-50 text-[#008374] font-bold text-xs rounded-xl hover:bg-brand-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Assign Sample Listing
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: TENANT INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-bold text-[#0A2540] text-sm">
                Tour Inquiries from Medical Professionals across India
              </h3>
              
              <div className="divide-y divide-slate-100">
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0A2540] text-sm">Dr. Rajesh Sharma, MD</span>
                      <span className="text-[10px] font-extrabold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                        Cardiology Resident
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      "Looking for a 12-month lease starting June 20th. Relocating to AIIMS New Delhi."
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                      <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-[#008374]" /> rajesh.sharma@aiims.edu</span>
                      <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-[#008374]" /> +91 98101 23456</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#008374]" /> Tour: June 15, 2026</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl shrink-0 self-start sm:self-auto">
                    Verified MD Credentials
                  </span>
                </div>

                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0A2540] text-sm">Dr. Sneha Patel, MS</span>
                      <span className="text-[10px] font-extrabold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                        Pediatric Surgery Resident
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      "Requesting a private video walk-through of the master suite blackout curtains and quiet study near Manipal Hospital."
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                      <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-[#008374]" /> sneha.patel@manipal.org</span>
                      <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-[#008374]" /> +91 98450 87654</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#008374]" /> Tour: July 1, 2026</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl shrink-0 self-start sm:self-auto">
                    Verified MD Credentials
                  </span>
                </div>

                {inquiries.map((inq, idx) => (
                  <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#0A2540] text-sm">{inq.name}</span>
                        <span className="text-[10px] font-extrabold bg-emerald-50 text-[#008374] px-2 py-0.5 rounded-full">
                          {inq.medical_role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">"{inq.message}"</p>
                      <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                        <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-[#008374]" /> {inq.email}</span>
                        {inq.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-[#008374]" /> {inq.phone}</span>}
                        {inq.tour_date && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#008374]" /> {inq.tour_date}</span>}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl shrink-0 self-start sm:self-auto">
                      Direct Application
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SAVED PROPERTIES */}
        {activeTab === 'favorites' && (
          <div className="space-y-6">
            {savedProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {savedProperties.map((property) => (
                  <div
                    key={property.id}
                    onClick={() => setSelectedProperty(property)}
                    className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-lg transition-all"
                  >
                    <div className="relative aspect-[16/10] bg-slate-100">
                      <img src={property.image_url} alt={property.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-sm">
                        <Heart className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                    <div className="p-5 space-y-1">
                      <span className="text-lg font-extrabold text-[#008374]">₹{property.price.toLocaleString('en-IN')}/mo</span>
                      <h4 className="font-bold text-[#0A2540]">{property.title}</h4>
                      <p className="text-xs text-slate-400">{property.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200 space-y-3">
                <Heart className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="font-bold text-[#0A2540]">No Saved Homes Yet</h4>
                <p className="text-xs text-slate-500">Click the heart icon on any home to bookmark it.</p>
                <button
                  onClick={() => setCurrentView('home')}
                  className="px-5 py-2.5 bg-[#008374] text-white font-bold text-xs rounded-xl"
                >
                  Explore Homes
                </button>
              </div>
            )}
          </div>
        )}

      </main>

    </div>
  );
};
