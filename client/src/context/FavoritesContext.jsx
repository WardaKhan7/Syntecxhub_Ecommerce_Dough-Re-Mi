import React, { createContext, useState, useEffect } from 'react';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = sessionStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const addToFavorites = (product) => {
    const exists = favorites.find((item) => item._id === product._id);
    if (!exists) {
      const newFavorites = [...favorites, product];
      setFavorites(newFavorites);
      sessionStorage.setItem('favorites', JSON.stringify(newFavorites));
    }
  };

  const removeFromFavorites = (id) => {
    const newFavorites = favorites.filter((item) => item._id !== id);
    setFavorites(newFavorites);
    sessionStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const isFavorite = (id) => {
    return favorites.some((item) => item._id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
