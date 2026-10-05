import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminNotification, NotificationType } from '../types/notification';

interface NotificationContextType {
  notifications: AdminNotification[];
  unreadCount: number;
  addNotification: (type: NotificationType, title: string, message: string, linkUrl?: string, metadata?: any) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
const NOTIFICATION_STORAGE_KEY = 'apexstore_admin_notifications';

const initialNotifications: AdminNotification[] = [
  {
    id: 'notif-1',
    type: 'order',
    title: 'New Order Received',
    message: 'Order #ORD-2026-84920 was placed by Zayn Shah for Rs. 14,500.',
    timestamp: new Date().toLocaleString(),
    isRead: false,
    linkUrl: '/admin/orders',
  },
  {
    id: 'notif-2',
    type: 'low_stock',
    title: 'Low Stock Warning',
    message: 'Sony WH-1000XM5 Wireless Headphones has only 2 units remaining.',
    timestamp: new Date(Date.now() - 3600000).toLocaleString(),
    isRead: false,
    linkUrl: '/admin/inventory',
  },
  {
    id: 'notif-3',
    type: 'out_of_stock',
    title: 'Item Out of Stock',
    message: 'Nike Air Max 270 Sneakers (Size 42) is now out of stock.',
    timestamp: new Date(Date.now() - 7200000).toLocaleString(),
    isRead: true,
    linkUrl: '/admin/inventory',
  },
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AdminNotification[]>(() => {
    try {
      const saved = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialNotifications;
    } catch (e) {
      return initialNotifications;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.error('Error saving notifications:', e);
    }
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const addNotification = (
    type: NotificationType,
    title: string,
    message: string,
    linkUrl?: string,
    metadata?: any
  ) => {
    const newNotif: AdminNotification = {
      id: `notif-${Date.now()}`,
      type,
      title,
      message,
      timestamp: new Date().toLocaleString(),
      isRead: false,
      linkUrl,
      metadata,
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 49)]); // Keep last 50
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const useAdminNotifications = useNotifications;
