import { StoreSettings } from '../types/settings';
import { dbGetById, dbPut } from './db';
import { isSupabaseConfigured } from './supabase';
import { fetchSettingsFromSupabase, saveSettingsToSupabase } from './supabaseDb';

const defaultSettings: StoreSettings = {
  id: 'global_settings',
  storeName: 'ApnaMart',
  storeDescription: "Pakistan's premier destination for authentic electronics, fashion & lifestyle.",
  contactEmail: 'support@apnamart.space',
  contactPhone: '+92 300 1234567',
  whatsAppNumber: '923001234567',
  address: 'Main Boulevard, Gulberg III',
  city: 'Lahore',
  country: 'Pakistan',
  currency: 'PKR',
  currencySymbol: 'Rs.',
  currencyPosition: 'left',
  defaultShippingFee: 250,
  freeShippingThreshold: 5000,
  enableCod: true,
  enableCardPayment: true,
  enableMobileWallet: true,
  maintenanceMode: false,
  metaTitle: 'ApnaMart - Modern E-Commerce Platform',
  metaDescription: 'Shop authentic smartphones, active noise cancellation headphones, footwear & fashion on ApnaMart.',
};

export async function getStoreSettings(): Promise<StoreSettings> {
  if (isSupabaseConfigured()) {
    try {
      const cloud = await fetchSettingsFromSupabase();
      if (cloud) {
        dbPut('settings', { ...cloud, id: 'global_settings' }).catch(() => {});
        return cloud;
      }
    } catch (e) {
      console.warn('Supabase getStoreSettings fallback:', e);
    }
  }

  const settings = await dbGetById<StoreSettings>('settings', 'global_settings');
  return settings || defaultSettings;
}

export async function saveStoreSettings(newSettings: StoreSettings): Promise<StoreSettings> {
  if (isSupabaseConfigured()) {
    try {
      await saveSettingsToSupabase(newSettings);
    } catch (e) {
      console.error('Supabase saveStoreSettings error:', e);
    }
  }
  return await dbPut<StoreSettings>('settings', { ...newSettings, id: 'global_settings' });
}
