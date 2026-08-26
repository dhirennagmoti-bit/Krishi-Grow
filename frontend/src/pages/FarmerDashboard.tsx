import React from 'react';
import {
  Sprout, PlusCircle, TrendingUp, Clock, AlertTriangle,
  ArrowRight, Warehouse, Trash2, CloudSun, ShoppingCart,
  BarChart3, Package, Leaf, MapPin, Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ElasticDashboardStats } from '../components/ui/elastic-dashboard-stats';

export const FarmerDashboard: React.FC = () => {
  const { user, isAuthenticated, requireAuth, crops, deleteCrop, setActiveTab, buyerReqs } = useApp();

  const totalQuantityTonnes = crops.reduce((sum, c) => sum + c.quantity, 0);
  const shelfLifeAlerts = crops.filter(c => c.daysRemaining <= 12).length;
  const buyerMatchesCount = buyerReqs.length;

  return (
    <div className="space-y-8">

      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black/40 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-950">
            <Sprout className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">
              {isAuthenticated ? `Good day, ${user.name.split(' ')[0]} 👋` : 'Welcome to Krishi Grow 👋'}
            </h2>
            <p className="text-xs text-gray-300 mt-1 flex items-center gap-1.5">
              {isAuthenticated ? (
                <>
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{user.district}, {user.state}</span>
                  <span className="text-neutral-500">•</span>
                  <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{user.farmSizeAcres || 10} Acres Farm</span>
                </>
              ) : (
                <span>Explore live mandi prices, storage hubs & AI crop health diagnostics. Sign in to list crops.</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setActiveTab('weather')}
            className="px-4 py-2.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 text-xs font-bold rounded-xl border border-blue-500/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <CloudSun className="w-4 h-4" />
            <span>Weather</span>
          </button>
          <button
            onClick={() => setActiveTab('market-prices')}
            className="px-4 py-2.5 bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 text-xs font-bold rounded-xl border border-amber-500/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Mandi Prices</span>
          </button>
          <button
            onClick={() => requireAuth(() => setActiveTab('add-crop'))}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-950 transition-all flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add Crop Record</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards Grid (Elastic) */}
      <ElasticDashboardStats
        cropsCount={crops.length}
        totalQuantity={totalQuantityTonnes}
        shelfLifeAlerts={shelfLifeAlerts}
        buyerMatchesCount={buyerMatchesCount}
        onBuyerMatchClick={() => setActiveTab('buyer-connections')}
      />

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: ShoppingCart, label: 'Buyer Connections', sub: 'Find direct buyers', tab: 'buyer-connections', color: 'emerald', count: buyerMatchesCount },
          { icon: Warehouse, label: 'Storage & Processing', sub: 'Nearest cold storage', tab: 'storage-processing', color: 'cyan', count: null },
          { icon: CloudSun, label: 'Weather Advisory', sub: 'Live crop risk alerts', tab: 'weather', color: 'blue', count: null },
          { icon: BarChart3, label: 'Mandi Prices', sub: 'Live APMC rates', tab: 'market-prices', color: 'amber', count: null },
        ].map(({ icon: Icon, label, sub, tab, color, count }) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/10 hover:border-${color}-500/30 rounded-2xl p-4 text-left transition-all group cursor-pointer`}
          >
            <div className={`w-10 h-10 rounded-xl bg-${color}-600/20 border border-${color}-500/30 flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 text-${color}-400`} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">{label}</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">{sub}</div>
              </div>
              {count !== null && count > 0 && (
                <span className={`text-xs font-black text-${color}-400 bg-${color}-900/40 border border-${color}-500/30 rounded-full px-2 py-0.5`}>
                  {count}
                </span>
              )}
            </div>
            <ArrowRight className={`w-4 h-4 text-${color}-400 mt-2 group-hover:translate-x-1 transition-transform`} />
          </button>
        ))}
      </div>

      {/* Recommended Action Cards */}
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 text-white rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> High-Priority Opportunities
          </div>
          <button
            onClick={() => setActiveTab('solutions')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>View All Solutions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/60 backdrop-blur-xl p-5 rounded-2xl border border-emerald-500/20 shadow-sm space-y-3 hover:border-emerald-500/40 transition-all group">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Tomato Batch #crop_01
              </span>
              <span className="bg-emerald-900/50 text-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-bold">95% Score</span>
            </div>
            <p className="text-sm text-neutral-300 leading-snug">
              Raw tomato prices fluctuating. Convert 15T harvest to concentrated puree with AgroPure (22 km) for <span className="text-emerald-400 font-bold">34% higher profit margin</span>.
            </p>
            <button
              onClick={() => setActiveTab('solutions')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 pt-1 cursor-pointer"
            >
              <span>Explore Puree Facility</span> <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="bg-black/60 backdrop-blur-xl p-5 rounded-2xl border border-purple-500/20 shadow-sm space-y-3 hover:border-purple-500/40 transition-all group">
            <div className="flex items-center justify-between text-xs font-semibold text-purple-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                Red Onion Batch #crop_02
              </span>
              <span className="bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded-full text-[10px] font-bold">94% Match</span>
            </div>
            <p className="text-sm text-neutral-300 leading-snug">
              Swastik Export Wholesalers matched for 30T onions at <span className="text-purple-400 font-bold">₹2,500/Qtl</span> for Dubai export dispatch.
            </p>
            <button
              onClick={() => setActiveTab('buyer-connections')}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1.5 pt-1 cursor-pointer"
            >
              <span>Request Connection</span> <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Crop Inventory Table */}
      <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Active Harvest Inventory</h3>
              <p className="text-[11px] text-gray-400">Crops currently logged in your farm record</p>
            </div>
          </div>
          <button
            onClick={() => requireAuth(() => setActiveTab('add-crop'))}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Add New
          </button>
        </div>

        {crops.length === 0 ? (
          <div className="p-16 text-center">
            <Sprout className="w-12 h-12 text-emerald-600/50 mx-auto mb-3" />
            <p className="text-neutral-400 text-sm font-medium">No crops logged yet</p>
            <button
              onClick={() => requireAuth(() => setActiveTab('add-crop'))}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-500 transition-colors cursor-pointer"
            >
              + Add Your First Crop
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-neutral-400 uppercase font-bold text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Crop & Variety</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Grade & Quality</th>
                  <th className="py-3 px-4">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Harvest Date</span>
                  </th>
                  <th className="py-3 px-4">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Shelf Life</span>
                  </th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {crops.map((crop) => (
                  <tr key={crop.id} className="hover:bg-white/5 transition-colors group">

                    {/* Crop Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {crop.imageUrl ? (
                          <img src={crop.imageUrl} alt={crop.name} className="w-10 h-10 rounded-xl object-cover border border-white/20" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/20">
                            <Sprout className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-white">{crop.name}</div>
                          <div className="text-[10px] text-neutral-400">{crop.variety || 'Standard Variety'}</div>
                        </div>
                      </div>
                    </td>

                    {/* Quantity */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-white">{crop.quantity}</span>
                      <span className="text-neutral-400 ml-1">{crop.unit}s</span>
                    </td>

                    {/* Grade */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-[10px]">
                        Grade {crop.grade}
                      </span>
                      {crop.isOrganic && (
                        <span className="ml-1 px-1.5 py-0.5 rounded-lg bg-green-500/20 border border-green-500/30 text-green-300 font-semibold text-[9px]">
                          Organic
                        </span>
                      )}
                    </td>

                    {/* Harvest Date */}
                    <td className="py-3.5 px-4 text-neutral-400 font-mono">
                      {crop.harvestDate}
                    </td>

                    {/* Remaining Shelf Life */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              crop.daysRemaining <= 7 ? 'bg-rose-500' :
                              crop.daysRemaining <= 14 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min((crop.daysRemaining / crop.estimatedShelfLifeDays) * 100, 100)}%` }}
                          />
                        </div>
                        <span className={`font-bold text-[11px] font-mono ${
                          crop.daysRemaining <= 7 ? 'text-rose-400' :
                          crop.daysRemaining <= 14 ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {crop.daysRemaining}d
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        crop.status === 'AVAILABLE'
                          ? 'bg-emerald-900/30 border-emerald-500/30 text-emerald-300'
                          : crop.status === 'SOLD'
                          ? 'bg-neutral-900/30 border-neutral-500/30 text-neutral-400'
                          : 'bg-amber-900/30 border-amber-500/30 text-amber-300'
                      }`}>
                        {crop.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => requireAuth(() => setActiveTab('buyer-connections'))}
                          className="px-2 py-1 text-[10px] font-bold text-emerald-400 hover:bg-emerald-600/20 rounded-lg border border-emerald-500/20 hover:border-emerald-500/40 transition-colors cursor-pointer"
                        >
                          Find Buyers
                        </button>
                        <button
                          onClick={() => requireAuth(() => deleteCrop(crop.id))}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title="Delete record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Solutions Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: TrendingUp,
            title: 'Value Addition Solutions',
            desc: 'Discover processing units, dehydration, and puree facilities near your farm for higher returns.',
            tab: 'solutions',
            color: 'emerald',
            cta: 'Explore Solutions',
          },
          {
            icon: Warehouse,
            title: 'Cold Storage & Warehousing',
            desc: 'Find NABARD-certified cold storage facilities to extend your crop shelf life by 60+ days.',
            tab: 'storage-processing',
            color: 'cyan',
            cta: 'Find Storage',
          },
          {
            icon: CloudSun,
            title: 'Weather & Pest Risk',
            desc: 'Get hyperlocal weather alerts and AI-powered crop disease risk predictions for your district.',
            tab: 'weather',
            color: 'blue',
            cta: 'View Forecast',
          },
        ].map(({ icon: Icon, title, desc, tab, color, cta }) => (
          <div
            key={tab}
            className={`bg-black/40 backdrop-blur-xl border border-white/10 hover:border-${color}-500/30 rounded-3xl p-5 transition-all group cursor-pointer`}
            onClick={() => setActiveTab(tab)}
          >
            <div className={`w-10 h-10 rounded-2xl bg-${color}-600/20 border border-${color}-500/30 flex items-center justify-center mb-4`}>
              <Icon className={`w-5 h-5 text-${color}-400`} />
            </div>
            <h4 className="font-bold text-white text-sm mb-1.5">{title}</h4>
            <p className="text-xs text-neutral-400 leading-relaxed mb-4">{desc}</p>
            <span className={`text-xs font-bold text-${color}-400 flex items-center gap-1.5`}>
              {cta} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
