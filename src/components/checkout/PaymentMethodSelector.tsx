import React from 'react';
import { PaymentMethod } from '../../types/order';
import { Banknote, CreditCard, Smartphone, CheckCircle } from 'lucide-react';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onSelect,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center font-bold">2</span>
          Select Payment Method
        </h3>
      </div>

      <div className="space-y-3">
        {/* Cash On Delivery Option */}
        <label
          onClick={() => onSelect('cod')}
          className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
            selectedMethod === 'cod'
              ? 'border-brand-600 bg-brand-50/50 shadow-sm'
              : 'border-gray-100 bg-white hover:border-gray-200'
          }`}
        >
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 mt-0.5">
            <Banknote className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-gray-900">Cash on Delivery (COD)</h4>
              {selectedMethod === 'cod' && <CheckCircle className="w-5 h-5 text-brand-600" />}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Pay in cash directly to courier rider upon receiving your parcel.</p>
          </div>
        </label>

        {/* Online Credit / Debit Card Option */}
        <label
          onClick={() => onSelect('card')}
          className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
            selectedMethod === 'card'
              ? 'border-brand-600 bg-brand-50/50 shadow-sm'
              : 'border-gray-100 bg-white hover:border-gray-200'
          }`}
        >
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 mt-0.5">
            <CreditCard className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-gray-900">Credit / Debit Card</h4>
              {selectedMethod === 'card' && <CheckCircle className="w-5 h-5 text-brand-600" />}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Instant online payment via Visa, Mastercard, or UnionPay.</p>

            {selectedMethod === 'card' && (
              <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 space-y-3">
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-semibold"
                />
                <input
                  type="text"
                  placeholder="Card Number (4000 1234 5678 9010)"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-semibold"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-semibold"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-semibold"
                  />
                </div>
              </div>
            )}
          </div>
        </label>

        {/* Mobile Wallet Option */}
        <label
          onClick={() => onSelect('wallet')}
          className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
            selectedMethod === 'wallet'
              ? 'border-brand-600 bg-brand-50/50 shadow-sm'
              : 'border-gray-100 bg-white hover:border-gray-200'
          }`}
        >
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 mt-0.5">
            <Smartphone className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-gray-900">EasyPaisa / JazzCash / Raast</h4>
              {selectedMethod === 'wallet' && <CheckCircle className="w-5 h-5 text-brand-600" />}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Instant mobile wallet checkout & QR code scan.</p>
          </div>
        </label>
      </div>
    </div>
  );
};
