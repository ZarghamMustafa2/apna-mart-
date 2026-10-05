export type NotificationType = 'order' | 'low_stock' | 'out_of_stock' | 'system' | 'customer';

export interface AdminNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  linkUrl?: string;
  metadata?: {
    orderId?: string;
    productId?: string;
    customerPhone?: string;
  };
}
