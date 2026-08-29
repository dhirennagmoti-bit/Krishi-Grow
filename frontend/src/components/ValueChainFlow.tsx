import React, { useState } from 'react';
import { Sprout, Warehouse, Factory, Truck, Store, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const ValueChainFlow: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      id: 0,
      title: 'Farm Harvest',
      subtitle: 'Smart Inventory & Grading',
      icon: Sprout,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-300',
      badge: 'Step 1',
      desc: 'Farmers log harvest quantity, quality grade (A+), moisture %, and estimated shelf life using GPS verification.',
      metrics: { 'Avg Crop Yield': '15 Tonnes', 'Grade Quality': 'A Grade (88% Brix)', 'Shelf Life': '14 Days' }
    },
    {
      id: 1,
      title: 'Storage & Cold Hub',
      subtitle: 'Preservation & Humidity',
      icon: Warehouse,
      color: 'bg-blue-500',
      textColor: 'text-blue-300',
      badge: 'Step 2',
      desc: 'Smart cold chain & WDRA dry storage hubs matched by proximity to prevent post-harvest loss.',
      metrics: { 'Nearby Facilities': '3 Warehouses', 'Storage Rate': '₹45 / Ton / Day', 'Spoilage Reduction': '92%' }
    },
    {
      id: 2,
      title: 'Processing Plant',
      subtitle: 'Value-Add Manufacturing',
      icon: Factory,
      color: 'bg-amber-500',
      textColor: 'text-amber-300',
      badge: 'Step 3',
      desc: 'AI recommends high-margin conversion (e.g., Fresh Tomato ➔ Puree & Ketchup) to double farmer profits.',
      metrics: { 'Value Multiplication': '2.4x Margin', 'Product': 'Tomato Puree', 'Shelf Extension': '350 Days' }
    },
    {
      id: 3,
      title: 'Logistics & Transport',
      subtitle: 'Dynamic Rate Calculation',
      icon: Truck,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-300',
      badge: 'Step 4',
      desc: 'Instant transport matching from 1T pickups to 24T container reefer trucks with clear toll & cost breakdowns.',
      metrics: { 'Transport Cost': '₹1.18 / kg', 'Transit Time': '4.5 Hours', 'Vehicle Matched': '10T Truck' }
    },
    {
      id: 4,
      title: 'Market & Buyer Deal',
      subtitle: 'Direct Farmer Connection',
      icon: Store,
      color: 'bg-blue-500',
      textColor: 'text-blue-300',
      badge: 'Step 5',
      desc: 'Direct match with verified Aggregators, Processors, and Wholesalers with transparent Mandi pricing.',
      metrics: { 'Match Score': '96% Match', 'Buyer Type': 'Aggregator', 'Payout Time': 'Instant UPI' }
    }
  ];

  return (
    <div className="w-full bg-transparent p-4 md:p-6">
      <div className="flex flex-col gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md text-agri-300 border border-white/20 text-xs font-semibold rounded-full mb-3">
            <Zap className="w-3.5 h-3.5" /> Interactive Supply Chain Flow
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white">
            End-to-End Agricultural Value Chain
          </h3>
          <p className="text-sm text-gray-300 mt-2">
            Click on any stage below to explore how Krishi Grow optimizes crop journey from field to buyer.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <span className="text-xs font-medium text-gray-400">Flow Speed:</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-md border border-emerald-500/30 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Real-time Sync
          </span>
        </div>
      </div>

      {/* Nodes visual flow pipeline */}
      <div className="relative overflow-x-auto pt-4 pb-6 scrollbar-hide">
        <div className="min-w-[600px] flex items-center justify-between relative px-4">
          
          {/* Animated Connecting Line */}
          <div className="absolute top-1/2 left-8 right-8 h-1 bg-white/10 -translate-y-1/2 z-0 rounded-full">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-blue-500 transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;
            const isCompleted = activeStep > idx;

            return (
               <button
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className="relative z-10 flex flex-col items-center group focus:outline-none"
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 transform backdrop-blur-md ${
                    isActive
                      ? `${step.color} text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-110 ring-2 ring-offset-2 ring-offset-black/50 ring-white/50`
                      : isCompleted
                      ? 'bg-agri-600/80 text-white shadow-md border border-agri-400/50'
                      : 'bg-black/40 border-2 border-white/20 text-gray-400 group-hover:border-white/50 group-hover:text-white'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-xs font-semibold mt-4 transition-colors ${isActive ? 'text-white font-bold' : 'text-gray-400 group-hover:text-gray-300'}`}>
                  {step.title}
                </span>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{step.badge}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Node Details Card */}
      <motion.div
        key={activeStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-2 bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 flex flex-col gap-6 shadow-md"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${steps[activeStep].textColor} bg-black/40 border border-white/10 whitespace-nowrap`}>
              {steps[activeStep].subtitle}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1.5 font-mono whitespace-nowrap">
              <ShieldCheck className="w-3.5 h-3.5 text-agri-400" /> Verified Data Node
            </span>
          </div>

          <div>
            <h4 className="text-xl font-bold text-white mb-2">
              {steps[activeStep].title} Stage Optimization
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed max-w-lg">
              {steps[activeStep].desc}
            </p>
          </div>
        </div>

        {/* Dynamic Node Metrics */}
        <div className="w-full bg-black/30 p-5 rounded-xl border border-white/10 shadow-inner">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            Live Node Telemetry
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {Object.entries(steps[activeStep].metrics).map(([key, val]) => (
              <div key={key} className="flex flex-col gap-1 border-b sm:border-b-0 sm:border-r border-white/10 last:border-0 pb-3 sm:pb-0">
                <span className="text-xs text-gray-400">{key}</span>
                <span className="font-semibold font-mono text-white text-sm">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
