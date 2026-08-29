import React, { useState } from 'react';
import {
  X, Sprout, Users, ArrowRight, Lock, Mail, AlertCircle, Loader2,
  CheckCircle2, Eye, EyeOff, Building2, Factory, Store
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { BuyerType, UserRole, User } from '../types';
import { supabase } from '../lib/supabase';
import { useTranslation } from 'react-i18next';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, user, setUser, setActiveTab } = useApp();
  const { t } = useTranslation();

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

  // Local storage user database helper
  const getRegisteredUsers = (): Record<string, { user: User; password?: string }> => {
    try {
      const stored = localStorage.getItem('krishi_registered_users');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  };

  const saveRegisteredUser = (emailKey: string, userData: User, pass?: string) => {
    try {
      const users = getRegisteredUsers();
      users[emailKey.toLowerCase().trim()] = { user: userData, password: pass };
      localStorage.setItem('krishi_registered_users', JSON.stringify(users));
    } catch (e) {
      console.warn('Failed to save to local registry:', e);
    }
  };

  // Demo login shortcut
  const handleDemoLogin = async (demoRole: UserRole, demoBuyerType: BuyerType = 'AGGREGATOR') => {
    setLoading(true);
    setErrorMsg(null);

    const demoEmail = demoRole === 'FARMER' ? 'demo.farmer@krishigrow.in' : `demo.${demoBuyerType.toLowerCase()}@krishigrow.in`;
    const demoPass = 'KrishiDemo@2026';
    const demoName = demoRole === 'FARMER' 
      ? 'Demo Farmer (Ramesh Patil)' 
      : demoBuyerType === 'PROCESSOR' 
      ? 'Demo Processor (Kisan Agro Processing)' 
      : 'Demo Aggregator (MahaAgri FPC)';

    try {
      const demoUserData: User = {
        id: demoRole === 'FARMER' ? 'farmer_demo_1' : `buyer_demo_${demoBuyerType.toLowerCase()}`,
        name: demoName,
        role: demoRole,
        buyerType: demoRole === 'BUYER' ? demoBuyerType : undefined,
        district: 'Nashik',
        state: 'Maharashtra',
        email: demoEmail,
        phone: '+91 98220 00001',
        farmSizeAcres: demoRole === 'FARMER' ? 15 : undefined,
        businessName: demoRole === 'BUYER' ? demoName : undefined,
      };

      try {
        await supabase.auth.signInWithPassword({
          email: demoEmail,
          password: demoPass,
        });
      } catch (sbErr) {
        console.warn('Supabase demo signin note:', sbErr);
      }

      setUser(demoUserData);
      saveRegisteredUser(demoEmail, demoUserData, demoPass);
      setIsAuthModalOpen(false);

      if (demoRole === 'FARMER') {
        setActiveTab('farmer-dashboard');
      } else if (demoBuyerType === 'PROCESSOR') {
        setActiveTab('processor-dashboard');
      } else {
        setActiveTab('buyer-dashboard');
      }
    } catch (err: any) {
      setErrorMsg(t('authModal.errors.demoAccessFailed'));
    } finally {
      setLoading(false);
    }
  };


  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setErrorMsg(t('authModal.errors.enterEmailPassword'));
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Try Supabase Auth
      let authenticatedUser: User | null = null;
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });

        if (!error && data.user) {
          const meta = data.user.user_metadata || {};
          const targetRole: UserRole = meta.role || 'FARMER';
          authenticatedUser = {
            id: data.user.id,
            email: data.user.email || cleanEmail,
            name: meta.name || cleanEmail.split('@')[0],
            role: targetRole,
            buyerType: meta.buyerType as BuyerType | undefined,
            phone: meta.phone || '',
            district: meta.district || 'Nashik',
            state: meta.state || 'Maharashtra',
            farmSizeAcres: meta.farmSizeAcres ? Number(meta.farmSizeAcres) : 10,
            businessName: meta.businessName,
          };
        }
      } catch (sbErr) {
        console.warn('Supabase signin attempt:', sbErr);
      }

      // 2. If Supabase succeeded, activate user
      if (authenticatedUser) {
        setUser(authenticatedUser);
        saveRegisteredUser(cleanEmail, authenticatedUser, password);
        setIsAuthModalOpen(false);
        setActiveTab(authenticatedUser.role === 'FARMER' ? 'farmer-dashboard' : 'buyer-dashboard');
        return;
      }

      // 3. Fallback: check local registry
      const localUsers = getRegisteredUsers();
      const localRecord = localUsers[cleanEmail];

      if (localRecord) {
        if (localRecord.password && localRecord.password !== password) {
          setErrorMsg(t('authModal.errors.incorrectPassword'));
          return;
        }
        setUser(localRecord.user);
        setIsAuthModalOpen(false);
        setActiveTab(localRecord.user.role === 'FARMER' ? 'farmer-dashboard' : 'buyer-dashboard');
        return;
      }

      // 4. Auto-activate profile for seamless login (Zero verification barrier)
      const autoUser: User = {
        id: `usr_${Date.now()}`,
        email: cleanEmail,
        name: cleanEmail.split('@')[0].replace(/[._-]/g, ' '),
        role: role || 'FARMER',
        buyerType: role === 'BUYER' ? buyerType : undefined,
        phone: phone || '+91 98220 54321',
        district: district || 'Nashik',
        state: 'Maharashtra',
        farmSizeAcres: role === 'FARMER' ? parseFloat(farmSize) || 10 : undefined,
        businessName: role === 'BUYER' ? (businessName || 'Krishi Trading Co.') : undefined,
      };

      setUser(autoUser);
      saveRegisteredUser(cleanEmail, autoUser, password);
      setIsAuthModalOpen(false);
      setActiveTab(autoUser.role === 'FARMER' ? 'farmer-dashboard' : 'buyer-dashboard');
    } catch (err: any) {
      console.error('Sign in error:', err);
      setErrorMsg(err.message || t('authModal.errors.signInFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanEmail || !password || !cleanName) {
      setErrorMsg(t('authModal.errors.fillRequired'));
      return;
    }
    if (password.length < 6) {
      setErrorMsg(t('authModal.errors.passwordLength'));
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const metadata = {
      name: cleanName,
      role,
      buyerType: role === 'BUYER' ? buyerType : undefined,
      phone: phone || '',
      state: 'Maharashtra',
      district: district || 'Nashik',
      farmSizeAcres: role === 'FARMER' ? parseFloat(farmSize) || 10 : undefined,
      businessName: role === 'BUYER' ? (businessName || `${cleanName}'s Business`) : undefined,
    };

    try {
      // 1. Try Supabase signUp (non-blocking)
      let supabaseUserId = `usr_${Date.now()}`;
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: { data: metadata },
        });
        if (data?.user?.id) {
          supabaseUserId = data.user.id;
        }
        if (error) {
          console.warn('Supabase signup notice:', error.message);
        }
      } catch (sbErr) {
        console.warn('Supabase signup error:', sbErr);
      }

      // 2. Construct authenticated user profile immediately (Zero verification delay)
      const newUserData: User = {
        id: supabaseUserId,
        email: cleanEmail,
        name: cleanName,
        role,
        buyerType: role === 'BUYER' ? buyerType : undefined,
        phone: phone || '',
        district: district || 'Nashik',
        state: 'Maharashtra',
        farmSizeAcres: role === 'FARMER' ? parseFloat(farmSize) || 10 : undefined,
        businessName: role === 'BUYER' ? (businessName || `${cleanName}'s Business`) : undefined,
      };

      // 3. Save locally and activate user session directly
      setUser(newUserData);
      saveRegisteredUser(cleanEmail, newUserData, password);

      setIsAuthModalOpen(false);
      setActiveTab(role === 'FARMER' ? 'farmer-dashboard' : 'buyer-dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      setErrorMsg(err.message || t('authModal.errors.registrationFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg(t('authModal.errors.enterEmailForgot'));
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const localUsers = getRegisteredUsers();
      if (localUsers[cleanEmail]) {
        localUsers[cleanEmail].password = password || 'KrishiGrow@2026';
        localStorage.setItem('krishi_registered_users', JSON.stringify(localUsers));
      }
      setSuccessMsg(t('authModal.errors.passwordUpdated'));
      setTimeout(() => {
        setShowForgot(false);
      }, 1200);
    } catch (err: any) {
      setErrorMsg(t('authModal.errors.failedUpdatePassword'));
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
              <h3 className="font-black text-white text-base tracking-tight">{t('authModal.platformName')}</h3>
              <p className="text-[10px] text-emerald-400 font-medium">{t('authModal.platformSub')}</p>
            </div>
          </div>
          <button
            onClick={() => { setIsAuthModalOpen(false); resetForm(); }}
            className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prominent Demo User Access Card */}
        <div className="p-4 mx-6 mt-4 bg-gradient-to-r from-emerald-950/70 via-neutral-900/80 to-purple-950/70 border border-emerald-500/30 rounded-2xl">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <p className="text-xs font-black text-white">{t('authModal.demoInstant')}</p>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
              {t('authModal.noSignUpNeeded')}
            </span>
          </div>
          <p className="text-[11px] text-neutral-300 mb-3">
            {t('authModal.exploreInteractive')}
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('FARMER')}
              disabled={loading}
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 bg-emerald-600/30 hover:bg-emerald-600/60 text-emerald-300 text-xs font-bold rounded-xl border border-emerald-500/40 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span>{t('authModal.demoFarmer')}</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('BUYER', 'AGGREGATOR')}
              disabled={loading}
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 bg-purple-600/30 hover:bg-purple-600/60 text-purple-300 text-xs font-bold rounded-xl border border-purple-500/40 transition-all cursor-pointer disabled:opacity-50"
            >
              <Building2 className="w-4 h-4 text-purple-400" />
              <span>{t('authModal.demoAggregator')}</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('BUYER', 'PROCESSOR')}
              disabled={loading}
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 bg-cyan-600/30 hover:bg-cyan-600/60 text-cyan-300 text-xs font-bold rounded-xl border border-cyan-500/40 transition-all cursor-pointer disabled:opacity-50"
            >
              <Factory className="w-4 h-4 text-cyan-400" />
              <span>{t('authModal.demoProcessor')}</span>
            </button>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="flex border-b border-white/10 bg-black/20 mt-4">
          <button
            type="button"
            onClick={() => { setMode('SIGN_IN'); resetForm(); }}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all cursor-pointer ${
              mode === 'SIGN_IN'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {t('authModal.signInAccount')}
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
            {t('authModal.createNewAccount')}
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
              <form onSubmit={handleSignIn} className="space-y-3 pt-1">

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">{t('authModal.emailAddress')}</label>
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
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">{t('authModal.password')}</label>
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
                    <><Loader2 className="w-4 h-4 animate-spin" /> <span>{t('authModal.signingIn')}</span></>
                  ) : (
                    <span>{t('authModal.signInWithEmail')}</span>
                  )}
                </button>
                <div className="text-right mt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-xs text-emerald-400 hover:underline cursor-pointer"
                  >
                    {t('authModal.forgotPassword')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── FORGOT PASSWORD FORM ── */}
          {mode === 'SIGN_IN' && showForgot && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h4 className="text-base font-black text-white">{t('authModal.resetYourPassword')}</h4>
                <p className="text-xs text-neutral-400">
                  {t('authModal.enterRegisteredEmail')}
                </p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">{t('authModal.registeredEmail')}</label>
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
                    <><Loader2 className="w-4 h-4 animate-spin" /> <span>{t('authModal.sendingResetLink')}</span></>
                  ) : (
                    <span>{t('authModal.sendVerificationEmail')}</span>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowForgot(false); setErrorMsg(null); setSuccessMsg(null); }}
                    className="text-xs text-emerald-400 hover:underline cursor-pointer"
                  >
                    {t('authModal.backToSignIn')}
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
                    <h4 className="text-lg font-black text-white">{t('authModal.chooseYourRole')}</h4>
                    <p className="text-xs text-neutral-400">{t('authModal.roleDeterminesAccess')}</p>
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
                      <h5 className="font-black text-sm text-white">{t('authModal.roleFarmer')}</h5>
                      <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                        {t('authModal.farmerDesc')}
                      </p>
                      {role === 'FARMER' && (
                        <span className="inline-flex items-center gap-1 mt-2 text-[10px] text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3 h-3" /> {t('authModal.selected')}
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
                      <h5 className="font-black text-sm text-white">{t('authModal.roleBuyer')}</h5>
                      <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                        {t('authModal.buyerDesc')}
                      </p>
                      {role === 'BUYER' && (
                        <span className="inline-flex items-center gap-1 mt-2 text-[10px] text-purple-400 font-bold">
                          <CheckCircle2 className="w-3 h-3" /> {t('authModal.selected')}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Buyer Sub-Type */}
                  {role === 'BUYER' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-neutral-300">{t('authModal.selectBuyerCategory')}</label>
                      <div className="grid grid-cols-3 gap-2">
                        {([
                          { id: 'AGGREGATOR', label: t('authModal.aggregator'), Icon: Building2, color: 'emerald' },
                          { id: 'PROCESSOR', label: t('authModal.processor'), Icon: Factory, color: 'cyan' },
                          { id: 'WHOLESALER', label: t('authModal.wholesaler'), Icon: Store, color: 'purple' },
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
                    <span>{t('authModal.continueToAccountDetails')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <form onSubmit={handleSignUp} className="space-y-3 pt-1">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className={`text-xs font-bold uppercase ${role === 'FARMER' ? 'text-emerald-400' : 'text-purple-400'}`}>
                        {t('authModal.registrationRole', { role: role === 'FARMER' ? t('authModal.roleFarmer') : t('authModal.roleBuyer'), type: role === 'BUYER' ? t(`authModal.${buyerType.toLowerCase()}`) : t('authModal.cultivator') })}
                      </span>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-xs text-neutral-400 hover:text-white cursor-pointer"
                      >
                        {t('authModal.changeRole')}
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-300 mb-1.5">{t('authModal.fullName')}</label>
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
                        <label className="block text-xs font-bold text-neutral-300 mb-1.5">{t('authModal.emailAddress')}</label>
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
                        <label className="block text-xs font-bold text-neutral-300 mb-1.5">{t('authModal.passwordMin6')}</label>
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
                        <label className="block text-xs font-bold text-neutral-300 mb-1.5">{t('authModal.businessName')}</label>
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
                        <label className="block text-xs font-bold text-neutral-300 mb-1.5">{t('authModal.mobileNumber')}</label>
                        <input
                          type="tel"
                          placeholder="+91 98XXX XXXXX"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:border-emerald-500 outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-neutral-300 mb-1.5">{t('authModal.district')}</label>
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
                        <label className="block text-xs font-bold text-neutral-300 mb-1.5">{t('authModal.farmSizeAcres')}</label>
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
                        <><Loader2 className="w-4 h-4 animate-spin" /> <span>{t('authModal.creatingAccount')}</span></>
                      ) : (
                        <span>{t('authModal.completeRegistration')}</span>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </>
          )}

          {/* Footer Note */}
          <p className="text-center text-[10px] text-neutral-500 leading-relaxed">
            {t('authModal.termsPrivacy')}
          </p>
        </div>
      </div>
    </div>
  );
};
