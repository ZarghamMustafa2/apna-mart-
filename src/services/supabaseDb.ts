import { supabase, isSupabaseConfigured } from './supabase';
import { Product, Category } from '../types/product';
import { Order } from '../types/order';
import { StockMovement } from '../types/inventory';
import { Coupon } from '../types/cart';
import { HeroSlide, PromoBanner } from '../data/mockBanners';
import { HomepageSections } from './cmsService';
import { StoreSettings } from '../types/settings';
import { CustomerReview } from './reviewService';

// ==============================================================================
// 1. PRODUCTS
// ==============================================================================
export function toProduct(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand || '',
    sku: row.sku,
    category: row.category,
    categoryId: row.category_id || '',
    subcategory: row.subcategory || undefined,
    subcategoryId: row.subcategory_id || undefined,
    shortDescription: row.short_description || '',
    description: row.description || '',
    regularPrice: Number(row.regular_price),
    salePrice: row.sale_price !== null && row.sale_price !== undefined ? Number(row.sale_price) : undefined,
    stock: Number(row.stock ?? 0),
    inStock: Boolean(row.in_stock),
    rating: Number(row.rating ?? 5),
    reviewCount: Number(row.review_count ?? 0),
    badges: Array.isArray(row.badges) ? row.badges : [],
    images: Array.isArray(row.images) ? row.images : [],
    videoUrl: row.video_url || undefined,
    hasVariants: Boolean(row.has_variants),
    variants: Array.isArray(row.variants) ? row.variants : [],
    variantAttributes: Array.isArray(row.variant_attributes) ? row.variant_attributes : [],
    specifications: Array.isArray(row.specifications) ? row.specifications : [],
    isFeatured: Boolean(row.is_featured),
    isNewArrival: Boolean(row.is_new_arrival),
    isBestSeller: Boolean(row.is_best_seller),
    isHidden: Boolean(row.is_hidden),
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export function toProductRow(p: Product): any {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand || '',
    sku: p.sku,
    category: p.category,
    category_id: p.categoryId || '',
    subcategory: p.subcategory || null,
    subcategory_id: p.subcategoryId || null,
    short_description: p.shortDescription || '',
    description: p.description || '',
    regular_price: p.regularPrice,
    sale_price: p.salePrice ?? null,
    stock: p.stock,
    in_stock: p.inStock,
    rating: p.rating,
    review_count: p.reviewCount,
    badges: p.badges || [],
    images: p.images || [],
    video_url: p.videoUrl || null,
    has_variants: p.hasVariants || false,
    variants: p.variants || [],
    variant_attributes: p.variantAttributes || [],
    specifications: p.specifications || [],
    is_featured: p.isFeatured || false,
    is_new_arrival: p.isNewArrival || false,
    is_best_seller: p.isBestSeller || false,
    is_hidden: p.isHidden || false,
    created_at: p.createdAt || new Date().toISOString(),
  };
}

export async function fetchProductsFromSupabase(): Promise<Product[]> {
  const client = supabase.client;
  if (!client) return [];
  const { data, error } = await client.from('products').select('*');
  if (error) throw error;
  return (data || []).map(toProduct);
}

export async function saveProductToSupabase(product: Product): Promise<Product> {
  const client = supabase.client;
  if (!client) throw new Error('Supabase not connected');
  const row = toProductRow(product);
  const { error } = await client.from('products').upsert(row, { onConflict: 'id' });
  if (error) throw error;
  return product;
}

export async function deleteProductFromSupabase(id: string): Promise<boolean> {
  const client = supabase.client;
  if (!client) return false;
  const { error } = await client.from('products').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// ==============================================================================
// 2. CATEGORIES
// ==============================================================================
export function toCategory(row: any): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || '',
    icon: row.icon || undefined,
    image: row.image || '',
    itemCount: Number(row.item_count || 0),
    subcategories: Array.isArray(row.subcategories) ? row.subcategories : [],
    status: row.status || 'Active',
    featured: Boolean(row.featured),
  };
}

export function toCategoryRow(c: Category): any {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description || '',
    icon: c.icon || null,
    image: c.image || '',
    item_count: c.itemCount || 0,
    subcategories: c.subcategories || [],
    status: c.status || 'Active',
    featured: c.featured || false,
  };
}

export async function fetchCategoriesFromSupabase(): Promise<Category[]> {
  const client = supabase.client;
  if (!client) return [];
  const { data, error } = await client.from('categories').select('*');
  if (error) throw error;
  return (data || []).map(toCategory);
}

export async function saveCategoryToSupabase(category: Category): Promise<Category> {
  const client = supabase.client;
  if (!client) throw new Error('Supabase not connected');
  const row = toCategoryRow(category);
  const { error } = await client.from('categories').upsert(row, { onConflict: 'id' });
  if (error) throw error;
  return category;
}

export async function deleteCategoryFromSupabase(id: string): Promise<boolean> {
  const client = supabase.client;
  if (!client) return false;
  const { error } = await client.from('categories').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// ==============================================================================
// 3. ORDERS
// ==============================================================================
export function toOrder(row: any): Order {
  return {
    id: row.id,
    userId: row.user_id || undefined,
    createdAt: row.created_at,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerEmail: row.customer_email || undefined,
    shippingAddress: row.shipping_address || {},
    items: Array.isArray(row.items) ? row.items : [],
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status || 'Pending',
    subtotal: Number(row.subtotal),
    discount: Number(row.discount || 0),
    couponDiscount: Number(row.coupon_discount || 0),
    shippingFee: Number(row.shipping_fee || 0),
    total: Number(row.total),
    status: row.status,
    trackingNumber: row.tracking_number || '',
    estimatedDelivery: row.estimated_delivery || '',
    trackingHistory: Array.isArray(row.tracking_history) ? row.tracking_history : [],
  };
}

export function toOrderRow(o: Order): any {
  return {
    id: o.id,
    user_id: o.userId || null,
    created_at: o.createdAt,
    customer_name: o.customerName,
    customer_phone: o.customerPhone,
    customer_email: o.customerEmail || null,
    shipping_address: o.shippingAddress,
    items: o.items,
    payment_method: o.paymentMethod,
    payment_status: o.paymentStatus,
    subtotal: o.subtotal,
    discount: o.discount || 0,
    coupon_discount: o.couponDiscount || 0,
    shipping_fee: o.shippingFee || 0,
    total: o.total,
    status: o.status,
    tracking_number: o.trackingNumber || '',
    estimated_delivery: o.estimatedDelivery || '',
    tracking_history: o.trackingHistory || [],
  };
}

export async function fetchOrdersFromSupabase(): Promise<Order[]> {
  const client = supabase.client;
  if (!client) return [];
  const { data, error } = await client.from('orders').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(toOrder);
}

export async function saveOrderToSupabase(order: Order): Promise<Order> {
  const client = supabase.client;
  if (!client) throw new Error('Supabase not connected');
  const row = toOrderRow(order);
  const { error } = await client.from('orders').upsert(row, { onConflict: 'id' });
  if (error) throw error;
  return order;
}

// ==============================================================================
// 4. INVENTORY LOGS
// ==============================================================================
export function toStockMovement(row: any): StockMovement {
  return {
    id: row.id,
    productId: row.product_id,
    productName: row.product_name,
    variantId: row.variant_id || undefined,
    variantName: row.variant_name || undefined,
    previousStock: Number(row.previous_stock),
    newStock: Number(row.new_stock),
    quantityChanged: Number(row.quantity_changed),
    changeType: row.change_type,
    reason: row.reason,
    adjustedBy: row.adjusted_by,
    timestamp: row.timestamp,
  };
}

export function toStockMovementRow(m: StockMovement): any {
  return {
    id: m.id,
    product_id: m.productId,
    product_name: m.productName,
    variant_id: m.variantId || null,
    variant_name: m.variantName || null,
    previous_stock: m.previousStock,
    new_stock: m.newStock,
    quantity_changed: m.quantityChanged,
    change_type: m.changeType,
    reason: m.reason,
    adjusted_by: m.adjustedBy,
    timestamp: m.timestamp,
  };
}

export async function fetchInventoryLogsFromSupabase(): Promise<StockMovement[]> {
  const client = supabase.client;
  if (!client) return [];
  const { data, error } = await client.from('inventory_logs').select('*').order('timestamp', { ascending: false });
  if (error) throw error;
  return (data || []).map(toStockMovement);
}

export async function saveInventoryLogToSupabase(log: StockMovement): Promise<void> {
  const client = supabase.client;
  if (!client) return;
  const row = toStockMovementRow(log);
  await client.from('inventory_logs').upsert(row, { onConflict: 'id' });
}

// ==============================================================================
// 5. COUPONS
// ==============================================================================
export function toCoupon(row: any): Coupon {
  return {
    code: row.code,
    discountPercentage: row.discount_percentage ? Number(row.discount_percentage) : undefined,
    discountAmount: row.discount_amount !== null && row.discount_amount !== undefined ? Number(row.discount_amount) : undefined,
    minSpend: row.min_spend !== null && row.min_spend !== undefined ? Number(row.min_spend) : undefined,
    status: row.status || 'Active',
    description: row.description || '',
  };
}

export function toCouponRow(c: Coupon): any {
  return {
    code: c.code,
    discount_percentage: c.discountPercentage ?? null,
    discount_amount: c.discountAmount ?? null,
    min_spend: c.minSpend ?? 0,
    status: c.status || 'Active',
    description: c.description || '',
  };
}

export async function fetchCouponsFromSupabase(): Promise<Coupon[]> {
  const client = supabase.client;
  if (!client) return [];
  const { data, error } = await client.from('coupons').select('*');
  if (error) throw error;
  return (data || []).map(toCoupon);
}

export async function saveCouponToSupabase(coupon: Coupon): Promise<Coupon> {
  const client = supabase.client;
  if (!client) throw new Error('Supabase not connected');
  const row = toCouponRow(coupon);
  const { error } = await client.from('coupons').upsert(row, { onConflict: 'code' });
  if (error) throw error;
  return coupon;
}

export async function deleteCouponFromSupabase(code: string): Promise<boolean> {
  const client = supabase.client;
  if (!client) return false;
  const { error } = await client.from('coupons').delete().eq('code', code);
  if (error) throw error;
  return true;
}

// ==============================================================================
// 6. HOMEPAGE CMS
// ==============================================================================
export async function fetchCmsFromSupabase<T>(id: string): Promise<T | null> {
  const client = supabase.client;
  if (!client) return null;
  const { data, error } = await client.from('homepage_cms').select('data').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? (data.data as T) : null;
}

export async function saveCmsToSupabase(id: string, data: any): Promise<void> {
  const client = supabase.client;
  if (!client) return;
  const { error } = await client.from('homepage_cms').upsert({ id, data }, { onConflict: 'id' });
  if (error) throw error;
}

// ==============================================================================
// 7. REVIEWS
// ==============================================================================
export function toReview(row: any): CustomerReview {
  return {
    id: row.id,
    productId: row.product_id,
    productName: row.product_name,
    userName: row.user_name,
    userAvatar: row.user_avatar || undefined,
    rating: Number(row.rating),
    date: row.date,
    comment: row.comment,
    status: row.status,
    verifiedPurchase: Boolean(row.verified_purchase),
  };
}

export function toReviewRow(r: CustomerReview): any {
  return {
    id: r.id,
    product_id: r.productId,
    product_name: r.productName,
    user_name: r.userName,
    user_avatar: r.userAvatar || null,
    rating: r.rating,
    date: r.date,
    comment: r.comment,
    status: r.status,
    verified_purchase: r.verifiedPurchase,
  };
}

export async function fetchReviewsFromSupabase(): Promise<CustomerReview[]> {
  const client = supabase.client;
  if (!client) return [];
  const { data, error } = await client.from('reviews').select('*').order('date', { ascending: false });
  if (error) throw error;
  return (data || []).map(toReview);
}

export async function saveReviewToSupabase(review: CustomerReview): Promise<CustomerReview> {
  const client = supabase.client;
  if (!client) throw new Error('Supabase not connected');
  const row = toReviewRow(review);
  const { error } = await client.from('reviews').upsert(row, { onConflict: 'id' });
  if (error) throw error;
  return review;
}

export async function deleteReviewFromSupabase(id: string): Promise<boolean> {
  const client = supabase.client;
  if (!client) return false;
  const { error } = await client.from('reviews').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// ==============================================================================
// 8. STORE SETTINGS
// ==============================================================================
export function toSettings(row: any): StoreSettings {
  return {
    id: row.id,
    storeName: row.store_name || 'ApnaMart',
    storeDescription: row.store_description || '',
    contactEmail: row.contact_email || 'support@apnamart.space',
    contactPhone: row.contact_phone || '+92 300 1234567',
    whatsAppNumber: row.whatsapp_number || '923001234567',
    address: row.address || '',
    city: row.city || 'Lahore',
    country: row.country || 'Pakistan',
    currency: row.currency || 'PKR',
    currencySymbol: row.currency_symbol || 'Rs.',
    currencyPosition: row.currency_position || 'left',
    defaultShippingFee: Number(row.default_shipping_fee ?? 250),
    freeShippingThreshold: Number(row.free_shipping_threshold ?? 5000),
    enableCod: Boolean(row.enable_cod),
    enableCardPayment: Boolean(row.enable_card_payment),
    enableMobileWallet: Boolean(row.enable_mobile_wallet),
    maintenanceMode: Boolean(row.maintenance_mode),
    metaTitle: row.meta_title || '',
    metaDescription: row.meta_description || '',
    logoUrl: row.logo_url || undefined,
    faviconUrl: row.favicon_url || undefined,
  };
}

export function toSettingsRow(s: StoreSettings): any {
  return {
    id: 'store_settings',
    store_name: s.storeName,
    store_description: s.storeDescription,
    contact_email: s.contactEmail,
    contact_phone: s.contactPhone,
    whatsapp_number: s.whatsAppNumber,
    address: s.address,
    city: s.city,
    country: s.country,
    currency: s.currency,
    currency_symbol: s.currencySymbol,
    currency_position: s.currencyPosition,
    default_shipping_fee: s.defaultShippingFee,
    free_shipping_threshold: s.freeShippingThreshold,
    enable_cod: s.enableCod,
    enable_card_payment: s.enableCardPayment,
    enable_mobile_wallet: s.enableMobileWallet,
    maintenance_mode: s.maintenanceMode,
    meta_title: s.metaTitle,
    meta_description: s.metaDescription,
    logo_url: s.logoUrl || null,
    favicon_url: s.faviconUrl || null,
  };
}

export async function fetchSettingsFromSupabase(): Promise<StoreSettings | null> {
  const client = supabase.client;
  if (!client) return null;
  const { data, error } = await client.from('settings').select('*').eq('id', 'store_settings').maybeSingle();
  if (error) throw error;
  return data ? toSettings(data) : null;
}

export async function saveSettingsToSupabase(settings: StoreSettings): Promise<StoreSettings> {
  const client = supabase.client;
  if (!client) throw new Error('Supabase not connected');
  const row = toSettingsRow(settings);
  const { error } = await client.from('settings').upsert(row, { onConflict: 'id' });
  if (error) throw error;
  return settings;
}

// ==============================================================================
// 9. CUSTOMERS
// ==============================================================================
export async function fetchCustomersFromSupabase(): Promise<any[]> {
  const client = supabase.client;
  if (!client) return [];
  const { data, error } = await client.from('customers').select('*');
  if (error) throw error;
  return data || [];
}

export async function saveCustomerToSupabase(customer: any): Promise<any> {
  const client = supabase.client;
  if (!client) return customer;
  const { error } = await client.from('customers').upsert(customer, { onConflict: 'id' });
  if (error) throw error;
  return customer;
}
