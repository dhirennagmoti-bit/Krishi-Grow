import { supabase } from './supabase';
import {
  initialUser, initialCrops, initialMandiPrices, storageFacilities,
  processingFacilities, governmentSchemes, productRecommendations,
  buyerRequirements, connectionRequests, initialNotifications
} from '../data/mockData';

export async function seedSupabaseDatabase() {
  console.log('Seeding Supabase database...');

  try {
    // 1. Profiles
    await supabase.from('profiles').upsert([{
      id: initialUser.id,
      name: initialUser.name,
      email: initialUser.email,
      role: initialUser.role,
      phone: initialUser.phone,
      state: initialUser.state,
      district: initialUser.district,
      taluka: initialUser.taluka,
      village: initialUser.village,
      farm_size_acres: initialUser.farmSizeAcres,
    }]);

    // 2. Crops
    await supabase.from('crops').upsert(initialCrops.map(c => ({
      id: c.id,
      farmer_id: c.farmerId,
      farmer_name: c.farmerName,
      name: c.name,
      category: c.category,
      variety: c.variety,
      quantity: c.quantity,
      unit: c.unit,
      grade: c.grade,
      moisture_percent: c.moisturePercent,
      damage_percent: c.damagePercent,
      is_organic: c.isOrganic,
      harvest_date: c.harvestDate,
      estimated_shelf_life_days: c.estimatedShelfLifeDays,
      days_remaining: c.daysRemaining,
      storage_condition: c.storageCondition,
      location: c.location,
      image_url: c.imageUrl,
      status: c.status,
      created_at: c.createdAt,
    })));

    // 3. Mandi Prices
    await supabase.from('mandi_prices').upsert(initialMandiPrices.map(m => ({
      id: m.id,
      crop: m.crop,
      market_name: m.marketName,
      district: m.district,
      state: m.state,
      date: m.date,
      min_price: m.minPrice,
      max_price: m.maxPrice,
      modal_price: m.modalPrice,
      unit: m.unit,
      trend: m.trend,
    })));

    // 4. Storage Facilities
    await supabase.from('storage_facilities').upsert(storageFacilities.map(s => ({
      id: s.id,
      name: s.name,
      type: s.type,
      location: s.location,
      distance_km: s.distanceKm,
      total_capacity_tonnes: s.totalCapacityTonnes,
      available_capacity_tonnes: s.availableCapacityTonnes,
      price_per_ton_day: s.pricePerTonDay,
      contact_phone: s.contactPhone,
      features: s.features,
    })));

    // 5. Processing Facilities
    await supabase.from('processing_facilities').upsert(processingFacilities.map(p => ({
      id: p.id,
      name: p.name,
      crops_accepted: p.cropsAccepted,
      processing_types: p.processingTypes,
      daily_capacity_tonnes: p.dailyCapacityTonnes,
      location: p.location,
      distance_km: p.distanceKm,
      contact_phone: p.contactPhone,
      min_batch_tonnes: p.minBatchTonnes,
    })));

    // 6. Government Schemes
    await supabase.from('government_schemes').upsert(governmentSchemes.map(g => ({
      id: g.id,
      name: g.name,
      agency: g.agency,
      description: g.description,
      eligibility: g.eligibility,
      subsidy_benefit: g.subsidyBenefit,
      required_documents: g.requiredDocuments,
      application_url: g.applicationUrl,
      applicable_crops: g.applicableCrops,
      applicable_states: g.applicableStates,
      max_subsidy_amount: g.maxSubsidyAmount,
      last_verified_date: g.lastVerifiedDate,
    })));

    // 7. Product Recommendations
    await supabase.from('product_recommendations').upsert(productRecommendations.map(r => ({
      id: r.id,
      raw_crop: r.rawCrop,
      target_product: r.targetProduct,
      opportunity_score: r.opportunityScore,
      market_demand: r.marketDemand,
      investment_level: r.investmentLevel,
      estimated_margin_percent: r.estimatedMarginPercent,
      raw_material_suitability: r.rawMaterialSuitability,
      nearby_infra: r.nearbyInfra,
      shelf_life_extension_days: r.shelfLifeExtensionDays,
      why_recommended: r.whyRecommended,
      image: r.image,
    })));

    // 8. Buyer Requirements
    await supabase.from('buyer_requirements').upsert(buyerRequirements.map(b => ({
      id: b.id,
      buyer_id: b.buyerId,
      buyer_name: b.buyerName,
      buyer_type: b.buyerType,
      crop: b.crop,
      variety: b.variety,
      quantity_required_tonnes: b.quantityRequiredTonnes,
      min_grade: b.minGrade,
      target_price_per_quintal: b.targetPricePerQuintal,
      pickup_region: b.pickupRegion,
      required_by_date: b.requiredByDate,
      frequency: b.frequency,
      notes: b.notes,
      match_score: b.matchScore,
    })));

    // 9. Connection Requests
    await supabase.from('connection_requests').upsert(connectionRequests.map(c => ({
      id: c.id,
      farmer_id: c.farmerId,
      farmer_name: c.farmerName,
      buyer_id: c.buyerId,
      buyer_name: c.buyerName,
      crop_name: c.cropName,
      quantity_tonnes: c.quantityTonnes,
      status: c.status,
      request_date: c.requestDate,
      buyer_phone: c.buyerPhone,
    })));

    // 10. Notifications
    await supabase.from('notifications').upsert(initialNotifications.map(n => ({
      id: n.id,
      title: n.title,
      message: n.message,
      type: n.type,
      timestamp: n.timestamp,
      is_read: n.isRead,
    })));

    console.log('Database successfully seeded into Supabase!');
  } catch (err) {
    console.error('Error seeding Supabase database:', err);
  }
}
