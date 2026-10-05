import { Order, OrderStatus, ShippingAddress, PaymentMethod } from '../types/order';
import { CartItem, Coupon } from '../types/cart';
import { dbGetAll, dbGetById, dbPut } from './db';
import { adjustProductStock } from './inventoryService';

export async function getOrders(): Promise<Order[]> {
  return await dbGetAll<Order>('orders');
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

  // Preserve historical price snapshot for items
  const itemsSnapshot: CartItem[] = items.map((item) => ({
    ...item,
    unitPrice: item.unitPrice, // preserved
  }));

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

  // Save Order to DB
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

  await dbPut<Order>('orders', updatedOrder);
  return updatedOrder;
}
