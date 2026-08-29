import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sprout, CheckCircle2, ArrowRight, ArrowLeft, MapPin, TrendingUp, Truck, ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { QualityGrade, QuantityUnit } from '../types';
import { initialMandiPrices } from '../data/mockData';
import { calculateTransportCost } from '../services/api';
import { CropGridSelector } from '../components/CropGridSelector';
import { getCropImage, CROP_CATALOG } from '../data/cropCatalog';

export const AddCropPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, addCrop, setActiveTab, requireAuth } = useApp();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showAllCrops, setShowAllCrops] = useState(false);

  // Form State
  const [cropName, setCropName] = useState('Tomato');
  const [category] = useState('Vegetables');
  const [variety, setVariety] = useState('Abhinav Hybrid (Red)');
  const [quantity, setQuantity] = useState('1'); // Default to 1 Tonne for calculations
  const [unit, setUnit] = useState<QuantityUnit>('tonne');
  const [grade, setGrade] = useState<QualityGrade>('A');
  const [shelfLifeDays, setShelfLifeDays] = useState('14');
  const [district, setDistrict] = useState(user.district || 'Nashik');
  const [village, setVillage] = useState(user.village || 'Palkhed');

  const cropList = [
    { name: 'Tomato', emoji: '🍅' },
    { name: 'Red Onion', emoji: '🧅' },
    { name: 'Cotton', emoji: '☁️' },
    { name: 'Soybean', emoji: '🌱' },
    { name: 'Wheat', emoji: '🌾' },
    { name: 'Rice / Paddy', emoji: '🌾' },
    { name: 'Maize / Corn', emoji: '🌽' },
    { name: 'Sugarcane', emoji: '🎋' },
    { name: 'Potato', emoji: '🥔' },
    { name: 'Garlic', emoji: '🧄' },
    { name: 'Chilli', emoji: '🌶️' },
    { name: 'Turmeric', emoji: '🟡' },
    { name: 'Ginger', emoji: '🫚' },
    { name: 'Banana', emoji: '🍌' },
    { name: 'Mango', emoji: '🥭' },
    { name: 'Grapes', emoji: '🍇' },
    { name: 'Pomegranate', emoji: '🍎' },
    { name: 'Lemon', emoji: '🍋' },
    { name: 'Groundnut', emoji: '🥜' },
    { name: 'Mustard', emoji: '🌼' },
    { name: 'Chickpea', emoji: '🧆' },
    { name: 'Pigeon Pea', emoji: '🥣' },
    { name: 'Cabbage', emoji: '🥬' },
    { name: 'Cauliflower', emoji: '🥦' },
    { name: 'Brinjal', emoji: '🍆' }
  ];

  const cropVarieties: Record<string, string[]> = {
    'Tomato': ['Abhinav Hybrid (Red)', 'Vaishali', 'Pusa Ruby', 'Arka Saurabh'],
    'Red Onion': ['Nashik Red F1', 'Pusa Red', 'N-53', 'Bhima Super'],
    'Cotton': ['BT Cotton II Long Staple', 'MCU-5', 'DCH-32', 'Suvin'],
    'Soybean': ['JS 335', 'MAUS 71', 'NRC 37', 'MACS 1188'],
    'Wheat': ['Lok-1', 'Sonalika', 'Kalyansona', 'Sujata'],
    'Rice / Paddy': ['Basmati', 'Indrayani', 'Wada Kolam', 'IR64'],
    'Maize / Corn': ['Ganga 11', 'Deccan 103', 'African Tall', 'Prakash'],
    'Sugarcane': ['Co 86032', 'Co 0238', 'CoC 671', 'Co 92005'],
    'Potato': ['Kufri Jyoti', 'Kufri Sindhuri', 'Kufri Chandramukhi', 'Kufri Pukhraj'],
    'Garlic': ['Yamuna Safed', 'Agrifound White', 'G-282', 'Godavari'],
    'Chilli': ['Guntur Sannam', 'Byadagi', 'Pusa Jwala', 'Kashmiri'],
    'Turmeric': ['Pragati', 'Salem', 'Rajapuri', 'Waigaon'],
    'Ginger': ['Mahim', 'Rio de Janeiro', 'Maran', 'Himachal'],
    'Banana': ['Grand Naine', 'Robusta', 'Bhusawal', 'Red Banana'],
    'Mango': ['Alphonso (Hapus)', 'Kesar', 'Dasheri', 'Totapuri'],
    'Grapes': ['Thompson Seedless', 'Sharad Seedless', 'Tas-A-Ganesh', 'Sonaka'],
    'Pomegranate': ['Bhagawa', 'Ganesh', 'Mridula', 'Ruby'],
    'Lemon': ['Kagzi', 'Pramalini', 'Vikram', 'Chakradhar'],
    'Groundnut': ['TAG 24', 'SB 11', 'Phule Pragati', 'TG 37A'],
    'Mustard': ['Pusa Jaikisan', 'Varuna', 'Kranti', 'Rohini'],
    'Chickpea': ['Vishal', 'Vijay', 'Digvijay', 'JAKI 9218'],
    'Pigeon Pea': ['Maruti', 'Asha', 'Vipula', 'BDN 711'],
    'Cabbage': ['Golden Acre', 'Pride of India', 'Pusa Mukta', 'Pusa Drumhead'],
    'Cauliflower': ['Pusa Snowball', 'Pusa Deepali', 'Pusa Synthetic', 'Pant Shubhra'],
    'Brinjal': ['Pusa Purple Long', 'Pusa Kranti', 'Arka Navneet', 'Panchaganga']
  };

  useEffect(() => {
    const varieties = cropVarieties[cropName] || ['Standard', 'Hybrid', 'Local/Desi'];
    if (!varieties.includes(variety)) {
      setVariety(varieties[0]);
    }
  }, [cropName]);

  const handleSave = () => {
    requireAuth(() => {
      addCrop({
        farmerId: user.id || 'usr_farmer',
        farmerName: user.name || 'Farmer',
        name: cropName,
        category,
        variety,
        quantity: parseFloat(quantity) || 1,
        unit,
        grade,
        moisturePercent: 10,
        damagePercent: 2,
        isOrganic: true,
        harvestDate: new Date().toISOString().split('T')[0],
        estimatedShelfLifeDays: parseInt(shelfLifeDays) || 14,
        storageCondition: 'Ambient Shade',
        location: {
          state: 'Maharashtra',
          district,
          village,
          lat: 20.201,
          lng: 73.832
        },
        imageUrl: getCropImage(cropName)
      });

      setActiveTab('farmer-dashboard');
    });
  };

  const wizardSteps = [
    t('addCrop.step1', 'Choose Crop'), 
    t('addCrop.step2', 'Choose Variety'), 
    t('addCrop.step3', 'Choose Grade'), 
    t('addCrop.step4', 'Choose Shelf Life'), 
    t('addCrop.step5', 'Where to Sell')
  ];

  // Algorithmic Recommendation Calculation
  const recommendedMarkets = useMemo(() => {
    if (currentStep !== 5) return [];

    // Find all markets for this crop, or fallback to all markets if crop is not in initial data
    let markets = initialMandiPrices.filter(m => m.crop === cropName);
    if (markets.length === 0) {
      // Generate some dummy markets for the selected crop based on Tomato markets
      markets = initialMandiPrices.filter(m => m.crop === 'Tomato').map(m => ({
        ...m,
        id: m.id + '-dummy',
        crop: cropName,
        price: (m.price || m.modalPrice) * (Math.random() * (1.5 - 0.5) + 0.5) // Randomize price a bit
      }));
    }

    const gradeMultipliers: Record<QualityGrade, number> = {
      'A+': 1.2,
      'A': 1.0,
      'B': 0.8,
      'C': 0.6,
      'Export': 1.35,
      'Rejected': 0.3
    };

    const results = markets.map(market => {
      const currentPrice = market.price || market.modalPrice;
      const transportCalc = calculateTransportCost(cropName, parseFloat(quantity) || 1, district, market.district, 'PICKUP_1T');
      const grossRevenue = currentPrice * 10 * gradeMultipliers[grade]; // 10 quintals per tonne
      const netProfit = grossRevenue - transportCalc.totalCost;

      // Penalize far markets if shelf life is very low
      const isHighRisk = parseInt(shelfLifeDays) <= 3 && transportCalc.travelTimeHours > 10;

      return {
        ...market,
        grossRevenue,
        transportCost: transportCalc.totalCost,
        distanceKm: transportCalc.distanceKm,
        netProfit,
        isHighRisk
      };
    });

    return results.sort((a, b) => b.netProfit - a.netProfit).slice(0, 3);
  }, [currentStep, cropName, district, grade, shelfLifeDays]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Wizard Header */}
      <div className="bg-black/60 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/5 text-white flex items-center justify-center font-bold">
            <Sprout className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-medium tracking-tight text-white">{t('addCrop.title')}</h2>
            <p className="text-sm text-neutral-400 mt-1 font-light">
              Step {currentStep} of 5 — {wizardSteps[currentStep - 1]}
            </p>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="mt-8 grid grid-cols-5 gap-2">
          {wizardSteps.map((s, idx) => (
            <div key={idx} className="space-y-1.5">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  currentStep > idx ? 'bg-emerald-500' : currentStep === idx + 1 ? 'bg-emerald-400/50' : 'bg-white/10'
                }`}
              />
              <span className={`text-[10px] font-semibold block truncate ${currentStep === idx + 1 ? 'text-white' : 'text-neutral-500'}`}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content Card */}
      <div className="bg-black/60 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/5 shadow-sm space-y-8">
        
        {/* Step 1: Crop Selection */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-white">Step 1 — {t('addCrop.step1', 'Select Crop')}</h3>
            <CropGridSelector
              selectedCrop={cropName}
              onSelectCrop={(name) => setCropName(name)}
            />
          </div>
        )}

        {/* Step 2: Variety */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-white">Step 2 — {t('addCrop.step2', 'Crop Variety')}</h3>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">{t('addCrop.variety', 'Select Known Variety')}</label>
              <select
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-black/50 border border-white/10 text-white rounded-xl focus:border-emerald-500/50 outline-none transition-all appearance-none"
              >
                {(cropVarieties[cropName] || ['Standard', 'Hybrid', 'Local/Desi']).map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Quality & Grade */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-white">Step 3 — {t('addCrop.step3', 'Choose Grade')}</h3>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-3">{t('addCrop.grade', 'Quality Grade')}</label>
              <div className="flex gap-4">
                {(['A+', 'A', 'B', 'C'] as QualityGrade[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGrade(g)}
                    className={`flex-1 py-4 text-sm font-medium rounded-2xl border transition-all ${
                      grade === g ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 scale-105 shadow-sm' : 'border-white/10 text-neutral-400 hover:border-white/30 hover:bg-white/5'
                    }`}
                  >
                    Grade {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Shelf Life */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-white">Step 4 — {t('addCrop.step4', 'Choose Shelf Life')}</h3>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">{t('addCrop.estimatedShelfLife', 'Estimated Shelf Life (Days Remaining)')}</label>
              <input
                type="number"
                value={shelfLifeDays}
                onChange={(e) => setShelfLifeDays(e.target.value)}
                className="w-full max-w-sm px-4 py-3 text-sm border border-white/10 bg-black/50 text-white rounded-xl focus:border-emerald-500/50 outline-none font-mono transition-all"
              />
              <p className="text-xs text-neutral-500 mt-2 font-light">
                We use this to prevent recommending markets that are too far away for highly perishable crops.
              </p>
            </div>
          </div>
        )}

        {/* Step 5: Where to Sell Results */}
        {currentStep === 5 && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-medium tracking-tight text-white">Step 5 — {t('addCrop.step5', 'Where to Sell')}</h3>
                <p className="text-sm text-neutral-400 mt-1 font-light">Based on {district} location, 1 Tonne load, {cropName} (Grade {grade}).</p>
              </div>
            </div>

            <div className="space-y-5">
              {recommendedMarkets.map((market, idx) => (
                <div key={market.id} className={`p-6 rounded-2xl border relative overflow-hidden transition-all ${idx === 0 ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/5 bg-black/60 backdrop-blur-xl'}`}>
                  {idx === 0 && (
                    <div className="absolute top-0 right-0 bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold px-4 py-1.5 rounded-bl-xl border-l border-b border-emerald-500/20 uppercase tracking-widest">
                      BEST MATCH
                    </div>
                  )}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-medium text-white">{market.marketName}</h4>
                        {market.isHighRisk && (
                          <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">High Risk (Shelf Life)</span>
                        )}
                      </div>
                      <div className="text-sm text-neutral-400 flex items-center gap-1.5 font-light">
                        <MapPin className="w-4 h-4 text-emerald-500" /> {market.district} APMC ({market.distanceKm} km away)
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">Est. Revenue</p>
                        <p className="font-mono text-base font-medium text-white">₹{Math.round(market.grossRevenue).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">Transport Cost</p>
                        <p className="font-mono text-base font-medium text-red-400">-₹{Math.round(market.transportCost).toLocaleString()}</p>
                      </div>
                      <div className="text-right bg-black/50 px-4 py-3 rounded-xl border border-white/5 min-w-[120px]">
                        <p className="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest">Net Profit / Tonne</p>
                        <p className="font-mono text-xl font-medium text-white">₹{Math.round(market.netProfit).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-5 py-2.5 bg-white/5 text-white text-sm font-medium rounded-xl hover:bg-white/10 flex items-center gap-2 transition-colors border border-white/10"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl shadow-sm flex items-center gap-2 transition-colors"
            >
              <span>Next Step</span> <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              className="px-8 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl shadow-sm flex items-center gap-2 transition-colors"
            >
              <span>{t('addCrop.submit', 'Save Crop Record')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
