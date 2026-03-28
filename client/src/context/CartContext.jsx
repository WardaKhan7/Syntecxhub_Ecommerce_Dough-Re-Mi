import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const items = sessionStorage.getItem('cartItems');
    if (items) {
      setCartItems(JSON.parse(items));
    }
  }, []);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const addToCart = (product) => {
    // Check total cart limit (20 items)
    if (totalItems >= 20) {
      toast.error('Your Sweet Box is full (max 20 items)!', {
        icon: '🧁',
        style: {
          borderRadius: '1rem',
          background: '#800000',
          color: '#fff',
          fontWeight: 'bold',
        },
      });
      return;
    }

    // Check stock availability
    if (product.stock <= 0) {
      toast.error('This item is out of stock!', {
        icon: '❌',
        style: {
          borderRadius: '1rem',
          background: '#800000',
          color: '#fff',
          fontWeight: 'bold',
        },
      });
      return;
    }

    setCartItems(prev => {
      const existing = prev.find(item => item.product === product._id);
      
      if (existing) {
        // Check per-product limit (max 5)
        if (existing.quantity >= 5) {
          toast.error('You can only add up to 5 of this item!', {
            icon: '⚠️',
            style: {
              borderRadius: '1rem',
              background: '#800000',
              color: '#fff',
              fontWeight: 'bold',
            },
          });
          return prev;
        }
        
        // Check stock limit
        if (existing.quantity >= product.stock) {
          toast.error(`Only ${product.stock} left in stock!`, {
            icon: '📦',
            style: {
              borderRadius: '1rem',
              background: '#800000',
              color: '#fff',
              fontWeight: 'bold',
            },
          });
          return prev;
        }
      } else {
        // Check stock limit for new item
        if (1 > product.stock) {
          toast.error(`Only ${product.stock} left in stock!`, {
            icon: '📦',
            style: {
              borderRadius: '1rem',
              background: '#800000',
              color: '#fff',
              fontWeight: 'bold',
            },
          });
          return prev;
        }
      }

      let newItems;
      if (existing) {
        newItems = prev.map(item => item.product === product._id ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        newItems = [...prev, { product: product._id, name: product.name, price: product.price, image: product.imageUrl, quantity: 1, stock: product.stock }];
      }
      sessionStorage.setItem('cartItems', JSON.stringify(newItems));
      return newItems;
    });
    
    toast.success(`${product.name} added to your box!`, {
      icon: '✅',
      style: {
        borderRadius: '1rem',
        background: '#fff',
        color: '#800000',
        fontWeight: 'bold',
        border: '2px solid #800000',
      },
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => {
      const newItems = prev.filter(item => item.product !== id);
      sessionStorage.setItem('cartItems', JSON.stringify(newItems));
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    sessionStorage.removeItem('cartItems');
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    
    setCartItems(prev => {
      const itemToUpdate = prev.find(item => item.product === id);
      const currentTotalWithoutItem = prev.reduce((acc, item) => item.product === id ? acc : acc + item.quantity, 0);
      
      // Check total cart limit (20 items)
      if (currentTotalWithoutItem + quantity > 20) {
        toast.error('You can only have up to 20 items in your box!', {
          icon: '🧁',
          style: {
            borderRadius: '1rem',
            background: '#800000',
            color: '#fff',
            fontWeight: 'bold',
          },
        });
        return prev;
      }

      // Check per-product limit (max 5)
      if (quantity > 5) {
        toast.error('You can only add up to 5 of this item!', {
          icon: '⚠️',
          style: {
            borderRadius: '1rem',
            background: '#800000',
            color: '#fff',
            fontWeight: 'bold',
          },
        });
        return prev;
      }

      // Check stock limit
      if (itemToUpdate && quantity > itemToUpdate.stock) {
        toast.error(`Only ${itemToUpdate.stock} left in stock!`, {
          icon: '📦',
          style: {
            borderRadius: '1rem',
            background: '#800000',
            color: '#fff',
            fontWeight: 'bold',
          },
        });
        return prev;
      }

      const newItems = prev.map(item => item.product === id ? { ...item, quantity } : item);
      sessionStorage.setItem('cartItems', JSON.stringify(newItems));
      return newItems;
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, updateQuantity, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};
