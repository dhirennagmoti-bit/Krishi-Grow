import React, { useState } from 'react';
import {
  Users, Truck, PlusCircle, Search, Phone, Mail, MapPin,
  DollarSign, CheckCircle2, ArrowRight, X, Clock, ShieldCheck,
  Building2, Navigation
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { WholesalerCustomer, BulkSalesOrder } from '../../types';

export const WholesalerCustomersLogisticsPage: React.FC = () => {
  const {
    wholesalerCustomers, addWholesalerCustomer, bulkSalesOrders,
    updateBulkSalesOrderStatus
  } = useApp();

  const [activeTab, setActiveTab] = useState<'CUSTOMERS' | 'LOGISTICS'>('CUSTOMERS');
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // New Customer Form
  const [bizName, setBizName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState<'RETAILER' | 'RESTAURANT_CHAIN' | 'HOTEL' | 'EXPORTER' | 'PROCESSOR'>('RETAILER');
  const [city, setCity] = useState('Mumbai');
  const [creditLimit, setCreditLimit] = useState('1000000');

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bizName || !phone) return;

    addWholesalerCustomer({
      businessName: bizName,
      contactPerson: contactName || 'Store Incharge',
      phone,
      email: email || 'procure@business.com',
      type,
      city,
      state: 'Maharashtra',
      creditLimit: parseFloat(creditLimit) || 500000,
      outstandingBalance: 0,
      totalOrdersCount: 0,
      totalOrderValue: 0,
      status: 'ACTIVE'
    });

    setIsAddCustomerModalOpen(false);
    setBizName('');
    setPhone('');
  };

  const filteredCustomers = wholesalerCustomers.filter(c =>
    c.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="p-6 md:p-8 rounded-3xl bg-black/60 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-bold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5" /> Institutional Client Accounts & Outbound Logistics
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Customer CRM & Shipment Dispatch Tracking
          </h2>
          <p className="text-xs md:text-sm text-neutral-300 font-light">
            Manage credit limits for major retail & hotel buyers, and monitor real-time shipment dispatches.
          </p>
        </div>

        <button
          onClick={() => setIsAddCustomerModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-950 transition-all cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Add Customer Account</span>
        </button>
      </div>

      {/* Sub-Tabs Toggle */}
      <div className="flex p-1.5 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 max-w-md">
        <button
          onClick={() => setActiveTab('CUSTOMERS')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'CUSTOMERS'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Client CRM ({wholesalerCustomers.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('LOGISTICS')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'LOGISTICS'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Outbound Fleet ({bulkSalesOrders.length})</span>
        </button>
      </div>

      {/* 1. CUSTOMERS CRM VIEW */}
      {activeTab === 'CUSTOMERS' && (
        <div className="space-y-6">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search customers by business name, city, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-500 focus:border-purple-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredCustomers.map((cust) => (
              <div
                key={cust.id}
                className="p-6 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/10 hover:border-purple-500/30 transition-all space-y-4 shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-white text-base leading-tight">{cust.businessName}</h4>
                      <p className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-purple-400" /> {cust.city}, {cust.state}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {cust.type}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-neutral-400 font-sans">Contact:</span>
                      <strong className="text-white font-sans">{cust.contactPerson}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400 font-sans">Phone:</span>
                      <a href={`tel:${cust.phone}`} className="text-purple-300 underline">{cust.phone}</a>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400 font-sans">Credit Limit:</span>
                      <span className="text-white">₹{cust.creditLimit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400 font-sans">Outstanding:</span>
                      <span className="text-amber-400 font-bold">₹{cust.outstandingBalance.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="text-xs text-neutral-400 flex justify-between font-mono pt-1">
                    <span>{cust.totalOrdersCount} Completed Orders</span>
                    <strong className="text-emerald-400">₹{(cust.totalOrderValue / 100000).toFixed(1)} L Total</strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex gap-2">
                  <a
                    href={`tel:${cust.phone}`}
                    className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-purple-400" />
                    <span>Call Client</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. OUTBOUND LOGISTICS DISPATCH VIEW */}
      {activeTab === 'LOGISTICS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bulkSalesOrders.map((order) => (
            <div
              key={order.id}
              className="p-6 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/10 hover:border-blue-500/30 transition-all space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-white text-base">{order.cropOrProduct}</h4>
                    <span className="text-xs text-blue-400 font-mono font-bold block mt-0.5">{order.orderNumber}</span>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                    order.status === 'DELIVERED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    order.status === 'DISPATCHED' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-neutral-400 font-sans">Recipient Client:</span>
                    <strong className="text-white font-sans truncate max-w-[170px]">{order.customerName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400 font-sans">Destination:</span>
                    <span className="text-neutral-300 font-sans truncate max-w-[170px]">📍 {order.destinationCity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400 font-sans">Volume:</span>
                    <strong className="text-white">{(order.quantityKg / 1000).toFixed(2)} Tonnes</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400 font-sans">Fleet Vehicle:</span>
                    <span className="text-cyan-400 font-sans">{order.assignedVehicle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400 font-sans">Driver Contact:</span>
                    <a href={`tel:${order.driverPhone}`} className="text-blue-300 underline font-sans">{order.driverName} ({order.driverPhone})</a>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex gap-2">
                {order.status === 'CONFIRMED' && (
                  <button
                    onClick={() => updateBulkSalesOrderStatus(order.id, 'DISPATCHED')}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Dispatch Vehicle</span>
                  </button>
                )}

                {order.status === 'DISPATCHED' && (
                  <button
                    onClick={() => updateBulkSalesOrderStatus(order.id, 'DELIVERED')}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm Delivery Arrival</span>
                  </button>
                )}

                {order.status === 'DELIVERED' && (
                  <div className="w-full py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold text-center border border-emerald-500/20">
                    ✓ Delivery Completed & Invoiced
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add Customer Account */}
      {isAddCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <form onSubmit={handleCreateCustomer} className="bg-[#121214] border border-white/15 rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Register Institutional B2B Customer
              </h3>
              <button type="button" onClick={() => setIsAddCustomerModalOpen(false)} className="p-2 text-neutral-400 hover:text-white rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-bold mb-1">Company / Organization Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhakrishna Retail Marts"
                  value={bizName}
                  onChange={(e) => setBizName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Contact Person</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Client Business Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  >
                    <option value="RETAILER" className="bg-[#121214]">Retail Supermarket Chain</option>
                    <option value="HOTEL" className="bg-[#121214]">Hospitality / Hotel Chain</option>
                    <option value="RESTAURANT_CHAIN" className="bg-[#121214]">Restaurant Chain</option>
                    <option value="EXPORTER" className="bg-[#121214]">Export House</option>
                    <option value="PROCESSOR" className="bg-[#121214]">Food Processor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">City / Region</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-bold mb-1">Assigned Credit Limit (₹)</label>
                <input
                  type="number"
                  required
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex gap-3">
              <button
                type="button"
                onClick={() => setIsAddCustomerModalOpen(false)}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-lg cursor-pointer"
              >
                Register Account
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
