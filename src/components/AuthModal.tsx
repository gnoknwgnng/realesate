import React, { useState, useEffect } from 'react';
import { useProperties } from '../context/PropertyContext';
import { getSupabaseClient } from '../lib/supabase';
import { UserProfile } from '../types';
import { X, Lock, Mail, UserCheck, ShieldCheck, AlertCircle, CheckCircle2, Eye, EyeOff, Sparkles, Crown, ShieldAlert } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode,
    setCurrentView,
    showToast,
    setUser,
  } = useProperties();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'doctor' | 'landlord' | 'superadmin'>('doctor');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Reset error when modal opens or mode changes
  useEffect(() => {
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [authMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const client = getSupabaseClient();

    if (client) {
      try {
        if (authMode === 'signup') {
          const { data, error } = await client.auth.signUp({
            email: email.trim(),
            password,
            options: {
              data: {
                role,
                full_name: email.split('@')[0],
              },
            },
          });

          if (error) throw error;

          if (data.session) {
            showToast('Account created and signed in successfully!');
            setCurrentView('dashboard');
            setIsAuthModalOpen(false);
          } else {
            setSuccessMessage('Account created! Please check your email inbox to confirm your registration.');
          }
        } else {
          // Login mode
          const { error } = await client.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

          if (error) {
            // Provide human-friendly error messages
            if (error.message.includes('Invalid login credentials')) {
              throw new Error('Invalid email or password. If you do not have an account yet, please click "Sign Up" above.');
            }
            throw error;
          }

          showToast('Welcome back to MedProperties!');
          setCurrentView('dashboard');
          setIsAuthModalOpen(false);
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'An error occurred during authentication.');
      } finally {
        setLoading(false);
      }
    } else {
      // Local fallback
      setTimeout(() => {
        setLoading(false);
        const assignedRole: 'doctor' | 'landlord' | 'superadmin' =
          email.toLowerCase().includes('superadmin') || role === 'superadmin' ? 'superadmin' : role;
        const profile: UserProfile = {
          id: 'user-' + Math.random().toString(36).substring(2, 9),
          email: email.trim(),
          role: assignedRole,
          full_name: assignedRole === 'superadmin' ? 'Super Admin Console' : email.split('@')[0],
          status: 'online',
          last_login: new Date().toISOString(),
        };
        setUser(profile);
        localStorage.setItem('medproperties_user', JSON.stringify(profile));

        showToast(
          authMode === 'signup'
            ? 'Account created successfully!'
            : assignedRole === 'superadmin'
            ? 'Welcome Super Admin Console!'
            : 'Signed in successfully!'
        );
        setCurrentView('dashboard');
        setIsAuthModalOpen(false);
      }, 400);
    }
  };

  // Quick 1-click demo doctor test account helper
  const handleQuickDemoDoctor = async () => {
    setEmail('doctor.demo@medproperties.com');
    setPassword('DoctorPass123!');
    setErrorMessage(null);
    setLoading(true);

    const client = getSupabaseClient();
    if (client) {
      try {
        const { error: signInErr } = await client.auth.signInWithPassword({
          email: 'doctor.demo@medproperties.com',
          password: 'DoctorPass123!',
        });

        if (signInErr) {
          const { error: signUpErr } = await client.auth.signUp({
            email: 'doctor.demo@medproperties.com',
            password: 'DoctorPass123!',
            options: {
              data: { role: 'doctor', full_name: 'Dr. Rajesh Sharma, MD' },
            },
          });
          if (signUpErr) throw signUpErr;
        }
      } catch (err: any) {
        console.warn('Supabase fallback:', err);
      }
    }

    const docProfile: UserProfile = {
      id: 'user-doc-1',
      email: 'doctor.demo@medproperties.com',
      role: 'doctor',
      full_name: 'Dr. Rajesh Sharma, MD',
      hospital: 'AIIMS New Delhi',
      location: 'New Delhi, DL',
      status: 'online',
      last_login: new Date().toISOString(),
    };
    setUser(docProfile);
    localStorage.setItem('medproperties_user', JSON.stringify(docProfile));
    setLoading(false);
    showToast('Signed in with Demo Doctor account!');
    setCurrentView('dashboard');
    setIsAuthModalOpen(false);
  };

  // Quick 1-click demo Super Admin account helper
  const handleQuickDemoSuperAdmin = async () => {
    setEmail('superadmin@medproperties.com');
    setPassword('AdminPass123!');
    setErrorMessage(null);
    setLoading(true);

    const client = getSupabaseClient();
    if (client) {
      try {
        const { error: signInErr } = await client.auth.signInWithPassword({
          email: 'superadmin@medproperties.com',
          password: 'AdminPass123!',
        });

        if (signInErr) {
          const { error: signUpErr } = await client.auth.signUp({
            email: 'superadmin@medproperties.com',
            password: 'AdminPass123!',
            options: {
              data: { role: 'superadmin', full_name: 'Super Admin Console' },
            },
          });
          if (signUpErr) console.warn('Supabase admin signup fallback:', signUpErr);
        }
      } catch (err: any) {
        console.warn('Supabase superadmin fallback to local:', err);
      }
    }

    const adminProfile: UserProfile = {
      id: 'user-admin-1',
      email: 'superadmin@medproperties.com',
      role: 'superadmin',
      full_name: 'Super Admin Console',
      hospital: 'MedProperties Platform Operations',
      location: 'Central Headquarters, Bengaluru',
      status: 'online',
      last_login: new Date().toISOString(),
    };
    setUser(adminProfile);
    localStorage.setItem('medproperties_user', JSON.stringify(adminProfile));
    setLoading(false);
    showToast('Signed in as Super Admin with full platform access!');
    setCurrentView('dashboard');
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-6 sm:p-8 space-y-6">
        
        {/* Header with Logo and Close button */}
        <div className="flex items-center justify-between">
          <img src="/logo.png" alt="MedProperties" className="h-10 w-auto object-contain" />
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-full border border-slate-200 text-slate-400 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Tabs: Login vs Sign Up */}
        <div className="flex p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              authMode === 'login'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('signup')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              authMode === 'signup'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Title Description */}
        <div>
          <h3 className="text-xl font-extrabold text-[#0A2540]">
            {authMode === 'signup' ? 'Join MedProperties Network' : 'Welcome Back'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {authMode === 'signup'
              ? 'Connect with doctor-friendly homes, physician mortgages, and relocation tours.'
              : 'Sign in to access your saved homes, inquiries, and application history.'}
          </p>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
            <div className="flex-1 leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            <div className="flex-1 leading-relaxed">{successMessage}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Role selector (only in signup mode) */}
          {authMode === 'signup' && (
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-600">I am registering as a:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('doctor')}
                  className={`py-2 px-2 rounded-xl font-bold flex flex-col items-center justify-center gap-1 border transition-all text-xs ${
                    role === 'doctor'
                      ? 'border-[#008374] bg-emerald-50 text-[#008374] shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Physician</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('landlord')}
                  className={`py-2 px-2 rounded-xl font-bold flex flex-col items-center justify-center gap-1 border transition-all text-xs ${
                    role === 'landlord'
                      ? 'border-[#008374] bg-emerald-50 text-[#008374] shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Landlord</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('superadmin')}
                  className={`py-2 px-2 rounded-xl font-bold flex flex-col items-center justify-center gap-1 border transition-all text-xs ${
                    role === 'superadmin'
                      ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Crown className="w-4 h-4 text-purple-600" />
                  <span>Super Admin</span>
                </button>
              </div>
            </div>
          )}

          {/* Email input */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="doctor@hospital.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 rounded-xl font-semibold border border-slate-200 focus:outline-none focus:border-[#008374] text-slate-900"
              />
            </div>
          </div>

          {/* Password input with show/hide toggle */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-bold text-slate-700">Password</label>
              {authMode === 'signup' && (
                <span className="text-xs text-slate-400">Min. 6 characters</span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 rounded-xl font-semibold border border-slate-200 focus:outline-none focus:border-[#008374] text-slate-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#008374] hover:bg-[#007063] text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Please wait...</span>
            ) : authMode === 'signup' ? (
              <span>Create Account</span>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* 1-Click Demo Quick Test Buttons */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickDemoDoctor}
              disabled={loading}
              className="py-2.5 px-3 bg-brand-50 hover:bg-brand-100 text-[#008374] text-xs font-bold rounded-xl border border-brand-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Demo Doctor</span>
            </button>
            <button
              type="button"
              onClick={handleQuickDemoSuperAdmin}
              disabled={loading}
              className="py-2.5 px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl border border-purple-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Crown className="w-3.5 h-3.5 text-purple-600" />
              <span>Super Admin</span>
            </button>
          </div>

          {/* Switch mode link */}
          <div className="text-center text-xs text-slate-500">
            {authMode === 'signup' ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="font-bold text-[#008374] hover:underline"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="font-bold text-[#008374] hover:underline"
                >
                  Create one now
                </button>
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
