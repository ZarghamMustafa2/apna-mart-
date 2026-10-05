import React from 'react';
import { useAdminData } from '../../../context/AdminDataContext';
import { StatusBadge } from '../common/StatusBadge';
import { Eye, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RecentOrdersTable: React.FC = () => {
  const { adminOrders } = useAdminData();
  const recent = adminOrders.slice(0, 5);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="text-base font-extrabold text-gray-900">Recent Customer Orders</h3>
        <Link to="/admin/orders" className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1">
          <span>View All Orders ({adminOrders.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-gray-400 font-extrabold uppercase border-b border-gray-100">
              <th className="pb-3 px-2">Order ID</th>
              <th className="pb-3 px-2">Customer</th>
              <th className="pb-3 px-2">Date</th>
              <th className="pb-3 px-2">Total</th>
              <th className="pb-3 px-2">Payment</th>
              <th className="pb-3 px-2">Status</th>
              <th className="pb-3 px-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 font-semibold text-gray-800">
            {recent.map((ord) => (
              <tr key={ord.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-3 px-2 font-bold text-brand-600">{ord.id}</td>
                <td className="py-3 px-2">{ord.customerName}</td>
                <td className="py-3 px-2 text-gray-400 font-normal">{ord.createdAt}</td>
                <td className="py-3 px-2 font-extrabold">Rs. {ord.total.toLocaleString()}</td>
                <td className="py-3 px-2 uppercase">{ord.paymentMethod}</td>
                <td className="py-3 px-2">
                  <StatusBadge status={ord.status} />
                </td>
                <td className="py-3 px-2 text-right">
                  <Link
                    to={`/admin/orders?orderId=${ord.id}`}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 inline-block transition-colors"
                    title="View Order Details"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
