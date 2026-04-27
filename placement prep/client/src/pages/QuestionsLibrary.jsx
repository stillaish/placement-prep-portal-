import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const QuestionsLibrary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [difficulty, setDifficulty] = useState([]);
  const [page, setPage] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        let url = `http://localhost:5001/api/questions?page=${page}&limit=10&`;
        const currentSearch = queryParams.get('search') || search;
        const currentTopic = queryParams.get('topic');
        if (currentSearch) url += `search=${currentSearch}&`;
        if (currentTopic) url += `topic=${currentTopic}&`;
        if (difficulty.length) url += `difficulty=${difficulty.join(',')}&`;
        const res = await axios.get(url);
        setQuestions(res.data.questions);
        setTotalQuestions(res.data.total);
      } catch (err) {
        console.error('Error fetching questions:', err);
      } finally {
        setLoading(false);
      }
    };
    const delayDebounceFn = setTimeout(() => {
      fetchQuestions();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, difficulty, location.search, page]);

  useEffect(() => {
    setPage(1);
  }, [search, difficulty, location.search]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'solved':
        return <span className="material-symbols-outlined text-green-600" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>;
      case 'attempted':
        return <span className="material-symbols-outlined text-orange-400" style={{ fontVariationSettings: "'FILL' 1" }}>change_circle</span>;
      default:
        return <span className="material-symbols-outlined text-outline-variant">radio_button_unchecked</span>;
    }
  };

  const getDifficultyClass = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-6">
      {/* Filter Sidebar */}
      <div className="col-span-3 space-y-6">
        <div className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm">
          <h3 className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider mb-4">Difficulty</h3>
          <div className="space-y-3">
            {['Easy', 'Medium', 'Hard'].map((d, i) => (
              <label key={d} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  className="w-4 h-4 rounded border-outline text-primary focus:ring-primary" 
                  type="checkbox" 
                  checked={difficulty.includes(d)}
                  onChange={(e) => {
                    if (e.target.checked) setDifficulty([...difficulty, d]);
                    else setDifficulty(difficulty.filter(item => item !== d));
                  }}
                />
                <span className="text-body-base font-body-base text-on-surface group-hover:text-primary transition-colors">{d}</span>
                <span className="ml-auto text-body-sm text-outline">{[452, 981, 210][i]}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm">
          <h3 className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider mb-4">Status</h3>
          <div className="space-y-3">
            {['Solved', 'Attempted', 'Todo'].map((s) => (
              <label key={s} className="flex items-center gap-3 cursor-pointer group">
                <input className="w-4 h-4 rounded border-outline text-primary focus:ring-primary" type="checkbox" />
                <span className="text-body-base font-body-base text-on-surface group-hover:text-primary transition-colors">{s}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm">
          <h3 className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider mb-4">Popular Topics</h3>
          <div className="flex flex-wrap gap-2">
            {['Array', 'String', 'Dynamic Programming', 'Hash Table', 'Sorting', 'Greedy'].map(t => (
              <span 
                key={t} 
                onClick={() => {
                  setSearch(t);
                  const params = new URLSearchParams(location.search);
                  params.set('topic', t);
                  navigate({ search: params.toString() });
                }}
                className={`px-3 py-1 rounded-full text-body-sm cursor-pointer transition-colors ${
                  queryParams.get('topic') === t ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant hover:bg-primary-fixed'
                }`}
              >
                {t}
              </span>
            ))}
            {queryParams.get('topic') && (
                <button 
                  onClick={() => navigate('/questions')}
                  className="text-[10px] text-primary font-bold hover:underline mt-2 w-full text-left"
                >
                  Clear Topic Filter
                </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="col-span-9 space-y-6">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Problem Set</h2>
            <p className="text-sm text-gray-500">Pick a challenge and start solving</p>
          </div>
          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input 
              type="text" 
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:border-primary outline-none transition-all"
              placeholder="Search problems, topics, or companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table Area */}
        <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low border-b border-outline-variant">
              <tr>
                <th className="px-6 py-4 font-label-bold text-label-bold text-on-surface-variant">Status</th>
                <th className="px-6 py-4 font-label-bold text-label-bold text-on-surface-variant">Title</th>
                <th className="px-6 py-4 font-label-bold text-label-bold text-on-surface-variant">Acceptance</th>
                <th className="px-6 py-4 font-label-bold text-label-bold text-on-surface-variant">Difficulty</th>
                <th className="px-6 py-4 font-label-bold text-label-bold text-on-surface-variant">Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {questions.map((q) => (
                <tr key={q._id} className="hover:bg-surface-container-lowest transition-colors group">
                  <td className="px-6 py-4">{getStatusIcon(q.status)}</td>
                  <td className="px-6 py-4">
                    <Link to={`/questions/${q._id}`} className="font-body-base text-body-base text-primary hover:underline font-semibold">{q.title}</Link>
                  </td>
                  <td className="px-6 py-4 font-body-base text-body-base">{q.acceptanceRate}%</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full ${getDifficultyClass(q.difficulty)} font-label-bold text-[11px] uppercase tracking-wide`}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-24 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: `${q.frequency}%` }}></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-outline-variant bg-surface-container-low flex items-center justify-between">
          <span className="text-body-sm text-on-surface-variant">
            Showing {(page - 1) * 10 + 1}-{Math.min(page * 10, totalQuestions)} of {totalQuestions} questions
          </span>
          <div className="flex items-center gap-2">
            <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1 hover:bg-surface-variant rounded transition-colors disabled:opacity-30"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            
            {Array.from({ length: Math.min(5, Math.ceil(totalQuestions / 10)) }).map((_, i) => {
                const p = i + 1; // Simplified for now
                return (
                    <button 
                        key={p} 
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 rounded font-label-bold text-label-bold transition-all ${
                            page === p ? 'bg-primary text-white shadow-md' : 'hover:bg-surface-variant text-on-surface'
                        }`}
                    >
                        {p}
                    </button>
                );
            })}

            {Math.ceil(totalQuestions / 10) > 5 && <span className="text-on-surface-variant">...</span>}
            
            <button 
                onClick={() => setPage(p => Math.min(Math.ceil(totalQuestions / 10), p + 1))}
                disabled={page >= Math.ceil(totalQuestions / 10)}
                className="p-1 hover:bg-surface-variant rounded transition-colors disabled:opacity-30"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionsLibrary;
