import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Lock, Mail, User, ArrowRight } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post('/api/auth/google', {
        credential: credentialResponse.credential
      });
      login(data);
      navigate(redirect);
    } catch (err) {
      setError(err.response?.data?.message || 'Google signup failed');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post('/api/auth/register', { name, email, password });
      setIsRegistered(true);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
    }
  };

  if (isRegistered) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4 py-12 md:py-20 bg-[#FFF8F0]/30 rounded-[2rem] md:rounded-[3rem] mt-8 md:mt-12 mb-12 md:mb-20 shadow-inner">
        <div className="bg-white p-6 sm:p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-gray-50 w-full max-w-xl text-center animate-scale-in">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Mail className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-black text-dark tracking-tight mb-4">Check Your Email</h2>
          <p className="text-gray-500 font-bold mb-10 leading-relaxed">
            We've sent a verification link to <span className="text-primary">{email}</span>. 
            Please verify your account to start your sweet journey!
          </p>
          <Link to="/login" className="inline-block bg-primary text-white font-black px-10 py-4 rounded-2xl hover:bg-[#2D0A0A] transition-all uppercase tracking-widest text-xs shadow-xl shadow-primary/20">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 py-12 md:py-20 bg-[#FFF8F0]/30 rounded-[2rem] md:rounded-[3rem] mt-8 md:mt-12 mb-12 md:mb-20 shadow-inner">
      <div className="bg-white p-6 sm:p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-gray-50 w-full max-w-xl animate-scale-in">
        <div className="text-center mb-8 md:mb-12">
          <div className="text-4xl md:text-5xl font-black text-primary font-serif tracking-tighter mb-4 md:mb-6">Dough-Re-Mi</div>
          <h2 className="text-3xl font-black text-dark tracking-tight">Create an Account</h2>
          <p className="text-gray-400 mt-3 font-bold uppercase tracking-widest text-[10px]">Join our sweet family today</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-5 rounded-2xl mb-8 text-sm font-black border border-red-100 uppercase tracking-widest leading-loose">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-300 group-focus-within:text-primary transition-colors" />
            </div>
            <input 
              type="text" 
              required 
              className="w-full pl-16 pr-6 py-5 bg-[#FFF8F0] dark:bg-white/5 border-transparent rounded-[1.5rem] focus:ring-4 focus:ring-primary/10 focus:bg-white dark:focus:bg-white/10 focus:border-primary/20 transition-all font-bold text-dark placeholder:text-gray-400 shadow-sm" 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Full Name" 
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-300 group-focus-within:text-primary transition-colors" />
            </div>
            <input 
              type="email" 
              required 
              className="w-full pl-16 pr-6 py-5 bg-[#FFF8F0] dark:bg-white/5 border-transparent rounded-[1.5rem] focus:ring-4 focus:ring-primary/10 focus:bg-white dark:focus:bg-white/10 focus:border-primary/20 transition-all font-bold text-dark placeholder:text-gray-400 shadow-sm" 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Email address" 
            />
          </div>
          
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-300 group-focus-within:text-primary transition-colors" />
            </div>
            <input 
              type="password" 
              required 
              className="w-full pl-16 pr-6 py-5 bg-[#FFF8F0] dark:bg-white/5 border-transparent rounded-[1.5rem] focus:ring-4 focus:ring-primary/10 focus:bg-white dark:focus:bg-white/10 focus:border-primary/20 transition-all font-bold text-dark placeholder:text-gray-400 shadow-sm" 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Password (min. 6 characters)" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-[#2D0A0A] text-white font-black py-5 rounded-[1.5rem] shadow-2xl shadow-primary/30 transition-all transform active:scale-95 text-sm uppercase tracking-[0.2em] flex justify-center items-center"
          >
            {loading ? 'Preparing your badge...' : (
              <>Sign Up <ArrowRight className="w-5 h-5 ml-3" /></>
            )}
          </button>
        </form>

        <div className="my-8 flex items-center">
          <div className="flex-grow border-t border-gray-100 dark:border-white/10"></div>
          <span className="mx-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Or continue with</span>
          <div className="flex-grow border-t border-gray-100 dark:border-white/10"></div>
        </div>

        <div className="flex justify-center mb-8 overflow-hidden rounded-2xl border border-gray-100 dark:border-white/5">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Signup Failed')}
            theme="filled_black"
            shape="pill"
            width="320px"
          />
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-50 text-center">
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">
            Already have an account? <Link to={`/login?redirect=${redirect}`} className="text-primary font-black hover:underline underline-offset-4 decoration-2">Sign In here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
