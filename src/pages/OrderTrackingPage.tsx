import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { OrderStatusTracker } from '../components/tracking/OrderStatusTracker';
import { useOrders } from '../context/OrderContext';
import { Search, Package, MapPin, AlertCircle } from 'lucide-react';
import { Order } from '../types/order';

export const OrderTrackingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { trackOrder } = useOrders();

  const [orderIdInput, setOrderIdInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [foundOrder, setFoundOrder] = useState<Order | undefined>(undefined);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const paramId = searchParams.get('orderId');
    const paramPhone = searchParams.get('phone');
    if (paramId) {
      setOrderIdInput(paramId);
      if (paramPhone) setPhoneInput(paramPhone);
      trackOrder(paramId, paramPhone || '').then((matched) => {
        setFoundOrder(matched);
        setHasSearched(true);
      });
    }
  }, [searchParams]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (orderIdInput.trim()) {
      const matched = await trackOrder(orderIdInput.trim(), phoneInput.trim());
      setFoundOrder(matched);
      setHasSearched(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <Breadcrumb items={[{ label: 'Order Tracking' }]} />

      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-2">
          <MapPin className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Track Your Package Live
        </h1>
        <p className="text-xs text-gray-500 font-medium">
          Enter your Order ID (e.g. ORD-2026-89421) and your registered phone number to check realtime delivery progress.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4 max-w-xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Order ID *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. ORD-2026-89421"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold uppercase placeholder:normal-case focus:bg-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              placeholder="e.g. 03001234567"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
        >
          <Search className="w-4 h-4" />
          <span>Track Order Status</span>
        </button>
      </form>

      {/* Results View */}
      {hasSearched && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          {foundOrder ? (
            <>
              {/* Order Info Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs">
                <div>
                  <div className="text-gray-400 font-bold uppercase text-[10px]">Order Number</div>
                  <div className="font-extrabold text-gray-900 text-sm">{foundOrder.id}</div>
                </div>
                <div>
                  <div className="text-gray-400 font-bold uppercase text-[10px]">Tracking Number</div>
                  <div className="font-extrabold text-brand-600 text-sm">{foundOrder.trackingNumber}</div>
                </div>
                <div>
                  <div className="text-gray-400 font-bold uppercase text-[10px]">Estimated Delivery</div>
                  <div className="font-extrabold text-emerald-600 text-sm">{foundOrder.estimatedDelivery}</div>
                </div>
              </div>

              {/* 10-Stage Tracker */}
              <OrderStatusTracker
                currentStatus={foundOrder.status}
                trackingHistory={foundOrder.trackingHistory}
              />
            </>
          ) : (
            <div className="py-12 text-center space-y-3">
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
              <h3 className="text-lg font-extrabold text-gray-900">No Matching Order Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Please double check the Order ID format (e.g., ORD-2026-89421) and try again, or check your account dashboard.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
