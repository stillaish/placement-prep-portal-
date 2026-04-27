import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="mb-8 flex flex-col items-center">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 mb-4">
          <span className="material-symbols-outlined text-2xl">terminal</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">DevLearn</h1>
        <p className="text-gray-500 text-sm mt-1">Sign in to continue your path</p>
      </div>

      <div className="w-full max-w-[480px] bg-white rounded-[40px] border border-gray-100 shadow-xl p-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Account Type Toggle */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Account Type</p>
            <div className="bg-gray-50 p-1 rounded-2xl flex border border-gray-100">
              <button 
                type="button"
                onClick={() => setRole('student')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                  role === 'student' ? 'bg-white text-primary shadow-sm' : 'text-gray-400'
                }`}
              >
                Student
              </button>
              <button 
                type="button"
                onClick={() => setRole('admin')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                  role === 'admin' ? 'bg-white text-primary shadow-sm' : 'text-gray-400'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Email */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Email Address</p>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">alternate_email</span>
              <input 
                type="email" 
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:border-primary outline-none transition-all"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Password</p>
              <button type="button" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">Forgot?</button>
            </div>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">lock</span>
              <input 
                type="password" 
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:border-primary outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs font-medium text-center">{error}</p>}

          <button 
            type="submit"
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Sign In
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
              <span className="bg-white px-4 text-gray-300">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button type="button" className="flex items-center justify-center gap-3 py-3 border border-gray-100 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
              <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" className="w-5 h-5 opacity-70" />
              GitHub
            </button>
            <button type="button" className="flex items-center justify-center gap-3 py-3 border border-gray-100 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
              <img src="https://www.gstatic.com/images/branding/product/2x/google_64dp.png" alt="Google" className="w-5 h-5" />
              Google
            </button>
          </div>
        </form>
      </div>

      <p className="mt-8 text-sm text-gray-500">
        Don't have an account? <Link to="/signup" className="text-primary font-bold hover:underline">Get Started</Link>
      </p>

      <div className="mt-20 flex flex-col md:flex-row items-center gap-8 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
        <p>© 2024 DevLearn Education Inc. Built for engineers.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-gray-500">Documentation</a>
          <a href="#" className="hover:text-gray-500">Changelog</a>
          <a href="#" className="hover:text-gray-500">Privacy</a>
          <a href="#" className="hover:text-gray-500">GitHub</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
