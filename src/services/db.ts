import { mockProducts } from '../data/mockProducts';
import { mockCategories } from '../data/mockCategories';
import { mockHeroSlides, mockPromoBanners } from '../data/mockBanners';
import { mockCoupons } from '../data/mockCoupons';
import { mockAdminUsers } from '../context/AdminAuthContext';
import { hashPassword, generateSalt } from './crypto';

const DB_NAME = 'ApexStore_Ecommerce_DB';
const DB_VERSION = 1;

let dbInstance: IDBDatabase | null = null;

export function openDatabase(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Users table
      if (!db.objectStoreNames.contains('users')) {
        const usersStore = db.createObjectStore('users', { keyPath: 'id' });
        usersStore.createIndex('email', 'email', { unique: true });
        usersStore.createIndex('role', 'role', { unique: false });
      }

      // Categories table
      if (!db.objectStoreNames.contains('categories')) {
        const catStore = db.createObjectStore('categories', { keyPath: 'id' });
        catStore.createIndex('slug', 'slug', { unique: true });
      }

      // Products table
      if (!db.objectStoreNames.contains('products')) {
        const prodStore = db.createObjectStore('products', { keyPath: 'id' });
        prodStore.createIndex('slug', 'slug', { unique: true });
        prodStore.createIndex('categoryId', 'categoryId', { unique: false });
        prodStore.createIndex('sku', 'sku', { unique: true });
      }

      // Product Variants table
      if (!db.objectStoreNames.contains('product_variants')) {
        const varStore = db.createObjectStore('product_variants', { keyPath: 'id' });
        varStore.createIndex('productId', 'productId', { unique: false });
        varStore.createIndex('sku', 'sku', { unique: true });
      }

      // Inventory Logs table
      if (!db.objectStoreNames.contains('inventory_logs')) {
        const invStore = db.createObjectStore('inventory_logs', { keyPath: 'id' });
        invStore.createIndex('productId', 'productId', { unique: false });
      }

      // Orders table
      if (!db.objectStoreNames.contains('orders')) {
        const ordStore = db.createObjectStore('orders', { keyPath: 'id' });
        ordStore.createIndex('customerPhone', 'customerPhone', { unique: false });
        ordStore.createIndex('status', 'status', { unique: false });
      }

      // Coupons table
      if (!db.objectStoreNames.contains('coupons')) {
        const cpnStore = db.createObjectStore('coupons', { keyPath: 'code' });
      }

      // Homepage CMS table
      if (!db.objectStoreNames.contains('homepage_cms')) {
        db.createObjectStore('homepage_cms', { keyPath: 'id' });
      }

      // Reviews table
      if (!db.objectStoreNames.contains('reviews')) {
        const revStore = db.createObjectStore('reviews', { keyPath: 'id' });
        revStore.createIndex('productId', 'productId', { unique: false });
      }

      // Settings table
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'id' });
      }
    };

    request.onsuccess = async (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      await seedInitialDatabaseData(dbInstance);
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

/**
 * Seed database with initial products, categories, coupons, banners, admin accounts if database is fresh.
 */
async function seedInitialDatabaseData(db: IDBDatabase): Promise<void> {
  const count = await getStoreCount(db, 'products');
  if (count > 0) return; // already seeded

  const transaction = db.transaction(
    ['products', 'categories', 'coupons', 'homepage_cms', 'users', 'settings'],
    'readwrite'
  );

  // Seed Products
  const prodStore = transaction.objectStore('products');
  mockProducts.forEach((p) => prodStore.put(p));

  // Seed Categories
  const catStore = transaction.objectStore('categories');
  mockCategories.forEach((c) => catStore.put(c));

  // Seed Coupons
  const cpnStore = transaction.objectStore('coupons');
  mockCoupons.forEach((cpn) => cpnStore.put(cpn));

  // Seed CMS
  const cmsStore = transaction.objectStore('homepage_cms');
  cmsStore.put({ id: 'hero_slides', data: mockHeroSlides });
  cmsStore.put({ id: 'promo_banners', data: mockPromoBanners });

  // Seed Admin Users with hashed passwords
  const userStore = transaction.objectStore('users');
  for (const adm of mockAdminUsers) {
    const salt = generateSalt();
    const hash = await hashPassword('adminpassword', salt);
    userStore.put({
      ...adm,
      salt,
      passwordHash: hash,
    });
  }

  // Seed Demo Customer Account with hashed password
  const customerSalt = generateSalt();
  const customerHash = await hashPassword('customer123', customerSalt);
  userStore.put({
    id: 'usr-8891',
    name: 'Farhan Ali',
    email: 'farhan.ali@example.com',
    phone: '+92 300 1234567',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    defaultAddress: {
      fullName: 'Farhan Ali',
      phone: '+92 300 1234567',
      email: 'farhan.ali@example.com',
      city: 'Lahore',
      area: 'Gulberg III',
      address: 'House # 42, Block B, Main Boulevard',
    },
    savedAddresses: [
      {
        id: 'addr-1',
        label: 'Home',
        fullName: 'Farhan Ali',
        phone: '+92 300 1234567',
        email: 'farhan.ali@example.com',
        city: 'Lahore',
        area: 'Gulberg III',
        address: 'House # 42, Block B, Main Boulevard',
      },
      {
        id: 'addr-2',
        label: 'Office',
        fullName: 'Farhan Ali',
        phone: '+92 300 9876543',
        email: 'farhan.work@example.com',
        city: 'Lahore',
        area: 'DHA Phase 5',
        address: 'Commercial Plaza 14, 2nd Floor',
      },
    ],
    createdAt: '2026-01-15',
    salt: customerSalt,
    passwordHash: customerHash,
  });

  // Seed Settings
  const settingsStore = transaction.objectStore('settings');
  settingsStore.put({
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
  });
}

function getStoreCount(db: IDBDatabase, storeName: string): Promise<number> {
  return new Promise((resolve) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const countReq = store.count();
    countReq.onsuccess = () => resolve(countReq.result);
    countReq.onerror = () => resolve(0);
  });
}

/**
 * Generic Helper Functions for DB CRUD
 */
export async function dbGetAll<T>(storeName: string): Promise<T[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function dbGetById<T>(storeName: string, id: string): Promise<T | undefined> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function dbPut<T>(storeName: string, data: T): Promise<T> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(data);
    request.onsuccess = () => resolve(data);
    request.onerror = () => reject(request.error);
  });
}

export async function dbDelete(storeName: string, id: string): Promise<boolean> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}
