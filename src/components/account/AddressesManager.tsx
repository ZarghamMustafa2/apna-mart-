import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Plus, Trash2 } from 'lucide-react';
import { ShippingAddress } from '../../types/order';

export const AddressesManager: React.FC = () => {
  const { user, addAddress, deleteAddress } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [label, setLabel] = useState('Home');
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState('Lahore');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (area && address) {
      addAddress({
        label,
        fullName,
        phone,
        city,
        area,
        address,
      });
      setShowAddForm(false);
      setArea('');
      setAddress('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <h3 className="text-lg font-extrabold text-gray-900">
          Saved Delivery Addresses ({user?.savedAddresses.length || 0})
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Address
        </button>
      </div>

      {/* Add Address Form */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="p-6 bg-brand-50/40 rounded-3xl border border-brand-100 space-y-4 animate-in fade-in duration-200">
          <h4 className="font-extrabold text-sm text-gray-900">New Address Details</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Address Label</label>
              <input
                type="text"
                placeholder="e.g. Home, Office"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Area / Sector</label>
              <input
                type="text"
                required
                placeholder="e.g. Gulberg III"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Street Address</label>
              <input
                type="text"
                required
                placeholder="House #, Street name..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" className="px-5 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl">
              Save Address
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-5 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Address List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {user?.savedAddresses.map((addr) => (
          <div key={addr.id} className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md bg-brand-50 text-brand-700 font-extrabold text-[11px] uppercase">
                {addr.label || 'Saved Address'}
              </span>
              <button
                onClick={() => deleteAddress(addr.id)}
                className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"
                title="Delete Address"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs font-bold text-gray-900">{addr.fullName}</div>
            <div className="text-xs text-gray-600 leading-relaxed">
              {addr.address}, {addr.area}, {addr.city}
            </div>
            <div className="text-[11px] font-semibold text-gray-500 pt-1">
              📞 {addr.phone}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
