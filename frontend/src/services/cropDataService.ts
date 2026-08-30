// Crop Intelligence & Pik Pahani Data Abstraction Service

export interface LocationHierarchy {
  state: string;
  districts: {
    name: string;
    talukas: string[];
  }[];
}

export interface CropIntelligenceRecord {
  state: string;
  district: string;
  taluka: string;
  crop: string;
  season: string;
  year: string;
  totalTalukaAreaHa: number;
  cropCultivatedAreaHa: number;
  productionTonnes: number;
  averageYieldTonnesPerHa: number;
  cropAreaSharePercent: number;
  yoyChangePercent: number;
  marketArrivalsTonnesPerDay: number;
  currentMarketPricePerQuintal: number;
  previousMarketPricePerQuintal: number;
  primaryMandi: string;
  historicalTrend: {
    year: number;
    areaHa: number;
    productionTonnes: number;
    yieldTonnesPerHa: number;
  }[];
  supplyStatus: 'NORMAL' | 'MODERATE' | 'HIGH_SURPLUS';
  recommendation: {
    statusBadge: string;
    badgeColor: string;
    summary: string;
    detailedAdvice: string;
    processingOptions: string[];
  };
}

export interface DataSourceMetadata {
  name: string;
  dataType: string;
  lastUpdated: string;
  status: 'VERIFIED' | 'SIMULATED_DEMO';
  description: string;
}

export const LOCATION_DATA: LocationHierarchy[] = [
  {
    state: 'Maharashtra',
    districts: [
      {
        name: 'Nashik',
        talukas: ['Niphad', 'Dindori', 'Yeola', 'Chandwad', 'Sinner', 'Kalwan']
      },
      {
        name: 'Pune',
        talukas: ['Junnar', 'Ambegaon', 'Khed', 'Shirur', 'Baramati']
      },
      {
        name: 'Ahmednagar',
        talukas: ['Rahuri', 'Sangamner', 'Kopargaon', 'Shrirampur', 'Nagar']
      },
      {
        name: 'Jalgaon',
        talukas: ['Raver', 'Yaval', 'Chopda', 'Bhusawal', 'Jalgaon']
      }
    ]
  },
  {
    state: 'Madhya Pradesh',
    districts: [
      {
        name: 'Indore',
        talukas: ['Depalpur', 'Sanwer', 'Mhow', 'Indore']
      },
      {
        name: 'Ujjain',
        talukas: ['Nagda', 'Khachrod', 'Mahidpur', 'Badnagar']
      }
    ]
  },
  {
    state: 'Gujarat',
    districts: [
      {
        name: 'Surat',
        talukas: ['Olpad', 'Kamrej', 'Bardoli', 'Mahuva']
      },
      {
        name: 'Rajkot',
        talukas: ['Gondal', 'Jetpur', 'Dhoraji', 'Kotda']
      }
    ]
  }
];

export const AVAILABLE_CROPS = [
  'Onion',
  'Tomato',
  'Grapes',
  'Wheat',
  'Maize',
  'Soybean',
  'Sugarcane'
];

export const AVAILABLE_SEASONS = ['Rabi', 'Kharif', 'Late Kharif', 'Summer'];
export const AVAILABLE_YEARS = ['2025-26', '2024-25', '2023-24', '2022-23'];

// Pre-configured rich datasets for Maharashtra demo flow
const CROP_INTELLIGENCE_DATASETS: Record<string, CropIntelligenceRecord> = {
  'Maharashtra_Nashik_Niphad_Onion_Rabi_2025-26': {
    state: 'Maharashtra',
    district: 'Nashik',
    taluka: 'Niphad',
    crop: 'Onion',
    season: 'Rabi',
    year: '2025-26',
    totalTalukaAreaHa: 500000,
    cropCultivatedAreaHa: 125000,
    productionTonnes: 2875000,
    averageYieldTonnesPerHa: 23.0,
    cropAreaSharePercent: 25.0,
    yoyChangePercent: 8.5,
    marketArrivalsTonnesPerDay: 4200,
    currentMarketPricePerQuintal: 2650,
    previousMarketPricePerQuintal: 2450,
    primaryMandi: 'Lasalgaon APMC (Nashik Hub)',
    historicalTrend: [
      { year: 2021, areaHa: 95000, productionTonnes: 2090000, yieldTonnesPerHa: 22.0 },
      { year: 2022, areaHa: 101000, productionTonnes: 2272500, yieldTonnesPerHa: 22.5 },
      { year: 2023, areaHa: 112000, productionTonnes: 2542400, yieldTonnesPerHa: 22.7 },
      { year: 2024, areaHa: 118000, productionTonnes: 2690400, yieldTonnesPerHa: 22.8 },
      { year: 2025, areaHa: 125000, productionTonnes: 2875000, yieldTonnesPerHa: 23.0 }
    ],
    supplyStatus: 'HIGH_SURPLUS',
    recommendation: {
      statusBadge: '🔴 HIGH SUPPLY / POSSIBLE SURPLUS',
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
      summary: 'High regional cultivation area reported. Consider staggered selling and value-added processing.',
      detailedAdvice: 'Cultivated onion area in Niphad block has grown by +8.5% YoY to 125,000 hectares. High peak arrivals at Lasalgaon Mandi are expected during late Rabi harvest. Explore ventilated cold storage and value addition (onion dehydration, flakes, powder) to protect profit margins.',
      processingOptions: ['Onion Dehydration Flakes', 'Onion Powder Processing', 'Controlled Atmosphere Storage']
    }
  },
  'Maharashtra_Nashik_Dindori_Tomato_Kharif_2025-26': {
    state: 'Maharashtra',
    district: 'Nashik',
    taluka: 'Dindori',
    crop: 'Tomato',
    season: 'Kharif',
    year: '2025-26',
    totalTalukaAreaHa: 420000,
    cropCultivatedAreaHa: 75600,
    productionTonnes: 1890000,
    averageYieldTonnesPerHa: 25.0,
    cropAreaSharePercent: 18.0,
    yoyChangePercent: 4.2,
    marketArrivalsTonnesPerDay: 3100,
    currentMarketPricePerQuintal: 1850,
    previousMarketPricePerQuintal: 1720,
    primaryMandi: 'Palkhed Mandi (Dindori)',
    historicalTrend: [
      { year: 2021, areaHa: 62000, productionTonnes: 1488000, yieldTonnesPerHa: 24.0 },
      { year: 2022, areaHa: 66000, productionTonnes: 1603800, yieldTonnesPerHa: 24.3 },
      { year: 2023, areaHa: 70000, productionTonnes: 1715000, yieldTonnesPerHa: 24.5 },
      { year: 2024, areaHa: 72500, productionTonnes: 1799000, yieldTonnesPerHa: 24.8 },
      { year: 2025, areaHa: 75600, productionTonnes: 1890000, yieldTonnesPerHa: 25.0 }
    ],
    supplyStatus: 'MODERATE',
    recommendation: {
      statusBadge: '🟡 MODERATE SUPPLY',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      summary: 'Balanced supply situation with stable farmgate prices.',
      detailedAdvice: 'Tomato crop area occupies ~18% of Dindori cultivated land. Production is steady. Compare prices with nearby Vashi & Pimpalgaon markets before booking long-distance transport.',
      processingOptions: ['Tomato Paste & Puree Brix 28%', 'Sun-dried Tomatoes', 'Ketchup Manufacturing']
    }
  },
  'Maharashtra_Nashik_Niphad_Grapes_Rabi_2025-26': {
    state: 'Maharashtra',
    district: 'Nashik',
    taluka: 'Niphad',
    crop: 'Grapes',
    season: 'Rabi',
    year: '2025-26',
    totalTalukaAreaHa: 500000,
    cropCultivatedAreaHa: 65000,
    productionTonnes: 1430000,
    averageYieldTonnesPerHa: 22.0,
    cropAreaSharePercent: 13.0,
    yoyChangePercent: 2.1,
    marketArrivalsTonnesPerDay: 1800,
    currentMarketPricePerQuintal: 6200,
    previousMarketPricePerQuintal: 5900,
    primaryMandi: 'Pimpalgaon Baswant (Export Yard)',
    historicalTrend: [
      { year: 2021, areaHa: 58000, productionTonnes: 1218000, yieldTonnesPerHa: 21.0 },
      { year: 2022, areaHa: 60000, productionTonnes: 1284000, yieldTonnesPerHa: 21.4 },
      { year: 2023, areaHa: 62000, productionTonnes: 1345400, yieldTonnesPerHa: 21.7 },
      { year: 2024, areaHa: 63500, productionTonnes: 1384300, yieldTonnesPerHa: 21.8 },
      { year: 2025, areaHa: 65000, productionTonnes: 1430000, yieldTonnesPerHa: 22.0 }
    ],
    supplyStatus: 'NORMAL',
    recommendation: {
      statusBadge: '🟢 NORMAL SUPPLY',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      summary: 'High export demand for Table Grapes. Optimal condition for direct APMC & export bookings.',
      detailedAdvice: 'Grape area is steady at 13% share. Export-grade Thompson Seedless has strong demand in European & Gulf markets.',
      processingOptions: ['Raisin Production (Kishmish)', 'Grape Juice Concentrate', 'Export Packing']
    }
  }
};

/**
 * Fetch crop intelligence record for specified filters with fallback calculation
 */
export function getCropIntelligenceData(
  state: string,
  district: string,
  taluka: string,
  crop: string,
  season: string,
  year: string
): CropIntelligenceRecord {
  const key = `${state}_${district}_${taluka}_${crop}_${season}_${year}`;

  if (CROP_INTELLIGENCE_DATASETS[key]) {
    return CROP_INTELLIGENCE_DATASETS[key];
  }

  // Dynamic fallback calculation for non-preconfigured combinations
  const seed = (district.length * 1000) + (taluka.length * 100) + (crop.length * 10);
  const totalArea = 350000 + (seed % 150000);
  const cultivatedArea = Math.round(totalArea * (0.12 + (seed % 18) / 100));
  const share = parseFloat(((cultivatedArea / totalArea) * 100).toFixed(1));
  const yieldPerHa = parseFloat((15 + (seed % 12)).toFixed(1));
  const production = Math.round(cultivatedArea * yieldPerHa);
  const arrivals = Math.round(1200 + (seed % 2800));
  const price = Math.round(1800 + (seed % 2400));
  const prevPrice = Math.round(price * 0.94);
  const yoy = parseFloat(((seed % 15) - 4.5).toFixed(1));

  let status: 'NORMAL' | 'MODERATE' | 'HIGH_SURPLUS' = 'NORMAL';
  let statusBadge = '🟢 NORMAL SUPPLY';
  let badgeColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  let summary = 'Normal supply situation. Continue monitoring market prices and nearby arrivals.';
  let advice = `Cultivated ${crop} area in ${taluka} occupies ~${share}% of reported agricultural land. Supply and demand remain balanced.`;
  let procOptions = [`${crop} Cold Storage`, `Bulk Packaging`, `Regional Wholesale Dispatch`];

  if (share > 22 || yoy > 6.0) {
    status = 'HIGH_SURPLUS';
    statusBadge = '🔴 HIGH SUPPLY / POSSIBLE SURPLUS';
    badgeColor = 'bg-red-500/20 text-red-400 border-red-500/30';
    summary = 'High regional cultivation indicated. Consider evaluating storage and alternate markets.';
    advice = `Higher than average area reported for ${crop} (${share}% of block area). Risk of seasonal price dips during peak arrival weeks.`;
    procOptions = [`${crop} Dehydration & Drying`, `Value-Added Puree / Powder`, `Secondary APMC Transport`];
  } else if (share > 15 || yoy > 2.0) {
    status = 'MODERATE';
    statusBadge = '🟡 MODERATE SUPPLY';
    badgeColor = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    summary = 'Moderate supply in market. Compare prices across nearby markets before selling.';
    advice = `Moderate cultivation density for ${crop} in ${taluka}. Prices are holding steady.`;
    procOptions = [`Sorting & Grading`, `Short-term Cold Warehousing`, `Direct Buyer Matching`];
  }

  const baseYear = parseInt(year.split('-')[0]) || 2025;
  const historicalTrend = [
    { year: baseYear - 4, areaHa: Math.round(cultivatedArea * 0.82), productionTonnes: Math.round(production * 0.8), yieldTonnesPerHa: parseFloat((yieldPerHa * 0.95).toFixed(1)) },
    { year: baseYear - 3, areaHa: Math.round(cultivatedArea * 0.87), productionTonnes: Math.round(production * 0.86), yieldTonnesPerHa: parseFloat((yieldPerHa * 0.97).toFixed(1)) },
    { year: baseYear - 2, areaHa: Math.round(cultivatedArea * 0.92), productionTonnes: Math.round(production * 0.91), yieldTonnesPerHa: parseFloat((yieldPerHa * 0.98).toFixed(1)) },
    { year: baseYear - 1, areaHa: Math.round(cultivatedArea * 0.96), productionTonnes: Math.round(production * 0.95), yieldTonnesPerHa: parseFloat((yieldPerHa * 0.99).toFixed(1)) },
    { year: baseYear, areaHa: cultivatedArea, productionTonnes: production, yieldTonnesPerHa: yieldPerHa }
  ];

  return {
    state,
    district,
    taluka,
    crop,
    season,
    year,
    totalTalukaAreaHa: totalArea,
    cropCultivatedAreaHa: cultivatedArea,
    productionTonnes: production,
    averageYieldTonnesPerHa: yieldPerHa,
    cropAreaSharePercent: share,
    yoyChangePercent: yoy,
    marketArrivalsTonnesPerDay: arrivals,
    currentMarketPricePerQuintal: price,
    previousMarketPricePerQuintal: prevPrice,
    primaryMandi: `${district} Central APMC Yard`,
    historicalTrend,
    supplyStatus: status,
    recommendation: {
      statusBadge,
      badgeColor,
      summary,
      detailedAdvice: advice,
      processingOptions: procOptions
    }
  };
}

/**
 * Returns dataset transparency metadata
 */
export function getDataSourceMetadata(): DataSourceMetadata[] {
  return [
    {
      name: 'Krishi Grow Crop Intelligence Engine',
      dataType: 'Cultivated Crop Area, Production & Yield Analytics',
      lastUpdated: '2025-26 Crop Season',
      status: 'SIMULATED_DEMO',
      description: 'Regional crop reporting model based on area share calculations and historical trend synthesis.'
    },
    {
      name: 'Government Agricultural Statistics (DesAgri & Directorate of Horticulture)',
      dataType: 'District-wise Cropping Pattern Reference',
      lastUpdated: '2024-25 Benchmark',
      status: 'VERIFIED',
      description: 'Official state-level area and yield benchmark tables for Maharashtra.'
    },
    {
      name: 'APMC Market Intelligence Network (Agmarknet Proxy)',
      dataType: 'Daily Mandi Arrivals & Spot Farmgate Prices',
      lastUpdated: 'Live Daily Feed (Simulated for Demo)',
      status: 'SIMULATED_DEMO',
      description: 'Spot market price trends for Lasalgaon, Pimpalgaon, and regional mandi yards.'
    }
  ];
}
