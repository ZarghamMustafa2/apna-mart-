import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 lg:py-12">
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-brand-900 via-brand-700 to-slate-900 text-white p-5 sm:p-10 lg:p-14 shadow-xl">
        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-3 sm:space-y-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto text-brand-300">
            <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Subscribe & Get <span className="text-brand-300">Rs. 500 Voucher</span>
          </h2>

          <p className="text-[11px] sm:text-base text-brand-100 max-w-md mx-auto">
            Join our VIP list to receive exclusive discount codes, early access to seasonal sales, and new drops.
          </p>

          {subscribed ? (
            <div className="p-3 sm:p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl sm:rounded-2xl text-emerald-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              <span>Thank you for subscribing! Your voucher code WELCOME10 is active.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-md mx-auto pt-1 sm:pt-2">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2.5 sm:px-5 sm:py-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl text-xs sm:text-sm placeholder-brand-200 text-white focus:bg-white focus:text-gray-900 focus:outline-none transition-all"
              />
              <button
                type="submit"
                className="px-5 py-2.5 sm:px-6 sm:py-3.5 bg-white hover:bg-brand-50 text-slate-900 font-extrabold text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-md flex items-center justify-center gap-1.5 transition-all hover:scale-105 active:scale-95"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </form>
          )}

          <p className="text-[10px] sm:text-[11px] text-brand-200/70">
            We respect your privacy. Unsubscribe at any time with a single click.
          </p>
        </div>
      </div>
    </section>
  );
};
