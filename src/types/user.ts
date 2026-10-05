import { ShippingAddress } from './order';

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | string;
  city?: string;
  defaultAddress?: ShippingAddress;
  savedAddresses: (ShippingAddress & { id: string; label?: string })[];
  createdAt: string;
}
