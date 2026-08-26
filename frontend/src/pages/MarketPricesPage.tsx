import React, { useState } from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Minus, Search, MapPin } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { initialMandiPrices, priceTrendHistorical } from '../data/mockData';

export const MarketPricesPage: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState<string>('Soybean');
  const [searchTerm, setSearchTerm] = useState('');

  const cropList = [
    'Tomato', 'Red Onion', 'Cotton', 'Soybean', 'Wheat', 'Rice / Paddy', 'Maize / Corn',
    'Sugarcane', 'Potato', 'Garlic', 'Chilli', 'Turmeric', 'Ginger', 'Banana', 'Mango',
    'Grapes', 'Pomegranate', 'Lemon', 'Groundnut', 'Mustard', 'Chana', 'Tur / Arhar', 'Cabbage',
    'Cauliflower', 'Brinjal', 'Jowar'
  ].sort();

  const getChartData = (crop: string) => {
    if (priceTrendHistorical[crop]) return priceTrendHistorical[crop];
    
    // Synthetic data for missing crops so the UI never breaks
    const synthetic = [];
    let basePrice = 1500 + (crop.length * 100); // stable deterministic base price based on crop string
    for(let i=8; i<=14; i++) {
        synthetic.push({
            date: `Aug ${i.toString().padStart(2, '0')}`,
            'Nashik APMC': Math.round(basePrice),
            'Pune APMC': Math.round(basePrice * 1.05)
        });
        basePrice = basePrice + (Math.random() * 50 - 20); // random drift
    }
    return synthetic;
  };

  const chartData = getChartData(selectedCrop);
  const mandiKeys = Object.keys(chartData[0] || {}).filter(k => k !== 'date');
  const lineColors = ['#1F6B45', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444', '#10B981', '#F97316'];

  const filteredPrices = initialMandiPrices.filter(
    m => m.crop === selectedCrop &&
         (m.marketName.toLowerCase().includes(searchTerm.toLowerCase()) || m.district.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-black/60 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/5 text-white flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-medium tracking-tight text-white">Live Mandi Prices & APMC Trend Intelligence</h2>
              <p className="text-sm text-neutral-400 mt-1 font-light">
                Real-time rate comparison across Maharashtra & India urban/rural APMC markets.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-neutral-400">Select Crop:</span>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="px-4 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-emerald-500/50 shadow-sm cursor-pointer appearance-none transition-all"
            >
              {cropList.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Recharts Historical Trend Line Graph */}
      <div className="bg-black/60 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
            7-Day Historical APMC Price Trend (₹ / Quintal)
          </h3>
          <span className="text-xs text-emerald-400/80 font-medium font-mono">Updated Today 08:00 AM</span>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData as any[]}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="date" stroke="#888888" fontSize={11} />
              <YAxis stroke="#888888" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111', borderRadius: '12px', border: '1px solid #ffffff10', color: '#fff', fontSize: '12px' }}
              />
              {mandiKeys.map((key, idx) => (
                <Line 
                  key={key} 
                  type="monotone" 
                  dataKey={key} 
                  stroke={lineColors[idx % lineColors.length]} 
                  strokeWidth={3} 
                  dot={false} 
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mandi Rates Table Directory */}
      <div className="bg-black/60 backdrop-blur-xl rounded-3xl border border-white/5 shadow-sm overflow-hidden space-y-6 p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-medium text-white">Daily APMC Rates Directory</h3>

          <div className="relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search market or district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 text-sm bg-black/50 border border-white/10 text-white rounded-xl focus:border-emerald-500/50 outline-none w-64 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/5">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-neutral-400 font-medium text-xs border-b border-white/5">
              <tr>
                <th className="py-4 px-5">APMC Market</th>
                <th className="py-4 px-5">Crop</th>
                <th className="py-4 px-5">District & State</th>
                <th className="py-4 px-5">Min Price</th>
                <th className="py-4 px-5">Max Price</th>
                <th className="py-4 px-5">Modal Price</th>
                <th className="py-4 px-5">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-300">
              {filteredPrices.map((m) => (
                <tr key={m.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-5 font-medium text-white flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{m.marketName}</span>
                  </td>
                  <td className="py-4 px-5 font-medium text-emerald-400">{m.crop}</td>
                  <td className="py-4 px-5 text-neutral-400">{m.district}, {m.state}</td>
                  <td className="py-4 px-5 font-mono">₹{m.minPrice}</td>
                  <td className="py-4 px-5 font-mono">₹{m.maxPrice}</td>
                  <td className="py-4 px-5 font-mono font-medium text-white">₹{m.modalPrice} / {m.unit}</td>
                  <td className="py-4 px-5">
                    {m.trend === 'UP' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium text-[10px]">
                        <ArrowUpRight className="w-3 h-3" /> UP
                      </span>
                    ) : m.trend === 'DOWN' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-400 font-medium text-[10px]">
                        <ArrowDownRight className="w-3 h-3" /> DOWN
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-neutral-400 font-medium text-[10px]">
                        <Minus className="w-3 h-3" /> STABLE
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
