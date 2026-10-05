import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { AdminRoleType } from '../../types/admin';

export const AdminLoginPage: React.FC = () => {
  const { loginAdmin, switchRoleForTesting } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@apexstore.pk');
  const [password, setPassword] = useState('adminpassword');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (loginAdmin(email, password)) {
      navigate('/admin');
    } else {
      setErrorMsg('Invalid admin credentials.');
    }
  };

  const handleQuickDemoLogin = (role: AdminRoleType) => {
    switchRoleForTesting(role);
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white flex items-center justify-center font-extrabold text-2xl mx-auto shadow-xl shadow-brand-500/30">
            A
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">ApexControl Admin Portal</h1>
          <p className="text-xs text-gray-500 font-medium">Secure sign in for store administrators & staff</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Admin Email / Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-brand-500"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-brand-500"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-gray-300"
              />
              <span>Remember login session</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <span>Sign In to Admin Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Quick Presets */}
        <div className="pt-4 border-t border-gray-100 space-y-2 text-center">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Demo Role Presets (Click to Test)
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickDemoLogin('Super Admin')}
              className="py-2 px-2 bg-slate-900 text-white text-[11px] font-bold rounded-xl hover:bg-brand-600 transition-colors"
            >
              Super Admin
            </button>
            <button
              onClick={() => handleQuickDemoLogin('Manager')}
              className="py-2 px-2 bg-slate-800 text-white text-[11px] font-bold rounded-xl hover:bg-brand-600 transition-colors"
            >
              Manager
            </button>
            <button
              onClick={() => handleQuickDemoLogin('Staff')}
              className="py-2 px-2 bg-slate-700 text-white text-[11px] font-bold rounded-xl hover:bg-brand-600 transition-colors"
            >
              Staff Role
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
