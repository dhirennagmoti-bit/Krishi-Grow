import React from 'react';
import {
  CloudSun, Warehouse, FileText, Factory, Bot, ArrowRight, ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

export const SolutionsHub: React.FC = () => {
  const { setActiveTab } = useApp();
  const { t } = useTranslation();

  const solutions = [
    {
      id: 'weather',
      title: t('solutions.weather.title'),
      icon: CloudSun,
      color: 'bg-blue-500',
      desc: t('solutions.weather.desc')
    },
    {
      id: 'storage-processing',
      title: t('solutions.storage.title'),
      icon: Warehouse,
      color: 'bg-indigo-500',
      desc: t('solutions.storage.desc')
    },
    {
      id: 'schemes',
      title: t('solutions.schemes.title'),
      icon: FileText,
      color: 'bg-purple-500',
      desc: t('solutions.schemes.desc')
    },
    {
      id: 'products',
      title: t('solutions.products.title'),
      icon: Factory,
      color: 'bg-amber-500',
      desc: t('solutions.products.desc')
    },
    {
      id: 'ai-assistant',
      title: t('solutions.ai.title'),
      icon: Bot,
      color: 'bg-agri-600',
      desc: t('solutions.ai.desc')
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-black/60 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
            <ShieldAlert className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">{t('solutions.title')}</h2>
            <p className="text-sm text-neutral-400 mt-1">{t('solutions.subtitle')}</p>
          </div>
        </div>
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
                <span className="uppercase tracking-widest">{t('solutions.launchTool')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
