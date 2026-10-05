import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Plus, Trash2, Edit3, Check, Star, X } from 'lucide-react';
import { ShippingAddress } from '../../types/order';

export const AddressesManager: React.FC = () => {
  const { user, addAddress, editAddress, deleteAddress, setDefaultAddress } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [label, setLabel] = useState('Home');
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || 'Lahore');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const resetForm = () => {
    setEditingId(null);
    setLabel('Home');
    setFullName(user?.name || '');
    setPhone(user?.phone || '');
    setCity(user?.city || 'Lahore');
    setArea('');
    setAddress('');
    setIsDefault(false);
    setShowForm(false);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const handleOpenEdit = (addr: ShippingAddress & { id: string; label?: string }) => {
    setEditingId(addr.id);
    setLabel(addr.label || 'Address');
    setFullName(addr.fullName);
    setPhone(addr.phone);
    setCity(addr.city);
    setArea(addr.area);
    setAddress(addr.address);
    setIsDefault(user?.defaultAddress?.address === addr.address);
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!area.trim() || !address.trim() || !fullName.trim() || !phone.trim()) {
      return;
    }

    if (editingId) {
      await editAddress(editingId, {
        label: label.trim(),
        fullName: fullName.trim(),
        phone: phone.trim(),
        city: city.trim(),
        area: area.trim(),
        address: address.trim(),
      });
      if (isDefault) {
        await setDefaultAddress(editingId);
      }
    } else {
      await addAddress({
        label: label.trim(),
        fullName: fullName.trim(),
        phone: phone.trim(),
        city: city.trim(),
        area: area.trim(),
        address: address.trim(),
      });
    }

    resetForm();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-white">
            Saved Delivery Addresses ({user?.savedAddresses.length || 0})
          </h3>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
            Manage your delivery destinations for fast, one-click checkout
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Add / Edit Address Form Modal/Card */}
      {showForm && (
        <form
          onSubmit={handleFormSubmit}
          className="p-5 sm:p-6 bg-brand-50/50 dark:bg-slate-900 rounded-3xl border border-brand-200 dark:border-slate-800 space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-brand-100 dark:border-slate-800 pb-3">
            <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">
              {editingId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
            </h4>
            <button
              type="button"
              onClick={resetForm}
              className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-300 uppercase mb-1">
                Address Tag
              </label>
              <input
                type="text"
                placeholder="e.g. Home, Office, Apartment"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-300 uppercase mb-1">
                Recipient Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-300 uppercase mb-1">
                Contact Phone *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-300 uppercase mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-300 uppercase mb-1">
                Area / Town / Sector *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Gulberg III, DHA Phase 5, F-7"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-300 uppercase mb-1">
                Street Address / House No *
              </label>
              <textarea
                rows={2}
                required
                placeholder="House / Flat #, Street, Near landmark..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors"
            >
              {editingId ? 'Update Address' : 'Save Address'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800 dark:hover:text-slate-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Address Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {user?.savedAddresses && user.savedAddresses.length > 0 ? (
          user.savedAddresses.map((addr) => {
            const isDefaultAddress = user.defaultAddress?.address === addr.address;
            return (
              <div
                key={addr.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between gap-4 ${
                  isDefaultAddress
                    ? 'border-brand-500 bg-brand-50/20 dark:bg-slate-900 dark:border-cyan-500/50 shadow-sm'
                    : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200 uppercase">
                      {addr.label || 'Address'}
                    </span>
                    {isDefaultAddress && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Default
                      </span>
                    )}
                  </div>

                  <div className="font-extrabold text-sm text-gray-900 dark:text-white">
                    {addr.fullName}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
                    {addr.address}, {addr.area}, {addr.city}
                  </p>
                  <p className="text-xs font-semibold text-brand-600 dark:text-cyan-400">
                    Phone: {addr.phone}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  {!isDefaultAddress ? (
                    <button
                      type="button"
                      onClick={() => setDefaultAddress(addr.id)}
                      className="font-bold text-gray-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-cyan-400 text-[11px]"
                    >
                      Set as Default
                    </button>
                  ) : (
                    <span className="text-[11px] text-gray-400 font-semibold">Primary Delivery Address</span>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(addr)}
                      className="p-1.5 text-gray-500 hover:text-brand-600 dark:hover:text-cyan-400 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                      title="Edit Address"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteAddress(addr.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      title="Delete Address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full p-8 text-center bg-gray-50 dark:bg-slate-900 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800 space-y-2">
            <MapPin className="w-8 h-8 text-gray-400 mx-auto" />
            <p className="text-xs font-bold text-gray-700 dark:text-slate-300">
              No delivery addresses saved yet.
            </p>
            <p className="text-[11px] text-gray-400 dark:text-slate-500">
              Add your home or workplace address for faster checkout.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
