export interface StoreSettings {
  id?: string;
  storeName: string;
  storeDescription: string;
  contactEmail: string;
  contactPhone: string;
  whatsAppNumber: string;
  address: string;
  city: string;
  country: string;
  currency: string;
  currencySymbol: string;
  currencyPosition: 'left' | 'right';
  defaultShippingFee: number;
  freeShippingThreshold: number;
  enableCod: boolean;
  enableCardPayment: boolean;
  enableMobileWallet: boolean;
  maintenanceMode: boolean;
  metaTitle: string;
  metaDescription: string;
}
