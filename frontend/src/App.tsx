import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Loader from './components/ui/Loader';
import PrivateRoute from './components/routes/PrivateRoute';
import AdminRoute from './components/routes/AdminRoute';

// Lazy loaded pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const OrderHistoryPage = lazy(() => import('./pages/OrderHistoryPage'));
const OrderDetailsPage = lazy(() => import('./pages/OrderDetailsPage'));

// Admin Pages
const AdminDashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const AdminProductsPage = lazy(() => import('./pages/admin/ProductsPage'));
const AdminProductEditPage = lazy(() => import('./pages/admin/ProductEditPage'));
const AdminOrdersPage = lazy(() => import('./pages/admin/OrdersPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/UsersPage'));

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/search/:keyword" element={<HomePage />} />
            
            {/* Protected Routes */}
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
            <Route path="/payment" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
            <Route path="/order/success" element={<PrivateRoute><OrderSuccessPage /></PrivateRoute>} />
            <Route path="/orders" element={<PrivateRoute><OrderHistoryPage /></PrivateRoute>} />
            <Route path="/order/:id" element={<PrivateRoute><OrderDetailsPage /></PrivateRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />
            <Route path="/admin/product/:id/edit" element={<AdminRoute><AdminProductEditPage /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;