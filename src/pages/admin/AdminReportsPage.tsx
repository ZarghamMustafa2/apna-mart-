import React, { useState } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { Download, FileText, Calendar, Filter, TrendingUp, Package, Users, ShoppingBag } from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const { adminOrders, products, categories } = useAdminData();
  const [activeTab, setActiveTab] = useState<'sales' | 'orders' | 'products' | 'customers' | 'inventory'>('sales');
  const [dateRange, setDateRange] = useState<'all' | '30days' | '7days'>('30days');

  // Helper to convert data array to downloadable CSV string
  const exportToCSV = (filename: string, rows: Record<string, any>[]) => {
    if (!rows || rows.length === 0) return;

    const headers = Object.keys(rows[0]);
    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        headers
          .map((h) => {
            const val = row[h] !== undefined && row[h] !== null ? String(row[h]) : '';
            return `"${val.replace(/"/g, '""')}"`;
          })
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 1. Sales Report Rows
  const salesReportData = adminOrders.map((o) => ({
    'Order Number': o.id,
    Date: o.createdAt,
    Customer: o.customerName,
    'Subtotal (Rs.)': o.subtotal,
    'Discount (Rs.)': o.couponDiscount,
    'Shipping Fee (Rs.)': o.shippingFee,
    'Final Total (Rs.)': o.total,
    'Payment Method': o.paymentMethod,
    'Payment Status': o.paymentStatus,
    'Order Status': o.status,
  }));

  // 2. Product Report Rows
  const productReportData = products.map((p) => {
    const totalSold = adminOrders.reduce((sum, o) => {
      if (o.status === 'Cancelled' || o.status === 'Refunded') return sum;
      const orderItem = o.items.find((item) => item.product.id === p.id);
      return sum + (orderItem ? orderItem.quantity : 0);
    }, 0);

    const totalRev = adminOrders.reduce((sum, o) => {
      if (o.status === 'Cancelled' || o.status === 'Refunded') return sum;
      const orderItem = o.items.find((item) => item.product.id === p.id);
      return sum + (orderItem ? orderItem.quantity * orderItem.unitPrice : 0);
    }, 0);

    return {
      SKU: p.sku,
      'Product Name': p.name,
      Category: p.category,
      Brand: p.brand,
      'Regular Price (Rs.)': p.regularPrice,
      'Sale Price (Rs.)': p.salePrice || p.regularPrice,
      'Units Sold': totalSold,
      'Revenue Generated (Rs.)': totalRev,
      'Current Stock': p.stock,
      Status: p.stock > 5 ? 'In Stock' : p.stock > 0 ? 'Low Stock' : 'Out of Stock',
    };
  });

  // 3. Customer Report Rows
  const customerMap: Record<string, { name: string; phone: string; email: string; ordersCount: number; totalSpend: number; lastOrder: string }> = {};
  adminOrders.forEach((o) => {
    const key = o.customerPhone || o.customerName;
    if (!customerMap[key]) {
      customerMap[key] = {
        name: o.customerName,
        phone: o.customerPhone,
        email: o.customerEmail || 'N/A',
        ordersCount: 0,
        totalSpend: 0,
        lastOrder: o.createdAt,
      };
    }
    if (o.status !== 'Cancelled') {
      customerMap[key].ordersCount += 1;
      customerMap[key].totalSpend += o.total;
    }
  });

  const customerReportData = Object.values(customerMap);

  // Export Trigger
  const handleExport = () => {
    if (activeTab === 'sales' || activeTab === 'orders') {
      exportToCSV('ApexStore_Sales_Orders_Report', salesReportData);
    } else if (activeTab === 'products' || activeTab === 'inventory') {
      exportToCSV('ApexStore_Product_Inventory_Report', productReportData);
    } else if (activeTab === 'customers') {
      exportToCSV('ApexStore_Customer_Report', customerReportData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">Business Intelligence</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
            Reports & Analytics Exports
          </h1>
        </div>

        <button
          onClick={handleExport}
          className="px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
        >
          <Download className="w-4 h-4" />
          <span>Export {activeTab.toUpperCase()} CSV</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-3 scrollbar-none">
        {[
          { id: 'sales', label: 'Sales Report', icon: TrendingUp },
          { id: 'orders', label: 'Order Log', icon: ShoppingBag },
          { id: 'products', label: 'Product Performance', icon: Package },
          { id: 'customers', label: 'Customer Insights', icon: Users },
          { id: 'inventory', label: 'Stock Audit Report', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Report Table Container */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 space-y-4">
        {activeTab === 'sales' || activeTab === 'orders' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-extrabold uppercase border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Subtotal</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Shipping</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {salesReportData.map((row) => (
                  <tr key={row['Order Number']} className="hover:bg-gray-50/80">
                    <td className="py-3 px-4 font-bold text-gray-900">{row['Order Number']}</td>
                    <td className="py-3 px-4 text-gray-500">{row['Date']}</td>
                    <td className="py-3 px-4 font-bold">{row['Customer']}</td>
                    <td className="py-3 px-4">Rs. {row['Subtotal (Rs.)'].toLocaleString()}</td>
                    <td className="py-3 px-4 text-emerald-600">- Rs. {row['Discount (Rs.)'].toLocaleString()}</td>
                    <td className="py-3 px-4">Rs. {row['Shipping Fee (Rs.)']}</td>
                    <td className="py-3 px-4 font-extrabold text-brand-600">Rs. {row['Final Total (Rs.)'].toLocaleString()}</td>
                    <td className="py-3 px-4 uppercase">{row['Payment Method']}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{row['Order Status']}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'products' || activeTab === 'inventory' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-extrabold uppercase border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Units Sold</th>
                  <th className="py-3 px-4">Revenue</th>
                  <th className="py-3 px-4">Current Stock</th>
                  <th className="py-3 px-4">Stock Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {productReportData.map((row) => (
                  <tr key={row.SKU} className="hover:bg-gray-50/80">
                    <td className="py-3 px-4 font-bold text-gray-900">{row.SKU}</td>
                    <td className="py-3 px-4 font-extrabold text-gray-800">{row['Product Name']}</td>
                    <td className="py-3 px-4 text-gray-500">{row.Category}</td>
                    <td className="py-3 px-4 font-bold">Rs. {row['Sale Price (Rs.)'].toLocaleString()}</td>
                    <td className="py-3 px-4 font-extrabold text-emerald-600">{row['Units Sold']}</td>
                    <td className="py-3 px-4 font-extrabold text-brand-600">Rs. {row['Revenue Generated (Rs.)'].toLocaleString()}</td>
                    <td className="py-3 px-4 font-bold">{row['Current Stock']}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                          row.Status === 'In Stock'
                            ? 'bg-emerald-50 text-emerald-700'
                            : row.Status === 'Low Stock'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {row.Status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-extrabold uppercase border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Phone Number</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Total Orders</th>
                  <th className="py-3 px-4">Total Spend</th>
                  <th className="py-3 px-4">Last Order Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {customerReportData.map((c, i) => (
                  <tr key={i} className="hover:bg-gray-50/80">
                    <td className="py-3 px-4 font-extrabold text-gray-900">{c.name}</td>
                    <td className="py-3 px-4 font-bold text-gray-700">{c.phone}</td>
                    <td className="py-3 px-4 text-gray-500">{c.email}</td>
                    <td className="py-3 px-4 font-extrabold text-emerald-600">{c.ordersCount}</td>
                    <td className="py-3 px-4 font-extrabold text-brand-600">Rs. {c.totalSpend.toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-400">{c.lastOrder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
