import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
  const { cartItems, removeFromCart, addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 mt-8">
        <div className="bg-blue-50 p-6 rounded-full mb-6">
          <ShoppingBag className="w-16 h-16 text-primary" />
        </div>
        <h2 className="text-3xl font-extrabold text-dark mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md text-center">Looks like you haven't added anything to your cart yet. Discover our premium products and start shopping.</p>
        <Link to="/" className="bg-primary text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 text-left">
      <h1 className="text-3xl font-extrabold text-dark tracking-tight mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {cartItems.map(item => (
              <div key={item.product} className="flex flex-col sm:flex-row items-center p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl shadow-sm mb-4 sm:mb-0" />
                
                <div className="sm:ml-6 flex-grow text-center sm:text-left">
                  <Link to={`/product/${item.product}`} className="text-lg font-bold text-gray-900 hover:text-primary transition-colors">
                    {item.name}
                  </Link>
                  <div className="text-primary font-bold mt-1">${item.price.toFixed(2)}</div>
                </div>
                
                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                  <div className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-semibold text-gray-700">
                    Qty: {item.quantity}
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.product)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                    title="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="lg:w-1/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                <span className="font-medium text-gray-900">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Taxes</span>
                <span className="font-medium text-gray-900">Calculated at checkout</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-3xl font-extrabold text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              onClick={handleCheckout}
              className="w-full bg-dark text-white font-bold py-4 px-6 rounded-xl flex justify-center items-center hover:bg-gray-800 transition-colors shadow-lg"
            >
              Proceed to Checkout <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <div className="mt-4 text-center">
              <Link to="/" className="text-sm font-medium text-primary hover:text-blue-800 transition-colors">
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
