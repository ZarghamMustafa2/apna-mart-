import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
} from 'lucide-react';
import { mockCategories } from '../../data/mockCategories';
import { useAdminData } from '../../context/AdminDataContext';
import { ApnaMartLogo } from '../common/ApnaMartLogo';

export const Footer: React.FC = () => {
  const { settings } = useAdminData();
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-24 lg:pb-12 border-t border-slate-900">
      {/* Top Value Propositions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Free Nationwide Shipping</h4>
            <p className="text-xs text-slate-400 mt-0.5">On all orders over Rs. 5,000</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">100% Authentic Products</h4>
            <p className="text-xs text-slate-400 mt-0.5">Direct official brand warranty</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Easy 7-Day Returns</h4>
            <p className="text-xs text-slate-400 mt-0.5">Hassle-free refund policy</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">24/7 Priority Support</h4>
            <p className="text-xs text-slate-400 mt-0.5">Call or WhatsApp anytime</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Column 1: Brand Info */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="inline-block">
            <ApnaMartLogo customLogoUrl={settings?.logoUrl} size="lg" inverted />
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            Pakistan's trusted destination for authentic electronics, modern fashion apparel, footwear, and lifestyle essentials. Built for unmatched convenience and speed.
          </p>

          <div className="space-y-2 pt-2 text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0" />
              <span>Main Boulevard, Gulberg III, Lahore, Pakistan</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-brand-400 flex-shrink-0" />
              <span>+92 300 1234567 | +92 42 35718899</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-brand-400 flex-shrink-0" />
              <span>support@apnamart.space</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-brand-400 flex-shrink-0" />
              <span>Mon - Sat: 9:00 AM - 10:00 PM</span>
            </div>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-brand-500 pl-2.5">
            Quick Links
          </h3>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/" className="hover:text-brand-400 transition-colors">Home</Link></li>
            <li><Link to="/shop" className="hover:text-brand-400 transition-colors">All Products</Link></li>
            <li><Link to="/about" className="hover:text-brand-400 transition-colors">About ApnaMart</Link></li>
            <li><Link to="/contact" className="hover:text-brand-400 transition-colors">Contact Us</Link></li>
            <li><Link to="/faq" className="hover:text-brand-400 transition-colors">Frequently Asked Questions</Link></li>
          </ul>
        </div>

        {/* Column 3: Product Categories */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-brand-500 pl-2.5">
            Categories
          </h3>
          <ul className="space-y-2.5 text-xs">
            {mockCategories.map(cat => (
              <li key={cat.id}>
                <Link to={`/shop?category=${cat.slug}`} className="hover:text-brand-400 transition-colors">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Customer Care & Policies */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-brand-500 pl-2.5">
            Customer Care
          </h3>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/track-order" className="hover:text-brand-400 transition-colors font-semibold text-brand-400">Track Your Order</Link></li>
            <li><Link to="/account" className="hover:text-brand-400 transition-colors">My Account & Orders</Link></li>
            <li><Link to="/shipping-policy" className="hover:text-brand-400 transition-colors">Shipping Policy</Link></li>
            <li><Link to="/return-policy" className="hover:text-brand-400 transition-colors">Return & Refund Policy</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-brand-400 transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms-conditions" className="hover:text-brand-400 transition-colors">Terms & Conditions</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Payment Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© 2026 ApnaMart Inc. All rights reserved. Designed for excellence.</p>

        {/* Payment Methods Badges */}
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 font-bold border border-slate-800">
            💵 Cash on Delivery
          </span>
          <span className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 font-bold border border-slate-800">
            💳 Visa / Mastercard
          </span>
          <span className="px-2.5 py-1 rounded bg-slate-900 text-emerald-400 font-bold border border-slate-800">
            📱 EasyPaisa / JazzCash
          </span>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-3 text-slate-400">
          <a href="#" className="p-2 rounded-full bg-slate-900 hover:text-brand-400 hover:bg-slate-800 transition-colors" aria-label="Facebook">
            <Facebook className="w-4 h-4" />
          </a>
          <a href="#" className="p-2 rounded-full bg-slate-900 hover:text-brand-400 hover:bg-slate-800 transition-colors" aria-label="Instagram">
            <Instagram className="w-4 h-4" />
          </a>
          <a href="#" className="p-2 rounded-full bg-slate-900 hover:text-brand-400 hover:bg-slate-800 transition-colors" aria-label="Twitter">
            <Twitter className="w-4 h-4" />
          </a>
          <a href="#" className="p-2 rounded-full bg-slate-900 hover:text-brand-400 hover:bg-slate-800 transition-colors" aria-label="YouTube">
            <Youtube className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
};
