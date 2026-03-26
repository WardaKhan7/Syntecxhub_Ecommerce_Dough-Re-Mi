import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-8 border-t border-gray-800">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-xl font-bold mb-4">Syntecxhub E-Commerce</h2>
        <p className="text-sm text-gray-400 mb-4">
          Built with MERN Stack • React, Node.js, Express, MongoDB
        </p>
        <p className="text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Syntecxhub. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
