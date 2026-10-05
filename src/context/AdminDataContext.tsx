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
  getCategories,
  saveCategory,
  deleteCategory,
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

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export const AdminDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [adminOrders, setAdminOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(mockHeroSlides);
  const [promoBanners, setPromoBanners] = useState<PromoBanner[]>(mockPromoBanners);
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [isDbLoaded, setIsDbLoaded] = useState(false);

  const refreshDatabaseData = async () => {
    try {
      await openDatabase();
      const prods = await getAllProductsAdmin();
      const cats = await getCategories();
      const logs = await getInventoryLogs();
      const ords = await getOrders();
      const cpns = await getCoupons();
      const slides = await getHeroSlides();
      const banners = await getPromoBanners();
      const setts = await getStoreSettings();

      if (prods && prods.length > 0) setProducts(prods);
      if (cats && cats.length > 0) setCategories(cats);
      if (logs) setStockMovements(logs);
      if (ords) setAdminOrders(ords);
      if (cpns && cpns.length > 0) setCoupons(cpns);
      if (slides && slides.length > 0) setHeroSlides(slides);
      if (banners && banners.length > 0) setPromoBanners(banners);
      if (setts) setSettings(setts);
      setIsDbLoaded(true);
    } catch (e) {
      console.warn('Database load warning (falling back to default state):', e);
      setIsDbLoaded(true);
    }
  };

  useEffect(() => {
    refreshDatabaseData();
  }, []);

  // Products
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    const newProd: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    await saveProductAdmin(newProd);
    await refreshDatabaseData();
    return newProd;
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    const existing = products.find((p) => p.id === id);
    if (!existing) return;
    const updated = { ...existing, ...productData };
    await saveProductAdmin(updated);
    await refreshDatabaseData();
  };

  const deleteProduct = async (id: string) => {
    await deleteProductAdmin(id);
    await refreshDatabaseData();
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
    await refreshDatabaseData();
  };

  const toggleProductStatus = async (id: string) => {
    const existing = products.find((p) => p.id === id);
    if (existing) {
      await updateProduct(id, { inStock: !existing.inStock });
    }
  };

  // Categories
  const addCategory = async (cat: Omit<Category, 'id'>) => {
    const newCat: Category = { ...cat, id: `cat-${Date.now()}` };
    await saveCategory(newCat);
    await refreshDatabaseData();
  };

  const updateCategory = async (id: string, cat: Partial<Category>) => {
    const existing = categories.find((c) => c.id === id);
    if (existing) {
      await saveCategory({ ...existing, ...cat });
      await refreshDatabaseData();
    }
  };

  const deleteCategory = async (id: string) => {
    await deleteCategory(id);
    await refreshDatabaseData();
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
    await refreshDatabaseData();
  };

  // Orders
  const updateOrderStatus = async (
    orderId: string,
    newStatus: OrderStatus,
    adminNote?: string,
    adminName: string = 'Admin'
  ) => {
    await updateDatabaseOrderStatus(orderId, newStatus, adminNote, adminName);
    await refreshDatabaseData();
  };

  // Coupons
  const addCoupon = async (coupon: Coupon) => {
    await saveCoupon(coupon);
    await refreshDatabaseData();
  };

  const deleteCoupon = async (code: string) => {
    await deleteCouponByCode(code);
    await refreshDatabaseData();
  };

  const updateHeroSlides = async (slides: HeroSlide[]) => {
    await saveHeroSlides(slides);
    await refreshDatabaseData();
  };

  const updatePromoBanners = async (banners: PromoBanner[]) => {
    await savePromoBanners(banners);
    await refreshDatabaseData();
  };

  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    const updated = { ...settings, ...newSettings };
    await saveStoreSettings(updated);
    await refreshDatabaseData();
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
