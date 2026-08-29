import React, { useState, useMemo } from 'react';
import { Truck, ShieldCheck, MapPin, Phone, Mail, Search } from 'lucide-react';
import { calculateTransportCost } from '../services/api';
import type { TransportCalculation } from '../types';
import { transporters } from '../data/transporters';

export const TransportCalculatorPage: React.FC = () => {
  const [cropName, setCropName] = useState('Tomato');
  const [quantity, setQuantity] = useState('10');
  const [pickup, setPickup] = useState('Nashik');
  const [destination, setDestination] = useState('Mumbai (Vashi APMC)');
  const [vehicleType, setVehicleType] = useState<'PICKUP_1T' | 'EICHER_3.5T' | 'TRUCK_10T' | 'CONTAINER_24T'>('TRUCK_10T');

  // Transporter Directory State
  const [searchCity, setSearchCity] = useState('Nashik');

  const uniqueCities = useMemo(() => {
    const cities = new Set(transporters.map(t => t.city));
    return Array.from(cities).sort();
  }, []);

  const filteredTransporters = useMemo(() => {
    return transporters.filter(t => t.city === searchCity);
  }, [searchCity]);

  const result: TransportCalculation = calculateTransportCost(
    cropName,
    parseFloat(quantity) || 1,
    pickup,
    destination,
    vehicleType
  );

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="bg-black/20 backdrop-blur-xl p-6 rounded-xl border border-white/10 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-agri-600 text-white flex items-center justify-center font-bold">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Agricultural Transport Cost Calculator</h2>
            <p className="text-xs text-gray-300">
              Calculate exact freight charges, route distance, vehicle capacity matching, and per-kg transport impact.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Inputs Form */}
        <div className="lg:col-span-5 bg-black/20 backdrop-blur-xl p-6 rounded-xl border border-white/10 shadow-md space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Transport Parameters</h3>

          <div>
            <label className="block text-xs font-bold text-white mb-1">Crop to Transport</label>
            <select
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-white/20 text-white rounded-xl focus:border-agri-400 outline-none bg-black/40"
            >
              <option value="Tomato">Tomato (Perishable)</option>
              <option value="Red Onion">Red Onion (Bulky)</option>
              <option value="Cotton">Cotton (Baled)</option>
              <option value="Soybean">Soybean (Grains)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-white mb-1">Quantity (Tonnes)</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-white/20 text-white rounded-xl focus:border-agri-400 outline-none font-mono font-bold bg-black/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white mb-1">Pickup Location</label>
            <input
              type="text"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-white/20 text-white rounded-xl focus:border-agri-400 outline-none bg-black/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white mb-1">Destination Market / Facility</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-white/20 text-white rounded-xl focus:border-agri-400 outline-none bg-black/40"
            >
              <option value="Mumbai (Vashi APMC)">Mumbai (Vashi APMC) — 165 km</option>
              <option value="Pune (Gultekdi APMC)">Pune (Gultekdi APMC) — 210 km</option>
              <option value="Delhi (Azadpur Mandi)">Delhi (Azadpur Mandi) — 1,180 km</option>
              <option value="Surat Market">Surat Market — 235 km</option>
              <option value="Local Storage (Mohadi)">Local Cold Storage (Mohadi) — 18 km</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-white mb-1">Vehicle Type</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'PICKUP_1T', label: '1T Pickup Truck' },
                { id: 'EICHER_3.5T', label: '3.5T Eicher Truck' },
                { id: 'TRUCK_10T', label: '10T 6-Wheeler' },
                { id: 'CONTAINER_24T', label: '24T Reefer Container' }
              ].map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVehicleType(v.id as any)}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${vehicleType === v.id ? 'border-emerald-500 bg-emerald-500/20 text-white' : 'border-white/20 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output Cost Breakdown */}
        <div className="lg:col-span-7 bg-black/20 backdrop-blur-xl p-6 rounded-xl border border-white/10 shadow-md space-y-6">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Cost Calculation Summary
              </span>
              <h3 className="text-xl font-extrabold text-white mt-1">
                ₹{result.totalCost.toLocaleString('en-IN')} Total Cost
              </h3>
            </div>
            <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 text-right">
              <span className="text-xs text-emerald-300 block">Cost Per Kg</span>
              <span className="text-lg font-extrabold font-mono text-white">₹{result.costPerKg} / kg</span>
            </div>
          </div>

          {/* Quick Route Specs */}
          <div className="grid grid-cols-3 gap-3 bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center">
            <div>
              <span className="text-xs text-gray-400 block">Distance</span>
              <span className="font-bold font-mono text-sm text-white">{result.distanceKm} km</span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block">Transit Time</span>
              <span className="font-bold font-mono text-sm text-white">{result.travelTimeHours} Hours</span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block">Vehicle Capacity</span>
              <span className="font-bold font-mono text-sm text-white">{result.vehicleCapacityTonnes} Tonnes</span>
            </div>
          </div>

          {/* Itemized Charge Breakdown Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Itemized Cost Breakdown</h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-white/10">
                <span className="text-gray-300">Base Vehicle Charge</span>
                <span className="font-mono font-bold text-white">₹{result.baseCharge}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/10">
                <span className="text-gray-300">Distance Freight ({result.distanceKm} km)</span>
                <span className="font-mono font-bold text-white">₹{result.distanceCharge}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/10">
                <span className="text-gray-300">Loading Charges</span>
                <span className="font-mono font-bold text-white">₹{result.loadingCharge}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/10">
                <span className="text-gray-300">Unloading Charges</span>
                <span className="font-mono font-bold text-white">₹{result.unloadingCharge}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/10">
                <span className="text-gray-300">Toll & Expressway Charges</span>
                <span className="font-mono font-bold text-white">₹{result.tollCharges}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-between text-xs text-emerald-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Assigned Provider: <strong className="text-white">{result.providerName}</strong></span>
            </div>
            <button
              onClick={() => document.getElementById('transporter-directory')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-3 py-1.5 bg-agri-600 text-white rounded-lg font-bold hover:bg-agri-700"
            >
              Book Transport Now
            </button>
          </div>
        </div>
      </div>

      {/* Regional Transporter Directory */}
      <div id="transporter-directory" className="bg-black/20 backdrop-blur-xl p-6 rounded-xl border border-white/10 shadow-md space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-white">Regional Transporter Directory</h3>
            <p className="text-xs text-gray-400 mt-1">Find verified agricultural transport services nearest to your location.</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-xs font-bold text-white whitespace-nowrap">Search District:</span>
            <div className="relative w-full md:w-48">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-white/20 text-white rounded-xl focus:border-agri-400 outline-none bg-black/40 font-bold appearance-none"
              >
                {uniqueCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredTransporters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTransporters.map((provider) => (
              <div key={provider.id} className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3 hover:border-emerald-500/50 hover:bg-white/10 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                      <Truck className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-white text-sm leading-tight">{provider.name}</h4>
                  </div>
                </div>

                <div className="text-xs text-gray-400 flex items-start gap-1.5 mt-2">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-gray-500" />
                  <span className="leading-snug line-clamp-2">{provider.address}</span>
                </div>

                <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                  <a href={`tel:${provider.phone.split('/')[0].trim()}`} className="flex items-center gap-2 text-xs font-mono font-bold text-white hover:text-emerald-400 transition-colors">
                    <div className="w-6 h-6 rounded-md bg-white/10 border border-white/20 flex items-center justify-center shadow-xs">
                      <Phone className="w-3 h-3 text-emerald-400" />
                    </div>
                    {provider.phone}
                  </a>
                  {provider.email && (
                    <a href={`mailto:${provider.email}`} className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-emerald-400 transition-colors">
                      <div className="w-6 h-6 rounded-md bg-white/10 border border-white/20 flex items-center justify-center shadow-xs shrink-0">
                        <Mail className="w-3 h-3 text-blue-400" />
                      </div>
                      <span className="truncate">{provider.email}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <Search className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-white">No transporters found for {searchCity}</p>
            <p className="text-xs text-gray-400 mt-1">Try selecting a different district.</p>
          </div>
        )}
      </div>

    </div>
  );
};
