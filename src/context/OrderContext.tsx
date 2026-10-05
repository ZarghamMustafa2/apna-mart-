import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, ShippingAddress, PaymentMethod, OrderStatus } from '../types/order';
import { CartItem, Coupon } from '../types/cart';
import { getOrders, createDatabaseOrder, trackOrderLive, getOrderById as getDbOrderById } from '../services/orderService';
import { useAdminData } from './AdminDataContext';
import { useAuth } from './AuthContext';

interface OrderContextType {
  orders: Order[];
  createOrder: (
    items: CartItem[],
    shippingAddress: ShippingAddress,
    paymentMethod: PaymentMethod,
    summary: { subtotal: number; couponDiscount: number; shippingFee: number; total: number },
    coupon?: Coupon | null
  ) => Promise<Order>;
  getOrderById: (orderId: string) => Order | undefined;
  trackOrder: (orderId: string, phone: string) => Promise<Order | undefined>;
  refreshOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { isDbLoaded } = useAdminData();
  const { user } = useAuth();

  const refreshOrders = async () => {
    try {
      const fetched = await getOrders();
      setOrders(fetched);
    } catch (e) {
      console.error('Order fetch error:', e);
    }
  };

  useEffect(() => {
    if (isDbLoaded) {
      refreshOrders();
    }
  }, [isDbLoaded]);

  const createOrder = async (
    items: CartItem[],
    shippingAddress: ShippingAddress,
    paymentMethod: PaymentMethod,
    summary: { subtotal: number; couponDiscount: number; shippingFee: number; total: number },
    coupon?: Coupon | null
  ): Promise<Order> => {
    const created = await createDatabaseOrder(
      items,
      shippingAddress,
      paymentMethod,
      summary,
      coupon,
      user?.id
    );
    await refreshOrders();
    return created;
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find((o) => o.id.toLowerCase() === orderId.toLowerCase());
  };

  const trackOrder = async (orderId: string, phone: string): Promise<Order | undefined> => {
    return await trackOrderLive(orderId, phone);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        getOrderById,
        trackOrder,
        refreshOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
