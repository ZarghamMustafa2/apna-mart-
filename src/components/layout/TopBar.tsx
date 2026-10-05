import React from 'react';
import { Phone, Truck, ShieldCheck, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TopBar: React.FC = () => {
  return (
    <div className="bg-slate-900 text-slate-300 text-xs py-2 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Left Side Info */}
        <div className="hidden md:flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Phone className="w-3.5 h-3.5 text-brand-400" />
            Hotline: <strong className="text-slate-200">+92 300 1234567</strong>
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            100% Authentic Products
          </span>
        </div>

        {/* Center Announcement */}
        <div className="flex items-center gap-2 mx-auto md:mx-0">
          <Truck className="w-3.5 h-3.5 text-brand-400 animate-bounce" />
          <p className="font-medium text-slate-200">
            Free Shipping on Orders Over <span className="text-brand-400 font-bold">Rs. 5,000</span> | Use Code <span className="bg-brand-500/20 text-brand-300 px-1.5 py-0.5 rounded font-mono">WELCOME10</span>
          </p>
        </div>

        {/* Right Side Links */}
        <div className="hidden sm:flex items-center gap-4 text-slate-400">
          <Link to="/track-order" className="hover:text-brand-400 flex items-center gap-1 transition-colors">
            <MapPin className="w-3.5 h-3.5" />
            Track Order
          </Link>
          <span className="text-slate-700">|</span>
          <Link to="/faq" className="hover:text-brand-400 transition-colors">
            Help & FAQ
          </Link>
        </div>
      </div>
    </div>
  );
};
