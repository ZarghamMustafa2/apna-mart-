import React from 'react';
import { ShippingAddress } from '../../types/order';

interface CustomerInfoFormProps {
  formData: ShippingAddress;
  onChange: (field: keyof ShippingAddress, value: string) => void;
}

export const CustomerInfoForm: React.FC<CustomerInfoFormProps> = ({ formData, onChange }) => {
  const cities = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala'];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center font-bold">1</span>
          Customer & Delivery Address
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Farhan Ali"
            value={formData.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Mobile Phone Number *
          </label>
          <input
            type="tel"
            required
            placeholder="e.g. 0300 1234567"
            value={formData.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Email Address */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Email Address (Optional for Order Updates)
          </label>
          <input
            type="email"
            placeholder="farhan@example.com"
            value={formData.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* City Select */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            City *
          </label>
          <select
            value={formData.city}
            onChange={(e) => onChange('city', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:bg-white focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Area / Sector */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Area / Sector *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Gulberg III / DHA Phase 5"
            value={formData.area}
            onChange={(e) => onChange('area', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Detailed Address */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Complete Street Address *
          </label>
          <textarea
            required
            rows={2}
            placeholder="House / Apartment number, Street, Landmark..."
            value={formData.address}
            onChange={(e) => onChange('address', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Delivery Notes */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Additional Delivery Instructions (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Call before delivery, deliver between 10am-5pm"
            value={formData.notes || ''}
            onChange={(e) => onChange('notes', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>
    </div>
  );
};
