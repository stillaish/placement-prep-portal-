import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MockTestAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(5400); // 90 mins
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/tests/${id}`);
        setTest(res.data);
      } catch (err) {
        console.error('Error fetching test:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestData();
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmitTest = async () => {
    if (!window.confirm('Are you sure you want to submit the test?')) return;
    
    try {
      const score = Object.keys(answers).length * 10; // Simple scoring logic
      await axios.post('http://localhost:5001/api/tests/submit', {
        testId: id,
        score,
        totalQuestions: test.questions.length,
        timeTaken: 5400 - timeLeft,
        answers: Object.entries(answers).map(([index, ans]) => ({
          question: test.questions[index]._id,
          submittedAnswer: 'Simulated Answer',
          isCorrect: true
        }))
      });
      alert(`Test Submitted! Your score: ${score}`);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error submitting test:', err);
      alert('Failed to submit test. Please try again.');
    }
  };

  if (loading || !test) return <div className="flex items-center justify-center h-screen">Loading test environment...</div>;

  const currentQuestion = test.questions[currentQuestionIndex];

  return (
    <div className="h-screen bg-white flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-gray-100 flex items-center justify-between px-8 bg-white z-20">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">PlacementPrep</h1>
          <div className="flex items-center gap-3 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
            <span className="material-symbols-outlined text-primary text-lg">timer</span>
            <span className="text-sm font-bold text-primary font-mono">{formatTime(timeLeft)}</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
            <input type="text" placeholder="Search shortcuts..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:bg-white focus:border-primary" />
          </div>
          <button onClick={handleSubmitTest} className="bg-red-600 text-white px-6 py-2 rounded-xl text-xs font-bold shadow-lg shadow-red-600/20 hover:scale-105 transition-all">Submit Test</button>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-gray-400">notifications</span>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&q=80&w=100" alt="User" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Section: Question Content */}
        <div className="flex-1 overflow-y-auto p-12 border-r border-gray-50">
          <div className="max-w-3xl mx-auto space-y-10">
            <div className="flex items-center justify-between">
              <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-4 py-1 rounded-full border border-blue-100 uppercase tracking-widest">Medium</span>
              <p className="text-xs text-gray-400 font-bold">Question {currentQuestionIndex + 1} of {test.questions.length}</p>
            </div>

            <h2 className="text-4xl font-bold text-gray-900 leading-tight">{currentQuestion.title || 'Maximum Sum Circular Subarray'}</h2>
            
            <div className="prose prose-sm text-gray-600 max-w-none leading-relaxed">
              <p>{currentQuestion.description || 'Given a circular integer array nums of length n, return the maximum possible sum of a non-empty subarray of nums.'}</p>
              <p>A circular array means the end of the array connects to the beginning of the array. Formally, the next element of nums[i] is nums[(i + 1) % n] and the previous element of nums[i] is nums[(i - 1 + n) % n].</p>
            </div>

            {/* Examples */}
            <div className="space-y-6">
              {[1, 2].map(ex => (
                <div key={ex} className="bg-gray-50 rounded-[32px] p-8 border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Example {ex}:</p>
                  <div className="font-mono text-sm space-y-1">
                    <p><span className="text-gray-400">Input:</span> nums = [1,-2,3,-2]</p>
                    <p><span className="text-gray-400">Output:</span> 3</p>
                    <p><span className="text-gray-400">Explanation:</span> Subarray [3] has maximum sum 3.</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4">Constraints:</h4>
              <ul className="list-disc ml-4 space-y-2 text-sm text-gray-500">
                <li>n == nums.length</li>
                <li>1 &lt;= n &lt;= 3 * 10^4</li>
                <li>-3 * 10^4 &lt;= nums[i] &lt;= 3 * 10^4</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Section: Palette & Code */}
        <div className="w-[480px] flex flex-col bg-gray-50/50">
          {/* User Info */}
          <div className="p-8 border-b border-gray-100 flex items-center gap-4 bg-white">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&q=80&w=200" alt="User" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Alex Chen</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Candidate ID: #88291</p>
            </div>
          </div>

          {/* Palette */}
          <div className="p-8 border-b border-gray-100 bg-white">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Question Palette</h4>
            <div className="grid grid-cols-5 gap-3">
              {test.questions.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentQuestionIndex(i)}
                  className={`aspect-square rounded-xl text-xs font-bold transition-all border ${
                    currentQuestionIndex === i ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-110' : 
                    answers[i] ? 'bg-blue-50 text-primary border-blue-100' : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                <div className="w-2.5 h-2.5 rounded-sm bg-primary"></div>
                Answered
              </div>
              <div className="flex items-center gap-2 text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                <div className="w-2.5 h-2.5 rounded-sm bg-orange-600"></div>
                Marked
              </div>
              <div className="flex items-center gap-2 text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                <div className="w-2.5 h-2.5 rounded-sm bg-gray-200"></div>
                Not Visited
              </div>
            </div>
          </div>

          {/* Code Section Container */}
          <div className="flex-1 p-8 flex flex-col gap-6">
             <div className="bg-[#1e1e1e] rounded-[32px] flex-1 overflow-hidden shadow-2xl relative flex flex-col">
                <div className="bg-[#2d2d2d] px-8 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <select className="bg-transparent text-blue-400 font-mono text-xs outline-none cursor-pointer">
                      <option value="python">Python 3</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                    </select>
                  </div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Editor</span>
                </div>
                <textarea 
                  className="flex-1 w-full bg-transparent p-8 font-mono text-xs text-gray-300 outline-none resize-none leading-loose"
                  spellCheck="false"
                  placeholder="# Write your logic here"
                  value={answers[currentQuestionIndex] === true ? '' : (answers[currentQuestionIndex] || '')}
                  onChange={(e) => setAnswers({...answers, [currentQuestionIndex]: e.target.value})}
                ></textarea>
             </div>

             <div className="flex gap-4">
               <button 
                 onClick={() => setAnswers({...answers, [currentQuestionIndex]: ''})}
                 className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl text-xs font-bold hover:bg-gray-200 transition-all"
               >
                 Clear Response
               </button>
               <button 
                 onClick={() => {
                   if (currentQuestionIndex < test.questions.length - 1) setCurrentQuestionIndex(currentQuestionIndex + 1);
                 }}
                 className="flex-1 py-4 bg-primary text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-105 transition-all"
               >
                 Save & Next
                 <span className="material-symbols-outlined text-sm">chevron_right</span>
               </button>
             </div>
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <footer className="h-16 border-t border-gray-100 flex items-center justify-between px-8 bg-white z-20">
        <div className="flex gap-4">
          <button 
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
            className="px-6 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 flex items-center gap-2 hover:bg-gray-50 disabled:opacity-30 transition-all"
          >
            <span className="material-symbols-outlined text-sm">chevron_left</span>
            Previous
          </button>
          <button className="px-6 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-orange-600/20 flex items-center gap-2 hover:scale-105 transition-all">
            <span className="material-symbols-outlined text-sm">bookmark</span>
            Mark for Review
          </button>
        </div>
        <div className="flex gap-6">
           <button className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors flex items-center gap-2">
             Test Guidelines
             <span className="material-symbols-outlined text-sm">open_in_new</span>
           </button>
           <button className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors flex items-center gap-2">
             Calculator
             <span className="material-symbols-outlined text-sm">calculate</span>
           </button>
        </div>
      </footer>
    </div>
  );
};

export default MockTestAttempt;
