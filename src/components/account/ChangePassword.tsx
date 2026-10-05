import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Toast } from '../common/Toast';
import { Lock, KeyRound, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ChangePassword: React.FC = () => {
  const { changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!currentPassword) {
      setErrorMessage('Current password is required.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirmation do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await changePassword(currentPassword, newPassword);
      setIsSubmitting(false);

      if (success) {
        setToastMessage('Password updated successfully! Secure hash saved.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setErrorMessage('Current password is incorrect. Please try again.');
      }
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage('Failed to update password. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
        <div className="p-3 rounded-2xl bg-brand-50 text-brand-600">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
            Security & Change Password
          </h2>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Update your account password with salted SHA-256 encryption
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-2xl">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Current Password *
          </label>
          <div className="relative">
            <input
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-brand-500"
            />
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            New Password *
          </label>
          <div className="relative">
            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-brand-500"
            />
            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Confirm New Password *
          </label>
          <div className="relative">
            <input
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-brand-500"
            />
            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all"
        >
          {isSubmitting ? 'Updating Password...' : 'Update Password Now'}
        </button>
      </form>

      {toastMessage && (
        <Toast
          message={toastMessage}
          isOpen={!!toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};
