import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DEMO_CUSTOMER_EMAIL, DEMO_CUSTOMER_PASS } from '../services/authService';
import {
  ArrowRight,
  Lock,
  User,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';

export const AuthPage: React.FC = () => {
  const { login, register, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Return destination if redirected from a protected page or checkout
  const stateFrom = (location.state as any)?.from || '/account';
  const stateMessage = (location.state as any)?.message;

  // If customer is already authenticated, redirect to destination
  useEffect(() => {
    if (isLoggedIn) {
      navigate(stateFrom, { replace: true });
    }
  }, [isLoggedIn, navigate, stateFrom]);

  const handleQuickDemoLogin = () => {
    setEmail(DEMO_CUSTOMER_EMAIL);
    setPassword(DEMO_CUSTOMER_PASS);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (mode === 'login') {
      if (!password) {
        setErrorMsg('Please enter your password.');
        return;
      }

      setIsSubmitting(true);
      const res = await login(email.trim(), password);
      setIsSubmitting(false);

      if (res.success) {
        navigate(stateFrom, { replace: true });
      } else {
        setErrorMsg(res.error || 'Invalid email or password.');
      }
    } else if (mode === 'register') {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (!phone.trim() || phone.trim().length < 8) {
        setErrorMsg('Please enter a valid mobile phone number.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Password and confirm password do not match.');
        return;
      }

      setIsSubmitting(true);
      const res = await register(name.trim(), email.trim(), phone.trim(), password);
      setIsSubmitting(false);

      if (res.success) {
        navigate(stateFrom, { replace: true });
      } else {
        setErrorMsg(res.error || 'Registration failed. Please try again.');
      }
    } else if (mode === 'forgot') {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setResetSuccess(true);
      }, 500);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-3 sm:px-6 py-6 sm:py-12">
      <SEOHead
        title={mode === 'login' ? 'Customer Sign In | ApnaMart' : 'Create Account | ApnaMart'}
        description="Sign in or register for your ApnaMart customer account to manage orders, addresses, and wishlist."
        canonicalUrl="https://apnamart.space/auth"
      />

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group mb-1">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white flex items-center justify-center font-extrabold text-2xl shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
              A
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Apna<span className="text-brand-600 dark:text-cyan-400">Mart</span>
            </span>
          </Link>

          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {mode === 'login' && 'Sign In to Your Account'}
            {mode === 'register' && 'Create Customer Account'}
            {mode === 'forgot' && 'Reset Your Password'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {mode === 'login' && 'Access saved orders, delivery tracking, and fast checkout'}
            {mode === 'register' && 'Create a verified customer profile for instant orders'}
            {mode === 'forgot' && 'Enter your email to receive password recovery guidance'}
          </p>
        </div>

        {/* Redirect Notice Banner if redirected from checkout or account */}
        {stateMessage && (
          <div className="p-3.5 bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 text-brand-800 dark:text-cyan-300 text-xs font-bold rounded-2xl flex items-center gap-2.5 shadow-2xs">
            <ShieldCheck className="w-5 h-5 flex-shrink-0 text-brand-600 dark:text-cyan-400" />
            <span>{stateMessage}</span>
          </div>
        )}

        {/* Mode Toggle Switch */}
        {mode !== 'forgot' && (
          <div className="flex rounded-2xl bg-gray-100 dark:bg-slate-800 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2.5 rounded-xl transition-all text-center ${
                mode === 'login'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-extrabold'
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2.5 rounded-xl transition-all text-center ${
                mode === 'register'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-extrabold'
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
              }`}
            >
              Register New Account
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs font-bold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Forgot Password Success Alert */}
        {resetSuccess && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-2xl flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            <span>If an account matches that email, a password recovery link has been sent!</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Farhan Ali"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-brand-500"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-brand-500"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="0300 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-brand-500"
                />
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          )}

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
                  Password *
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMsg(null);
                    }}
                    className="text-[11px] font-bold text-brand-600 dark:text-cyan-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-brand-500"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter password to match"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-brand-500"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:scale-[1.01]"
          >
            <span>
              {isSubmitting
                ? 'Processing...'
                : mode === 'login'
                ? 'Sign In to ApnaMart'
                : mode === 'register'
                ? 'Create Customer Account'
                : 'Send Recovery Email'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Credentials Helper for Testers */}
        {mode === 'login' && (
          <div className="pt-2 border-t border-gray-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2 px-3 bg-brand-50/60 dark:bg-slate-800/80 hover:bg-brand-100/60 dark:hover:bg-slate-800 text-brand-700 dark:text-cyan-300 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors border border-brand-100 dark:border-slate-700"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-cyan-400" />
              <span>Fill Demo Customer Credentials ({DEMO_CUSTOMER_EMAIL})</span>
            </button>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="text-center pt-2 border-t border-gray-100 dark:border-slate-800 text-xs text-gray-500 dark:text-gray-400 font-medium">
          {mode === 'login' && (
            <p>
              New to ApnaMart?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg(null);
                }}
                className="font-extrabold text-brand-600 dark:text-cyan-400 hover:underline"
              >
                Create Account
              </button>
            </p>
          )}
          {mode === 'register' && (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                }}
                className="font-extrabold text-brand-600 dark:text-cyan-400 hover:underline"
              >
                Sign In Instead
              </button>
            </p>
          )}
          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
                setResetSuccess(false);
              }}
              className="font-extrabold text-brand-600 dark:text-cyan-400 hover:underline"
            >
              ← Back to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
