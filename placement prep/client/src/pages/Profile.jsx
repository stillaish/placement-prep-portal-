import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden p-10 flex flex-col md:flex-row items-center gap-10">
        <div className="w-40 h-40 rounded-full border-8 border-gray-50 overflow-hidden shadow-inner">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&q=80&w=400" alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h2 className="text-4xl font-bold text-gray-900">{user?.name}</h2>
            <span className="bg-primary/10 text-primary text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest border border-primary/20">PRO MEMBER</span>
          </div>
          <p className="text-gray-500 text-lg max-w-2xl mb-8">Frontend Engineer passionate about clean code and system design. Currently preparing for technical rounds at Tier-1 companies.</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            {['Java', 'Python', 'React', 'System Design', 'Algorithms'].map(tag => (
              <span key={tag} className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-600">{tag}</span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <button className="px-8 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">Edit Profile</button>
          <button className="px-8 py-3 border border-gray-200 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-all">Share Profile</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Progress Stats */}
        <div className="md:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-8">Performance Summary</h3>
            <div className="space-y-6">
              {[
                { label: 'Accuracy Rate', value: '88.4%', color: 'text-green-600' },
                { label: 'Avg. Problem Time', value: '24m', color: 'text-blue-600' },
                { label: 'Mock Test Score', value: '742/800', color: 'text-purple-600' }
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                  <span className="text-xs font-bold text-gray-400 uppercase">{stat.label}</span>
                  <span className={`text-lg font-bold ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[32px] text-white shadow-xl">
            <h3 className="text-xl font-bold mb-2">Learning Streak</h3>
            <p className="text-slate-400 text-xs mb-6">You've practiced for 12 consecutive days.</p>
            <div className="flex justify-between">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] ${i < 6 ? 'bg-primary' : 'bg-slate-800 text-slate-500'}`}>{d}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Achievements / Activity */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Solved Problems</h3>
              <button className="text-sm font-bold text-primary hover:underline">View All</button>
            </div>
            <div className="p-4 space-y-2">
              {[
                { name: 'Binary Tree Level Order Traversal', difficulty: 'Medium', date: '2 hours ago' },
                { name: 'Merge Intervals', difficulty: 'Medium', date: 'Yesterday' },
                { name: 'Word Search', difficulty: 'Hard', date: 'Oct 22, 2023' }
              ].map((prob, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-gray-400">description</span>
                    <div>
                      <p className="font-bold text-gray-900">{prob.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{prob.date}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                    prob.difficulty === 'Medium' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'
                  }`}>{prob.difficulty}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Badges & Achievements</h3>
            <div className="grid grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-3xl">workspace_premium</span>
                  </div>
                  <p className="text-[10px] font-bold text-center text-gray-500 uppercase">Top 10% April</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
