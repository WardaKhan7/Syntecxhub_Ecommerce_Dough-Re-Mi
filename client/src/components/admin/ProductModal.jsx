import React, { useEffect, useState, useContext } from 'react';
import { createPortal } from 'react-dom';
import { Upload, Link as LinkIcon, X, Check, Loader2 } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const ProductModal = ({ isOpen, onClose, onSubmit, editingProduct, formData, setFormData }) => {
  const { user } = useContext(AuthContext);
  const [uploadMode, setUploadMode] = useState('url'); // 'url' or 'file'
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [availableCategories, setAvailableCategories] = useState(['Cakes', 'Theme Cakes', 'Desserts', 'Birthday', 'Hampers', 'Anniversary', 'Occasions', 'Best Sellers']);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const { data } = await axios.get('/api/products/categories');
        if (data && data.length > 0) {
          setAvailableCategories(Array.from(new Set([...availableCategories, ...data])));
        }
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    if (isOpen) {
      fetchCats();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reset upload mode when opening for a new product, or keep as url for editing
      setUploadMode('url');
      setUploadError('');
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup on unmount or close
    if (!isOpen) {
      setIsAddingNewCategory(false);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please upload a valid image (JPG, PNG, WEBP)');
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    setIsUploading(true);
    setUploadError('');

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.post('/api/upload', uploadFormData, config);
      setFormData({ ...formData, imageUrl: data.url });
      setUploadMode('url'); // Switch back to URL mode to show the result
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-10">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-dark/80 backdrop-blur-xl animate-fade-in" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative bg-white dark:bg-card-bg rounded-[3rem] w-full max-w-2xl max-h-full md:max-h-[90vh] shadow-2xl flex flex-col animate-scale-in border border-white/20 dark:border-white/5 overflow-hidden transition-colors duration-500">
        <div className="overflow-y-auto p-8 md:p-12 custom-scrollbar">
          <div className="flex justify-between items-start mb-10">
            <h2 className="text-4xl font-black text-primary tracking-tighter">
              {editingProduct ? 'Update Treat' : 'New Creation'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-light dark:hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6 text-gray-400 dark:text-dark/40" />
            </button>
          </div>
          
          <form onSubmit={onSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-gray-400 dark:text-dark/40 uppercase tracking-[0.2em] ml-1">Treat Name</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="w-full bg-light dark:bg-white/5 border-2 border-transparent rounded-2xl px-6 py-4 font-bold text-dark focus:border-primary/10 focus:bg-white dark:focus:bg-white/10 transition-all outline-none"
                  placeholder="e.g. Velvet Dream"
                />
              </div>
              
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-gray-400 dark:text-dark/40 uppercase tracking-[0.2em] ml-1">Price (PKR)</label>
                <input 
                  type="number" 
                  required 
                  value={formData.price} 
                  onChange={e => setFormData({...formData, price: e.target.value})} 
                  className="w-full bg-light dark:bg-white/5 border-2 border-transparent rounded-2xl px-6 py-4 font-bold text-dark focus:border-primary/10 focus:bg-white dark:focus:bg-white/10 transition-all outline-none"
                  placeholder="0"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center ml-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Category</label>
                  {!isAddingNewCategory && (
                    <button type="button" onClick={() => { setIsAddingNewCategory(true); setFormData({...formData, category: ''}); }} className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-dark">
                      + Add New
                    </button>
                  )}
                  {isAddingNewCategory && (
                    <button type="button" onClick={() => { setIsAddingNewCategory(false); setFormData({...formData, category: availableCategories[0] || 'Cakes'}); }} className="text-[10px] font-black text-gray-400 dark:text-dark/40 uppercase tracking-widest hover:text-dark">
                      Select Existing
                    </button>
                  )}
                </div>
                {isAddingNewCategory ? (
                  <input 
                    type="text"
                    required
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})} 
                    className="w-full bg-light dark:bg-white/5 border-2 border-transparent rounded-2xl px-6 py-4 font-bold text-dark focus:border-primary/10 focus:bg-white dark:focus:bg-white/10 transition-all outline-none"
                    placeholder="Enter new category name..."
                  />
                ) : (
                  <div className="relative">
                    <select 
                      value={formData.category} 
                      onChange={e => setFormData({...formData, category: e.target.value})} 
                      className="w-full bg-light dark:bg-white/5 border-2 border-transparent rounded-2xl px-6 py-4 font-bold text-dark focus:border-primary/10 focus:bg-white dark:focus:bg-white/10 transition-all outline-none appearance-none cursor-pointer"
                    >
                      {availableCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-30 text-dark">▼</div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-black text-gray-400 dark:text-dark/40 uppercase tracking-[0.2em] ml-1">Stock Level</label>
                <input 
                  type="number" 
                  required 
                  value={formData.stock} 
                  onChange={e => setFormData({...formData, stock: e.target.value})} 
                  className="w-full bg-light dark:bg-white/5 border-2 border-transparent rounded-2xl px-6 py-4 font-bold text-dark focus:border-primary/10 focus:bg-white dark:focus:bg-white/10 transition-all outline-none"
                  placeholder="0"
                />
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="flex justify-between items-center ml-1">
                  <label className="block text-[10px] font-black text-gray-400 dark:text-dark/40 uppercase tracking-[0.2em]">Product Image</label>
                  <div className="flex bg-light dark:bg-white/5 p-1 rounded-xl">
                    <button 
                      type="button"
                      onClick={() => setUploadMode('url')}
                      className={`flex items-center px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${uploadMode === 'url' ? 'bg-white dark:bg-white/10 text-primary shadow-sm' : 'text-gray-400 dark:text-dark/40 hover:text-dark dark:hover:text-primary'}`}
                    >
                      <LinkIcon className="w-3 h-3 mr-2" /> URL
                    </button>
                    <button 
                      type="button"
                      onClick={() => setUploadMode('file')}
                      className={`flex items-center px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${uploadMode === 'file' ? 'bg-white dark:bg-white/10 text-primary shadow-sm' : 'text-gray-400 dark:text-dark/40 hover:text-dark dark:hover:text-primary'}`}
                    >
                      <Upload className="w-3 h-3 mr-2" /> Device
                    </button>
                  </div>
                </div>

                {uploadMode === 'url' ? (
                  <div className="relative group">
                    <input 
                      type="text" 
                      required 
                      value={formData.imageUrl} 
                      onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
                      className="w-full bg-light dark:bg-white/5 border-2 border-transparent rounded-2xl px-6 py-4 font-bold text-dark focus:border-primary/10 focus:bg-white dark:focus:bg-white/10 transition-all outline-none"
                      placeholder="https://images.unsplash.com/..."
                    />
                    {formData.imageUrl && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg overflow-hidden border-2 border-white shadow-md">
                        <img src={formData.imageUrl} alt="preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`relative border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center text-center ${isUploading ? 'bg-light dark:bg-white/5 border-primary/20' : 'bg-light/50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-primary/30 hover:bg-light dark:hover:bg-white/10'}`}>
                    {isUploading ? (
                      <div className="space-y-4">
                        <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">Uploading your creation...</p>
                      </div>
                    ) : (
                      <>
                        <input 
                          type="file" 
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          accept="image/*"
                        />
                        <div className="bg-white dark:bg-white/10 p-4 rounded-2xl shadow-sm mb-4">
                          <Upload className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-xs font-black text-dark uppercase tracking-widest mb-1">Select from device</p>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-dark/40 uppercase tracking-tight">JPG, PNG or WEBP (Max 5MB)</p>
                      </>
                    )}
                  </div>
                )}
                {uploadError && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1">{uploadError}</p>}
              </div>

              <div className="md:col-span-2 space-y-3">
                <label className="block text-[10px] font-black text-gray-400 dark:text-dark/40 uppercase tracking-[0.2em] ml-1">Description</label>
                <textarea 
                  rows="3" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  className="w-full bg-light dark:bg-white/5 border-2 border-transparent rounded-2xl px-6 py-4 font-bold text-dark focus:border-primary/10 focus:bg-white dark:focus:bg-white/10 transition-all outline-none resize-none"
                  placeholder="Describe this masterpiece..."
                />
              </div>

              <div className="flex items-center space-x-4 p-4 bg-light dark:bg-white/5 rounded-2xl w-fit cursor-pointer group transition-colors duration-500" onClick={() => setFormData({...formData, isBestSeller: !formData.isBestSeller})}>
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.isBestSeller ? 'bg-primary border-primary shadow-lg shadow-primary/20' : 'border-gray-300 dark:border-white/20 group-hover:border-primary'}`}>
                  {formData.isBestSeller && <Check className="w-4 h-4 text-white" />}
                </div>
                <span className="text-[10px] font-black text-gray-400 dark:text-dark/40 uppercase tracking-widest select-none">Feature as Best Seller</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                type="submit" 
                disabled={isUploading}
                className="flex-1 bg-primary hover:bg-[#2D0A0A] text-white font-black py-5 rounded-2xl shadow-2xl shadow-primary/30 transition-all uppercase tracking-widest text-xs active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingProduct ? 'Save Changes' : 'Bake Now'}
              </button>
              <button 
                type="button" 
                onClick={onClose} 
                className="flex-1 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-dark/40 font-black py-5 rounded-2xl transition-all uppercase tracking-widest text-xs active:scale-95 transition-colors duration-500"
              >
                Discard
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ProductModal;
