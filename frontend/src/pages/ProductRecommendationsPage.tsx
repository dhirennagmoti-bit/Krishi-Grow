import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { getAIProductRecommendations } from '../services/api';

export const ProductRecommendationsPage: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState('ALL');
  const recommendations = getAIProductRecommendations(selectedCrop);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-borderLight shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-charcoal">Best Products to Manufacture (AI Processing Engine)</h2>
              <p className="text-xs text-mutedText">
                AI recommendation algorithm ranks high-margin conversion opportunities (e.g. Puree, Flakes) from raw farm harvests.
              </p>
            </div>
          </div>

          <div>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="px-3 py-2 text-xs border border-borderLight rounded-xl focus:border-amber-600 outline-none bg-bgLight font-medium"
            >
              <option value="ALL">All Crop Categories</option>
              <option value="Tomato">Tomato</option>
              <option value="Red Onion">Red Onion</option>
              <option value="Cotton">Cotton</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recommendations Cards */}
      <div className="space-y-6">
        {recommendations.map((rec) => (
          <div key={rec.id} className="bg-white rounded-2xl border border-borderLight shadow-2xs overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Image Col */}
              <div className="lg:col-span-4 h-64 lg:h-auto relative overflow-hidden">
                <img
                  src={rec.image}
                  alt={rec.targetProduct}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                  {rec.opportunityScore}/100 Opportunity Score
                </div>
              </div>

              {/* Specs Col */}
              <div className="lg:col-span-8 p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                  <div>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full uppercase">
                      Raw: {rec.rawCrop} ➔ Manufactured Output
                    </span>
                    <h3 className="text-xl font-extrabold text-charcoal mt-1">{rec.targetProduct}</h3>
                  </div>

                  <div className="bg-agri-50 px-4 py-2 rounded-xl border border-agri-200 text-right">
                    <span className="text-[10px] text-mutedText block">Estimated Margin</span>
                    <span className="text-lg font-black text-agri-700 font-mono">+{rec.estimatedMarginPercent}% Profit</span>
                  </div>
                </div>

                {/* Micro Metrics Grid */}
                <div className="grid grid-cols-3 gap-3 bg-bgLight p-3.5 rounded-xl border border-borderLight text-xs">
                  <div>
                    <span className="text-[10px] text-mutedText block">Market Demand</span>
                    <span className="font-bold text-charcoal font-mono">{rec.marketDemand}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-mutedText block">Capital Investment</span>
                    <span className="font-bold text-charcoal font-mono">{rec.investmentLevel}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-mutedText block">Shelf Life Extension</span>
                    <span className="font-bold text-agri-700 font-mono font-bold">+{rec.shelfLifeExtensionDays} Days</span>
                  </div>
                </div>

                {/* Why Recommended List */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-charcoal uppercase tracking-wider block">
                    Why AgriAI Recommended This Conversion:
                  </span>
                  <ul className="space-y-1.5 text-xs text-mutedText">
                    {rec.whyRecommended.map((reason, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-mutedText font-medium">
                    Nearby Hub: <strong>{rec.nearbyInfra}</strong>
                  </span>
                  <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5">
                    <span>Connect with Processing Plant</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
