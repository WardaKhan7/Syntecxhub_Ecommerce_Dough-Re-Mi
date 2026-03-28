import React, { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, PieChart, Users } from 'lucide-react';

const Analytics = ({ orders, products, users }) => {
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const observer = new MutationObserver(() => setIsDark(document.documentElement.classList.contains('dark')));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const totalSales = orders.length;
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

  const productSales = {};
  orders.forEach(order => {
    order.products?.forEach(p => {
      const id = p.product?._id || p.product;
      if (!productSales[id]) {
        productSales[id] = {
          name: p.name || (products.find(prod => prod._id === id)?.name) || 'Unknown Treat',
          imageUrl: p.image || p.imageUrl || (products.find(prod => prod._id === id)?.imageUrl) || 'https://via.placeholder.com/150',
          category: p.category || (products.find(prod => prod._id === id)?.category) || 'Treat',
          price: Number(p.price) || (products.find(prod => prod._id === id)?.price) || 0,
          qty: 0
        };
      }
      productSales[id].qty += Number(p.quantity) || 0;
    });
  });

  const popularProducts = Object.values(productSales).sort((a, b) => b.qty - a.qty).slice(0, 5);

  const cardBg = isDark ? '#1c0000' : '#ffffff';
  const cardBorder = isDark ? 'rgb(63,51,51)' : '#f9fafb';
  const headingColor = isDark ? '#ffffff' : '#2D0A0A';

  return (
    <div className="space-y-12 p-10">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="p-8 rounded-[2rem] border transition-colors duration-500" style={{backgroundColor: isDark ? '#1c0000' : '#FFF8F0', borderColor: isDark ? 'rgb(63,51,51)' : '#fde8d8'}}>
          <TrendingUp className="w-8 h-8 text-primary mb-4" />
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Growth</h4>
          <p className="text-3xl font-black text-primary">+12.5%</p>
        </div>
        <div className="p-8 rounded-[2rem] border transition-colors duration-500" style={{backgroundColor: isDark ? '#001a2c' : '#F0F9FF', borderColor: isDark ? '#1e3a5f' : '#bfdbfe'}}>
          <ShoppingBag className="w-8 h-8 text-blue-500 mb-4" />
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Orders</h4>
          <p className="text-3xl font-black text-blue-600">{totalSales}</p>
        </div>
        <div className="p-8 rounded-[2rem] border transition-colors duration-500" style={{backgroundColor: isDark ? '#1a0030' : '#F5F3FF', borderColor: isDark ? '#3b1f5e' : '#ddd6fe'}}>
          <PieChart className="w-8 h-8 text-purple-500 mb-4" />
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Conversion</h4>
          <p className="text-3xl font-black text-purple-600">4.2%</p>
        </div>
        <div className="p-8 rounded-[2rem] border transition-colors duration-500" style={{backgroundColor: isDark ? '#001a0a' : '#F0FDF4', borderColor: isDark ? '#14532d' : '#bbf7d0'}}>
          <Users className="w-8 h-8 text-green-500 mb-4" />
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Users</h4>
          <p className="text-3xl font-black text-green-600">{users.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Popular Products */}
        <div className="p-10 rounded-[2.5rem] shadow-sm border transition-colors duration-500" style={{backgroundColor: cardBg, borderColor: cardBorder}}>
          <h3 className="text-xl font-black mb-8 flex items-center" style={{color: headingColor}}>
            <PieChart className="w-5 h-5 mr-3 text-primary" /> Popular Products
          </h3>
          <div className="space-y-6">
            {popularProducts.length > 0 ? popularProducts.map((product, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-xl overflow-hidden mr-4" style={{backgroundColor: isDark ? '#290000' : '#f9fafb'}}>
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-black line-clamp-1" style={{color: headingColor}}>{product.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{product.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-primary">{product.qty} Sold</p>
                  <p className="text-[10px] font-bold text-gray-400">PKR {product.price * product.qty}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-10 text-gray-400 font-bold uppercase tracking-widest text-xs">
                Waiting for more data...
              </div>
            )}
          </div>
        </div>

        {/* Recent Performance */}
        <div className="p-10 rounded-[2.5rem] shadow-sm border transition-colors duration-500" style={{backgroundColor: cardBg, borderColor: cardBorder}}>
          <h3 className="text-xl font-black mb-8 flex items-center" style={{color: headingColor}}>
            <TrendingUp className="w-5 h-5 mr-3 text-primary" /> Recent Performance
          </h3>
          <div className="space-y-8">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <span className="text-[10px] font-black inline-block py-1 px-2 uppercase rounded-full text-primary" style={{backgroundColor: isDark ? '#290000' : '#FFF8F0'}}>
                  Weekly Goal
                </span>
                <span className="text-xs font-black text-primary">70%</span>
              </div>
              <div className="overflow-hidden h-2 mb-4 rounded-full" style={{backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#f3f4f6'}}>
                <div style={{width: '70%'}} className="h-full rounded-full bg-primary"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl" style={{backgroundColor: isDark ? '#290000' : '#FFF8F0'}}>
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Avg Order Value</p>
                <p className="text-xl font-black" style={{color: headingColor}}>PKR {totalSales > 0 ? Math.round(totalRevenue / totalSales) : 0}</p>
              </div>
              <div className="p-6 rounded-2xl" style={{backgroundColor: isDark ? '#290000' : '#FFF8F0'}}>
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Refund Rate</p>
                <p className="text-xl font-black" style={{color: headingColor}}>0.5%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
