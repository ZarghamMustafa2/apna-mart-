import React, { useState, useEffect } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { StoreSettings } from '../../types/settings';
import { ImageUploader } from '../../components/common/ImageUploader';
import { ApnaMartLogo } from '../../components/common/ApnaMartLogo';
import {
  Settings,
  Save,
  Check,
  Shield,
  Globe,
  CreditCard,
  Truck,
  Palette,
  Sparkles,
  Loader2,
  Database,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowUpRight,
} from 'lucide-react';
import {
  getSupabaseCredentials,
  saveSupabaseCredentials,
  isSupabaseConfigured,
} from '../../services/supabase';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings, isCloudConnected, syncToCloud, checkCloudConnection } = useAdminData();
  const [formData, setFormData] = useState<StoreSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Cloud database credentials state
  const initialCreds = getSupabaseCredentials();
  const [supabaseUrl, setSupabaseUrl] = useState(initialCreds.url);
  const [supabaseKey, setSupabaseKey] = useState(initialCreds.key);
  const [cloudStatusMsg, setCloudStatusMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isTestingCloud, setIsTestingCloud] = useState(false);
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleChange = (field: keyof StoreSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error('Settings update error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCloudCredentials = () => {
    saveSupabaseCredentials(supabaseUrl, supabaseKey);
    setCloudStatusMsg({ text: 'Cloud credentials saved! Re-testing connection...', type: 'info' });
    handleTestCloud();
  };

  const handleTestCloud = async () => {
    setIsTestingCloud(true);
    saveSupabaseCredentials(supabaseUrl, supabaseKey);
    try {
      const res = await checkCloudConnection();
      if (res.success) {
        setCloudStatusMsg({ text: res.message, type: 'success' });
      } else {
        setCloudStatusMsg({ text: res.message, type: 'error' });
      }
    } finally {
      setIsTestingCloud(false);
    }
  };

  const handleSyncToCloud = async () => {
    if (!isSupabaseConfigured()) {
      setCloudStatusMsg({ text: 'Please configure valid Supabase credentials first.', type: 'error' });
      return;
    }
    setIsSyncingCloud(true);
    setCloudStatusMsg({ text: 'Uploading local records to cloud database...', type: 'info' });
    try {
      const res = await syncToCloud();
      if (res.success) {
        setCloudStatusMsg({ text: res.message, type: 'success' });
      } else {
        setCloudStatusMsg({ text: res.message, type: 'error' });
      }
    } finally {
      setIsSyncingCloud(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">Global Configuration</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
            Store Settings & General Configuration
          </h1>
          <p className="text-xs text-gray-500 font-medium">Manage branding, business info, payment methods, and shipping rules</p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="px-6 py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-extrabold text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{isSaving ? 'Saving...' : 'Save Store Settings'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Store configuration updated successfully! Changes reflect immediately across ApnaMart.</span>
        </div>
      )}

      {/* CLOUD DATABASE & REALTIME SYNCHRONIZATION CARD */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700/60 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight text-white">Centralized Cloud Database & Realtime Sync</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${isCloudConnected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isCloudConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                  {isCloudConnected ? 'Cloud Realtime Connected' : 'Local Offline Mode'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Powers real-time bi-directional synchronization between Admin Panel and Customer Website across different devices.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestCloud}
              disabled={isTestingCloud}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTestingCloud ? 'animate-spin' : ''}`} />
              <span>Test Connection</span>
            </button>
            <button
              type="button"
              onClick={handleSyncToCloud}
              disabled={isSyncingCloud}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-extrabold rounded-xl shadow-md flex items-center gap-1.5 transition-all"
            >
              {isSyncingCloud ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Cloud className="w-3.5 h-3.5" />}
              <span>Sync Local Data to Cloud</span>
            </button>
          </div>
        </div>

        {cloudStatusMsg && (
          <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 border ${cloudStatusMsg.type === 'success' ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-200' : cloudStatusMsg.type === 'error' ? 'bg-red-950/60 border-red-700/60 text-red-200' : 'bg-blue-950/60 border-blue-700/60 text-blue-200'}`}>
            {cloudStatusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />}
            <span>{cloudStatusMsg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
              Supabase Project URL
            </label>
            <input
              type="text"
              placeholder="https://your-project-id.supabase.co"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 font-mono focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
              Supabase Anon Public API Key
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 font-mono focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Schema file available at:</span>
            <code className="px-2 py-0.5 rounded bg-slate-950 text-emerald-400 font-mono text-[11px]">supabase/schema.sql</code>
          </div>
          <button
            type="button"
            onClick={handleSaveCloudCredentials}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all self-start sm:self-auto"
          >
            Save & Connect Cloud
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Brand & Visual Identity */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5 lg:col-span-2">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <Palette className="w-4 h-4 text-brand-600" />
              Store Branding & Visual Identity
            </h3>
            <span className="text-xs text-brand-600 font-bold bg-brand-50 px-3 py-1 rounded-full">
              Official: ApnaMart (apnamart.space)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Custom Logo Upload */}
            <div className="space-y-3">
              <ImageUploader
                value={formData.logoUrl}
                onChange={(url) => handleChange('logoUrl', url)}
                label="Store Header & Brand Logo"
                aspectRatio="banner"
                placeholderText="Upload custom store logo (PNG, SVG, WebP with transparency)"
              />
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-gray-800 block">Default Brand Logo Preview:</span>
                  <span className="text-[11px] text-gray-500">When no custom logo is uploaded, ApnaMart's vector brand mark is displayed:</span>
                </div>
                <div className="bg-white p-2 rounded-xl shadow-xs border border-gray-100 flex-shrink-0">
                  <ApnaMartLogo size="sm" />
                </div>
              </div>
            </div>

            {/* Favicon & Store Meta */}
            <div className="space-y-4">
              <ImageUploader
                value={formData.faviconUrl}
                onChange={(url) => handleChange('faviconUrl', url)}
                label="Store Favicon (Browser Tab Icon)"
                aspectRatio="square"
                placeholderText="Upload 32x32 or 64x64 icon (SVG, PNG)"
              />

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Brand Store Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.storeName}
                  onChange={(e) => handleChange('storeName', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Brand Slogan / Meta Description
                </label>
                <input
                  type="text"
                  value={formData.metaDescription}
                  onChange={(e) => handleChange('metaDescription', e.target.value)}
                  placeholder="Pakistan's Trusted Online Shopping Destination"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Store Profile & Contact Info */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="text-base font-extrabold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-600" />
            Store Information & Contact Details
          </h3>

          <div className="space-y-3">
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
