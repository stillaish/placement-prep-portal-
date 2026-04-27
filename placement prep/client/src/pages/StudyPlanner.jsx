import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudyPlanner = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [loading, setLoading] = useState(true);

  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/planner');
        setGoals(res.data);
      } catch (err) {
        console.error('Error fetching goals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, []);

  const handleAddGoal = async () => {
    if (!newGoal.trim()) return;
    try {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      const res = await axios.post('http://localhost:5001/api/planner', {
        title: newGoal,
        date: date
      });
      setGoals([...goals, res.data]);
      setNewGoal('');
    } catch (err) {
      console.error('Error adding goal:', err);
    }
  };

  const handleToggleGoal = async (id, completed) => {
    try {
      const res = await axios.patch(`http://localhost:5001/api/planner/${id}`, { completed: !completed });
      setGoals(goals.map(g => g._id === id ? res.data : g));
    } catch (err) {
      console.error('Error toggling goal:', err);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-8">
      {/* Left: Calendar */}
      <div className="col-span-12 lg:col-span-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Study Planner</h2>
            <p className="text-gray-500">Stay organized and track your learning progress.</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
            <button className="p-2 hover:bg-gray-50 rounded-lg"><span className="material-symbols-outlined">chevron_left</span></button>
            <span className="font-bold text-gray-900">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            <button className="p-2 hover:bg-gray-50 rounded-lg"><span className="material-symbols-outlined">chevron_right</span></button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
            {days.map(d => (
              <div key={d} className="py-3 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 divide-x divide-y divide-gray-100 border-l border-t border-gray-100">
            {/* Empty cells for previous month */}
            {[...Array(6)].map((_, i) => (
              <div key={`empty-${i}`} className="h-28 bg-gray-50/30"></div>
            ))}
            {calendarDays.map(d => (
              <div key={d} className="h-28 p-2 hover:bg-gray-50 transition-colors group relative">
                <span className={`text-xs font-bold ${d === new Date().getDate() ? 'bg-primary text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-gray-400'}`}>
                  {d}
                </span>
                <div className="mt-2 space-y-1 overflow-y-auto max-h-[60px]">
                  {goals.filter(g => {
                    const goalDate = new Date(g.date);
                    const today = new Date();
                    return goalDate.getDate() === d && 
                           goalDate.getMonth() === today.getMonth() &&
                           goalDate.getFullYear() === today.getFullYear();
                  }).map(g => (
                    <div key={g._id} className={`text-[8px] ${g.completed ? 'bg-green-100 text-green-600' : 'bg-blue-600 text-white'} px-1 py-0.5 rounded truncate`}>
                      {g.title}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Goals & Streak */}
      <div className="col-span-12 lg:col-span-4 space-y-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Daily Goals</h3>
          <div className="bg-blue-50 p-4 rounded-xl mb-6">
            <div className="flex justify-between text-[10px] font-bold text-blue-900 uppercase tracking-widest mb-2">
              <span>Overall Progress</span>
              <span>{goals.filter(g => g.completed).length} / {goals.length}</span>
            </div>
            <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full" style={{ width: `${(goals.filter(g => g.completed).length / (goals.length || 1)) * 100}%` }}></div>
            </div>
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {goals.map((goal) => (
              <div key={goal._id} className="flex items-start gap-3 group cursor-pointer" onClick={() => handleToggleGoal(goal._id, goal.completed)}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  goal.completed ? 'bg-primary border-primary' : 'border-gray-200 group-hover:border-primary'
                }`}>
                  {goal.completed && <span className="material-symbols-outlined text-white text-xs">check</span>}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${goal.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{goal.title}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-3">
            <input 
              type="text"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary"
              placeholder="New goal..."
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
            />
            <button 
              onClick={handleAddGoal}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <span className="material-symbols-outlined">add</span>
              Add New Goal
            </button>
          </div>
        </div>

        <div className="bg-primary p-6 rounded-2xl text-white shadow-xl shadow-primary/20 relative overflow-hidden">
          <h3 className="text-xl font-bold mb-2 relative z-10">Study Streak</h3>
          <p className="text-xs text-blue-100 mb-6 relative z-10">You're on a 14-day roll! Keep it up to reach your target.</p>
          <div className="flex justify-between relative z-10">
            {['M', 'T', 'W', 'T', 'F'].map((d, i) => (
              <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${i < 3 ? 'bg-white text-primary' : 'bg-blue-400/30 text-white'}`}>
                {d}
              </div>
            ))}
          </div>
          <div className="absolute right-0 bottom-0 opacity-10">
            <span className="material-symbols-outlined text-9xl">local_fire_department</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanner;
