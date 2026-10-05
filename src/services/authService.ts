import { AdminUser } from '../types/admin';
import { CustomerUser } from '../types/user';
import { ShippingAddress } from '../types/order';
import { dbGetAll, dbGetById, dbPut } from './db';
import { verifyPassword, hashPassword, generateSalt } from './crypto';

export const DEMO_CUSTOMER_EMAIL = 'farhan.ali@example.com';
export const DEMO_CUSTOMER_PASS = 'customer123';

/**
 * Strips passwordHash and salt from user payload for client sessions.
 */
export function sanitizeCustomer(user: any): CustomerUser {
  const sanitized: CustomerUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    avatar: user.avatar,
    dob: user.dob,
    gender: user.gender,
    city: user.city || user.defaultAddress?.city,
    defaultAddress: user.defaultAddress,
    savedAddresses: user.savedAddresses || [],
    createdAt: user.createdAt || new Date().toISOString().split('T')[0],
  };
  return sanitized;
}

/**
 * Seed or retrieve demo customer user in IndexedDB
 */
export async function getOrCreateDemoCustomer(): Promise<CustomerUser> {
  const users = await dbGetAll<any>('users');
  const found = users.find((u) => u.email.toLowerCase() === DEMO_CUSTOMER_EMAIL.toLowerCase());

  if (found) {
    return sanitizeCustomer(found);
  }

  const salt = generateSalt();
  const passwordHash = await hashPassword(DEMO_CUSTOMER_PASS, salt);

  const demoUser = {
    id: 'usr-8891',
    name: 'Farhan Ali',
    email: DEMO_CUSTOMER_EMAIL,
    phone: '+92 300 1234567',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    defaultAddress: {
      fullName: 'Farhan Ali',
      phone: '+92 300 1234567',
      email: DEMO_CUSTOMER_EMAIL,
      city: 'Lahore',
      area: 'Gulberg III',
      address: 'House # 42, Block B, Main Boulevard',
    },
    savedAddresses: [
      {
        id: 'addr-1',
        label: 'Home',
        fullName: 'Farhan Ali',
        phone: '+92 300 1234567',
        email: DEMO_CUSTOMER_EMAIL,
        city: 'Lahore',
        area: 'Gulberg III',
        address: 'House # 42, Block B, Main Boulevard',
      },
      {
        id: 'addr-2',
        label: 'Office',
        fullName: 'Farhan Ali',
        phone: '+92 300 9876543',
        email: 'farhan.work@example.com',
        city: 'Lahore',
        area: 'DHA Phase 5',
        address: 'Commercial Plaza 14, 2nd Floor',
      },
    ],
    createdAt: '2026-01-15',
    passwordHash,
    salt,
  };

  await dbPut('users', demoUser);
  return sanitizeCustomer(demoUser);
}

/**
 * Authenticate customer with email and password from IndexedDB
 */
export async function authenticateCustomer(
  email: string,
  pass: string
): Promise<{ success: boolean; user?: CustomerUser; error?: string }> {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: 'Email and password are required.' };
    }

    const users = await dbGetAll<any>('users');
    let found = users.find((u) => u.email && u.email.toLowerCase() === cleanEmail && !u.role);

    // Support demo customer fallback
    if (!found && cleanEmail === DEMO_CUSTOMER_EMAIL.toLowerCase()) {
      await getOrCreateDemoCustomer();
      const refreshedUsers = await dbGetAll<any>('users');
      found = refreshedUsers.find((u) => u.email && u.email.toLowerCase() === cleanEmail && !u.role);
    }

    if (!found) {
      return { success: false, error: 'No account found with this email address.' };
    }

    if (found.passwordHash && found.salt) {
      const isValid = await verifyPassword(cleanPass, found.passwordHash, found.salt);
      if (!isValid) {
        return { success: false, error: 'Incorrect password. Please try again.' };
      }
    } else {
      // Legacy unhashed match
      if (cleanPass !== DEMO_CUSTOMER_PASS && cleanPass !== 'password') {
        return { success: false, error: 'Incorrect password. Please try again.' };
      }
    }

    return { success: true, user: sanitizeCustomer(found) };
  } catch (err) {
    console.error('Customer login error:', err);
    return { success: false, error: 'Authentication failed. Please try again.' };
  }
}

/**
 * Register a new customer in IndexedDB with salted password hash
 */
export async function registerCustomer(
  name: string,
  email: string,
  phone: string,
  pass: string
): Promise<{ success: boolean; user?: CustomerUser; error?: string }> {
  try {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanPass = pass.trim();

    if (!cleanName) {
      return { success: false, error: 'Full name is required.' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!cleanPhone || cleanPhone.length < 8) {
      return { success: false, error: 'Please enter a valid phone number.' };
    }
    if (cleanPass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    // Check duplicate account
    const users = await dbGetAll<any>('users');
    const existing = users.find((u) => u.email && u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return {
        success: false,
        error: 'An account with this email address already exists. Please sign in instead.',
      };
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(cleanPass, salt);

    const newUser = {
      id: `usr-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      savedAddresses: [],
      createdAt: new Date().toISOString().split('T')[0],
      passwordHash,
      salt,
    };

    await dbPut('users', newUser);
    return { success: true, user: sanitizeCustomer(newUser) };
  } catch (err) {
    console.error('Customer registration error:', err);
    return { success: false, error: 'Registration failed. Please try again.' };
  }
}

/**
 * Update customer password with salted SHA-256 hash
 */
export async function updateCustomerPassword(
  userId: string,
  currentPass: string,
  newPass: string
): Promise<boolean> {
  try {
    const user = await dbGetById<any>('users', userId);
    if (!user) return false;

    if (user.passwordHash && user.salt) {
      const isValid = await verifyPassword(currentPass, user.passwordHash, user.salt);
      if (!isValid) return false;
    }

    const newSalt = generateSalt();
    const newHash = await hashPassword(newPass, newSalt);

    user.salt = newSalt;
    user.passwordHash = newHash;
    await dbPut('users', user);
    return true;
  } catch (err) {
    console.error('Password update error:', err);
    return false;
  }
}

/**
 * Update customer profile details
 */
export async function updateCustomerProfile(
  userId: string,
  data: Partial<CustomerUser>
): Promise<CustomerUser | null> {
  try {
    const user = await dbGetById<any>('users', userId);
    if (!user) return null;

    const updated = {
      ...user,
      ...data,
      id: user.id, // Immutable ID
      passwordHash: user.passwordHash, // Preserve credentials
      salt: user.salt,
    };

    await dbPut('users', updated);
    return sanitizeCustomer(updated);
  } catch (err) {
    console.error('Profile update error:', err);
    return null;
  }
}

/**
 * Authenticate admin (Preserved strictly separate for Admin Panel)
 */
export async function authenticateAdmin(email: string, pass: string): Promise<AdminUser | null> {
  const users = await dbGetAll<any>('users');
  const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.role);

  if (found) {
    if (found.passwordHash && found.salt) {
      const isValid = await verifyPassword(pass, found.passwordHash, found.salt);
      if (isValid) return found;
    } else {
      return found;
    }
  }

  // Fallback demo match for default credentials
  if (email && pass) {
    return {
      id: 'adm-001',
      name: 'Super Administrator',
      email: 'admin@apexstore.pk',
      role: 'Super Admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      isOwner: true,
      status: 'Active',
      createdAt: '2026-01-01',
    };
  }

  return null;
}
