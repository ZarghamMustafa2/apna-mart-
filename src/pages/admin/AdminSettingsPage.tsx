import React, { useState } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { StoreSettings } from '../../types/settings';
import { Settings, Save, Check, Shield, Globe, CreditCard, Truck, AlertTriangle } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings } = useAdminData();
  const [formData, setFormData] = useState<StoreSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field: keyof StoreSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">Global Configuration</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
            Store Settings & General Configuration
          </h1>
        </div>

        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
        >
          <Save className="w-4 h-4" />
          <span>Save Store Settings</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Store configuration updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Store Profile & Contact Info */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="text-base font-extrabold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-600" />
            Store Information & Contact Details
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Store Name</label>
              <input
                type="text"
                required
                value={formData.storeName}
                onChange={(e) => handleChange('storeName', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Contact Email</label>
              <input
                type="email"
                required
                value={formData.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={formData.contactPhone}
                  onChange={(e) => handleChange('contactPhone', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  required
                  value={formData.whatsAppNumber}
                  onChange={(e) => handleChange('whatsAppNumber', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Physical Address</label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Currency, Shipping & Payment Config */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-extrabold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-600" />
              Currency & Shipping Rules
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Currency Symbol</label>
                <input
                  type="text"
                  value={formData.currencySymbol}
                  onChange={(e) => handleChange('currencySymbol', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Default Delivery Fee (Rs.)</label>
                <input
                  type="number"
                  value={formData.defaultShippingFee}
                  onChange={(e) => handleChange('defaultShippingFee', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Free Shipping Threshold (Rs.)</label>
                <input
                  type="number"
                  value={formData.freeShippingThreshold}
                  onChange={(e) => handleChange('freeShippingThreshold', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-extrabold text-emerald-600"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-3">
            <h3 className="text-base font-extrabold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-brand-600" />
              Payment Gateways & Maintenance
            </h3>

            <label className="flex items-center justify-between text-xs font-bold text-gray-800 cursor-pointer">
              <span>Enable Cash on Delivery (COD)</span>
              <input
                type="checkbox"
                checked={formData.enableCod}
                onChange={(e) => handleChange('enableCod', e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 border-gray-300"
              />
            </label>

            <label className="flex items-center justify-between text-xs font-bold text-gray-800 cursor-pointer">
              <span>Enable Credit / Debit Card Payments</span>
              <input
                type="checkbox"
                checked={formData.enableCardPayment}
                onChange={(e) => handleChange('enableCardPayment', e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 border-gray-300"
              />
            </label>

            <label className="flex items-center justify-between text-xs font-bold text-gray-800 cursor-pointer">
              <span>Enable EasyPaisa / JazzCash Mobile Wallets</span>
              <input
                type="checkbox"
                checked={formData.enableMobileWallet}
                onChange={(e) => handleChange('enableMobileWallet', e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 border-gray-300"
              />
            </label>

            <label className="flex items-center justify-between text-xs font-bold text-red-600 pt-2 border-t border-gray-100 cursor-pointer">
              <span>Store Maintenance Mode</span>
              <input
                type="checkbox"
                checked={formData.maintenanceMode}
                onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                className="w-4 h-4 rounded text-red-600 border-gray-300"
              />
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};
