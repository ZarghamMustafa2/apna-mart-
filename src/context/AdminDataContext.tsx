import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category } from '../types/product';
import { Order, OrderStatus } from '../types/order';
import { Coupon } from '../types/cart';
import { HeroSlide, PromoBanner, mockHeroSlides, mockPromoBanners } from '../data/mockBanners';
import { mockProducts } from '../data/mockProducts';
import { mockCategories } from '../data/mockCategories';
import { mockCoupons } from '../data/mockCoupons';
import { StockMovement, AdjustmentReason } from '../types/inventory';
import { StoreSettings } from '../types/settings';

import {
  openDatabase,
  getAllProductsAdmin,
  saveProductAdmin,
  deleteProductAdmin,
  dbGetById,
  getCategories,
  saveCategory,
  deleteCategory as dbDeleteCategory,
  getInventoryLogs,
  adjustProductStock,
  getOrders,
  updateDatabaseOrderStatus,
  getCoupons,
  saveCoupon,
  deleteCouponByCode,
  getHeroSlides,
  saveHeroSlides,
  getPromoBanners,
  savePromoBanners,
  getHomepageSections,
  saveHomepageSections,
  HomepageSections,
  defaultHomepageSections,
  getStoreSettings,
  saveStoreSettings,
} from '../services/apiServices';

interface AdminDataContextType {
  products: Product[];
  addProduct: (productData: Omit<Product, 'id' | 'createdAt'>) => Promise<Product>;
  updateProduct: (id: string, productData: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  duplicateProduct: (id: string) => Promise<void>;
  toggleProductStatus: (id: string) => Promise<void>;

  categories: Category[];
  addCategory: (cat: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, cat: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  stockMovements: StockMovement[];
  adjustStock: (productId: string, variantId: string | undefined, changeQty: number, reason: AdjustmentReason, adminName: string) => Promise<void>;

  adminOrders: Order[];
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, adminNote?: string, adminName?: string) => Promise<void>;

  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => Promise<void>;
  deleteCoupon: (code: string) => Promise<void>;

  heroSlides: HeroSlide[];
  updateHeroSlides: (slides: HeroSlide[]) => Promise<void>;
  promoBanners: PromoBanner[];
  updatePromoBanners: (banners: PromoBanner[]) => Promise<void>;
  homepageSections: HomepageSections;
  updateHomepageSections: (sections: HomepageSections) => Promise<void>;

  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;
  isDbLoaded: boolean;
}

const defaultSettings: StoreSettings = {
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
  metaDescription: 'Shop authentic smartphones, active noise cancellation headphones, footwear & fashion.',
};

const syncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('apnamart_db_sync')
  : null;

export const broadcastSync = (entity: string) => {
  try {
    syncChannel?.postMessage({ type: 'APNAMART_SYNC', entity, timestamp: Date.now() });
  } catch (e) {
    // broadcast channel fallback
  }
};

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export const AdminDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [adminOrders, setAdminOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(mockHeroSlides);
  const [promoBanners, setPromoBanners] = useState<PromoBanner[]>(mockPromoBanners);
  const [homepageSections, setHomepageSections] = useState<HomepageSections>(defaultHomepageSections);
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [isDbLoaded, setIsDbLoaded] = useState(false);

  const refreshDatabaseData = async (shouldBroadcast: boolean = false) => {
    try {
      await openDatabase();
      const prods = await getAllProductsAdmin();
      const cats = await getCategories();
      const logs = await getInventoryLogs();
      const ords = await getOrders();
      const cpns = await getCoupons();
      const slides = await getHeroSlides();
      const banners = await getPromoBanners();
      const secs = await getHomepageSections();
      const setts = await getStoreSettings();

      if (prods && prods.length > 0) setProducts(prods);
      if (cats && cats.length > 0) setCategories(cats);
      if (logs) setStockMovements(logs);
      if (ords) setAdminOrders(ords);
      if (cpns && cpns.length > 0) setCoupons(cpns);
      if (slides && slides.length > 0) setHeroSlides(slides);
      if (banners && banners.length > 0) setPromoBanners(banners);
      if (secs) setHomepageSections(secs);
      if (setts) setSettings(setts);
      setIsDbLoaded(true);

      if (shouldBroadcast) {
        broadcastSync('admin_data');
      }
    } catch (e) {
      console.warn('Database load warning (falling back to default state):', e);
      setIsDbLoaded(true);
    }
  };

  useEffect(() => {
    refreshDatabaseData();

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('apnamart_db_sync');
      channel.onmessage = (event) => {
        if (event?.data?.type === 'APNAMART_SYNC') {
          refreshDatabaseData(false);
        }
      };
      return () => {
        channel.close();
      };
    }
  }, []);

  // Products
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    const newProd: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    await saveProductAdmin(newProd);
    await refreshDatabaseData(true);
    return newProd;
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    let existing = products.find((p) => p.id === id);
    if (!existing) {
      existing = await dbGetById<Product>('products', id);
    }
    if (!existing) return;
    const updated = { ...existing, ...productData };
    await saveProductAdmin(updated);
    await refreshDatabaseData(true);
  };

  const deleteProduct = async (id: string) => {
    await deleteProductAdmin(id);
    await refreshDatabaseData(true);
  };

  const duplicateProduct = async (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const duplicated: Product = {
      ...target,
      id: `prod-${Date.now()}`,
      name: `${target.name} (Copy)`,
      sku: `${target.sku}-COPY`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    await saveProductAdmin(duplicated);
    await refreshDatabaseData(true);
  };

  const toggleProductStatus = async (id: string) => {
    const existing = products.find((p) => p.id === id);
    if (existing) {
      const newHiddenState = !existing.isHidden;
      await updateProduct(id, { isHidden: newHiddenState });
    }
  };

  // Categories
  const addCategory = async (cat: Omit<Category, 'id'>) => {
    const newCat: Category = { ...cat, id: `cat-${Date.now()}` };
    await saveCategory(newCat);
    await refreshDatabaseData(true);
  };

  const updateCategory = async (id: string, cat: Partial<Category>) => {
    const existing = categories.find((c) => c.id === id);
    if (existing) {
      await saveCategory({ ...existing, ...cat });
      await refreshDatabaseData(true);
    }
  };

  const deleteCategory = async (id: string) => {
    await dbDeleteCategory(id);
    await refreshDatabaseData(true);
  };

  // Inventory Stock Adjustment
  const adjustStock = async (
    productId: string,
    variantId: string | undefined,
    changeQty: number,
    reason: AdjustmentReason,
    adminName: string
  ) => {
    await adjustProductStock(productId, variantId, changeQty, reason, adminName);
    await refreshDatabaseData(true);
  };

  // Orders
  const updateOrderStatus = async (
    orderId: string,
    newStatus: OrderStatus,
    adminNote?: string,
    adminName: string = 'Admin'
  ) => {
    await updateDatabaseOrderStatus(orderId, newStatus, adminNote, adminName);
    await refreshDatabaseData(true);
  };

  // Coupons
  const addCoupon = async (coupon: Coupon) => {
    await saveCoupon(coupon);
    await refreshDatabaseData(true);
  };

  const deleteCoupon = async (code: string) => {
    await deleteCouponByCode(code);
    await refreshDatabaseData(true);
  };

  const updateHeroSlides = async (slides: HeroSlide[]) => {
    setHeroSlides(slides);
    await saveHeroSlides(slides);
    await refreshDatabaseData(true);
  };

  const updatePromoBanners = async (banners: PromoBanner[]) => {
    setPromoBanners(banners);
    await savePromoBanners(banners);
    await refreshDatabaseData(true);
  };

  const updateHomepageSections = async (newSections: HomepageSections) => {
    setHomepageSections(newSections);
    await saveHomepageSections(newSections);
    await refreshDatabaseData(true);
  };

  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    const updated = { ...settings, ...newSettings };
    await saveStoreSettings(updated);
    await refreshDatabaseData(true);
  };

  return (
    <AdminDataContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        toggleProductStatus,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        stockMovements,
        adjustStock,
        adminOrders,
        updateOrderStatus,
        coupons,
        addCoupon,
        deleteCoupon,
        heroSlides,
        updateHeroSlides,
        promoBanners,
        updatePromoBanners,
        homepageSections,
        updateHomepageSections,
        settings,
        updateSettings,
        isDbLoaded,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};
