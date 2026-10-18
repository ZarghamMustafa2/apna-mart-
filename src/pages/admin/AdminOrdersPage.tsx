import React, { useState } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Modal } from '../../components/common/Modal';
import { OrderStatus, Order } from '../../types/order';
import {
  Search,
  Eye,
  CheckCircle2,
  Package,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  ShoppingBag,
} from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const { adminOrders, updateOrderStatus } = useAdminData();
  const { adminUser } = useAdminAuth();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Available Order Statuses in beginner-friendly sequence
  const statusOptions: { value: OrderStatus; label: string; color: string }[] = [
    { value: 'New Order', label: '🔵 New Order', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { value: 'Confirmed', label: '✅ Confirmed', color: 'bg-sky-50 text-sky-700 border-sky-200' },
    { value: 'Processing', label: '⚙️ Processing', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { value: 'Packed', label: '📦 Packed', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { value: 'Shipped', label: '🚚 Shipped', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { value: 'Out for Delivery', label: '🛵 Out for Delivery', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    { value: 'Delivered', label: '🎉 Delivered', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { value: 'Cancelled', label: '❌ Cancelled', color: 'bg-red-50 text-red-700 border-red-200' },
    { value: 'Returned', label: '↩️ Returned', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { value: 'Refunded', label: '💰 Refunded', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  ];

  // Filter orders
  const filteredOrders = adminOrders.filter((ord) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchId = ord.id.toLowerCase().includes(q);
      const matchName = ord.customerName.toLowerCase().includes(q);
      const matchPhone = ord.customerPhone?.includes(q);
      if (!matchId && !matchName && !matchPhone) return false;
    }
    if (statusFilter !== 'all' && ord.status !== statusFilter) {
      return false;
    }
    return true;
  });

  // Handle instant status change via the single dropdown
  const handleQuickStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus, `Status updated to ${newStatus}`, adminUser?.name || 'Admin');
    setSuccessToast(`Order #${orderId} status changed to "${newStatus}"!`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">
            Order Fulfillment
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
            Customer Orders ({filteredOrders.length})
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            View orders and change delivery status with one click using the dropdown.
          </p>
        </div>

        {successToast && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2 shadow-sm animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successToast}</span>
          </div>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search by Customer Name, Phone, or Order #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-brand-500 transition-colors"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>

        {/* Status Quick Filter */}
        <div className="w-full sm:w-auto flex items-center gap-2">
          <label className="text-xs font-bold text-gray-500 whitespace-nowrap">Filter Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-800 cursor-pointer focus:bg-white focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Orders ({adminOrders.length})</option>
            {statusOptions.map((st) => (
              <option key={st.value} value={st.value}>
                {st.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders List / Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-sm text-gray-900">No orders match your search</h3>
            <p className="text-xs text-gray-400">Try clearing the search or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50/80 text-gray-400 font-extrabold uppercase border-b border-gray-100">
                  <th className="py-4 px-4">Order Number</th>
                  <th className="py-4 px-4">Customer Name</th>
                  <th className="py-4 px-4">Total Amount</th>
                  <th className="py-4 px-4">Order Status (Change Status)</th>
                  <th className="py-4 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-gray-800">
                {filteredOrders.map((ord) => {
                  const currentStatusConfig = statusOptions.find((s) => s.value === ord.status);

                  return (
                    <tr key={ord.id} className="hover:bg-gray-50/60 transition-colors">
                      {/* 1. Order Number */}
                      <td className="py-4 px-4">
                        <div className="font-extrabold text-sm text-brand-600">{ord.id}</div>
                        <div className="text-[11px] text-gray-400 font-normal flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span>{ord.createdAt}</span>
                        </div>
                      </td>

                      {/* 2. Customer Name */}
                      <td className="py-4 px-4">
                        <div className="font-extrabold text-sm text-gray-900">{ord.customerName}</div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                          <span>📞 {ord.customerPhone}</span>
                          <span className="text-gray-300">•</span>
                          <span>📍 {ord.shippingAddress?.city}</span>
                        </div>
                      </td>

                      {/* 3. Total Amount */}
                      <td className="py-4 px-4">
                        <div className="text-sm font-extrabold text-gray-900">
                          Rs. {ord.total.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-gray-400 uppercase font-bold">
                          {ord.paymentMethod}
                        </div>
                      </td>

                      {/* 4. Order Status (1-Click Simple Dropdown) */}
                      <td className="py-4 px-4">
                        <div className="inline-block relative">
                          <select
                            value={ord.status}
                            onChange={(e) => handleQuickStatusChange(ord.id, e.target.value as OrderStatus)}
                            className={`px-3 py-2 rounded-xl text-xs font-extrabold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs transition-all ${
                              currentStatusConfig?.color || 'bg-gray-50 text-gray-700 border-gray-200'
                            }`}
                          >
                            {statusOptions.map((opt) => (
                              <option key={opt.value} value={opt.value} className="bg-white text-gray-900 font-semibold">
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      {/* 5. View Details Button */}
                      <td className="py-4 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(ord)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 hover:bg-brand-50 text-gray-800 hover:text-brand-600 font-extrabold text-xs rounded-xl transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order Details: ${selectedOrder.id}`}
          maxWidth="2xl"
        >
          <div className="space-y-6 text-xs sm:text-sm">
            {/* Customer & Delivery Card */}
            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-base text-gray-900">
                  {selectedOrder.customerName}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700">
                  Status: {selectedOrder.status}
                </span>
              </div>

              <div className="text-gray-600 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span>Phone: {selectedOrder.customerPhone}</span>
              </div>

              <div className="text-gray-600 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                <span>
                  Delivery Address: {selectedOrder.shippingAddress?.address},{' '}
                  {selectedOrder.shippingAddress?.area}, {selectedOrder.shippingAddress?.city}
                </span>
              </div>

              <div className="text-gray-600 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                <span>Payment: {selectedOrder.paymentMethod.toUpperCase()} (COD / Online)</span>
              </div>
            </div>

            {/* Ordered Items */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-2">
                Ordered Items ({selectedOrder.items?.length || 0})
              </h4>
              <div className="divide-y divide-gray-100">
                {selectedOrder.items?.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="font-bold text-gray-900">{item.product?.name}</span>
                      {item.selectedVariant && (
                        <span className="text-[11px] text-gray-500 block">
                          Variant: {item.selectedVariant.name}
                        </span>
                      )}
                      <span className="text-xs text-gray-500 block">
                        Quantity: {item.quantity} x Rs. {item.unitPrice?.toLocaleString()}
                      </span>
                    </div>
                    <div className="font-extrabold text-gray-900 text-sm">
                      Rs. {(item.quantity * item.unitPrice).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total Breakdown */}
            <div className="p-4 bg-gray-50 rounded-2xl space-y-1.5 border border-gray-200">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>Rs. {selectedOrder.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping Fee:</span>
                <span>Rs. {selectedOrder.shippingFee || 0}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount Applied:</span>
                  <span>- Rs. {selectedOrder.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-gray-900 pt-2 border-t border-gray-200">
                <span>Final Order Total:</span>
                <span className="text-brand-600">Rs. {selectedOrder.total?.toLocaleString()}</span>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
              >
                Close Order Summary
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
