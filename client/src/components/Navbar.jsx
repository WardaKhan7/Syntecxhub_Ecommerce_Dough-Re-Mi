import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User as UserIcon, Search, LogOut, Heart, Menu, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { FavoritesContext } from '../context/FavoritesContext';
import axios from 'axios';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { favorites } = useContext(FavoritesContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

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

  const isHome = location.pathname === '/';

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  const [categories, setCategories] = useState([
    'Cakes', 'Theme Cakes', 'Desserts', 'Birthday', 'Hampers', 'Anniversary', 'Occasions', 'Best Sellers'
  ]);

  React.useEffect(() => {
    const fetchCats = async () => {
      try {
        const { data } = await axios.get('/api/products/categories');
        if (data && data.length > 0) {
          setCategories(Array.from(new Set([...categories, ...data])));
        }
      } catch (err) {
        console.error('Failed to fetch categories format', err);
      }
    };
    fetchCats();
  }, []);

  return (
    <header className="bg-nav-bg text-nav-text dark:text-white sticky top-0 z-50 shadow-sm transition-colors duration-500">
      {/* Top Bar */}
      <div className="container mx-auto px-4 py-3 flex justify-between items-center border-b border-gray-100 dark:border-white/10 text-nav-text dark:text-white">
        <div className="flex items-center">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-primary transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Link to="/" className="text-2xl md:text-3xl font-black text-nav-text font-serif tracking-tighter ml-2 lg:ml-0">
            Dough-Re-Mi
          </Link>
        </div>

        {/* Desktop Search - hidden for admin */}
        {(!user || user.role !== 'admin') && (
        <div className="hidden lg:flex flex-1 max-w-md mx-8 relative">
          <input 
            type="text" 
            placeholder="Search for cakes, desserts..." 
            className={`w-full bg-light border border-gray-100 rounded-full py-2.5 px-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium ${isDark ? 'text-white' : 'text-dark'}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
          />
          <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-white/40' : 'text-gray-400'}`} />
        </div>
        )}
        
        <div className="flex items-center space-x-3 md:space-x-5">
          {/* Mobile Search Toggle - hidden for admin */}
          {(!user || user.role !== 'admin') && (
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-primary transition-colors"
          >
            <Search className="w-6 h-6" />
          </button>
          )}

          {user && user.role === 'admin' && (
            <Link to="/admin" className="hidden lg:flex items-center text-xs font-bold hover:opacity-70 transition-colors uppercase tracking-widest border-r border-gray-100 dark:border-white/10 pr-4" style={{color: isDark ? '#ffffff' : '#800000'}}>
              Dashboard
            </Link>
          )}
          
          {user ? (
            <div className="hidden sm:flex items-center space-x-4">
              <span className="text-xs font-bold uppercase tracking-widest" style={{color: isDark ? '#ffffff' : '#800000'}}>
                Hi, {user.name?.split(' ')[0]}
              </span>
              <button 
                onClick={handleLogout}
                className="flex items-center text-xs font-bold hover:text-dark dark:hover:text-white transition-colors uppercase tracking-widest"
              >
                <LogOut className={`w-4 h-4 mr-1 ${isDark ? 'text-white/60' : 'text-[#800000]'}`} /> <span className={isDark ? 'text-white/60' : 'text-[#800000]'}>Logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="hidden sm:flex items-center text-xs font-bold hover:opacity-70 transition-colors uppercase tracking-widest" style={{color: isDark ? '#ffffff' : '#800000'}}>
              <UserIcon className="w-4 h-4 mr-1" /> Login
            </Link>
          )}
          
          {(!user || user.role !== 'admin') && (
            <>
              <Link to="/favorites" className="relative text-[#800000] dark:text-white hover:text-dark dark:hover:text-primary transition-colors p-1">
                <Heart className={`w-6 h-6 ${isDark ? 'text-white' : 'text-[#800000]'}`} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white dark:text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-white/20">
                    {favorites.length}
                  </span>
                )}
              </Link>

              <Link to={user ? '/cart' : '/login?redirect=/cart'} className="relative text-[#800000] dark:text-white hover:text-dark dark:hover:text-primary transition-colors p-1">
                <ShoppingCart className={`w-6 h-6 ${isDark ? 'text-white' : 'text-[#800000]'}`} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white dark:text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-white/20">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="lg:hidden bg-nav-bg px-4 py-3 border-b border-gray-100 dark:border-white/10 animate-fade-in">
          <div className="relative">
            <input 
              autoFocus
              type="text" 
              placeholder="Search for cakes, desserts..." 
              className="w-full bg-light border border-gray-100 rounded-full py-2.5 px-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary dark:text-white/40" />
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40 hover:text-primary dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Menu */}
      <div className={`fixed inset-0 z-[100] transition-all duration-500 ${isMobileMenuOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-dark/60 backdrop-blur-sm transition-opacity duration-500 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Sidebar */}
        <div className={`absolute top-0 left-0 bottom-0 w-[80%] max-w-[320px] bg-card-bg shadow-2xl transition-transform duration-500 ease-out flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
            <span className="text-xl font-black text-nav-text font-serif">Dough-Re-Mi</span>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 -mr-2 text-primary dark:text-white hover:text-dark dark:hover:text-primary transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-8 px-6 space-y-10">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black tracking-[0.2em] text-gray-300 uppercase">Explore Categories</h3>
              <div className="grid grid-cols-1 gap-2">
                {categories.map(link => (
                  <Link 
                    key={link} 
                    to={`/category/${link.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center p-3 rounded-xl text-xs font-black uppercase tracking-widest text-dark hover:bg-primary/5 hover:text-primary transition-all group"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full mr-3 transition-colors ${isDark ? 'bg-primary/40 group-hover:bg-primary' : 'bg-[#800000]'}`} />
                    {link}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-10 border-t border-gray-50 space-y-6">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-light dark:bg-white/5 rounded-2xl">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black">
                      {user.name?.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-black text-dark uppercase tracking-widest truncate">{user.name}</p>
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tight truncate">{user.email}</p>
                    </div>
                  </div>
                  {user.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full bg-dark text-white py-4 rounded-xl text-center font-black uppercase text-[10px] tracking-widest shadow-xl shadow-dark/20"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="block w-full bg-white border-2 border-primary/10 text-[#800000] py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-primary/5 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full bg-primary text-white py-4 rounded-xl text-center font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20"
                >
                  Login / Signup
                </Link>
              )}
            </div>
          </div>

          <div className="p-6 bg-light border-t border-gray-100">
            <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest text-center">© 2026 Dough-Re-Mi Bakery</p>
          </div>
        </div>
      </div>

      {/* Category Nav Bar - Only on Home Page and Large Screens */}
      {isHome && (
        <div className="hidden lg:block bg-primary py-2.5 border-b border-white/10">
          <div className="container mx-auto px-4 flex justify-between items-center overflow-x-auto scrollbar-hide">
            <div className="flex items-center space-x-8 whitespace-nowrap">
              {categories.slice(0, 8).map(link => (
                <Link key={link} to={`/category/${link.toLowerCase().replace(/\s+/g, '-')}`} className="text-[10px] md:text-[11px] font-black text-white hover:opacity-70 transition-all uppercase tracking-[0.15em]">
                  {link}
                </Link>
              ))}
              {categories.length > 8 && (
                <Link to="/products" className="text-[12px] font-black text-white hover:opacity-80 transition-opacity uppercase tracking-tight flex items-center">
                  Explore All <span className="ml-1 text-[16px]">→</span>
                </Link>
              )}
            </div>
            <Link to={user ? '/checkout' : '/login?redirect=/checkout'} className="hidden lg:block bg-[#2D0A0A] dark:bg-white text-white dark:text-[#2D0A0A] text-[10px] md:text-[11px] font-black px-8 py-2.5 rounded-full hover:bg-primary dark:hover:bg-white transition-all shadow-xl shadow-primary/20 uppercase tracking-widest ml-6 flex-shrink-0">
              Order Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
