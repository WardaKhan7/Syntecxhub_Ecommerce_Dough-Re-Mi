import React, { useState, useEffect, useContext } from 'react';
import { useParams, useSearchParams, Link, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, Star, Heart, Plus, Filter, Search, Package } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { FavoritesContext } from '../context/FavoritesContext';

const Products = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, totalItems } = useContext(CartContext);
  const { addToFavorites, removeFromFavorites, isFavorite } = useContext(FavoritesContext);

  if (user && user.role === 'admin') {
    return <Navigate to="/admin" />;
  }

  const [categoriesList, setCategoriesList] = useState([
    'All', 'Cakes', 'Theme Cakes', 'Desserts', 'Birthday', 'Hampers', 'Anniversary', 'Occasions', 'Best Sellers'
  ]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const { data } = await axios.get('/api/products/categories');
        if (data && data.length > 0) {
          const freshCategories = Array.from(new Set([...categoriesList.slice(1), ...data]));
          setCategoriesList(['All', ...freshCategories]);
        }
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCats();
  }, []);

  const handleCategoryChange = (cat) => {
    if (cat === 'All') {
      navigate('/products');
    } else {
      navigate(`/category/${cat.toLowerCase().replace(/\s+/g, '-')}`);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = '/api/products';
        const params = new URLSearchParams();
        if (query) {
          params.append('keyword', query);
        }
        if (category) {
          const formattedCategory = category.replace(/-/g, ' ');
          if (formattedCategory.toLowerCase() === 'best sellers') {
            params.append('isBestSeller', 'true');
          } else if (formattedCategory.toLowerCase() !== 'all') {
            params.append('category', category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));
          }
        }
        params.append('pageSize', '100'); // Show many items for listing pages
        
        const { data } = await axios.get(`${url}?${params.toString()}`);
        setProducts(data.products || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
        setProducts([]);
      }
    };
    fetchProducts();
  }, [category, query]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Loading treats...</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-6 w-full">
        <div className="flex-shrink-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-primary tracking-tighter mb-2">
            {query ? `Search Results for "${query}"` : category ? category.replace(/-/g, ' ').toUpperCase() : 'All Delights'}
          </h1>
          <div className="w-16 md:w-20 h-1 md:h-1.5 bg-primary rounded-full" />
        </div>
        
        <div className="flex items-center space-x-3 overflow-x-auto pb-4 w-full min-w-0">
          {categoriesList.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex-shrink-0 ${
                ((category && category.replace(/-/g, ' ').toLowerCase() === cat.toLowerCase()) || (!category && cat === 'All'))
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-white text-gray-400 hover:text-primary border border-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Box Capacity Indicator */}
      <div className="mb-8 bg-white dark:bg-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-lg border border-primary/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center">
          <Package className="w-5 h-5 mr-3 text-primary" />
                  <span style={{color: isDark ? '#ffffff' : '#7f1d1d'}} className="text-[10px] font-black uppercase tracking-widest">Your Sweet Box ({totalItems}/20)</span>
        </div>
        <div className="w-full md:w-64 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${totalItems === 6 ? 'bg-green-500' : 'bg-primary'}`} 
            style={{ width: `${(totalItems/20)*100}%` }}
          />
        </div>
        {totalItems > 0 && (
          <Link to="/cart" className="text-[8px] font-black uppercase tracking-widest" style={{color: isDark ? '#ffffff' : '#7f1d1d'}}>
            View Box & Checkout →
          </Link>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 md:py-20 bg-white rounded-[2rem] md:rounded-[3rem] shadow-inner border border-gray-50 px-6">
          {query ? <Search className="w-12 md:w-16 h-12 md:h-16 text-gray-200 mx-auto mb-6" /> : <ShoppingBag className="w-12 md:w-16 h-12 md:h-16 text-gray-200 mx-auto mb-6" />}
          <h2 className="text-xl md:text-2xl font-black text-gray-400 uppercase tracking-widest">No treats found</h2>
          <p className="text-gray-400 mt-2 font-bold text-sm">Try searching for something else or browse categories.</p>
          <Link to="/" className="inline-block mt-8 bg-primary text-white font-black px-8 py-3 rounded-full hover:bg-[#2D0A0A] transition-all uppercase tracking-widest text-xs">
            Back to Home
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
          {products.map((product, idx) => (
            <div
              key={product._id}
              className="group relative p-3 md:p-4 rounded-2xl md:rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border border-gray-100 flex flex-col animate-slide-up"
              style={{ animationDelay: `${idx * 50}ms`, backgroundColor: isDark ? '#1c0000' : '#ffffff', borderColor: isDark ? 'rgb(63,51,51)' : '' }}
            >
              {(!user || user.role !== 'admin') && (
                <button 
                  onClick={() => isFavorite(product._id) ? removeFromFavorites(product._id) : addToFavorites(product)}
                  className={`absolute top-4 left-4 md:top-6 md:left-6 z-10 p-1.5 md:p-2 backdrop-blur-md rounded-full transition-all shadow-md transform active:scale-90 border ${isFavorite(product._id) ? 'bg-primary text-white border-transparent' : 'bg-white/90 dark:bg-white/10 text-primary dark:text-white/40 border-dark/10 dark:border-white/10 hover:text-dark dark:hover:text-secondary hover:bg-white dark:hover:bg-white/20'}`}
                >
                  <Heart className={`w-3 h-3 md:w-4 md:h-4 ${isFavorite(product._id) ? 'fill-current' : ''}`} />
                </button>
              )}
              <Link to={`/product/${product._id}`} className="block">
                <div className="aspect-square w-full rounded-xl md:rounded-2xl overflow-hidden mb-3 md:mb-5 bg-gray-50">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </Link>
              <div className="px-1 flex-grow flex flex-col justify-between">
                <div>
                  <Link to={`/product/${product._id}`}>
                    <h3 className="text-xs md:text-sm font-black mb-1 md:mb-2 leading-tight group-hover:text-primary transition-colors line-clamp-2" style={{color: isDark ? '#ffffff' : '#1c1c1c'}}>
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center text-accent mb-2 md:mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-2 h-2 md:w-3 md:h-3 ${i < (product.rating || 4) ? 'fill-current' : 'text-gray-200'}`} />
                    ))}
                    <span className="text-[7px] md:text-[10px] text-gray-400 font-black ml-1.5 md:ml-2">{product.numReviews || 0}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-3 md:mb-6">
                    <div className="text-sm md:text-xl font-black" style={{color: isDark ? '#ffffff' : '#800000'}}>PKR {product.price}</div>
                    <div className={`text-[6px] md:text-[8px] font-black uppercase tracking-widest px-1.5 md:px-3 py-1 rounded-full ${product.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {product.stock > 0 ? `${product.stock} In Stock` : 'Sold Out'}
                    </div>
                  </div>
                  
                  {(!user || user.role !== 'admin') && (
                    <button 
                      disabled={product.stock <= 0}
                      onClick={() => addToCart(product)}
                      className="w-full bg-primary hover:bg-[#2D0A0A] text-white font-black py-2 md:py-4 rounded-xl md:rounded-2xl flex justify-center items-center transition-all shadow-md md:shadow-xl shadow-primary/10 active:scale-95 text-[8px] md:text-[10px] uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {product.stock <= 0 ? 'Sold Out' : <><Plus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" /> Add to Box</>}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
