import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Roadmaps = () => {
  const navigate = useNavigate();
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/roadmaps');
        setPaths(res.data);
      } catch (err) {
        console.error('Error fetching roadmaps:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmaps();
  }, []);

  const handleStartRoadmap = async (id) => {
    try {
      await axios.post('http://localhost:5001/api/roadmaps/start', { roadmapId: id });
      // Refresh data
      const res = await axios.get('http://localhost:5001/api/roadmaps');
      setPaths(res.data);
    } catch (err) {
      console.error('Error starting roadmap:', err);
    }
  };

  if (loading) return <div className="p-8">Loading roadmaps...</div>;

  return (
    <div className="max-w-[1400px] mx-auto pb-12">
      <div className="flex flex-col mb-10">
        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Learning Paths</p>
        <h2 className="text-5xl font-bold text-gray-900 mb-4">Career Roadmaps</h2>
        <p className="text-gray-500 max-w-2xl">Structured, step-by-step guides to mastering the skills required for top-tier engineering roles. Each path is curated by industry experts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {paths.map((path, i) => (
          <div key={i} className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-500">
            <div className={`h-32 ${path.color} p-8 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <span className="bg-white/20 backdrop-blur text-white text-[8px] font-bold px-3 py-1 rounded-full border border-white/30 tracking-widest">{path.tag}</span>
              </div>
              {/* Mock code pattern background */}
              <div className="absolute right-[-20%] top-[-20%] opacity-20 rotate-12 font-mono text-[8px] text-white select-none whitespace-pre">
                {`class Solution:\n  def solve(self):\n    dp = [0] * n\n    for i in range(n):\n      dp[i] = max(dp[i-1], ...)`}
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{path.title}</h3>
              <p className="text-sm text-gray-500 mb-8 leading-relaxed">{path.desc}</p>

              <div className="space-y-4 mb-10">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-gray-400 uppercase tracking-widest">Progress</span>
                  <span className="text-primary">{path.progress}%</span>
                </div>
                <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${path.color} transition-all duration-1000`} style={{ width: `${path.progress}%` }}></div>
                </div>
              </div>

              <div className="space-y-6 relative ml-2">
                <div className="absolute left-[7px] top-2 bottom-6 w-[2px] bg-gray-100 border-dashed border-l"></div>
                {path.milestones.map((ms, j) => (
                  <button 
                    key={j} 
                    onClick={() => navigate(`/questions?topic=${ms.topics[0]}`)}
                    className="flex items-start gap-4 relative group/ms w-full text-left"
                  >
                    <div className={`w-4 h-4 rounded-full border-4 border-white shadow-sm z-10 flex-shrink-0 mt-1 transition-all ${
                      ms.completed ? 'bg-primary' : ms.current ? 'bg-white border-primary border-2' : ms.start ? 'bg-white border-primary border-2' : 'bg-gray-200 group-hover/ms:bg-primary/50'
                    }`}></div>
                    <div>
                      <p className={`text-xs font-bold transition-colors ${ms.locked ? 'text-gray-300' : 'text-gray-900 group-hover/ms:text-primary'}`}>{ms.label}</p>
                      {(ms.date || ms.topics) && <p className="text-[10px] text-gray-400 mt-1">{ms.topics?.join(', ') || ms.date}</p>}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-auto pt-10">
                <button 
                  onClick={() => handleStartRoadmap(path._id)}
                  className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    path.progress === 0 ? 'bg-primary text-white hover:scale-[1.02] shadow-lg shadow-primary/20' : 
                    path.progress === 100 ? 'bg-green-50 text-green-600' :
                    'bg-gray-50 text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {path.progress === 0 ? 'Start Journey' : path.progress === 100 ? 'Completed' : 'Resume Session'}
                  <span className="material-symbols-outlined text-[18px]">
                    {path.progress === 0 ? 'rocket_launch' : 'play_arrow'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Roadmap Section */}
      <div className="mt-20 bg-white rounded-[48px] border border-gray-100 p-12 shadow-sm flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
        <div className="flex-1 space-y-6 relative z-10">
          <h3 className="text-4xl font-bold text-gray-900">Custom Roadmap</h3>
          <p className="text-gray-500 max-w-xl text-lg">Need a tailored plan for a specific company or role? Our AI engine can generate a specialized roadmap based on your current skills and target dream job.</p>
          <div className="flex gap-4">
            <button className="px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-105 transition-all">
              <span className="material-symbols-outlined">auto_awesome</span>
              Generate Path
            </button>
            <button className="px-8 py-4 border border-gray-200 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all">Learn More</button>
          </div>
        </div>
        <div className="w-full md:w-[400px] aspect-square relative rounded-[32px] overflow-hidden shadow-2xl">
          <img src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800" alt="AI Abstract" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

export default Roadmaps;
