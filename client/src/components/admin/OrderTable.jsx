import React from 'react';

const OrderTable = ({ orders, onUpdateStatus }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-100 dark:border-green-500/20';
      case 'processing': return 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20';
      case 'shipped': return 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-500/20';
      case 'cancelled': return 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-100 dark:border-red-500/20';
      default: return 'bg-gray-50 dark:bg-white/10 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-white/20';
    }
  };

  const statusPriority = { pending: 0, processing: 1, shipped: 2, delivered: 3, cancelled: 4 };
  const sortedOrders = [...orders].sort((a, b) =>
    (statusPriority[a.status] ?? 5) - (statusPriority[b.status] ?? 5)
  );

  return (
    <div className="p-0 overflow-x-auto">
      <table className="w-full whitespace-nowrap">
        <thead>
          <tr className="text-left text-[10px] font-black text-gray-400 dark:text-gray-400 uppercase tracking-[0.2em] bg-transparent border-b border-gray-50 dark:border-[rgb(63,51,51)]">
            <th className="px-10 py-6">Order ID</th>
            <th className="px-10 py-6">Customer</th>
            <th className="px-10 py-6">Total</th>
            <th className="px-10 py-6">Status</th>
            <th className="px-10 py-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {sortedOrders.map(order => (
            <tr key={order._id} className="hover:bg-primary/5 transition-colors group">
              <td className="px-10 py-8 text-xs font-black text-gray-300 dark:text-gray-500 uppercase tracking-widest group-hover:text-primary transition-colors">
                #{order._id.substring(0, 8)}
              </td>
              <td className="px-10 py-8 text-sm font-black text-dark dark:text-white tracking-tight">
                {order.user?.name || 'Guest Customer'}
              </td>
              <td className="px-10 py-8 text-lg font-black text-primary tracking-tighter">
                PKR {order.totalAmount}
              </td>
              <td className="px-10 py-8">
                <span className={`px-4 py-1.5 inline-flex text-[10px] font-black uppercase tracking-widest rounded-full border ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </td>
              <td className="px-10 py-8 text-right">
                <select 
                  value={order.status}
                  onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                  className="text-[10px] font-black text-primary uppercase tracking-widest bg-transparent border-none focus:ring-0 cursor-pointer"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && (
        <div className="text-center py-20 font-black text-gray-300 uppercase tracking-widest">
          No orders received yet.
        </div>
      )}
    </div>
  );
};

export default OrderTable;
