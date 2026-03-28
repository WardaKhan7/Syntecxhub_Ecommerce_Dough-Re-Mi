import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, totalItems } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  if (user && user.role === 'admin') {
    return <Navigate to="/admin" />;
  }

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] shadow-2xl border border-gray-100 max-w-4xl mx-auto mt-12 mb-16 md:mb-24 animate-fade-in">
        <div className="p-10 rounded-full mb-10 ring-8 dark:ring-gray-600" style={{backgroundColor: isDark ? '#1c0000' : '#FFF8F0'}}>
          <ShoppingBag className="w-20 h-20" style={{color: isDark ? '#ffffff' : '#800000'}} />
        </div>
        <h2 className="text-4xl font-black mb-4 tracking-tight" style={{color: isDark ? '#ffffff' : '#7f1d1d'}}>Your Cart is Empty</h2>
        <p className="mb-10 max-w-sm text-center font-bold" style={{color: isDark ? '#d1d5db' : '#b91c1c'}}>Discover our freshly baked delights and fill your box with joy.</p>
        <Link to="/" className="bg-primary text-white font-black py-4 px-10 rounded-2xl shadow-2xl shadow-primary/30 hover:bg-[#2D0A0A] hover:-translate-y-1 transition-all uppercase tracking-widest text-sm dark:hover:bg-black">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12 pb-16 md:pb-24 text-left max-w-7xl mx-auto px-4 animate-fade-in">
      <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tighter mb-6 md:mb-12" style={{color: isDark ? '#ffffff' : '#7f1d1d'}}>Your Sweet Box</h1>
      
      <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl border border-gray-50 overflow-hidden">
            {cartItems.map(item => (
              <div key={item.product} className="flex flex-col sm:flex-row items-center p-6 md:p-10 border-b border-gray-50 last:border-0 hover:bg-[#FFF8F0]/30 transition-colors">
                <div className="w-24 h-24 md:w-28 md:h-28 flex-shrink-0 rounded-2xl overflow-hidden shadow-xl ring-4 ring-white">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="sm:ml-8 flex-grow text-center sm:text-left mt-4 sm:mt-0">
                  <Link to={`/product/${item.product}`} className="text-lg md:text-xl font-black hover:opacity-70 transition-colors leading-tight" style={{color: isDark ? '#ffffff' : '#7f1d1d'}}>
                    {item.name}
                  </Link>
                  <div className="font-black text-base md:text-lg mt-1 md:mt-2" style={{color: isDark ? '#fca5a5' : '#991b1b'}}>PKR {item.price}</div>
                </div>
                
                <div className="flex items-center justify-between w-full sm:w-auto space-x-4 md:space-x-6 mt-6 sm:mt-0">
                  <div className="flex items-center bg-light rounded-xl border border-primary/10 overflow-hidden">
                    <button 
                      onClick={() => updateQuantity(item.product, item.quantity - 1)}
                      className="p-2 md:p-2.5 hover:bg-primary/5 text-primary transition-colors disabled:opacity-30"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3 md:px-4 py-2 text-xs md:text-sm font-black min-w-[2.5rem] md:min-w-[3rem] text-center" style={{color: isDark ? '#ffffff' : '#991b1b'}}>
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.product, item.quantity + 1)}
                      className="p-2 md:p-2.5 hover:bg-primary/5 text-primary transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.product)}
                    className="p-2 md:p-3 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-full transition-all border border-transparent hover:border-red-100"
                    title="Remove item"
                  >
                    <Trash2 className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="lg:w-1/3">
          <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl border border-gray-50 p-8 md:p-10 sticky top-24">
            <h2 className="text-xl md:text-2xl font-black mb-6 md:mb-8 tracking-tight" style={{color: isDark ? '#ffffff' : '#7f1d1d'}}>Order Summary</h2>
            
            <div className="space-y-4 md:space-y-6 mb-8 text-[10px] md:text-xs font-bold uppercase tracking-widest">
              <div className="flex justify-between">
                <span className="text-gray-400 dark:text-gray-400">Items Subtotal</span>
                <span className="dark:text-gray-400 font-black" style={{color: isDark ? '#d1d5db' : '#7f1d1d'}}>PKR {total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 dark:text-gray-400">Delivery Fee</span>
                <span className="text-green-600 dark:text-green-400">FREE</span>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-6 md:pt-8 mb-8 md:mb-10">
              <div className="flex justify-between items-end">
                <span className="text-[10px] md:text-xs font-black text-gray-400 dark:text-gray-400 tracking-widest uppercase leading-tight">Total<br/>Amount</span>
                <span className="text-3xl md:text-5xl font-black tracking-tighter" style={{color: isDark ? '#ffffff' : '#7f1d1d'}}>PKR {total}</span>
              </div>
            </div>
            
            <button 
              onClick={handleCheckout}
              className="w-full bg-primary text-white font-black py-4 md:py-5 px-6 rounded-2xl flex justify-center items-center hover:bg-[#2D0A0A] transition-all shadow-2xl shadow-primary/30 uppercase tracking-widest text-xs md:text-sm"
            >
              Secure Checkout <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-3" />
            </button>
            <div className="mt-6 md:mt-8 text-center">
              <Link to="/" className="text-[8px] md:text-[10px] font-black text-gray-400 hover:text-red-900 dark:text-gray-400 dark:hover:text-white transition-colors uppercase tracking-[0.2em]">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
