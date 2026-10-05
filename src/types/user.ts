import { ShippingAddress } from './order';

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  defaultAddress?: ShippingAddress;
  savedAddresses: (ShippingAddress & { id: string; label?: string })[];
  createdAt: string;
}
