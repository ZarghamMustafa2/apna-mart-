import React from 'react';
import { Modal } from '../common/Modal';
import { Order } from '../../types/order';
import { OrderStatusTracker } from '../tracking/OrderStatusTracker';
import { Printer, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminData } from '../../context/AdminDataContext';
import { resolveOrderItemImage, DEFAULT_PRODUCT_PLACEHOLDER } from '../../services/apiServices';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  const { products } = useAdminData();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Order Receipt - ${order.id}`} maxWidth="2xl">
      <div className="space-y-6">
        {/* Order Header Summary */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs">
          <div>
            <div className="text-gray-500">Order ID: <strong className="text-gray-900">{order.id}</strong></div>
            <div className="text-gray-500">Date: <strong className="text-gray-900">{order.createdAt}</strong></div>
          </div>
          <div>
            <div className="text-gray-500">Payment: <strong className="text-gray-900 uppercase">{order.paymentMethod} ({order.paymentStatus})</strong></div>
            <div className="text-gray-500">Tracking: <strong className="text-brand-600">{order.trackingNumber}</strong></div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <OrderStatusTracker currentStatus={order.status} trackingHistory={order.trackingHistory} />

        {/* Shipping Address */}
        <div className="p-4 rounded-2xl bg-white border border-gray-100 text-xs space-y-1">
          <h4 className="font-extrabold text-gray-900">Delivery Address</h4>
          <p className="font-bold text-gray-800">{order.shippingAddress.fullName} ({order.shippingAddress.phone})</p>
          <p className="text-gray-600">{order.shippingAddress.address}, {order.shippingAddress.area}, {order.shippingAddress.city}</p>
        </div>

        {/* Ordered Items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-2">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-700 dark:text-slate-300">
              Ordered Items ({order.items?.length || 0})
            </h4>
            <span className="text-xs text-gray-400 font-medium">
              {order.items?.reduce((sum, it) => sum + (it.quantity || 1), 0)} Total Units
            </span>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-slate-800 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
            {order.items?.map((item) => {
              const imgSrc = resolveOrderItemImage(item, products);
              const lineTotal = (item.quantity || 1) * (item.unitPrice || 0);

              return (
                <div key={item.id} className="p-3.5 flex items-center gap-3.5">
                  {/* Product Image (56px) */}
                  <div className="w-14 h-14 rounded-xl bg-gray-50 dark:bg-slate-800 overflow-hidden border border-gray-100 dark:border-slate-700 flex-shrink-0 shadow-2xs">
                    <img
                      src={imgSrc}
                      alt={item.product?.name || 'Product'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_PLACEHOLDER;
                      }}
                    />
                  </div>

                  {/* Product Info & Variant */}
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                      {item.product?.name}
                    </div>
                    {item.selectedVariant && (
                      <div className="mt-0.5">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-gray-100 dark:bg-slate-800 text-[10px] font-bold text-gray-600 dark:text-slate-400">
                          Variant: {item.selectedVariant.name}
                        </span>
                      </div>
                    )}
                    <div className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">
                      Qty: <strong className="text-gray-900 dark:text-white">{item.quantity}</strong> × Rs. {item.unitPrice?.toLocaleString()}
                    </div>
                  </div>

                  {/* Line Total */}
                  <div className="text-right font-extrabold text-brand-600 dark:text-cyan-400 text-xs sm:text-sm flex-shrink-0">
                    Rs. {lineTotal.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Totals */}
        <div className="p-4 bg-brand-50/50 rounded-2xl border border-brand-100 text-xs space-y-2">
          <div className="flex justify-between text-gray-600"><span>Subtotal:</span><span>Rs. {order.subtotal.toLocaleString()}</span></div>
          {order.couponDiscount > 0 && (
            <div className="flex justify-between text-emerald-600 font-bold"><span>Discount:</span><span>- Rs. {order.couponDiscount.toLocaleString()}</span></div>
          )}
          <div className="flex justify-between text-gray-600"><span>Delivery Fee:</span><span>{order.shippingFee === 0 ? 'FREE' : `Rs. ${order.shippingFee}`}</span></div>
          <div className="flex justify-between text-sm font-extrabold text-brand-600 border-t border-brand-200 pt-2"><span>Total Amount:</span><span>Rs. {order.total.toLocaleString()}</span></div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button onClick={() => window.print()} className="flex-1 py-3 bg-gray-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2">
            <Printer className="w-4 h-4" />
            Print Receipt
          </button>
          <Link
            to={`/track-order?orderId=${order.id}&phone=${encodeURIComponent(order.customerPhone)}`}
            onClick={onClose}
            className="flex-1 py-3 bg-brand-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Live Tracking
          </Link>
        </div>
      </div>
    </Modal>
  );
};
