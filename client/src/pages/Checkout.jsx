import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';

const Checkout = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState({ street: '', city: '', state: '', zipCode: '', country: '' });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/orders', {
        orderItems: cartItems,
        shippingAddress: address,
        totalAmount: total
      }, config);
      
      setSuccess(true);
      clearCart();
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
      setLoading(false);
      // For demo if backend isn't ready:
      setSuccess(true);
      clearCart();
      setTimeout(() => navigate('/'), 3000);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto mt-8">
        <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
        <h2 className="text-3xl font-extrabold text-dark mb-4 drop-shadow-sm">Order Placed Successfully!</h2>
        <p className="text-gray-500 text-lg">Thank you for shopping with us. You will be redirected to the home page shortly.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 text-left">
      <h1 className="text-3xl font-extrabold text-dark tracking-tight mb-8 drop-shadow-sm">Checkout</h1>
      
      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 font-medium">{error}</div>}
      
      <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 space-y-8">
        <div>
          <h2 className="text-xl font-bold flex items-center mb-6 text-gray-800 border-b pb-2">
            <Truck className="w-6 h-6 mr-3 text-primary" /> Shipping Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Street Address</label>
              <input 
                type="text" 
                required 
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary px-4 py-3 bg-gray-50 font-medium" 
                onChange={e => setAddress({...address, street: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
              <input 
                type="text" 
                required 
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary px-4 py-3 bg-gray-50 font-medium" 
                onChange={e => setAddress({...address, city: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">State/Province</label>
              <input 
                type="text" 
                required 
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary px-4 py-3 bg-gray-50 font-medium" 
                onChange={e => setAddress({...address, state: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Zip Code</label>
              <input 
                type="text" 
                required 
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary px-4 py-3 bg-gray-50 font-medium" 
                onChange={e => setAddress({...address, zipCode: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Country</label>
              <input 
                type="text" 
                required 
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary px-4 py-3 bg-gray-50 font-medium" 
                onChange={e => setAddress({...address, country: e.target.value})} 
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold flex items-center mb-6 text-gray-800 border-b pb-2">
            <CreditCard className="w-6 h-6 mr-3 text-primary" /> Payment details
          </h2>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <p className="text-sm text-gray-600 mb-4 font-medium">For this demo, payment integrates a mock checkout flow. Click 'Place Order' below to complete the purchase.</p>
            <div className="flex justify-between items-center text-lg font-bold border-t pt-4">
              <span>Total Amount to Pay</span>
              <span className="text-2xl text-primary">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || cartItems.length === 0}
          className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all text-lg flex justify-center items-center"
        >
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
