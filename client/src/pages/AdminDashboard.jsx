import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Filter, Users, Box, ShoppingCart, TrendingUp, Plus, LayoutDashboard, Package, ClipboardList, UserCheck } from 'lucide-react';
import StatsGrid from '../components/admin/StatsGrid';
import ProductTable from '../components/admin/ProductTable';
import OrderTable from '../components/admin/OrderTable';
import UserTable from '../components/admin/UserTable';
import Analytics from '../components/admin/Analytics';
import ProductModal from '../components/admin/ProductModal';
import ConfirmationModal from '../components/admin/ConfirmationModal';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analytics');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver(() => setIsDark(document.documentElement.classList.contains('dark')));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    type: 'danger',
    onConfirm: () => {}
  });

  const closeConfirmModal = () => setConfirmModal(prev => ({ ...prev, isOpen: false }));

  const openConfirmModal = (config) => {
    setConfirmModal({
      isOpen: true,
      title: config.title,
      message: config.message,
      confirmText: config.confirmText || 'Confirm',
      type: config.type || 'danger',
      onConfirm: async () => {
        await config.onConfirm();
        closeConfirmModal();
      }
    });
  };

  useEffect(() => {
    if(user && user.role === 'admin') {
      const fetchAdminData = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const { data: resProducts } = await axios.get('/api/products?pageSize=100');
          setProducts(resProducts.products || []);
          
          const { data: resOrders } = await axios.get('/api/orders', config);
          setOrders(resOrders || []);

          const { data: resUsers } = await axios.get('/api/users', config);
          setUsers(resUsers || []);

          setLoading(false);
        } catch (error) {
          console.error('Error fetching admin data', error);
          setProducts([
            { _id: '1', name: 'Rich Chocolate Truffle Cake', price: 500, stock: 10, category: 'Cakes' },
            { _id: '2', name: 'Tropical Fruit Almond Cake', price: 599, stock: 0, category: 'Cakes' },
          ]);
          setOrders([
            { _id: '101', totalAmount: 350, status: 'pending', user: { name: 'John Doe' } }
          ]);
          setUsers([
            { _id: '1', name: 'Admin User', email: 'admin@doughremi.com', role: 'admin' },
            { _id: '2', name: 'John Doe', email: 'john@example.com', role: 'user' }
          ]);
          setLoading(false);
        }
      };
      
      fetchAdminData();
    }
  }, [user]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', price: '', description: '', imageUrl: '', category: 'Cakes', stock: 0, isBestSeller: false
  });

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description || '',
      imageUrl: product.imageUrl,
      category: product.category,
      stock: product.stock,
      isBestSeller: product.isBestSeller || false
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({
      name: '', price: '', description: '', imageUrl: '', category: 'Cakes', stock: 0, isBestSeller: false
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    openConfirmModal({
      title: 'Remove Treat',
      message: 'Are you sure you want to remove this treat? This action cannot be undone.',
      confirmText: 'Remove',
      onConfirm: async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          await axios.delete(`/api/products/${id}`, config);
          setProducts(products.filter(p => p._id !== id));
        } catch (err) {
          alert('Failed to remove product');
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      if (editingProduct) {
        const { data } = await axios.put(`/api/products/${editingProduct._id}`, formData, config);
        setProducts(products.map(p => p._id === data._id ? data : p));
      } else {
        const { data } = await axios.post('/api/products', formData, config);
        setProducts([data, ...products]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save product: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(`/api/orders/${id}`, { status }, config);
      setOrders(orders.map(o => o._id === id ? { ...o, status: data.status } : o));
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  const handlePromoteUser = (id) => {
    openConfirmModal({
      title: 'Promote to Admin',
      message: 'Are you sure you want to grant administrative privileges to this user?',
      confirmText: 'Promote',
      type: 'primary',
      onConfirm: async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const { data } = await axios.put(`/api/users/${id}`, { role: 'admin' }, config);
          setUsers(users.map(u => u._id === id ? data : u));
        } catch (err) {
          alert('Failed to promote user');
        }
      }
    });
  };

  const handleDeleteUser = (id) => {
    openConfirmModal({
      title: 'Remove User',
      message: 'Are you sure you want to remove this user account? All their data will be lost.',
      confirmText: 'Remove',
      onConfirm: async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          await axios.delete(`/api/users/${id}`, config);
          setUsers(users.filter(u => u._id !== id));
        } catch (err) {
          alert('Failed to delete user');
        }
      }
    });
  };

  if (user === undefined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="mt-6 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Authenticating...</p>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(o => 
    o._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <p className="mt-6 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Syncing inventory...</p>
    </div>
  );

  const revenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-primary tracking-tighter mb-2">Bakery Manager</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[8px] md:text-[10px]">Administrative Dashboard</p>
        </div>
        <div className="px-4 md:px-6 py-2 md:py-3 rounded-2xl shadow-xl border flex items-center"
          style={{backgroundColor: isDark ? '#1c0000' : '#ffffff', borderColor: isDark ? 'rgb(63,51,51)' : '#f9fafb'}}>
          <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
          <span className="text-[10px] md:text-xs font-black uppercase tracking-widest whitespace-nowrap" style={{color: isDark ? '#ffffff' : '#2D0A0A'}}>Active: {user.name}</span>
        </div>
      </div>
      
      {/* Stats */}
      <StatsGrid productsCount={products.length} ordersCount={orders.length} revenue={revenue} />

      {/* Tabs */}
      <div className="flex space-x-3 md:space-x-4 mb-8 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        <button 
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'analytics' ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-gray-400 hover:text-primary'}`}
          style={activeTab !== 'analytics' ? {backgroundColor: isDark ? '#1c0000' : '#ffffff'} : {}}
        >
          <TrendingUp className="w-4 h-4 mr-2 text-primary" /> Analytics
        </button>
        <button 
          onClick={() => setActiveTab('products')}
          className={`flex items-center px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'products' ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-gray-400 hover:text-primary'}`}
          style={activeTab !== 'products' ? {backgroundColor: isDark ? '#1c0000' : '#ffffff'} : {}}
        >
          <Package className="w-4 h-4 mr-2 text-primary" /> Products
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`flex items-center px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'orders' ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-gray-400 hover:text-primary'}`}
          style={activeTab !== 'orders' ? {backgroundColor: isDark ? '#1c0000' : '#ffffff'} : {}}
        >
          <ClipboardList className="w-4 h-4 mr-2 text-primary" /> Orders
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`flex items-center px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'users' ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-gray-400 hover:text-primary'}`}
          style={activeTab !== 'users' ? {backgroundColor: isDark ? '#1c0000' : '#ffffff'} : {}}
        >
          <Users className="w-4 h-4 mr-2 text-primary" /> Users
        </button>
      </div>

      {/* Content Area */}
      <div className="rounded-[2rem] md:rounded-[3rem] shadow-2xl border overflow-hidden relative transition-colors duration-500"
        style={{backgroundColor: isDark ? '#1c0000' : '#ffffff', borderColor: isDark ? 'rgb(63,51,51)' : '#f9fafb'}}>
        {(activeTab === 'products' || activeTab === 'orders' || activeTab === 'users') && (
          <div className="px-6 md:px-10 py-8 md:py-10 border-b flex flex-col sm:flex-row justify-between items-center gap-6 transition-colors duration-500"
            style={{backgroundColor: isDark ? '#290000' : '#fff8f0', borderColor: isDark ? 'rgb(63,51,51)' : '#f9fafb'}}>
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full sm:w-auto">
              <h2 className="text-xl md:text-2xl font-black flex items-center tracking-tight whitespace-nowrap" style={{color: isDark ? '#ffffff' : '#2D0A0A'}}>
                <Filter className="w-5 h-5 md:w-6 md:h-6 mr-3 text-primary" /> 
                {activeTab === 'products' ? 'Inventory' : activeTab === 'orders' ? 'Orders' : 'Users'}
              </h2>
              <div className="relative w-full md:w-64">
                <input 
                  type="text" 
                  placeholder={`Search ${activeTab}...`}
                  className="w-full border rounded-xl md:rounded-2xl py-2.5 md:py-3 px-10 text-[10px] md:text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                  style={{backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff', borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#f3f4f6', color: isDark ? '#ffffff' : '#2D0A0A'}}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <TrendingUp className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
            {activeTab === 'products' && (
              <button 
                onClick={handleAddNew}
                className="w-full sm:w-auto bg-primary hover:bg-[#2D0A0A] text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-primary/20 flex items-center justify-center whitespace-nowrap"
              >
                <Plus className="w-4 h-4 mr-2" /> Add New Cake
              </button>
            )}
          </div>
        )}
        
        <div className="overflow-x-auto">
          {activeTab === 'analytics' ? (
            <Analytics orders={orders} products={products} users={users} />
          ) : activeTab === 'products' ? (
            <ProductTable 
              products={filteredProducts} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          ) : activeTab === 'orders' ? (
            <OrderTable 
              orders={filteredOrders} 
              onUpdateStatus={handleUpdateOrderStatus} 
            />
          ) : (
            <UserTable 
              users={filteredUsers} 
              onPromote={handlePromoteUser} 
              onDelete={handleDeleteUser} 
            />
          )}
        </div>
      </div>

      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        editingProduct={editingProduct}
        formData={formData}
        setFormData={setFormData}
      />

      <ConfirmationModal 
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        type={confirmModal.type}
      />
    </div>
  );
};

export default AdminDashboard;
