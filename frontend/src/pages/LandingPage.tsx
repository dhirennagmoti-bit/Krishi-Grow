import React from 'react';
import {
  Sprout, ArrowRight, TrendingUp, Truck, Users, CheckCircle2, Bot, Sparkles,
  ShieldCheck, BarChart3, Factory, Warehouse, Building2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ValueChainFlow } from '../components/ValueChainFlow';
import { LandingElasticFeatures } from '../components/ui/landing-elastic-features';

export const LandingPage: React.FC = () => {
  const { setActiveTab, setIsAuthModalOpen, setIsAIModalOpen } = useApp();

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
    <div className="space-y-12 py-6 px-4 md:px-8 max-w-6xl mx-auto relative z-10 pb-32">
      
      {/* Hero Banner Section */}
      <section className="relative rounded-3xl overflow-hidden bg-black/60 backdrop-blur-2xl text-white border border-white/15 shadow-2xl">
        <div className="p-8 md:p-14 space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            <span>India's Premier Agricultural Value Chain & Sourcing Suite</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Connect Crops to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
              Better Markets & Direct Processing
            </span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-300 max-w-2xl leading-relaxed">
            Empowering Indian cultivators, aggregators, food processors, and wholesalers with end-to-end post-harvest intelligence, transparent mandi analytics, and direct digital supply chains.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-7 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-emerald-950/60 transition-all flex items-center gap-2 group cursor-pointer border border-emerald-500/40"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setActiveTab('solutions')}
              className="px-7 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-2xl border border-white/20 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Solutions</span>
            </button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/10">
            <div>
              <div className="text-2xl md:text-3xl font-black font-mono text-emerald-400">12,500+</div>
              <div className="text-xs text-neutral-400 font-medium mt-0.5">Active Farmers</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-black font-mono text-amber-300">450+</div>
              <div className="text-xs text-neutral-400 font-medium mt-0.5">Verified Buyers & FPCs</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-black font-mono text-cyan-400">₹42 Cr+</div>
              <div className="text-xs text-neutral-400 font-medium mt-0.5">Direct Trade Volume</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-black font-mono text-purple-400">0%</div>
              <div className="text-xs text-neutral-400 font-medium mt-0.5">Intermediary Fees</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Value Chain Flow Component */}
      <section className="rounded-3xl bg-black/60 backdrop-blur-2xl border border-white/15 shadow-2xl overflow-hidden p-6 md:p-8">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
            End-to-End Traceability
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-3">Interactive Agri Value Chain</h2>
          <p className="text-xs text-neutral-400 mt-1">From farm harvesting and quality testing to wholesale dispatch and food processing.</p>
        </div>
        <ValueChainFlow />
      </section>

      {/* Platform Features Grid */}
      <section className="space-y-6 rounded-3xl bg-black/60 backdrop-blur-2xl border border-white/15 shadow-2xl p-6 md:p-8">
        <div className="text-left max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
            Platform Capabilities
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white mt-3">
            Built for Farmers, Processors & Aggregators
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Eliminate post-harvest distress sales with data-backed decisions and direct value chain access.
          </p>
        </div>

        <LandingElasticFeatures />
      </section>

      {/* Dual Value Proposition: Farmer vs Buyer */}
      <section className="bg-black/60 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-white/15 shadow-2xl text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-white/10">
          
          {/* Farmer Column */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/60 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">
              <Sprout className="w-4 h-4 text-emerald-400" /> FOR FARMERS & GROWERS
            </div>
            <h3 className="text-2xl font-bold text-white">Maximize Crop Realization</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Stop suffering from distress sales during peak harvest. Transform raw produce into high-value market channels.
            </p>
            <ul className="space-y-3 pt-2">
              {farmerBenefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-xs text-neutral-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="mt-6 px-6 py-3.5 bg-emerald-600 text-white text-xs font-bold rounded-2xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-950 border border-emerald-500/40 cursor-pointer"
            >
              Register as Farmer
            </button>
          </div>

          {/* Buyer Column */}
          <div className="space-y-4 pt-8 md:pt-0 md:pl-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-950/60 text-purple-300 text-xs font-bold rounded-full border border-purple-500/30">
              <Users className="w-4 h-4 text-purple-400" /> FOR BUYERS & PROCESSORS
            </div>
            <h3 className="text-2xl font-bold text-white">Direct Farm-Gate Procurement</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Source graded agricultural raw materials directly from verified farm clusters with complete quality transparency.
            </p>
            <ul className="space-y-3 pt-2">
              {buyerBenefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-xs text-neutral-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="mt-6 px-6 py-3.5 bg-purple-600 text-white text-xs font-bold rounded-2xl hover:bg-purple-500 transition-all shadow-lg shadow-purple-950 border border-purple-500/40 cursor-pointer"
            >
              Register as Buyer / Supply Chain Partner
            </button>
          </div>
        </div>
      </section>

      {/* Floating AI Callout Banner */}
      <section className="bg-gradient-to-r from-emerald-950/80 via-black/80 to-amber-950/80 backdrop-blur-2xl text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border border-emerald-500/30 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <Bot className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Have questions about your harvest or market prices?</h3>
            <p className="text-xs text-neutral-300 mt-1">
              Ask our AgriAI assistant for instant advice on prices, transport, crop diagnosis, and value addition.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAIModalOpen(true)}
          className="relative z-10 px-6 py-3.5 bg-emerald-600 text-white font-bold text-xs rounded-2xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-950 border border-emerald-500/40 whitespace-nowrap cursor-pointer"
        >
          Chat with AgriAI
        </button>
      </section>
    </div>
  );
};
