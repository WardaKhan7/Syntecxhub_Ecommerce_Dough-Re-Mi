import React from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, X } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', type = 'danger' }) => {
  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-dark/80 backdrop-blur-md animate-fade-in" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative bg-white dark:bg-card-bg rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-scale-in border border-white/20 dark:border-white/5 transition-colors duration-500">
        <div className="p-8 md:p-10 text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-500 ${
            type === 'danger' ? 'bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400' : 'bg-primary/10 dark:bg-primary/20 text-primary'
          }`}>
            <AlertCircle className="w-10 h-10" />
          </div>
          
          <h2 className="text-2xl font-black text-dark tracking-tight mb-4">{title}</h2>
          <p className="text-gray-400 dark:text-dark/40 font-bold text-sm leading-relaxed mb-10">{message}</p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onConfirm}
              className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl active:scale-95 ${
                type === 'danger' 
                ? 'bg-red-500 text-white shadow-red-500/20 hover:bg-red-600' 
                : 'bg-primary text-white shadow-primary/20 hover:bg-[#2D0A0A]'
              }`}
            >
              {confirmText}
            </button>
            <button 
              onClick={onClose}
              className="flex-1 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-dark/40 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-200 dark:hover:bg-white/10 transition-all active:scale-95 transition-colors duration-500"
            >
              Cancel
            </button>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-300 dark:text-dark/20 hover:text-dark dark:hover:text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ConfirmationModal;
