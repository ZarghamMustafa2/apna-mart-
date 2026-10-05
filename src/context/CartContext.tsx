import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductVariant } from '../types/product';
import { CartItem, Coupon, CartSummaryData } from '../types/cart';
import { validateCoupon as validateCouponService } from '../services/couponService';

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant, attributes?: Record<string, string>) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  couponError: string | null;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  summary: CartSummaryData;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'apex_ecommerce_cart';
const COUPON_STORAGE_KEY = 'apex_ecommerce_coupon';
const FREE_SHIPPING_THRESHOLD = 5000;
const BASE_SHIPPING_FEE = 250;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const saved = localStorage.getItem(COUPON_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [couponError, setCouponError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    }
  }, [appliedCoupon]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const addToCart = (
    product: Product,
    quantity: number = 1,
    variant?: ProductVariant,
    attributes?: Record<string, string>
  ) => {
    const activeVariant = variant || (product.variants && product.variants.length > 0 ? product.variants[0] : undefined);
    const unitPrice = activeVariant ? (activeVariant.salePrice || activeVariant.regularPrice) : (product.salePrice || product.regularPrice);

    const variantKey = activeVariant ? activeVariant.id : 'default';
    const cartItemId = `${product.id}-${variantKey}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantity;
        const maxStock = activeVariant ? activeVariant.stock : product.stock;
        updated[existingIndex].quantity = Math.min(newQty, maxStock);
        return updated;
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          product,
          selectedVariant: activeVariant,
          selectedAttributes: attributes || activeVariant?.attributes,
          unitPrice,
          quantity,
        };
        return [...prevCart, newItem];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const maxStock = item.selectedVariant ? item.selectedVariant.stock : item.product.stock;
          return { ...item, quantity: Math.min(quantity, maxStock) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    setCouponError(null);
    const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const result = await validateCouponService(code, subtotal);

    if (result.error || !result.coupon) {
      setCouponError(result.error || 'Invalid coupon code.');
      return false;
    }

    setAppliedCoupon(result.coupon);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercentage) {
      couponDiscount = Math.round((subtotal * appliedCoupon.discountPercentage) / 100);
    } else if (appliedCoupon.discountAmount) {
      couponDiscount = Math.min(subtotal, appliedCoupon.discountAmount);
    }
  }

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || cart.length === 0 ? 0 : BASE_SHIPPING_FEE;
  const total = Math.max(0, subtotal - couponDiscount + shippingFee);

  const summary: CartSummaryData = {
    subtotal,
    discount: 0,
    couponCode: appliedCoupon?.code,
    couponDiscount,
    shippingFee,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    total,
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedCoupon,
        couponError,
        applyCoupon,
        removeCoupon,
        summary,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
