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
  UserCheck,
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
  PhoneCall,
  Activity,
  ChevronRight,
  Zap,
  VolumeX,
  Award,
  Shield,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    user,
    properties,
    favorites,
    setCurrentView,
    setIsAddModalOpen,
    viewPropertyDetail,
    addNewProperty,
    deleteProperty,
    showToast,
    signOut,
    allUsers,
    deleteUser,
    openConciergeModal,
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
    <div className="min-h-screen bg-[#F4F7F9] flex flex-col lg:flex-row">
      
      {/* Integrated Full-Height Left Sidebar - Executive Midnight Navy */}
      <aside className="w-full lg:w-64 xl:w-72 bg-[#09131F] text-slate-300 border-b lg:border-b-0 lg:border-r border-slate-800/80 flex flex-col justify-between shrink-0 lg:h-screen lg:sticky lg:top-0 z-30 shadow-2xl">
        
        {/* Sidebar Top: Logo + Back to Explore */}
        <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between bg-[#060D16]/50">
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="h-8 w-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center p-1">
              <img src="/logo.png" alt="MedProperties" className="h-5 w-auto object-contain" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold text-white tracking-tight leading-none">
                MedProperties
              </span>
              <span className="text-[10px] text-teal-400 font-semibold tracking-wider uppercase mt-0.5">
                Executive Portal
              </span>
            </div>
          </button>

          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
            title="Return to Marketplace"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-teal-400" />
            <span>Explore</span>
          </button>
        </div>

        {/* Sidebar Middle: Options stacked one by one */}
        <div className="px-3.5 py-5 flex-1 overflow-y-auto space-y-5">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {isSuperAdmin ? 'Admin Management' : 'Navigation Menu'}
              </span>
              {isSuperAdmin && (
                <span className="text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-300" />
                  Super Admin
                </span>
              )}
            </div>

            {/* Super Admin Tab 1: All Logged In Users */}
            {isSuperAdmin && (
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  activeTab === 'users'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border-l-2 border-purple-300'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Users className={`w-4 h-4 shrink-0 ${activeTab === 'users' ? 'text-white' : 'text-purple-400'}`} />
                  <span className="truncate">All Logged In Users</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${
                    activeTab === 'users'
                      ? 'bg-white/20 text-white'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {onlineUsersCount} Online
                </span>
              </button>
            )}

            {/* Super Admin Tab 2: Master Properties Catalog */}
            {isSuperAdmin && (
              <button
                onClick={() => setActiveTab('all_properties')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  activeTab === 'all_properties'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border-l-2 border-purple-300'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Building2 className={`w-4 h-4 shrink-0 ${activeTab === 'all_properties' ? 'text-white' : 'text-purple-400'}`} />
                  <span className="truncate">Master Properties</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    activeTab === 'all_properties' ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-300'
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
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  activeTab === 'listings'
                    ? 'bg-gradient-to-r from-[#008374] to-[#00a896] text-white shadow-lg shadow-[#008374]/30 border-l-2 border-teal-300'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Building2 className={`w-4 h-4 shrink-0 ${activeTab === 'listings' ? 'text-white' : 'text-teal-400'}`} />
                  <span className="truncate">My Listed Properties</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    activeTab === 'listings' ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-300'
                  }`}
                >
                  {userListings.length}
                </span>
              </button>
            )}

            {/* Tenant Inquiries Tab */}
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === 'inquiries'
                  ? isSuperAdmin
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border-l-2 border-purple-300'
                    : 'bg-gradient-to-r from-[#008374] to-[#00a896] text-white shadow-lg shadow-[#008374]/30 border-l-2 border-teal-300'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Mail
                  className={`w-4 h-4 shrink-0 ${
                    activeTab === 'inquiries'
                      ? 'text-white'
                      : isSuperAdmin
                      ? 'text-purple-400'
                      : 'text-teal-400'
                  }`}
                />
                <span className="truncate">Physician Inquiries</span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  activeTab === 'inquiries' ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-300'
                }`}
              >
                {inquiries.length}
              </span>
            </button>

            {/* Saved Homes Tab */}
            <button
              onClick={() => setActiveTab('favorites')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === 'favorites'
                  ? isSuperAdmin
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border-l-2 border-purple-300'
                    : 'bg-gradient-to-r from-[#008374] to-[#00a896] text-white shadow-lg shadow-[#008374]/30 border-l-2 border-teal-300'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Heart className={`w-4 h-4 shrink-0 ${activeTab === 'favorites' ? 'text-white' : 'text-rose-400'}`} />
                <span className="truncate">Saved Sanctuaries</span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  activeTab === 'favorites' ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-300'
                }`}
              >
                {favorites.length}
              </span>
            </button>
          </div>

          {/* List New Property Action Button */}
          <div className="pt-3 border-t border-slate-800/80">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md ${
                isSuperAdmin
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border border-purple-400/30'
                  : 'bg-gradient-to-r from-[#008374] to-[#00a896] hover:from-[#007063] hover:to-[#008374] text-white border border-teal-300/30 shadow-[#008374]/20'
              }`}
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span>{isSuperAdmin ? '+ Add Platform Listing' : '+ List New Property'}</span>
            </button>
          </div>
        </div>

        {/* Sidebar Bottom Left Corner: Profile & Sign Out */}
        <div className="p-3.5 border-t border-slate-800/80 bg-[#060D16]">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-9 h-9 rounded-xl text-white flex items-center justify-center text-xs font-extrabold shadow-sm shrink-0 border border-white/10 ${
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
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-white text-xs leading-tight truncate block">
                    {isSuperAdmin
                      ? 'Super Admin'
                      : user?.full_name ||
                        (user?.email === 'doctor.demo@medproperties.com'
                          ? 'Dr. Rajesh Sharma'
                          : user?.email ? user.email.split('@')[0] : 'Dr. Member')}
                  </span>
                  {isSuperAdmin ? (
                    <Crown className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  ) : (
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                  {user?.email || 'superadmin@medproperties.com'}
                </p>
              </div>
            </div>

            <button
              onClick={() => signOut()}
              className="p-2 border border-slate-700/80 hover:bg-rose-500/20 hover:border-rose-500/50 text-slate-400 hover:text-rose-300 rounded-lg transition-all cursor-pointer shrink-0"
              title="Sign Out Session"
            >
              <LogOut className="w-4 h-4" />
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
              <span className="text-xs text-purple-700 font-semibold block mt-1">Platform Account Registry</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-xs font-bold text-slate-400 block mb-1">Users Logged In Now</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{onlineUsersCount}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
              </div>
              <span className="text-xs text-slate-400 font-medium block mt-1">Active Real-Time Sessions</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-xs font-bold text-slate-400 block mb-1">Total Platform Properties</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#008374]">{properties.length}</span>
              <span className="text-xs text-slate-400 font-medium block mt-1">Across 5 Indian Metros</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-xs font-bold text-slate-400 block mb-1">Physician Inquiries</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0A2540]">
                {inquiries.length}
              </span>
              <span className="text-xs text-emerald-600 font-semibold block mt-1">Doctor Inquiry Pipeline</span>
            </div>
          </div>
        ) : (
          /* Normal User Executive Suite */
          <div className="space-y-6">
            {/* Executive Doctor Welcome Banner */}
            <div className="bg-gradient-to-r from-[#0A2540] via-[#0D2E4D] to-[#0A2540] rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(#008374_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                    <span>Verified Physician Residency Suite</span>
                    <span className="text-white/40">•</span>
                    <span className="text-slate-300">ID: MP-BLR-4091</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Welcome back,{' '}
                    <span className="text-teal-300 font-serif italic font-normal">
                      {user?.full_name || (user?.email === 'doctor.demo@medproperties.com' ? 'Dr. Rajesh Sharma' : user?.email?.split('@')[0] || 'Doctor')}
                    </span>
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    Senior Consultant • Manipal Hospital HAL Corridor. All physical acoustic audits and 100% DG switch certifications are active for your portfolio.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#008374] hover:bg-[#007063] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Submit Residence</span>
                  </button>
                  <button
                    onClick={openConciergeModal}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-teal-300" />
                    <span>Talk to Concierge</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Elevated 4 Generative UI Metric Telemetry Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Portfolio</span>
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#008374] flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#0A2540]">{userListings.length}</span>
                  <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">Live</span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                  <span>Physical Audit Complete</span>
                </p>
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Doctor Inquiries</span>
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#0A2540]">{inquiries.length}</span>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Pipeline</span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-2 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>Avg Response: &lt; 2 hrs</span>
                </p>
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saved Sanctuaries</span>
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                    <Heart className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#0A2540]">{favorites.length}</span>
                  <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">Shortlist</span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>Ready for private tour</span>
                </p>
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Acoustic & Power Standard</span>
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#008374]">&lt;40 dB</span>
                  <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">Grade A</span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-2 flex items-center gap-1.5">
                  <VolumeX className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>100% DG auto-switch tested</span>
                </p>
              </div>
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
                    <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
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
                                      <span className="text-xs font-bold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-md">
                                        You
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-xs text-slate-400 block truncate">{u.email}</span>
                                </div>
                              </div>
                            </td>

                            {/* Role badge */}
                            <td className="py-4 px-4">
                              {u.role === 'superadmin' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                  <Crown className="w-3.5 h-3.5 text-purple-600" />
                                  Super Admin
                                </span>
                              )}
                              {u.role === 'doctor' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-[#008374] border border-emerald-200">
                                  <UserCheck className="w-3.5 h-3.5" />
                                  Physician / Resident
                                </span>
                              )}
                              {u.role === 'landlord' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                  <ShieldCheck className="w-3.5 h-3.5" />
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
                                <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                  {u.location || 'India'}
                                </span>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-4 px-4">
                              {isOnline ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  Online Now
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                  Offline
                                </span>
                              )}
                            </td>

                            {/* Last Login & Device */}
                            <td className="py-4 px-4">
                              <div className="text-xs">
                                <span className="font-bold text-slate-700 block">
                                  {formatTimeAgo(u.last_login)}
                                </span>
                                <span className="text-slate-400 flex items-center gap-1 mt-0.5 truncate max-w-[160px]">
                                  <Laptop className="w-3.5 h-3.5 shrink-0" />
                                  {u.device || 'Web Session'}
                                </span>
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-6 text-right">
                              {isCurrent ? (
                                <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">
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
                        <span className="absolute top-3 left-3 bg-emerald-500/95 backdrop-blur-md text-white text-xs font-bold px-2.5 py-0.5 rounded-md shadow-xs">
                          ● Active Listing
                        </span>
                        <span className="absolute top-3 right-3 bg-navy-900/80 backdrop-blur-md text-white text-xs font-bold px-2 py-0.5 rounded-md">
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
                          <div className="text-xs font-semibold text-[#008374] bg-emerald-50/70 px-2.5 py-1 rounded-lg">
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
                        <div className="pt-2 border-t border-slate-50 text-xs text-slate-400 flex items-center justify-between">
                          <span className="truncate">Listed By: {property.owner_email || 'Verified Landlord'}</span>
                          <span className="font-bold text-slate-500">{property.city}</span>
                        </div>
                      </div>
                    </div>

                    {/* Admin Actions */}
                    <div className="p-4 pt-0 border-t border-slate-50 flex items-center justify-between gap-2">
                      <button
                        onClick={() => viewPropertyDetail(property)}
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
          <div className="space-y-8">
            {userListings.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left 8 Columns: Residences Cards & Protocol */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                    <div>
                      <h3 className="text-lg font-bold text-[#0A2540] flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-[#008374]" />
                        <span>My Verified Residences ({userListings.length})</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Physical field audits passed with acoustic testing and DG switch telemetry.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#008374] font-bold text-xs border border-teal-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Add Listing</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userListings.map((property) => (
                      <div
                        key={property.id}
                        className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                      >
                        <div>
                          <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                            <img
                              src={property.image_url}
                              alt={property.title}
                              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                            
                            <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                              Audit Approved
                            </span>
                            
                            <span className="absolute top-3 right-3 bg-[#0A2540]/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                              For {property.category}
                            </span>

                            {property.hospital_distance && (
                              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-xl px-2.5 py-1 text-[11px] font-semibold text-[#0A2540] flex items-center justify-between">
                                <span className="flex items-center gap-1 truncate text-[#008374]">
                                  <Clock className="w-3 h-3 text-[#008374] shrink-0" />
                                  <span className="truncate">{property.hospital_distance}</span>
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">Verified</span>
                              </div>
                            )}
                          </div>

                          <div className="p-5 space-y-3">
                            <div className="flex items-baseline justify-between">
                              <span className="text-xl font-extrabold text-[#0A2540] font-serif">
                                ₹{property.price.toLocaleString('en-IN')}&nbsp;{property.period ? `/${property.period}` : ''}
                              </span>
                              <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                                100% DG Backup
                              </span>
                            </div>

                            <div>
                              <h4 className="font-bold text-[#0A2540] text-base leading-snug group-hover:text-[#008374] transition-colors">
                                {property.title}
                              </h4>
                              <p className="text-xs text-slate-500 truncate mt-0.5">{property.address}</p>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
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
                        <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2.5">
                          <button
                            onClick={() => viewPropertyDetail(property)}
                            className="flex-1 py-2.5 bg-slate-50 hover:bg-[#0A2540] hover:text-white text-[#0A2540] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview Residency</span>
                          </button>
                          <button
                            onClick={() => handleDeleteListing(property.id, property.title)}
                            className="p-2.5 border border-slate-200 hover:border-rose-300 text-slate-400 hover:text-rose-600 rounded-xl transition-colors cursor-pointer"
                            title="Delete listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Certified Quality Protocol Seal Banner */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-[#008374] flex items-center justify-center shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#0A2540] uppercase tracking-wider">
                          Certified Physician Tenancy Protocol
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Properties in this dashboard undergo quarterly acoustic decibel checks and generator automatic transfer switch (ATS) verification.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={openConciergeModal}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0A2540] text-xs font-bold transition-colors whitespace-nowrap cursor-pointer shrink-0"
                    >
                      Audit Reports
                    </button>
                  </div>
                </div>

                {/* Right 4 Columns: Physician Relocation & Concierge Console */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Card 1: Dedicated Medical Housing Concierge */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#008374] to-teal-400 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                        PN
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-[#008374] uppercase tracking-wider block">
                          Assigned Concierge
                        </span>
                        <h4 className="font-extrabold text-[#0A2540] text-sm">Priya Nair</h4>
                        <p className="text-[11px] text-slate-500">Lead Medical Relocation Officer</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      Need emergency lease assistance, late-night shift viewing scheduling, or relocation support between hospitals?
                    </p>

                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-between font-semibold text-slate-700">
                        <span>Direct Physician Line</span>
                        <span className="text-[#008374] font-bold">+91 80 4567 8900</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-between font-semibold text-slate-700">
                        <span>Active Search Perimeter</span>
                        <span className="text-slate-800 font-bold">&lt; 15 min corridor</span>
                      </div>
                    </div>

                    <button
                      onClick={openConciergeModal}
                      className="w-full py-3 px-4 rounded-xl bg-[#008374] hover:bg-[#007063] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Request Accompanied Viewing</span>
                    </button>
                  </div>

                  {/* Card 2: 4-Point Hospital Residence Audit Standards */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-[#0A2540] text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-[#008374]" />
                        <span>Audit Standards</span>
                      </h4>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        All Certified
                      </span>
                    </div>

                    <ul className="space-y-2.5 text-xs">
                      <li className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
                        <span className="text-slate-600 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-[#008374]" />
                          <span>100% DG Auto-Switch</span>
                        </span>
                        <span className="font-bold text-emerald-700">&lt; 15 sec</span>
                      </li>
                      <li className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
                        <span className="text-slate-600 flex items-center gap-1.5">
                          <VolumeX className="w-3.5 h-3.5 text-[#008374]" />
                          <span>Acoustic Decibel Floor</span>
                        </span>
                        <span className="font-bold text-emerald-700">&lt; 40 dB</span>
                      </li>
                      <li className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
                        <span className="text-slate-600 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#008374]" />
                          <span>Continuous RO Pressure</span>
                        </span>
                        <span className="font-bold text-emerald-700">Certified</span>
                      </li>
                      <li className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
                        <span className="text-slate-600 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#008374]" />
                          <span>Biometric Security Access</span>
                        </span>
                        <span className="font-bold text-emerald-700">24/7 Gated</span>
                      </li>
                    </ul>
                  </div>

                  {/* Card 3: 8:00 AM Hospital Commute Radar */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
                    <h4 className="font-bold text-[#0A2540] text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#008374]" />
                      <span>8:00 AM Hospital Commute</span>
                    </h4>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="font-semibold text-slate-700">Manipal Hospital HAL</span>
                        <span className="font-bold text-[#008374]">8 min drive</span>
                      </div>
                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="font-semibold text-slate-700">Apollo Jubilee / Bannerghatta</span>
                        <span className="font-bold text-slate-800">14 min drive</span>
                      </div>
                      <div className="flex items-center justify-between py-1.5">
                        <span className="font-semibold text-slate-700">Lilavati / AIIMS Perimeter</span>
                        <span className="font-bold text-slate-800">19 min drive</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200 space-y-4 max-w-xl mx-auto shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-teal-50 text-[#008374] flex items-center justify-center mx-auto">
                  <Building2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0A2540]">You haven't listed any residences yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
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
                    className="w-full sm:w-auto px-5 py-2.5 border border-teal-200 bg-teal-50 text-[#008374] font-bold text-xs rounded-xl hover:bg-teal-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
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
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-[#0A2540] text-sm">
                    Verified Healthcare Professional Inquiries
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tour requests and lease inquiries submitted by doctors and fellows for your properties.
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-teal-50 text-[#008374] rounded-lg border border-teal-100">
                  {inquiries.length} Active {inquiries.length === 1 ? 'Inquiry' : 'Inquiries'}
                </span>
              </div>
              
              {inquiries.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {inquiries.map((inq, idx) => (
                    <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#0A2540] text-sm">{inq.name}</span>
                          <span className="text-xs font-bold bg-emerald-50 text-[#008374] px-2.5 py-0.5 rounded-full border border-emerald-100">
                            {inq.medical_role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">"{inq.message}"</p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                          {inq.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5 text-[#008374]" /> {inq.email}
                            </span>
                          )}
                          {inq.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-[#008374]" /> {inq.phone}
                            </span>
                          )}
                          {inq.tour_date && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-[#008374]" /> {inq.tour_date}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl shrink-0 self-start sm:self-auto border border-emerald-100">
                        Direct Inquiry
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#008374] flex items-center justify-center mx-auto">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-[#0A2540] text-base">No Inquiries Yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    When physicians and hospital residents request accompanied tours or lease terms for your listings, their inquiries will appear here with verified clinical credentials.
                  </p>
                </div>
              )}
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
                    onClick={() => viewPropertyDetail(property)}
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
