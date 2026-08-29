import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  User, CropRecord, MandiPrice, BuyerRequirement, ConnectionRequest,
  NotificationItem, AggregatorFarmer, HarvestCollectionRequest,
  WeighingSlip, QualityReport, AggregatorInventoryItem, AggregatorMarketOffer,
  ProcessingMachine, PackagingBatch, FinishedGoodsItem, WasteRecord,
  WholesalerCustomer, BulkSalesOrder, ProfitAnalyticsBreakdown,
  SupplyChainDocument, BuyerType, UserRole
} from '../types';
import {
  initialUser, initialCrops, initialMandiPrices, buyerRequirements as initialBuyerReqs,
  connectionRequests as initialConns, initialNotifications
} from '../data/mockData';
import {
  initialAggregatorFarmers, initialCollectionRequests, initialWeighingSlips,
  initialQualityReports, initialAggregatorInventory, initialMarketOffers,
  initialProcessingMachines, initialPackagingBatches, initialFinishedGoods,
  initialWasteRecords, initialWholesalerCustomers, initialBulkSalesOrders,
  initialProfitAnalytics
} from '../data/supplyChainMockData';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';
import {
  fetchCropsFromSupabase, fetchMandiPricesFromSupabase, fetchBuyerRequirementsFromSupabase,
  fetchConnectionRequestsFromSupabase, fetchNotificationsFromSupabase
} from '../services/api';
import { DocumentViewerModal } from '../components/DocumentViewerModal';

interface AppContextType {
  user: User;
  setUser: (u: User) => void;
  session: Session | null;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  requireAuth: (action: () => void) => void;
  loginAsDemo: (demoRole?: UserRole, demoBuyerType?: BuyerType) => void;
  crops: CropRecord[];
  addCrop: (crop: Omit<CropRecord, 'id' | 'createdAt' | 'daysRemaining' | 'status'>) => Promise<void>;
  deleteCrop: (id: string) => Promise<void>;
  mandiPrices: MandiPrice[];
  buyerReqs: BuyerRequirement[];
  addBuyerRequirement: (req: Omit<BuyerRequirement, 'id'>) => Promise<void>;
  connectionRequests: ConnectionRequest[];
  requestConnection: (
    buyerId: string,
    buyerName: string,
    cropName: string,
    quantityTonnes: number,
    options?: {
      offeredPricePerQuintal?: number;
      targetDate?: string;
      customMessage?: string;
      targetType?: 'CROP_TRADE' | 'COLD_STORAGE_BOOKING' | 'PROCESSING_FACILITY';
      receiverEmail?: string;
      receiverPhone?: string;
      receiverType?: string;
      receiverDistrict?: string;
    }
  ) => Promise<ConnectionRequest>;
  updateConnectionStatus: (id: string, status: 'ACCEPTED' | 'REJECTED') => Promise<void>;
  notifications: NotificationItem[];
  markNotificationsRead: () => Promise<void>;
  language: 'EN' | 'HI' | 'MR';
  setLanguage: (lang: 'EN' | 'HI' | 'MR') => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (v: boolean) => void;
  isScannerModalOpen: boolean;
  setIsScannerModalOpen: (v: boolean) => void;
  isAIModalOpen: boolean;
  setIsAIModalOpen: (v: boolean) => void;

  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Supply Chain: Aggregator state & methods
  aggregatorFarmers: AggregatorFarmer[];
  addAggregatorFarmer: (farmer: Omit<AggregatorFarmer, 'id' | 'joinedDate' | 'totalSuppliedTonnes' | 'totalPaymentsReceived' | 'rating' | 'status'>) => void;
  updateFarmerStatus: (id: string, status: 'ACTIVE' | 'PENDING' | 'REJECTED') => void;
  collectionRequests: HarvestCollectionRequest[];
  addCollectionRequest: (req: Omit<HarvestCollectionRequest, 'id' | 'status'>) => void;
  updateCollectionStatus: (id: string, status: HarvestCollectionRequest['status'], actualTonnes?: number) => void;
  weighingSlips: WeighingSlip[];
  addWeighingSlip: (slip: Omit<WeighingSlip, 'id'>) => void;
  qualityReports: QualityReport[];
  addQualityReport: (report: Omit<QualityReport, 'id'>) => void;
  aggregatorInventory: AggregatorInventoryItem[];
  addAggregatorInventoryItem: (item: Omit<AggregatorInventoryItem, 'id'>) => void;
  marketOffers: AggregatorMarketOffer[];
  addMarketOffer: (offer: Omit<AggregatorMarketOffer, 'id'>) => void;

  // Supply Chain: Processor state & methods
  processingMachines: ProcessingMachine[];
  updateMachineStatus: (id: string, status: ProcessingMachine['status']) => void;
  addProcessingMachine: (machine: Omit<ProcessingMachine, 'id'>) => void;
  packagingBatches: PackagingBatch[];
  addPackagingBatch: (batch: Omit<PackagingBatch, 'id'>) => void;
  finishedGoods: FinishedGoodsItem[];
  wasteRecords: WasteRecord[];

  // Supply Chain: Wholesaler state & methods
  wholesalerCustomers: WholesalerCustomer[];
  addWholesalerCustomer: (customer: Omit<WholesalerCustomer, 'id'>) => void;
  bulkSalesOrders: BulkSalesOrder[];
  addBulkSalesOrder: (order: Omit<BulkSalesOrder, 'id'>) => void;
  updateBulkSalesOrderStatus: (id: string, status: BulkSalesOrder['status']) => void;
  profitAnalytics: ProfitAnalyticsBreakdown[];

  // Document Modal trigger
  activeDocument: SupplyChainDocument | null;
  openDocument: (doc: SupplyChainDocument) => void;
  closeDocument: () => void;
  switchBuyerType: (type: BuyerType) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getStoredUser = (): User => {
  try {
    const saved = localStorage.getItem('krishi_grow_user');
    if (saved) {
      return { ...initialUser, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Failed to parse saved user', e);
  }
  return initialUser;
};

const getStoredCrops = (): CropRecord[] => {
  try {
    const saved = localStorage.getItem('krishi_grow_crops');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const cropMap = new Map<string, CropRecord>();
        initialCrops.forEach(c => cropMap.set(c.id, c));
        parsed.forEach(c => cropMap.set(c.id, c));
        return Array.from(cropMap.values());
      }
    }
  } catch (e) {
    console.warn('Failed to parse saved crops', e);
  }
  return initialCrops;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User>(getStoredUser);
  const [session, setSession] = useState<Session | null>(null);
  const [crops, setCrops] = useState<CropRecord[]>(getStoredCrops);
  const [mandiPrices, setMandiPrices] = useState<MandiPrice[]>(initialMandiPrices);
  const [buyerReqs, setBuyerReqs] = useState<BuyerRequirement[]>(initialBuyerReqs);
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>(initialConns);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [language, setLanguage] = useState<'EN' | 'HI' | 'MR'>('EN');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState('landing');

  // Supply chain states
  const [aggregatorFarmers, setAggregatorFarmers] = useState<AggregatorFarmer[]>(initialAggregatorFarmers);
  const [collectionRequests, setCollectionRequests] = useState<HarvestCollectionRequest[]>(initialCollectionRequests);
  const [weighingSlips, setWeighingSlips] = useState<WeighingSlip[]>(initialWeighingSlips);
  const [qualityReports, setQualityReports] = useState<QualityReport[]>(initialQualityReports);
  const [aggregatorInventory, setAggregatorInventory] = useState<AggregatorInventoryItem[]>(initialAggregatorInventory);
  const [marketOffers, setMarketOffers] = useState<AggregatorMarketOffer[]>(initialMarketOffers);

  const [processingMachines, setProcessingMachines] = useState<ProcessingMachine[]>(initialProcessingMachines);
  const [packagingBatches, setPackagingBatches] = useState<PackagingBatch[]>(initialPackagingBatches);
  const [finishedGoods, setFinishedGoods] = useState<FinishedGoodsItem[]>(initialFinishedGoods);
  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>(initialWasteRecords);

  const [wholesalerCustomers, setWholesalerCustomers] = useState<WholesalerCustomer[]>(initialWholesalerCustomers);
  const [bulkSalesOrders, setBulkSalesOrders] = useState<BulkSalesOrder[]>(initialBulkSalesOrders);
  const [profitAnalytics, setProfitAnalytics] = useState<ProfitAnalyticsBreakdown[]>(initialProfitAnalytics);

  const [activeDocument, setActiveDocument] = useState<SupplyChainDocument | null>(null);

  // Wrapper for setUser to keep localStorage and state synchronized
  const setUser = (newUser: User | ((prev: User) => User)) => {
    setUserState(prev => {
      const updated = typeof newUser === 'function' ? newUser(prev) : newUser;
      try {
        localStorage.setItem('krishi_grow_user', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save user to localStorage:', e);
      }
      return updated;
    });
  };

  // Fetch live Supabase data on mount
  useEffect(() => {
    async function loadSupabaseData() {
      try {
        const [cropsData, pricesData, reqsData, connsData, notifsData] = await Promise.all([
          fetchCropsFromSupabase(),
          fetchMandiPricesFromSupabase(),
          fetchBuyerRequirementsFromSupabase(),
          fetchConnectionRequestsFromSupabase(),
          fetchNotificationsFromSupabase(),
        ]);

        if (cropsData.length > 0) {
          setCrops(prev => {
            const map = new Map<string, CropRecord>();
            initialCrops.forEach(c => map.set(c.id, c));
            prev.forEach(c => map.set(c.id, c));
            cropsData.forEach(c => map.set(c.id, c));
            const merged = Array.from(map.values());
            try {
              localStorage.setItem('krishi_grow_crops', JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
        }
        if (pricesData.length > 0) setMandiPrices(pricesData);
        if (reqsData.length > 0) setBuyerReqs(reqsData);
        if (connsData.length > 0) setConnectionRequests(connsData);
        if (notifsData.length > 0) setNotifications(notifsData);
      } catch (err) {
        console.error('Error loading Supabase database tables:', err);
      }
    }
    loadSupabaseData();
  }, []);

  // Supabase Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        syncUserFromSession(session);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        syncUserFromSession(session);
        if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const syncUserFromSession = (sess: Session) => {
    const meta = sess.user.user_metadata || {};
    const intendedRole = (localStorage.getItem('krishi_intended_role') as UserRole) || meta.role;
    const intendedBuyerType = (localStorage.getItem('krishi_intended_buyer_type') as BuyerType) || meta.buyerType;

    setUser(prev => ({
      ...prev,
      id: sess.user.id,
      email: sess.user.email || prev.email,
      name: meta.name || meta.full_name || prev.name || sess.user.email?.split('@')[0] || 'Farmer / Partner',
      role: intendedRole || prev.role || 'FARMER',
      buyerType: intendedBuyerType || prev.buyerType || 'AGGREGATOR',
      phone: meta.phone || prev.phone,
      state: meta.state || prev.state || 'Maharashtra',
      district: meta.district || prev.district || 'Nashik',
      farmSizeAcres: meta.farmSizeAcres ? Number(meta.farmSizeAcres) : prev.farmSizeAcres,
      businessName: meta.businessName || prev.businessName,
    }));
  };

  const isAuthenticated = Boolean(session?.user || (user && user.id && user.email && user.email.trim().length > 0));

  const requireAuth = (action: () => void) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    } else {
      action();
    }
  };

  const loginAsDemo = (demoRole: UserRole = 'FARMER', demoBuyerType: BuyerType = 'AGGREGATOR') => {
    const demoEmail = demoRole === 'FARMER'
      ? 'demo.farmer@krishigrow.in'
      : `demo.${demoBuyerType.toLowerCase()}@krishigrow.in`;

    const demoName = demoRole === 'FARMER'
      ? 'Ramesh Patil (Demo Farmer)'
      : demoBuyerType === 'PROCESSOR'
      ? 'Kisan Agro Processing Ltd'
      : demoBuyerType === 'WHOLESALER'
      ? 'Bharat Mandi Wholesale Traders'
      : 'MahaAgri Aggregators FPC';

    const demoUserData: User = {
      id: demoRole === 'FARMER' ? 'farmer_demo_1' : `buyer_demo_${demoBuyerType.toLowerCase()}`,
      name: demoName,
      role: demoRole,
      buyerType: demoRole === 'BUYER' ? demoBuyerType : undefined,
      district: 'Nashik',
      state: 'Maharashtra',
      email: demoEmail,
      phone: '+91 98220 00001',
      farmSizeAcres: demoRole === 'FARMER' ? 15 : undefined,
      businessName: demoRole === 'BUYER' ? demoName : undefined,
    };

    setUser(demoUserData);
    localStorage.setItem('krishi_grow_user', JSON.stringify(demoUserData));
    setIsAuthModalOpen(false);

    if (demoRole === 'FARMER') {
      setActiveTab('farmer-dashboard');
    } else if (demoBuyerType === 'PROCESSOR') {
      setActiveTab('processor-dashboard');
    } else if (demoBuyerType === 'WHOLESALER') {
      setActiveTab('wholesaler-dashboard');
    } else {
      setActiveTab('buyer-dashboard');
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Signout warning:', e);
    }
    setSession(null);
    localStorage.removeItem('krishi_grow_user');
    localStorage.removeItem('krishi_intended_role');
    localStorage.removeItem('krishi_intended_buyer_type');
    setUser(initialUser);
    setActiveTab('landing');
  };

  const switchBuyerType = (type: BuyerType) => {
    setUser(prev => ({
      ...prev,
      role: 'BUYER',
      buyerType: type
    }));
    if (type === 'AGGREGATOR') setActiveTab('buyer-dashboard');
    else if (type === 'PROCESSOR') setActiveTab('processor-dashboard');
    else if (type === 'WHOLESALER') setActiveTab('wholesaler-dashboard');
  };

  const openDocument = (doc: SupplyChainDocument) => {
    setActiveDocument(doc);
  };

  const closeDocument = () => {
    setActiveDocument(null);
  };

  // Farmer / Crop actions with persistent localStorage + Supabase saving
  const addCrop = async (newCropData: Omit<CropRecord, 'id' | 'createdAt' | 'daysRemaining' | 'status'>) => {
    const id = `crop_${Date.now()}`;
    const daysRemaining = newCropData.estimatedShelfLifeDays;
    const createdAt = new Date().toISOString();
    const newRecord: CropRecord = {
      ...newCropData,
      id,
      daysRemaining,
      status: 'AVAILABLE',
      createdAt
    };

    setCrops(prev => {
      const updated = [newRecord, ...prev];
      try {
        localStorage.setItem('krishi_grow_crops', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save crop to localStorage:', e);
      }
      return updated;
    });
    
    const notif: NotificationItem = {
      id: `n_${Date.now()}`,
      title: 'New Crop Listed',
      message: `${newRecord.name} (${newRecord.quantity} ${newRecord.unit}) was successfully added to your inventory.`,
      type: 'SYSTEM',
      timestamp: 'Just now',
      isRead: false
    };
    setNotifications(prev => [notif, ...prev]);

    try {
      await supabase.from('crops').insert([{
        id,
        farmer_id: newRecord.farmerId,
        farmer_name: newRecord.farmerName,
        name: newRecord.name,
        category: newRecord.category,
        variety: newRecord.variety,
        quantity: newRecord.quantity,
        unit: newRecord.unit,
        grade: newRecord.grade,
        moisture_percent: newRecord.moisturePercent,
        damage_percent: newRecord.damagePercent,
        is_organic: newRecord.isOrganic,
        harvest_date: newRecord.harvestDate,
        estimated_shelf_life_days: newRecord.estimatedShelfLifeDays,
        days_remaining: newRecord.daysRemaining,
        storage_condition: newRecord.storageCondition,
        location: newRecord.location,
        image_url: newRecord.imageUrl,
        status: newRecord.status,
        created_at: createdAt
      }]);
    } catch (err) {
      console.warn('Supabase crop insert note (stored locally):', err);
    }
  };

  const deleteCrop = async (id: string) => {
    setCrops(prev => {
      const updated = prev.filter(c => c.id !== id);
      try {
        localStorage.setItem('krishi_grow_crops', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    try {
      await supabase.from('crops').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase crop delete note:', err);
    }
  };

  const addBuyerRequirement = async (reqData: Omit<BuyerRequirement, 'id'>) => {
    const id = `req_${Date.now()}`;
    const newReq: BuyerRequirement = {
      ...reqData,
      id,
      matchScore: 94
    };
    setBuyerReqs(prev => [newReq, ...prev]);

    await supabase.from('buyer_requirements').insert([{
      id,
      buyer_id: newReq.buyerId,
      buyer_name: newReq.buyerName,
      buyer_type: newReq.buyerType,
      crop: newReq.crop,
      variety: newReq.variety,
      quantity_required_tonnes: newReq.quantityRequiredTonnes,
      min_grade: newReq.minGrade,
      target_price_per_quintal: newReq.targetPricePerQuintal,
      pickup_region: newReq.pickupRegion,
      required_by_date: newReq.requiredByDate,
      frequency: newReq.frequency,
      notes: newReq.notes,
      match_score: newReq.matchScore
    }]);
  };

  const requestConnection = async (
    buyerId: string,
    buyerName: string,
    cropName: string,
    quantityTonnes: number,
    options?: {
      offeredPricePerQuintal?: number;
      targetDate?: string;
      customMessage?: string;
      targetType?: 'CROP_TRADE' | 'COLD_STORAGE_BOOKING' | 'PROCESSING_FACILITY';
      receiverEmail?: string;
      receiverPhone?: string;
      receiverType?: string;
      receiverDistrict?: string;
    }
  ): Promise<ConnectionRequest> => {
    const id = `conn_${Date.now()}`;
    const requestNumber = `REQ-KG-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const requestDate = new Date().toISOString();
    const formattedDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const targetType = options?.targetType || 'CROP_TRADE';
    const isStorage = targetType === 'COLD_STORAGE_BOOKING';
    const receiverEmail = options?.receiverEmail || 'procurement@krishigrow.in';
    const receiverPhone = options?.receiverPhone || '+91 94221 88990';
    const receiverType = options?.receiverType || 'AGGREGATOR';

    const newConn: ConnectionRequest = {
      id,
      requestNumber,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      senderEmail: user.email || 'farmer@krishigrow.in',
      senderPhone: user.phone || '+91 98220 12345',
      senderDistrict: user.district || 'Nashik',
      senderState: user.state || 'Maharashtra',
      receiverId: buyerId,
      receiverName: buyerName,
      receiverType,
      receiverEmail,
      receiverPhone,
      receiverDistrict: options?.receiverDistrict || 'Pune',
      targetType,
      cropName,
      variety: 'Grade A Quality',
      quantityTonnes,
      offeredPricePerQuintal: options?.offeredPricePerQuintal || 2500,
      targetDate: options?.targetDate || new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      customMessage: options?.customMessage || 'Direct farm procurement proposal via Krishi Grow network.',
      status: 'PENDING',
      requestDate,
      createdAt: requestDate,
      updatedAt: requestDate,
      emailSent: true,
      emailPreview: {
        subject: isStorage
          ? `[${requestNumber}] New Cold Storage Reservation Request from ${user.name}`
          : `[${requestNumber}] New Trade Connection Proposal: ${quantityTonnes}T ${cropName} from ${user.name}`,
        recipient: receiverEmail,
        recipientRole: receiverType,
        sentAt: `${formattedDate} at ${formattedTime}`,
        htmlContent: `<p>Namaste ${buyerName}. Connection proposal received for <strong>${quantityTonnes}T ${cropName}</strong> from <strong>${user.name}</strong> (${user.district}).</p>`,
        plainText: `Connection request ${requestNumber} from ${user.name} for ${quantityTonnes}T ${cropName}.`
      },
      farmerPhone: user.role === 'FARMER' ? user.phone : receiverPhone,
      buyerPhone: user.role === 'BUYER' ? user.phone : receiverPhone
    };

    setConnectionRequests(prev => [newConn, ...prev]);

    // Push instant in-app notification
    const notif: NotificationItem = {
      id: `n_conn_${Date.now()}`,
      title: isStorage ? '❄️ Storage Request Dispatched' : '🤝 Trade Request Dispatched',
      message: `Connection request (${newConn.requestNumber}) sent to ${buyerName} for ${quantityTonnes}T ${cropName}. Email notification delivered!`,
      type: 'MATCH',
      timestamp: 'Just now',
      isRead: false
    };
    setNotifications(prev => [notif, ...prev]);

    // Try calling serverless email endpoint
    try {
      await fetch('/api/connection-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SEND_REQUEST',
          senderId: user.id,
          senderName: user.name,
          senderRole: user.role,
          senderEmail: user.email,
          senderPhone: user.phone,
          senderDistrict: user.district,
          senderState: user.state,
          receiverId: buyerId,
          receiverName: buyerName,
          receiverType,
          receiverEmail,
          receiverPhone,
          targetType,
          cropName,
          quantityTonnes,
          offeredPricePerQuintal: options?.offeredPricePerQuintal,
          targetDate: options?.targetDate,
          customMessage: options?.customMessage,
          requestId: requestNumber
        })
      });
    } catch {
      // Offline fallback already applied
    }

    return newConn;
  };

  const updateConnectionStatus = async (id: string, status: 'ACCEPTED' | 'REJECTED') => {
    setConnectionRequests(prev => prev.map(c => {
      if (c.id !== id) return c;

      const formattedDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      return {
        ...c,
        status,
        updatedAt: new Date().toISOString(),
        emailSent: true,
        emailPreview: status === 'ACCEPTED' ? {
          subject: `[CONFIRMED] Connection Request ${c.requestNumber || c.id} Accepted!`,
          recipient: c.senderEmail || 'farmer@krishigrow.in',
          recipientRole: c.senderRole,
          sentAt: `${formattedDate} at ${formattedTime}`,
          htmlContent: `<p>Congratulations! Trade connection for <strong>${c.quantityTonnes}T ${c.cropName}</strong> has been ACCEPTED by <strong>${c.receiverName}</strong>.</p>`,
          plainText: `Trade connection ${c.requestNumber || c.id} accepted by ${c.receiverName}. Contact phone: ${c.receiverPhone || '+91 94221 88990'}.`
        } : c.emailPreview
      };
    }));

    const conn = connectionRequests.find(c => c.id === id);
    if (conn) {
      const notif: NotificationItem = {
        id: `n_stat_${Date.now()}`,
        title: status === 'ACCEPTED' ? '🎉 Trade Connection Accepted!' : 'Trade Connection Updated',
        message: status === 'ACCEPTED'
          ? `Trade proposal for ${conn.quantityTonnes}T ${conn.cropName} was accepted by ${conn.receiverName}. Direct contact phone is now unlocked.`
          : `Trade proposal for ${conn.cropName} was declined by ${conn.receiverName}.`,
        type: 'ORDER',
        timestamp: 'Just now',
        isRead: false
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  const markNotificationsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Supply chain aggregator helpers
  const addAggregatorFarmer = (farmer: Omit<AggregatorFarmer, 'id' | 'joinedDate' | 'totalSuppliedTonnes' | 'totalPaymentsReceived' | 'rating' | 'status'>) => {
    const id = `frm_${Date.now()}`;
    const newFarmer: AggregatorFarmer = {
      ...farmer,
      id,
      status: 'ACTIVE',
      totalSuppliedTonnes: 0,
      totalPaymentsReceived: 0,
      rating: 5.0,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setAggregatorFarmers(prev => [newFarmer, ...prev]);
  };

  const updateFarmerStatus = (id: string, status: 'ACTIVE' | 'PENDING' | 'REJECTED') => {
    setAggregatorFarmers(prev => prev.map(f => f.id === id ? { ...f, status } : f));
  };

  const addCollectionRequest = (req: Omit<HarvestCollectionRequest, 'id' | 'status'>) => {
    const id = `col_${Date.now()}`;
    const newReq: HarvestCollectionRequest = {
      ...req,
      id,
      status: 'SCHEDULED'
    };
    setCollectionRequests(prev => [newReq, ...prev]);
  };

  const updateCollectionStatus = (id: string, status: HarvestCollectionRequest['status'], actualTonnes?: number) => {
    setCollectionRequests(prev => prev.map(c => c.id === id ? { ...c, status, ...(actualTonnes !== undefined ? { actualTonnes } : {}) } : c));
  };

  const addWeighingSlip = (slip: Omit<WeighingSlip, 'id'>) => {
    const id = `ws_${Date.now()}`;
    const newSlip: WeighingSlip = { ...slip, id };
    setWeighingSlips(prev => [newSlip, ...prev]);

    // Also auto-deposit into inventory
    const newInv: AggregatorInventoryItem = {
      id: `inv_${Date.now()}`,
      crop: slip.crop,
      variety: slip.variety,
      grade: slip.calculatedGrade,
      batchId: slip.batchId,
      warehouse: 'Nashik Main Intake Godown',
      storageLocation: 'Intake Bay #1',
      entryDate: new Date().toISOString().split('T')[0],
      totalQuantityKg: slip.netWeightKg,
      availableQuantityKg: slip.netWeightKg,
      reservedQuantityKg: 0,
      expectedShelfLifeDays: 30,
      daysInStorage: 0,
      spoilageRisk: 'LOW',
      purchasePricePerKg: 24.00
    };
    setAggregatorInventory(prev => [newInv, ...prev]);
  };

  const addQualityReport = (report: Omit<QualityReport, 'id'>) => {
    const id = `qc_${Date.now()}`;
    const newReport: QualityReport = { ...report, id };
    setQualityReports(prev => [newReport, ...prev]);
  };

  const addAggregatorInventoryItem = (item: Omit<AggregatorInventoryItem, 'id'>) => {
    const id = `inv_${Date.now()}`;
    const newInv: AggregatorInventoryItem = { ...item, id };
    setAggregatorInventory(prev => [newInv, ...prev]);
  };

  const addMarketOffer = (offer: Omit<AggregatorMarketOffer, 'id'>) => {
    const id = `off_${Date.now()}`;
    const newOffer: AggregatorMarketOffer = { ...offer, id };
    setMarketOffers(prev => [newOffer, ...prev]);
  };

  // Supply chain processor helpers
  const updateMachineStatus = (id: string, status: ProcessingMachine['status']) => {
    setProcessingMachines(prev => prev.map(m => m.id === id ? { ...m, status } : m));
  };

  const addProcessingMachine = (machine: Omit<ProcessingMachine, 'id'>) => {
    const id = `mch_${Date.now()}`;
    const newMachine: ProcessingMachine = { ...machine, id };
    setProcessingMachines(prev => [newMachine, ...prev]);
  };

  const addPackagingBatch = (batch: Omit<PackagingBatch, 'id'>) => {
    const id = `pkg_${Date.now()}`;
    const newBatch: PackagingBatch = { ...batch, id };
    setPackagingBatches(prev => [newBatch, ...prev]);

    // Also auto-add to finished goods
    const newGoods: FinishedGoodsItem = {
      id: `fg_${Date.now()}`,
      productName: batch.productName,
      batchId: batch.batchId,
      category: 'Packaged Products',
      unitsInStock: batch.quantityUnits,
      availableUnits: batch.quantityUnits,
      reservedUnits: 0,
      unitPrice: 85.00,
      warehouseLocation: 'Nashik Processing Warehouse Bay A',
      mfgDate: batch.manufacturingDate,
      expiryDate: batch.expiryDate,
      shelfLifeRemainingDays: 365
    };
    setFinishedGoods(prev => [newGoods, ...prev]);
  };

  // Supply chain wholesaler helpers
  const addWholesalerCustomer = (customer: Omit<WholesalerCustomer, 'id'>) => {
    const id = `cust_${Date.now()}`;
    const newCust: WholesalerCustomer = { ...customer, id };
    setWholesalerCustomers(prev => [newCust, ...prev]);
  };

  const addBulkSalesOrder = (order: Omit<BulkSalesOrder, 'id'>) => {
    const id = `ord_wh_${Date.now()}`;
    const newOrder: BulkSalesOrder = { ...order, id };
    setBulkSalesOrders(prev => [newOrder, ...prev]);
  };

  const updateBulkSalesOrderStatus = (id: string, status: BulkSalesOrder['status']) => {
    setBulkSalesOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        session,
        isAuthenticated,
        logout,
        requireAuth,
        loginAsDemo,
        crops,
        addCrop,
        deleteCrop,
        mandiPrices,
        buyerReqs,
        addBuyerRequirement,
        connectionRequests,
        requestConnection,
        updateConnectionStatus,
        notifications,
        markNotificationsRead,
        language,
        setLanguage,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isScannerModalOpen,
        setIsScannerModalOpen,
        isAIModalOpen,
        setIsAIModalOpen,

        activeTab,
        setActiveTab,

        // Aggregator
        aggregatorFarmers,
        addAggregatorFarmer,
        updateFarmerStatus,
        collectionRequests,
        addCollectionRequest,
        updateCollectionStatus,
        weighingSlips,
        addWeighingSlip,
        qualityReports,
        addQualityReport,
        aggregatorInventory,
        addAggregatorInventoryItem,
        marketOffers,
        addMarketOffer,

        // Processor
        processingMachines,
        updateMachineStatus,
        addProcessingMachine,
        packagingBatches,
        addPackagingBatch,
        finishedGoods,
        wasteRecords,

        // Wholesaler
        wholesalerCustomers,
        addWholesalerCustomer,
        bulkSalesOrders,
        addBulkSalesOrder,
        updateBulkSalesOrderStatus,
        profitAnalytics,

        // Document Viewer
        activeDocument,
        openDocument,
        closeDocument,
        switchBuyerType
      }}
    >
      {children}

      {/* Global Document Viewer Modal */}
      <DocumentViewerModal
        document={activeDocument}
        isOpen={!!activeDocument}
        onClose={closeDocument}
      />
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
