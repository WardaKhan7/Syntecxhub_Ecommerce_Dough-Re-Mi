import React, { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { CreditCard, Truck, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';

const Checkout = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (user && user.role === 'admin') {
    return <Navigate to="/admin" />;
  }

  const provinces = [
    'Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Islamabad Capital Territory', 'Azad Kashmir', 'Gilgit-Baltistan'
  ];

  const citiesByProvince = {
    'Punjab': ['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala', 'Sialkot', 'Bahawalpur', 'Sargodha', 'Sheikhupura', 'Rahim Yar Khan'],
    'Sindh': ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah', 'Mirpur Khas'],
    'Khyber Pakhtunkhwa': ['Peshawar', 'Abbottabad', 'Mardan', 'Mingora', 'Kohat', 'Dera Ismail Khan'],
    'Balochistan': ['Quetta', 'Turbat', 'Khuzdar', 'Chaman', 'Gwadar'],
    'Islamabad Capital Territory': ['Islamabad'],
    'Azad Kashmir': ['Muzaffarabad', 'Mirpur', 'Rawalakot'],
    'Gilgit-Baltistan': ['Gilgit', 'Skardu']
  };

  const [address, setAddress] = useState({ street: '', city: '', province: '', zipCode: '', country: 'Pakistan' });
  const [paymentMethod, setPaymentMethod] = useState('Card'); // 'Card', 'EasyPaisa', 'JazzCash', 'COD'
  const [payment, setPayment] = useState({ cardNumber: '', expiry: '', cvv: '', nameOnCard: '', mobileNumber: '' });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryCharges = 250;
  const total = subtotal + deliveryCharges;

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      const formatted = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').substring(0, 19);
      setPayment({ ...payment, [name]: formatted });
    } else if (name === 'expiry') {
      const formatted = value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1/').substring(0, 5);
      setPayment({ ...payment, [name]: formatted });
    } else if (name === 'cvv') {
      const formatted = value.replace(/\D/g, '').substring(0, 3);
      setPayment({ ...payment, [name]: formatted });
    } else if (name === 'mobileNumber') {
      const formatted = value.replace(/\D/g, '').substring(0, 11);
      setPayment({ ...payment, [name]: formatted });
    } else {
      setPayment({ ...payment, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Address Validation
    if (!address.province || !address.city) {
      setError('Please select your Province and City');
      return;
    }

    // Payment Validation
    if (paymentMethod === 'Card') {
      if (payment.cardNumber.replace(/\s/g, '').length !== 16) {
        setError('Please enter a valid 16-digit card number');
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(payment.expiry)) {
        setError('Please enter a valid expiry date (MM/YY)');
        return;
      }
      if (payment.cvv.length !== 3) {
        setError('Please enter a valid 3-digit CVV');
        return;
      }
    } else if (paymentMethod === 'EasyPaisa' || paymentMethod === 'JazzCash') {
      if (payment.mobileNumber.length !== 11 || !payment.mobileNumber.startsWith('03')) {
        setError(`Please enter a valid 11-digit ${paymentMethod} mobile number starting with 03`);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/orders', {
        orderItems: cartItems,
        shippingAddress: address,
        totalAmount: total,
        paymentDetails: {
          method: paymentMethod,
          lastFour: paymentMethod === 'Card' ? payment.cardNumber.slice(-4) : null,
          mobileNumber: (paymentMethod === 'EasyPaisa' || paymentMethod === 'JazzCash') ? payment.mobileNumber : null
        }
      }, config);
      
      setSuccess(true);
      clearCart();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-32 pb-24 md:pb-32 bg-white dark:bg-[#290000] rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-600 max-w-2xl mx-auto mt-12 mb-16 md:mb-24 animate-scale-in">
        <div className="bg-green-50 dark:bg-green-500/20 p-10 rounded-full mb-10 ring-8 ring-green-100/50 dark:ring-green-500/30">
          <CheckCircle className="w-20 h-20 text-green-500" />
        </div>
        <h2 className="text-4xl font-black text-primary dark:text-white mb-4 tracking-tight">Order Placed!</h2>
        <p className="text-red-700 dark:text-gray-300 text-lg max-w-sm text-center font-bold mb-10">Your sweet treats are being prepared. Thank you for your order!</p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          <button 
            onClick={() => navigate('/orders')}
            className="flex-1 bg-primary hover:bg-[#2D0A0A] text-white font-black py-4 px-8 rounded-2xl shadow-2xl shadow-primary/30 transition-all uppercase tracking-widest text-sm"
          >
            View Your Order
          </button>
          <button 
            onClick={() => navigate('/')}
            className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-800 text-red-900 dark:text-white font-black py-4 px-8 rounded-2xl transition-all uppercase tracking-widest text-sm"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 md:py-12 text-left animate-fade-in px-4">
      <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-primary tracking-tighter mb-6 md:mb-12">Checkout</h1>
      
      {error && <div className="bg-red-50 text-red-600 p-6 rounded-[1.5rem] mb-8 md:mb-12 text-[10px] md:text-sm font-black border border-red-100 uppercase tracking-widest">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12">
        <div className="bg-white p-6 md:p-14 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-gray-50">
          <h2 className="text-xl md:text-2xl font-black flex items-center mb-8 md:mb-10 text-dark tracking-tight">
            <Truck className="w-6 h-6 md:w-8 md:h-8 mr-4 text-primary" /> Delivery Destination
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="md:col-span-2">
              <label className="block text-[8px] md:text-[10px] font-black text-red-800 uppercase tracking-widest mb-2 ml-1">Street Address</label>
              <input 
                type="text" 
                required 
                placeholder="Where should we deliver?"
                className="w-full bg-[#FFF8F0] border-transparent rounded-[1.2rem] md:rounded-[1.5rem] focus:ring-4 focus:ring-primary/10 focus:bg-white focus:border-primary/20 transition-all font-bold text-dark px-5 md:px-6 py-3 md:py-4 shadow-sm text-sm md:text-base" 
                onChange={e => setAddress({...address, street: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-[8px] md:text-[10px] font-black text-red-800 uppercase tracking-widest mb-2 ml-1">Province</label>
              <select 
                required
                className="w-full bg-[#FFF8F0] dark:bg-white/5 border-transparent rounded-[1.2rem] md:rounded-[1.5rem] focus:ring-4 focus:ring-primary/10 focus:bg-white dark:focus:bg-white/10 focus:border-primary/20 transition-all font-bold text-dark px-5 md:px-6 py-3 md:py-4 shadow-sm text-sm md:text-base appearance-none transition-colors duration-500"
                value={address.province}
                onChange={e => setAddress({...address, province: e.target.value, city: ''})}
              >
                <option value="">Select Province</option>
                {provinces.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[8px] md:text-[10px] font-black text-red-800 uppercase tracking-widest mb-2 ml-1">City</label>
              <select 
                required
                disabled={!address.province}
                className="w-full bg-[#FFF8F0] dark:bg-white/5 border-transparent rounded-[1.2rem] md:rounded-[1.5rem] focus:ring-4 focus:ring-primary/10 focus:bg-white dark:focus:bg-white/10 focus:border-primary/20 transition-all font-bold text-dark px-5 md:px-6 py-3 md:py-4 shadow-sm text-sm md:text-base appearance-none disabled:opacity-50 transition-colors duration-500"
                value={address.city}
                onChange={e => setAddress({...address, city: e.target.value})}
              >
                <option value="">Select City</option>
                {address.province && citiesByProvince[address.province].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[8px] md:text-[10px] font-black text-red-800 uppercase tracking-widest mb-2 ml-1">Zip Code</label>
              <input 
                type="text" 
                required 
                placeholder="Zip Code"
                className="w-full bg-[#FFF8F0] border-transparent rounded-[1.2rem] md:rounded-[1.5rem] focus:ring-4 focus:ring-primary/10 focus:bg-white focus:border-primary/20 transition-all font-bold text-dark px-5 md:px-6 py-3 md:py-4 shadow-sm text-sm md:text-base" 
                onChange={e => setAddress({...address, zipCode: e.target.value})} 
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 md:p-14 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-gray-50">
          <h2 className="text-xl md:text-2xl font-black flex items-center mb-8 md:mb-10 text-dark tracking-tight">
            <CreditCard className="w-6 h-6 md:w-8 md:h-8 mr-4 text-primary" /> Payment details
          </h2>
          <div className="space-y-6 md:space-y-8">
            <div className="flex flex-wrap gap-3 md:gap-4">
              {['Card', 'EasyPaisa', 'JazzCash', 'COD'].map(method => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`px-6 py-3 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${paymentMethod === method ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-light dark:bg-white/5 text-dark/40 hover:bg-gray-200 dark:hover:bg-white/10'}`}
                >
                  {method === 'COD' ? 'Cash on Delivery' : method}
                </button>
              ))}
            </div>

            <div className="flex items-center text-[8px] md:text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 w-fit px-3 md:px-4 py-2 rounded-full border border-primary/10">
              <ShieldCheck className="w-3 h-3 md:w-4 md:h-4 mr-2" /> 
              {paymentMethod === 'COD' ? 'Pay upon delivery' : `Secured by Dough-Re-Mi Pay`}
            </div>

            {paymentMethod === 'Card' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 animate-fade-in">
                <div className="md:col-span-2">
                  <label className="block text-[8px] md:text-[10px] font-black text-red-800 uppercase tracking-widest mb-2 ml-1">Name on Card</label>
                  <input 
                    type="text" 
                    name="nameOnCard"
                    required 
                    placeholder="Cardholder Name"
                    className="w-full bg-[#FFF8F0] border-transparent rounded-[1.2rem] md:rounded-[1.5rem] focus:ring-4 focus:ring-primary/10 focus:bg-white focus:border-primary/20 transition-all font-bold text-dark px-5 md:px-6 py-3 md:py-4 shadow-sm text-sm md:text-base uppercase" 
                    value={payment.nameOnCard}
                    onChange={handlePaymentChange} 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[8px] md:text-[10px] font-black text-red-800 uppercase tracking-widest mb-2 ml-1">Card Number</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      name="cardNumber"
                      required 
                      placeholder="0000 0000 0000 0000"
                      className="w-full bg-[#FFF8F0] border-transparent rounded-[1.2rem] md:rounded-[1.5rem] focus:ring-4 focus:ring-primary/10 focus:bg-white focus:border-primary/20 transition-all font-bold text-dark px-5 md:px-6 py-3 md:py-4 shadow-sm text-sm md:text-base tracking-[0.2em]" 
                      value={payment.cardNumber}
                      onChange={handlePaymentChange} 
                    />
                    <CreditCard className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                  </div>
                </div>
                <div>
                  <label className="block text-[8px] md:text-[10px] font-black text-red-800 uppercase tracking-widest mb-2 ml-1">Expiry Date</label>
                  <input 
                    type="text" 
                    name="expiry"
                    required 
                    placeholder="MM/YY"
                    className="w-full bg-[#FFF8F0] border-transparent rounded-[1.2rem] md:rounded-[1.5rem] focus:ring-4 focus:ring-primary/10 focus:bg-white focus:border-primary/20 transition-all font-bold text-dark px-5 md:px-6 py-3 md:py-4 shadow-sm text-sm md:text-base" 
                    value={payment.expiry}
                    onChange={handlePaymentChange} 
                  />
                </div>
                <div>
                  <label className="block text-[8px] md:text-[10px] font-black text-red-800 uppercase tracking-widest mb-2 ml-1">CVV</label>
                  <input 
                    type="password" 
                    name="cvv"
                    required 
                    placeholder="***"
                    className="w-full bg-[#FFF8F0] border-transparent rounded-[1.2rem] md:rounded-[1.5rem] focus:ring-4 focus:ring-primary/10 focus:bg-white focus:border-primary/20 transition-all font-bold text-dark px-5 md:px-6 py-3 md:py-4 shadow-sm text-sm md:text-base" 
                    value={payment.cvv}
                    onChange={handlePaymentChange} 
                  />
                </div>
              </div>
            )}

            {(paymentMethod === 'EasyPaisa' || paymentMethod === 'JazzCash') && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <label className="block text-[8px] md:text-[10px] font-black text-red-800 uppercase tracking-widest mb-2 ml-1">{paymentMethod} Mobile Number</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      name="mobileNumber"
                      required 
                      placeholder="03XX XXXXXXX"
                      className="w-full bg-[#FFF8F0] border-transparent rounded-[1.2rem] md:rounded-[1.5rem] focus:ring-4 focus:ring-primary/10 focus:bg-white focus:border-primary/20 transition-all font-bold text-dark px-5 md:px-6 py-3 md:py-4 shadow-sm text-sm md:text-base tracking-widest" 
                      value={payment.mobileNumber}
                      onChange={handlePaymentChange} 
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-primary text-xs uppercase">{paymentMethod}</div>
                  </div>
                </div>
                <p className="text-[10px] font-bold text-red-700 dark:text-gray-400 leading-relaxed uppercase tracking-tight">
                  Please ensure your {paymentMethod} account is active and has sufficient balance. You will receive a prompt on your phone to authorize the payment.
                </p>
              </div>
            )}

            {paymentMethod === 'COD' && (
              <div className="bg-light p-6 rounded-2xl border border-primary/10 animate-fade-in">
                <p className="text-sm font-bold text-dark leading-relaxed">
                  You have selected <span className="text-primary font-black">Cash on Delivery</span>. Please keep the exact amount ready when our delivery partner arrives.
                </p>
              </div>
            )}

            <div className="border-t border-gray-50 pt-6 md:pt-8 space-y-4">
              <div className="flex justify-between text-[10px] md:text-xs font-bold text-red-800 uppercase tracking-widest">
                <span>Subtotal</span>
                <span>PKR {subtotal}</span>
              </div>
              <div className="flex justify-between text-[10px] md:text-xs font-bold text-red-800 uppercase tracking-widest">
                <span>Delivery Charges</span>
                <span className="text-primary">PKR {deliveryCharges}</span>
              </div>
              <div className="flex justify-between items-end pt-2">
                <span className="text-[10px] md:text-xs font-black text-red-800 dark:text-white tracking-widest uppercase mb-1">Total to Pay</span>
                <span className="text-3xl md:text-5xl font-black text-primary dark:text-white tracking-tighter">PKR {total}</span>
              </div>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || cartItems.length === 0}
          className="w-full bg-primary hover:bg-[#2D0A0A] text-white font-black py-5 md:py-6 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl shadow-primary/30 transition-all transform active:scale-95 text-[10px] md:text-sm uppercase tracking-[0.2em] flex justify-center items-center"
        >
          {loading ? 'Processing...' : (
            <>Finalize Purchase <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-3" /></>
          )}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
