import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, User as UserIcon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
          Syntecxhub
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/cart" className="relative text-gray-700 hover:text-primary transition-colors">
            <ShoppingCart className="w-6 h-6" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="flex items-center text-sm font-medium text-gray-700 cursor-pointer">
                <UserIcon className="w-5 h-5 mr-1" /> {user.name}
              </span>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-sm text-blue-600 font-semibold hover:text-blue-800">
                  Dashboard
                </Link>
              )}
              <button 
                onClick={handleLogout} 
                className="flex items-center text-red-500 hover:text-red-700 font-semibold text-sm transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-primary hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium shadow-md transition-all hover:shadow-lg">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
