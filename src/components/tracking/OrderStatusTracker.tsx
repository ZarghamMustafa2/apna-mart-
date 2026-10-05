import React from 'react';
import { OrderStatus, TrackingStep } from '../../types/order';
import { CheckCircle2, Clock, Truck, Package, ShoppingBag, AlertCircle, Home, RotateCcw } from 'lucide-react';

interface OrderStatusTrackerProps {
  currentStatus: OrderStatus;
  trackingHistory: { status: OrderStatus; timestamp: string; note: string }[];
}

export const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({
  currentStatus,
  trackingHistory,
}) => {
  const isCancelled = currentStatus === 'Cancelled';
  const isReturned = currentStatus === 'Returned';
  const isRefunded = currentStatus === 'Refunded';

  const standardSteps: { status: OrderStatus; label: string; icon: any }[] = [
    { status: 'New Order', label: 'Order Placed', icon: ShoppingBag },
    { status: 'Confirmed', label: 'Order Confirmed', icon: CheckCircle2 },
    { status: 'Processing', label: 'Processing', icon: Clock },
    { status: 'Packed', label: 'Packed & Ready', icon: Package },
    { status: 'Shipped', label: 'In Transit', icon: Truck },
    { status: 'Out for Delivery', label: 'Out for Delivery', icon: Truck },
    { status: 'Delivered', label: 'Delivered', icon: Home },
  ];

  // Determine active step index
  const activeIndex = standardSteps.findIndex((s) => s.status === currentStatus);
  const currentStepIndex = activeIndex === -1 ? (isCancelled || isReturned || isRefunded ? standardSteps.length : 0) : activeIndex;

  return (
    <div className="space-y-8">
      {/* Status Warning Banner for cancelled/returned */}
      {(isCancelled || isReturned || isRefunded) && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <div className="text-sm">Order Status: {currentStatus}</div>
            <p className="font-normal text-[11px] text-red-600 mt-0.5">
              This order has been {currentStatus.toLowerCase()}. For questions, please contact customer support.
            </p>
          </div>
        </div>
      )}

      {/* Visual Step Bar */}
      {!isCancelled && !isReturned && !isRefunded && (
        <div className="relative py-4">
          <div className="hidden md:flex items-center justify-between relative z-10">
            {standardSteps.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const Icon = step.icon;

              return (
                <div key={step.status} className="flex flex-col items-center text-center flex-1 relative">
                  {/* Connecting Line */}
                  {idx < standardSteps.length - 1 && (
                    <div
                      className={`absolute top-5 left-1/2 w-full h-1 -z-10 transition-colors ${
                        idx < currentStepIndex ? 'bg-brand-600' : 'bg-gray-200'
                      }`}
                    />
                  )}

                  {/* Icon Circle */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-brand-600 text-white ring-4 ring-brand-500/20 scale-110 shadow-lg'
                        : isCompleted
                        ? 'bg-emerald-500 text-white shadow'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Step Label */}
                  <span className={`text-[11px] font-bold mt-2 max-w-[90px] ${isCurrent ? 'text-brand-600 font-extrabold' : isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Mobile Current Status Indicator */}
          <div className="md:hidden p-4 rounded-2xl bg-brand-50 border border-brand-200 text-brand-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold">
              {currentStepIndex + 1}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Current Progress</span>
              <h4 className="text-base font-extrabold text-gray-900">{currentStatus}</h4>
            </div>
          </div>
        </div>
      )}

      {/* Tracking History Log */}
      <div className="space-y-4">
        <h4 className="text-sm font-extrabold text-gray-900 border-l-2 border-brand-600 pl-2.5">
          Order Activity Log
        </h4>
        <div className="space-y-3 pl-2 border-l-2 border-gray-100">
          {trackingHistory.map((item, index) => (
            <div key={index} className="relative pl-6 pb-2 group">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-brand-600 ring-4 ring-white" />
              <div className="text-xs font-bold text-gray-900">{item.status}</div>
              <div className="text-[11px] text-gray-400">{item.timestamp}</div>
              <p className="text-xs text-gray-600 mt-1 bg-gray-50 p-2.5 rounded-xl border border-gray-100">{item.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
