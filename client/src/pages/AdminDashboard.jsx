import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Filter, Users, Box, ShoppingCart } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if(user && user.role === 'admin') {
      const fetchAdminData = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const { data: resProducts } = await axios.get('/api/products');
          setProducts(resProducts.products || []);
          
          const { data: resOrders } = await axios.get('/api/orders', config);
          setOrders(resOrders || []);
        } catch (error) {
          console.error('Error fetching admin data', error);
          // Fallback demo data
          setProducts([
            { _id: '1', name: 'Demo Product 1', price: 100, stock: 10 },
            { _id: '2', name: 'Demo Product 2', price: 250, stock: 0 },
          ]);
          setOrders([
            { _id: '101', totalAmount: 350, isPaid: true, user: { name: 'John Doe' } }
          ]);
        }
      };
      
      fetchAdminData();
    }
  }, [user]);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <div className="py-8 max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-extrabold text-dark tracking-tight">Admin Dashboard</h1>
        <div className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-lg shadow-sm">
          Welcome, {user.name}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 flex items-center border-l-4 border-l-blue-500">
          <div className="bg-blue-100 p-4 rounded-xl mr-4"><Box className="text-blue-600 w-8 h-8" /></div>
          <div>
            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Products</h3>
            <p className="text-3xl font-extrabold text-dark">{products.length}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100 flex items-center border-l-4 border-l-green-500">
          <div className="bg-green-100 p-4 rounded-xl mr-4"><ShoppingCart className="text-green-600 w-8 h-8" /></div>
          <div>
            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Orders</h3>
            <p className="text-3xl font-extrabold text-dark">{orders.length}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 flex items-center border-l-4 border-l-purple-500">
          <div className="bg-purple-100 p-4 rounded-xl mr-4"><Users className="text-purple-600 w-8 h-8" /></div>
          <div>
            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Revenue</h3>
            <p className="text-3xl font-extrabold text-dark">
              ${orders.reduce((acc, order) => acc + order.totalAmount, 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold flex items-center text-gray-800"><Filter className="w-5 h-5 mr-2" /> Products List</h2>
          <button className="bg-dark hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
            + New Product
          </button>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-8 py-4">ID</th>
                <th className="px-8 py-4">Name</th>
                <th className="px-8 py-4">Price</th>
                <th className="px-8 py-4">Stock</th>
                <th className="px-8 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(product => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-4 text-sm font-medium text-gray-900">{product._id.substring(0,8)}...</td>
                  <td className="px-8 py-4 text-sm font-bold text-gray-800">{product.name}</td>
                  <td className="px-8 py-4 text-sm font-semibold text-primary">${product.price.toFixed(2)}</td>
                  <td className="px-8 py-4">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4 font-bold">Edit</button>
                    <button className="text-red-600 hover:text-red-900 font-bold">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && <div className="text-center py-10 font-medium text-gray-500">No products found.</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
