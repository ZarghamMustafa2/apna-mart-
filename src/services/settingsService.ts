import { StoreSettings } from '../types/settings';
import { dbGetById, dbPut } from './db';

export async function getStoreSettings(): Promise<StoreSettings> {
  const settings = await dbGetById<StoreSettings>('settings', 'global_settings');
  return (
    settings || {
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
    }
  );
}

export async function saveStoreSettings(newSettings: StoreSettings): Promise<StoreSettings> {
  return await dbPut<StoreSettings>('settings', { ...newSettings, id: 'global_settings' });
}
