import React, { createContext, useContext, useState, useEffect } from 'react';
import { CustomerUser } from '../types/user';
import { ShippingAddress } from '../types/order';
import {
  authenticateCustomer,
  registerCustomer as registerCustomerService,
  updateCustomerPassword,
  updateCustomerProfile,
} from '../services/authService';
import { dbGetById } from '../services/db';

interface AuthContextType {
  user: CustomerUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    phone: string,
    pass: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<CustomerUser>) => Promise<boolean>;
  addAddress: (address: ShippingAddress & { label?: string }) => Promise<void>;
  editAddress: (addressId: string, updated: Partial<ShippingAddress & { label?: string }>) => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;
  setDefaultAddress: (addressId: string) => Promise<void>;
  changePassword: (currentPass: string, newPass: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const CUSTOMER_SESSION_KEY = 'apnamart_customer_session';
const LEGACY_SESSION_KEY = 'apex_ecommerce_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<CustomerUser | null>(() => {
    try {
      const saved = localStorage.getItem(CUSTOMER_SESSION_KEY) || localStorage.getItem(LEGACY_SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && parsed.email) {
          return parsed;
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  });

  // Keep localStorage synchronized with active non-sensitive customer session
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(user));
        localStorage.removeItem(LEGACY_SESSION_KEY);
      } else {
        localStorage.removeItem(CUSTOMER_SESSION_KEY);
        localStorage.removeItem(LEGACY_SESSION_KEY);
      }
    } catch (e) {
      console.warn('Could not sync customer session to localStorage:', e);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Re-verify and refresh profile data from IndexedDB on startup if session exists
  useEffect(() => {
    if (user?.id) {
      dbGetById<any>('users', user.id)
        .then((dbUser) => {
          if (dbUser) {
            setUser((prev) => (prev ? { ...prev, ...dbUser, passwordHash: undefined, salt: undefined } : null));
          }
        })
        .catch((err) => {
          console.warn('Session background sync warning:', err);
        });
    }
  }, []);

  const login = async (
    email: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const result = await authenticateCustomer(email, pass);
      if (result.success && result.user) {
        setUser(result.user);
        return { success: true };
      }
      return { success: false, error: result.error || 'Invalid email or password.' };
    } catch (err) {
      return { success: false, error: 'Login failed. Please check your credentials.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    phone: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const result = await registerCustomerService(name, email, phone, pass);
      if (result.success && result.user) {
        setUser(result.user);
        return { success: true };
      }
      return { success: false, error: result.error || 'Registration failed.' };
    } catch (err) {
      return { success: false, error: 'Registration failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(CUSTOMER_SESSION_KEY);
      localStorage.removeItem(LEGACY_SESSION_KEY);
    } catch (e) {
      // ignore
    }
  };

  const updateProfile = async (data: Partial<CustomerUser>): Promise<boolean> => {
    if (!user) return false;
    try {
      const updated = await updateCustomerProfile(user.id, data);
      if (updated) {
        setUser(updated);
      } else {
        setUser((prev) => (prev ? { ...prev, ...data } : null));
      }
      return true;
    } catch (e) {
      console.error('Update profile error:', e);
      return false;
    }
  };

  const addAddress = async (address: ShippingAddress & { label?: string }) => {
    if (!user) return;
    const newAddr = {
      ...address,
      id: `addr-${Date.now()}`,
    };
    const updatedAddresses = [...user.savedAddresses, newAddr];
    const newDefault = user.defaultAddress ? user.defaultAddress : newAddr;
    const updatedUser: CustomerUser = {
      ...user,
      savedAddresses: updatedAddresses,
      defaultAddress: newDefault,
    };
    setUser(updatedUser);
    await updateCustomerProfile(user.id, {
      savedAddresses: updatedAddresses,
      defaultAddress: newDefault,
    });
  };

  const editAddress = async (addressId: string, updated: Partial<ShippingAddress & { label?: string }>) => {
    if (!user) return;
    const updatedAddresses = user.savedAddresses.map((addr) =>
      addr.id === addressId ? { ...addr, ...updated } : addr
    );
    let updatedDefault = user.defaultAddress;
    if (user.defaultAddress && (user.defaultAddress as any).id === addressId) {
      updatedDefault = { ...user.defaultAddress, ...updated } as ShippingAddress;
    }
    const updatedUser: CustomerUser = {
      ...user,
      savedAddresses: updatedAddresses,
      defaultAddress: updatedDefault,
    };
    setUser(updatedUser);
    await updateCustomerProfile(user.id, {
      savedAddresses: updatedAddresses,
      defaultAddress: updatedDefault,
    });
  };

  const deleteAddress = async (addressId: string) => {
    if (!user) return;
    const updated = user.savedAddresses.filter((a) => a.id !== addressId);
    let newDefault = user.defaultAddress;
    if (user.defaultAddress && (user.defaultAddress as any).id === addressId) {
      newDefault = updated[0] || undefined;
    }
    const updatedUser: CustomerUser = {
      ...user,
      savedAddresses: updated,
      defaultAddress: newDefault,
    };
    setUser(updatedUser);
    await updateCustomerProfile(user.id, {
      savedAddresses: updated,
      defaultAddress: newDefault,
    });
  };

  const setDefaultAddress = async (addressId: string) => {
    if (!user) return;
    const found = user.savedAddresses.find((a) => a.id === addressId);
    if (found) {
      const updatedUser: CustomerUser = {
        ...user,
        defaultAddress: found,
      };
      setUser(updatedUser);
      await updateCustomerProfile(user.id, {
        defaultAddress: found,
      });
    }
  };

  const changePassword = async (currentPass: string, newPass: string): Promise<boolean> => {
    if (!user) return false;
    return await updateCustomerPassword(user.id, currentPass, newPass);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        editAddress,
        deleteAddress,
        setDefaultAddress,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
