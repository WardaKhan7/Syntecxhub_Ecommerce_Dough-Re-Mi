import React from 'react';
import { Box, ShoppingCart, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';

const StatsGrid = ({ productsCount, ordersCount, revenue }) => {
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const observer = new MutationObserver(() => setIsDark(document.documentElement.classList.contains('dark')));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const stats = [
    { label: 'Total Items', value: productsCount, icon: Box, color: 'text-primary' },
    { label: 'Total Orders', value: ordersCount, icon: ShoppingCart, color: 'text-primary' },
    { label: 'Revenue', value: `PKR ${revenue}`, icon: TrendingUp, color: 'text-primary' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      {stats.map((stat, i) => (
        <div key={i} className="p-10 rounded-[2.5rem] shadow-2xl border relative overflow-hidden group transition-all duration-500"
          style={{ backgroundColor: isDark ? '#1c0000' : '#ffffff', borderColor: isDark ? 'rgb(63,51,51)' : '#f9fafb' }}>
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <stat.icon className={`w-24 h-24 ${stat.color}`} />
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4" style={{ color: isDark ? '#9ca3af' : '#9ca3af' }}><code>{stat.label}</code></h3>
          <p className="text-5xl font-black tracking-tighter" style={{ color: isDark ? '#ffffff' : '#800000' }}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
