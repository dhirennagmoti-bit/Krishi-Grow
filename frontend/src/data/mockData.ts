import type {
  User, CropRecord, StorageFacility, ProcessingFacility, GovernmentScheme,
  ProductRecommendation, MandiPrice, BuyerRequirement, ConnectionRequest,
  NotificationItem
} from '../types';

export const guestUser: User = {
  id: '',
  name: 'Guest User',
  email: '',
  role: 'FARMER',
  phone: '',
  state: 'Maharashtra',
  district: 'Nashik',
};

export const initialUser: User = guestUser;

export const initialCrops: CropRecord[] = [
  {
    id: 'crop_01',
    farmerId: 'usr_f101',
    farmerName: 'Ramesh Patil',
    name: 'Tomato',
    category: 'Vegetables',
    variety: 'Abhinav Hybrid (Red)',
    quantity: 15,
    unit: 'tonne',
    grade: 'A',
    moisturePercent: 88,
    damagePercent: 2,
    isOrganic: true,
    harvestDate: '2026-08-10',
    estimatedShelfLifeDays: 14,
    daysRemaining: 10,
    storageCondition: 'Ambient Shade',
    location: {
      state: 'Maharashtra',
      district: 'Nashik',
      taluka: 'Dindori',
      village: 'Palkhed',
      lat: 20.201,
      lng: 73.832
    },
    imageUrl: '/crops/tomato.jpg',
    status: 'AVAILABLE',
    createdAt: '2026-08-10T08:00:00Z'
  },
  {
    id: 'crop_02',
    farmerId: 'usr_f101',
    farmerName: 'Ramesh Patil',
    name: 'Red Onion',
    category: 'Vegetables',
    variety: 'Nashik Red F1',
    quantity: 25,
    unit: 'tonne',
    grade: 'A+',
    moisturePercent: 12,
    damagePercent: 1,
    isOrganic: false,
    harvestDate: '2026-08-01',
    estimatedShelfLifeDays: 90,
    daysRemaining: 77,
    storageCondition: 'Ventilated Godown',
    location: {
      state: 'Maharashtra',
      district: 'Nashik',
      taluka: 'Lasalgaon',
      lat: 20.147,
      lng: 74.227
    },
    imageUrl: '/crops/red_onion.jpg',
    status: 'AVAILABLE',
    createdAt: '2026-08-01T10:30:00Z'
  },
  {
    id: 'crop_03',
    farmerId: 'usr_f101',
    farmerName: 'Ramesh Patil',
    name: 'Cotton',
    category: 'Cash Crops',
    variety: 'BT Cotton II',
    quantity: 8,
    unit: 'tonne',
    grade: 'A',
    isOrganic: false,
    harvestDate: '2026-07-25',
    estimatedShelfLifeDays: 180,
    daysRemaining: 160,
    storageCondition: 'Dry Store',
    location: {
      state: 'Maharashtra',
      district: 'Aurangabad',
      lat: 19.876,
      lng: 75.343
    },
    imageUrl: '/crops/cotton.jpg',
    status: 'AVAILABLE',
    createdAt: '2026-07-25T14:15:00Z'
  },
  {
    id: 'crop_04',
    farmerId: 'usr_f102',
    farmerName: 'Sunita Deshmukh',
    name: 'Soybean',
    category: 'Oilseeds',
    variety: 'JS 335',
    quantity: 45,
    unit: 'tonne',
    grade: 'A',
    moisturePercent: 10,
    damagePercent: 2,
    isOrganic: false,
    harvestDate: '2026-08-05',
    estimatedShelfLifeDays: 300,
    daysRemaining: 280,
    storageCondition: 'Warehouse',
    location: {
      state: 'Maharashtra',
      district: 'Latur',
      taluka: 'Ausa',
      lat: 18.250,
      lng: 76.500
    },
    imageUrl: '/crops/soybean.jpg',
    status: 'AVAILABLE',
    createdAt: '2026-08-05T09:00:00Z'
  },
  {
    id: 'crop_05',
    farmerId: 'usr_f103',
    farmerName: 'Vikas Kale',
    name: 'Wheat',
    category: 'Cereals',
    variety: 'Lok 1',
    quantity: 120,
    unit: 'tonne',
    grade: 'A+',
    moisturePercent: 11,
    damagePercent: 1,
    isOrganic: true,
    harvestDate: '2026-04-10',
    estimatedShelfLifeDays: 365,
    daysRemaining: 210,
    storageCondition: 'Silo Storage',
    location: {
      state: 'Maharashtra',
      district: 'Pune',
      taluka: 'Baramati',
      lat: 18.150,
      lng: 74.580
    },
    imageUrl: '/crops/wheat.jpg',
    status: 'AVAILABLE',
    createdAt: '2026-04-10T10:00:00Z'
  },
  {
    id: 'crop_06',
    farmerId: 'usr_f104',
    farmerName: 'Amol Pawar',
    name: 'Mango',
    category: 'Fruits',
    variety: 'Alphonso',
    quantity: 5,
    unit: 'tonne',
    grade: 'Export',
    moisturePercent: 80,
    damagePercent: 0,
    isOrganic: true,
    harvestDate: '2026-05-15',
    estimatedShelfLifeDays: 15,
    daysRemaining: 2,
    storageCondition: 'Cold Storage',
    location: {
      state: 'Maharashtra',
      district: 'Ratnagiri',
      taluka: 'Dapoli',
      lat: 17.750,
      lng: 73.180
    },
    imageUrl: '/crops/mango.jpg',
    status: 'AVAILABLE',
    createdAt: '2026-05-15T08:30:00Z'
  },
  {
    id: 'crop_07',
    farmerId: 'usr_f105',
    farmerName: 'Rahul Jadhav',
    name: 'Turmeric',
    category: 'Spices',
    variety: 'Salem',
    quantity: 18,
    unit: 'tonne',
    grade: 'A',
    moisturePercent: 8,
    damagePercent: 1,
    isOrganic: false,
    harvestDate: '2026-02-20',
    estimatedShelfLifeDays: 730,
    daysRemaining: 500,
    storageCondition: 'Dry Store',
    location: {
      state: 'Maharashtra',
      district: 'Sangli',
      taluka: 'Miraj',
      lat: 16.820,
      lng: 74.650
    },
    imageUrl: '/crops/turmeric.jpg',
    status: 'AVAILABLE',
    createdAt: '2026-02-20T11:00:00Z'
  }
];

export const initialMandiPrices: MandiPrice[] = [
  // Soybean
  { id: 'm1', crop: 'Soybean', marketName: 'Latur APMC', district: 'Latur', state: 'Maharashtra', date: '2026-08-14', minPrice: 6000, maxPrice: 6500, modalPrice: 6250, unit: 'Quintal', trend: 'UP' },
  { id: 'm2', crop: 'Soybean', marketName: 'Akola APMC', district: 'Akola', state: 'Maharashtra', date: '2026-08-14', minPrice: 6100, maxPrice: 6400, modalPrice: 6300, unit: 'Quintal', trend: 'UP' },
  // Cotton
  { id: 'm3', crop: 'Cotton', marketName: 'Yavatmal APMC', district: 'Yavatmal', state: 'Maharashtra', date: '2026-08-14', minPrice: 7200, maxPrice: 8000, modalPrice: 7600, unit: 'Quintal', trend: 'UP' },
  { id: 'm4', crop: 'Cotton', marketName: 'Jalgaon APMC', district: 'Jalgaon', state: 'Maharashtra', date: '2026-08-14', minPrice: 7100, maxPrice: 7800, modalPrice: 7500, unit: 'Quintal', trend: 'UP' },
  // Red Onion
  { id: 'm5', crop: 'Red Onion', marketName: 'Lasalgaon APMC', district: 'Nashik', state: 'Maharashtra', date: '2026-08-14', minPrice: 2200, maxPrice: 2900, modalPrice: 2550, unit: 'Quintal', trend: 'UP' },
  { id: 'm6', crop: 'Red Onion', marketName: 'Pimpalgaon APMC', district: 'Nashik', state: 'Maharashtra', date: '2026-08-14', minPrice: 2300, maxPrice: 2850, modalPrice: 2600, unit: 'Quintal', trend: 'UP' },
  // Tur / Arhar
  { id: 'm7', crop: 'Tur / Arhar', marketName: 'Latur APMC', district: 'Latur', state: 'Maharashtra', date: '2026-08-14', minPrice: 7800, maxPrice: 8300, modalPrice: 8050, unit: 'Quintal', trend: 'DOWN' },
  { id: 'm8', crop: 'Tur / Arhar', marketName: 'Malkapur APMC', district: 'Malkapur', state: 'Maharashtra', date: '2026-08-14', minPrice: 7700, maxPrice: 8200, modalPrice: 7950, unit: 'Quintal', trend: 'DOWN' },
  // Chana
  { id: 'm9', crop: 'Chana', marketName: 'Akola APMC', district: 'Akola', state: 'Maharashtra', date: '2026-08-14', minPrice: 6000, maxPrice: 6400, modalPrice: 6200, unit: 'Quintal', trend: 'UP' },
  { id: 'm10', crop: 'Chana', marketName: 'Latur APMC', district: 'Latur', state: 'Maharashtra', date: '2026-08-14', minPrice: 5900, maxPrice: 6300, modalPrice: 6100, unit: 'Quintal', trend: 'UP' },
  // Wheat
  { id: 'm11', crop: 'Wheat', marketName: 'Nashik APMC', district: 'Nashik', state: 'Maharashtra', date: '2026-08-14', minPrice: 2500, maxPrice: 2800, modalPrice: 2650, unit: 'Quintal', trend: 'STABLE' },
  { id: 'm12', crop: 'Wheat', marketName: 'Pune APMC', district: 'Pune', state: 'Maharashtra', date: '2026-08-14', minPrice: 2600, maxPrice: 2850, modalPrice: 2700, unit: 'Quintal', trend: 'STABLE' },
  // Jowar
  { id: 'm13', crop: 'Jowar', marketName: 'Solapur APMC', district: 'Solapur', state: 'Maharashtra', date: '2026-08-14', minPrice: 3000, maxPrice: 3800, modalPrice: 3400, unit: 'Quintal', trend: 'UP' },
  { id: 'm14', crop: 'Jowar', marketName: 'Ahmednagar APMC', district: 'Ahmednagar', state: 'Maharashtra', date: '2026-08-14', minPrice: 2900, maxPrice: 3700, modalPrice: 3300, unit: 'Quintal', trend: 'UP' },
  // Tomato (keeping for fallback)
  { id: 'm15', crop: 'Tomato', marketName: 'Pimpalgaon APMC', district: 'Nashik', state: 'Maharashtra', date: '2026-08-14', minPrice: 2200, maxPrice: 3400, modalPrice: 2900, unit: 'Quintal', trend: 'UP' },
];

export const priceTrendHistorical: Record<string, any[]> = {
  Soybean: [
    { date: 'Aug 08', Latur: 5800, Akola: 5900 },
    { date: 'Aug 09', Latur: 5900, Akola: 6000 },
    { date: 'Aug 10', Latur: 6000, Akola: 6050 },
    { date: 'Aug 11', Latur: 6100, Akola: 6150 },
    { date: 'Aug 12', Latur: 6150, Akola: 6200 },
    { date: 'Aug 13', Latur: 6200, Akola: 6250 },
    { date: 'Aug 14', Latur: 6250, Akola: 6300 },
  ],
  Cotton: [
    { date: 'Aug 08', Yavatmal: 7300, Jalgaon: 7200 },
    { date: 'Aug 09', Yavatmal: 7350, Jalgaon: 7250 },
    { date: 'Aug 10', Yavatmal: 7400, Jalgaon: 7300 },
    { date: 'Aug 11', Yavatmal: 7450, Jalgaon: 7350 },
    { date: 'Aug 12', Yavatmal: 7500, Jalgaon: 7400 },
    { date: 'Aug 13', Yavatmal: 7550, Jalgaon: 7450 },
    { date: 'Aug 14', Yavatmal: 7600, Jalgaon: 7500 },
  ],
  'Red Onion': [
    { date: 'Aug 08', Lasalgaon: 2000, Pimpalgaon: 2100 },
    { date: 'Aug 09', Lasalgaon: 2100, Pimpalgaon: 2200 },
    { date: 'Aug 10', Lasalgaon: 2200, Pimpalgaon: 2300 },
    { date: 'Aug 11', Lasalgaon: 2350, Pimpalgaon: 2400 },
    { date: 'Aug 12', Lasalgaon: 2450, Pimpalgaon: 2500 },
    { date: 'Aug 13', Lasalgaon: 2500, Pimpalgaon: 2550 },
    { date: 'Aug 14', Lasalgaon: 2550, Pimpalgaon: 2600 },
  ],
  'Tur / Arhar': [
    { date: 'Aug 08', Latur: 8300, Malkapur: 8200 },
    { date: 'Aug 09', Latur: 8250, Malkapur: 8150 },
    { date: 'Aug 10', Latur: 8200, Malkapur: 8100 },
    { date: 'Aug 11', Latur: 8150, Malkapur: 8050 },
    { date: 'Aug 12', Latur: 8100, Malkapur: 8000 },
    { date: 'Aug 13', Latur: 8050, Malkapur: 7950 },
    { date: 'Aug 14', Latur: 8050, Malkapur: 7950 },
  ],
  Chana: [
    { date: 'Aug 08', Akola: 5800, Latur: 5700 },
    { date: 'Aug 09', Akola: 5900, Latur: 5800 },
    { date: 'Aug 10', Akola: 6000, Latur: 5900 },
    { date: 'Aug 11', Akola: 6050, Latur: 5950 },
    { date: 'Aug 12', Akola: 6100, Latur: 6000 },
    { date: 'Aug 13', Akola: 6150, Latur: 6050 },
    { date: 'Aug 14', Akola: 6200, Latur: 6100 },
  ],
  Wheat: [
    { date: 'Aug 08', Nashik: 2650, Pune: 2700 },
    { date: 'Aug 09', Nashik: 2650, Pune: 2700 },
    { date: 'Aug 10', Nashik: 2650, Pune: 2700 },
    { date: 'Aug 11', Nashik: 2650, Pune: 2700 },
    { date: 'Aug 12', Nashik: 2650, Pune: 2700 },
    { date: 'Aug 13', Nashik: 2650, Pune: 2700 },
    { date: 'Aug 14', Nashik: 2650, Pune: 2700 },
  ],
  Jowar: [
    { date: 'Aug 08', Solapur: 3100, Ahmednagar: 3000 },
    { date: 'Aug 09', Solapur: 3150, Ahmednagar: 3050 },
    { date: 'Aug 10', Solapur: 3200, Ahmednagar: 3100 },
    { date: 'Aug 11', Solapur: 3250, Ahmednagar: 3150 },
    { date: 'Aug 12', Solapur: 3300, Ahmednagar: 3200 },
    { date: 'Aug 13', Solapur: 3350, Ahmednagar: 3250 },
    { date: 'Aug 14', Solapur: 3400, Ahmednagar: 3300 },
  ],
  Tomato: [
    { date: 'Aug 08', Pimpalgaon: 2400 },
    { date: 'Aug 09', Pimpalgaon: 2500 },
    { date: 'Aug 10', Pimpalgaon: 2650 },
    { date: 'Aug 11', Pimpalgaon: 2700 },
    { date: 'Aug 12', Pimpalgaon: 2800 },
    { date: 'Aug 13', Pimpalgaon: 2850 },
    { date: 'Aug 14', Pimpalgaon: 2900 },
  ]
};

export const storageFacilities: StorageFacility[] = [
  {
    id: 'st_01',
    name: 'Sahyadri Cold Chain & Agri Logistics',
    type: 'COLD_STORAGE',
    location: 'Mohadi, Dindori, Nashik',
    distanceKm: 14,
    totalCapacityTonnes: 5000,
    availableCapacityTonnes: 1200,
    pricePerTonDay: 45,
    contactPhone: '+91 94222 88990',
    features: ['Humidity Control', 'CA Storage', 'Solar Powered', 'Pre-cooling Chamber']
  },
  {
    id: 'st_02',
    name: 'Lasalgaon Farmer Co-op Dry Warehousing',
    type: 'DRY_WAREHOUSE',
    location: 'Lasalgaon, Nashik',
    distanceKm: 32,
    totalCapacityTonnes: 12000,
    availableCapacityTonnes: 3400,
    pricePerTonDay: 18,
    contactPhone: '+91 98231 44556',
    features: ['Aerated Floor', 'Pest Control Certified', 'WDRA Registered', '24/7 Security']
  },
  {
    id: 'st_03',
    name: 'GreenField Agri Logistics Cold Hub',
    type: 'COLD_STORAGE',
    location: 'Vadape, Bhiwandi, Thane',
    distanceKm: 128,
    totalCapacityTonnes: 8000,
    availableCapacityTonnes: 850,
    pricePerTonDay: 55,
    contactPhone: '+91 97690 11223',
    features: ['Multi-chamber (-2°C to 15°C)', 'Proximity to Vashi Market', 'Reefer Truck Dock']
  },
  {
    id: 'st_04',
    name: 'MahaAgri Fresh Cold Storage',
    type: 'COLD_STORAGE',
    location: 'Ozar, Nashik',
    distanceKm: 22,
    totalCapacityTonnes: 3000,
    availableCapacityTonnes: 450,
    pricePerTonDay: 50,
    contactPhone: '+91 88877 66554',
    features: ['Ammonia Plant', 'Backup Generator', 'Grading Facility']
  },
  {
    id: 'st_05',
    name: 'Kisan Mitra Warehousing Co.',
    type: 'DRY_WAREHOUSE',
    location: 'Niphad, Nashik',
    distanceKm: 40,
    totalCapacityTonnes: 15000,
    availableCapacityTonnes: 5000,
    pricePerTonDay: 15,
    contactPhone: '+91 99988 77665',
    features: ['Silo Storage', 'Automated Bagging', 'Moisture Control']
  },
  {
    id: 'st_06',
    name: 'Pune Apex Cold Chain',
    type: 'COLD_STORAGE',
    location: 'Chakan, Pune',
    distanceKm: 180,
    totalCapacityTonnes: 10000,
    availableCapacityTonnes: 2100,
    pricePerTonDay: 60,
    contactPhone: '+91 77766 55443',
    features: ['Blast Freezing', 'Export Approved', '24/7 Access']
  }
];

export const processingFacilities: ProcessingFacility[] = [
  {
    id: 'pr_01',
    name: 'AgroPure Tomato Processing Plant',
    cropsAccepted: ['Tomato', 'Chilli', 'Garlic'],
    processingTypes: ['Puree', 'Paste', 'Ketchup Base'],
    dailyCapacityTonnes: 80,
    location: 'Ozar MIDC, Nashik',
    distanceKm: 22,
    contactPhone: '+91 98221 77665',
    minBatchTonnes: 5
  },
  {
    id: 'pr_02',
    name: 'Maharastra Dehydration Industries',
    cropsAccepted: ['Red Onion', 'White Onion', 'Garlic'],
    processingTypes: ['Dehydrated Flakes', 'Onion Powder'],
    dailyCapacityTonnes: 120,
    location: 'Malgiri, Sinnar',
    distanceKm: 45,
    contactPhone: '+91 94230 33441',
    minBatchTonnes: 10
  },
  {
    id: 'pr_03',
    name: 'Apex Bio-Tech Processing Pvt Ltd',
    cropsAccepted: ['Grape', 'Pomegranate', 'Tomato'],
    processingTypes: ['Juice Concentrate', 'Pulp Extract'],
    dailyCapacityTonnes: 60,
    location: 'Baramati MIDC, Pune',
    distanceKm: 190,
    contactPhone: '+91 98900 99887',
    minBatchTonnes: 8
  }
];

export const governmentSchemes: GovernmentScheme[] = [
  {
    id: 'sch_01',
    name: 'PM-KISAN Samman Nidhi',
    agency: 'Government of India',
    description: 'A Government of India income-support scheme for eligible landholding farmer families. Provides farmer registration, e-KYC, beneficiary status and installment information.',
    eligibility: 'All landholding farmers',
    subsidyBenefit: '₹6000 per year in 3 equal installments',
    requiredDocuments: ['Aadhaar Card', 'Land Record (7/12 & 8A)', 'Bank Account Details'],
    applicationUrl: 'https://pmkisan.gov.in',
    applicableCrops: ['ALL'],
    applicableStates: ['All India', 'Maharashtra'],
    maxSubsidyAmount: '₹6,000 / year',
    lastVerifiedDate: '2026-08-14'
  },
  {
    id: 'sch_02',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    agency: 'Ministry of Agriculture',
    description: 'A crop-insurance platform that allows farmers to access crop insurance information, calculate premiums, check policy status and report crop loss.',
    eligibility: 'All Farmers',
    subsidyBenefit: 'Comprehensive Crop Insurance against natural calamities',
    requiredDocuments: ['Aadhaar Card', 'Land Record', 'Sowing Certificate'],
    applicationUrl: 'https://pmfby.gov.in',
    applicableCrops: ['ALL'],
    applicableStates: ['All India', 'Maharashtra'],
    maxSubsidyAmount: 'Varies by Crop',
    lastVerifiedDate: '2026-08-14'
  },
  {
    id: 'sch_03',
    name: 'Agriculture Infrastructure Fund (AIF)',
    agency: 'Ministry of Agriculture & Farmers Welfare',
    description: 'Supports agricultural infrastructure and post-harvest activities such as storage, logistics and other value-chain infrastructure.',
    eligibility: 'Farmers, FPOs, Agri-entrepreneurs, Startups',
    subsidyBenefit: '3% Interest Subvention per annum up to ₹2 Crore',
    requiredDocuments: ['Aadhaar Card', 'Land Record', 'Project DPR', 'Bank Details'],
    applicationUrl: 'https://agriinfra.dac.gov.in/',
    applicableCrops: ['ALL'],
    applicableStates: ['All India', 'Maharashtra'],
    maxSubsidyAmount: '₹2,00,00,000',
    lastVerifiedDate: '2026-08-14'
  },
  {
    id: 'sch_04',
    name: 'PM Formalisation of Micro Food Processing (PMFME)',
    agency: 'Ministry of Food Processing Industries (MoFPI)',
    description: 'Supports formalisation and development of micro food-processing enterprises. Useful for converting agricultural produce into value-added products.',
    eligibility: 'Food processors, farmers, FPOs, SHGs',
    subsidyBenefit: '35% Credit-linked capital subsidy',
    requiredDocuments: ['FSSAI Registration Draft', 'PAN Card', 'Quotation for Machinery'],
    applicationUrl: 'https://pmfme.mofpi.gov.in/',
    applicableCrops: ['Tomato', 'Onion', 'Mango', 'ALL'],
    applicableStates: ['All India', 'Maharashtra'],
    maxSubsidyAmount: '₹10,00,000',
    lastVerifiedDate: '2026-08-14'
  },
  {
    id: 'sch_05',
    name: 'PM-KUSUM',
    agency: 'Ministry of New and Renewable Energy',
    description: 'Supports agricultural solarisation, including standalone solar pumps and solarisation of eligible agricultural pumps.',
    eligibility: 'Farmers and eligible agricultural landholders',
    subsidyBenefit: 'Up to 60% subsidy on solar pumps',
    requiredDocuments: ['Aadhaar Card', 'Land Record (7/12)', 'Bank Passbook'],
    applicationUrl: 'https://pmkusum.mnre.gov.in',
    applicableCrops: ['ALL'],
    applicableStates: ['All India', 'Maharashtra'],
    maxSubsidyAmount: '60% of cost',
    lastVerifiedDate: '2026-08-14'
  },
  {
    id: 'sch_06',
    name: 'MahaDBT Farmer Portal',
    agency: 'Govt of Maharashtra',
    description: 'Provides access to multiple Maharashtra agriculture schemes, including micro-irrigation, farm mechanization, horticulture, and rainfed agriculture.',
    eligibility: 'Maharashtra farmers',
    subsidyBenefit: 'Various State Subsidies & Direct Benefit Transfers',
    requiredDocuments: ['Aadhaar Card', '7/12 Extract', '8A Extract'],
    applicationUrl: 'https://mahadbtmahait.gov.in/',
    applicableCrops: ['ALL'],
    applicableStates: ['Maharashtra'],
    maxSubsidyAmount: 'Varies',
    lastVerifiedDate: '2026-08-14'
  },
  {
    id: 'sch_07',
    name: 'National Agriculture Market (e-NAM)',
    agency: 'Ministry of Agriculture',
    description: 'A pan-India electronic agricultural market platform designed to connect agricultural markets and improve price discovery.',
    eligibility: 'Farmers, traders, buyers, FPOs',
    subsidyBenefit: 'Market linkage and transparent price discovery',
    requiredDocuments: ['Farmer Registration', 'Bank Details'],
    applicationUrl: 'https://enam.gov.in/',
    applicableCrops: ['ALL'],
    applicableStates: ['All India', 'Maharashtra'],
    maxSubsidyAmount: 'N/A',
    lastVerifiedDate: '2026-08-14'
  },
  {
    id: 'sch_08',
    name: 'Small Farmers Agribusiness Consortium (SFAC)',
    agency: 'Ministry of Agriculture',
    description: 'Works on farmer collectivisation and agribusiness development, including support related to Farmer Producer Organisations (FPOs).',
    eligibility: 'FPOs, farmer organisations and agribusiness ecosystem',
    subsidyBenefit: 'Equity grant and credit guarantee for FPOs',
    requiredDocuments: ['FPO Registration', 'Business Plan', 'Audit Reports'],
    applicationUrl: 'http://sfacindia.com/',
    applicableCrops: ['ALL'],
    applicableStates: ['All India', 'Maharashtra'],
    maxSubsidyAmount: 'Up to ₹15 Lakhs (Equity Grant)',
    lastVerifiedDate: '2026-08-14'
  },
  {
    id: 'sch_09',
    name: 'PMKSY — Per Drop More Crop',
    agency: 'MahaDBT / GoI',
    description: 'Supports micro-irrigation (drip/sprinkler) and efficient use of water for agriculture.',
    eligibility: 'Farmers with cultivable land',
    subsidyBenefit: 'Up to 55% subsidy for small/marginal farmers, 45% for others',
    requiredDocuments: ['7/12 & 8A Extract', 'Aadhaar', 'Quotation from authorized dealer'],
    applicationUrl: 'https://mahadbtmahait.gov.in/',
    applicableCrops: ['ALL'],
    applicableStates: ['Maharashtra'],
    maxSubsidyAmount: 'Based on area/spacing',
    lastVerifiedDate: '2026-08-14'
  },
  {
    id: 'sch_10',
    name: 'Sub-Mission on Farm Mechanization',
    agency: 'MahaDBT / GoI',
    description: 'Supports adoption of agricultural machinery and farm mechanization to improve productivity.',
    eligibility: 'All Farmers',
    subsidyBenefit: 'Financial assistance for purchasing tractors and implements',
    requiredDocuments: ['7/12 Extract', 'Aadhaar', 'Caste Certificate (if applicable)'],
    applicationUrl: 'https://mahadbtmahait.gov.in/',
    applicableCrops: ['ALL'],
    applicableStates: ['Maharashtra'],
    maxSubsidyAmount: 'Up to 50% subsidy',
    lastVerifiedDate: '2026-08-14'
  },
  {
    id: 'sch_11',
    name: 'Mission for Integrated Development of Horticulture (MIDH)',
    agency: 'MahaDBT / NHB',
    description: 'Promotes holistic growth of horticulture sector including planting, cold chain, and protected cultivation.',
    eligibility: 'Horticulture farmers',
    subsidyBenefit: '35% to 50% subsidy for various horticulture projects',
    requiredDocuments: ['Land Record', 'Project Estimate', 'Bank Mandate'],
    applicationUrl: 'https://midh.gov.in/',
    applicableCrops: ['Tomato', 'Onion', 'Mango', 'Grapes', 'Pomegranate'],
    applicableStates: ['Maharashtra'],
    maxSubsidyAmount: 'Varies',
    lastVerifiedDate: '2026-08-14'
  },
  {
    id: 'sch_12',
    name: 'Bhausaheb Fundkar Phalbaag Lagvad Yojana',
    agency: 'Govt of Maharashtra',
    description: 'Focused on fruit-orchard development by providing 100% subsidy for planting fruit trees over 3 years.',
    eligibility: 'Eligible Maharashtra farmers without MNREGA coverage for the same',
    subsidyBenefit: '100% subsidy over 3 years (50:30:20 ratio)',
    requiredDocuments: ['7/12 & 8A Extract', 'Aadhaar', 'Soil/Water Test Report'],
    applicationUrl: 'https://mahadbtmahait.gov.in/',
    applicableCrops: ['Mango', 'Pomegranate', 'Orange', 'Lemon'],
    applicableStates: ['Maharashtra'],
    maxSubsidyAmount: '100% material cost',
    lastVerifiedDate: '2026-08-14'
  },
  {
    id: 'sch_13',
    name: 'Rainfed Area Development Programme',
    agency: 'MahaDBT / GoI',
    description: 'Supports development of agricultural systems in rainfed areas to increase productivity and minimize risks.',
    eligibility: 'Farmers in rainfed areas',
    subsidyBenefit: 'Support for Integrated Farming Systems (crops + livestock/horticulture)',
    requiredDocuments: ['7/12 Extract', 'Aadhaar'],
    applicationUrl: 'https://mahadbtmahait.gov.in/',
    applicableCrops: ['ALL'],
    applicableStates: ['Maharashtra'],
    maxSubsidyAmount: 'Varies',
    lastVerifiedDate: '2026-08-14'
  },
  {
    id: 'sch_14',
    name: 'State Agriculture Mechanization Scheme',
    agency: 'Govt of Maharashtra',
    description: 'Promotes the use of farm machinery and mechanization to improve agricultural productivity specifically in Maharashtra.',
    eligibility: 'Maharashtra farmers',
    subsidyBenefit: 'Financial assistance for farm implements and processing units',
    requiredDocuments: ['7/12 Extract', 'Dealer Quotation', 'Test Report of Implement'],
    applicationUrl: 'https://mahadbtmahait.gov.in/',
    applicableCrops: ['ALL'],
    applicableStates: ['Maharashtra'],
    maxSubsidyAmount: 'State-defined rates',
    lastVerifiedDate: '2026-08-14'
  },
  {
    id: 'sch_15',
    name: 'Chief Minister Sustainable Agriculture Irrigation Scheme',
    agency: 'Govt of Maharashtra',
    description: 'Supports agricultural irrigation and water-management-related activities (farm ponds, lining, etc.) in Maharashtra.',
    eligibility: 'Eligible Maharashtra farmers',
    subsidyBenefit: 'Subsidy for farm ponds, micro-irrigation, and water management',
    requiredDocuments: ['7/12 Extract', 'Aadhaar', 'Consent form'],
    applicationUrl: 'https://mahadbtmahait.gov.in/',
    applicableCrops: ['ALL'],
    applicableStates: ['Maharashtra'],
    maxSubsidyAmount: 'Varies',
    lastVerifiedDate: '2026-08-14'
  }
];

export const productRecommendations: ProductRecommendation[] = [
  {
    id: 'rec_01',
    rawCrop: 'Tomato',
    targetProduct: 'Concentrated Tomato Puree & Paste',
    opportunityScore: 95,
    marketDemand: 'VERY_HIGH',
    investmentLevel: 'MEDIUM',
    estimatedMarginPercent: 34,
    rawMaterialSuitability: 'Grade A & B Hybrid Red Tomatoes (High Brix 5.2°)',
    nearbyInfra: 'AgroPure Ozar MIDC (22 km) + Cold Chain Mohadi',
    shelfLifeExtensionDays: 350,
    whyRecommended: [
      'Raw tomato prices fluctuate heavily (+/- 40% monthly); puree locks in high value.',
      'Nearby processing facility AgroPure accepts minimum 5T batches.',
      'Extends shelf life from 14 days to 12 months with high FMCG buyer demand.'
    ],
    image: '/images/crop_tomatoes.png'
  },
  {
    id: 'rec_02',
    rawCrop: 'Red Onion',
    targetProduct: 'Dehydrated Onion Flakes & Powder',
    opportunityScore: 91,
    marketDemand: 'HIGH',
    investmentLevel: 'LOW',
    estimatedMarginPercent: 28,
    rawMaterialSuitability: 'Nashik Red F1 (High Dry Matter 14%)',
    nearbyInfra: 'Maharashtra Dehydration Sinnar (45 km)',
    shelfLifeExtensionDays: 540,
    whyRecommended: [
      'High export demand in Middle East and Europe for dehydrated spices.',
      'Reduces weight by 85%, cutting transport cost per unit value.',
      'Zero decay risk during long transport or storage.'
    ],
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%" height="100%" fill="%23fce7f3"/><text x="50%" y="55%" font-size="200" text-anchor="middle" dominant-baseline="middle">🧅</text></svg>'
  },
  {
    id: 'rec_03',
    rawCrop: 'Cotton',
    targetProduct: 'Ginned Bales & Seed Oil Extraction',
    opportunityScore: 84,
    marketDemand: 'HIGH',
    investmentLevel: 'HIGH',
    estimatedMarginPercent: 22,
    rawMaterialSuitability: 'BT Cotton Long Staple (29mm)',
    nearbyInfra: 'Jalna Ginning Cluster (65 km)',
    shelfLifeExtensionDays: 730,
    whyRecommended: [
      'Ginning separates lint from seed, yielding dual revenues (textile yarn + cottonseed oil).',
      'High liquidity market with instant buyer payouts in Jalna hub.'
    ],
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%" height="100%" fill="%23e0f2fe"/><text x="50%" y="55%" font-size="200" text-anchor="middle" dominant-baseline="middle">☁️</text></svg>'
  }
];

export const buyerRequirements: BuyerRequirement[] = [
  {
    id: 'req_101',
    buyerId: 'usr_b501',
    buyerName: 'FreshMarkets India Aggregators',
    buyerType: 'AGGREGATOR',
    crop: 'Tomato',
    variety: 'Abhinav Hybrid (Red)',
    quantityRequiredTonnes: 20,
    minGrade: 'A',
    targetPricePerQuintal: 3200,
    pickupRegion: 'Nashik / North Maharashtra',
    requiredByDate: '2026-08-20',
    frequency: 'WEEKLY',
    notes: 'Require firm ripe red tomatoes for retail delivery in Mumbai & Pune.',
    matchScore: 96
  },
  {
    id: 'req_102',
    buyerId: 'usr_b502',
    buyerName: 'Mother Farm Food Processors',
    buyerType: 'PROCESSOR',
    crop: 'Tomato',
    variety: 'Hybrid / Any Industrial',
    quantityRequiredTonnes: 50,
    minGrade: 'B',
    targetPricePerQuintal: 2800,
    pickupRegion: 'Nashik District',
    requiredByDate: '2026-08-25',
    frequency: 'MONTHLY',
    notes: 'Bulk sourcing for ketchup and sauce processing line.',
    matchScore: 92
  },
  {
    id: 'req_103',
    buyerId: 'usr_b503',
    buyerName: 'Swastik Export Wholesalers',
    buyerType: 'WHOLESALER',
    crop: 'Red Onion',
    variety: 'Nashik Red F1',
    quantityRequiredTonnes: 30,
    minGrade: 'A+',
    targetPricePerQuintal: 2500,
    pickupRegion: 'Nashik / Ahmednagar',
    requiredByDate: '2026-08-22',
    frequency: 'WEEKLY',
    notes: 'Export grade double-skinned onions for Dubai container dispatch.',
    matchScore: 94
  }
];

export const connectionRequests: ConnectionRequest[] = [
  {
    id: 'conn_01',
    farmerId: 'usr_f101',
    farmerName: 'Ramesh Patil',
    buyerId: 'usr_b501',
    buyerName: 'FreshMarkets India Aggregators',
    cropName: 'Tomato',
    quantityTonnes: 15,
    status: 'PENDING',
    requestDate: '2026-08-14T11:20:00Z',
    buyerPhone: '+91 98110 55443'
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'High Buyer Match (96%)',
    message: 'FreshMarkets India requested 20T Tomatoes matching your active harvest!',
    type: 'MATCH',
    timestamp: '10 mins ago',
    isRead: false
  },
  {
    id: 'n2',
    title: 'Price Spike Alert 📈',
    message: 'Tomato price at Pimpalgaon APMC jumped by ₹250/Quintal today.',
    type: 'PRICE',
    timestamp: '2 hours ago',
    isRead: false
  },
  {
    id: 'n3',
    title: 'Shelf Life Advisory',
    message: 'Your Tomato batch #crop_01 has 10 days of shelf life remaining under ambient conditions.',
    type: 'ALERT',
    timestamp: '5 hours ago',
    isRead: true
  }
];
