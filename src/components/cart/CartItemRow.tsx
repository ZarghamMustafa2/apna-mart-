import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { CartItem } from '../../types/cart';
import { useCart } from '../../context/CartContext';

interface CartItemRowProps {
  item: CartItem;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const product = item.product;
  const image = item.selectedVariant?.image || product.images[0];
  const maxStock = item.selectedVariant ? item.selectedVariant.stock : product.stock;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm gap-4 transition-all hover:shadow-md">
      {/* Product Image & Info */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Link to={`/product/${product.slug}`} className="w-20 h-20 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100 block">
          <img src={image} alt={product.name} className="w-full h-full object-cover" />
        </Link>

        <div className="space-y-1 min-w-0 flex-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
            {product.brand}
          </span>
          <Link to={`/product/${product.slug}`} className="block text-xs sm:text-sm font-bold text-gray-900 hover:text-brand-600 truncate">
            {product.name}
          </Link>

          {/* Variant Badges */}
          {item.selectedVariant && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {Object.entries(item.selectedVariant.attributes).map(([k, v]) => (
                <span key={k} className="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] font-semibold text-gray-600">
                  {k}: {v}
                </span>
              ))}
            </div>
          )}

          <div className="text-xs font-semibold text-gray-500 pt-0.5">
            Unit Price: <span className="text-gray-900 font-bold">Rs. {item.unitPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Quantity & Actions */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
        {/* Quantity Stepper */}
        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="p-2 text-gray-600 hover:bg-gray-200 transition-colors"
            aria-label="Decrease Quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-3 text-xs font-bold text-gray-900 min-w-[32px] text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            disabled={item.quantity >= maxStock}
            className="p-2 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-30"
            aria-label="Increase Quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Item Total Price */}
        <div className="text-right min-w-[100px]">
          <div className="text-sm font-extrabold text-brand-600">
            Rs. {(item.unitPrice * item.quantity).toLocaleString()}
          </div>
        </div>

        {/* Remove Item Button */}
        <button
          onClick={() => removeFromCart(item.id)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          title="Remove from Cart"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
