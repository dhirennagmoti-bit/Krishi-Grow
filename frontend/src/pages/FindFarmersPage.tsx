import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CropGridSelector } from '../components/CropGridSelector';
import { Users, Send, MapPin, CheckCircle2 } from 'lucide-react';

export const FindFarmersPage: React.FC = () => {
  const { crops, setActiveTab, requireAuth } = useApp();
  const [selectedCrop, setSelectedCrop] = useState('ALL');

  const filteredCrops = crops.filter(c => selectedCrop === 'ALL' || c.name.toLowerCase().includes(selectedCrop.toLowerCase()) || selectedCrop.toLowerCase().includes(c.name.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="bg-black/40 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              <span>Find Farmers & Verified Crop Batches</span>
            </h2>
            <p className="text-xs text-gray-300 mt-0.5">
              Browse verified farm harvest records across Maharashtra & India with direct email trade dispatch.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('buyer-connections')}
            className="px-4 py-2 bg-purple-600/30 border border-purple-500/40 text-purple-300 hover:text-white hover:bg-purple-600 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>Open Matchmaking Hub</span>
          </button>
        </div>

        <CropGridSelector
          selectedCrop={selectedCrop === 'ALL' ? 'Tomato' : selectedCrop}
          onSelectCrop={(name) => setSelectedCrop(name)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredCrops.map((c) => (
          <div
            key={c.id}
            className="p-6 space-y-4 h-full flex flex-col justify-between bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl hover:border-emerald-500/30 transition-all group"
          >
            <div className="flex items-center gap-3 pb-3 border-b border-white/10">
              <img src={c.imageUrl || '/crops/tomato.jpg'} alt={c.name} className="w-14 h-14 rounded-2xl object-cover border border-white/10 bg-white/5" />
              <div>
                <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors">{c.name}</h3>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                  Grade {c.grade} • {c.isOrganic ? '🌿 Organic' : 'Standard'}
                </span>
              </div>
            </div>

            <div className="text-xs space-y-1.5 text-gray-400 bg-white/5 p-3 rounded-2xl border border-white/5">
              <div className="flex justify-between">
                <span>Farmer Name:</span> <strong className="text-white">{c.farmerName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Available Quantity:</span> <strong className="font-mono text-white">{c.quantity} {c.unit}s</strong>
              </div>
              <div className="flex justify-between">
                <span>Harvest Location:</span> <strong className="text-white">{c.location.district}, {c.location.state}</strong>
              </div>
              <div className="flex justify-between">
                <span>Remaining Shelf Life:</span> <strong className="font-mono text-amber-400">{c.daysRemaining} Days</strong>
              </div>
            </div>

            <button
              onClick={() => requireAuth(() => setActiveTab('buyer-connections'))}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Propose Procurement & Notify via Email</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
