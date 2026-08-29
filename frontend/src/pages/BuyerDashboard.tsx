import React from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { AggregatorDashboard } from './aggregator/AggregatorDashboard';
import { ProcessorDashboard } from './processor/ProcessorDashboard';
import { WholesalerDashboard } from './wholesaler/WholesalerDashboard';
import { Users, Factory, Store } from 'lucide-react';
import type { BuyerType } from '../types';

export const BuyerDashboard: React.FC = () => {
  const { user, switchBuyerType } = useApp();
  const { t } = useTranslation();
  const currentBuyerType: BuyerType = user.buyerType || 'AGGREGATOR';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Buyer Sub-Role Switcher Bar with Dark Glass Effect */}
      <div className="p-2 rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/10 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-xl border border-white/10 w-full sm:w-auto">
          <button
            onClick={() => switchBuyerType('AGGREGATOR')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currentBuyerType === 'AGGREGATOR'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{t('buyerDashboard.aggregatorHub')}</span>
          </button>

          <button
            onClick={() => switchBuyerType('PROCESSOR')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currentBuyerType === 'PROCESSOR'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Factory className="w-4 h-4" />
            <span>{t('buyerDashboard.processorPlant')}</span>
          </button>

          <button
            onClick={() => switchBuyerType('WHOLESALER')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currentBuyerType === 'WHOLESALER'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-950'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>{t('buyerDashboard.wholesalerTerminal')}</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 px-3 text-xs text-neutral-400 font-mono">
          <span>{t('buyerDashboard.connectedValueChain')}</span>
          <span className="text-emerald-400 font-bold">{t('buyerDashboard.valueChainFlow')}</span>
        </div>
      </div>

      {/* Render Dynamic Role Workspace */}
      {currentBuyerType === 'AGGREGATOR' && <AggregatorDashboard />}
      {currentBuyerType === 'PROCESSOR' && <ProcessorDashboard />}
      {currentBuyerType === 'WHOLESALER' && <WholesalerDashboard />}

    </div>
  );
};
