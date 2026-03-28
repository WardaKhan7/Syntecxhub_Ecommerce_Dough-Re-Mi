import React, { useContext, useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Trash2, Heart, Plus, ArrowRight } from 'lucide-react';
import { FavoritesContext } from '../context/FavoritesContext';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Favorites = () => {
  const { favorites, removeFromFavorites } = useContext(FavoritesContext);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
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

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] shadow-2xl border border-gray-100 max-w-4xl mx-auto mt-12 mb-16 md:mb-24 animate-fade-in">
        <div className="p-10 rounded-full mb-10 ring-8 dark:ring-gray-600" style={{backgroundColor: isDark ? '#1c0000' : '#FFF8F0'}}>
          <Heart className="w-20 h-20" style={{color: isDark ? '#ffffff' : '#800000'}} />
        </div>
        <h2 className="text-4xl font-black mb-4 tracking-tight" style={{color: isDark ? '#ffffff' : '#7f1d1d'}}>Your Wishlist is Empty</h2>
        <p className="mb-10 max-w-sm text-center font-bold" style={{color: isDark ? '#d1d5db' : '#b91c1c'}}>Save your favorite treats and they will appear here!</p>
        <Link to="/" className="bg-primary text-white font-black py-4 px-10 rounded-2xl shadow-2xl shadow-primary/30 hover:bg-[#2D0A0A] hover:-translate-y-1 transition-all uppercase tracking-widest text-sm dark:hover:bg-black">
          Start Exploring
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12 pb-16 md:pb-24 text-left max-w-7xl mx-auto px-4 animate-fade-in">
      <h1 className="text-3xl md:text-5xl font-black text-red-800 tracking-tighter mb-8 md:mb-12">Your Favorites</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {favorites.map(item => (
          <div key={item._id} className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl border border-gray-50 overflow-hidden group p-6 md:p-8 flex flex-col items-center sm:items-start sm:flex-row">
            <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-2xl overflow-hidden shadow-xl ring-4 ring-white mb-6 sm:mb-0">
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            
            <div className="sm:ml-6 md:ml-8 flex-grow text-center sm:text-left">
              <Link to={`/product/${item._id}`} className="text-lg md:text-xl font-black hover:opacity-70 transition-colors leading-tight line-clamp-2 mb-2" style={{color: isDark ? '#ffffff' : '#7f1d1d'}}>
                {item.name}
              </Link>
              <div className="text-red-800 font-black text-base md:text-lg mb-4 md:mb-6">PKR {item.price}</div>
              
              <div className="flex items-center justify-center sm:justify-start space-x-4">
                <button 
                  onClick={() => addToCart(item)}
                  className="bg-primary text-white p-2.5 md:p-3 rounded-full shadow-lg hover:bg-[#2D0A0A] transition-all hover:scale-110 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => removeFromFavorites(item._id)}
                  className="p-2.5 md:p-3 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-full transition-all border border-transparent hover:border-red-100"
                  title="Remove item"
                >
                  <Trash2 className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
