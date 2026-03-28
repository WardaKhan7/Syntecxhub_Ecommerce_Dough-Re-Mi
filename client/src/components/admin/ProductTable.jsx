import React from 'react';
import { Star } from 'lucide-react';

const ProductTable = ({ products, onEdit, onDelete }) => {
  return (
    <div className="p-0 overflow-x-auto">
      <table className="w-full whitespace-nowrap">
        <thead>
          <tr className="text-left text-[10px] font-black text-gray-400 dark:text-gray-400 uppercase tracking-[0.2em] bg-transparent border-b border-gray-50 dark:border-[rgb(63,51,51)]">
            <th className="px-10 py-6">Reference</th>
            <th className="px-10 py-6">Cake Name</th>
            <th className="px-10 py-6">Category</th>
            <th className="px-10 py-6">Price</th>
            <th className="px-10 py-6">Availability</th>
            <th className="px-10 py-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {products.map(product => (
            <tr key={product._id} className="hover:bg-primary/5 transition-colors group">
              <td className="px-10 py-8 text-xs font-black text-gray-300 dark:text-gray-500 uppercase tracking-widest group-hover:text-primary transition-colors">
                #{product._id.substring(0, 8)}
              </td>
              <td className="px-10 py-8 text-sm font-black text-dark dark:text-white tracking-tight">
                <div className="flex items-center">
                  {product.name}
                  {product.isBestSeller && <Star className="w-3 h-3 ml-2 text-accent fill-current" />}
                </div>
              </td>
              <td className="px-10 py-8 text-[10px] font-black text-gray-400 dark:text-gray-400 uppercase tracking-widest">
                {product.category}
              </td>
              <td className="px-10 py-8 text-lg font-black text-primary tracking-tighter">
                PKR {product.price}
              </td>
              <td className="px-10 py-8">
                <span className={`px-4 py-1.5 inline-flex text-[10px] font-black uppercase tracking-widest rounded-full border ${product.stock > 0 ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-100 dark:border-green-500/20' : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-100 dark:border-red-500/20'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : 'Sold Out'}
                </span>
              </td>
              <td className="px-10 py-8 text-right">
                <button 
                  onClick={() => onEdit(product)}
                  className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-dark transition-colors mr-6"
                >
                  Edit
                </button>
                <button 
                  onClick={() => onDelete(product._id)}
                  className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-700 transition-colors"
                >
                  Archive
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && (
        <div className="text-center py-20 font-black text-gray-300 uppercase tracking-widest">
          No products in the oven yet.
        </div>
      )}
    </div>
  );
};

export default ProductTable;
