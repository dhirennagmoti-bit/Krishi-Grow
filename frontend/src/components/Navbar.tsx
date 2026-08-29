import React, { useState, useEffect } from 'react';
import {
  Sprout, Bell, Globe, Bot, ScanLine, Menu, X, ArrowRight, LogOut, User as UserIcon,
  LogIn, UserPlus, Building2, Factory, Store, ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export const Navbar: React.FC = () => {
  const {
    user, isAuthenticated, logout, requireAuth, loginAsDemo, notifications, markNotificationsRead,
    language, setLanguage, setIsAuthModalOpen,
    activeTab, setActiveTab, switchBuyerType
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDemoMenuOpen, setIsDemoMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const { t, i18n } = useTranslation();

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsLangOpen(false);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsNotifOpen(false);
      setIsUserMenuOpen(false);
      setIsDemoMenuOpen(false);
      setIsLangOpen(false);
    };
    if (isNotifOpen || isUserMenuOpen || isDemoMenuOpen || isLangOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isNotifOpen, isUserMenuOpen, isDemoMenuOpen, isLangOpen]);

  // Farmer Navigation Items
  const farmerNavItems = [
    { id: 'landing', label: t('nav.home'), onClick: () => setActiveTab('landing') },
    { id: 'farmer-dashboard', label: t('nav.dashboard'), onClick: () => requireAuth(() => setActiveTab('farmer-dashboard')) },
    { id: 'add-crop', label: t('nav.addCrop'), onClick: () => requireAuth(() => setActiveTab('add-crop')) },
    { id: 'losses-prevention', label: t('nav.krishiRakshak'), onClick: () => setActiveTab('losses-prevention') },
    { id: 'solutions', label: t('nav.solutions'), onClick: () => setActiveTab('solutions') },
    { id: 'market-prices', label: t('nav.mandiPrices'), onClick: () => setActiveTab('market-prices') },
    { id: 'schemes', label: t('nav.govtSchemes'), onClick: () => setActiveTab('schemes') },
    { id: 'weather', label: t('nav.weather'), onClick: () => setActiveTab('weather') },
  ];

  // Buyer Supply Chain Navigation Items
  const buyerNavItems = [
    { id: 'buyer-dashboard', label: t('nav.aggregatorHub'), onClick: () => { switchBuyerType('AGGREGATOR'); setActiveTab('buyer-dashboard'); } },
    { id: 'processor-dashboard', label: t('nav.processorPlant'), onClick: () => { switchBuyerType('PROCESSOR'); setActiveTab('processor-dashboard'); } },
    { id: 'wholesaler-dashboard', label: t('nav.wholesalerTerminal'), onClick: () => { switchBuyerType('WHOLESALER'); setActiveTab('wholesaler-dashboard'); } },
    { id: 'find-farmers', label: t('nav.findFarmers'), onClick: () => setActiveTab('find-farmers') },
    { id: 'market-prices', label: t('nav.mandiPrices'), onClick: () => setActiveTab('market-prices') },
  ];

  const currentNavItems = user.role === 'FARMER' ? farmerNavItems : buyerNavItems;

  return (
    <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-2xl border-b border-white/10 shadow-md">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

        {/* Brand Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab(user.role === 'FARMER' ? 'landing' : 'buyer-dashboard')}
            className="flex items-center gap-2.5 group focus:outline-none pr-2 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md group-hover:bg-emerald-500 transition-colors">
              <Sprout className="w-6 h-6" />
            </div>
            <span className="font-black text-lg md:text-xl text-white tracking-tight leading-none">
              {t('nav.brand')}
            </span>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav
          className="hidden lg:flex items-center p-1 bg-black/40 backdrop-blur-xl rounded-full border border-white/15 shadow-inner relative"
          onMouseLeave={() => setHoveredId(null)}
        >
          {currentNavItems.map(item => {
            const isHovered = hoveredId === item.id;
            const isActive = activeTab === item.id;
            const showHighlight = hoveredId ? isHovered : isActive;

            return (
              <button
                key={item.id}
                onClick={item.onClick}
                onMouseEnter={() => setHoveredId(item.id)}
                className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-colors z-10 cursor-pointer ${
                  showHighlight
                    ? 'text-black font-bold'
                    : 'text-neutral-300 font-semibold hover:text-white'
                }`}
              >
                {showHighlight && (
                  <motion.div
                    layoutId="nav-pill-highlight"
                    className="absolute inset-0 bg-white rounded-full shadow-md"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    style={{ zIndex: -1 }}
                  />
                )}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2 md:gap-3">

          {/* Language Switcher */}
          <div className="relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => {
                setIsLangOpen(!isLangOpen);
                setIsNotifOpen(false);
                setIsUserMenuOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-neutral-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer text-xs font-bold"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline uppercase">
                {i18n.language === 'hi' ? 'हिन्दी' : i18n.language === 'mr' ? 'मराठी' : 'EN'}
              </span>
              <ChevronDown className="w-3 h-3" />
            </button>
            
            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 mt-2 w-32 bg-[#121214] backdrop-blur-2xl rounded-xl shadow-md border border-white/15 p-2 z-50"
                >
                  <button
                    onClick={() => changeLanguage('en')}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-neutral-300 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer"
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLanguage('hi')}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-neutral-300 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer"
                  >
                    हिन्दी
                  </button>
                  <button
                    onClick={() => changeLanguage('mr')}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-neutral-300 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer"
                  >
                    मराठी
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Role badge (read-only — no toggle) */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full border ${
              user.role === 'BUYER'
                ? 'bg-blue-600/20 text-blue-300 border-blue-500/30'
                : 'bg-emerald-600/20 text-emerald-300 border-emerald-500/30'
            }`}
          >
            <span className="uppercase text-xs tracking-wider font-black">{user.role}</span>
            {isAuthenticated && (
              <span className="text-xs text-neutral-300 font-normal">•  {user.name.split(' ')[0]}</span>
            )}
          </div>



          {/* Notifications */}
          <div className="relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                setIsUserMenuOpen(false);
                markNotificationsRead();
              }}
              className="relative p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {isNotifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 mt-2 w-80 bg-[#121214] backdrop-blur-2xl rounded-xl shadow-md border border-white/15 p-4 z-50"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="font-bold text-sm text-white">{t('nav.notifications')}</span>
                    <span className="text-xs text-neutral-400 font-mono">{notifications.length} {t('nav.total')}</span>
                  </div>
                  <div className="space-y-3 mt-3 max-h-64 overflow-y-auto pr-1">
                    {notifications.map(n => (
                      <div key={n.id} className="text-xs p-2.5 rounded-xl bg-white/5 border border-white/10">
                        <div className="font-bold text-white flex items-center justify-between">
                          <span>{n.title}</span>
                          <span className="text-xs text-neutral-400">{n.timestamp}</span>
                        </div>
                        <p className="text-neutral-300 mt-1 leading-snug">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Account / Auth */}
          {isAuthenticated ? (
            <div className="relative" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => { setIsUserMenuOpen(!isUserMenuOpen); setIsNotifOpen(false); }}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/15 text-white text-xs font-semibold rounded-xl hover:bg-white/20 transition-all cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
              </button>
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 mt-2 w-52 bg-[#121214] border border-white/15 rounded-xl shadow-md p-2 z-50"
                  >
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="text-xs font-bold text-white">{user.name}</p>
                      <p className="text-xs text-neutral-400">{user.email || 'No email set'}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                        user.role === 'BUYER' ? 'bg-blue-900 text-blue-300' : 'bg-emerald-900 text-emerald-300'
                      }`}>
                        {user.role}{user.role === 'BUYER' && user.buyerType ? ` — ${user.buyerType}` : ''}
                      </span>
                    </div>
                    <button
                      onClick={() => { setActiveTab('profile'); setIsUserMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      <span>{t('nav.myProfile')}</span>
                    </button>
                    <button
                      onClick={() => { setActiveTab('customer-support'); setIsUserMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/30 rounded-xl transition-colors cursor-pointer"
                    >
                      <span className="w-3.5 h-3.5 text-center font-bold">🎧</span>
                      <span>{t('nav.customerSupport')}</span>
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t('nav.signOut')}</span>
                    </button>
                    <div className="border-t border-white/10 mt-1 pt-1">
                      <p className="px-3 py-1.5 text-xs text-neutral-500">
                        {t('nav.switchRoleHelp')}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Demo Menu Dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDemoMenuOpen(!isDemoMenuOpen);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-400/40 text-amber-300 hover:text-white text-xs font-bold rounded-xl hover:bg-amber-500/30 transition-all cursor-pointer shadow-sm"
                  title={t('nav.tryDemo')}
                >
                  <span>⚡ {t('nav.tryDemo')}</span>
                  <ChevronDown className="w-3 h-3 text-amber-300" />
                </button>

                <AnimatePresence>
                  {isDemoMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 bg-[#141418] border border-white/15 rounded-xl shadow-md p-2 z-50 backdrop-blur-2xl"
                    >
                      <p className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-neutral-400">
                        {t('nav.selectDemo')}
                      </p>

                      {/* Farmer Demo Option */}
                      <button
                        onClick={() => {
                          loginAsDemo('FARMER');
                          setIsDemoMenuOpen(false);
                        }}
                        className="flex items-start gap-2.5 w-full p-2.5 hover:bg-emerald-950/40 rounded-xl transition-all text-left cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <Sprout className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-emerald-300">🌾 {t('nav.demoFarmer')}</p>
                          <p className="text-xs text-neutral-400 leading-tight">{t('nav.demoFarmerDesc')}</p>
                        </div>
                      </button>

                      {/* Buyer Aggregator Option */}
                      <button
                        onClick={() => {
                          loginAsDemo('BUYER', 'AGGREGATOR');
                          setIsDemoMenuOpen(false);
                        }}
                        className="flex items-start gap-2.5 w-full p-2.5 hover:bg-blue-950/40 rounded-xl transition-all text-left cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-blue-300">🏢 {t('nav.demoAggregator')}</p>
                          <p className="text-xs text-neutral-400 leading-tight">{t('nav.demoAggregatorDesc')}</p>
                        </div>
                      </button>

                      {/* Buyer Processor Option */}
                      <button
                        onClick={() => {
                          loginAsDemo('BUYER', 'PROCESSOR');
                          setIsDemoMenuOpen(false);
                        }}
                        className="flex items-start gap-2.5 w-full p-2.5 hover:bg-cyan-950/40 rounded-xl transition-all text-left cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-cyan-600/30 text-cyan-400 flex items-center justify-center shrink-0 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                          <Factory className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-cyan-300">🏭 {t('nav.demoProcessor')}</p>
                          <p className="text-xs text-neutral-400 leading-tight">{t('nav.demoProcessorDesc')}</p>
                        </div>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/15 text-white text-xs font-bold rounded-xl hover:bg-white/20 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t('nav.signIn')}</span>
              </button>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-500 shadow-md transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('nav.register')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-xl cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#121214] border-b border-white/10 px-4 py-4 space-y-1 text-sm text-white overflow-hidden"
          >
            {currentNavItems.map(item => (
              <button
                key={item.id}
                onClick={() => { item.onClick(); setIsMobileMenuOpen(false); }}
                className={`block w-full text-left px-3 py-2.5 font-medium rounded-xl transition-colors cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-emerald-600/20 text-emerald-400'
                    : 'hover:bg-white/10 text-neutral-300 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
            {!isAuthenticated && (
              <div className="pt-3 border-t border-white/10 space-y-2">
                <p className="text-xs uppercase font-bold text-neutral-400 px-1">{t('nav.instantDemo')}</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { loginAsDemo('FARMER'); setIsMobileMenuOpen(false); }}
                    className="px-3 py-2 bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>🌾 {t('nav.demoFarmer')}</span>
                  </button>
                  <button
                    onClick={() => { loginAsDemo('BUYER', 'AGGREGATOR'); setIsMobileMenuOpen(false); }}
                    className="px-3 py-2 bg-blue-600/30 border border-blue-500/40 text-blue-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>🏢 {t('nav.demoAggregator')}</span>
                  </button>
                </div>
                <button
                  onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }}
                  className="w-full mt-1 px-3 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{t('nav.signInRegister')}</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
