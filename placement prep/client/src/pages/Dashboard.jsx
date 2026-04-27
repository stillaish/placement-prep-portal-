import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/auth/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) return <div className="p-8">Loading dashboard...</div>;

  const statCards = [
    { label: 'Total Solved', value: stats.totalSolved, trend: '+0 this week', icon: 'task_alt', color: 'text-primary' },
    { label: 'Current Streak', value: `${stats.streak} 🔥`, trend: 'Keep it up!', icon: 'local_fire_department', color: 'text-orange-500' },
    { label: 'Weak Topic', value: 'Dynamic Programming', progress: 32, icon: 'trending_down', color: 'text-red-500' },
    { label: `Target: ${stats.targetCompany}`, value: `${stats.progress}%`, trend: 'Keep practicing', icon: 'target', color: 'text-blue-600' },
  ];

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h2 className="font-h1 text-h1 text-gray-900 mb-1">Welcome back, {user?.name}!</h2>
        <p className="text-gray-500 font-body-base">You're on a roll. Keep practicing to reach your {stats.targetCompany} target.</p>
      </div>

      {/* Top Section: 4 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 font-label-bold text-label-bold uppercase">{stat.label}</span>
              <span className={`material-symbols-outlined ${stat.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{stat.icon}</span>
            </div>
            <div className={`${stat.label === 'Weak Topic' ? 'text-lg' : 'text-3xl'} font-bold text-gray-900`}>{stat.value}</div>
            {stat.progress ? (
              <div className="mt-2 flex items-center">
                <div className="w-full bg-gray-100 h-1.5 rounded-full mr-2">
                  <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${stat.progress}%` }}></div>
                </div>
                <span className="text-[10px] font-bold text-red-500">{stat.progress}%</span>
              </div>
            ) : (
              <div className={`mt-2 text-xs ${stat.label === 'Total Solved' || stat.label.includes('Target') ? 'text-blue-600' : 'text-gray-500'} font-semibold`}>
                {stat.trend}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Middle Section: Heatmap & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* GitHub-style Heatmap */}
        <div className="lg:col-span-2 bg-white p-10 border border-gray-100 rounded-[48px] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-900">Activity Heatmap</h3>
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
              <span>Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map(i => <div key={i} className={`w-3 h-3 rounded-sm activity-cell cell-${i}`}></div>)}
              </div>
              <span>More</span>
            </div>
          </div>
          <div className="overflow-x-auto pb-4">
            <div className="inline-grid grid-rows-7 grid-flow-col gap-1.5">
              {[...Array(364)].map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (363 - i));
                const dateStr = date.toISOString().split('T')[0];
                const activity = stats.heatmap.find(h => h._id === dateStr);
                const count = activity ? activity.count : 0;
                const level = count === 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : count === 3 ? 3 : 4;
                return (
                  <div 
                    key={i} 
                    title={`${dateStr}: ${count} submissions`}
                    className={`w-3.5 h-3.5 rounded-sm activity-cell cell-${level} transition-colors hover:ring-2 ring-primary/20 cursor-pointer`}
                  ></div>
                );
              })}
            </div>
          </div>
          <div className="mt-6 flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => <span key={m}>{m}</span>)}
          </div>
        </div>

        <div className="bg-white p-8 border border-gray-100 rounded-[40px] shadow-sm flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-8">Recommended for You</h3>
          <div className="space-y-4 flex-1">
            {stats.recommendations?.map((rec, i) => (
              <button 
                key={i} 
                onClick={() => navigate(rec.link)}
                className="w-full text-left p-6 rounded-[32px] border border-gray-50 hover:border-primary/20 hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`${rec.tagColor} text-[8px] font-bold px-3 py-1 rounded-full tracking-widest uppercase`}>{rec.tag}</span>
                  <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">arrow_forward</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2 leading-tight">{rec.title}</h4>
                <p className="text-[10px] text-gray-500 leading-relaxed">{rec.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Activity table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <h3 className="font-h3 text-h3 text-gray-900">Recent Activity</h3>
          <button className="text-sm font-semibold text-primary hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-3">Problem Name</th>
                <th className="px-6 py-3">Difficulty</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.recentActivity.map((activity, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="material-symbols-outlined text-gray-400 mr-3 text-sm">description</span>
                      <span className="text-sm font-semibold text-gray-900">{activity.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 ${
                      activity.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600' : 
                      activity.difficulty === 'Hard' ? 'bg-red-50 text-red-600' : 
                      'bg-green-50 text-green-600'
                    } text-xs font-bold rounded`}>
                      {activity.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center text-xs ${activity.status === 'Solved' ? 'text-green-600' : 'text-amber-600'} font-medium`}>
                      <span className="material-symbols-outlined text-sm mr-1">{activity.status === 'Solved' ? 'check_circle' : 'history'}</span> 
                      {activity.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{activity.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
