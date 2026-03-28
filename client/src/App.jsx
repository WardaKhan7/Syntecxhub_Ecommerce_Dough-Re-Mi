import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import Products from './pages/Products';
import Favorites from './pages/Favorites';
import OrderHistory from './pages/OrderHistory';
import { About, Contact, PolicyPage, Blogs, Locations, OrderInfo } from './pages/InfoPages';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'react-hot-toast';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = React.useState('verifying');
  React.useEffect(() => {
    axios.get(`/api/auth/verify/${token}`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {status === 'verifying' && <p className="text-gray-400 font-bold uppercase tracking-widest">Verifying your email...</p>}
      {status === 'success' && (
        <>
          <h2 className="text-3xl font-black text-primary mb-4">Email Verified! 🎉</h2>
          <p className="text-gray-500 mb-8 font-bold">Your account is now active. You can log in.</p>
          <a href="/login" className="bg-primary text-white font-black px-10 py-4 rounded-2xl uppercase tracking-widest text-sm">Go to Login</a>
        </>
      )}
      {status === 'error' && (
        <>
          <h2 className="text-3xl font-black text-red-700 mb-4">Invalid Link</h2>
          <p className="text-gray-500 mb-8 font-bold">This verification link is invalid or has expired.</p>
          <a href="/register" className="bg-primary text-white font-black px-10 py-4 rounded-2xl uppercase tracking-widest text-sm">Register Again</a>
        </>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <div className="flex flex-col min-h-screen bg-light overflow-x-hidden w-full max-w-[100vw]">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/category/:category" element={<Products />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/blogs" element={<Blogs />} />
                  <Route path="/locations" element={<Locations />} />
                  <Route path="/order-info" element={<OrderInfo />} />
                  <Route path="/verify/:token" element={<VerifyEmail />} />
                  <Route path="/orders" element={<OrderHistory />} />
                  <Route path="/refund-policy" element={<PolicyPage title="Refund Policy" lastUpdated="March 2024" content="<h2>Our Refund Commitment</h2><p>At Dough-Re-Mi, we take pride in our treats. If you are not satisfied with your order due to quality issues or damage during delivery, please contact us within 2 hours of receipt.</p><h3>Process</h3><ul><li>Provide photos of the issue.</li><li>We will investigate and offer a replacement or a full/partial refund based on the situation.</li></ul>" />} />
                  <Route path="/privacy-policy" element={<PolicyPage title="Privacy Policy" lastUpdated="March 2024" content="<h2>Your Data Matters</h2><p>We collect information only to process your orders and provide a better shopping experience. We never sell your personal data to third parties.</p><h3>Information We Collect</h3><ul><li>Name and contact details for delivery.</li><li>Order history for personalized recommendations.</li></ul>" />} />
                  <Route path="/terms" element={<PolicyPage title="Terms of Service" lastUpdated="March 2024" content="<h2>Usage Terms</h2><p>By using Dough-Re-Mi, you agree to provide accurate information and follow our ordering guidelines. All content on this site is property of Dough-Re-Mi Bakery.</p>" />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
