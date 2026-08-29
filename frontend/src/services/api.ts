import type {
  TransportCalculation, WeatherAdvisory, ProductRecommendation,
  BuyerRequirement, CropRecord, AIDiagnosticResult, MandiPrice,
  StorageFacility, ProcessingFacility, GovernmentScheme, ConnectionRequest,
  NotificationItem
} from '../types';
import { supabase } from '../lib/supabase';
import { productRecommendations } from '../data/mockData';

// --- SUPABASE FETCH FUNCTIONS ---

export const fetchCropsFromSupabase = async (): Promise<CropRecord[]> => {
  const { data, error } = await supabase.from('crops').select('*').order('created_at', { ascending: false });
  if (error || !data) {
    console.error('Error fetching crops from Supabase:', error);
    return [];
  }
  return data.map((c: any) => ({
    id: c.id,
    farmerId: c.farmer_id,
    farmerName: c.farmer_name,
    name: c.name,
    category: c.category,
    variety: c.variety,
    quantity: Number(c.quantity),
    unit: c.unit,
    grade: c.grade,
    moisturePercent: c.moisture_percent ? Number(c.moisture_percent) : undefined,
    damagePercent: c.damage_percent ? Number(c.damage_percent) : undefined,
    isOrganic: Boolean(c.is_organic),
    harvestDate: c.harvest_date,
    estimatedShelfLifeDays: Number(c.estimated_shelf_life_days),
    daysRemaining: Number(c.days_remaining),
    storageCondition: c.storage_condition,
    location: c.location,
    imageUrl: c.image_url,
    status: c.status,
    createdAt: c.created_at,
  }));
};

export const fetchMandiPricesFromSupabase = async (): Promise<MandiPrice[]> => {
  const { data, error } = await supabase.from('mandi_prices').select('*');
  if (error || !data) {
    console.error('Error fetching mandi prices from Supabase:', error);
    return [];
  }
  return data.map((m: any) => ({
    id: m.id,
    crop: m.crop,
    marketName: m.market_name,
    district: m.district,
    state: m.state,
    date: m.date,
    minPrice: Number(m.min_price),
    maxPrice: Number(m.max_price),
    modalPrice: Number(m.modal_price),
    unit: m.unit,
    trend: m.trend,
  }));
};

export const fetchStorageFacilitiesFromSupabase = async (): Promise<StorageFacility[]> => {
  const { data, error } = await supabase.from('storage_facilities').select('*');
  if (error || !data) {
    console.error('Error fetching storage facilities from Supabase:', error);
    return [];
  }
  return data.map((s: any) => ({
    id: s.id,
    name: s.name,
    type: s.type,
    location: s.location,
    distanceKm: Number(s.distance_km),
    totalCapacityTonnes: Number(s.total_capacity_tonnes),
    availableCapacityTonnes: Number(s.available_capacity_tonnes),
    pricePerTonDay: Number(s.price_per_ton_day),
    contactPhone: s.contact_phone,
    features: s.features || [],
  }));
};

export const fetchProcessingFacilitiesFromSupabase = async (): Promise<ProcessingFacility[]> => {
  const { data, error } = await supabase.from('processing_facilities').select('*');
  if (error || !data) {
    console.error('Error fetching processing facilities from Supabase:', error);
    return [];
  }
  return data.map((p: any) => ({
    id: p.id,
    name: p.name,
    cropsAccepted: p.crops_accepted || [],
    processingTypes: p.processing_types || [],
    dailyCapacityTonnes: Number(p.daily_capacity_tonnes),
    location: p.location,
    distanceKm: Number(p.distance_km),
    contactPhone: p.contact_phone,
    minBatchTonnes: Number(p.min_batch_tonnes),
  }));
};

export const fetchGovernmentSchemesFromSupabase = async (): Promise<GovernmentScheme[]> => {
  const { data, error } = await supabase.from('government_schemes').select('*');
  if (error || !data) {
    console.error('Error fetching government schemes from Supabase:', error);
    return [];
  }
  return data.map((g: any) => ({
    id: g.id,
    name: g.name,
    agency: g.agency,
    description: g.description,
    eligibility: g.eligibility,
    subsidyBenefit: g.subsidy_benefit,
    requiredDocuments: g.required_documents || [],
    applicationUrl: g.application_url,
    applicableCrops: g.applicable_crops || [],
    applicableStates: g.applicable_states || [],
    maxSubsidyAmount: g.max_subsidy_amount,
    lastVerifiedDate: g.last_verified_date,
  }));
};

export const fetchProductRecommendationsFromSupabase = async (): Promise<ProductRecommendation[]> => {
  const { data, error } = await supabase.from('product_recommendations').select('*');
  if (error || !data) {
    console.error('Error fetching product recommendations from Supabase:', error);
    return [];
  }
  return data.map((r: any) => ({
    id: r.id,
    rawCrop: r.raw_crop,
    targetProduct: r.target_product,
    opportunityScore: Number(r.opportunity_score),
    marketDemand: r.market_demand,
    investmentLevel: r.investment_level,
    estimatedMarginPercent: Number(r.estimated_margin_percent),
    rawMaterialSuitability: r.raw_material_suitability,
    nearbyInfra: r.nearby_infra,
    shelfLifeExtensionDays: Number(r.shelf_life_extension_days),
    whyRecommended: r.why_recommended || [],
    image: r.image,
  }));
};

export const fetchBuyerRequirementsFromSupabase = async (): Promise<BuyerRequirement[]> => {
  const { data, error } = await supabase.from('buyer_requirements').select('*');
  if (error || !data) {
    console.error('Error fetching buyer requirements from Supabase:', error);
    return [];
  }
  return data.map((b: any) => ({
    id: b.id,
    buyerId: b.buyer_id,
    buyerName: b.buyer_name,
    buyerType: b.buyer_type,
    crop: b.crop,
    variety: b.variety,
    quantityRequiredTonnes: Number(b.quantity_required_tonnes),
    minGrade: b.min_grade,
    targetPricePerQuintal: Number(b.target_price_per_quintal),
    pickupRegion: b.pickup_region,
    requiredByDate: b.required_by_date,
    frequency: b.frequency,
    notes: b.notes,
    matchScore: b.match_score ? Number(b.match_score) : 90,
  }));
};

export const fetchConnectionRequestsFromSupabase = async (): Promise<ConnectionRequest[]> => {
  const { data, error } = await supabase.from('connection_requests').select('*');
  if (error || !data) {
    console.error('Error fetching connection requests from Supabase:', error);
    return [];
  }
  return data.map((c: any) => ({
    id: c.id,
    farmerId: c.farmer_id,
    farmerName: c.farmer_name,
    buyerId: c.buyer_id,
    buyerName: c.buyer_name,
    cropName: c.crop_name,
    quantityTonnes: Number(c.quantity_tonnes),
    status: c.status,
    requestDate: c.request_date,
    farmerPhone: c.farmer_phone,
    buyerPhone: c.buyer_phone,
  }));
};

export const fetchNotificationsFromSupabase = async (): Promise<NotificationItem[]> => {
  const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
  if (error || !data) {
    console.error('Error fetching notifications from Supabase:', error);
    return [];
  }
  return data.map((n: any) => ({
    id: n.id,
    title: n.title,
    message: n.message,
    type: n.type,
    timestamp: n.timestamp,
    isRead: Boolean(n.is_read),
  }));
};

// --- LOGIC CALCULATIONS & SIMULATIONS ---

export const calculateTransportCost = (
  cropName: string,
  quantityTonnes: number,
  pickup: string,
  destination: string,
  vehicleType: 'PICKUP_1T' | 'EICHER_3.5T' | 'TRUCK_10T' | 'CONTAINER_24T'
): TransportCalculation => {
  const distanceMap: Record<string, number> = {
    'Nashik to Mumbai (Vashi APMC)': 165,
    'Nashik to Pune (Gultekdi APMC)': 210,
    'Nashik to Delhi (Azadpur Mandi)': 1180,
    'Nashik to Surat Market': 235,
    'Nashik to Local Storage (Mohadi)': 18,
  };

  const routeKey = `${pickup} to ${destination}`;
  const distanceKm = distanceMap[routeKey] || 180;
  const travelTimeHours = Math.round((distanceKm / 45) * 10) / 10;

  let vehicleCapacityTonnes = 1;
  let baseCharge = 1500;
  let perKmRate = 18;

  if (vehicleType === 'PICKUP_1T') {
    vehicleCapacityTonnes = 1.2;
    baseCharge = 1200;
    perKmRate = 16;
  } else if (vehicleType === 'EICHER_3.5T') {
    vehicleCapacityTonnes = 4.0;
    baseCharge = 2500;
    perKmRate = 24;
  } else if (vehicleType === 'TRUCK_10T') {
    vehicleCapacityTonnes = 10.0;
    baseCharge = 4500;
    perKmRate = 38;
  } else if (vehicleType === 'CONTAINER_24T') {
    vehicleCapacityTonnes = 24.0;
    baseCharge = 8500;
    perKmRate = 62;
  }

  const distanceCharge = Math.round(distanceKm * perKmRate);
  const loadingCharge = Math.round(quantityTonnes * 120);
  const unloadingCharge = Math.round(quantityTonnes * 100);
  const tollCharges = Math.round((distanceKm / 80) * 140);
  const totalCost = baseCharge + distanceCharge + loadingCharge + unloadingCharge + tollCharges;
  const costPerKg = Math.round((totalCost / (quantityTonnes * 1000)) * 100) / 100;

  return {
    cropName,
    quantityTonnes,
    pickupLocation: pickup,
    destination,
    vehicleType,
    distanceKm,
    travelTimeHours,
    vehicleCapacityTonnes,
    baseCharge,
    distanceCharge,
    loadingCharge,
    unloadingCharge,
    tollCharges,
    totalCost,
    costPerKg,
    providerName: vehicleType === 'CONTAINER_24T' ? 'MahaAgri Reefer Express' : 'Nashik Farmers Transport Co-op'
  };
};

export const fetchWeatherAdvisory = (location: string): WeatherAdvisory => {
  return {
    location,
    currentTemp: 29,
    condition: 'Partly Cloudy',
    humidity: 78,
    rainProbability: 35,
    windSpeedKm: 14,
    forecast: [
      { day: 'Today', tempMax: 30, tempMin: 22, condition: 'Partly Cloudy', rainProbability: 35 },
      { day: 'Fri', tempMax: 31, tempMin: 23, condition: 'Sunny', rainProbability: 10 },
      { day: 'Sat', tempMax: 28, tempMin: 21, condition: 'Rain', rainProbability: 80 },
      { day: 'Sun', tempMax: 27, tempMin: 20, condition: 'Rain', rainProbability: 65 },
      { day: 'Mon', tempMax: 29, tempMin: 22, condition: 'Partly Cloudy', rainProbability: 25 },
      { day: 'Tue', tempMax: 32, tempMin: 23, condition: 'Sunny', rainProbability: 5 },
      { day: 'Wed', tempMax: 33, tempMin: 24, condition: 'Sunny', rainProbability: 10 },
    ],
    cropRisks: [
      {
        crop: 'Tomato',
        riskLevel: 'HIGH',
        message: 'Expected rain on Saturday (80%) can cause fungal blight or fruit cracking in unharvested tomatoes.',
        recommendation: 'Harvest mature grade A tomatoes before Saturday evening or cover with polythene shade nets.'
      },
      {
        crop: 'Red Onion',
        riskLevel: 'LOW',
        message: 'High humidity (78%) in ventilated stores requires forced air blower operation.',
        recommendation: 'Run ventilation fans during noon hours to prevent neck rot in stored onions.'
      }
    ]
  };
};

export const getAIProductRecommendations = (cropName: string): ProductRecommendation[] => {
  const filtered = productRecommendations.filter(
    r => r.rawCrop.toLowerCase().includes(cropName.toLowerCase()) || cropName === 'ALL'
  );
  return filtered.length > 0 ? filtered : productRecommendations;
};

export const calculateMatchScore = (crop: CropRecord, req: BuyerRequirement): number => {
  let score = 50;
  if (crop.name.toLowerCase() === req.crop.toLowerCase()) score += 25;
  if (crop.grade === req.minGrade || crop.grade === 'A+' || crop.grade === 'A') score += 15;
  if (crop.quantity >= req.quantityRequiredTonnes * 0.5) score += 10;
  return Math.min(score, 98);
};

export const diagnoseCropHealthSimulation = async (cropName: string): Promise<AIDiagnosticResult> => {
  await new Promise((res) => setTimeout(res, 1500));
  if (cropName.toLowerCase().includes('tomato')) {
    return {
      diseaseName: 'Early Blight (Alternaria solani)',
      confidencePercent: 94,
      severity: 'MODERATE',
      symptoms: [
        'Concentric dark rings on lower leaves',
        'Yellow halos surrounding brown foliar spots',
        'Stem lesions near soil line'
      ],
      treatmentPlan: [
        'Apply Copper Oxychloride 50 WP @ 2.5g / Litre of water',
        'Spraying interval: 10-12 days during humid weather',
        'Remove and burn severely infected lower leaves'
      ],
      preventiveMeasures: [
        'Ensure 24-inch row spacing for adequate sunlight penetration',
        'Drip irrigation instead of overhead sprinklers to keep foliage dry'
      ]
    };
  } else {
    return {
      diseaseName: 'Purple Blotch (Alternaria porri)',
      confidencePercent: 91,
      severity: 'MILD',
      symptoms: [
        'Small water-soaked lesions turning purple-brown',
        'Tip dieback on older onion leaves'
      ],
      treatmentPlan: [
        'Spray Mancozeb 75 WP @ 2g / Litre water',
        'Add spreader sticker chemical (1ml/L) for better foliage adhesion'
      ],
      preventiveMeasures: [
        'Rotate crop with non-allium plants like legumes',
        'Avoid excessive nitrogen fertilization during late growth phase'
      ]
    };
  }
};

export const queryAgriAIResponse = (userPrompt: string): string => {
  const query = userPrompt.toLowerCase();

  if (query.includes('onion') && (query.includes('should i do') || query.includes('sell') || query.includes('price'))) {
    return `Based on current Lasalgaon Mandi data:
1. **Direct Market**: Red Onion prices are up 4.5% at ₹2,300/Quintal in Lasalgaon APMC.
2. **Dehydration Opportunity**: Maharashtra Dehydration (Sinnar, 45km away) is offering ₹2,450/Quintal for bulk batches (>10 Tonnes).
3. **Storage Advisory**: Your onion batch has 77 days remaining shelf life. Holding for 2 weeks is recommended as prices are projected to reach ₹2,600+ due to export demand.`;
  }

  if (query.includes('tomato')) {
    return `For your Tomato harvest:
1. **Price Trend**: Pimpalgaon APMC rate is ₹2,900/Quintal (Trending UP).
2. **Value Addition**: AgroPure (Ozar MIDC) converts tomatoes into concentrated puree with an estimated 34% margin.
3. **Weather Alert**: 80% rain expected this Saturday in Nashik — recommend harvesting ripe fruits immediately.`;
  }

  if (query.includes('transport') || query.includes('truck')) {
    return `Transport recommendations for Nashik:
- **Small Batches (< 3 Tonnes)**: 3.5T Eicher Truck (~₹24/km)
- **Bulk Batches (10 Tonnes)**: 10T 6-Wheeler Truck (~₹38/km)
- Cost to Mumbai Vashi APMC (165 km) for 10 Tonnes is approx ₹11,800 total (₹1.18 per kg).`;
  }

  return `Hello! I am **AgriAI**, your intelligent value-chain advisory assistant. 
I can analyze your crop details, calculate transportation options, recommend processing opportunities (like Tomato Puree or Dehydrated Onion), check weather risks, and find verified buyers near Nashik & Maharashtra. How can I assist you today?`;
};

// --- CUSTOMER SUPPORT API & SIMULATION ---

export const initialSupportTickets: SupportTicket[] = [
  {
    id: 'ticket_demo_1',
    ticketNumber: 'KG-FAR-2026-48201',
    userId: 'usr_farmer_demo',
    userName: 'Ramesh Patil',
    userRole: 'FARMER',
    userEmail: 'ramesh.patil@kisan.in',
    userPhone: '+91 98220 44556',
    category: 'PAYMENT_DISPUTE',
    urgency: 'HIGH',
    subject: 'Delayed payment for 12 Tonne Tomato batch dispatch to Pune APMC',
    description: 'Delivered 12 Tonnes of Grade A hybrid tomatoes to aggregator depot on Tuesday. Weighing slip was verified, but 48 hours have passed and payment is not credited in my account.',
    lotOrOrderReference: 'LOT-TOM-2026-08',
    status: 'AI_AUTO_RESOLVED',
    createdAt: '2026-08-28T09:30:00Z',
    updatedAt: '2026-08-28T10:00:00Z',
    autoReplyEmailSent: true,
    autoReplyEmailPreview: {
      subject: '[KG-FAR-2026-48201] Official Support Ticket Receipt: Delayed payment for 12 Tonne Tomato batch',
      recipient: 'ramesh.patil@kisan.in',
      sentAt: '09:31 AM',
      htmlContent: `<p>Namaste Ramesh Patil. Your ticket <strong>KG-FAR-2026-48201</strong> has been registered with HIGH priority.</p>`,
      plainText: `Ticket KG-FAR-2026-48201 registered. Payment resolution team assigned.`
    },
    replies: [
      {
        id: 'rep_1_1',
        sender: 'USER',
        senderName: 'Ramesh Patil',
        message: 'Delivered 12 Tonnes of Grade A hybrid tomatoes to aggregator depot on Tuesday. Weighing slip was verified, but 48 hours have passed and payment is not credited in my account.',
        timestamp: '09:30 AM'
      },
      {
        id: 'rep_1_2',
        sender: 'AI_SUPPORT',
        senderName: 'AgriAI Support Desk',
        message: `Namaste Ramesh Patil. Under Section 38 of APMC Act, buyer payments must be settled within 24 hours of weighbridge receipt.
• **Action Taken**: An automated payment escalation notice has been served to Pune Depot Aggregator.
• **Escalation Lead**: Officer Vikrant Shinde has been assigned to release RTGS hold by 2:00 PM today.
• **Status**: Automated tracking active.`,
        timestamp: '09:31 AM'
      }
    ],
    assignedOfficerName: 'Officer Vikrant Shinde (Farmer Grievance Desk)',
    estimatedResolutionHours: 4
  },
  {
    id: 'ticket_demo_2',
    ticketNumber: 'KG-BUY-2026-89104',
    userId: 'usr_buyer_demo',
    userName: 'Kisan Agro Processing Plant',
    userRole: 'BUYER',
    buyerType: 'PROCESSOR',
    userEmail: 'procurement@kisanagro.com',
    userPhone: '+91 94221 78900',
    category: 'CROP_QUALITY_DISPUTE',
    urgency: 'MEDIUM',
    subject: 'Moisture content discrepancy in 20 Tonne Red Onion shipment',
    description: 'We received batch ONION-LOT-992 with moisture reading at 17.5% at weighbridge, whereas standard dehydration threshold requires under 14%. Need secondary laboratory QC re-test.',
    lotOrOrderReference: 'ONION-LOT-992',
    status: 'UNDER_REVIEW',
    createdAt: '2026-08-27T14:15:00Z',
    updatedAt: '2026-08-27T15:00:00Z',
    autoReplyEmailSent: true,
    autoReplyEmailPreview: {
      subject: '[KG-BUY-2026-89104] Support Confirmation: Moisture content discrepancy',
      recipient: 'procurement@kisanagro.com',
      sentAt: '02:16 PM',
      htmlContent: `<p>QC re-inspection requisition initiated for batch ONION-LOT-992.</p>`,
      plainText: `QC re-inspection requisition initiated for batch ONION-LOT-992.`
    },
    replies: [
      {
        id: 'rep_2_1',
        sender: 'USER',
        senderName: 'Kisan Agro Processing Plant',
        message: 'We received batch ONION-LOT-992 with moisture reading at 17.5% at weighbridge, whereas standard dehydration threshold requires under 14%. Need secondary laboratory QC re-test.',
        timestamp: '02:15 PM'
      },
      {
        id: 'rep_2_2',
        sender: 'AI_SUPPORT',
        senderName: 'AgriAI Support Desk',
        message: `Acknowledged Kisan Agro Procurement. Secondary sample testing protocol initiated with Lasalgaon APMC Quality Testing Lab.
• **Tolerance Band**: Standard dehydration contracts permit up to 1.5% moisture adjustment factor or 48-hour shed cure allowance.
• **Inspector**: Officer Meera Kulkarni will upload the calibrated digital moisture certificate by 5:00 PM.`,
        timestamp: '02:16 PM'
      }
    ],
    assignedOfficerName: 'Officer Meera Kulkarni (Buyer Supply Chain QC)',
    estimatedResolutionHours: 6
  }
];

export const submitSupportTicketAPI = async (ticketData: {
  userName: string;
  userRole: 'FARMER' | 'BUYER' | 'ADMIN';
  userEmail: string;
  userPhone: string;
  buyerType?: 'AGGREGATOR' | 'PROCESSOR' | 'WHOLESALER';
  category: string;
  urgency: string;
  subject: string;
  description: string;
  lotOrOrderReference?: string;
}): Promise<SupportTicket> => {
  try {
    const res = await fetch('/api/support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketData)
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Support API call failed, generating dynamic fallback ticket:', err);
  }

  // Fallback offline generator if serverless endpoint is offline
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const ticketNumber = `KG-${ticketData.userRole === 'FARMER' ? 'FAR' : 'BUY'}-2026-${randomSuffix}`;
  const now = new Date();

  return {
    id: `ticket_${Date.now()}`,
    ticketNumber,
    userId: `usr_${Date.now()}`,
    userName: ticketData.userName || (ticketData.userRole === 'FARMER' ? 'Valued Farmer' : 'Valued Buyer Partner'),
    userRole: ticketData.userRole,
    userEmail: ticketData.userEmail || 'support@krishigrow.in',
    userPhone: ticketData.userPhone || '+91 98220 12345',
    buyerType: ticketData.buyerType,
    category: ticketData.category as any,
    urgency: ticketData.urgency as any,
    subject: ticketData.subject,
    description: ticketData.description,
    lotOrOrderReference: ticketData.lotOrOrderReference,
    status: 'AI_AUTO_RESOLVED',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    autoReplyEmailSent: true,
    autoReplyEmailPreview: {
      subject: `[${ticketNumber}] Support Ticket Confirmation: ${ticketData.subject}`,
      recipient: ticketData.userEmail || 'user@krishigrow.in',
      sentAt: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      htmlContent: `<p>Namaste ${ticketData.userName}. Your ticket <strong>${ticketNumber}</strong> has been registered with ${ticketData.urgency} priority.</p>`,
      plainText: `Ticket ${ticketNumber} registered successfully.`
    },
    replies: [
      {
        id: `rep_${Date.now()}_1`,
        sender: 'USER',
        senderName: ticketData.userName || 'User',
        message: ticketData.description,
        timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      {
        id: `rep_${Date.now()}_2`,
        sender: 'AI_SUPPORT',
        senderName: 'AgriAI Support Desk',
        message: `Namaste ${ticketData.userName}. We have recorded your ticket regarding ${ticketData.subject}. Our automated grievance engine is reviewing your details and has notified the regional support lead.`,
        timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ],
    assignedOfficerName: ticketData.userRole === 'FARMER' ? 'Officer Vikrant Shinde' : 'Officer Meera Kulkarni',
    estimatedResolutionHours: ticketData.urgency === 'CRITICAL_URGENT' ? 2 : 24
  };
};

