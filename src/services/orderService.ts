import { Order, OrderStatus, ShippingAddress, PaymentMethod } from '../types/order';
import { CartItem, Coupon } from '../types/cart';
import { Product } from '../types/product';
import { mockProducts } from '../data/mockProducts';
import { dbGetAll, dbGetById, dbPut } from './db';
import { adjustProductStock } from './inventoryService';
import { isSupabaseConfigured } from './supabase';
import { fetchOrdersFromSupabase, saveOrderToSupabase } from './supabaseDb';

export const DEFAULT_PRODUCT_PLACEHOLDER =
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80';

/**
 * Resolves a reliable product image for an order item.
 * Prioritizes:
 * 1. Saved item.image snapshot
 * 2. Variant image
 * 3. Product images array
 * 4. Fallback lookup in live products catalog (by ID or slug)
 * 5. Safe neutral placeholder
 */
export function resolveOrderItemImage(
  item: CartItem,
  fallbackProducts?: Product[]
): string {
  if (item.image && typeof item.image === 'string' && item.image.trim()) {
    return item.image;
  }
  if (item.selectedVariant?.image && typeof item.selectedVariant.image === 'string' && item.selectedVariant.image.trim()) {
    return item.selectedVariant.image;
  }
  if (
    item.product?.images &&
    Array.isArray(item.product.images) &&
    item.product.images.length > 0 &&
    typeof item.product.images[0] === 'string' &&
    item.product.images[0].trim()
  ) {
    return item.product.images[0];
  }
  if (fallbackProducts && fallbackProducts.length > 0) {
    const prodId = item.product?.id || (item as any).productId;
    const prodSlug = item.product?.slug;
    const found = fallbackProducts.find((p) => (prodId && p.id === prodId) || (prodSlug && p.slug === prodSlug));
    if (found?.images && found.images.length > 0 && found.images[0]) {
      return found.images[0];
    }
  }
  return DEFAULT_PRODUCT_PLACEHOLDER;
}

export async function getOrders(): Promise<Order[]> {
  if (isSupabaseConfigured()) {
    try {
      const cloudOrders = await fetchOrdersFromSupabase();
      if (cloudOrders && cloudOrders.length > 0) {
        for (const ord of cloudOrders) {
          dbPut('orders', ord).catch(() => {});
        }
        return cloudOrders;
      }
    } catch (e) {
      console.warn('Supabase getOrders fallback to local db:', e);
    }
  }

  const dbOrders = await dbGetAll<Order>('orders');
  if (dbOrders && dbOrders.length > 0) {
    return dbOrders;
  }

  // Initial demo orders for immediate verification & testing
  const demoOrders: Order[] = [
    {
      id: 'ORD-2026-89421',
      userId: 'usr-8891',
      createdAt: '2026-10-17 14:30',
      customerName: 'Farhan Ali',
      customerPhone: '+92 300 1234567',
      customerEmail: 'farhan.ali@example.com',
      shippingAddress: {
        fullName: 'Farhan Ali',
        phone: '+92 300 1234567',
        email: 'farhan.ali@example.com',
        city: 'Lahore',
        area: 'Gulberg III',
        address: 'House # 42, Block B, Main Boulevard',
      },
      items: [
        {
          id: 'item-demo-1',
          product: mockProducts[0],
          image: mockProducts[0].images[0],
          unitPrice: mockProducts[0].salePrice || mockProducts[0].regularPrice,
          quantity: 1,
        },
      ],
      paymentMethod: 'cod',
      paymentStatus: 'Pending',
      subtotal: 14999,
      discount: 0,
      couponDiscount: 0,
      shippingFee: 0,
      total: 14999,
      status: 'Confirmed',
      trackingNumber: 'TRK-PK-891024',
      estimatedDelivery: 'Within 2-3 Working Days',
      trackingHistory: [
        {
          status: 'New Order',
          timestamp: '2026-10-17 14:30',
          note: 'Order placed by customer.',
        },
        {
          status: 'Confirmed',
          timestamp: '2026-10-17 15:00',
          note: 'Payment & shipping address verified.',
        },
      ],
    },
    {
      id: 'ORD-2026-44109',
      userId: 'usr-8891',
      createdAt: '2026-10-16 11:15',
      customerName: 'Farhan Ali',
      customerPhone: '+92 300 1234567',
      customerEmail: 'farhan.ali@example.com',
      shippingAddress: {
        fullName: 'Farhan Ali',
        phone: '+92 300 1234567',
        email: 'farhan.ali@example.com',
        city: 'Lahore',
        area: 'Gulberg III',
        address: 'House # 42, Block B, Main Boulevard',
      },
      items: [
        {
          id: 'item-demo-2',
          product: mockProducts[1],
          image: mockProducts[1].images[0],
          unitPrice: mockProducts[1].salePrice || mockProducts[1].regularPrice,
          quantity: 2,
        },
        {
          id: 'item-demo-3',
          product: mockProducts[2],
          unitPrice: mockProducts[2].salePrice || mockProducts[2].regularPrice,
          quantity: 1,
        },
      ],
      paymentMethod: 'card',
      paymentStatus: 'Paid',
      subtotal: 31599,
      discount: 0,
      couponDiscount: 0,
      shippingFee: 0,
      total: 31599,
      status: 'Processing',
      trackingNumber: 'TRK-PK-441092',
      estimatedDelivery: 'Within 2-3 Working Days',
      trackingHistory: [
        {
          status: 'New Order',
          timestamp: '2026-10-16 11:15',
          note: 'Online payment received via card.',
        },
        {
          status: 'Processing',
          timestamp: '2026-10-16 12:00',
          note: 'Items sent to warehouse for packaging.',
        },
      ],
    },
  ];

  for (const ord of demoOrders) {
    await dbPut<Order>('orders', ord);
  }

  return demoOrders;
}

export async function getOrderById(orderId: string): Promise<Order | undefined> {
  const orders = await getOrders();
  return orders.find((o) => o.id.toLowerCase() === orderId.toLowerCase());
}

export async function trackOrderLive(orderId: string, phone: string): Promise<Order | undefined> {
  const orders = await getOrders();
  const cleanId = orderId.trim().toLowerCase();
  const cleanPhone = phone.trim().replace(/\s+/g, '');

  return orders.find((o) => {
    const matchId = o.id.toLowerCase() === cleanId;
    const matchPhone =
      cleanPhone === '' ||
      o.customerPhone.replace(/\s+/g, '').includes(cleanPhone) ||
      cleanPhone.includes(o.customerPhone.replace(/\s+/g, ''));
    return matchId && matchPhone;
  });
}

export async function createDatabaseOrder(
  items: CartItem[],
  shippingAddress: ShippingAddress,
  paymentMethod: PaymentMethod,
  summary: { subtotal: number; couponDiscount: number; shippingFee: number; total: number },
  coupon?: Coupon | null,
  userId?: string
): Promise<Order> {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const orderId = `ORD-2026-${randomNum}`;
  const now = new Date();
  const dateFormatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  // Preserve historical price and image snapshot for items
  const itemsSnapshot: CartItem[] = items.map((item) => {
    const itemImg = resolveOrderItemImage(item);
    return {
      ...item,
      image: itemImg,
      unitPrice: item.unitPrice, // preserved
    };
  });

  const newOrder: Order = {
    id: orderId,
    userId: userId || undefined,
    createdAt: dateFormatted,
    customerName: shippingAddress.fullName,
    customerPhone: shippingAddress.phone,
    customerEmail: shippingAddress.email,
    shippingAddress,
    items: itemsSnapshot,
    paymentMethod,
    paymentStatus: paymentMethod === 'card' ? 'Paid' : 'Pending',
    subtotal: summary.subtotal,
    discount: 0,
    couponDiscount: summary.couponDiscount,
    shippingFee: summary.shippingFee,
    total: summary.total,
    status: 'New Order',
    trackingNumber: `TRK-PK-${Math.floor(100000 + Math.random() * 900000)}`,
    estimatedDelivery: 'Within 2-3 Working Days',
    trackingHistory: [
      {
        status: 'New Order',
        timestamp: dateFormatted,
        note: 'Order placed successfully. Database order snapshot created.',
      },
    ],
  };

  // Inventory Business Rule: Deduct Stock on Order Placement
  for (const item of items) {
    await adjustProductStock(
      item.product.id,
      item.selectedVariant?.id,
      -item.quantity,
      'Restock / New Shipment',
      `Order Placement (${orderId})`
    );
  }

  // Save Order to Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      await saveOrderToSupabase(newOrder);
    } catch (e) {
      console.error('Supabase createOrder error:', e);
    }
  }

  // Save Order to local DB
  await dbPut<Order>('orders', newOrder);
  return newOrder;
}

export async function updateDatabaseOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  adminNote?: string,
  adminName: string = 'Admin'
): Promise<Order | undefined> {
  const order = await getOrderById(orderId);
  if (!order) return undefined;

  const oldStatus = order.status;
  const timestamp = new Date().toLocaleString();

  // Inventory Business Rule: Restoring stock when order is Cancelled, Returned, or Refunded
  if (
    (newStatus === 'Cancelled' || newStatus === 'Returned' || newStatus === 'Refunded') &&
    oldStatus !== 'Cancelled' &&
    oldStatus !== 'Returned' &&
    oldStatus !== 'Refunded'
  ) {
    for (const item of order.items) {
      await adjustProductStock(
        item.product.id,
        item.selectedVariant?.id,
        item.quantity,
        newStatus === 'Returned' ? 'Customer Return' : 'Manual Audit Correction',
        `${adminName} (Order ${newStatus})`
      );
    }
  }

  const updatedOrder: Order = {
    ...order,
    status: newStatus,
    trackingHistory: [
      ...order.trackingHistory,
      {
        status: newStatus,
        timestamp,
        note: adminNote || `Status updated from ${oldStatus} to ${newStatus} by ${adminName}`,
      },
    ],
  };

  // Save to Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      await saveOrderToSupabase(updatedOrder);
    } catch (e) {
      console.error('Supabase updateOrderStatus error:', e);
    }
  }

  await dbPut<Order>('orders', updatedOrder);
  return updatedOrder;
}
