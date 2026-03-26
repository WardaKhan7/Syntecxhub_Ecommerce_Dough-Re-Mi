import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ArrowLeft, Check, ShieldCheck } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        // Fallback for demo
        setProduct({
          _id: id,
          name: 'Premium Wireless Headphones',
          price: 299.99,
          imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
          description: 'Experience pure music without cords. These premium wireless headphones feature active noise canceling, 30-hour battery life, and plush ear cushions for all-day comfort. Designed for audiophiles who demand the best.',
          category: 'Electronics',
          stock: 15
        });
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center mt-20 text-xl font-semibold">Loading...</div>;
  if (!product) return <div className="text-center mt-20 text-xl text-red-500">Product not found</div>;

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="py-8 max-w-6xl mx-auto px-4">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-gray-500 hover:text-primary mb-8 transition-colors font-medium"
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Catalog
      </button>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        <div className="md:w-1/2 p-8 flex items-center justify-center bg-gray-50">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="max-w-full h-auto object-contain rounded-2xl shadow-sm hover:scale-105 transition-transform duration-500" 
            style={{ maxHeight: '500px' }}
          />
        </div>
        
        <div className="md:w-1/2 p-10 lg:p-14 flex flex-col justify-center">
          <div className="mb-2 text-sm font-semibold text-primary uppercase tracking-wider">{product.category}</div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-dark mb-4 leading-tight">{product.name}</h1>
          <div className="text-3xl font-bold text-gray-900 mb-6">${product.price.toFixed(2)}</div>
          
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            {product.description}
          </p>
          
          <div className="flex items-center space-x-4 mb-8">
            <div className={`px-4 py-2 rounded-full text-sm font-bold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </div>
            <div className="flex items-center text-gray-500 text-sm font-medium">
              <ShieldCheck className="w-5 h-5 mr-1 text-blue-500" /> 1 Year Warranty
            </div>
          </div>

          <button 
            disabled={product.stock === 0}
            onClick={handleAddToCart}
            className={`w-full py-4 px-8 rounded-xl flex items-center justify-center text-lg font-bold text-white transition-all transform active:scale-95 ${
              product.stock === 0 
                ? 'bg-gray-300 cursor-not-allowed' 
                : added 
                  ? 'bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/30' 
                  : 'bg-primary hover:bg-blue-700 shadow-xl shadow-blue-500/30'
            }`}
          >
            {added ? (
              <><Check className="w-6 h-6 mr-2" /> Added to Cart</>
            ) : (
              <><ShoppingCart className="w-6 h-6 mr-2" /> Add to Cart</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
