import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Settings = () => {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    targetCompany: user?.targetCompany || 'Amazon',
    bio: 'Frontend Engineer passionate about clean code and system design. Preparing for senior roles at top tech companies.',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  const handleUpdateProfile = async () => {
    try {
      await axios.patch('http://localhost:5001/api/auth/update', {
        name: formData.name,
        email: formData.email,
        targetCompany: formData.targetCompany
      });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    }
  };

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setMessage({ type: 'error', text: 'Passwords do not match.' });
    }
    try {
      await axios.post('http://localhost:5001/api/auth/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to update password.' });
    }
  };

  const handleLogoutAll = async () => {
    try {
      await axios.post('http://localhost:5001/api/auth/logoutAll');
      logout();
    } catch (err) {
      console.error('Logout all error:', err);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-8">
      {/* Left Column: Forms */}
      <div className="col-span-12 lg:col-span-8 space-y-8">
        <div className="flex flex-col mb-2">
          <h2 className="text-4xl font-bold text-gray-900">Account Settings</h2>
          <p className="text-gray-500 mt-1">Manage your profile, skills, and platform preferences.</p>
        </div>

        {/* Profile Info Card */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-50">
            <h3 className="text-xl font-bold text-gray-900">Profile info</h3>
          </div>
          <div className="p-8 space-y-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&q=80&w=200" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full border-4 border-white flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                </button>
              </div>
              <div>
                <p className="font-bold text-gray-900">Profile Photo</p>
                <p className="text-xs text-gray-400">Accepted formats: JPG, PNG. Max size 2MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:border-primary outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:border-primary outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Bio</label>
              <textarea 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm h-32 focus:bg-white focus:border-primary outline-none transition-all resize-none"
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
              ></textarea>
            </div>

            {message.text && (
              <div className={`p-4 rounded-2xl text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {message.text}
              </div>
            )}

            <div className="flex justify-end">
              <button 
                onClick={handleUpdateProfile}
                className="px-10 py-3 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-50">
            <h3 className="text-xl font-bold text-gray-900">Change password</h3>
          </div>
          <div className="p-8 space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Current Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:border-primary outline-none transition-all"
                placeholder="••••••••"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">New Password</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:border-primary outline-none transition-all"
                  placeholder="Min. 8 characters"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Confirm Password</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:border-primary outline-none transition-all"
                  placeholder="Repeat new password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={handleUpdatePassword}
                className="px-10 py-3 bg-primary text-white rounded-full font-bold hover:scale-105 transition-all"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Settings Meta */}
      <div className="col-span-12 lg:col-span-4 space-y-8 lg:pt-20">
        {/* Target Company */}
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary">domain</span>
            <h4 className="font-bold text-gray-900">Target company</h4>
          </div>
          <div className="flex flex-wrap gap-3">
            {['Amazon', 'Google', 'Meta', 'Microsoft', 'Netflix'].map((company) => (
              <button 
                key={company} 
                onClick={() => setFormData({...formData, targetCompany: company})}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all flex items-center gap-2 ${
                  formData.targetCompany === company ? 'bg-blue-50 border-blue-600 text-blue-600' : 'bg-white border-gray-100 text-gray-600 hover:border-gray-300'
                }`}
              >
                {company}
                {formData.targetCompany === company && <span className="material-symbols-outlined text-sm">check_circle</span>}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-10 mb-6">
            <span className="material-symbols-outlined text-primary">psychology</span>
            <h4 className="font-bold text-gray-900">Skills</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Java', 'Python', 'DSA'].map(skill => (
              <span key={skill} className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-bold rounded-lg flex items-center gap-2">
                {skill}
                <button className="material-symbols-outlined text-xs hover:text-red-500">close</button>
              </span>
            ))}
            <button className="px-3 py-1.5 border border-dashed border-gray-300 text-gray-400 text-xs font-bold rounded-lg hover:border-primary hover:text-primary transition-all flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">add</span>
              Add Skill
            </button>
          </div>
        </div>

        {/* Security / Session */}
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <h4 className="text-xl font-bold text-gray-900 mb-6">Security</h4>
          <div className="bg-gray-50 rounded-2xl p-6">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-xs">key</span>
              Session Status
            </p>
            <div className="bg-white border border-gray-100 p-3 rounded-xl font-mono text-[10px] text-gray-400 truncate mb-4">
              {localStorage.getItem('token')?.substring(0, 30)}...
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-gray-500 font-bold">Active JWT Session</p>
              <span className="bg-green-50 text-green-600 text-[8px] font-bold px-2 py-0.5 rounded uppercase">Expires in 2h</span>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-gray-900">Login History</p>
                <p className="text-[10px] text-gray-500">Chrome on macOS • SF, USA</p>
              </div>
              <span className="text-[10px] font-bold text-gray-400">CURRENT</span>
            </div>
          </div>

          <button 
            onClick={handleLogoutAll}
            className="w-full mt-10 py-3 border border-red-200 text-red-600 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-all"
          >
            <span className="material-symbols-outlined">logout</span>
            Logout all devices
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
