import React from 'react';
import {
  Sprout, ArrowRight, TrendingUp, Truck, Users, CheckCircle2, Bot, Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ValueChainFlow } from '../components/ValueChainFlow';
import FoldText from '../components/ui/FoldText';
import { LandingElasticFeatures } from '../components/ui/landing-elastic-features';

export const LandingPage: React.FC = () => {
  const { setActiveTab, setIsAuthModalOpen, setIsAIModalOpen, loginAsDemo } = useApp();

  const farmerBenefits = [
    'Direct access to verified aggregators & bulk processing plants',
    'Dynamic transport rate calculator & reefer truck matcher',
    'Real-time Mandi price intelligence across Maharashtra & India',
    'AI-driven crop processing recommendations (e.g. Puree & Flakes)',
    'Cold storage & WDRA dry warehouse locator with live capacity',
    'Government scheme subsidy checker & 1-click application support'
  ];

  const buyerBenefits = [
    'Direct farm-gate sourcing with verified crop quality grades (A/A+)',
    'Traceable harvest dates, moisture level & GPS farm location',
    'Bulk requirement posting with 90%+ match scoring algorithms',
    'Transparent pricing & zero middleman hidden commission',
    'Scheduled weekly/monthly supply contracts with local farmers'
  ];

  return (
    <div className="space-y-16 py-4 animate-in fade-in duration-500 max-w-7xl mx-auto">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl p-6 md:p-12">
        <div className="relative z-10 max-w-3xl">
          <div className="space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-agri-300 text-xs font-bold shadow-inner">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span><FoldText text="Next-Gen Post-Harvest Agricultural Platform" trigger="scroll" splitBy="word" /></span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
              <FoldText 
                text="Smart Decisions, High Realization, Direct Linkages." 
                trigger="scroll" 
                splitBy="word"
              />
            </h1>

            <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
              <FoldText text="Optimize your harvest with data-backed decisions and connect directly with verified buyers." trigger="scroll" splitBy="word" />
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                }}
                className="px-6 py-3.5 bg-agri-500 hover:bg-agri-400 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-agri-500/30 transition-all flex items-center gap-2 group border border-agri-400/50 cursor-pointer"
              >
                <span><FoldText text="Get Started Now" trigger="scroll" splitBy="word" /></span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => loginAsDemo('FARMER')}
                className="px-5 py-3.5 bg-gradient-to-r from-amber-500/30 to-emerald-500/30 hover:from-amber-500/40 hover:to-emerald-500/40 text-amber-300 hover:text-white font-bold text-sm rounded-xl border border-amber-400/40 backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>⚡ <FoldText text="Try Demo User" trigger="scroll" splitBy="word" /></span>
              </button>

              <button
                onClick={() => setActiveTab('solutions')}
                className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <span><FoldText text="Explore Solutions" trigger="scroll" splitBy="word" /></span>
              </button>
            </div>

            {/* Micro Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
              <div>
                <div className="text-xl md:text-2xl font-bold font-mono text-agri-300"><FoldText text="12,500+" trigger="scroll" /></div>
                <div className="text-[11px] text-gray-300 font-medium"><FoldText text="Registered Farmers" trigger="scroll" splitBy="word" /></div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold font-mono text-amber-300"><FoldText text="450+" trigger="scroll" /></div>
                <div className="text-[11px] text-gray-300 font-medium"><FoldText text="Verified Buyers" trigger="scroll" splitBy="word" /></div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold font-mono text-emerald-300"><FoldText text="₹42 Cr+" trigger="scroll" splitBy="word" /></div>
                <div className="text-[11px] text-gray-300 font-medium"><FoldText text="Trade Facilitated" trigger="scroll" splitBy="word" /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Value Chain Flow Component */}
      <section className="rounded-3xl bg-black/20 backdrop-blur-md border border-white/10 shadow-2xl overflow-hidden p-2">
        <ValueChainFlow />
      </section>

      {/* Platform Features Grid */}
      <section className="space-y-8 rounded-3xl bg-black/20 backdrop-blur-md border border-white/10 shadow-2xl p-6 md:p-8">
        <div className="text-left max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-agri-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">
            <FoldText text="Comprehensive Suite" trigger="scroll" splitBy="word" />
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-4">
            <FoldText text="Built for Farmers, Processors & Aggregators" trigger="scroll" splitBy="word" />
          </h2>
          <p className="text-sm text-gray-300 mt-2">
            <FoldText text="Eliminate post-harvest distress sales with data-backed decisions and direct value chain access." trigger="scroll" splitBy="word" />
          </p>
        </div>

        <LandingElasticFeatures />
      </section>

      {/* Dual Value Proposition: Farmer vs Buyer */}
      <section className="bg-black/20 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl space-y-8 text-white">
        <div className="flex flex-col gap-12 divide-y divide-white/10">
          
          {/* Farmer Column */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-agri-300 text-xs font-bold rounded-full border border-white/10">
              <Sprout className="w-4 h-4 text-agri-400" /> <FoldText text="FOR FARMERS" trigger="scroll" splitBy="word" />
            </div>
            <h3 className="text-2xl font-bold text-white"><FoldText text="Maximize Crop Realization" trigger="scroll" splitBy="word" /></h3>
            <p className="text-sm text-gray-300">
              <FoldText text="Stop suffering from distress sales during peak harvest. Transform raw produce into high-value market channels." trigger="scroll" splitBy="word" />
            </p>
            <ul className="space-y-3 pt-2">
              {farmerBenefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-200 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-agri-400 shrink-0 mt-0.5" />
                  <span><FoldText text={b} trigger="scroll" splitBy="word" /></span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="mt-6 px-6 py-3 bg-agri-500 text-white text-sm font-bold rounded-xl hover:bg-agri-400 transition-colors shadow-lg border border-agri-400/50"
            >
              <FoldText text="Register as Farmer" trigger="scroll" splitBy="word" />
            </button>
          </div>

          {/* Buyer Column */}
          <div className="space-y-4 pt-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-purple-300 text-xs font-bold rounded-full border border-white/10">
              <Users className="w-4 h-4 text-purple-400" /> <FoldText text="FOR BUYERS & PROCESSORS" trigger="scroll" splitBy="word" />
            </div>
            <h3 className="text-2xl font-bold text-white"><FoldText text="Direct Farm-Gate Procurement" trigger="scroll" splitBy="word" /></h3>
            <p className="text-sm text-gray-300">
              <FoldText text="Source graded agricultural raw materials directly from verified farm clusters with complete quality transparency." trigger="scroll" splitBy="word" />
            </p>
            <ul className="space-y-3 pt-2">
              {buyerBenefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-200 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <span><FoldText text={b} trigger="scroll" splitBy="word" /></span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="mt-6 px-6 py-3 bg-white/20 backdrop-blur-md text-white text-sm font-bold rounded-xl hover:bg-white/30 transition-colors shadow-lg border border-white/20"
            >
              <FoldText text="Register as Buyer" trigger="scroll" splitBy="word" />
            </button>
          </div>
        </div>
      </section>

      {/* Floating AI Callout Banner */}
      <section className="bg-black/30 backdrop-blur-xl text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border border-amber-500/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-transparent to-agri-500/20 pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Bot className="w-8 h-8 text-amber-300" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white"><FoldText text="Have questions about your harvest?" trigger="scroll" splitBy="word" /></h3>
            <p className="text-xs text-gray-300 mt-1">
              <FoldText text="Ask AgriAI assistant for instant advice on prices, transport, and disease treatment plans." trigger="scroll" splitBy="word" />
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAIModalOpen(true)}
          className="relative z-10 px-6 py-3 bg-amber-500/80 backdrop-blur-md text-white font-bold text-xs rounded-xl hover:bg-amber-400 transition-colors shadow-lg border border-amber-400/50 whitespace-nowrap"
        >
          <FoldText text="Chat with AgriAI" trigger="scroll" splitBy="word" />
        </button>
      </section>
    </div>
  );
};
