import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { CustomerInfoForm } from '../components/checkout/CustomerInfoForm';
import { PaymentMethodSelector } from '../components/checkout/PaymentMethodSelector';
import { OrderSummarySidebar } from '../components/checkout/OrderSummarySidebar';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { ShippingAddress, PaymentMethod } from '../types/order';
import { AlertCircle } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, summary, appliedCoupon, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { user, isLoggedIn } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<ShippingAddress>(() => ({
    fullName: user?.defaultAddress?.fullName || user?.name || '',
    phone: user?.defaultAddress?.phone || user?.phone || '',
    email: user?.defaultAddress?.email || user?.email || '',
    city: user?.defaultAddress?.city || 'Lahore',
    area: user?.defaultAddress?.area || '',
    address: user?.defaultAddress?.address || '',
    notes: '',
  }));

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

  // Require customer authentication for checkout
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isLoggedIn) {
      navigate('/auth', {
        replace: true,
        state: {
          from: '/checkout',
          message: 'Please login or create an account to continue with your order.',
        },
      });
      return;
    }
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, isLoggedIn, navigate]);

  // Sync customer user address if populated after mount
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.defaultAddress?.fullName || user.name || '',
        phone: prev.phone || user.defaultAddress?.phone || user.phone || '',
        email: prev.email || user.defaultAddress?.email || user.email || '',
        city: prev.city || user.defaultAddress?.city || 'Lahore',
        area: prev.area || user.defaultAddress?.area || '',
        address: prev.address || user.defaultAddress?.address || '',
      }));
    }
  }, [user]);

  const handleFormChange = (field: keyof ShippingAddress, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async () => {
    setErrorMessage(null);

    // Validation
    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Please enter a valid phone number.');
      return;
    }
    if (!formData.area.trim() || !formData.address.trim()) {
      setErrorMessage('Please enter your complete delivery area and street address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const created = await createOrder(
        cart,
        formData,
        paymentMethod,
        {
          subtotal: summary.subtotal,
          couponDiscount: summary.couponDiscount,
          shippingFee: summary.shippingFee,
          total: summary.total,
        },
        appliedCoupon
      );

      clearCart();
      setIsSubmitting(false);
      navigate(`/order-confirmation/${created.id}`);
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage('Failed to create order. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <Breadcrumb items={[{ label: 'Cart', link: '/cart' }, { label: 'Checkout' }]} />

      <div className="border-b border-gray-100 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Checkout & Shipping Details
        </h1>
        <p className="text-xs text-gray-500 font-medium mt-1">
          Complete your customer delivery address and payment method
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Delivery Info Form */}
          <CustomerInfoForm formData={formData} onChange={handleFormChange} />

          {/* Payment Method Selector */}
          <PaymentMethodSelector selectedMethod={paymentMethod} onSelect={setPaymentMethod} />
        </div>

        {/* Sidebar Summary & CTA */}
        <OrderSummarySidebar onPlaceOrder={handlePlaceOrder} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};
