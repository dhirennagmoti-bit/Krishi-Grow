import React from 'react';
import {
  Sprout, PlusCircle, TrendingUp, Clock, AlertTriangle,
  ArrowRight, Warehouse, Trash2, CloudSun, ShoppingCart,
  BarChart3, Package, Leaf, MapPin, Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ElasticDashboardStats } from '../components/ui/elastic-dashboard-stats';
import { useTranslation } from 'react-i18next';

export const FarmerDashboard: React.FC = () => {
  const { user, isAuthenticated, requireAuth, crops, deleteCrop, setActiveTab, buyerReqs } = useApp();
  const { t } = useTranslation();

  const totalQuantityTonnes = crops.reduce((sum, c) => sum + c.quantity, 0);
  const shelfLifeAlerts = crops.filter(c => c.daysRemaining <= 12).length;
  const buyerMatchesCount = buyerReqs.length;

  return (
    <div className="space-y-8">

      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black/40 backdrop-blur-xl p-6 rounded-xl border border-white/10 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-emerald-600 flex items-center justify-center shadow-md shadow-md">
            <Sprout className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">
              {isAuthenticated ? t('farmerDashboard.goodDay', { name: user.name.split(' ')[0] }) : t('farmerDashboard.welcome')}
            </h2>
            <p className="text-xs text-gray-300 mt-1 flex items-center gap-1.5">
              {isAuthenticated ? (
                <>
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{user.district}, {user.state}</span>
                  <span className="text-neutral-500">•</span>
                  <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{user.farmSizeAcres || 10} {t('farmerDashboard.acresFarm')}</span>
                </>
              ) : (
                <span>{t('farmerDashboard.exploreLive')}</span>
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
            <span>{t('farmerDashboard.weather')}</span>
          </button>
          <button
            onClick={() => setActiveTab('market-prices')}
            className="px-4 py-2.5 bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 text-xs font-bold rounded-xl border border-amber-500/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <BarChart3 className="w-4 h-4" />
            <span>{t('farmerDashboard.mandiPrices')}</span>
          </button>
          <button
            onClick={() => requireAuth(() => setActiveTab('add-crop'))}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('farmerDashboard.addCropRecord')}</span>
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
          { icon: ShoppingCart, label: t('farmerDashboard.buyerConnections'), sub: t('farmerDashboard.findDirectBuyers'), tab: 'buyer-connections', color: 'emerald', count: buyerMatchesCount },
          { icon: Warehouse, label: t('farmerDashboard.storageProcessing'), sub: t('farmerDashboard.nearestColdStorage'), tab: 'storage-processing', color: 'cyan', count: null },
          { icon: CloudSun, label: t('farmerDashboard.weatherAdvisory'), sub: t('farmerDashboard.liveCropRiskAlerts'), tab: 'weather', color: 'blue', count: null },
          { icon: BarChart3, label: t('farmerDashboard.mandiPrices'), sub: t('farmerDashboard.liveApmcRates'), tab: 'market-prices', color: 'amber', count: null },
        ].map(({ icon: Icon, label, sub, tab, color, count }) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/10 hover:border-${color}-500/30 rounded-xl p-4 text-left transition-all group cursor-pointer`}
          >
            <div className={`w-10 h-10 rounded-xl bg-${color}-600/20 border border-${color}-500/30 flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 text-${color}-400`} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">{label}</div>
                <div className="text-xs text-neutral-400 mt-0.5">{sub}</div>
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
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 text-white rounded-xl p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> {t('farmerDashboard.highPriorityOpportunities')}
          </div>
          <button
            onClick={() => setActiveTab('solutions')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>{t('farmerDashboard.viewAllSolutions')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/60 backdrop-blur-xl p-5 rounded-xl border border-emerald-500/20 shadow-sm space-y-3 hover:border-emerald-500/40 transition-all group">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {t('farmerDashboard.tomatoBatch')}
              </span>
              <span className="bg-emerald-900/50 text-emerald-300 px-2 py-0.5 rounded-full text-xs font-bold">{t('farmerDashboard.score95')}</span>
            </div>
            <p className="text-sm text-neutral-300 leading-snug" dangerouslySetInnerHTML={{ __html: t('farmerDashboard.tomatoOpportunity') }} />
            <button
              onClick={() => setActiveTab('solutions')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 pt-1 cursor-pointer"
            >
              <span>{t('farmerDashboard.explorePureeFacility')}</span> <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="bg-black/60 backdrop-blur-xl p-5 rounded-xl border border-blue-500/20 shadow-sm space-y-3 hover:border-blue-500/40 transition-all group">
            <div className="flex items-center justify-between text-xs font-semibold text-blue-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                {t('farmerDashboard.redOnionBatch')}
              </span>
              <span className="bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded-full text-xs font-bold">{t('farmerDashboard.match94')}</span>
            </div>
            <p className="text-sm text-neutral-300 leading-snug" dangerouslySetInnerHTML={{ __html: t('farmerDashboard.onionOpportunity') }} />
            <button
              onClick={() => setActiveTab('buyer-connections')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 pt-1 cursor-pointer"
            >
              <span>{t('farmerDashboard.requestConnection')}</span> <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Crop Inventory Table */}
      <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-white/10 shadow-md overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">{t('farmerDashboard.activeHarvestInventory')}</h3>
              <p className="text-xs text-gray-400">{t('farmerDashboard.cropsCurrentlyLogged')}</p>
            </div>
          </div>
          <button
            onClick={() => requireAuth(() => setActiveTab('add-crop'))}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            {t('farmerDashboard.addNew')}
          </button>
        </div>

        {crops.length === 0 ? (
          <div className="p-16 text-center">
            <Sprout className="w-12 h-12 text-emerald-600/50 mx-auto mb-3" />
            <p className="text-neutral-400 text-sm font-medium">{t('farmerDashboard.noCropsLoggedYet')}</p>
            <button
              onClick={() => requireAuth(() => setActiveTab('add-crop'))}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-500 transition-colors cursor-pointer"
            >
              {t('farmerDashboard.addYourFirstCrop')}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-neutral-400 uppercase font-bold text-xs tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">{t('farmerDashboard.cropVariety')}</th>
                  <th className="py-3 px-4">{t('farmerDashboard.quantity')}</th>
                  <th className="py-3 px-4">{t('farmerDashboard.gradeQuality')}</th>
                  <th className="py-3 px-4">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {t('farmerDashboard.harvestDate')}</span>
                  </th>
                  <th className="py-3 px-4">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {t('farmerDashboard.shelfLife')}</span>
                  </th>
                  <th className="py-3 px-4">{t('farmerDashboard.status')}</th>
                  <th className="py-3 px-4 text-right">{t('farmerDashboard.actions')}</th>
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
                          <div className="font-bold text-white">{t(`crops.${crop.name}`, crop.name)}</div>
                          <div className="text-xs text-neutral-400">{crop.variety ? t(`varieties.${crop.variety}`, crop.variety) : t('farmerDashboard.standardVariety')}</div>
                        </div>
                      </div>
                    </td>

                    {/* Quantity */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-white">{crop.quantity}</span>
                      <span className="text-neutral-400 ml-1">{t('farmerDashboard.units', { unit: crop.unit })}</span>
                    </td>

                    {/* Grade */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-xs">
                        {t('farmerDashboard.grade', { grade: crop.grade })}
                      </span>
                      {crop.isOrganic && (
                        <span className="ml-1 px-1.5 py-0.5 rounded-lg bg-green-500/20 border border-green-500/30 text-green-300 font-semibold text-xs">
                          {t('farmerDashboard.organic')}
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
                        <span className={`font-bold text-xs font-mono ${
                          crop.daysRemaining <= 7 ? 'text-rose-400' :
                          crop.daysRemaining <= 14 ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {crop.daysRemaining}d
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
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
                          className="px-2 py-1 text-xs font-bold text-emerald-400 hover:bg-emerald-600/20 rounded-lg border border-emerald-500/20 hover:border-emerald-500/40 transition-colors cursor-pointer"
                        >
                          {t('farmerDashboard.findBuyers')}
                        </button>
                        <button
                          onClick={() => requireAuth(() => deleteCrop(crop.id))}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title={t('farmerDashboard.deleteRecord')}
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
            title: t('farmerDashboard.valueAdditionSolutions'),
            desc: t('farmerDashboard.discoverProcessingUnits'),
            tab: 'solutions',
            color: 'emerald',
            cta: t('farmerDashboard.exploreSolutions'),
          },
          {
            icon: Warehouse,
            title: t('farmerDashboard.coldStorageWarehousing'),
            desc: t('farmerDashboard.findNabardCertified'),
            tab: 'storage-processing',
            color: 'cyan',
            cta: t('farmerDashboard.findStorage'),
          },
          {
            icon: CloudSun,
            title: t('farmerDashboard.weatherPestRisk'),
            desc: t('farmerDashboard.getHyperlocalWeather'),
            tab: 'weather',
            color: 'blue',
            cta: t('farmerDashboard.viewForecast'),
          },
        ].map(({ icon: Icon, title, desc, tab, color, cta }) => (
          <div
            key={tab}
            className={`bg-black/40 backdrop-blur-xl border border-white/10 hover:border-${color}-500/30 rounded-xl p-5 transition-all group cursor-pointer`}
            onClick={() => setActiveTab(tab)}
          >
            <div className={`w-10 h-10 rounded-xl bg-${color}-600/20 border border-${color}-500/30 flex items-center justify-center mb-4`}>
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
