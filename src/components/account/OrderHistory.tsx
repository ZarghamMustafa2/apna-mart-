import React, { useState } from 'react';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { Order } from '../../types/order';
import { Eye, Package, MapPin } from 'lucide-react';
import { OrderDetailModal } from './OrderDetailModal';
import { Link } from 'react-router-dom';
import { useAdminData } from '../../context/AdminDataContext';
import { resolveOrderItemImage, DEFAULT_PRODUCT_PLACEHOLDER } from '../../services/apiServices';

export const OrderHistory: React.FC = () => {
  const { orders } = useOrders();
  const { user } = useAuth();
  const { products } = useAdminData();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filter orders associated strictly with this authenticated customer
  const customerOrders = orders.filter((o) => {
    if (user?.id && o.userId === user.id) return true;
    if (user?.email && o.customerEmail && o.customerEmail.toLowerCase() === user.email.toLowerCase()) return true;
    return false;
  });

  if (customerOrders.length === 0) {
    return (
      <div className="py-16 text-center space-y-4 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-8">
        <Package className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto" />
        <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">No Orders Placed Yet</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
          You haven't placed any orders with this account yet. Start exploring our catalog!
        </p>
        <Link to="/shop" className="inline-block px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-extrabold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-4">
        Order History ({customerOrders.length})
      </h3>

      <div className="space-y-4">
        {customerOrders.map((order) => (
          <div
            key={order.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col gap-4"
          >
            {/* Top Row: Order Summary & Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-sm text-gray-900 dark:text-white">{order.id}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                    {order.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Placed on: <strong>{order.createdAt}</strong> • Payment: <strong className="uppercase">{order.paymentMethod}</strong>
                </div>
                <div className="text-xs font-bold text-brand-600 dark:text-cyan-400">
                  Total: Rs. {order.total.toLocaleString()}
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="flex-1 sm:flex-none px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-800 dark:text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Details
                </button>
                <Link
                  to={`/track-order?orderId=${order.id}&phone=${encodeURIComponent(order.customerPhone)}`}
                  className="flex-1 sm:flex-none px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Track Status
                </Link>
              </div>
            </div>

            {/* Bottom Row: Ordered Product Thumbnails */}
            {order.items && order.items.length > 0 && (
              <div className="flex items-center gap-2.5 pt-3 border-t border-gray-100 dark:border-slate-800 overflow-x-auto pb-1 scrollbar-none w-full">
                {order.items.map((item, idx) => {
                  const imgSrc = resolveOrderItemImage(item, products);
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 bg-gray-50 dark:bg-slate-800/60 p-1.5 pr-3 rounded-xl border border-gray-100 dark:border-slate-700/60 flex-shrink-0"
                    >
                      <img
                        src={imgSrc}
                        alt={item.product?.name || 'Item'}
                        className="w-10 h-10 rounded-lg object-cover bg-white dark:bg-slate-900 flex-shrink-0 shadow-2xs"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_PLACEHOLDER;
                        }}
                      />
                      <div className="text-left">
                        <div className="font-extrabold text-[11px] text-gray-900 dark:text-slate-100 truncate max-w-[140px]">
                          {item.product?.name}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          Qty: {item.quantity} × Rs. {item.unitPrice?.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          order={selectedOrder}
        />
      )}
    </div>
  );
};
