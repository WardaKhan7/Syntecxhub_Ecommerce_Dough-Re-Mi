import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { ShoppingBag, Star, Heart, Plus, Truck, Palette, Award, Flame, Ticket, Cake, Gift, Sparkles, PartyPopper, Donut, ArrowRight, Package } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { FavoritesContext } from '../context/FavoritesContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addToCart, totalItems } = useContext(CartContext);
  const { addToFavorites, removeFromFavorites, isFavorite } = useContext(FavoritesContext);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
    }
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const baseCategories = [
    { name: 'Cakes', icon: Cake },
    { name: 'Theme Cakes', icon: Palette },
    { name: 'Desserts', icon: Donut },
    { name: 'Birthday', icon: PartyPopper },
    { name: 'Hampers', icon: Gift },
    { name: 'Anniversary', icon: Heart },
    { name: 'Occasions', icon: Sparkles },
    { name: 'Best Sellers', icon: Star },
  ];

  const [categories, setCategories] = useState(baseCategories);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products?isBestSeller=true&pageSize=8');
        const bestSellers = data.products || [];

        if (bestSellers.length > 0) {
          setProducts(bestSellers);
        } else {
          const allProductsResponse = await axios.get('/api/products?pageSize=8');
          setProducts(allProductsResponse.data.products || []);
        }

        setLoading(false);
      } catch (err) {
        setLoading(false);
        setProducts([
          { _id: '1', name: 'Rich Chocolate Truffle Cake', price: 1200, imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80', category: 'Cakes', rating: 0, numReviews: 0 },
          { _id: '2', name: 'Choco Chip Truffle Cake', price: 1599, imageUrl: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=800&q=80', category: 'Cakes', rating: 0, numReviews: 0 },
          { _id: '3', name: 'Tropical Fruit N Almond Cake', price: 1599, imageUrl: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80', category: 'Cakes', rating: 0, numReviews: 0 },
          { _id: '4', name: 'Rich Butterscotch Crunch Cake', price: 1399, imageUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800&q=80', category: 'Cakes', rating: 0, numReviews: 0 },
        ]);
      }
    };
    
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/products/categories');
        if (data && data.length > 0) {
          const newCats = [...baseCategories];
          const baseNames = baseCategories.map(c => c.name.toLowerCase());
          data.forEach(cat => {
            if (!baseNames.includes(cat.toLowerCase())) {
              newCats.push({ name: cat, icon: Sparkles });
            }
          });
          setCategories(newCats);
        }
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const handleCategoryClick = (name) => {
    navigate(`/category/${name.toLowerCase().replace(/\s+/g, '-')}`);
  };

  const promiseItems = [
    { title: 'On-Time Delivery', desc: 'Guaranteed fresh & on time', icon: Truck },
    { title: '5100+ Designs', desc: 'Customized for your needs', icon: Palette },
    { title: '2 CR+ Orders', desc: 'Trusted by millions nationwide', icon: Award },
    { title: 'Baked Fresh', desc: 'Every order baked from scratch', icon: Flame },
  ];

  const promiseImages = [
    'https://images.unsplash.com/photo-1621798421978-b3ceee4d7bff?w=600&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    'https://images.unsplash.com/photo-1562440499-64c9a111f713?w=600&q=80',
    'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=600&q=80',
    'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=600&q=80',
    'https://images.unsplash.com/photo-1607478900766-efe13248b125?w=600&q=80',
  ];

  const testimonialAvatars = [
    'https://i.pravatar.cc/40?img=1',
    'https://i.pravatar.cc/40?img=2',
    'https://i.pravatar.cc/40?img=3',
    'https://i.pravatar.cc/40?img=4',
    'https://i.pravatar.cc/40?img=5',
  ];

  if (user && user.role === 'admin') {
    return <Navigate to="/admin" />;
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-light">
      <div className="relative">
        <div className="w-24 h-24 border-8 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">
          <Cake className="w-10 h-10 text-primary" />
        </div>
      </div>
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-black text-primary font-serif tracking-tighter">Dough-Re-Mi</h2>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Baking your sweet dreams...</p>
      </div>
    </div>
  );

  return (
    <div className="bg-light min-h-screen animate-fade-in w-full overflow-hidden">

      {/* ── Hero Section ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-hero-gradient to-primary mx-2 md:mx-4 my-2 md:my-4 rounded-[2rem] md:rounded-[2.5rem] shadow-xl min-h-[400px] md:min-h-[520px]">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-48 md:w-96 h-48 md:h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 md:w-64 h-32 md:h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 container mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col lg:flex-row items-center justify-center min-h-[400px] md:min-h-[520px]">
          {/* Left copy */}
          <div className="w-full lg:w-1/2 text-white space-y-4 md:space-y-6 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black leading-tight tracking-tight mt-4 lg:mt-0">
              DECADENT<br />CHOCOLATE<br />
              <span className="text-secondary/90">BLISS!</span>
            </h1>
            <p className="text-sm md:text-lg lg:text-xl font-medium opacity-75 italic max-w-sm mx-auto lg:mx-0">Satisfy Your Sweetest Cravings</p>
            <div className="inline-block bg-white/10 backdrop-blur-md px-4 sm:px-6 md:px-8 py-2 md:py-4 rounded-3xl border border-white/20 mt-2">
              <span className="text-[7px] md:text-[10px] font-black tracking-widest uppercase opacity-60 block mb-1">Special Offer</span>
              <span className="text-xl sm:text-2xl md:text-4xl font-black">SAVE 20%</span>
            </div>
            <div className="lg:hidden pb-4 pt-6">
              <Link to={user ? '/products' : '/login?redirect=/products'} className="bg-white text-primary font-black px-6 md:px-8 py-2.5 md:py-3 rounded-full uppercase tracking-widest text-[10px] md:text-xs shadow-xl">
                Order Now
              </Link>
            </div>
          </div>

          {/* Right image cluster */}
          <div className="hidden lg:flex w-1/2 justify-center relative h-[460px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[300px] lg:w-[380px] h-[300px] lg:h-[380px] rounded-full border-[8px] border-white/20 overflow-hidden ring-8 ring-white/10 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80"
                  alt="Decadent Cake"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
            <div className="absolute top-4 right-8 w-24 h-24 lg:w-28 lg:h-28 rounded-full border-4 border-white overflow-hidden shadow-xl hover:scale-110 transition-transform">
              <img src="https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=400&q=80" className="w-full h-full object-cover" alt="cake" />
            </div>
            <div className="absolute bottom-8 right-16 w-32 h-32 lg:w-36 lg:h-36 rounded-full border-4 border-white overflow-hidden shadow-xl hover:scale-110 transition-transform">
              <img src="https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&q=80" className="w-full h-full object-cover" alt="cake" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Menu Section ────────────────────────────────── */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-[8px] md:text-[10px] font-black tracking-[0.3em] text-primary uppercase mb-2 md:mb-4">Categories</h2>
          <h3 className="text-2xl sm:text-3xl md:text-5xl font-black text-dark tracking-tighter">What will you wish for?</h3>
        </div>
        
        {/* Scrollable container for Categories - Added pt-8 to prevent clipping during hover animation */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-8 pt-8 pb-4 px-2">
          {categories.map((cat, i) => (
            <div 
              key={i} 
              onClick={() => handleCategoryClick(cat.name)}
              className="group cursor-pointer animate-scale-in flex flex-col items-center flex-shrink-0 snap-center w-20 md:w-28" 
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="w-full aspect-square md:w-28 md:h-28 bg-white dark:bg-white/5 rounded-2xl md:rounded-3xl mb-2 md:mb-4 flex items-center justify-center shadow-sm border border-orange-50 dark:border-white/5 group-hover:border-primary/20 dark:group-hover:border-white/20 group-hover:bg-light dark:group-hover:bg-white/10 group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                <cat.icon className={`w-6 h-6 md:w-10 md:h-10 ${isDark ? 'text-white' : 'text-[#800000]'}`} />
              </div>
              <p className="text-[7px] md:text-[10px] font-black tracking-widest text-gray-400 group-hover:text-primary transition-colors text-center uppercase truncate w-full px-1">{cat.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bestsellers ───────────────────────────────────── */}
      <section className="container mx-auto px-4 pb-16">
        {/* Box Capacity Indicator */}
        <div className="mb-12 bg-white dark:bg-white/5 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-primary/5 relative overflow-hidden group transition-all duration-500 hover:shadow-primary/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse"></div>
          <div className="relative flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h3 style={{color: '#7f1d1d'}} className="text-2xl md:text-3xl font-black dark:text-white tracking-tight mb-2 flex items-center justify-center md:justify-start">
                <Package className="w-6 h-6 md:w-8 md:h-8 mr-3 text-primary animate-bounce" /> Your Sweet Box
              </h3>
              <p style={{color: '#b91c1c'}} className="dark:text-gray-400 font-bold uppercase tracking-widest text-[8px] md:text-[10px]">
                {totalItems === 6 ? 'Your box is full and ready for checkout!' : `Fill your box with 6 treats for the perfect gift (${6 - totalItems} remaining)`}
              </p>
            </div>
            
            <div className="w-full md:w-1/2 space-y-4">
              <div className="flex justify-between items-end mb-1">
                <span style={{color: '#7f1d1d'}} className="text-[10px] font-black dark:text-white uppercase tracking-widest">Box Capacity</span>
                <span style={{color: '#7f1d1d'}} className="text-xl md:text-2xl font-black dark:text-white">{totalItems}/20</span>
              </div>
              <div className="h-4 md:h-6 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden p-1 border border-gray-50 dark:border-white/5">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ease-out shadow-sm ${totalItems === 6 ? 'bg-green-500' : 'bg-primary'}`}
                  style={{ width: `${(totalItems / 20) * 100}%` }}
                />
              </div>
            </div>

            {totalItems > 0 && (
              <Link to="/cart" className="bg-primary text-white p-4 md:p-6 rounded-2xl md:rounded-3xl hover:bg-[#2D0A0A] transition-all shadow-xl shadow-primary/20 group-hover:scale-105 active:scale-95 whitespace-nowrap">
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
              </Link>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-10 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-primary mb-1">Bestsellers from Across the Country</h2>
            <div className="w-16 md:w-20 h-1 md:h-1.5 bg-primary rounded-full" />
          </div>
          <Link to="/products" className="bg-primary text-white text-[10px] md:text-[11px] font-black px-6 md:px-8 py-2.5 md:py-3 rounded-full hover:bg-[#2D0A0A] transition-all uppercase tracking-widest shadow-md hover:shadow-primary/30">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
          {products.map((product, idx) => (
            <div
              key={product._id}
              className="group relative bg-white p-3 md:p-4 rounded-2xl md:rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border border-gray-100 flex flex-col animate-slide-up"
              style={{ animationDelay: `${idx * 100}ms` }}
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
                    <h3 className="text-xs md:text-sm font-black text-dark mb-1 md:mb-2 leading-tight group-hover:text-primary dark:text-white dark:group-hover:text-white transition-colors line-clamp-2">
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
                    <div className="text-sm md:text-xl font-black text-primary dark:text-white">PKR {product.price}</div>
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
      </section>

      {/* ── Our Promise Section ────────────────────────────── */}
      <section className="bg-promise-bg py-16 md:py-24 transition-colors duration-500">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=800&q=80" 
                  alt="Our Bakery" 
                  className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-1000"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-primary text-white p-8 rounded-[2rem] shadow-2xl hidden md:block">
                <p className="text-4xl font-black mb-1">100%</p>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Eggless & Fresh</p>
              </div>
            </div>
            
            <div className="lg:w-1/2 space-y-10">
              <div>
                <h2 className="text-[8px] md:text-[10px] font-black tracking-[0.3em] text-primary uppercase mb-2 md:mb-4">Our Promise</h2>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-dark tracking-tighter leading-tight">Baked with Love,<br />Served with Joy</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {promiseItems.map((item, i) => (
                  <div key={i} className="flex items-start group">
                    <div className="bg-light p-4 rounded-2xl mr-5 group-hover:bg-primary/10 transition-colors">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-dark mb-1 uppercase tracking-tight">{item.title}</h4>
                      <p className="text-xs text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-4">
                <Link to="/products" className="inline-flex items-center bg-primary text-white font-black px-10 py-5 rounded-2xl hover:bg-[#2D0A0A] transition-all uppercase tracking-widest text-xs shadow-2xl shadow-primary/20 group">
                  Explore Menu <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Magical Ticket Promo ──────────────────────────── */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-magical-from via-magical-via to-magical-from border border-magical-border rounded-3xl p-10 flex flex-col md:flex-row items-center gap-8 shadow-xl transition-all duration-500">
          <div className="flex-shrink-0 bg-primary text-white rounded-2xl p-6 shadow-xl shadow-primary/30 transform -rotate-3 hover:rotate-0 transition-transform">
            <Ticket className="w-10 h-10 mb-2" />
            <p className="text-xs font-black tracking-widest uppercase opacity-70">Lucky Draw</p>
            <p className="text-2xl font-black">PKR 750</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-dark mb-2">THE MAGICAL TICKET</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium mb-6 text-xs md:text-sm max-w-md mx-auto md:mx-0">Add 3 reminders in your account. Win offers worth PKR 750 that could be yours! The more you remember, the sweeter the reward.</p>
            {user ? (
              <Link
                to="/orders"
                className="inline-block bg-primary text-white font-black py-3 px-8 rounded-full hover:bg-accent transition-all shadow-lg shadow-primary/30 uppercase tracking-widest text-xs hover:-translate-y-0.5"
              >
                View Profile
              </Link>
            ) : (
              <Link
                to="/register"
                className="inline-block bg-primary text-white font-black py-3 px-8 rounded-full hover:bg-accent transition-all shadow-lg shadow-primary/30 uppercase tracking-widest text-xs hover:-translate-y-0.5"
              >
                Unlock Now
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── FSSAI Trust Banner ────────────────────────────── */}
      <section className="mx-4 mb-4 bg-gradient-to-r from-banner to-primary rounded-3xl py-6 px-8 text-center text-white font-black tracking-widest text-sm uppercase shadow-xl flex items-center justify-center gap-3">
        <Award className="w-5 h-5 text-secondary" />
        Dough-Re-Mi – Your Trusted FSSAI Certified Online Bakery for Every Celebration
      </section>

    </div>
  );
};

export default Home;
