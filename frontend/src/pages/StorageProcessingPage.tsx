import React, { useState } from 'react';
import { Warehouse, Factory, MapPin, Phone, CheckCircle2 } from 'lucide-react';
import { storageFacilities, processingFacilities } from '../data/mockData';
import { useApp } from '../context/AppContext';

export const StorageProcessingPage: React.FC = () => {
  const { setActiveTab: setGlobalActiveTab } = useApp();
  const [activeTab, setActiveTab] = useState<'STORAGE' | 'PROCESSING'>('STORAGE');
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-borderLight shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
            <Warehouse className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-charcoal">Cold Storage & Food Processing Hub</h2>
            <p className="text-xs text-mutedText">
              Discover verified WDRA cold storages, dry godowns & industrial food processing facilities near Nashik & Maharashtra.
            </p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={() => setActiveTab('STORAGE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'STORAGE'
                ? 'bg-agri-600 text-white shadow-xs'
                : 'bg-bgLight text-mutedText hover:bg-gray-100'
            }`}
          >
            <Warehouse className="w-4 h-4" />
            <span>Cold Storages & Warehouses ({storageFacilities.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('PROCESSING')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'PROCESSING'
                ? 'bg-agri-600 text-white shadow-xs'
                : 'bg-bgLight text-mutedText hover:bg-gray-100'
            }`}
          >
            <Factory className="w-4 h-4" />
            <span>Food Processing Plants ({processingFacilities.length})</span>
          </button>
        </div>
      </div>

      {bookingSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-agri-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-agri-600" />
          <span>Inquiry sent to facility manager! They will call you at your registered mobile number shortly.</span>
        </div>
      )}

      {/* Facilities List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'STORAGE' ? (
          storageFacilities.map((f) => (
            <div key={f.id} className="bg-white p-6 rounded-2xl border border-borderLight shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                    {f.type}
                  </span>
                  <span className="text-xs font-mono font-bold text-agri-700">
                    ₹{f.pricePerTonDay} / Ton / Day
                  </span>
                </div>

                <h3 className="text-base font-bold text-charcoal">{f.name}</h3>

                <div className="text-xs text-mutedText space-y-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-agri-600 shrink-0" />
                    <span>{f.location} ({f.distanceKm} km away)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-agri-600 shrink-0" />
                    <span className="font-mono">{f.contactPhone}</span>
                  </div>
                </div>

                {/* Capacity Bar */}
                <div className="bg-bgLight p-3 rounded-xl border border-borderLight space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-mutedText">Available Capacity</span>
                    <span className="font-bold text-charcoal font-mono">{f.availableCapacityTonnes} / {f.totalCapacityTonnes} T</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-agri-600"
                      style={{ width: `${(f.availableCapacityTonnes / f.totalCapacityTonnes) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {f.features.map((feat, i) => (
                    <span key={i} className="text-[10px] bg-gray-100 text-charcoal font-medium px-2 py-0.5 rounded-md">
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setGlobalActiveTab('buyer-connections')}
                className="w-full py-2.5 bg-agri-600 hover:bg-agri-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                Book Storage Capacity
              </button>
            </div>
          ))
        ) : (
          processingFacilities.map((p) => (
            <div key={p.id} className="bg-white p-6 rounded-2xl border border-borderLight shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    Min Batch: {p.minBatchTonnes} Tonnes
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-800">
                    {p.dailyCapacityTonnes} T/Day Cap
                  </span>
                </div>

                <h3 className="text-base font-bold text-charcoal">{p.name}</h3>

                <div className="text-xs text-mutedText space-y-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{p.location} ({p.distanceKm} km away)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="font-mono">{p.contactPhone}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-charcoal block mb-1">Crops Accepted:</span>
                  <div className="flex flex-wrap gap-1">
                    {p.cropsAccepted.map((c, i) => (
                      <span key={i} className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-md border border-amber-200">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-charcoal block mb-1">Processing Output:</span>
                  <div className="flex flex-wrap gap-1">
                    {p.processingTypes.map((pt, i) => (
                      <span key={i} className="text-[10px] bg-gray-100 text-charcoal font-medium px-2 py-0.5 rounded-md">
                        {pt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setBookingSuccess(p.name)}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                Send Processing Batch Request
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
