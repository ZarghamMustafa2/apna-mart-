import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqs = [
    {
      q: 'How do I place an order on ApnaMart?',
      a: 'Simply browse our catalog or search for your desired product, select any variant (size/color), and click "Add to Cart" or "Buy Now". Follow the checkout steps to enter your address and choose your payment method (Cash on Delivery or Online).',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept Cash on Delivery (COD) nationwide across Pakistan, Credit/Debit cards (Visa/Mastercard), and instant mobile wallets (EasyPaisa, JazzCash, Raast).',
    },
    {
      q: 'How long does delivery take?',
      a: 'Standard nationwide delivery takes 2 to 4 business days. Orders placed in major urban hubs like Lahore, Karachi, and Islamabad are often delivered within 24-48 hours.',
    },
    {
      q: 'Are your products 100% genuine and authentic?',
      a: 'Yes, absolutely. All products sold on ApnaMart are 100% authentic, sourced directly from authorized brand distributors, and come with official brand warranty cards.',
    },
    {
      q: 'What is your Return & Refund policy?',
      a: 'We offer a 7-Day Easy Return policy. If your product arrives damaged, defective, or incorrect, contact our WhatsApp support or submit a return request for a replacement or full refund.',
    },
    {
      q: 'How can I track my order status?',
      a: 'Click "Track Order" in the top bar or footer, enter your Order ID (e.g. ORD-2026-89421) and your phone number to see live step-by-step progress tracking.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) => f.q.toLowerCase().includes(searchTerm.toLowerCase()) || f.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <Breadcrumb items={[{ label: 'Help & FAQs' }]} />

      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-2">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-xs text-gray-500 font-medium">
          Have questions about shipping, payments, returns, or order tracking? Find quick answers below.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search questions or keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-semibold shadow-sm focus:border-brand-500 focus:outline-none"
        />
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>

      {/* Accordion List */}
      <div className="space-y-3 pt-4">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left font-bold text-xs sm:text-sm text-gray-900 hover:text-brand-600 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180 text-brand-600' : ''}`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-0 text-xs text-gray-600 leading-relaxed border-t border-gray-50">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
