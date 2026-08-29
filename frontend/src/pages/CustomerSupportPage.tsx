import React, { useState } from 'react';
import {
  Headphones, Send, Mail, Phone, MessageSquare, AlertTriangle, CheckCircle2,
  Clock, ShieldCheck, UserCheck, Bot, FileText, ChevronDown, ChevronUp,
  Sparkles, ExternalLink, HelpCircle, RefreshCw, X, ShieldAlert, ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/Toast';
import type { SupportTicket, SupportCategory, SupportUrgency } from '../types';
import { initialSupportTickets, submitSupportTicketAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

export const CustomerSupportPage: React.FC = () => {
  const { user } = useApp();
  const { success, error } = useToast();

  const [tickets, setTickets] = useState<SupportTicket[]>(initialSupportTickets);
  const [selectedTicketId, setSelectedTicketId] = useState<string>(initialSupportTickets[0]?.id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Email Preview Modal State
  const [emailModalTicket, setEmailModalTicket] = useState<SupportTicket | null>(null);

  // Form State
  const [category, setCategory] = useState<SupportCategory>(
    user.role === 'FARMER' ? 'PAYMENT_DISPUTE' : 'CROP_QUALITY_DISPUTE'
  );
  const [urgency, setUrgency] = useState<SupportUrgency>('HIGH');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [lotOrOrderReference, setLotOrOrderReference] = useState('');
  const [contactEmail, setContactEmail] = useState(user.email || 'farmer@krishigrow.in');
  const [contactPhone, setContactPhone] = useState(user.phone || '+91 98220 12345');

  // Follow-up Reply State
  const [replyMessage, setReplyMessage] = useState('');

  const selectedTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0];

  const farmerCategoryOptions: { value: SupportCategory; label: string; desc: string }[] = [
    { value: 'PAYMENT_DISPUTE', label: '💰 Payment Delay from Buyer', desc: 'Payment not received within 24h of weighment' },
    { value: 'CROP_QUALITY_DISPUTE', label: '🌾 Crop Grading / QC Issue', desc: 'Disagreement on moisture, grade or rejection' },
    { value: 'TRANSPORT_LOGISTICS', label: '🚚 Transport & Vehicle Tracking', desc: 'Truck delay, driver contact, or toll issues' },
    { value: 'MANDI_PRICE_INQUIRY', label: '📈 Mandi Price & APMC Rate Query', desc: 'Real-time APMC rate discrepancy or advice' },
    { value: 'GOVT_SUBSIDY_ASSISTANCE', label: '🏛️ Govt Schemes & PM-Kisan Help', desc: 'Assistance with subsidy documentation' },
    { value: 'COLD_STORAGE_INQUIRY', label: '❄️ Cold Storage & Warehousing', desc: 'Slot booking or shelf-life preservation' },
    { value: 'GENERAL_INQUIRY', label: '❓ General Farmer Assistance', desc: 'Platform features, account or KYC support' },
  ];

  const buyerCategoryOptions: { value: SupportCategory; label: string; desc: string }[] = [
    { value: 'CROP_QUALITY_DISPUTE', label: '🔬 Batch QC & Lab Test Discrepancy', desc: 'Moisture/damage mismatch against contract' },
    { value: 'BUYER_ORDER_FULFILLMENT', label: '📦 Farmer Fulfillment Delay', desc: 'Harvest collection schedule or dispatch delay' },
    { value: 'TRANSPORT_LOGISTICS', label: '🚚 Weighbridge & Fleet Logistics', desc: 'Tare weight, transit slips or driver tracking' },
    { value: 'GST_INVOICE_BILLING', label: '🧾 GST Invoice & Mandi Cess Billing', desc: 'e-Way bill, tax slips, or escrow settlement' },
    { value: 'PAYMENT_DISPUTE', label: '💳 Escrow / Refund Dispute', desc: 'Advance payment release or deduction reconciliation' },
    { value: 'ACCOUNT_TECHNICAL_HELP', label: '⚙️ API & Telemetry Technical Support', desc: 'Sensor integration, QR traceability support' },
    { value: 'GENERAL_INQUIRY', label: '❓ General Supply Chain Inquiry', desc: 'Vendor onboarding and procurement help' },
  ];

  const currentCategoryOptions = user.role === 'FARMER' ? farmerCategoryOptions : buyerCategoryOptions;

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      error('Please provide both subject and detailed description');
      return;
    }

    setIsSubmitting(true);
    try {
      const newTicket = await submitSupportTicketAPI({
        userName: user.name,
        userRole: user.role,
        userEmail: contactEmail,
        userPhone: contactPhone,
        buyerType: user.buyerType,
        category,
        urgency,
        subject: subject.trim(),
        description: description.trim(),
        lotOrOrderReference: lotOrOrderReference.trim() || undefined
      });

      setTickets([newTicket, ...tickets]);
      setSelectedTicketId(newTicket.id);
      setEmailModalTicket(newTicket); // Open automatic email receipt preview!
      success(`Support Ticket ${newTicket.ticketNumber} registered! Auto-reply email delivered.`);

      // Reset form
      setSubject('');
      setDescription('');
      setLotOrOrderReference('');
    } catch {
      error('Error registering support ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;

    const userReply = {
      id: `rep_${Date.now()}`,
      sender: 'USER' as const,
      senderName: user.name,
      message: replyMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Auto simulated follow-up response from AI officer
    const aiFollowUp = {
      id: `rep_ai_${Date.now()}`,
      sender: 'AI_SUPPORT' as const,
      senderName: 'AgriAI Support Desk',
      message: `Thank you for the additional information, ${user.name}. We have logged this update to ${selectedTicket.assignedOfficerName || 'the Grievance Officer'}. Target update SLA remains under 2 hours.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = {
      ...selectedTicket,
      replies: [...selectedTicket.replies, userReply, aiFollowUp],
      updatedAt: new Date().toISOString()
    };

    setTickets(tickets.map(t => t.id === selectedTicket.id ? updated : t));
    setReplyMessage('');
    success('Follow-up message sent to support desk');
  };

  const faqs = user.role === 'FARMER' ? [
    {
      q: 'How does Krishi Grow guarantee farmer payment within 24 hours?',
      a: 'All registered buyers operate through verified escrow accounts. Once your crop weighment slip and quality grade are confirmed at the depot or mandi, funds are automatically released directly to your verified bank account under Section 38 of the APMC Act.'
    },
    {
      q: 'What should I do if a buyer disputes my crop grade or moisture level?',
      a: 'Submit a ticket under "Crop Grading / QC Issue" with your weighment slip photo. Krishi Grow appoints an independent APMC/NABL certified surveyor within 4 hours to perform a digital re-test. The batch cannot be rejected unilaterally.'
    },
    {
      q: 'How can I track transport vehicles assigned for my crop collection?',
      a: 'Go to the Transport tab or Customer Support desk with your collection reference. You can see real-time vehicle GPS coordinates, driver phone number, and estimated arrival time at your farm.'
    },
    {
      q: 'Is there a 24x7 toll-free emergency call centre for urgent field issues?',
      a: 'Yes! You can dial the Government Kisan Call Centre at 1800-180-1551 (Toll-Free, Multi-lingual) or our direct 24x7 Krishi Grow helpline at +91 1800-572-4769.'
    }
  ] : [
    {
      q: 'How does the automated QC rejection and batch arbitration process work?',
      a: 'When an incoming harvest lot fails moisture, foreign matter, or quality grade tolerances by >2%, log a ticket under "Batch QC & Lab Test Discrepancy". An automated calibrated certificate is generated and the supplier is given an option for price renegotiation or alternative processing routing (e.g. puree/dehydration).'
    },
    {
      q: 'How are GST invoices, APMC mandi cess, and e-Way bills generated?',
      a: 'Every fulfilled sales order automatically generates compliant e-Way bills and GST tax invoices. If there is a tax discrepancy, submit your invoice number for instantaneous automated ledger reconciliation.'
    },
    {
      q: 'What is the standard SLA for critical supply chain tickets?',
      a: 'Critical urgent tickets (e.g., transit breakdowns or weighbridge disputes) are triaged by AI immediately and assigned an active supply chain officer with a maximum 2-hour resolution window.'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ── Page Header ── */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-[#10141a] to-black p-6 md:p-8 rounded-3xl border border-emerald-500/20 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-600/30 border border-emerald-400/40 rounded-2xl text-emerald-400">
                <Headphones className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                  {user.role === 'FARMER' ? '🌾 Kisan 24x7 Grievance & Help Desk' : '🏢 Supply Chain Support & QC Arbitration'}
                </span>
                <h1 className="text-2xl md:text-3xl font-black text-white">
                  Customer Support & Auto-Reply Hub
                </h1>
              </div>
            </div>
            <p className="text-neutral-400 text-sm mt-2 max-w-2xl">
              Instant AI auto-resolution, 24-hour turnaround guarantee, official email ticketing, and direct APMC grievance arbitration for Indian farmers and buyers.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-black/50 border border-white/10 text-center">
              <span className="text-[10px] text-neutral-400 font-bold block uppercase">Resolution SLA</span>
              <span className="text-base font-black text-emerald-400 flex items-center justify-center gap-1">
                <Clock className="w-4 h-4" /> &lt; 2 Hours
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-black/50 border border-white/10 text-center">
              <span className="text-[10px] text-neutral-400 font-bold block uppercase">AI Auto-Triage</span>
              <span className="text-base font-black text-cyan-400 flex items-center justify-center gap-1">
                <Bot className="w-4 h-4" /> Instant
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-black/50 border border-white/10 text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] text-neutral-400 font-bold block uppercase">Helpline</span>
              <span className="text-base font-black text-amber-400 flex items-center justify-center gap-1">
                <Phone className="w-4 h-4" /> 1800-180-1551
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Kisan Emergency Helpline Banner ── */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-black border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 rounded-xl text-amber-400 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-amber-300">Toll-Free Agricultural Support Helpline (Multi-Lingual)</p>
            <p className="text-[11px] text-neutral-300">
              Government Kisan Call Centre: <strong className="text-white font-mono">1800-180-1551</strong> • Direct Krishi Grow Escalation Desk: <strong className="text-white font-mono">+91 1800-572-4769</strong>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="tel:18001801551"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md"
          >
            <Phone className="w-3.5 h-3.5" /> Call Toll-Free
          </a>
          <a
            href="https://wa.me/919822012345?text=Namaste%20Krishi%20Grow%20Support%2C%20I%20need%20assistance"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md"
          >
            <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Support
          </a>
        </div>
      </div>

      {/* ── Main Grid: Ticket Form & Ticket Ledger Desk ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Create Support Ticket Form (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#12161c]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white">Create Support Ticket</h2>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
                Auto-Reply Email Active
              </span>
            </div>

            <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs">
              {/* Category */}
              <div>
                <label className="block text-neutral-300 font-semibold mb-1.5">Issue Category *</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as SupportCategory)}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  {currentCategoryOptions.map(opt => (
                    <option key={opt.value} value={opt.value} className="bg-neutral-900 text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority / Urgency */}
              <div>
                <label className="block text-neutral-300 font-semibold mb-1.5">Priority Level</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL_URGENT'] as SupportUrgency[]).map(u => {
                    const isSel = urgency === u;
                    return (
                      <button
                        type="button"
                        key={u}
                        onClick={() => setUrgency(u)}
                        className={`py-2 px-1 rounded-xl font-bold text-[10px] text-center border transition-all cursor-pointer ${
                          isSel
                            ? u === 'CRITICAL_URGENT'
                              ? 'bg-rose-600 text-white border-rose-400 shadow-md shadow-rose-950'
                              : u === 'HIGH'
                              ? 'bg-amber-600 text-white border-amber-400 shadow-md shadow-amber-950'
                              : 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-950'
                            : 'bg-white/5 text-neutral-400 border-white/10 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {u === 'CRITICAL_URGENT' ? '🚨 URGENT' : u}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reference ID */}
              <div>
                <label className="block text-neutral-300 font-semibold mb-1.5">
                  {user.role === 'FARMER' ? 'Crop Lot / Batch Reference (Optional)' : 'PO / Weighment Slip # (Optional)'}
                </label>
                <input
                  type="text"
                  value={lotOrOrderReference}
                  onChange={e => setLotOrOrderReference(e.target.value)}
                  placeholder={user.role === 'FARMER' ? 'e.g. LOT-TOMATO-092' : 'e.g. PO-89241 or SLIP-4402'}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-neutral-300 font-semibold mb-1.5">Subject / Headline *</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Brief summary of your grievance or question"
                  required
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-neutral-300 font-semibold mb-1.5">Detailed Description *</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe your issue with exact quantities, dates, market location or buyer details..."
                  required
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
                />
              </div>

              {/* Contact Email & Phone */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="block text-neutral-400 text-[10px] font-semibold mb-1">Email for Auto-Reply Receipt</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    required
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 text-[10px] font-semibold mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={e => setContactPhone(e.target.value)}
                    required
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing AI Diagnosis & Sending Auto-Reply...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Ticket & Generate Auto-Reply</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Ticket Live Desk & Message Thread (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* Ticket Selector Bar */}
          <div className="bg-[#12161c]/80 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-400" /> Active Support Tickets ({tickets.length})
              </span>
              <span className="text-[10px] text-neutral-400">Click any ticket to view live chat & email receipt</span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {tickets.map(t => {
                const isSel = t.id === selectedTicketId;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    className={`shrink-0 p-3 rounded-2xl border text-left transition-all cursor-pointer min-w-[200px] ${
                      isSel
                        ? 'bg-emerald-950/60 border-emerald-500/60 shadow-lg text-white'
                        : 'bg-black/40 border-white/10 text-neutral-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono text-[10px] font-bold text-emerald-400">{t.ticketNumber}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                        t.urgency === 'CRITICAL_URGENT' || t.urgency === 'HIGH' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {t.urgency}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white truncate max-w-[180px]">{t.subject}</p>
                    <p className="text-[10px] text-neutral-400 mt-1 capitalize">{t.category.toLowerCase().replace(/_/g, ' ')}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Ticket Conversation & Resolution Pane */}
          {selectedTicket ? (
            <div className="bg-[#12161c]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl space-y-5">
              {/* Ticket Top Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-500/40">
                      {selectedTicket.ticketNumber}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-lg font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                      {selectedTicket.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-white mt-2">{selectedTicket.subject}</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Assigned: <strong className="text-emerald-300">{selectedTicket.assignedOfficerName}</strong> • SLA Window: ~{selectedTicket.estimatedResolutionHours}h
                  </p>
                </div>

                {/* View Email Auto-Reply Button */}
                {selectedTicket.autoReplyEmailPreview && (
                  <button
                    onClick={() => setEmailModalTicket(selectedTicket)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                    title="View exact auto-reply email delivered to inbox"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>View Auto-Reply Email</span>
                  </button>
                )}
              </div>

              {/* Message Thread */}
              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
                {selectedTicket.replies.map(rep => {
                  const isAi = rep.sender === 'AI_SUPPORT';
                  const isUser = rep.sender === 'USER';
                  return (
                    <div
                      key={rep.id}
                      className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                        isAi
                          ? 'bg-gradient-to-r from-emerald-950/40 to-teal-950/20 border-emerald-500/30 ml-4'
                          : isUser
                          ? 'bg-white/5 border-white/10 mr-4'
                          : 'bg-cyan-950/30 border-cyan-500/30 ml-4'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold flex items-center gap-1.5 text-white">
                          {isAi ? <Bot className="w-4 h-4 text-emerald-400" /> : <UserCheck className="w-4 h-4 text-neutral-400" />}
                          {rep.senderName}
                        </span>
                        <span className="text-[10px] text-neutral-400">{rep.timestamp}</span>
                      </div>
                      <p className="text-neutral-200 whitespace-pre-line">{rep.message}</p>
                    </div>
                  );
                })}
              </div>

              {/* Follow-up reply input */}
              <form onSubmit={handleSendReply} className="flex gap-2 pt-2 border-t border-white/10">
                <input
                  type="text"
                  value={replyMessage}
                  onChange={e => setReplyMessage(e.target.value)}
                  placeholder="Type an additional message or upload reference..."
                  className="flex-1 bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="p-8 text-center text-neutral-400 bg-white/5 rounded-3xl border border-white/10">
              Select or create a ticket to begin.
            </div>
          )}
        </div>
      </div>

      {/* ── FAQ Section ── */}
      <div className="bg-[#12161c]/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-6 h-6 text-emerald-400" />
          <h2 className="text-lg font-black text-white">
            Frequently Answered Questions for {user.role === 'FARMER' ? 'Farmers' : 'Buyers'}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-black/40 border border-white/10 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-white hover:text-emerald-300 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4 text-xs text-neutral-300 leading-relaxed border-t border-white/5 pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Auto-Reply Email Preview Modal ── */}
      <AnimatePresence>
        {emailModalTicket && emailModalTicket.autoReplyEmailPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="bg-[#161b22] border border-emerald-500/30 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Automated Customer Support Email</h3>
                    <p className="text-[10px] text-neutral-400 font-mono">
                      To: {emailModalTicket.autoReplyEmailPreview.recipient} • Sent: {emailModalTicket.autoReplyEmailPreview.sentAt}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEmailModalTicket(null)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Email Content Container */}
              <div className="rounded-2xl border border-white/10 p-5 bg-[#0d1117] space-y-4 text-xs">
                <div className="bg-emerald-950/60 p-4 rounded-xl border border-emerald-500/30 text-center">
                  <span className="text-lg font-black text-white block">🌾 Krishi Grow Support Desk</span>
                  <span className="text-[10px] text-emerald-300 uppercase tracking-widest font-bold">
                    Official Ticket Receipt & Immediate Action Advisory
                  </span>
                </div>

                <div className="p-3 bg-black/40 rounded-xl border border-white/10 space-y-1.5 text-[11px]">
                  <div className="flex justify-between"><span className="text-neutral-400">Ticket ID:</span><span className="font-mono font-bold text-emerald-400">{emailModalTicket.ticketNumber}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">Recipient:</span><span className="font-bold text-white">{emailModalTicket.userName} ({emailModalTicket.userRole})</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">Category:</span><span className="font-bold text-white">{emailModalTicket.category.replace(/_/g, ' ')}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">Target Resolution:</span><span className="font-bold text-cyan-400">Within {emailModalTicket.estimatedResolutionHours} Hours</span></div>
                </div>

                <div className="p-4 bg-emerald-950/30 border-l-4 border-emerald-500 rounded-r-xl space-y-2">
                  <span className="font-bold text-emerald-400 block uppercase tracking-wider text-[10px]">
                    ⚡ Instant Automated Resolution Assessment:
                  </span>
                  <p className="text-neutral-200 whitespace-pre-line leading-relaxed">
                    {emailModalTicket.replies.find(r => r.sender === 'AI_SUPPORT')?.message || 'Case assigned for immediate officer review.'}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/10 text-center text-[10px] text-neutral-400 space-y-1">
                  <p>24x7 Kisan Grievance Toll-Free: <strong>1800-180-1551</strong></p>
                  <p>Direct Support: <strong>support@krishigrow.in</strong> • Krishi Grow Value-Chain Platform</p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setEmailModalTicket(null)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
