import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// Customer Context Providers
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import { FilterProvider } from './context/FilterContext';
import { ThemeProvider } from './context/ThemeContext';

// Admin Context Providers
import { AdminAuthProvider } from './context/AdminAuthContext';
import { AdminDataProvider } from './context/AdminDataContext';
import { NotificationProvider } from './context/NotificationContext';

// Customer Layout Components
import { TopBar } from './components/layout/TopBar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';
import { FloatingWhatsApp } from './components/layout/FloatingWhatsApp';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { WishlistPage } from './pages/WishlistPage';
import { AccountPage } from './pages/AccountPage';
import { AuthPage } from './pages/AuthPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';
import { StaticPage } from './pages/StaticPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProtectedCustomerRoute } from './components/common/ProtectedCustomerRoute';

// Admin Layout & Protected Route Components
import { AdminLayout } from './components/admin/layout/AdminLayout';
import { ProtectedAdminRoute } from './components/admin/layout/ProtectedAdminRoute';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminProductEditPage } from './pages/admin/AdminProductEditPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminInventoryPage } from './pages/admin/AdminInventoryPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminCouponsPage } from './pages/admin/AdminCouponsPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminCmsPage } from './pages/admin/AdminCmsPage';
import { AdminBannersPage } from './pages/admin/AdminBannersPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminNotificationsPage } from './pages/admin/AdminNotificationsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminRolesPage } from './pages/admin/AdminRolesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Customer Storefront Wrapper Layout
const CustomerLayout: React.FC = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
      <TopBar />
      <Header onOpenMobileMenu={() => setIsMobileNavOpen(true)} />
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
      <main className="flex-1 pb-16 sm:pb-20 lg:pb-0">
        <Outlet />
      </main>
      <FloatingWhatsApp />
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AdminAuthProvider>
        <AdminDataProvider>
          <NotificationProvider>
            <AuthProvider>
              <OrderProvider>
                <WishlistProvider>
                  <CartProvider>
                    <FilterProvider>
                    <Router>
                      <Routes>
                        {/* =================================================== */}
                        {/* ADMIN PANEL ROUTES (/admin/*)                       */}
                        {/* =================================================== */}
                        <Route path="/admin/login" element={<AdminLoginPage />} />

                        <Route
                          path="/admin"
                          element={
                            <ProtectedAdminRoute>
                              <AdminLayout>
                                <AdminDashboardPage />
                              </AdminLayout>
                            </ProtectedAdminRoute>
                          }
                        />
                        <Route
                          path="/admin/products"
                          element={
                            <ProtectedAdminRoute requiredPermission="manage_products">
                              <AdminLayout>
                                <AdminProductsPage />
                              </AdminLayout>
                            </ProtectedAdminRoute>
                          }
                        />
                        <Route
                          path="/admin/products/new"
                          element={
                            <ProtectedAdminRoute requiredPermission="manage_products">
                              <AdminLayout>
                                <AdminProductEditPage />
                              </AdminLayout>
                            </ProtectedAdminRoute>
                          }
                        />
                        <Route
                          path="/admin/products/edit/:id"
                          element={
                            <ProtectedAdminRoute requiredPermission="manage_products">
                              <AdminLayout>
                                <AdminProductEditPage />
                              </AdminLayout>
                            </ProtectedAdminRoute>
                          }
                        />
                        <Route
                          path="/admin/categories"
                          element={
                            <ProtectedAdminRoute requiredPermission="manage_categories">
                              <AdminLayout>
                                <AdminCategoriesPage />
                              </AdminLayout>
                            </ProtectedAdminRoute>
                          }
                        />
                        <Route
                          path="/admin/inventory"
                          element={
                            <ProtectedAdminRoute requiredPermission="manage_inventory">
                              <AdminLayout>
                                <AdminInventoryPage />
                              </AdminLayout>
                            </ProtectedAdminRoute>
                          }
                        />
                        <Route
                          path="/admin/orders"
                          element={
                            <ProtectedAdminRoute requiredPermission="manage_orders">
                              <AdminLayout>
                                <AdminOrdersPage />
                              </AdminLayout>
                            </ProtectedAdminRoute>
                          }
                        />
                        <Route
                          path="/admin/customers"
                          element={
                            <ProtectedAdminRoute requiredPermission="manage_customers">
                              <AdminLayout>
                                <AdminCustomersPage />
                              </AdminLayout>
                            </ProtectedAdminRoute>
                          }
                        />
                        <Route
                          path="/admin/coupons"
                          element={
                            <ProtectedAdminRoute requiredPermission="manage_coupons">
                              <AdminLayout>
                                <AdminCouponsPage />
                              </AdminLayout>
                            </ProtectedAdminRoute>
                          }
                        />
                        <Route
                          path="/admin/reviews"
                          element={
                            <ProtectedAdminRoute requiredPermission="manage_reviews">
                              <AdminLayout>
                                <AdminReviewsPage />
                              </AdminLayout>
                            </ProtectedAdminRoute>
                          }
                        />
                        <Route
                          path="/admin/cms"
                          element={
                            <ProtectedAdminRoute requiredPermission="manage_cms">
                              <AdminLayout>
                                <AdminCmsPage />
                              </AdminLayout>
                            </ProtectedAdminRoute>
                          }
                        />
                        <Route
                          path="/admin/banners"
                          element={
                            <ProtectedAdminRoute requiredPermission="manage_cms">
                              <AdminLayout>
                                <AdminBannersPage />
                              </AdminLayout>
                            </ProtectedAdminRoute>
                          }
                        />
                        <Route
                          path="/admin/analytics"
                          element={
                            <ProtectedAdminRoute requiredPermission="view_analytics">
                              <AdminLayout>
                                <AdminAnalyticsPage />
                              </AdminLayout>
                            </ProtectedAdminRoute>
                          }
                        />
                        <Route
                          path="/admin/reports"
                          element={
                            <ProtectedAdminRoute requiredPermission="view_analytics">
                              <AdminLayout>
                                <AdminReportsPage />
                              </AdminLayout>
                            </ProtectedAdminRoute>
                          }
                        />
                        <Route
                          path="/admin/notifications"
                          element={
                            <ProtectedAdminRoute>
                              <AdminLayout>
                                <AdminNotificationsPage />
                              </AdminLayout>
                            </ProtectedAdminRoute>
                          }
                        />
                        <Route
                          path="/admin/users"
                          element={
                            <ProtectedAdminRoute requiredPermission="manage_admin_users">
                              <AdminLayout>
                                <AdminUsersPage />
                              </AdminLayout>
                            </ProtectedAdminRoute>
                          }
                        />
                        <Route
                          path="/admin/roles"
                          element={
                            <ProtectedAdminRoute requiredPermission="manage_roles">
                              <AdminLayout>
                                <AdminRolesPage />
                              </AdminLayout>
                            </ProtectedAdminRoute>
                          }
                        />
                        <Route
                          path="/admin/settings"
                          element={
                            <ProtectedAdminRoute requiredPermission="manage_settings">
                              <AdminLayout>
                                <AdminSettingsPage />
                              </AdminLayout>
                            </ProtectedAdminRoute>
                          }
                        />

                        {/* =================================================== */}
                        {/* CUSTOMER-FACING STOREFRONT ROUTES                   */}
                        {/* =================================================== */}
                        <Route path="/" element={<CustomerLayout />}>
                          <Route index element={<HomePage />} />
                          <Route path="shop" element={<ShopPage />} />
                          <Route path="categories" element={<CategoriesPage />} />
                          <Route path="category/:categorySlug" element={<CategoryPage />} />
                          <Route path="product/:productSlug" element={<ProductDetailPage />} />
                          <Route path="cart" element={<CartPage />} />
                          <Route path="checkout" element={<CheckoutPage />} />
                          <Route path="order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                          <Route path="track-order" element={<OrderTrackingPage />} />
                          <Route path="wishlist" element={<WishlistPage />} />
                          <Route
                            path="account"
                            element={
                              <ProtectedCustomerRoute>
                                <AccountPage />
                              </ProtectedCustomerRoute>
                            }
                          />
                          <Route path="auth" element={<AuthPage />} />
                          <Route path="faq" element={<FAQPage />} />
                          <Route path="contact" element={<ContactPage />} />

                          <Route
                            path="about"
                            element={
                              <StaticPage
                                title="About ApnaMart"
                                subtitle="Redefining E-Commerce Shopping in Pakistan"
                                content={
                                  <p>
                                    ApnaMart is Pakistan's premier modern e-commerce platform, engineered to deliver an effortless, reliable, and swift online shopping experience.
                                  </p>
                                }
                              />
                            }
                          />
                          <Route
                            path="privacy-policy"
                            element={
                              <StaticPage
                                title="Privacy Policy"
                                subtitle="How we collect, protect, and handle your data"
                                content={<p>At ApnaMart, your privacy is our top priority.</p>}
                              />
                            }
                          />
                          <Route
                            path="terms-conditions"
                            element={
                              <StaticPage
                                title="Terms & Conditions"
                                subtitle="General customer service terms and conditions"
                                content={<p>By placing an order on ApnaMart, you agree to comply with our terms of service.</p>}
                              />
                            }
                          />
                          <Route
                            path="return-policy"
                            element={
                              <StaticPage
                                title="Return & Refund Policy"
                                subtitle="7-Day Hassle-Free Return Guarantee"
                                content={<p>We offer a 7-day hassle-free return policy for damaged, defective, or incorrect items.</p>}
                              />
                            }
                          />
                          <Route
                            path="shipping-policy"
                            element={
                              <StaticPage
                                title="Shipping Policy"
                                subtitle="Fast Nationwide Delivery Details"
                                content={<p>Orders placed before 3:00 PM are processed same-day across Pakistan.</p>}
                              />
                            }
                          />
                          <Route path="*" element={<NotFoundPage />} />
                        </Route>
                      </Routes>
                    </Router>
                  </FilterProvider>
                </CartProvider>
              </WishlistProvider>
            </OrderProvider>
          </AuthProvider>
        </NotificationProvider>
      </AdminDataProvider>
    </AdminAuthProvider>
    </ThemeProvider>
  );
};

export default App;
