import React from 'react';
import {
  X, Printer, CheckCircle2, FileText, QrCode, ShieldCheck,
  Building2, MapPin, Phone, Calendar, Download, Scale
} from 'lucide-react';
import type { SupplyChainDocument } from '../types';

interface DocumentViewerModalProps {
  document: SupplyChainDocument | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document,
  isOpen,
  onClose
}) => {
  if (!isOpen || !document) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#121214] border border-white/15 rounded-xl max-w-3xl w-full overflow-hidden shadow-md flex flex-col max-h-[90vh]">
        
        {/* Header Action Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base leading-tight">
                {document.type.replace('_', ' ')}
              </h3>
              <p className="text-xs text-neutral-400 font-mono">
                Doc Ref: {document.docNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Paper Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 bg-[#0a0a0c] text-white">
          
          {/* Top Organization Letterhead */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-black text-xl tracking-tight">
                <span>🌱 KRISHI GROW</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Verified E-Supply Chain
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                National Agricultural Value Chain & Digital Trade Registry
              </p>
            </div>

            <div className="text-left sm:text-right font-mono text-xs text-neutral-300 space-y-0.5">
              <div><strong className="text-white">Date:</strong> {document.date}</div>
              <div><strong className="text-white">Status:</strong> <span className="text-emerald-400 font-bold">{document.status}</span></div>
              <div><strong className="text-white">Verification:</strong> SHA-256 Validated</div>
            </div>
          </div>

          {/* Issuer & Recipient Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-white/5 border border-white/10 text-xs">
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold text-neutral-400 tracking-wider">ISSUED BY (Party A)</span>
              <h4 className="font-bold text-white text-sm">{document.issuerName}</h4>
              <p className="text-neutral-300">{document.issuerRole}</p>
              {document.metadata?.issuerLocation && (
                <p className="text-neutral-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-emerald-400" /> {document.metadata.issuerLocation}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase font-bold text-neutral-400 tracking-wider">RECIPIENT / BUYER (Party B)</span>
              <h4 className="font-bold text-white text-sm">{document.recipientName}</h4>
              <p className="text-neutral-300">{document.metadata?.recipientRole || 'Procurement Partner'}</p>
              {document.metadata?.recipientLocation && (
                <p className="text-neutral-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-emerald-400" /> {document.metadata.recipientLocation}
                </p>
              )}
            </div>
          </div>

          {/* Core Goods / Quality Table */}
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/10 text-neutral-300 font-bold uppercase text-xs">
                <tr>
                  <th className="py-3 px-4">Commodity / Item</th>
                  <th className="py-3 px-4">Grade & Spec</th>
                  <th className="py-3 px-4">Quantity</th>
                  {document.amount && <th className="py-3 px-4 text-right">Total (₹)</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                <tr>
                  <td className="py-3.5 px-4 font-bold text-white">
                    {document.cropOrProduct}
                  </td>
                  <td className="py-3.5 px-4 text-emerald-400">
                    {document.grade || 'Grade A Verified'}
                  </td>
                  <td className="py-3.5 px-4 text-white">
                    {document.quantity}
                  </td>
                  {document.amount && (
                    <td className="py-3.5 px-4 text-right font-black text-emerald-400 text-sm">
                      ₹{document.amount.toLocaleString()}
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Conditional Metadata Details */}
          {document.type === 'QUALITY_CERTIFICATE' && document.metadata?.parameters && (
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/20 space-y-3">
              <h5 className="font-bold text-emerald-300 text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Laboratory & Organoleptic Quality Analysis
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="bg-black/40 p-2 rounded-xl border border-white/10">
                  <span className="text-xs text-neutral-400 block font-sans">Moisture Content</span>
                  <span className="font-bold text-white">{document.metadata.parameters.moisturePercent}%</span>
                </div>
                <div className="bg-black/40 p-2 rounded-xl border border-white/10">
                  <span className="text-xs text-neutral-400 block font-sans">Defects / Damage</span>
                  <span className="font-bold text-emerald-400">{document.metadata.parameters.damagePercent}%</span>
                </div>
                <div className="bg-black/40 p-2 rounded-xl border border-white/10">
                  <span className="text-xs text-neutral-400 block font-sans">Foreign Matter</span>
                  <span className="font-bold text-white">{document.metadata.parameters.foreignMaterialPercent}%</span>
                </div>
                <div className="bg-black/40 p-2 rounded-xl border border-white/10">
                  <span className="text-xs text-neutral-400 block font-sans">Ripeness / Color</span>
                  <span className="font-bold text-emerald-400">{document.metadata.parameters.color}</span>
                </div>
              </div>
            </div>
          )}

          {document.type === 'TRACEABILITY_PASSPORT' && document.metadata?.trace && (
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/20 space-y-3">
              <h5 className="font-bold text-cyan-300 text-xs flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-cyan-400" />
                Immutable QR Supply Lineage (Farm-to-Fork)
              </h5>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-neutral-400">1. Farm Origin:</span>
                  <strong className="text-white">{document.metadata.trace.farmOrigin}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-neutral-400">2. Cultivator / Farmer:</span>
                  <strong className="text-white">{document.metadata.trace.farmer}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span className="text-neutral-400">3. Aggregated By:</span>
                  <strong className="text-white">{document.metadata.trace.aggregator}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                  <span className="text-neutral-400">4. Processing Batch:</span>
                  <strong className="text-white font-mono">{document.metadata.trace.rawBatchId}</strong>
                </div>
              </div>
            </div>
          )}

          {/* QR Code & Digital Stamp Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white p-1 rounded-xl flex items-center justify-center shrink-0">
                {/* Visual SVG QR Code Graphic */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-black" fill="currentColor">
                  <rect width="25" height="25" />
                  <rect x="75" width="25" height="25" />
                  <rect y="75" width="25" height="25" />
                  <rect x="35" y="35" width="30" height="30" />
                  <rect x="5" y="35" width="10" height="20" />
                  <rect x="85" y="45" width="10" height="30" />
                  <rect x="35" y="5" width="25" height="10" />
                  <rect x="45" y="85" width="25" height="10" />
                </svg>
              </div>
              <div>
                <span className="text-xs text-neutral-400 block font-bold uppercase">Digital Security Hash</span>
                <span className="text-xs font-mono text-emerald-400 font-bold">KG-BLOCK-884029-CERT</span>
                <p className="text-xs text-neutral-400 mt-0.5">Scan to verify authentic certificate ledger on Krishi Grow.</p>
              </div>
            </div>

            <div className="text-right">
              <div className="w-32 h-10 border-b border-white/30 mb-1 flex items-end justify-center">
                <span className="text-xs text-emerald-300 font-serif italic">Verified Digital Signature</span>
              </div>
              <span className="text-xs text-neutral-400 font-medium">Authorized Supply Officer</span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-white/5 flex items-center justify-between text-xs text-neutral-400">
          <span>Krishi Grow E-Commerce & Logistics Engine</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
