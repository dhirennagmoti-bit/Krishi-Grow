import React from 'react';
import {
  CloudSun, Warehouse, FileText, Factory, Bot, ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SolutionsHub: React.FC = () => {
  const { setActiveTab } = useApp();

  const solutions = [
    {
      id: 'weather',
      title: '1. Weather & Crop Risk Advisory',
      icon: CloudSun,
      color: 'bg-blue-500',
      desc: '7-day micro-weather forecast with crop-specific sensitivity warnings (rain risk, fungal blight alert).'
    },
    {
      id: 'storage-processing',
      title: '2. Cold Storage & Processing Locator',
      icon: Warehouse,
      color: 'bg-indigo-500',
      desc: 'Find verified cold storages, WDRA dry godowns, and processing plants across Maharashtra with live capacity.'
    },
    {
      id: 'schemes',
      title: '3. Government Schemes & Subsidies',
      icon: FileText,
      color: 'bg-purple-500',
      desc: 'Search AIF, PMFME, MIDH schemes, check subsidy eligibility, calculate benefits, and download document lists.'
    },
    {
      id: 'products',
      title: '4. Best Products to Manufacture',
      icon: Factory,
      color: 'bg-amber-500',
      desc: 'AI recommendation engine converts raw harvest into high-margin products (e.g. Tomato Puree, Dehydrated Onion Flakes).'
    },
    {
      id: 'ai-assistant',
      title: '5. AgriAI Agricultural Assistant',
      icon: Bot,
      color: 'bg-agri-600',
      desc: 'Real-time intelligent advisor for price predictions, market strategies, and instant disease diagnosis.'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-black/60 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-sm">
        <h2 className="text-2xl font-medium tracking-tight text-white">Solutions Suite</h2>
        <p className="text-sm text-neutral-400 mt-1 font-light">
          Five practical tools designed to maximize agricultural profitability and streamline value-chain logistics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {solutions.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.id}
              onClick={() => setActiveTab(s.id)}
              className="bg-black/60 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-sm hover:border-white/10 hover:bg-white/5 transition-all cursor-pointer space-y-6 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-2xl ${s.color} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-medium text-white group-hover:text-emerald-400 transition-colors">
                  {s.title}
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed font-light">
                  {s.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-emerald-400">
                <span className="uppercase tracking-widest">Launch Tool</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
