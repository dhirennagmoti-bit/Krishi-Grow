import type {
  AggregatorFarmer, HarvestCollectionRequest, WeighingSlip, QualityReport,
  AggregatorInventoryItem, AggregatorMarketOffer, ProcessingMachine,
  PackagingBatch, FinishedGoodsItem, WasteRecord, WholesalerCustomer,
  BulkSalesOrder, ProfitAnalyticsBreakdown
} from '../types';

// ==========================================
// 1. AGGREGATOR FARMERS DIRECTORY
// ==========================================
export const initialAggregatorFarmers: AggregatorFarmer[] = [
  {
    id: 'frm_01',
    name: 'Ramesh Balasaheb Patil',
    phone: '+91 98224 55102',
    village: 'Palkhed',
    taluka: 'Dindori',
    district: 'Nashik',
    state: 'Maharashtra',
    farmSizeAcres: 12.5,
    cropsGrown: ['Tomato', 'Grapes', 'Red Onion'],
    expectedHarvests: [
      { crop: 'Tomato', expectedTonnes: 15, expectedDate: '2026-08-28', variety: 'Abhinav Hybrid (Red)' },
      { crop: 'Red Onion', expectedTonnes: 25, expectedDate: '2026-09-10', variety: 'Nashik Red F1' }
    ],
    status: 'ACTIVE',
    totalSuppliedTonnes: 148.5,
    totalPaymentsReceived: 482000,
    rating: 4.9,
    joinedDate: '2025-04-12'
  },
  {
    id: 'frm_02',
    name: 'Sunita Vijay Deshmukh',
    phone: '+91 94221 88304',
    village: 'Ausa Khurd',
    taluka: 'Ausa',
    district: 'Latur',
    state: 'Maharashtra',
    farmSizeAcres: 22.0,
    cropsGrown: ['Soybean', 'Tur / Arhar', 'Chickpea'],
    expectedHarvests: [
      { crop: 'Soybean', expectedTonnes: 30, expectedDate: '2026-09-02', variety: 'JS 335' },
      { crop: 'Tur / Arhar', expectedTonnes: 12, expectedDate: '2026-10-15', variety: 'Vipula' }
    ],
    status: 'ACTIVE',
    totalSuppliedTonnes: 210.0,
    totalPaymentsReceived: 765000,
    rating: 4.8,
    joinedDate: '2025-02-18'
  },
  {
    id: 'frm_03',
    name: 'Vikas Shankarrao Kale',
    phone: '+91 98902 44781',
    village: 'Malegaon Budruk',
    taluka: 'Baramati',
    district: 'Pune',
    state: 'Maharashtra',
    farmSizeAcres: 18.0,
    cropsGrown: ['Sugarcane', 'Wheat', 'Maize / Corn'],
    expectedHarvests: [
      { crop: 'Wheat', expectedTonnes: 40, expectedDate: '2026-09-05', variety: 'Lok-1' }
    ],
    status: 'ACTIVE',
    totalSuppliedTonnes: 320.0,
    totalPaymentsReceived: 980000,
    rating: 4.7,
    joinedDate: '2024-11-04'
  },
  {
    id: 'frm_04',
    name: 'Rahul Vasant Jadhav',
    phone: '+91 97631 22910',
    village: 'Kavlapur',
    taluka: 'Miraj',
    district: 'Sangli',
    state: 'Maharashtra',
    farmSizeAcres: 8.5,
    cropsGrown: ['Turmeric', 'Ginger', 'Chilli'],
    expectedHarvests: [
      { crop: 'Turmeric', expectedTonnes: 18, expectedDate: '2026-08-30', variety: 'Salem Golden' },
      { crop: 'Ginger', expectedTonnes: 10, expectedDate: '2026-09-12', variety: 'Rio de Janeiro' }
    ],
    status: 'ACTIVE',
    totalSuppliedTonnes: 94.0,
    totalPaymentsReceived: 620000,
    rating: 5.0,
    joinedDate: '2025-06-20'
  },
  {
    id: 'frm_05',
    name: 'Dnyaneshwar Shinde',
    phone: '+91 98811 77209',
    village: 'Pimpalgaon Baswant',
    taluka: 'Niphad',
    district: 'Nashik',
    state: 'Maharashtra',
    farmSizeAcres: 14.0,
    cropsGrown: ['Red Onion', 'Tomato', 'Garlic'],
    expectedHarvests: [
      { crop: 'Red Onion', expectedTonnes: 35, expectedDate: '2026-09-01', variety: 'Bhima Super' }
    ],
    status: 'PENDING',
    totalSuppliedTonnes: 0,
    totalPaymentsReceived: 0,
    rating: 4.5,
    joinedDate: '2026-08-20'
  }
];

// ==========================================
// 2. HARVEST COLLECTION & PICKUP LOGISTICS
// ==========================================
export const initialCollectionRequests: HarvestCollectionRequest[] = [
  {
    id: 'col_101',
    farmerId: 'frm_01',
    farmerName: 'Ramesh Patil',
    farmerPhone: '+91 98224 55102',
    crop: 'Tomato',
    variety: 'Abhinav Hybrid (Red)',
    expectedTonnes: 8.5,
    actualTonnes: 8.42,
    collectionDate: '2026-08-25',
    village: 'Palkhed Farm Gate #2',
    district: 'Nashik',
    assignedVehicle: 'Eicher Pro 3015 (MH-15-EG-4402)',
    assignedDriver: 'Santosh Gaikwad',
    driverPhone: '+91 98231 11405',
    status: 'IN_TRANSIT',
    eta: 'Today, 03:30 PM',
    notes: 'Requires ventilated plastic crates for transport to Nashik Central Packhouse.'
  },
  {
    id: 'col_102',
    farmerId: 'frm_04',
    farmerName: 'Rahul Jadhav',
    farmerPhone: '+91 97631 22910',
    crop: 'Turmeric',
    variety: 'Salem Golden',
    expectedTonnes: 12.0,
    actualTonnes: 12.15,
    collectionDate: '2026-08-26',
    village: 'Kavlapur Farm Gate #1',
    district: 'Sangli',
    assignedVehicle: 'Tata 407 LPT (MH-10-CT-8921)',
    assignedDriver: 'Pravin Mane',
    driverPhone: '+91 99214 66320',
    status: 'SCHEDULED',
    eta: 'Tomorrow, 09:00 AM',
    notes: 'Sun-dried rhizomes bagged in 50kg jute sacks.'
  },
  {
    id: 'col_103',
    farmerId: 'frm_02',
    farmerName: 'Sunita Deshmukh',
    farmerPhone: '+91 94221 88304',
    crop: 'Soybean',
    variety: 'JS 335',
    expectedTonnes: 20.0,
    actualTonnes: 20.05,
    collectionDate: '2026-08-24',
    village: 'Ausa Khurd Yard',
    district: 'Latur',
    assignedVehicle: 'BharatBenz 1617R (MH-24-AA-5519)',
    assignedDriver: 'Ashok Shinde',
    driverPhone: '+91 98810 44299',
    status: 'COLLECTED',
    eta: 'Completed (Weighment pending)',
    notes: 'Stored in covered bulk trailer. Direct transit to warehouse silo.'
  }
];

// ==========================================
// 3. DIGITAL WEIGHING SLIPS
// ==========================================
export const initialWeighingSlips: WeighingSlip[] = [
  {
    id: 'ws_901',
    collectionRequestId: 'col_101',
    batchId: 'BATCH-TOM-2026-0824',
    farmerName: 'Ramesh Patil',
    crop: 'Tomato',
    variety: 'Abhinav Hybrid (Red)',
    grossWeightKg: 14820,
    tareWeightKg: 6400,
    netWeightKg: 8420,
    moisturePercent: 88.2,
    damagedPercent: 1.4,
    foreignMatterPercent: 0.2,
    calculatedGrade: 'A',
    weighmentTime: '2026-08-24 14:15 IST',
    operatorName: 'Anil Bhamare (Weighbridge #01)',
    weighbridgeLocation: 'Dindori APMC Hub Weighbridge'
  },
  {
    id: 'ws_902',
    collectionRequestId: 'col_103',
    batchId: 'BATCH-SOY-2026-0823',
    farmerName: 'Sunita Deshmukh',
    crop: 'Soybean',
    variety: 'JS 335',
    grossWeightKg: 28450,
    tareWeightKg: 8400,
    netWeightKg: 20050,
    moisturePercent: 9.8,
    damagedPercent: 1.1,
    foreignMatterPercent: 0.5,
    calculatedGrade: 'A+',
    weighmentTime: '2026-08-24 11:30 IST',
    operatorName: 'Mahesh Solanke',
    weighbridgeLocation: 'Latur Central Warehouse Silo'
  }
];

// ==========================================
// 4. DIGITAL QUALITY INSPECTION REPORTS
// ==========================================
export const initialQualityReports: QualityReport[] = [
  {
    id: 'qc_301',
    batchId: 'BATCH-TOM-2026-0824',
    crop: 'Tomato',
    farmerOrSupplier: 'Ramesh Patil (Palkhed)',
    date: '2026-08-24',
    assignedGrade: 'A',
    parameters: {
      size: 'Uniform',
      color: 'Deep Natural',
      moisturePercent: 88.2,
      damagePercent: 1.4,
      diseasePercent: 0.0,
      foreignMaterialPercent: 0.2,
      ripeness: 'Optimal',
      avgWeightGrams: 85
    },
    inspectorName: 'Dr. Vivek Joshi (Govt Certified Ag Quality Auditor)',
    decision: 'ACCEPT',
    certificateUrl: 'https://krishigrow.org/cert/QC-TOM-8420.pdf'
  },
  {
    id: 'qc_302',
    batchId: 'BATCH-ONI-2026-0822',
    crop: 'Red Onion',
    farmerOrSupplier: 'Lasalgaon Mandi Lot #44',
    date: '2026-08-22',
    assignedGrade: 'A+',
    parameters: {
      size: 'Large',
      color: 'Deep Natural',
      moisturePercent: 11.5,
      damagePercent: 0.8,
      diseasePercent: 0.0,
      foreignMaterialPercent: 0.1,
      ripeness: 'Optimal',
      avgWeightGrams: 95
    },
    inspectorName: 'Pooja Kulkarni (Quality Specialist)',
    decision: 'ACCEPT',
    certificateUrl: 'https://krishigrow.org/cert/QC-ONI-15000.pdf'
  }
];

// ==========================================
// 5. AGGREGATOR INVENTORY & WAREHOUSING
// ==========================================
export const initialAggregatorInventory: AggregatorInventoryItem[] = [
  {
    id: 'inv_01',
    crop: 'Red Onion',
    variety: 'Nashik Red F1',
    grade: 'A',
    batchId: 'BATCH-ONI-2026-0822',
    warehouse: 'Lasalgaon Mega Godown B-4',
    storageLocation: 'Bay 12, Rack A',
    entryDate: '2026-08-22',
    totalQuantityKg: 25000,
    availableQuantityKg: 20000,
    reservedQuantityKg: 5000,
    expectedShelfLifeDays: 90,
    daysInStorage: 2,
    spoilageRisk: 'LOW',
    purchasePricePerKg: 21.50
  },
  {
    id: 'inv_02',
    crop: 'Tomato',
    variety: 'Abhinav Hybrid (Red)',
    grade: 'A',
    batchId: 'BATCH-TOM-2026-0824',
    warehouse: 'Nashik Agro Cold Storage Chamber 2',
    storageLocation: 'Cold Room 02 (4°C, 90% RH)',
    entryDate: '2026-08-24',
    totalQuantityKg: 8420,
    availableQuantityKg: 8420,
    reservedQuantityKg: 0,
    expectedShelfLifeDays: 21,
    daysInStorage: 0,
    spoilageRisk: 'LOW',
    purchasePricePerKg: 24.00
  },
  {
    id: 'inv_03',
    crop: 'Soybean',
    variety: 'JS 335',
    grade: 'A+',
    batchId: 'BATCH-SOY-2026-0823',
    warehouse: 'Latur APMC Warehouse Silo #3',
    storageLocation: 'Silo Tank 03 (Dry Aerated)',
    entryDate: '2026-08-23',
    totalQuantityKg: 45000,
    availableQuantityKg: 35000,
    reservedQuantityKg: 10000,
    expectedShelfLifeDays: 300,
    daysInStorage: 1,
    spoilageRisk: 'LOW',
    purchasePricePerKg: 58.00
  },
  {
    id: 'inv_04',
    crop: 'Wheat',
    variety: 'Lok-1',
    grade: 'A',
    batchId: 'BATCH-WHT-2026-0818',
    warehouse: 'Pune Baramati Central Warehouse',
    storageLocation: 'Dry Bay 08',
    entryDate: '2026-08-18',
    totalQuantityKg: 60000,
    availableQuantityKg: 40000,
    reservedQuantityKg: 20000,
    expectedShelfLifeDays: 365,
    daysInStorage: 6,
    spoilageRisk: 'LOW',
    purchasePricePerKg: 24.50
  }
];

// ==========================================
// 6. AGGREGATOR MARKET B2B SELLING OFFERS
// ==========================================
export const initialMarketOffers: AggregatorMarketOffer[] = [
  {
    id: 'off_501',
    crop: 'Red Onion',
    variety: 'Nashik Red F1',
    grade: 'A',
    quantityKg: 15000,
    expectedPricePerKg: 26.50,
    location: 'Lasalgaon Godown B-4, Nashik',
    availableFromDate: '2026-08-25',
    sellerName: 'MahaAgri Aggregators FPC',
    sellerPhone: '+91 98220 99441',
    status: 'OPEN',
    receivedBidsCount: 4,
    highestBidPricePerKg: 25.80
  },
  {
    id: 'off_502',
    crop: 'Tomato',
    variety: 'Abhinav Hybrid (Red)',
    grade: 'A',
    quantityKg: 8000,
    expectedPricePerKg: 29.00,
    location: 'Pimpalgaon Packhouse, Nashik',
    availableFromDate: '2026-08-25',
    sellerName: 'MahaAgri Aggregators FPC',
    sellerPhone: '+91 98220 99441',
    status: 'OPEN',
    receivedBidsCount: 3,
    highestBidPricePerKg: 28.50
  },
  {
    id: 'off_503',
    crop: 'Soybean',
    variety: 'JS 335 High Oil Content',
    grade: 'A+',
    quantityKg: 30000,
    expectedPricePerKg: 64.00,
    location: 'Latur Silo Depot, Latur',
    availableFromDate: '2026-08-26',
    sellerName: 'Marathwada Farmers Alliance',
    sellerPhone: '+91 94220 33812',
    status: 'ACCEPTED',
    receivedBidsCount: 6,
    highestBidPricePerKg: 63.50
  }
];

// ==========================================
// 7. PROCESSOR: MACHINE TELEMETRY & STATUS
// ==========================================
export const initialProcessingMachines: ProcessingMachine[] = [
  {
    id: 'mch_01',
    name: 'Industrial Tomato Pulper & Puree Line #02',
    code: 'TP-02',
    type: 'Pulping & Hot Break Refining',
    status: 'RUNNING',
    capacityTonnesPerHour: 2.5,
    todayOutputTonnes: 16.2,
    temperatureCelsius: 88.5,
    powerConsumptionKw: 45.2,
    nextMaintenanceDate: '2026-09-24',
    lastMaintenanceDate: '2026-08-10',
    operatorInCharge: 'Nitin Salunkhe'
  },
  {
    id: 'mch_02',
    name: 'Ultra-Fine Turmeric & Spice Grinder #01',
    code: 'TG-01',
    type: 'Cryogenic Hammer Mill',
    status: 'RUNNING',
    capacityTonnesPerHour: 1.2,
    todayOutputTonnes: 8.4,
    temperatureCelsius: 42.0,
    powerConsumptionKw: 32.0,
    nextMaintenanceDate: '2026-09-18',
    lastMaintenanceDate: '2026-08-12',
    operatorInCharge: 'Ganesh More'
  },
  {
    id: 'mch_03',
    name: 'Soybean Oil Expeller & Solvent Extractor',
    code: 'SO-03',
    type: 'Continuous Screw Press',
    status: 'IDLE',
    capacityTonnesPerHour: 4.0,
    todayOutputTonnes: 0.0,
    nextMaintenanceDate: '2026-09-02',
    lastMaintenanceDate: '2026-08-01',
    operatorInCharge: 'Vikram Bhosale'
  },
  {
    id: 'mch_04',
    name: 'Multi-Deck Grain Destoner & Gravity Separator',
    code: 'GS-04',
    type: 'Optical Sorting & Grading',
    status: 'MAINTENANCE',
    capacityTonnesPerHour: 5.0,
    todayOutputTonnes: 4.5,
    nextMaintenanceDate: '2026-08-25',
    lastMaintenanceDate: '2026-07-28',
    operatorInCharge: 'Sunil Jagtap'
  }
];

// ==========================================
// 8. PROCESSOR: PACKAGING & QR TRACEABILITY BATCHES
// ==========================================
export const initialPackagingBatches: PackagingBatch[] = [
  {
    id: 'pkg_101',
    batchId: 'PKG-TP-2026-0824',
    productName: 'Krishi Grow Pure Tomato Puree (Brix 28%)',
    rawMaterialSource: {
      crop: 'Tomato (Abhinav Hybrid)',
      rawBatchId: 'BATCH-TOM-2026-0824',
      aggregator: 'MahaAgri Aggregators FPC',
      farmer: 'Ramesh Balasaheb Patil',
      farmOrigin: 'Palkhed, Dindori, Nashik (20.201°N, 73.832°E)'
    },
    packageSize: '850 g Tin / Pouch',
    quantityUnits: 4500,
    manufacturingDate: '2026-08-24',
    expiryDate: '2027-08-24',
    packagingMaterial: 'Food-Grade Multi-layer Foil Standup Pouch',
    barcode: '8901030994821',
    qrCodeUrl: 'https://krishigrow.org/trace/PKG-TP-2026-0824',
    nutritionalGrade: 'Grade A+ (No Artificial Preservatives)',
    status: 'PACKAGED'
  },
  {
    id: 'pkg_102',
    batchId: 'PKG-TG-2026-0045',
    productName: 'Krishi Grow Salem Pure Turmeric Powder (Curcumin 4.5%)',
    rawMaterialSource: {
      crop: 'Turmeric (Salem Golden)',
      rawBatchId: 'BATCH-TUR-2026-0820',
      aggregator: 'Sangli Agro Processing Consortium',
      farmer: 'Rahul Vasant Jadhav',
      farmOrigin: 'Kavlapur, Miraj, Sangli (16.820°N, 74.650°E)'
    },
    packageSize: '500 g Zip-Lock Pouch',
    quantityUnits: 8000,
    manufacturingDate: '2026-08-24',
    expiryDate: '2028-08-24',
    packagingMaterial: 'Bio-Degradable Nitrogen Flushed Matte Barrier Pouch',
    barcode: '8901030998814',
    qrCodeUrl: 'https://krishigrow.org/trace/PKG-TG-2026-0045',
    nutritionalGrade: 'AGMARK Certified Special Grade',
    status: 'PACKAGED'
  }
];

// ==========================================
// 9. PROCESSOR: FINISHED GOODS WAREHOUSE
// ==========================================
export const initialFinishedGoods: FinishedGoodsItem[] = [
  {
    id: 'fg_01',
    productName: 'Krishi Grow Pure Tomato Puree 850g',
    batchId: 'PKG-TP-2026-0824',
    category: 'Processed Food / Purees',
    unitsInStock: 4500,
    availableUnits: 3500,
    reservedUnits: 1000,
    unitPrice: 85.00,
    warehouseLocation: 'Nashik Central Processing Facility - Shelf F-01',
    mfgDate: '2026-08-24',
    expiryDate: '2027-08-24',
    shelfLifeRemainingDays: 365
  },
  {
    id: 'fg_02',
    productName: 'Krishi Grow Salem Turmeric Powder 500g',
    batchId: 'PKG-TG-2026-0045',
    category: 'Spices & Seasoning',
    unitsInStock: 8000,
    availableUnits: 6500,
    reservedUnits: 1500,
    unitPrice: 140.00,
    warehouseLocation: 'Sangli Spice Unit - Zone C',
    mfgDate: '2026-08-24',
    expiryDate: '2028-08-24',
    shelfLifeRemainingDays: 730
  }
];

// ==========================================
// 10. PROCESSOR: WASTE ANALYTICS RECORDS
// ==========================================
export const initialWasteRecords: WasteRecord[] = [
  {
    id: 'wst_01',
    date: '2026-08-24',
    processName: 'Tomato Puree Extraction Line #02',
    inputRawKg: 10000,
    outputProductKg: 6800,
    wasteKg: 3200,
    wastePercentage: 32.0,
    wasteCategory: 'Peelings & Stems',
    byProductUtilization: 'Sold to Cattle Feed & Organic Vermicompost Plant at ₹1.80/kg'
  },
  {
    id: 'wst_02',
    date: '2026-08-23',
    processName: 'Turmeric Cleaning & Cryo-Grinding',
    inputRawKg: 5000,
    outputProductKg: 4620,
    wasteKg: 380,
    wastePercentage: 7.6,
    wasteCategory: 'Defective Raw',
    byProductUtilization: 'Dye extraction unit & Natural Pigment secondary market'
  }
];

// ==========================================
// 11. WHOLESALER: B2B CUSTOMER CRM
// ==========================================
export const initialWholesalerCustomers: WholesalerCustomer[] = [
  {
    id: 'cust_01',
    businessName: 'Radhakrishna Retail Marts Chain (24 Outlets)',
    contactPerson: 'Kailash Singhania',
    phone: '+91 98201 55900',
    email: 'procure@rkmarts.com',
    type: 'RETAILER',
    city: 'Mumbai',
    state: 'Maharashtra',
    creditLimit: 1500000,
    outstandingBalance: 320000,
    totalOrdersCount: 42,
    totalOrderValue: 5480000,
    status: 'ACTIVE'
  },
  {
    id: 'cust_02',
    businessName: 'Barbeque Nation & Grand Treat Hotels Group',
    contactPerson: 'Sanjay Deshpande (Head of F&B)',
    phone: '+91 99200 44123',
    email: 'supply@grandtreat.in',
    type: 'HOTEL',
    city: 'Pune',
    state: 'Maharashtra',
    creditLimit: 800000,
    outstandingBalance: 145000,
    totalOrdersCount: 28,
    totalOrderValue: 2840000,
    status: 'ACTIVE'
  },
  {
    id: 'cust_03',
    businessName: 'Sahyadri Agro Processing & Export Ltd',
    contactPerson: 'Anand Patil',
    phone: '+91 97640 11994',
    email: 'anand@sahyadriagro.com',
    type: 'EXPORTER',
    city: 'Navi Mumbai',
    state: 'Maharashtra',
    creditLimit: 3000000,
    outstandingBalance: 850000,
    totalOrdersCount: 65,
    totalOrderValue: 12400000,
    status: 'ACTIVE'
  }
];

// ==========================================
// 12. WHOLESALER: BULK SALES ORDERS & DISPATCH
// ==========================================
export const initialBulkSalesOrders: BulkSalesOrder[] = [
  {
    id: 'ord_wh_1092',
    orderNumber: 'SO-WH-2026-1092',
    customerName: 'Radhakrishna Retail Marts',
    customerPhone: '+91 98201 55900',
    customerType: 'Retail Chain',
    cropOrProduct: 'Red Onion',
    grade: 'A',
    quantityKg: 5000,
    pricePerKg: 26.00,
    totalAmount: 130000,
    orderDate: '2026-08-24',
    deliveryDate: '2026-08-25',
    destinationCity: 'Vashi APMC Hub, Navi Mumbai',
    status: 'DISPATCHED',
    paymentStatus: 'PAID',
    assignedVehicle: 'Ashok Leyland Dost (MH-15-BD-3391)',
    driverName: 'Suresh Patil',
    driverPhone: '+91 98221 44021'
  },
  {
    id: 'ord_wh_1093',
    orderNumber: 'SO-WH-2026-1093',
    customerName: 'Barbeque Nation & Grand Treat Hotels',
    customerPhone: '+91 99200 44123',
    customerType: 'Hospitality',
    cropOrProduct: 'Tomato',
    grade: 'A',
    quantityKg: 2500,
    pricePerKg: 31.50,
    totalAmount: 78750,
    orderDate: '2026-08-24',
    deliveryDate: '2026-08-25',
    destinationCity: 'Koregaon Park, Pune',
    status: 'CONFIRMED',
    paymentStatus: 'PARTIALLY_PAID',
    assignedVehicle: 'Mahindra Bolero Maxi Truck (MH-12-PQ-9081)',
    driverName: 'Dattatray Shirole',
    driverPhone: '+91 98500 77119'
  },
  {
    id: 'ord_wh_1094',
    orderNumber: 'SO-WH-2026-1094',
    customerName: 'Sahyadri Agro Processing & Export Ltd',
    customerPhone: '+91 97640 11994',
    customerType: 'Export House',
    cropOrProduct: 'Soybean (Grade A+)',
    grade: 'A+',
    quantityKg: 10000,
    pricePerKg: 66.00,
    totalAmount: 660000,
    orderDate: '2026-08-23',
    deliveryDate: '2026-08-24',
    destinationCity: 'JNPT Port Container Freight Station',
    status: 'DELIVERED',
    paymentStatus: 'PAID',
    assignedVehicle: 'Tata Signa 2823 (MH-46-AR-8802)',
    driverName: 'Haribhau Shinde',
    driverPhone: '+91 98211 55902'
  }
];

// ==========================================
// 13. WHOLESALER: PROFIT & COST BREAKDOWN ANALYTICS
// ==========================================
export const initialProfitAnalytics: ProfitAnalyticsBreakdown[] = [
  {
    crop: 'Red Onion (Grade A)',
    purchaseCost: 107500, // 5000kg @ 21.50
    transportCost: 5000,
    storageCost: 2000,
    handlingCost: 1000,
    otherCost: 500,
    totalCost: 116000,
    sellingRevenue: 130000, // 5000kg @ 26.00
    netProfit: 14000,
    marginPercent: 10.77
  },
  {
    crop: 'Tomato (Abhinav Hybrid)',
    purchaseCost: 60000, // 2500kg @ 24.00
    transportCost: 4500,
    storageCost: 1500,
    handlingCost: 800,
    otherCost: 400,
    totalCost: 67200,
    sellingRevenue: 78750, // 2500kg @ 31.50
    netProfit: 11550,
    marginPercent: 14.67
  },
  {
    crop: 'Soybean (Grade A+)',
    purchaseCost: 580000, // 10000kg @ 58.00
    transportCost: 12000,
    storageCost: 4000,
    handlingCost: 2500,
    otherCost: 1500,
    totalCost: 600000,
    sellingRevenue: 660000, // 10000kg @ 66.00
    netProfit: 60000,
    marginPercent: 9.09
  }
];
