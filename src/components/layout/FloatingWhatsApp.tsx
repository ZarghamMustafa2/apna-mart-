import React from 'react';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const whatsappNumber = '923001234567';
  const defaultMessage = 'Hello ApnaMart Support, I have a question regarding an order/product.';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 p-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center gap-2 group ring-4 ring-emerald-500/20"
    >
      <MessageCircle className="w-6 h-6 fill-white text-emerald-500" />
      <span className="hidden group-hover:inline text-xs font-bold pr-1 transition-all">
        Need Help? Chat on WhatsApp
      </span>
    </a>
  );
};
