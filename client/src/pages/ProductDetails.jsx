import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ArrowLeft, Check, ShieldCheck, Star, Heart } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { FavoritesContext } from '../context/FavoritesContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addToCart, totalItems } = useContext(CartContext);
  const { addToFavorites, removeFromFavorites, isFavorite } = useContext(FavoritesContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        if (user) {
          const userId = user._id || user.id;
          const userReview = data.reviews?.find(r => r.user === userId);
          if (userReview) setRating(userReview.rating);
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, user]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Preparing your treat...</p>
    </div>
  );
  
  if (!product) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-black text-gray-400 uppercase tracking-widest">Treat not found</h2>
      <button onClick={() => navigate('/')} className="mt-6 bg-primary text-white px-8 py-3 rounded-xl font-black uppercase text-xs">Back Home</button>
    </div>
  );

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const submitReview = async (value) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`/api/products/${id}/reviews`, { rating: value }, config);
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
      setRating(value);
    } catch (err) {
      console.error('Review failed:', err);
      alert(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const getRatingCounts = () => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    product.reviews?.forEach(r => {
      counts[r.rating] = (counts[r.rating] || 0) + 1;
    });
    return counts;
  };

  const ratingCounts = getRatingCounts();
  const totalReviews = product.numReviews || 0;

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 animate-fade-in">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center product-details-text-muted text-gray-400 hover:text-primary mb-6 md:mb-10 transition-colors font-black text-[10px] md:text-xs uppercase tracking-widest"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Catalog
      </button>

      <div className="product-details-container bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-50 min-h-[400px] md:min-h-[600px]">
        {/* Left Section: Title, Price, Image */}
        <div className="product-details-left lg:w-1/2 p-8 md:p-12 flex flex-col bg-[#FFF8F0]/50 relative">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-white/80 backdrop-blur-md px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl border border-primary/10 shadow-sm text-[8px] md:text-[10px] font-black tracking-widest text-primary uppercase">
                {product.category}
              </span>
            </div>
            <h1 className="product-title text-3xl md:text-4xl lg:text-5xl font-black text-primary mb-2 leading-tight tracking-tighter">
              {product.name}
            </h1>
            <div className="text-2xl md:text-3xl font-black text-dark tracking-tighter">PKR {product.price}</div>
          </div>

          <div className="flex-grow flex items-center justify-center">
            <div className="w-full aspect-square rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-700">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        </div>
        
        {/* Right Section: Actions, Description, Reviews */}
        <div className="product-details-right lg:w-1/2 p-8 md:p-12 flex flex-col bg-card-bg transition-colors duration-500">
          {/* Spacer to align with Title on the left */}
          <div className="hidden lg:block h-16"></div>
          
            <div className="flex flex-col gap-4 mb-10 w-full">
              {(!user || user.role !== 'admin') && (
                <>
                  <button 
                    disabled={product.stock <= 0}
                    onClick={handleAddToCart}
                    className="w-full bg-primary hover:bg-[#2D0A0A] dark:hover:bg-black text-white font-black py-4 md:py-5 rounded-[1.2rem] md:rounded-[1.5rem] shadow-2xl shadow-primary/30 transition-all transform active:scale-95 text-[10px] md:text-sm uppercase tracking-[0.2em] flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {product.stock <= 0 ? (
                      'Out of Stock'
                    ) : added ? (
                      <><Check className="w-4 h-4 md:w-5 md:h-5 mr-3" /> Added to Box</>
                    ) : (
                      <><ShoppingCart className="w-4 h-4 md:w-5 md:h-5 mr-3" /> Add to Box</>
                    )}
                  </button>

                  <button 
                    onClick={() => isFavorite(product._id) ? removeFromFavorites(product._id) : addToFavorites(product)}
                    className={`w-full bg-primary hover:bg-[#2D0A0A] dark:hover:bg-black text-white font-black py-4 md:py-5 rounded-[1.2rem] md:rounded-[1.5rem] shadow-2xl shadow-primary/30 transition-all transform active:scale-95 text-[10px] md:text-sm uppercase tracking-[0.2em] flex justify-center items-center ${isFavorite(product._id) ? 'bg-dark border-2 border-dark' : ''}`}
                  >
                    <Heart className={`w-5 h-5 md:w-6 md:h-6 mr-3 ${isFavorite(product._id) ? 'fill-current' : ''}`} />
                    {isFavorite(product._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </button>
                </>
              )}
              {(!user || user.role !== 'admin') && (
                <div className="flex justify-between items-center px-4 py-3 bg-primary/5 rounded-2xl border border-primary/10">
                  <span className="product-details-text-secondary text-[10px] font-black text-primary uppercase tracking-[0.2em]">Box Capacity</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full ${totalItems === 6 ? 'bg-green-500' : 'bg-primary'} transition-all`} style={{ width: `${(totalItems/6)*100}%` }}></div>
                    </div>
                    <span className="product-details-text-secondary text-xs font-black text-primary">{totalItems}/6</span>
                  </div>
                </div>
              )}
            </div>

          <p className="product-details-text-secondary text-sm md:text-lg text-dark/70 mb-10 leading-relaxed font-medium transition-colors">
            {product.description}
          </p>

          <div className="product-details-bg-light mb-10 p-6 bg-light rounded-[2rem] border border-primary/5">
            <h4 className="product-details-text-muted text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 ml-1">Customer Satisfaction</h4>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map(num => (
                <div key={num} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 min-w-[40px]">
                    <span className="text-xs font-black text-dark">{num}</span>
                    <Star className="w-3 h-3 fill-accent text-accent" />
                  </div>
                  <div className="product-details-rating-bg flex-grow h-2 bg-white rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="product-details-rating-bar h-full bg-accent transition-all duration-1000 ease-out" 
                      style={{ width: `${totalReviews > 0 ? (ratingCounts[num] / totalReviews) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="product-details-text-muted text-[10px] font-bold text-gray-400 min-w-[30px]">{ratingCounts[num]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 space-y-8">
            <div className="flex items-center text-accent">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => {
                  const ratingValue = i + 1;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => submitReview(ratingValue)}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(0)}
                      className="focus:outline-none transition-transform hover:scale-125 active:scale-95"
                    >
                      <Star 
                        className={`w-5 h-5 md:w-6 md:h-6 transition-all ${
                          ratingValue <= (hover || rating || product.rating) ? 'fill-current text-accent' : 'text-gray-200'
                        }`} 
                      />
                    </button>
                  );
                })}
              </div>
              <span className="product-details-text-muted text-[10px] md:text-xs text-gray-400 font-black ml-4 tracking-widest uppercase">
                {product.numReviews || 0} Reviews
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 md:gap-6 border-t border-gray-50 pt-8">
              <div className={`px-4 md:px-6 py-2 rounded-full text-[8px] md:text-[10px] font-black tracking-widest uppercase ${product.stock > 0 ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                {product.stock > 0 ? `Freshly Baked (${product.stock} Left)` : 'Sold Out'}
              </div>
              <div className="flex items-center product-details-text-muted text-gray-400 text-[8px] md:text-[10px] font-black tracking-widest uppercase">
                <ShieldCheck className="w-4 h-4 mr-1 text-primary" /> FSSAI Certified
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProductDetails;
