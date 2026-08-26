import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CropGridSelector } from '../components/CropGridSelector';

export const FindFarmersPage: React.FC = () => {
  const { crops, requireAuth } = useApp();
  const [selectedCrop, setSelectedCrop] = useState('ALL');

  const filteredCrops = crops.filter(c => selectedCrop === 'ALL' || c.name.toLowerCase().includes(selectedCrop.toLowerCase()) || selectedCrop.toLowerCase().includes(c.name.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="bg-black/20 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">Find Farmers & Crop Batches</h2>
          <p className="text-xs text-gray-300">Browse verified farm harvest records across India.</p>
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
            className="p-6 space-y-4 h-full flex flex-col justify-between bg-black/60 backdrop-blur-xl border border-white/5 rounded-2xl shadow-sm hover:border-white/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <img src={c.imageUrl} alt={c.name} className="w-14 h-14 rounded-xl object-cover border border-white/10 bg-white/5" />
              <div>
                <h3 className="font-bold text-base text-white">{c.name}</h3>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                  Grade {c.grade}
                </span>
              </div>
            </div>

            <div className="text-xs space-y-1 text-gray-400">
              <div className="flex justify-between">
                <span>Farmer Name:</span> <strong className="text-white">{c.farmerName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Available Quantity:</span> <strong className="font-mono text-white">{c.quantity} {c.unit}s</strong>
              </div>
              <div className="flex justify-between">
                <span>Location:</span> <strong className="text-white">{c.location.district}, {c.location.state}</strong>
              </div>
              <div className="flex justify-between">
                <span>Remaining Shelf Life:</span> <strong className="font-mono text-amber-400">{c.daysRemaining} Days</strong>
              </div>
            </div>

            <button
              onClick={() => requireAuth(() => alert(`Connection request sent to ${c.farmerName}!`))}
              className="w-full py-2.5 bg-agri-600 hover:bg-agri-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Request Purchase Connection
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
