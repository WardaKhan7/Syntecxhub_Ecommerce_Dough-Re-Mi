import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Package, Calendar, Clock, MapPin, ChevronRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    if (user !== undefined) {
      setInitializing(false);
    }
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || initializing) return;
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get('/api/orders/myorders', config);
        setOrders(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, initializing]);

  if (initializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Verifying account...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="max-w-md mx-auto bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-50">
          <div className="bg-light p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-8">
            <Package className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-black text-dark mb-4 tracking-tight">Login Required</h2>
          <p className="text-gray-400 font-bold mb-10 leading-relaxed">Please login to view your personalized order history and track your sweet treats.</p>
          <Link to="/login" className="block w-full bg-primary text-white font-black py-4 rounded-2xl hover:bg-[#2D0A0A] transition-all uppercase tracking-widest text-xs shadow-xl shadow-primary/20">
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Fetching your history...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 pb-20 animate-fade-in max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 className="text-5xl font-black text-primary dark:text-white tracking-tighter mb-2">Order History</h1>
          <p className="text-gray-400 dark:text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">Your Past Delights</p>
          <div className="w-20 h-1.5 bg-primary rounded-full mt-6" />
        </div>
        <div className="bg-white dark:bg-[#290000] px-6 py-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-600 flex items-center">
          <Package className="w-4 h-4 text-primary mr-3" />
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Total Orders: {orders.length}</span>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[3rem] shadow-2xl border border-gray-50">
          <div className="bg-[#FFF8F0] p-10 rounded-full mb-8 ring-8 ring-primary/5 inline-block">
            <ShoppingBag className="w-16 h-16 text-primary" />
          </div>
          <h2 className="text-3xl font-black text-dark mb-4 tracking-tight">No Orders Yet</h2>
          <p className="text-gray-500 mb-10 max-w-sm mx-auto font-bold leading-relaxed">You haven't placed any orders yet. Start your sweet journey with us today!</p>
          <Link to="/" className="inline-block bg-primary text-white font-black py-4 px-10 rounded-2xl shadow-2xl shadow-primary/30 hover:bg-[#2D0A0A] hover:-translate-y-1 transition-all uppercase tracking-widest text-sm">
            Explore Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {[...orders]
            .sort((a, b) => {
              const priority = { pending: 0, processing: 1, shipped: 2, delivered: 3, cancelled: 4 };
              return (priority[a.status] ?? 5) - (priority[b.status] ?? 5);
            })
            .map((order, idx) => (
            <div 
              key={order._id} 
              className="bg-white dark:bg-[#290000] rounded-[2.5rem] shadow-xl border border-gray-50 dark:border-gray-600 overflow-hidden hover:shadow-2xl transition-all duration-500 animate-slide-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="bg-[#FFF8F0]/50 dark:bg-[#1c0000]/30 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-50 dark:border-gray-600">
                <div className="flex items-center gap-6">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-primary/10">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-primary dark:text-white uppercase tracking-widest mb-1">Order #{order._id.slice(-8).toUpperCase()}</h3>
                    <div className="flex items-center text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-tight">
                      <Calendar className="w-3 h-3 mr-1" /> {new Date(order.createdAt).toLocaleDateString()}
                      <span className="mx-2">•</span>
                      <Clock className="w-3 h-3 mr-1" /> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="bg-white dark:bg-[#1c0000] px-6 py-3 rounded-2xl border border-gray-100 dark:border-gray-600 flex-grow md:flex-grow-0 text-center">
                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-400 uppercase tracking-widest mb-1">Total Paid</p>
                    <p className="text-xl font-black text-primary dark:text-white leading-none">PKR {order.totalAmount}</p>
                  </div>
                  <div className={`px-6 py-3 rounded-2xl text-center flex-grow md:flex-grow-0 ${
                    order.status === 'delivered' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1">Status</p>
                    <p className="text-xs font-black leading-none uppercase">{order.status || 'pending'}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center">
                      <ShoppingBag className="w-3 h-3 mr-2 text-primary" /> Items Purchased
                    </h4>
                    <div className="space-y-4">
                      {order.products.map((item, i) => (
                        <div key={i} className="flex items-center group">
                          <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-600 flex-shrink-0 group-hover:scale-110 transition-transform bg-gray-50 dark:bg-[#1c0000] flex items-center justify-center">
                            <img 
                              src={item.image || item.imageUrl || item.product?.imageUrl || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80'} 
                              alt={item.name || item.product?.name || 'Treat'} 
                              className="w-full h-full object-cover" 
                              onError={(e) => {
                                e.target.onerror = null; 
                                e.target.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80';
                              }}
                            />
                          </div>
                          <div className="ml-4 flex-grow">
                            <h5 className="text-sm font-black text-primary dark:text-white group-hover:text-primary transition-colors">{item.name || item.product?.name || 'Special Treat'}</h5>
                            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase">Qty: {item.quantity} × PKR {item.price}</p>
                          </div>
                          <div className="text-sm font-black text-primary dark:text-white">
                            PKR {item.quantity * item.price}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-400 uppercase tracking-widest mb-6 flex items-center">
                      <MapPin className="w-3 h-3 mr-2 text-primary" /> Delivery Address
                    </h4>
                    <div className="bg-light dark:bg-[#1c0000] p-6 rounded-[1.5rem] border border-gray-100 dark:border-gray-600">
                      <p className="text-sm font-bold text-primary dark:text-white leading-relaxed">
                        {order.shippingAddress.street}<br />
                        {order.shippingAddress.city}, {order.shippingAddress.zipCode}<br />
                        {order.shippingAddress.country || 'Pakistan'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
