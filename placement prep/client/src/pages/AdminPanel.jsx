import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ title: '', difficulty: 'Easy', topic: '', description: '' });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/questions');
        setQuestions(res.data);
      } catch (err) {
        console.error('Error fetching questions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/questions', newQuestion);
      setQuestions([res.data, ...questions]);
      setShowAddModal(false);
      setNewQuestion({ title: '', difficulty: 'Easy', topic: '', description: '' });
    } catch (err) {
      console.error('Error adding question:', err);
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`http://localhost:5001/api/questions/${id}`);
      setQuestions(questions.filter(q => q._id !== id));
    } catch (err) {
      console.error('Error deleting question:', err);
    }
  };

  const metrics = [
    { label: 'Total Questions', value: questions.length, trend: '+0%', icon: 'inventory_2', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Avg. Success Rate', value: '72%', progress: 72, icon: 'bolt', color: 'text-green-600', bgColor: 'bg-green-50' },
  ];

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* ... header ... */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Question Management</h2>
          <p className="text-gray-500 mt-1">Monitor performance and organize your assessment library.</p>
        </div>
      </div>

      {/* Bento Grid Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2 ${m.bgColor} rounded-lg`}>
                <span className={`material-symbols-outlined ${m.color}`}>{m.icon}</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">{m.label}</p>
            <h3 className="text-3xl font-bold text-gray-900">{m.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Questions List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h4 className="text-lg font-bold text-gray-900">Existing Questions</h4>
            </div>
            <div className="divide-y divide-gray-100">
              {questions.map((q) => (
                <div key={q._id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-semibold text-gray-800">{q.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-400">{q.difficulty}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-400">{q.topic}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteQuestion(q._id)}
                    className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Quick Actions</h4>
            <div className="space-y-3">
              <button 
                onClick={() => setShowAddModal(true)}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-blue-50/50 transition-all group text-left"
              >
                <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">add_circle</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Add New Question</p>
                  <p className="text-[11px] text-gray-500">Create a single question entry</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold">Add New Question</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddQuestion} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                <input 
                  className="w-full p-2 border border-gray-200 rounded-lg" 
                  required
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Difficulty</label>
                  <select 
                    className="w-full p-2 border border-gray-200 rounded-lg"
                    value={newQuestion.difficulty}
                    onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Topic</label>
                  <input 
                    className="w-full p-2 border border-gray-200 rounded-lg"
                    required
                    value={newQuestion.topic}
                    onChange={(e) => setNewQuestion({ ...newQuestion, topic: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea 
                  className="w-full p-2 border border-gray-200 rounded-lg h-32"
                  required
                  value={newQuestion.description}
                  onChange={(e) => setNewQuestion({ ...newQuestion, description: e.target.value })}
                ></textarea>
              </div>
              <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-bold">Save Question</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
