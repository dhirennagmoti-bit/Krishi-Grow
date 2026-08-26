import React, { useState } from 'react';
import { Users, CheckCircle2, MapPin, Building2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BuyerConnectionsPage: React.FC = () => {
  const { buyerReqs, connectionRequests, requestConnection, requireAuth } = useApp();
  const [requestedIds, setRequestedIds] = useState<string[]>([]);

  const handleRequest = (reqId: string, buyerName: string, cropName: string, quantityTonnes: number) => {
    requireAuth(() => {
      requestConnection(reqId, buyerName, cropName, quantityTonnes);
      setRequestedIds(prev => [...prev, reqId]);
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-black/60 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/5 text-white flex items-center justify-center font-bold">
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-medium tracking-tight text-white">Buyer Connections & Matchmaking Engine</h2>
            <p className="text-sm text-neutral-400 mt-1 font-light">
              Direct match requests with verified Aggregators, Processors, and Wholesalers. (90%+ AI Match Accuracy)
            </p>
          </div>
        </div>
      </div>

      {/* Match Cards List */}
      <div className="space-y-6">
        {buyerReqs.map((req) => {
          const isRequested = requestedIds.includes(req.id) || connectionRequests.some(c => c.buyerId === req.buyerId);

          return (
            <div key={req.id} className="bg-black/60 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-sm space-y-6 hover:border-white/10 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 text-neutral-400 flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg text-white">{req.buyerName}</h3>
                    <span className="text-[10px] font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
                      {req.buyerType}
                    </span>
                  </div>
                </div>

                <div className="bg-emerald-500/10 px-4 py-2 rounded-2xl border border-emerald-500/20 text-center">
                  <span className="text-[10px] text-emerald-400/80 block uppercase tracking-widest font-semibold">AI Match Score</span>
                  <span className="text-xl font-medium text-emerald-400 font-mono">{req.matchScore}%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden text-sm border border-white/5">
                <div className="bg-black/60 backdrop-blur-xl p-5">
                  <span className="text-xs text-neutral-500 block mb-1">Required Crop</span>
                  <span className="font-medium text-white">{req.crop} ({req.variety})</span>
                </div>
                <div className="bg-black/60 backdrop-blur-xl p-5">
                  <span className="text-xs text-neutral-500 block mb-1">Required Quantity</span>
                  <span className="font-medium text-white font-mono">{req.quantityRequiredTonnes} Tonnes</span>
                </div>
                <div className="bg-black/60 backdrop-blur-xl p-5">
                  <span className="text-xs text-neutral-500 block mb-1">Indicative Price</span>
                  <span className="font-medium text-emerald-400 font-mono">₹{req.targetPricePerQuintal} / Quintal</span>
                </div>
              </div>

              <p className="text-sm text-neutral-400 leading-relaxed font-light">
                <strong className="text-neutral-300 font-medium">Notes:</strong> {req.notes}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <span>Pickup Region: <strong className="text-white font-medium">{req.pickupRegion}</strong></span>
                </div>

                {isRequested ? (
                  <button disabled className="px-5 py-2.5 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-2 border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Connection Request Sent</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleRequest(req.id, req.buyerName, req.crop, req.quantityRequiredTonnes)}
                    className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-2 border border-white/10"
                  >
                    <span>Request Connection</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
