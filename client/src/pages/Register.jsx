import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Lock, Mail, User } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post('/api/auth/register', { name, email, password });
      login(data);
      navigate(redirect);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 w-full max-w-md">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-dark tracking-tight">Create an Account</h2>
          <p className="text-gray-500 mt-2 font-medium">Sign up to get started</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-semibold border border-red-100">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              required 
              placeholder="Full Name"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-gray-200 rounded-xl shadow-inner focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium text-gray-900" 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="email" 
              required 
              placeholder="Email address"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-gray-200 rounded-xl shadow-inner focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium text-gray-900" 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="password" 
              required 
              placeholder="Password (min. 6 characters)"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-gray-200 rounded-xl shadow-inner focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium text-gray-900" 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all text-lg"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <p className="text-center text-gray-600 mt-8 font-medium">
          Already have an account? <Link to={`/login?redirect=${redirect}`} className="text-primary font-bold hover:underline">Log in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
