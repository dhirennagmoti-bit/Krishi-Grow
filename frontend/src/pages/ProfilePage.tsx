import React, { useState } from 'react';
import { User, CheckCircle2, Save } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';

export const ProfilePage: React.FC = () => {
  const { user, setUser } = useApp();
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [district, setDistrict] = useState(user.district);
  const [farmSize, setFarmSize] = useState(user.farmSizeAcres?.toString() || '12.5');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...user,
      name,
      email,
      phone,
      district,
      farmSizeAcres: parseFloat(farmSize) || 10
    };
    setUser(updated);

    try {
      await supabase.auth.updateUser({
        data: {
          name,
          phone,
          district,
          farmSizeAcres: parseFloat(farmSize) || 10
        }
      });
    } catch (err) {
      console.warn('Profile Supabase update note:', err);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-black/60 backdrop-blur-xl p-6 md:p-8 rounded-xl border border-white/5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/5 text-white flex items-center justify-center font-bold">
            <User className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-medium tracking-tight text-white">Account & Profile Settings</h2>
            <p className="text-sm text-neutral-400 mt-1 font-normal">Manage personal info, location, and farm verification status.</p>
          </div>
        </div>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-agri-800 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-agri-600" />
          <span>Profile changes updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-black/60 backdrop-blur-xl p-8 md:p-10 rounded-xl border border-white/5 shadow-sm space-y-8">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 text-sm border border-white/10 bg-black/50 text-white rounded-xl focus:border-emerald-500/50 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-sm border border-white/10 bg-black/50 text-white rounded-xl focus:border-emerald-500/50 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Mobile Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 text-sm border border-white/10 bg-black/50 text-white rounded-xl focus:border-emerald-500/50 outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">District / Region</label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-4 py-3 text-sm border border-white/10 bg-black/50 text-white rounded-xl focus:border-emerald-500/50 outline-none transition-all"
            />
          </div>
          {user.role === 'FARMER' && (
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Farm Land Size (Acres)</label>
              <input
                type="number"
                value={farmSize}
                onChange={(e) => setFarmSize(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-white/10 bg-black/50 text-white rounded-xl focus:border-emerald-500/50 outline-none font-mono transition-all"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl shadow-sm transition-colors mt-4"
        >
          Save Profile Updates
        </button>
      </form>
    </div>
  );
};
