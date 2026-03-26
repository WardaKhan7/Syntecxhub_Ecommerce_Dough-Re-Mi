import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data.products || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        setLoading(false);
        // Fallback mock data for styling purposes if backend is not running yet
        setProducts([
          { _id: '1', name: 'Premium Wireless Headphones', price: 299.99, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', description: 'High-quality noise-canceling wireless headphones.', category: 'Electronics' },
          { _id: '2', name: 'Minimalist Wrist Watch', price: 149.00, imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', description: 'Elegant and simple watch for everyday use.', category: 'Accessories' },
          { _id: '3', name: 'Smart Fitness Tracker', price: 89.99, imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80', description: 'Track your steps, heart rate, and sleep.', category: 'Electronics' },
          { _id: '4', name: 'Leather Messenger Bag', price: 120.00, imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80', description: 'Genuine leather bag with multiple compartments.', category: 'Accessories' },
        ]);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="text-center mt-20 text-xl font-semibold text-gray-600">Loading products...</div>;

  return (
    <div className="py-8 animate-fade-in text-center">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-dark tracking-tight mb-4">
          Discover Your Next Favorite Item
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Shop the best quality products curated just for you. Find exactly what you're looking for.
        </p>
      </div>

      {error && products.length === 0 ? (
        <div className="text-red-500 font-semibold">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <Link to={`/product/${product._id}`} key={product._id} className="group flex flex-col pt-4">
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex-grow flex flex-col">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-64 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 flex flex-col flex-grow text-left">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{product.category}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xl font-extrabold text-primary">${product.price.toFixed(2)}</span>
                    <button className="bg-gray-100 hover:bg-primary hover:text-white p-2 text-gray-700 rounded-full transition-colors flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
