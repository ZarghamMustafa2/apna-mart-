import React, { useState } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { StatusBadge } from '../../components/admin/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { OrderStatus, Order } from '../../types/order';
import { Search, Eye, RefreshCw, Printer, AlertTriangle } from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const { adminOrders, updateOrderStatus } = useAdminData();
  const { adminUser } = useAdminAuth();

  const [search, setSearch] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusUpdateModalOrder, setStatusUpdateModalOrder] = useState<Order | null>(null);

  const [newStatus, setNewStatus] = useState<OrderStatus>('Confirmed');
  const [adminNote, setAdminNote] = useState('');

  const filteredOrders = adminOrders.filter((ord) => {
    if (search) {
      const q = search.toLowerCase();
      const matchId = ord.id.toLowerCase().includes(q);
      const matchName = ord.customerName.toLowerCase().includes(q);
      const matchPhone = ord.customerPhone.includes(q);
      if (!matchId && !matchName && !matchPhone) return false;
    }
    if (selectedStatusFilter && ord.status !== selectedStatusFilter) {
      return false;
    }
    return true;
  });

  const handleOpenStatusModal = (ord: Order) => {
    setStatusUpdateModalOrder(ord);
    setNewStatus(ord.status);
    setAdminNote('');
  };

  const handleConfirmStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (statusUpdateModalOrder) {
      updateOrderStatus(statusUpdateModalOrder.id, newStatus, adminNote, adminUser?.name || 'Admin');
      setStatusUpdateModalOrder(null);
    }
  };

  const allStatuses: OrderStatus[] = [
    'New Order',
    'Confirmed',
    'Processing',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
    'Returned',
    'Refunded',
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">Fulfillment Pipeline</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
            Order Management & Processing ({filteredOrders.length})
          </h1>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <input
            type="text"
            placeholder="Search orders by Order ID, customer name, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-brand-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>

        <select
          value={selectedStatusFilter}
          onChange={(e) => setSelectedStatusFilter(e.target.value)}
          className="px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 cursor-pointer"
        >
          <option value="">All 10 Order Statuses</option>
          {allStatuses.map((st) => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 text-gray-400 font-extrabold uppercase border-b border-gray-100">
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Delivery Location</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Current Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold text-gray-800">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-gray-50/50">
                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-brand-600">{ord.id}</div>
                    <div className="text-[11px] text-gray-400 font-normal">{ord.createdAt}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-gray-900">{ord.customerName}</div>
                    <div className="text-[11px] text-gray-500">📞 {ord.customerPhone}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-gray-700">{ord.shippingAddress.city}</div>
                    <div className="text-[11px] text-gray-400 font-normal truncate max-w-[140px]">{ord.shippingAddress.area}</div>
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-gray-900">Rs. {ord.total.toLocaleString()}</td>
                  <td className="py-3.5 px-4 uppercase font-bold text-gray-700">{ord.paymentMethod}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={ord.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
                        title="View Full Order"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Details
                      </button>
                      <button
                        onClick={() => handleOpenStatusModal(ord)}
                        className="p-2 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
                        title="Update Status"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Update Status
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`Order Summary - ${selectedOrder.id}`} maxWidth="2xl">
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
              <div className="font-extrabold text-sm text-gray-900">Customer: {selectedOrder.customerName} ({selectedOrder.customerPhone})</div>
              <div className="text-gray-600">Address: {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.area}, {selectedOrder.shippingAddress.city}</div>
              <div className="text-brand-600 font-bold pt-1">Payment Method: {selectedOrder.paymentMethod.toUpperCase()} | Status: {selectedOrder.status}</div>
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-2">
              <h4 className="font-extrabold text-gray-900">Ordered Items</h4>
              <div className="divide-y divide-gray-100">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="py-2 flex justify-between">
                    <div>
                      <span className="font-bold">{item.product.name}</span>
                      {item.selectedVariant && <span className="text-[11px] text-gray-500 block">Variant: {item.selectedVariant.name}</span>}
                    </div>
                    <div className="font-extrabold">Qty: {item.quantity} x Rs. {item.unitPrice.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <a
                href={`https://wa.me/${selectedOrder.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${selectedOrder.customerName}, regarding your ApnaMart order #${selectedOrder.id}:`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <span>WhatsApp Customer</span>
              </a>
              <button onClick={() => window.print()} className="px-4 py-2 bg-gray-900 text-white font-bold text-xs rounded-xl flex items-center gap-2">
                <Printer className="w-4 h-4" /> Print Order Receipt
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Update Order Status Modal */}
      {statusUpdateModalOrder && (
        <Modal
          isOpen={!!statusUpdateModalOrder}
          onClose={() => setStatusUpdateModalOrder(null)}
          title={`Update Order Status - ${statusUpdateModalOrder.id}`}
          maxWidth="md"
        >
          <form onSubmit={handleConfirmStatusUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Select New Status *
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 cursor-pointer"
              >
                {allStatuses.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {(newStatus === 'Cancelled' || newStatus === 'Returned' || newStatus === 'Refunded') && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold rounded-2xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  Business Rule: Changing status to "{newStatus}" will automatically restore inventory stock levels for all items in this order!
                </span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Admin Processing Note / Courier Tracking Note
              </label>
              <input
                type="text"
                placeholder="e.g. Handed over to TCS Rider # 42"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors"
            >
              Update Order Status
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};
