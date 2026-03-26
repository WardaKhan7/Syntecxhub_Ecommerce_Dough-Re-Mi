import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const items = localStorage.getItem('cartItems');
    if (items) {
      setCartItems(JSON.parse(items));
    }
  }, []);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product === product._id);
      let newItems;
      if (existing) {
        newItems = prev.map(item => item.product === product._id ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        newItems = [...prev, { product: product._id, name: product.name, price: product.price, image: product.imageUrl, quantity: 1 }];
      }
      localStorage.setItem('cartItems', JSON.stringify(newItems));
      return newItems;
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => {
      const newItems = prev.filter(item => item.product !== id);
      localStorage.setItem('cartItems', JSON.stringify(newItems));
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
