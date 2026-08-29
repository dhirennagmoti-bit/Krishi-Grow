import React, { useState } from 'react';
import { Building2, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { QualityGrade } from '../types';
import { CropGridSelector } from '../components/CropGridSelector';

export const BuyerRequirementsPage: React.FC = () => {
  const { user, addBuyerRequirement, setActiveTab, requireAuth } = useApp();
  const [crop, setCrop] = useState('Tomato');
  const [variety] = useState('Abhinav Hybrid (Red)');
  const [quantity, setQuantity] = useState('20');
  const [minGrade, setMinGrade] = useState<QualityGrade>('A');
  const [targetPrice, setTargetPrice] = useState('3200');
  const [pickupRegion, setPickupRegion] = useState('Nashik District');
  const [requiredByDate, setRequiredByDate] = useState('2026-08-22');
  const [notes, setNotes] = useState('Require firm red tomatoes for retail processing.');

  const [showAllCrops, setShowAllCrops] = useState(false);

  const cropList = [
    { name: 'Tomato', emoji: '🍅' },
    { name: 'Red Onion', emoji: '🧅' },
    { name: 'Cotton', emoji: '☁️' },
    { name: 'Soybean', emoji: '🫘' },
    { name: 'Wheat', emoji: '🌾' },
    { name: 'Rice / Paddy', emoji: '🌾' },
    { name: 'Maize / Corn', emoji: '🌽' },
    { name: 'Sugarcane', emoji: '🎋' },
    { name: 'Potato', emoji: '🥔' },
    { name: 'Garlic', emoji: '🧄' },
    { name: 'Chilli', emoji: '🌶️' },
    { name: 'Turmeric', emoji: '🟡' },
    { name: 'Ginger', emoji: '🫚' },
    { name: 'Banana', emoji: '🍌' },
    { name: 'Mango', emoji: '🥭' },
    { name: 'Grapes', emoji: '🍇' },
    { name: 'Pomegranate', emoji: '🍎' },
    { name: 'Lemon', emoji: '🍋' },
    { name: 'Groundnut', emoji: '🥜' },
    { name: 'Mustard', emoji: '🌼' },
    { name: 'Chickpea', emoji: '🧆' },
    { name: 'Pigeon Pea', emoji: '🥣' },
    { name: 'Cabbage', emoji: '🥬' },
    { name: 'Cauliflower', emoji: '🥦' },
    { name: 'Brinjal', emoji: '🍆' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBuyerRequirement({
      buyerId: user.id,
      buyerName: user.businessName || user.name,
      buyerType: user.buyerType || 'AGGREGATOR',
      crop,
      variety,
      quantityRequiredTonnes: parseFloat(quantity) || 10,
      minGrade,
      targetPricePerQuintal: parseFloat(targetPrice) || 3000,
      pickupRegion,
      requiredByDate,
      frequency: 'WEEKLY',
      notes
    });

    setActiveTab('buyer-dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-black/60 backdrop-blur-xl p-8 rounded-xl border border-white/5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/5 text-white flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-medium tracking-tight text-white">Post Procurement Requirement</h2>
            <p className="text-sm text-neutral-400 mt-1 font-normal">
              Post your crop demand to instantly trigger AI matchmaking with nearby farmers.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-black/60 backdrop-blur-xl p-8 md:p-10 rounded-xl border border-white/5 shadow-sm space-y-8">
        <div>
          <CropGridSelector
            selectedCrop={crop}
            onSelectCrop={(name) => setCrop(name)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Quantity Required (Tonnes)</label>
            <input
              type="number"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-4 py-3 text-sm border border-white/10 bg-black/50 text-white rounded-xl focus:border-blue-500/50 outline-none font-mono transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Minimum Quality Grade</label>
            <select
              value={minGrade}
              onChange={(e) => setMinGrade(e.target.value as QualityGrade)}
              className="w-full px-4 py-3 text-sm border border-white/10 bg-black/50 text-white rounded-xl focus:border-blue-500/50 outline-none appearance-none transition-all"
            >
              <option value="A+">Grade A+ (Premium Export)</option>
              <option value="A">Grade A (Standard)</option>
              <option value="B">Grade B (Processing Grade)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Indicative Price (₹ / Quintal)</label>
            <input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className="w-full px-4 py-3 text-sm border border-white/10 bg-black/50 text-white rounded-xl focus:border-blue-500/50 outline-none font-mono transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Required By Date</label>
            <input
              type="date"
              value={requiredByDate}
              onChange={(e) => setRequiredByDate(e.target.value)}
              className="w-full px-4 py-3 text-sm border border-white/10 bg-black/50 text-white rounded-xl focus:border-blue-500/50 outline-none font-mono transition-all"
              style={{ colorScheme: 'dark' }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Pickup Region / Area</label>
          <input
            type="text"
            value={pickupRegion}
            onChange={(e) => setPickupRegion(e.target.value)}
            className="w-full px-4 py-3 text-sm border border-white/10 bg-black/50 text-white rounded-xl focus:border-blue-500/50 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Requirement Notes & Quality Details</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 text-sm border border-white/10 bg-black/50 text-white rounded-xl focus:border-blue-500/50 outline-none transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-blue-600 hover:bg-purple-700 text-white font-medium text-sm rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 mt-4"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>Publish Requirement & Match Farmers</span>
        </button>
      </form>
    </div>
  );
};
