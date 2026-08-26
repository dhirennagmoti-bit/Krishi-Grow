import React from 'react';
import { Sprout, Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <footer className="bg-white border-t border-borderLight pt-12 pb-8">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-gray-100">
          
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-agri-600 flex items-center justify-center text-white font-bold">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-charcoal">Krishi Grow</span>
            </div>
            <p className="text-xs text-mutedText leading-relaxed">
              Empowering farmers & buyers across India with smart value-chain analytics, crop transport calculators, cold chain locator, mandi live prices, and direct matchmaking.
            </p>
            <div className="flex items-center gap-2 text-xs text-agri-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-agri-600" /> WDRA & APMC Verified Partner
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-3">Platform Tools</h4>
            <ul className="space-y-2 text-xs text-mutedText font-medium">
              <li><button onClick={() => setActiveTab('solutions')} className="hover:text-agri-600 transition-colors">Transport Calculator</button></li>
              <li><button onClick={() => setActiveTab('market-prices')} className="hover:text-agri-600 transition-colors">Mandi Live Price Charts</button></li>
              <li><button onClick={() => setActiveTab('solutions')} className="hover:text-agri-600 transition-colors">AI Manufactured Products</button></li>
              <li><button onClick={() => setActiveTab('solutions')} className="hover:text-agri-600 transition-colors">Cold Storage & Processing Hub</button></li>
              <li><button onClick={() => setActiveTab('schemes')} className="hover:text-agri-600 transition-colors">Government Schemes</button></li>
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-3">User Portals</h4>
            <ul className="space-y-2 text-xs text-mutedText font-medium">
              <li><button onClick={() => setActiveTab('farmer-dashboard')} className="hover:text-agri-600 transition-colors">Farmer Dashboard</button></li>
              <li><button onClick={() => setActiveTab('add-crop')} className="hover:text-agri-600 transition-colors">Add Crop Record Wizard</button></li>
              <li><button onClick={() => setActiveTab('buyer-dashboard')} className="hover:text-agri-600 transition-colors">Buyer & Aggregator Portal</button></li>
              <li><button onClick={() => setActiveTab('buyer-connections')} className="hover:text-agri-600 transition-colors">Buyer Matchmaking Engine</button></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-3">Helpline & Support</h4>
            <div className="space-y-2 text-xs text-mutedText">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-agri-600" />
                <a href="tel:+9118002005544" className="font-semibold text-charcoal hover:underline">+91 1800-200-5544 (Toll Free)</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-agri-600" />
                <a href="mailto:support@krishigrow.com" className="hover:underline text-charcoal">support@krishigrow.com</a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-agri-600" />
                <span>APMC Market Complex, Nashik, Maharashtra</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-mutedText gap-4">
          <p>© 2026 Krishi Grow Platform. Built for Indian Agriculture value-chain.</p>
          <div className="flex items-center gap-4">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
            <span className="hover:underline cursor-pointer">APMC Data Licensing</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
