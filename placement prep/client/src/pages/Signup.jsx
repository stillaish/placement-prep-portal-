import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signup(formData.name, formData.email, formData.password, formData.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 mb-4">
          <span className="material-symbols-outlined text-2xl">rocket_launch</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create your account</h1>
        <p className="text-gray-500 text-sm mt-1">Start your journey to top-tier engineering roles</p>
      </div>

      <div className="w-full max-w-[520px] bg-white rounded-[40px] border border-gray-100 shadow-xl p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
             {/* Role Selection */}
            <div className="col-span-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Join as</p>
              <div className="bg-gray-50 p-1 rounded-2xl flex border border-gray-100">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, role: 'student'})}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
                    formData.role === 'student' ? 'bg-white text-primary shadow-sm' : 'text-gray-400'
                  }`}
                >
                  Student
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, role: 'admin'})}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
                    formData.role === 'admin' ? 'bg-white text-primary shadow-sm' : 'text-gray-400'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Name */}
            <div className="col-span-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Full Name</p>
              <input 
                type="text" 
                required
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:border-primary outline-none transition-all"
                placeholder="Alex Rivera"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            {/* Email */}
            <div className="col-span-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Email Address</p>
              <input 
                type="email" 
                required
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:border-primary outline-none transition-all"
                placeholder="name@company.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            {/* Password */}
            <div className="col-span-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Password</p>
              <input 
                type="password" 
                required
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:border-primary outline-none transition-all"
                placeholder="Min. 8 characters"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs font-medium text-center">{error}</p>}

          <button 
            type="submit"
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-4"
          >
            Create Account
          </button>

          <p className="text-[10px] text-gray-400 text-center leading-relaxed">
            By creating an account, you agree to our <a href="#" className="text-gray-900 underline">Terms of Service</a> and <a href="#" className="text-gray-900 underline">Privacy Policy</a>.
          </p>
        </form>
      </div>

      <p className="mt-8 text-sm text-gray-500">
        Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
      </p>
    </div>
  );
};

export default Signup;
