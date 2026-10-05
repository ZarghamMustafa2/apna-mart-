import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { CartItemRow } from '../components/cart/CartItemRow';
import { CartSummary } from '../components/cart/CartSummary';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { cart, clearCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <Breadcrumb items={[{ label: 'Shopping Cart' }]} />

      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Your Shopping Cart
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Review your selected items before proceeding to checkout
          </p>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 hover:underline"
          >
            <Trash2 className="w-4 h-4" />
            Clear Cart
          </button>
        )}
      </div>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}

            <div className="pt-4 flex items-center justify-between">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-xs font-extrabold text-brand-600 hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>

          {/* Cart Summary Card */}
          <CartSummary />
        </div>
      ) : (
        /* Empty Cart State */
        <div className="py-20 text-center bg-white rounded-3xl border border-gray-100 p-8 space-y-4 max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">Your Cart is Empty</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Looks like you haven't added any products to your cart yet. Explore our top categories and start shopping!
          </p>
          <Link
            to="/shop"
            className="inline-block px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all"
          >
            Explore Catalog Now
          </Link>
        </div>
      )}
    </div>
  );
};
