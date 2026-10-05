import React from 'react';
import { useCart } from '../../context/CartContext';
import { ShieldCheck, Lock } from 'lucide-react';

interface OrderSummarySidebarProps {
  onPlaceOrder: () => void;
  isSubmitting: boolean;
}

export const OrderSummarySidebar: React.FC<OrderSummarySidebarProps> = ({
  onPlaceOrder,
  isSubmitting,
}) => {
  const { cart, summary } = useCart();

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6 sticky top-24">
      <h3 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-4">
        Order Items ({cart.length})
      </h3>

      {/* Cart Items List */}
      <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto pr-1 space-y-3">
        {cart.map((item) => {
          const image = item.selectedVariant?.image || item.product.images[0];
          return (
            <div key={item.id} className="pt-3 flex items-center justify-between gap-3 text-xs">
              <img src={image} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover bg-gray-50 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-900 truncate">{item.product.name}</div>
                <div className="text-gray-500 text-[11px]">
                  Qty: {item.quantity} x Rs. {item.unitPrice.toLocaleString()}
                </div>
              </div>
              <div className="font-extrabold text-gray-900">
                Rs. {(item.unitPrice * item.quantity).toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Totals Breakdown */}
      <div className="space-y-2.5 pt-4 border-t border-gray-100 text-xs">
        <div className="flex items-center justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-bold text-gray-900">Rs. {summary.subtotal.toLocaleString()}</span>
        </div>

        {summary.couponDiscount > 0 && (
          <div className="flex items-center justify-between text-emerald-600 font-bold">
            <span>Coupon Discount</span>
            <span>- Rs. {summary.couponDiscount.toLocaleString()}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-gray-600">
          <span>Delivery Fee</span>
          <span className="font-bold text-gray-900">
            {summary.shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `Rs. ${summary.shippingFee}`}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-base font-extrabold text-gray-900">
          <span>Grand Total</span>
          <span className="text-xl text-brand-600">Rs. {summary.total.toLocaleString()}</span>
        </div>
      </div>

      {/* Place Order CTA Button */}
      <button
        type="button"
        onClick={onPlaceOrder}
        disabled={isSubmitting || cart.length === 0}
        className="w-full py-4 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-extrabold text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
      >
        <Lock className="w-4 h-4" />
        <span>{isSubmitting ? 'Processing Order...' : 'Confirm & Place Order'}</span>
      </button>

      <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>30-Day Money-Back Guarantee</span>
      </div>
    </div>
  );
};
