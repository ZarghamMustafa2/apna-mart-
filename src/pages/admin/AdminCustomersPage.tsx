import React, { useState, useEffect } from 'react';
import { Search, Users, Mail, Phone, MapPin, Eye, Calendar, ShoppingBag } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { useAdminData } from '../../context/AdminDataContext';
import { dbGetAll } from '../../services/db';

export const AdminCustomersPage: React.FC = () => {
  const { adminOrders } = useAdminData();
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [customerList, setCustomerList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCustomers = async () => {
    try {
      const allUsers = await dbGetAll<any>('users');
      // Registered customers are users without admin roles
      const registeredCustomers = (allUsers || []).filter((u) => !u.role);

      // Map with live order counts and spending
      const mapped = registeredCustomers.map((u) => {
        const userOrders = adminOrders.filter(
          (o) =>
            (u.id && o.userId === u.id) ||
            (u.email && o.customerEmail && o.customerEmail.toLowerCase() === u.email.toLowerCase()) ||
            (u.phone && o.customerPhone && o.customerPhone === u.phone)
        );

        const totalOrders = userOrders.length;
        const totalSpent = userOrders.reduce((sum, o) => sum + (o.total || 0), 0);
        const city = u.city || u.defaultAddress?.city || userOrders[0]?.shippingAddress?.city || 'Lahore';
        const address =
          u.defaultAddress?.address
            ? `${u.defaultAddress.address}${u.defaultAddress.area ? ', ' + u.defaultAddress.area : ''}`
            : userOrders[0]?.shippingAddress?.address || 'No address saved yet';

        return {
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone || u.defaultAddress?.phone || userOrders[0]?.customerPhone || '-',
          city,
          address,
          totalOrders,
          totalSpent,
          createdAt: u.createdAt || '2026-01-15',
          avatar: u.avatar,
        };
      });

      // Also discover any customers who placed orders directly but might not have user record
      const knownEmails = new Set(registeredCustomers.map((u) => u.email.toLowerCase()));
      adminOrders.forEach((o) => {
        const guestEmail = o.customerEmail;
        if (guestEmail && !knownEmails.has(guestEmail.toLowerCase())) {
          knownEmails.add(guestEmail.toLowerCase());
          const guestOrders = adminOrders.filter(
            (ord) => ord.customerEmail && ord.customerEmail.toLowerCase() === guestEmail.toLowerCase()
          );
          mapped.push({
            id: `guest-${mapped.length + 1}`,
            name: o.customerName,
            email: guestEmail,
            phone: o.customerPhone || '-',
            city: o.shippingAddress?.city || 'Lahore',
            address: o.shippingAddress?.address || '-',
            totalOrders: guestOrders.length,
            totalSpent: guestOrders.reduce((sum, ord) => sum + ord.total, 0),
            createdAt: (o.createdAt || '2026-10-17').split(' ')[0],
            avatar: undefined,
          });
        }
      });

      setCustomerList(mapped);
    } catch (err) {
      console.error('Failed to load customers from database:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [adminOrders]);

  const filtered = customerList.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search)) ||
      (c.city && c.city.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">Store Shoppers</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
            Registered Customers ({filtered.length})
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Live database view of registered customer accounts, delivery cities, and order history.
          </p>
        </div>
      </div>

      <div className="p-4 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="relative max-w-md w-full">
          <input
            type="text"
            placeholder="Search customers by name, email, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 text-gray-400 font-extrabold uppercase border-b border-gray-100">
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">City</th>
                <th className="py-3.5 px-4">Total Orders</th>
                <th className="py-3.5 px-4">Total Spent</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold text-gray-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    {isLoading ? 'Loading customers from database...' : 'No customer records found matching your search.'}
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50">
                    <td className="py-3.5 px-4 font-bold text-gray-900">{c.name}</td>
                    <td className="py-3.5 px-4 text-gray-600">{c.email}</td>
                    <td className="py-3.5 px-4 font-mono">{c.phone}</td>
                    <td className="py-3.5 px-4">{c.city}</td>
                    <td className="py-3.5 px-4 font-extrabold text-brand-600">{c.totalOrders} Orders</td>
                    <td className="py-3.5 px-4 font-extrabold text-gray-900">Rs. {c.totalSpent.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-gray-400 font-normal">{c.createdAt}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                        title="View Customer Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={`Customer Details - ${selectedCustomer.name}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-gray-50 rounded-2xl space-y-2">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <span className="font-extrabold text-sm text-gray-900">{selectedCustomer.name}</span>
                <span className="text-[11px] text-gray-500">Joined: {selectedCustomer.createdAt}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-gray-700">
                <div>Email: <strong className="text-gray-900 block">{selectedCustomer.email}</strong></div>
                <div>Phone: <strong className="text-gray-900 block">{selectedCustomer.phone}</strong></div>
              </div>
              <div className="pt-1 text-gray-700">
                Delivery City: <strong className="text-gray-900">{selectedCustomer.city}</strong>
              </div>
              <div className="text-gray-700">
                Delivery Address: <strong className="text-gray-900">{selectedCustomer.address}</strong>
              </div>
            </div>

            <div className="p-4 bg-brand-50/60 rounded-2xl text-brand-900 font-bold space-y-1">
              <div>Total Orders Placed: {selectedCustomer.totalOrders}</div>
              <div>Lifetime Spending: Rs. {selectedCustomer.totalSpent.toLocaleString()}</div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
