import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tag, ArrowRight, Truck, Check, X, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const CartSummary: React.FC = () => {
  const { summary, appliedCoupon, couponError, applyCoupon, removeCoupon, cartCount } = useCart();
  const { isLoggedIn } = useAuth();
  const [couponInput, setCouponInput] = useState('');
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    if (!isLoggedIn) {
      navigate('/auth', {
        state: {
          from: '/checkout',
          message: 'Please login or create an account to continue with your order.',
        },
      });
    } else {
      navigate('/checkout');
    }
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      const success = await applyCoupon(couponInput.trim());
      if (success) {
        setCouponInput('');
      }
    }
  };

  const freeShippingProgress = Math.min(100, (summary.subtotal / summary.freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, summary.freeShippingThreshold - summary.subtotal);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
      <h3 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-4">
        Order Summary
      </h3>

      {/* Free Shipping Progress Indicator */}
      <div className="p-4 bg-brand-50/60 rounded-2xl border border-brand-100 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-brand-900">
          <span className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-brand-600" />
            {remainingForFreeShipping === 0 ? 'You Unlocked Free Nationwide Shipping!' : `Add Rs. ${remainingForFreeShipping.toLocaleString()} for Free Shipping`}
          </span>
          <span>{Math.round(freeShippingProgress)}%</span>
        </div>
        <div className="w-full h-2 bg-brand-200/60 rounded-full overflow-hidden">
          <div className="h-full bg-brand-600 rounded-full transition-all duration-500" style={{ width: `${freeShippingProgress}%` }} />
        </div>
      </div>

      {/* Coupon Code Input Box */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Promo / Discount Code</label>
        {appliedCoupon ? (
          <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Coupon <strong>{appliedCoupon.code}</strong> Applied</span>
            </div>
            <button onClick={removeCoupon} className="text-gray-400 hover:text-red-500 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="e.g. WELCOME10"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold uppercase placeholder:normal-case placeholder:font-normal focus:outline-none focus:border-brand-500"
              />
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-gray-900 hover:bg-brand-600 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Apply
            </button>
          </form>
        )}
        {couponError && <p className="text-xs font-semibold text-red-500 pt-1">{couponError}</p>}
      </div>

      {/* Price Calculations Breakdown */}
      <div className="space-y-3 pt-4 border-t border-gray-100 text-xs sm:text-sm">
        <div className="flex items-center justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-bold text-gray-900">Rs. {summary.subtotal.toLocaleString()}</span>
        </div>

        {summary.couponDiscount > 0 && (
          <div className="flex items-center justify-between text-emerald-600 font-bold">
            <span>Coupon Discount ({summary.couponCode})</span>
            <span>- Rs. {summary.couponDiscount.toLocaleString()}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-gray-600">
          <span>Delivery Charges</span>
          <span className="font-bold text-gray-900">
            {summary.shippingFee === 0 ? <span className="text-emerald-600">FREE</span> : `Rs. ${summary.shippingFee}`}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-base font-extrabold text-gray-900">
          <span>Grand Total</span>
          <span className="text-xl text-brand-600">Rs. {summary.total.toLocaleString()}</span>
        </div>
      </div>

      {/* Checkout CTA */}
      <button
        onClick={handleProceedToCheckout}
        disabled={cartCount === 0}
        className="w-full py-4 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-extrabold text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
      >
        <span>Proceed to Checkout</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 font-medium pt-2">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Encrypted & Safe Checkout Guaranteed</span>
      </div>
    </div>
  );
};
