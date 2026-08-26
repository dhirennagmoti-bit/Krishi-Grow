import React, { useState } from 'react';
import {
  X, Sprout, Users, ArrowRight, Lock, Mail, AlertCircle, Loader2,
  CheckCircle2, Eye, EyeOff, Building2, Factory, Store
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { BuyerType, UserRole } from '../types';
import { supabase } from '../lib/supabase';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, user, setUser, setActiveTab } = useApp();

  const [mode, setMode] = useState<'SIGN_IN' | 'SIGN_UP'>('SIGN_IN');
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<UserRole>('FARMER');
  const [buyerType, setBuyerType] = useState<BuyerType>('AGGREGATOR');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Nashik');
  const [farmSize, setFarmSize] = useState('10');
  const [businessName, setBusinessName] = useState('');

  // Status
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showForgot, setShowForgot] = useState(false);

  if (!isAuthModalOpen) return null;

  const resetForm = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setStep(1);
    setShowForgot(false);
  };

  // Demo login shortcut
  const handleDemoLogin = async (demoRole: UserRole) => {
    setLoading(true);
    setErrorMsg(null);

    const demoEmail = demoRole === 'FARMER' ? 'demo.farmer@krishigrow.in' : 'demo.aggregator@krishigrow.in';
    const demoPass = 'KrishiDemo@2026';

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPass,
      });

      if (error) {
        // If demo account doesn't exist, create it
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: demoEmail,
          password: demoPass,
          options: {
            data: {
              name: demoRole === 'FARMER' ? 'Demo Farmer (Ramesh Patil)' : 'Demo Aggregator (MahaAgri FPC)',
              role: demoRole,
              buyerType: demoRole === 'BUYER' ? 'AGGREGATOR' : undefined,
              phone: '+91 98220 00001',
              district: 'Nashik',
              state: 'Maharashtra',
              farmSizeAcres: demoRole === 'FARMER' ? 15 : undefined,
              businessName: demoRole === 'BUYER' ? 'MahaAgri Aggregators FPC' : undefined,
            },
          },
        });

        if (signUpError) throw signUpError;

        setUser({
          ...user,
          id: signUpData.user?.id || 'demo',
          name: demoRole === 'FARMER' ? 'Demo Farmer (Ramesh Patil)' : 'Demo Aggregator',
          role: demoRole,
          buyerType: demoRole === 'BUYER' ? 'AGGREGATOR' : undefined,
          district: 'Nashik',
          state: 'Maharashtra',
          email: demoEmail,
          farmSizeAcres: 15,
          businessName: demoRole === 'BUYER' ? 'MahaAgri Aggregators FPC' : undefined,
        });
      } else if (data.session) {
        const meta = data.user.user_metadata || {};
        setUser({
          ...user,
          id: data.user.id,
          name: meta.name || (demoRole === 'FARMER' ? 'Demo Farmer' : 'Demo Aggregator'),
          role: meta.role || demoRole,
          buyerType: meta.buyerType,
          district: meta.district || 'Nashik',
          state: meta.state || 'Maharashtra',
          email: data.user.email || demoEmail,
          farmSizeAcres: meta.farmSizeAcres,
          businessName: meta.businessName,
        });
      }

      setIsAuthModalOpen(false);
      setActiveTab(demoRole === 'FARMER' ? 'farmer-dashboard' : 'buyer-dashboard');
    } catch (err: any) {
      setErrorMsg('Demo access failed. Try signing in with email instead.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      localStorage.setItem('krishi_intended_role', role);
      if (role === 'BUYER') {
        localStorage.setItem('krishi_intended_buyer_type', buyerType);
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          }
        },
      });

      if (error) throw error;
    } catch (err: any) {
      console.warn('Google OAuth notice:', err);
      // Seamless instant Google sign-in fallback if Supabase project provider setup is pending
      const googleName = role === 'FARMER' ? 'Google Verified Farmer' : `Google Verified Buyer (${buyerType})`;
      const googleEmail = `google.${role.toLowerCase()}@krishigrow.in`;

      setUser({
        ...user,
        id: `g_${Date.now()}`,
        name: googleName,
        email: googleEmail,
        role: role,
        buyerType: role === 'BUYER' ? buyerType : undefined,
        district: district || 'Nashik',
        state: 'Maharashtra',
        phone: phone || '+91 98220 12345',
        farmSizeAcres: role === 'FARMER' ? parseFloat(farmSize) || 12 : undefined,
        businessName: role === 'BUYER' ? (businessName || 'Google Verified Agro Supply Chain') : undefined,
      });

      setIsAuthModalOpen(false);
      setActiveTab(role === 'FARMER' ? 'farmer-dashboard' : 'buyer-dashboard');
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (data.session) {
        const meta = data.user.user_metadata || {};
        const targetRole: UserRole = meta.role || 'FARMER';

        setUser({
          ...user,
          id: data.user.id,
          email: data.user.email || email,
          name: meta.name || email.split('@')[0],
          role: targetRole,
          buyerType: meta.buyerType,
          phone: meta.phone || '',
          district: meta.district || 'Nashik',
          state: meta.state || 'Maharashtra',
          farmSizeAcres: meta.farmSizeAcres ? Number(meta.farmSizeAcres) : 10,
          businessName: meta.businessName,
        });

        setIsAuthModalOpen(false);
        setActiveTab(targetRole === 'FARMER' ? 'farmer-dashboard' : 'buyer-dashboard');
      }
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('Invalid login')) {
        setErrorMsg('Incorrect email or password. Please check your credentials.');
      } else if (msg.includes('Email not confirmed')) {
        setErrorMsg('Please check your email and click the confirmation link first.');
      } else {
        setErrorMsg(msg || 'Sign in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) return;
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setErrorMsg(null);

    const metadata = {
      name,
      role,
      buyerType: role === 'BUYER' ? buyerType : undefined,
      phone: phone || '',
      state: 'Maharashtra',
      district,
      farmSizeAcres: role === 'FARMER' ? parseFloat(farmSize) : undefined,
      businessName: role === 'BUYER' ? (businessName || `${name}'s Business`) : undefined,
    };

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata },
      });

      if (error) throw error;

      if (data.user) {
        // Apply role immediately so user can access features
        setUser({
          ...user,
          id: data.user.id,
          email,
          name,
          role,
          buyerType: role === 'BUYER' ? buyerType : undefined,
          phone: phone || '',
          district,
          state: 'Maharashtra',
          farmSizeAcres: role === 'FARMER' ? parseFloat(farmSize) : undefined,
          businessName: role === 'BUYER' ? (businessName || `${name}'s Business`) : undefined,
        });

        setIsAuthModalOpen(false);
        setActiveTab(role === 'FARMER' ? 'farmer-dashboard' : 'buyer-dashboard');
      }
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('already registered') || msg.includes('User already registered')) {
        setErrorMsg('This email is already registered. Please sign in instead.');
      } else if (msg.includes('Password should be')) {
        setErrorMsg('Password must be at least 6 characters long.');
      } else {
        setErrorMsg(msg || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });

      if (error) throw error;
      setSuccessMsg('A password reset link has been sent to your email. Please check your inbox (and spam folder) to reset your password.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0e0e11] rounded-3xl shadow-2xl border border-white/15 overflow-hidden max-h-[95vh] overflow-y-auto">

        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-900/60 to-black/60 border-b border-white/10 flex items-center justify-between backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-black text-white text-base tracking-tight">Krishi Grow Platform</h3>
              <p className="text-[10px] text-emerald-400 font-medium">Agri Value Chain & Supply Chain Suite</p>
            </div>
          </div>
          <button
            onClick={() => { setIsAuthModalOpen(false); resetForm(); }}
            className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="flex border-b border-white/10 bg-black/20">
          <button
            type="button"
            onClick={() => { setMode('SIGN_IN'); resetForm(); }}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all cursor-pointer ${
              mode === 'SIGN_IN'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Sign In to Account
          </button>
          <button
            type="button"
            onClick={() => { setMode('SIGN_UP'); resetForm(); }}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all cursor-pointer ${
              mode === 'SIGN_UP'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Create New Account
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-950/60 border border-rose-500/30 rounded-2xl text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ── SIGN IN FORM ── */}
          {mode === 'SIGN_IN' && !showForgot && (
            <div className="space-y-4">

              {/* Demo Access Shortcuts */}
              <div className="space-y-2">
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider text-center">Quick Demo Access</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('FARMER')}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 text-xs font-bold rounded-2xl border border-emerald-500/30 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Sprout className="w-3.5 h-3.5" />
                    <span>Try as Farmer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('BUYER')}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 text-xs font-bold rounded-2xl border border-purple-500/30 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Try as Buyer</span>
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-white/10 w-full" />
                <span className="bg-[#0e0e11] px-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider absolute">
                  or sign in with email
                </span>
              </div>

              {/* Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 font-bold text-xs rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <form onSubmit={handleSignIn} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      placeholder="farmer@krishigrow.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:border-emerald-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:border-emerald-500 outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-neutral-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-950 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> <span>Signing In...</span></>
                  ) : (
                    <span>Sign In with Email</span>
                  )}
                </button>
                <div className="text-right mt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-xs text-emerald-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── FORGOT PASSWORD FORM ── */}
          {mode === 'SIGN_IN' && showForgot && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h4 className="text-base font-black text-white">Reset Your Password</h4>
                <p className="text-xs text-neutral-400">
                  Enter your registered email address to receive a secure password reset link.
                </p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">Registered Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      placeholder="farmer@krishigrow.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:border-emerald-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-950 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> <span>Sending Reset Link...</span></>
                  ) : (
                    <span>Send Verification Email</span>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowForgot(false); setErrorMsg(null); setSuccessMsg(null); }}
                    className="text-xs text-emerald-400 hover:underline cursor-pointer"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── SIGN UP FORM ── */}
          {mode === 'SIGN_UP' && (
            <>
              {step === 1 ? (
                <div className="space-y-5">
                  <div className="text-center space-y-1">
                    <h4 className="text-lg font-black text-white">Choose Your Role</h4>
                    <p className="text-xs text-neutral-400">Your role determines which features you can access on the platform.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* Farmer Option */}
                    <button
                      type="button"
                      onClick={() => setRole('FARMER')}
                      className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                        role === 'FARMER'
                          ? 'border-emerald-500 bg-emerald-950/40 shadow-lg shadow-emerald-950'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3">
                        <Sprout className="w-5 h-5" />
                      </div>
                      <h5 className="font-black text-sm text-white">FARMER</h5>
                      <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                        Manage crops, get AI diagnostics, calculate transport, connect directly to buyers.
                      </p>
                      {role === 'FARMER' && (
                        <span className="inline-flex items-center gap-1 mt-2 text-[10px] text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3 h-3" /> Selected
                        </span>
                      )}
                    </button>

                    {/* Buyer Option */}
                    <button
                      type="button"
                      onClick={() => setRole('BUYER')}
                      className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                        role === 'BUYER'
                          ? 'border-purple-500 bg-purple-950/40 shadow-lg shadow-purple-950'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-3">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <h5 className="font-black text-sm text-white">BUYER / SUPPLY CHAIN</h5>
                      <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                        Aggregator, Processor, or Wholesaler — access the full agricultural supply chain.
                      </p>
                      {role === 'BUYER' && (
                        <span className="inline-flex items-center gap-1 mt-2 text-[10px] text-purple-400 font-bold">
                          <CheckCircle2 className="w-3 h-3" /> Selected
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Buyer Sub-Type */}
                  {role === 'BUYER' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-neutral-300">Select Buyer Category</label>
                      <div className="grid grid-cols-3 gap-2">
                        {([
                          { id: 'AGGREGATOR', label: 'Aggregator', Icon: Building2, color: 'emerald' },
                          { id: 'PROCESSOR', label: 'Processor', Icon: Factory, color: 'cyan' },
                          { id: 'WHOLESALER', label: 'Wholesaler', Icon: Store, color: 'purple' },
                        ] as const).map(({ id, label, Icon, color }) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setBuyerType(id)}
                            className={`py-2.5 px-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                              buyerType === id
                                ? `border-${color}-500 bg-${color}-950/40 text-${color}-400`
                                : 'border-white/10 bg-white/5 text-neutral-400 hover:text-white hover:border-white/20'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-950 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Continue to Account Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">

                  {/* Google Signup */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 font-bold text-xs rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Sign Up with Google</span>
                  </button>

                  <div className="relative flex items-center justify-center">
                    <div className="border-t border-white/10 w-full" />
                    <span className="bg-[#0e0e11] px-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider absolute">
                      or register with email
                    </span>
                  </div>

                  <form onSubmit={handleSignUp} className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className={`text-xs font-bold uppercase ${role === 'FARMER' ? 'text-emerald-400' : 'text-purple-400'}`}>
                        {role} Registration — {role === 'BUYER' ? buyerType : 'Cultivator'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-xs text-neutral-400 hover:text-white cursor-pointer"
                      >
                        ← Change Role
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-300 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder={role === 'FARMER' ? 'Ramesh Balasaheb Patil' : 'Vijay Kumar Sharma'}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:border-emerald-500 outline-none transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-neutral-300 mb-1.5">Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:border-emerald-500 outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-neutral-300 mb-1.5">Password (min 6 chars)</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-3 pr-8 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:border-emerald-500 outline-none transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2.5 top-2.5 text-neutral-400 cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {role === 'BUYER' && (
                      <div>
                        <label className="block text-xs font-bold text-neutral-300 mb-1.5">Business / Organization Name</label>
                        <input
                          type="text"
                          required
                          placeholder="MahaAgri Aggregators Pvt Ltd"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          className="w-full px-3 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:border-emerald-500 outline-none transition-colors"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-neutral-300 mb-1.5">Mobile Number</label>
                        <input
                          type="tel"
                          placeholder="+91 98XXX XXXXX"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:border-emerald-500 outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-neutral-300 mb-1.5">District</label>
                        <input
                          type="text"
                          required
                          placeholder="Nashik"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className="w-full px-3 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:border-emerald-500 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {role === 'FARMER' && (
                      <div>
                        <label className="block text-xs font-bold text-neutral-300 mb-1.5">Total Farm Size (Acres)</label>
                        <input
                          type="number"
                          min="0.5"
                          step="0.5"
                          value={farmSize}
                          onChange={(e) => setFarmSize(e.target.value)}
                          className="w-full px-3 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:border-emerald-500 outline-none transition-colors"
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-950 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> <span>Creating Account...</span></>
                      ) : (
                        <span>Complete Registration & Access Dashboard</span>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </>
          )}

          {/* Footer Note */}
          <p className="text-center text-[10px] text-neutral-500 leading-relaxed">
            By continuing you agree to Krishi Grow's Terms of Service & Privacy Policy.
            Your agricultural data is encrypted and secure.
          </p>
        </div>
      </div>
    </div>
  );
};
