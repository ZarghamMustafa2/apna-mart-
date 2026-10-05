import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import { CheckCircle2, Package, MapPin, Printer, ArrowRight, ShieldCheck } from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById } = useOrders();

  const order = orderId ? getOrderById(orderId) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-extrabold text-gray-900">Order Not Found</h2>
        <p className="text-xs text-gray-500">We could not locate the requested order confirmation.</p>
        <Link to="/" className="inline-block px-6 py-3 bg-brand-600 text-white font-bold text-xs rounded-xl">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Celebration Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 text-white text-center space-y-3 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto text-white">
          <CheckCircle2 className="w-10 h-10 animate-bounce" />
        </div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
          Order Successfully Placed
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Thank You For Your Purchase!
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-md mx-auto">
          Your order <strong>#{order.id}</strong> has been received and is currently being processed by our dispatch center.
        </p>
      </div>

      {/* Main Confirmation Content Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Top Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs">
          <div>
            <span className="text-gray-400 font-bold uppercase block text-[10px]">Order Number</span>
            <span className="font-extrabold text-gray-900 text-sm">{order.id}</span>
          </div>
          <div>
            <span className="text-gray-400 font-bold uppercase block text-[10px]">Payment Method</span>
            <span className="font-extrabold text-gray-900 uppercase text-sm">{order.paymentMethod}</span>
          </div>
          <div>
            <span className="text-gray-400 font-bold uppercase block text-[10px]">Estimated Delivery</span>
            <span className="font-extrabold text-emerald-600 text-sm">{order.estimatedDelivery}</span>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 text-xs space-y-1">
          <h4 className="font-extrabold text-gray-900 text-sm mb-2">Delivery Address</h4>
          <p className="font-bold text-gray-900">{order.shippingAddress.fullName} ({order.shippingAddress.phone})</p>
          <p className="text-gray-600">{order.shippingAddress.address}, {order.shippingAddress.area}, {order.shippingAddress.city}</p>
        </div>

        {/* Ordered Items List */}
        <div className="space-y-3 pt-2">
          <h4 className="font-extrabold text-gray-900 text-sm">Order Summary Items</h4>
          <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
            {order.items.map((item) => {
              const image = item.selectedVariant?.image || item.product.images[0];
              return (
                <div key={item.id} className="p-3 bg-white flex items-center justify-between gap-3 text-xs">
                  <img src={image} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover bg-gray-50 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 truncate">{item.product.name}</div>
                    <div className="text-gray-500 text-[11px]">
                      Qty: {item.quantity} x Rs. {item.unitPrice.toLocaleString()}
                    </div>
                  </div>
                  <div className="font-extrabold text-brand-600">
                    Rs. {(item.unitPrice * item.quantity).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Price Calculations */}
        <div className="p-4 bg-brand-50/50 rounded-2xl border border-brand-100 text-xs space-y-2">
          <div className="flex justify-between text-gray-600"><span>Subtotal:</span><span>Rs. {order.subtotal.toLocaleString()}</span></div>
          {order.couponDiscount > 0 && (
            <div className="flex justify-between text-emerald-600 font-bold"><span>Coupon Discount:</span><span>- Rs. {order.couponDiscount.toLocaleString()}</span></div>
          )}
          <div className="flex justify-between text-gray-600"><span>Shipping Fee:</span><span>{order.shippingFee === 0 ? 'FREE' : `Rs. ${order.shippingFee}`}</span></div>
          <div className="flex justify-between text-sm font-extrabold text-brand-600 border-t border-brand-200 pt-2">
            <span>Total Paid / Payable:</span>
            <span>Rs. {order.total.toLocaleString()}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link
            to={`/track-order?orderId=${order.id}&phone=${encodeURIComponent(order.customerPhone)}`}
            className="flex-1 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            Track Order Progress
          </Link>
          <button
            onClick={() => window.print()}
            className="py-3.5 px-6 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Receipt
          </button>
          <Link
            to="/shop"
            className="py-3.5 px-6 bg-gray-900 hover:bg-black text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
