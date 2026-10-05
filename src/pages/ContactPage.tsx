import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <Breadcrumb items={[{ label: 'Contact Support' }]} />

      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Get in Touch With Us
        </h1>
        <p className="text-xs text-gray-500 font-medium">
          Have a inquiry regarding an order, partnership, or product detail? Our team is available 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-3">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 w-fit">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-gray-900 text-sm">WhatsApp Priority Support</h3>
            <p className="text-xs text-gray-500">Fastest response for order status & product queries.</p>
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-3">
            <div className="p-3 rounded-2xl bg-brand-50 text-brand-600 w-fit">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-gray-900 text-sm">Phone Hotlines</h3>
            <p className="text-xs text-gray-500">+92 300 1234567 • +92 42 35718899</p>
            <span className="text-[11px] text-gray-400 font-medium">Mon - Sat: 9:00 AM - 10:00 PM</span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-3">
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 w-fit">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-gray-900 text-sm">Headquarters & Store</h3>
            <p className="text-xs text-gray-500">Main Boulevard, Gulberg III, Lahore, Punjab, Pakistan</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-4">
            Send Us a Direct Message
          </h3>

          {submitted ? (
            <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
              <h4 className="text-lg font-bold">Message Sent Successfully!</h4>
              <p className="text-xs text-emerald-700">Thank you for reaching out. Our representative will respond via email/phone within 2 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Farhan Ali"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Your Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="farhan@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Order inquiry / Product specs question"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Message Details</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Write your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-500"
                />
              </div>

              <button
                type="submit"
                className="px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
