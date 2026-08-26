export type UserRole = 'FARMER' | 'BUYER' | 'ADMIN';
export type BuyerType = 'AGGREGATOR' | 'PROCESSOR' | 'WHOLESALER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  buyerType?: BuyerType;
  phone: string;
  state: string;
  district: string;
  taluka?: string;
  village?: string;
  farmSizeAcres?: number;
  businessName?: string;
  address?: string;
}

export type QuantityUnit = 'kg' | 'quintal' | 'tonne';
export type QualityGrade = 'A+' | 'A' | 'B' | 'C' | 'Rejected' | 'Export';

export interface CropRecord {
  id: string;
  farmerId: string;
  farmerName: string;
  name: string;
  category: string;
  variety: string;
  quantity: number;
  unit: QuantityUnit;
  grade: QualityGrade;
  moisturePercent?: number;
  damagePercent?: number;
  isOrganic: boolean;
  harvestDate: string;
  estimatedShelfLifeDays: number;
  daysRemaining: number;
  storageCondition: string;
  location: {
    state: string;
    district: string;
    taluka?: string;
    village?: string;
    lat: number;
    lng: number;
  };
  imageUrl?: string;
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD';
  createdAt: string;
}

export interface TransportCalculation {
  cropName: string;
  quantityTonnes: number;
  pickupLocation: string;
  destination: string;
  vehicleType: 'PICKUP_1T' | 'EICHER_3.5T' | 'TRUCK_10T' | 'CONTAINER_24T';
  distanceKm: number;
  travelTimeHours: number;
  vehicleCapacityTonnes: number;
  baseCharge: number;
  distanceCharge: number;
  loadingCharge: number;
  unloadingCharge: number;
  tollCharges: number;
  totalCost: number;
  costPerKg: number;
  providerName: string;
}

export interface DailyForecast {
  day: string;
  tempMax: number;
  tempMin: number;
  condition: 'Sunny' | 'Partly Cloudy' | 'Rain' | 'Thunderstorm';
  rainProbability: number;
}

export interface WeatherAdvisory {
  location: string;
  currentTemp: number;
  condition: string;
  humidity: number;
  rainProbability: number;
  windSpeedKm: number;
  forecast: DailyForecast[];
  cropRisks: {
    crop: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    message: string;
    recommendation: string;
  }[];
}

export interface StorageFacility {
  id: string;
  name: string;
  type: 'COLD_STORAGE' | 'DRY_WAREHOUSE' | 'SILO';
  location: string;
  distanceKm: number;
  totalCapacityTonnes: number;
  availableCapacityTonnes: number;
  pricePerTonDay: number;
  contactPhone: string;
  features: string[];
}

export interface ProcessingFacility {
  id: string;
  name: string;
  cropsAccepted: string[];
  processingTypes: string[];
  dailyCapacityTonnes: number;
  location: string;
  distanceKm: number;
  contactPhone: string;
  minBatchTonnes: number;
}

export interface GovernmentScheme {
  id: string;
  name: string;
  agency: string;
  description: string;
  eligibility: string;
  subsidyBenefit: string;
  requiredDocuments: string[];
  applicationUrl: string;
  applicableCrops: string[];
  applicableStates: string[];
  maxSubsidyAmount: string;
  lastVerifiedDate: string;
}

export interface ProductRecommendation {
  id: string;
  rawCrop: string;
  targetProduct: string;
  opportunityScore: number;
  marketDemand: 'HIGH' | 'VERY_HIGH' | 'MODERATE';
  investmentLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  estimatedMarginPercent: number;
  rawMaterialSuitability: string;
  nearbyInfra: string;
  shelfLifeExtensionDays: number;
  whyRecommended: string[];
  image: string;
}

export interface MandiPrice {
  id: string;
  crop: string;
  marketName: string;
  district: string;
  state: string;
  date: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  price?: number;
  unit: string;
  trend: 'UP' | 'DOWN' | 'STABLE';
}

export interface BuyerRequirement {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerType: BuyerType;
  crop: string;
  variety: string;
  quantityRequiredTonnes: number;
  minGrade: QualityGrade;
  targetPricePerQuintal: number;
  pickupRegion: string;
  requiredByDate: string;
  frequency: 'ONE_TIME' | 'WEEKLY' | 'MONTHLY';
  notes: string;
  matchScore?: number;
}

export interface ConnectionRequest {
  id: string;
  farmerId: string;
  farmerName: string;
  buyerId: string;
  buyerName: string;
  cropName: string;
  quantityTonnes: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  requestDate: string;
  farmerPhone?: string;
  buyerPhone?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'MATCH' | 'PRICE' | 'ALERT' | 'SYSTEM' | 'ORDER' | 'QC';
  timestamp: string;
  isRead: boolean;
}

export interface AIDiagnosticResult {
  diseaseName: string;
  confidencePercent: number;
  severity: 'MILD' | 'MODERATE' | 'SEVERE';
  symptoms: string[];
  treatmentPlan: string[];
  preventiveMeasures: string[];
}

// ==========================================
// SUPPLY CHAIN: AGGREGATOR MODULE TYPES
// ==========================================

export interface AggregatorFarmer {
  id: string;
  name: string;
  phone: string;
  village: string;
  taluka: string;
  district: string;
  state: string;
  farmSizeAcres: number;
  cropsGrown: string[];
  expectedHarvests: {
    crop: string;
    expectedTonnes: number;
    expectedDate: string;
    variety: string;
  }[];
  status: 'ACTIVE' | 'PENDING' | 'REJECTED';
  totalSuppliedTonnes: number;
  totalPaymentsReceived: number;
  rating: number;
  joinedDate: string;
}

export interface HarvestCollectionRequest {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  crop: string;
  variety: string;
  expectedTonnes: number;
  actualTonnes?: number;
  collectionDate: string;
  village: string;
  district: string;
  assignedVehicle: string;
  assignedDriver: string;
  driverPhone: string;
  status: 'SCHEDULED' | 'IN_TRANSIT' | 'COLLECTED' | 'WEIGHED' | 'CANCELLED';
  eta: string;
  notes?: string;
}

export interface WeighingSlip {
  id: string;
  collectionRequestId?: string;
  batchId: string;
  farmerName: string;
  crop: string;
  variety: string;
  grossWeightKg: number;
  tareWeightKg: number;
  netWeightKg: number;
  moisturePercent: number;
  damagedPercent: number;
  foreignMatterPercent: number;
  calculatedGrade: QualityGrade;
  weighmentTime: string;
  operatorName: string;
  weighbridgeLocation: string;
}

export interface QualityReport {
  id: string;
  batchId: string;
  crop: string;
  farmerOrSupplier: string;
  date: string;
  assignedGrade: QualityGrade;
  parameters: {
    size: 'Large' | 'Medium' | 'Small' | 'Uniform';
    color: 'Deep Natural' | 'Moderate' | 'Faded / Uneven';
    moisturePercent: number;
    damagePercent: number;
    diseasePercent: number;
    foreignMaterialPercent: number;
    ripeness: 'Optimal' | 'Overripe' | 'Underripe';
    avgWeightGrams?: number;
  };
  inspectorName: string;
  decision: 'ACCEPT' | 'PARTIALLY_ACCEPT' | 'REJECT';
  rejectionReason?: string;
  qualityImages?: string[];
  certificateUrl?: string;
}

export interface AggregatorInventoryItem {
  id: string;
  crop: string;
  variety: string;
  grade: QualityGrade;
  batchId: string;
  warehouse: string;
  storageLocation: string;
  entryDate: string;
  totalQuantityKg: number;
  availableQuantityKg: number;
  reservedQuantityKg: number;
  expectedShelfLifeDays: number;
  daysInStorage: number;
  spoilageRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  purchasePricePerKg: number;
}

export interface AggregatorMarketOffer {
  id: string;
  crop: string;
  variety: string;
  grade: QualityGrade;
  quantityKg: number;
  expectedPricePerKg: number;
  location: string;
  availableFromDate: string;
  sellerName: string;
  sellerPhone: string;
  status: 'OPEN' | 'ACCEPTED' | 'NEGOTIATING' | 'FULFILLED';
  receivedBidsCount: number;
  highestBidPricePerKg?: number;
}

// ==========================================
// SUPPLY CHAIN: PROCESSOR MODULE TYPES
// ==========================================

export interface ProcessingMachine {
  id: string;
  name: string;
  code: string;
  type: string;
  status: 'RUNNING' | 'IDLE' | 'MAINTENANCE' | 'BREAKDOWN';
  capacityTonnesPerHour: number;
  todayOutputTonnes: number;
  temperatureCelsius?: number;
  powerConsumptionKw?: number;
  nextMaintenanceDate: string;
  lastMaintenanceDate: string;
  operatorInCharge: string;
}

export interface PackagingBatch {
  id: string;
  batchId: string;
  productName: string;
  rawMaterialSource: {
    crop: string;
    rawBatchId: string;
    aggregator: string;
    farmer: string;
    farmOrigin: string;
  };
  packageSize: string;
  quantityUnits: number;
  manufacturingDate: string;
  expiryDate: string;
  packagingMaterial: string;
  barcode: string;
  qrCodeUrl: string;
  nutritionalGrade: string;
  status: 'PACKAGED' | 'IN_WAREHOUSE' | 'DISPATCHED';
}

export interface FinishedGoodsItem {
  id: string;
  productName: string;
  batchId: string;
  category: string;
  unitsInStock: number;
  availableUnits: number;
  reservedUnits: number;
  unitPrice: number;
  warehouseLocation: string;
  mfgDate: string;
  expiryDate: string;
  shelfLifeRemainingDays: number;
}

export interface WasteRecord {
  id: string;
  date: string;
  processName: string;
  inputRawKg: number;
  outputProductKg: number;
  wasteKg: number;
  wastePercentage: number;
  wasteCategory: 'Organic Pulp / Husk' | 'Peelings & Stems' | 'Defective Raw' | 'Effluent Waste';
  byProductUtilization: string;
}

// ==========================================
// SUPPLY CHAIN: WHOLESALER MODULE TYPES
// ==========================================

export interface WholesalerCustomer {
  id: string;
  businessName: string;
  contactPerson: string;
  phone: string;
  email: string;
  type: 'RETAILER' | 'RESTAURANT_CHAIN' | 'HOTEL' | 'EXPORTER' | 'PROCESSOR';
  city: string;
  state: string;
  creditLimit: number;
  outstandingBalance: number;
  totalOrdersCount: number;
  totalOrderValue: number;
  status: 'ACTIVE' | 'ON_HOLD';
}

export interface BulkSalesOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerType: string;
  cropOrProduct: string;
  grade: QualityGrade;
  quantityKg: number;
  pricePerKg: number;
  totalAmount: number;
  orderDate: string;
  deliveryDate: string;
  destinationCity: string;
  status: 'CONFIRMED' | 'PACKED' | 'DISPATCHED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PAID' | 'PARTIALLY_PAID' | 'PENDING';
  assignedVehicle?: string;
  driverName?: string;
  driverPhone?: string;
}

export interface ProfitAnalyticsBreakdown {
  crop: string;
  purchaseCost: number;
  transportCost: number;
  storageCost: number;
  handlingCost: number;
  otherCost: number;
  totalCost: number;
  sellingRevenue: number;
  netProfit: number;
  marginPercent: number;
}

// ==========================================
// UNIVERSAL SUPPLY CHAIN DOCUMENTS & TRANSACTIONS
// ==========================================

export interface SupplyChainDocument {
  id: string;
  type: 'PURCHASE_ORDER' | 'SALES_INVOICE' | 'QUALITY_CERTIFICATE' | 'TRACEABILITY_PASSPORT' | 'WAYBILL';
  docNumber: string;
  date: string;
  issuerName: string;
  issuerRole: string;
  recipientName: string;
  cropOrProduct: string;
  quantity: string;
  grade?: string;
  amount?: number;
  status: string;
  metadata: Record<string, any>;
}
