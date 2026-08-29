import React, { useState } from 'react';
import {
  Store, PlusCircle, Search, Filter, ShoppingBag, DollarSign,
  FileText, CheckCircle2, Truck, ArrowRight, X, Building2, MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getCropImage } from '../../data/cropCatalog';
import type { QualityGrade, BulkSalesOrder } from '../../types';

export const WholesalerMarketplaceSalesPage: React.FC = () => {
  const {
    marketOffers, bulkSalesOrders, addBulkSalesOrder,
    wholesalerCustomers, openDocument, user
  } = useApp();

  const [activeTab, setActiveTab] = useState<'MARKETPLACE' | 'SALES_ORDERS'>('MARKETPLACE');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // New Sales Order Form
  const [selectedCustomerId, setSelectedCustomerId] = useState(wholesalerCustomers[0]?.id || 'cust_01');
  const [orderCrop, setOrderCrop] = useState('Red Onion');
  const [orderGrade, setOrderGrade] = useState<QualityGrade>('A');
  const [orderQtyKg, setOrderQtyKg] = useState('5000');
  const [orderPriceKg, setOrderPriceKg] = useState('26.00');
  const [orderDestCity, setOrderDestCity] = useState('Vashi APMC Hub, Navi Mumbai');
  const [orderDeliveryDate, setOrderDeliveryDate] = useState('2026-08-26');
  const [orderVehicle, setOrderVehicle] = useState('Ashok Leyland Dost (MH-15-BD-3391)');
  const [driverName, setDriverName] = useState('Suresh Patil');
  const [driverPhone, setDriverPhone] = useState('+91 98221 44021');

  const totalAmount = (parseFloat(orderQtyKg) || 0) * (parseFloat(orderPriceKg) || 0);

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = wholesalerCustomers.find(c => c.id === selectedCustomerId) || wholesalerCustomers[0];
    const orderNum = `SO-WH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    addBulkSalesOrder({
      orderNumber: orderNum,
      customerName: customer.businessName,
      customerPhone: customer.phone,
      customerType: customer.type,
      cropOrProduct: orderCrop,
      grade: orderGrade,
      quantityKg: parseFloat(orderQtyKg) || 1000,
      pricePerKg: parseFloat(orderPriceKg) || 20,
      totalAmount,
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: orderDeliveryDate,
      destinationCity: orderDestCity,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      assignedVehicle: orderVehicle,
      driverName,
      driverPhone
    });

    setIsOrderModalOpen(false);
  };

  const handleBuyMarketOffer = (offer: any) => {
    openDocument({
      id: offer.id,
      type: 'PURCHASE_ORDER',
      docNumber: `PO-WH-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split('T')[0],
      issuerName: user.businessName || 'Mahalaxmi Agri Wholesale Ltd',
      issuerRole: 'Wholesale Procurement Directorate',
      recipientName: offer.sellerName,
      cropOrProduct: `${offer.crop} (${offer.variety})`,
      quantity: `${offer.quantityKg} Kg (${(offer.quantityKg / 1000).toFixed(1)} Tonnes)`,
      grade: `Grade ${offer.grade}`,
      amount: offer.quantityKg * offer.expectedPricePerKg,
      status: 'CONFIRMED & ISSUED',
      metadata: {
        location: offer.location,
        availableDate: offer.availableFromDate
      }
    });
  };

  const handleViewSalesInvoice = (order: BulkSalesOrder) => {
    openDocument({
      id: order.id,
      type: 'SALES_INVOICE',
      docNumber: `INV-${order.orderNumber}`,
      date: order.orderDate,
      issuerName: user.businessName || 'Mahalaxmi Agri Wholesale Ltd',
      issuerRole: 'Wholesale Commercial Billing',
      recipientName: order.customerName,
      cropOrProduct: `${order.cropOrProduct} (Grade ${order.grade})`,
      quantity: `${order.quantityKg} Kg (${(order.quantityKg / 1000).toFixed(2)} Tonnes)`,
      grade: `Grade ${order.grade}`,
      amount: order.totalAmount,
      status: order.paymentStatus,
      metadata: {
        destinationCity: order.destinationCity,
        assignedVehicle: order.assignedVehicle,
        driverName: order.driverName
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="p-6 md:p-8 rounded-xl bg-black/60 backdrop-blur-2xl border border-white/10 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold uppercase tracking-wider mb-2">
            <Store className="w-3.5 h-3.5" /> B2B Spot Trading & Commercial Fulfillment
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Bulk Marketplace & Sales Orders
          </h2>
          <p className="text-xs md:text-sm text-neutral-300 font-normal">
            Procure verified bulk crop lots directly from Aggregators and generate B2B sales invoices for institutional clients.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'SALES_ORDERS' ? (
            <button
              onClick={() => setIsOrderModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-md transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Create B2B Sales Order</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('SALES_ORDERS')}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-950 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>View All Sales Invoices</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-Tabs Toggle */}
      <div className="flex p-1.5 bg-black/40 backdrop-blur-xl rounded-xl border border-white/10 max-w-md">
        <button
          onClick={() => setActiveTab('MARKETPLACE')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'MARKETPLACE'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Available Aggregator Lots ({marketOffers.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('SALES_ORDERS')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'SALES_ORDERS'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Sales Orders & Invoices ({bulkSalesOrders.length})</span>
        </button>
      </div>

      {/* 1. BULK MARKETPLACE VIEW */}
      {activeTab === 'MARKETPLACE' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {marketOffers.map((offer) => (
            <div
              key={offer.id}
              className="p-6 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 hover:border-blue-500/40 transition-all space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={getCropImage(offer.crop)}
                      alt={offer.crop}
                      className="w-14 h-14 rounded-xl object-cover border border-white/15 shadow-md"
                    />
                    <div>
                      <h4 className="font-bold text-white text-base leading-tight">{offer.crop}</h4>
                      <p className="text-xs text-neutral-400">{offer.variety}</p>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 inline-block mt-1">
                        Grade {offer.grade}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {offer.status}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-neutral-400 font-sans">Available Volume:</span>
                    <strong className="text-white">{(offer.quantityKg / 1000).toFixed(1)} Tonnes</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400 font-sans">Asking Price:</span>
                    <strong className="text-emerald-400 text-sm">₹{offer.expectedPricePerKg.toFixed(2)} / kg</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400 font-sans">Seller:</span>
                    <span className="text-white font-sans">{offer.sellerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400 font-sans">Location:</span>
                    <span className="text-neutral-300 font-sans truncate max-w-[150px]">{offer.location}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex gap-2">
                <button
                  onClick={() => handleBuyMarketOffer(offer)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-950"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Issue Purchase Order (Buy Bulk)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. SALES ORDERS & INVOICES VIEW */}
      {activeTab === 'SALES_ORDERS' && (
        <div className="space-y-4">
          <div className="rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-neutral-300 font-bold uppercase text-xs border-b border-white/10">
                  <tr>
                    <th className="py-4 px-5">Order # & Crop</th>
                    <th className="py-4 px-5">Buyer Client</th>
                    <th className="py-4 px-5 font-mono">Volume</th>
                    <th className="py-4 px-5 font-mono">Price / kg</th>
                    <th className="py-4 px-5 font-mono">Total Invoice</th>
                    <th className="py-4 px-5">Dispatch & Vehicle</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {bulkSalesOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img src={getCropImage(order.cropOrProduct)} alt={order.cropOrProduct} className="w-10 h-10 rounded-xl object-cover border border-white/10" />
                          <div>
                            <span className="font-bold text-white font-sans text-sm block">{order.cropOrProduct}</span>
                            <span className="text-xs text-cyan-400">{order.orderNumber}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5 font-sans font-medium text-white">
                        {order.customerName}
                        <span className="text-xs text-neutral-400 block font-mono">📍 {order.destinationCity}</span>
                      </td>

                      <td className="py-4 px-5 font-bold text-white">
                        {(order.quantityKg / 1000).toFixed(2)} T ({order.quantityKg.toLocaleString()} kg)
                      </td>

                      <td className="py-4 px-5 text-emerald-400">
                        ₹{order.pricePerKg.toFixed(2)}/kg
                      </td>

                      <td className="py-4 px-5 font-black text-white text-sm">
                        ₹{order.totalAmount.toLocaleString()}
                      </td>

                      <td className="py-4 px-5 font-sans">
                        <span className="text-neutral-300 block font-mono text-xs">{order.assignedVehicle}</span>
                        <span className="text-xs text-neutral-400 font-sans">Driver: {order.driverName}</span>
                      </td>

                      <td className="py-4 px-5 font-sans">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          order.status === 'DELIVERED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          order.status === 'DISPATCHED' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                          'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {order.status}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right font-sans">
                        <button
                          onClick={() => handleViewSalesInvoice(order)}
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/10 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-400" />
                          <span>View Invoice</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create B2B Sales Order */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <form onSubmit={handleCreateOrder} className="bg-[#121214] border border-white/15 rounded-xl max-w-lg w-full p-6 md:p-8 space-y-5 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Generate B2B Institutional Sales Order
              </h3>
              <button type="button" onClick={() => setIsOrderModalOpen(false)} className="p-2 text-neutral-400 hover:text-white rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-bold mb-1">Select Client Account</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-blue-500"
                >
                  {wholesalerCustomers.map(c => (
                    <option key={c.id} value={c.id} className="bg-[#121214]">
                      {c.businessName} ({c.type} - {c.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Commodity / Crop</label>
                  <select
                    value={orderCrop}
                    onChange={(e) => setOrderCrop(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-blue-500"
                  >
                    <option value="Red Onion" className="bg-[#121214]">Red Onion</option>
                    <option value="Tomato" className="bg-[#121214]">Tomato</option>
                    <option value="Soybean" className="bg-[#121214]">Soybean</option>
                    <option value="Wheat" className="bg-[#121214]">Wheat</option>
                    <option value="Turmeric" className="bg-[#121214]">Turmeric</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Grade</label>
                  <select
                    value={orderGrade}
                    onChange={(e) => setOrderGrade(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-blue-500 font-bold"
                  >
                    <option value="A+" className="bg-[#121214]">Grade A+</option>
                    <option value="A" className="bg-[#121214]">Grade A</option>
                    <option value="B" className="bg-[#121214]">Grade B</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Quantity (Kg)</label>
                  <input
                    type="number"
                    required
                    value={orderQtyKg}
                    onChange={(e) => setOrderQtyKg(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Billing Price (₹/kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={orderPriceKg}
                    onChange={(e) => setOrderPriceKg(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 flex items-center justify-between font-mono">
                <span className="text-neutral-300 font-sans font-bold">Total Order Value:</span>
                <span className="text-base font-black text-blue-300">₹{totalAmount.toLocaleString()}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Delivery Destination</label>
                  <input
                    type="text"
                    required
                    value={orderDestCity}
                    onChange={(e) => setOrderDestCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Delivery Target Date</label>
                  <input
                    type="date"
                    required
                    value={orderDeliveryDate}
                    onChange={(e) => setOrderDeliveryDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex gap-3">
              <button
                type="button"
                onClick={() => setIsOrderModalOpen(false)}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Issue Order & Dispatch
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
