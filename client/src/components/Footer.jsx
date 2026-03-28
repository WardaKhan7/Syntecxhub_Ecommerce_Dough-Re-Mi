import React from 'react';
import { Send, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Instagram = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Facebook = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Twitter = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-footer-bg text-footer-text pt-16 pb-10 border-t border-white/5 transition-colors duration-500">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div className="text-left">
            <h2 className="text-3xl font-black mb-4 font-serif">Dough-Re-Mi</h2>
            <p className="text-sm opacity-90 leading-relaxed mb-8 max-w-xs font-medium">
              Your trusted FSSAI certified online bakery for every celebration. We bake with love and the finest ingredients to bring you the sweetest moments.
            </p>
            <div className="flex space-x-3">
              {[Instagram, Facebook, Twitter, Phone].map((Icon, i) => (
                <a key={i} href="#" className="p-2.5 bg-white/5 rounded-full hover:bg-primary transition-colors border border-white/10">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Know Us */}
          <div className="text-left">
            <h3 className="text-xs font-black tracking-widest mb-6 opacity-80 uppercase">Know Us</h3>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link to="/about" className="opacity-90 hover:opacity-100 hover:text-secondary transition-all">Our Story</Link></li>
              <li><Link to="/contact" className="opacity-70 hover:opacity-100 hover:text-secondary transition-all">Contact Us</Link></li>
              <li><Link to="/blogs" className="opacity-70 hover:opacity-100 hover:text-secondary transition-all">Blogs</Link></li>
              <li><Link to="/locations" className="opacity-70 hover:opacity-100 hover:text-secondary transition-all">Locate Us</Link></li>
            </ul>
          </div>

          {/* Order Info */}
          <div className="text-left text-sm font-bold">
            <h3 className="text-xs font-black tracking-widest mb-6 opacity-80 uppercase">Order Info</h3>
            <ul className="space-y-4">
              <li><Link to="/orders" className="opacity-90 hover:opacity-100 hover:text-secondary transition-all">Order History</Link></li>
              <li><Link to="/refund-policy" className="opacity-90 hover:opacity-100 hover:text-secondary transition-all">Refund Policy</Link></li>
              <li><Link to="/privacy-policy" className="opacity-90 hover:opacity-100 hover:text-secondary transition-all">Privacy Policy</Link></li>
              <li><Link to="/terms" className="opacity-90 hover:opacity-100 hover:text-secondary transition-all">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="text-left">
            <h3 className="text-xs font-black tracking-widest mb-4 opacity-80 uppercase">Join Our Sweet List</h3>
            <p className="text-xs opacity-90 mb-6 font-medium leading-relaxed">Get exclusive offers and dessert news delivered to your inbox.</p>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter Email Address"
                className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-5 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium placeholder:opacity-40"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary p-2.5 rounded-full hover:bg-accent transition-all shadow-lg">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] font-black tracking-widest opacity-80 text-center md:text-left gap-4">
          <p>© {new Date().getFullYear()} DOUGH-RE-MI. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-6 uppercase">
            <span>Karachi</span>
            <span>Lahore</span>
            <span>Islamabad</span>
            <span>Faisalabad</span>
            <span>Multan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
