import React, { useState, useEffect } from 'react';
import {
  Sprout, Bell, Globe, Bot, ScanLine, Menu, X, ArrowRight, LogOut, User as UserIcon,
  LogIn, UserPlus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const {
    user, isAuthenticated, logout, requireAuth, loginAsDemo, notifications, markNotificationsRead,
    language, setLanguage, setIsAuthModalOpen,
    activeTab, setActiveTab, switchBuyerType
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsNotifOpen(false);
      setIsUserMenuOpen(false);
    };
    if (isNotifOpen || isUserMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isNotifOpen, isUserMenuOpen]);

  // Farmer Navigation Items
  const farmerNavItems = [
    { id: 'landing', label: 'Home', onClick: () => setActiveTab('landing') },
    { id: 'farmer-dashboard', label: 'Dashboard', onClick: () => requireAuth(() => setActiveTab('farmer-dashboard')) },
    { id: 'add-crop', label: '+ Add Crop', onClick: () => requireAuth(() => setActiveTab('add-crop')) },
    { id: 'losses-prevention', label: 'Krishi Rakshak', onClick: () => setActiveTab('losses-prevention') },
    { id: 'solutions', label: 'Solutions', onClick: () => setActiveTab('solutions') },
    { id: 'market-prices', label: 'Mandi Prices', onClick: () => setActiveTab('market-prices') },
    { id: 'schemes', label: 'Govt Schemes', onClick: () => setActiveTab('schemes') },
    { id: 'weather', label: 'Weather', onClick: () => setActiveTab('weather') },
  ];

  // Buyer Supply Chain Navigation Items
  const buyerNavItems = [
    { id: 'buyer-dashboard', label: 'Aggregator Hub', onClick: () => { switchBuyerType('AGGREGATOR'); setActiveTab('buyer-dashboard'); } },
    { id: 'processor-dashboard', label: 'Processor Plant', onClick: () => { switchBuyerType('PROCESSOR'); setActiveTab('processor-dashboard'); } },
    { id: 'wholesaler-dashboard', label: 'Wholesaler Terminal', onClick: () => { switchBuyerType('WHOLESALER'); setActiveTab('wholesaler-dashboard'); } },
    { id: 'find-farmers', label: 'Find Farmers', onClick: () => setActiveTab('find-farmers') },
    { id: 'market-prices', label: 'Mandi Prices', onClick: () => setActiveTab('market-prices') },
  ];

  const currentNavItems = user.role === 'FARMER' ? farmerNavItems : buyerNavItems;

  return (
    <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

        {/* Brand Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab(user.role === 'FARMER' ? 'landing' : 'buyer-dashboard')}
            className="flex items-center gap-2.5 group focus:outline-none pr-2 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg group-hover:bg-emerald-500 transition-colors">
              <Sprout className="w-6 h-6" />
            </div>
            <span className="font-black text-lg md:text-xl text-white tracking-tight leading-none">
              Krishi Grow
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

          {/* Role badge (read-only — no toggle) */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full border ${
              user.role === 'BUYER'
                ? 'bg-purple-600/20 text-purple-300 border-purple-500/30'
                : 'bg-emerald-600/20 text-emerald-300 border-emerald-500/30'
            }`}
          >
            <span className="uppercase text-[10px] tracking-wider font-black">{user.role}</span>
            {isAuthenticated && (
              <span className="text-[9px] text-neutral-300 font-normal">•  {user.name.split(' ')[0]}</span>
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
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
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
                  className="absolute right-0 mt-2 w-80 bg-[#121214] backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/15 p-4 z-50"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="font-bold text-sm text-white">Notifications</span>
                    <span className="text-xs text-neutral-400 font-mono">{notifications.length} Total</span>
                  </div>
                  <div className="space-y-3 mt-3 max-h-64 overflow-y-auto pr-1">
                    {notifications.map(n => (
                      <div key={n.id} className="text-xs p-2.5 rounded-xl bg-white/5 border border-white/10">
                        <div className="font-bold text-white flex items-center justify-between">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-neutral-400">{n.timestamp}</span>
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
                    className="absolute right-0 mt-2 w-52 bg-[#121214] border border-white/15 rounded-2xl shadow-2xl p-2 z-50"
                  >
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="text-xs font-bold text-white">{user.name}</p>
                      <p className="text-[10px] text-neutral-400">{user.email || 'No email set'}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        user.role === 'BUYER' ? 'bg-purple-900 text-purple-300' : 'bg-emerald-900 text-emerald-300'
                      }`}>
                        {user.role}{user.role === 'BUYER' && user.buyerType ? ` — ${user.buyerType}` : ''}
                      </span>
                    </div>
                    <button
                      onClick={() => { setActiveTab('profile'); setIsUserMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                    <div className="border-t border-white/10 mt-1 pt-1">
                      <p className="px-3 py-1.5 text-[9px] text-neutral-500">
                        To switch role (Farmer ↔ Buyer), sign out and log in with a different account.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => loginAsDemo('FARMER')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-400/40 text-amber-300 hover:text-white text-xs font-bold rounded-xl hover:bg-amber-500/30 transition-all cursor-pointer shadow-sm"
                title="Instant Demo Access — No Sign Up Required"
              >
                <span>⚡ Try Demo</span>
              </button>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/15 text-white text-xs font-bold rounded-xl hover:bg-white/20 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-500 shadow-md transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Register</span>
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
              <button
                onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }}
                className="w-full mt-2 px-3 py-2.5 bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign In / Register</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
