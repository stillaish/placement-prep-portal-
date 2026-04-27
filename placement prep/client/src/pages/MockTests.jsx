import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MockTests = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/tests');
        setTests(res.data);
      } catch (err) {
        console.error('Error fetching tests:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  if (loading) return <div className="p-8">Loading mock tests...</div>;

  const featuredTest = tests[0] || {
    title: 'Amazon OA Prep #4',
    desc: 'This test replicates the actual Amazon Online Assessment environment.',
    questions: [],
    duration: 90,
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1523474253046-2cd2c788f3ff?auto=format&fit=crop&q=80&w=800'
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Mock Tests</h2>
          <p className="text-gray-500">Practice with industry-standard assessments and company-specific coding rounds.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
          {['Live', 'Upcoming', 'Past'].map((tab, i) => (
            <button key={tab} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              i === 0 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:bg-gray-50'
            }`}>{tab}</button>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 relative h-64 md:h-auto">
            <img src={featuredTest.image || 'https://images.unsplash.com/photo-1523474253046-2cd2c788f3ff?auto=format&fit=crop&q=80&w=800'} alt="Featured" className="w-full h-full object-cover" />
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-bold text-orange-600 tracking-widest uppercase">Company Specific</div>
          </div>
          <div className="flex-1 p-10 flex flex-col justify-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">{featuredTest.title}</h3>
            <p className="text-gray-500 text-sm mb-10 leading-relaxed">{featuredTest.description || featuredTest.desc}</p>
            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { label: 'QUESTIONS', value: featuredTest.questions?.length || 0 },
                { label: 'DURATION', value: `${featuredTest.duration} mins` },
                { label: 'DIFFICULTY', value: featuredTest.difficulty }
              ].map(stat => (
                <div key={stat.label} className="bg-gray-50 p-4 rounded-3xl text-center">
                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-sm font-bold text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>
            <button 
              onClick={() => navigate(`/mock-test/${featuredTest._id || 'demo'}`)}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
            >
              Enter Test
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Weekly Contest Card */}
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 flex flex-col relative overflow-hidden">
          <div className="absolute top-6 right-6 text-[10px] font-bold text-gray-300">ID: WC-32</div>
          <div className="mb-8">
            <span className="bg-blue-50 text-blue-600 text-[8px] font-bold px-3 py-1 rounded-full border border-blue-100 tracking-widest uppercase">Weekly Contest</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Weekly Contest 32</h3>
          <p className="text-xs text-gray-400 mb-10">Compete with 5000+ developers globally. Global ranking affects your profile visibility.</p>
          <div className="space-y-4 mb-10 flex-1">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Problems</span>
              <span className="font-bold">3 Coding + 10 MCQ</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Duration</span>
              <span className="font-bold">120 mins</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Difficulty</span>
              <span className="font-bold text-orange-600">Medium</span>
            </div>
          </div>
          <button className="w-full py-4 bg-gray-50 text-gray-900 rounded-2xl font-bold hover:bg-gray-100 transition-all">Register Now</button>
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tests.slice(1).map((test, i) => (
          <div key={i} className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">timer</span>
              </div>
              <div>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Assessment</p>
                <h4 className="text-lg font-bold text-gray-900">{test.title}</h4>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-10 line-clamp-2">{test.description}</p>
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-gray-50 p-4 rounded-3xl text-center">
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">TIME</p>
                <p className="text-xs font-bold text-gray-900">{test.duration} mins</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-3xl text-center">
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">DIFFICULTY</p>
                <p className={`text-xs font-bold ${test.difficulty === 'Hard' ? 'text-red-600' : 'text-blue-600'}`}>{test.difficulty}</p>
              </div>
            </div>
            <button 
              onClick={() => navigate(`/mock-test/${test._id}`)}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:scale-[1.02] transition-all"
            >
              Enter Test
            </button>
          </div>
        ))}

        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 flex flex-col border-dashed border-2 border-gray-200">
          <div className="mb-8">
            <span className="bg-purple-50 text-purple-600 text-[8px] font-bold px-3 py-1 rounded-full border border-purple-100 tracking-widest uppercase">CS Fundamentals</span>
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-4">Core OS & Networking</h4>
          <p className="text-xs text-gray-400 mb-10">MCQ based assessment for hardware concepts, OS scheduling, and TCP/IP stack.</p>
          <div className="space-y-3 mb-10 flex-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Questions</span>
              <span className="font-bold">45 Questions</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Duration</span>
              <span className="font-bold">45 mins</span>
            </div>
          </div>
          <button className="w-full py-4 bg-primary text-white rounded-2xl font-bold">Enter Test</button>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2 bg-primary rounded-[40px] p-10 text-white flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-2">Current Ranking</p>
            <h4 className="text-5xl font-bold mb-8">Top 5%</h4>
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-bold text-blue-100 uppercase">Next Goal: Grandmaster</p>
            </div>
          </div>
          <button className="relative z-10 px-6 py-2.5 bg-white/10 backdrop-blur rounded-xl text-xs font-bold border border-white/20 hover:bg-white/20 transition-all">View Leaderboard</button>
          <div className="absolute right-[-10%] top-[-10%] opacity-10">
            <span className="material-symbols-outlined text-[200px]">trending_up</span>
          </div>
        </div>

        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 flex flex-col justify-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Tests Completed</p>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-bold text-gray-900">24</span>
            <span className="text-xs font-bold text-green-600 mb-2">+3 this week</span>
          </div>
        </div>

        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 flex flex-col justify-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Avg. Accuracy</p>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-bold text-gray-900">88.4%</span>
            <span className="text-xs font-bold text-blue-600 mb-2">Stable</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockTests;
