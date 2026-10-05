import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserAvatar } from '../common/UserAvatar';
import { uploadImage, DEFAULT_AVATAR_OPTIONS } from '../../services/mediaService';
import {
  Camera,
  Check,
  Calendar,
  Phone,
  Mail,
  User,
  MapPin,
  Clock,
  AlertCircle,
  Trash2,
  Save,
  ShieldCheck,
} from 'lucide-react';

export const ProfileEdit: React.FC = () => {
  const { user, updateProfile } = useAuth();

  // Form Fields
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [dob, setDob] = useState(user?.dob || '');
  const [gender, setGender] = useState(user?.gender || 'prefer_not_to_say');
  const [city, setCity] = useState(user?.city || user?.defaultAddress?.city || 'Lahore');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  // UI States
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError(null);
    setIsUploadingPhoto(true);

    try {
      const optimizedUrl = await uploadImage(file, DEFAULT_AVATAR_OPTIONS);
      setAvatar(optimizedUrl);
      // Auto-save photo to profile immediately so user doesn't lose it
      await updateProfile({ avatar: optimizedUrl });
    } catch (err: any) {
      setPhotoError(err.message || 'Failed to upload photo. Please check format/size.');
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePhoto = async () => {
    setAvatar('');
    setPhotoError(null);
    await updateProfile({ avatar: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSavedSuccess(false);

    const success = await updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      dob: dob || undefined,
      gender,
      city: city.trim(),
      avatar: avatar || undefined,
    });

    setIsSubmitting(false);
    if (success) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header Profile Summary Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 rounded-3xl p-5 sm:p-7 text-white shadow-lg flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* Profile Avatar with Camera Trigger */}
        <div className="relative group">
          <UserAvatar name={name || user?.name} avatarUrl={avatar} size="2xl" />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingPhoto}
            className="absolute bottom-0 right-0 p-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-full shadow-lg border-2 border-slate-900 transition-all hover:scale-110 flex items-center justify-center cursor-pointer"
            title="Upload or Change Profile Photo"
            aria-label="Upload photo"
          >
            {isUploadingPhoto ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Camera className="w-4 h-4" />
            )}
          </button>

          {/* Hidden File Input (Gallery & Camera supported) */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handlePhotoSelect}
            className="hidden"
          />
        </div>

        {/* User Identity Details */}
        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {name || user?.name || 'Customer Profile'}
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 w-fit mx-auto sm:mx-0">
              <ShieldCheck className="w-3 h-3" /> Verified Customer
            </span>
          </div>

          <p className="text-xs text-slate-300 font-medium">{email || user?.email}</p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-[11px] text-slate-400">
            {user?.createdAt && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-brand-400" />
                Member since {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
              </span>
            )}
            {city && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-400" />
                {city}, Pakistan
              </span>
            )}
          </div>

          {avatar && (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="text-[11px] font-bold text-red-400 hover:text-red-300 hover:underline flex items-center gap-1 mx-auto sm:mx-0"
              >
                <Trash2 className="w-3 h-3" /> Remove profile picture
              </button>
            </div>
          )}
        </div>
      </div>

      {photoError && (
        <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs font-bold rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{photoError}</span>
        </div>
      )}

      {/* Main Profile Edit Form */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-white">
              Personal Information & Settings
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
              Update your personal credentials, contact phone, and delivery preferences
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-2xl flex items-center gap-2.5 animate-in fade-in duration-200">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Profile changes updated successfully! Your account information is saved.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1: Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-brand-600" /> Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Farhan Ali"
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-500 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-brand-600" /> Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-500 dark:text-white"
              />
            </div>
          </div>

          {/* Row 2: Phone Number & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-brand-600" /> Mobile Phone Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0300 1234567"
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-500 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-600" /> City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Lahore, Karachi, Islamabad"
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-500 dark:text-white"
              />
            </div>
          </div>

          {/* Row 3: Date of Birth & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-600" /> Date of Birth (Optional)
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-500 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Gender (Optional)
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-500 dark:text-white"
              >
                <option value="prefer_not_to_say">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Default Address Summary Box */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800 space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase text-gray-400 dark:text-slate-500 tracking-wider">
              Default Delivery Address
            </span>
            {user?.defaultAddress ? (
              <p className="text-xs font-semibold text-gray-800 dark:text-slate-200">
                {user.defaultAddress.address}, {user.defaultAddress.area}, {user.defaultAddress.city}
              </p>
            ) : (
              <p className="text-xs text-gray-500 dark:text-slate-400">
                No default address set yet. You can add one under the "Saved Addresses" tab.
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-7 py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
