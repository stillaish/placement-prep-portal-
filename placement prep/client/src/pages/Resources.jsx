import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchResources(true);
  }, [activeTab]);

  const fetchResources = async (reset = false) => {
    setLoading(true);
    try {
      const currentPage = reset ? 1 : page;
      const res = await axios.get(`http://localhost:5001/api/resources?type=${activeTab}&page=${currentPage}&limit=8`);
      if (reset) {
        setResources(res.data);
        setPage(2);
      } else {
        setResources([...resources, ...res.data]);
        setPage(page + 1);
      }
      if (res.data.length < 8) setHasMore(false);
      else setHasMore(true);
    } catch (err) {
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = ['All', 'Resume Templates', 'Interview Questions', 'Videos & PDFs'];

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex flex-col mb-10">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">Library</h2>
        <p className="text-gray-500">Access curated templates, guides, and question banks.</p>
      </div>

      <div className="flex bg-white/50 backdrop-blur-sm p-1 rounded-2xl border border-gray-100 shadow-sm w-fit mb-12 overflow-x-auto">
        {tabs.map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === tab ? 'bg-white text-primary shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {resources.map((res, i) => (
          <div key={i} className="bg-white rounded-[40px] overflow-hidden border border-gray-50 shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col">
            <div className="h-56 relative overflow-hidden">
              <img src={res.image || 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=400'} alt={res.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-3 py-1 rounded-lg flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-[14px] text-gray-700">
                  {res.type === 'PDF' ? 'picture_as_pdf' : res.type === 'Video' ? 'play_circle' : 'description'}
                </span>
                <span className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">{res.type}</span>
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex gap-2 mb-4">
                <span className="text-[8px] font-bold px-3 py-1 rounded-full bg-green-50 text-green-600 border border-green-100 uppercase tracking-widest">Essential</span>
                <span className="text-[8px] font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-widest">Career</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-primary transition-colors">{res.title}</h3>
              <p className="text-xs text-gray-500 line-clamp-2 mb-8 leading-relaxed">{res.description}</p>
              
              <div className="mt-auto flex gap-3">
                <button 
                  onClick={() => window.open(res.url, '_blank')}
                  className="flex-1 py-3.5 rounded-2xl border border-gray-200 text-[10px] font-bold text-gray-700 hover:bg-gray-50 transition-all uppercase tracking-widest"
                >
                  View Online
                </button>
                <button 
                  onClick={() => window.open(res.url, '_blank')}
                  className="flex-1 py-3.5 rounded-2xl bg-primary text-white text-[10px] font-bold flex items-center justify-center gap-2 hover:scale-[1.02] shadow-lg shadow-primary/20 transition-all uppercase tracking-widest"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  Get
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 text-center pb-20">
        {hasMore && (
          <button 
            onClick={() => fetchResources(false)}
            disabled={loading}
            className="px-12 py-4 bg-gray-50 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-100 transition-all border border-gray-100 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More Resources'}
          </button>
        )}
        <p className="text-xs text-gray-400 mt-6 font-medium">Showing {resources.length} curated resources</p>
      </div>
    </div>
  );
};

export default Resources;
