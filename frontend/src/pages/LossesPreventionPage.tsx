import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, Bug, CloudRain, PackageOpen, ThermometerSun, MapPin, AlertTriangle, Info, Sprout, Wind, Droplet, MoveDown, ArrowRight, ShieldCheck } from 'lucide-react';
import { KrishiRakshakModule } from '../components/KrishiRakshakModule';

export const LossesPreventionPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'PRE_HARVEST' | 'POST_HARVEST' | 'PESTICIDES'>('PESTICIDES');

  const preHarvestData = [
    {
      category: 'Biotic Factors (Pests, Diseases & Weeds)',
      icon: Bug,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      items: [
        {
          title: 'Insect Pest Outbreaks',
          description: 'Chewing insects (caterpillars, borers) destroy foliage and fruit, while sucking pests (aphids, thrips, whiteflies) transmit debilitating plant viruses.',
          prevention: [
            'Monitoring: Install 4–6 pheromone traps or yellow/blue sticky traps per acre for early detection.',
            'Biological Control: Release parasitoids (e.g., Trichogramma) or apply bio-pesticides (Bacillus thuringiensis, Beauveria bassiana, or cold-pressed Neem oil at 10,000 ppm) before reaching the Economic Injury Level (EIL).'
          ]
        },
        {
          title: 'Fungal & Bacterial Diseases',
          description: 'Root rots, downy/powdery mildews, and bacterial wilts reduce photosynthetic capacity or kill the plant entirely.',
          prevention: [
            'Seed treatment with bio-fungicides like Trichoderma viride (5–10 g/kg seed).',
            'Crop rotation with non-host crops.',
            'Maintaining field drainage to prevent waterlogging.'
          ]
        },
        {
          title: 'Weed Competition',
          description: 'Weeds compete aggressively for nitrogen, sunlight, and moisture, often reducing yields by 20–40%.',
          prevention: [
            'Pre-emergence mulching (organic straw or 25-micron UV-stabilized plastic mulch).',
            'Stale seedbed techniques.',
            'Timely inter-cultivation during the critical first 30–45 days of crop growth.'
          ]
        }
      ]
    },
    {
      category: 'Abiotic Factors (Climate & Soil Stress)',
      icon: ThermometerSun,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      items: [
        {
          title: 'Water Stress (Drought & Waterlogging)',
          description: 'Erratic rainfall leads to blossom-end rot, fruit drop, and poor seed set.',
          prevention: [
            'Install drip irrigation systems with fertigation capability.',
            'Apply anti-transpirants or kaolin clay sprays during heatwaves.'
          ]
        },
        {
          title: 'Nutrient Imbalances',
          description: 'Over-reliance on Nitrogen makes plants vegetative and pest-prone, while micro-nutrient deficiencies (Boron, Zinc, Calcium) cause fruit cracking and malformation.',
          prevention: [
            'Soil testing prior to planting.',
            'Basal organic manuring (FYM/vermicompost).',
            'Targeted foliar sprays of chelated micronutrients.'
          ]
        }
      ]
    },
    {
      category: 'Agronomic & Mechanical Vulnerabilities',
      icon: Sprout,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      items: [
        {
          title: 'Poor Quality Seed Stock',
          description: 'Low germination and non-uniform growth.',
          prevention: [
            'Always purchase certified, disease-resistant hybrid/OPV varieties from authorized seed distributors.'
          ]
        },
        {
          title: 'Lodging (Crops Falling Over)',
          description: 'High winds and over-irrigation cause tall crops (wheat, maize, sugarcane) to collapse.',
          prevention: [
            'Balanced Potassium fertilization (strengthens stalks).',
            'Earthing-up operations.',
            'Avoiding late-stage flood irrigation during windy forecasts.'
          ]
        }
      ]
    }
  ];

  const postHarvestCauses = [
    {
      title: 'Mechanical Damage',
      desc: 'Cuts, punctures, abrasions, internal crushing, compression damage from overfilling, and transit vibration.'
    },
    {
      title: 'Biological & Microbiological',
      desc: 'Direct feeding by pests/rodents. Infection by bacterial soft rots and fungal molds (Aspergillus flavus).'
    },
    {
      title: 'Physiological & Biochemical',
      desc: 'Respiration (natural breakdown), Transpiration (water loss/wilting), Ethylene Production (rapid ripening).'
    },
    {
      title: 'Environmental & Infrastructural',
      desc: 'High ambient temps, improper humidity, lack of cold chains, and insufficient primary processing.'
    }
  ];

  const postHarvestPrevention = [
    {
      category: 'Pre-Harvest & Harvesting Management',
      points: [
        'Optimal Maturity Index: Harvest crops at the correct physiological stage tailored for storage duration or transport distances.',
        'Cool-Hour Harvesting: Schedule harvesting during early morning or late evening hours to minimize field heat absorption.',
        'Proper Harvesting Tools: Use sharp clippers and sanitized cutting tools rather than manual pulling or plant-shaking to prevent lesions.'
      ]
    },
    {
      category: 'Primary Post-Harvest Operations',
      points: [
        'Rapid Pre-Cooling: Strip latent field heat immediately using hydro-cooling, room cooling, or forced-air cooling.',
        'Curing: Subject root and tuber crops (potatoes, onions, sweet potatoes) to controlled heat and humidity to thicken skins and heal wounds.',
        'Cleaning & Sorting: Wash with sanitized water and cull diseased or mechanically damaged produce before storage.'
      ]
    },
    {
      category: 'Controlled Storage Technologies',
      points: [
        'Hermetic Grain Storage: Use sealed, airtight containers or multilayer bags (e.g., PICS bags) where pest respiration consumes available oxygen and elevates carbon dioxide, suffocating insects naturally.',
        'Cold Storage & CA/MA: Maintain commodity-specific optimal temperatures, humidity, and atmospheric gas ratios (Controlled or Modified Atmosphere storage).',
        'Moisture Management: Ensure cereal grains and pulses are dried below 12–14% moisture content before long-term warehousing.'
      ]
    },
    {
      category: 'Packaging, Logistics & Value Addition',
      points: [
        'Protective Packaging: Replace gunny sacks with ventilated plastic crates or corrugated fiberboard (CFB) boxes to minimize impact and compression injuries.',
        'Refrigerated Logistics: Maintain unbroken cold chains from farm collection centers to retail markets.',
        'Secondary Processing: Convert seasonal gluts and grade-B produce into shelf-stable value-added products like pastes, purees, dehydrated slices, jams, and pickles.'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-black/60 backdrop-blur-xl p-8 rounded-xl border border-white/5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/5 text-white flex items-center justify-center font-bold shadow-inner">
              <ShieldAlert className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-3xl font-medium tracking-tight text-white">{t('lossesPrevention.title')}</h2>
              <p className="text-sm text-neutral-400 mt-2 font-normal max-w-2xl">
                {t('lossesPrevention.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Custom Tab Navigation */}
        <div className="flex gap-4 mt-8 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: 'PESTICIDES', label: t('lossesPrevention.krishiRakshak'), icon: ShieldAlert },
            { id: 'PRE_HARVEST', label: t('lossesPrevention.preHarvest'), icon: CloudRain },
            { id: 'POST_HARVEST', label: t('lossesPrevention.postHarvest'), icon: PackageOpen }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap border ${
                activeTab === tab.id
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-sm'
                  : 'bg-white/5 border-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-8">
        
        {/* PRE-HARVEST TAB */}
        {activeTab === 'PRE_HARVEST' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div 
              className="bg-white/5 rounded-xl p-6 border border-white/5 text-sm text-neutral-300 font-normal"
              dangerouslySetInnerHTML={{ __html: t('lossesPrevention.preHarvestDesc') }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {preHarvestData.map((category, idx) => (
                <div key={idx} className="bg-black/60 backdrop-blur-xl rounded-xl border border-white/5 p-8 space-y-6 shadow-sm hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                    <div className={`w-12 h-12 rounded-xl ${category.bg} ${category.border} border flex items-center justify-center shrink-0`}>
                      <category.icon className={`w-6 h-6 ${category.color}`} />
                    </div>
                    <h3 className="text-xl font-medium text-white leading-tight">{category.category}</h3>
                  </div>

                  <div className="space-y-8">
                    {category.items.map((item, iIdx) => (
                      <div key={iIdx} className="space-y-3">
                        <h4 className={`text-sm font-semibold tracking-wide uppercase ${category.color}`}>
                          {item.title}
                        </h4>
                        <p className="text-sm text-neutral-400 font-normal leading-relaxed">
                          {item.description}
                        </p>
                        <div className="bg-white/5 rounded-xl p-5 border border-white/5 space-y-3">
                          <div className="flex items-center gap-2 mb-1">
                            <ShieldAlert className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-medium text-white uppercase tracking-widest">Prevention</span>
                          </div>
                          <ul className="space-y-2">
                            {item.prevention.map((prev, pIdx) => (
                              <li key={pIdx} className="text-sm text-neutral-300 font-normal flex items-start gap-2">
                                <span className="text-emerald-500 mt-1 flex-shrink-0">•</span>
                                <span>{prev}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* POST-HARVEST TAB */}
        {activeTab === 'POST_HARVEST' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div 
              className="bg-white/5 rounded-xl p-6 border border-white/5 text-sm text-neutral-300 font-normal"
              dangerouslySetInnerHTML={{ __html: t('lossesPrevention.postHarvestDesc') }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Types of Losses Summary Table */}
              <div className="lg:col-span-8 bg-black/60 backdrop-blur-xl rounded-xl border border-white/5 p-8 shadow-sm">
                <h3 className="text-xl font-medium text-white mb-6">{t('lossesPrevention.typesOfPostHarvest')}</h3>
                <div className="overflow-x-auto rounded-xl border border-white/5">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-neutral-400 font-medium text-xs border-b border-white/5">
                      <tr>
                        <th className="py-4 px-6 uppercase tracking-wider">{t('lossesPrevention.category')}</th>
                        <th className="py-4 px-6 uppercase tracking-wider">{t('lossesPrevention.definition')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-neutral-300">
                      {[
                        { name: 'Quantitative loss', desc: 'A direct physical reduction in measurable weight, volume, or raw bulk yield. Prevent physical loss through careful handling, storage and pest control.' },
                        { name: 'Qualitative loss', desc: 'Deterioration in sensory or physical attributes (appearance, shape, color, texture). Protect appearance, flavor and overall market quality.' },
                        { name: 'Nutritional loss', desc: 'A decline in essential dietary components (vitamins, minerals). Reduce exposure to heat, moisture and biological damage.' },
                        { name: 'Economic loss', desc: 'A decline in market value forcing severe discounting or distress sales. Maintain quality standards and add value to lower-grade produce.' },
                        { name: 'Seed viability loss', desc: 'Impairment of germination capacity and seedling vigor. Control moisture, temperature, pests and molds during seed storage.' }
                      ].map((type, idx) => (
                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                          <td className="py-5 px-6 font-medium text-white whitespace-nowrap">{type.name}</td>
                          <td className="py-5 px-6 font-normal leading-relaxed">{type.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Major Causes */}
              <div className="lg:col-span-4 bg-black/60 backdrop-blur-xl rounded-xl border border-white/5 p-8 shadow-sm">
                <h3 className="text-xl font-medium text-white mb-6">{t('lossesPrevention.majorCauses')}</h3>
                <div className="space-y-4">
                  {postHarvestCauses.map((cause, idx) => (
                    <div key={idx} className="bg-white/5 rounded-xl p-5 border border-white/5">
                      <h4 className="text-sm font-medium text-rose-400 mb-2">{cause.title}</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed font-normal">{cause.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Prevention & Mitigation Strategies */}
            <div className="bg-black/60 backdrop-blur-xl rounded-xl border border-white/5 p-8 shadow-sm space-y-8">
              <h3 className="text-2xl font-medium text-white">{t('lossesPrevention.preventionStrategies')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {postHarvestPrevention.map((section, idx) => (
                  <div key={idx} className="bg-white/5 rounded-xl p-6 md:p-8 border border-white/5 hover:border-white/10 transition-colors">
                    <h4 className="text-lg font-medium text-emerald-400 mb-6">{section.category}</h4>
                    <ul className="space-y-4">
                      {section.points.map((point, pIdx) => {
                        const [boldPart, ...rest] = point.split(': ');
                        return (
                          <li key={pIdx} className="text-sm font-normal text-neutral-300 flex items-start gap-3">
                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <div className="leading-relaxed">
                              {rest.length > 0 ? (
                                <>
                                  <strong className="text-white font-medium">{boldPart}: </strong>
                                  {rest.join(': ')}
                                </>
                              ) : (
                                point
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PESTICIDES / KRISHI RAKSHAK TAB */}
        {activeTab === 'PESTICIDES' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <KrishiRakshakModule />
          </div>
        )}
      </div>
    </div>
  );
};
