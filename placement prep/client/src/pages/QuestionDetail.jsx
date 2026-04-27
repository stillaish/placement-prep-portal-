import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const QuestionDetail = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiPanelOpen, setAiPanelOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [note, setNote] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Editor State
  const defaultCode = {
    python: 'def solve(nums, target):\n    # Write your code here\n    pass',
    java: 'class Solution {\n    public int[] solve(int[] nums, int target) {\n        // Write your code here\n        return new int[]{};\n    }\n}',
    cpp: 'class Solution {\npublic:\n    vector<int> solve(vector<int>& nums, int target) {\n        // Write your code here\n        return {};\n    }\n};'
  };
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(defaultCode.python);
  const [output, setOutput] = useState('');
  const [isRunningCode, setIsRunningCode] = useState(false);

  useEffect(() => {
    setCode(defaultCode[language]);
  }, [language]);

  const handleRunCode = async () => {
    setIsRunningCode(true);
    setOutput('');
    // Simulate API call for execution
    setTimeout(() => {
      setIsRunningCode(false);
      // Mock result based on randomness to seem realistic
      if (Math.random() > 0.3) {
        setOutput('Test Case 1: Passed\nTest Case 2: Passed\nTest Case 3: Passed\n\nSuccess! Your logic is correct.');
      } else {
        setOutput('Test Case 1: Passed\nTest Case 2: Failed\nOutput: [1, 2], Expected: [0, 1]\n\nError: Wrong Answer on Test Case 2');
      }
    }, 1500);
  };

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/questions/${id}`);
        setQuestion(res.data);
        setMessages([{ role: 'ai', content: `Hello! I'm here to help you solve "${res.data.title}". Would you like me to explain the core approach or give you a small hint?` }]);
        
        // Fetch note
        const noteRes = await axios.get(`http://localhost:5001/api/notes/${id}`);
        setNote(noteRes.data.content);
      } catch (err) {
        console.error('Error fetching question:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [id]);

  const handleToggleBookmark = async () => {
    try {
      const res = await axios.post('http://localhost:5001/api/bookmarks/toggle', { questionId: id });
      setIsBookmarked(res.data.bookmarked);
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const handleSaveNote = async () => {
    setIsSavingNote(true);
    try {
      await axios.post('http://localhost:5001/api/notes', { questionId: id, content: note });
    } catch (err) {
      console.error('Error saving note:', err);
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    const newMessages = [...messages, { role: 'user', content: inputText }];
    setMessages(newMessages);
    const query = inputText;
    setInputText('');
    
    try {
      const res = await axios.post('http://localhost:5001/api/ai/assist', { 
        questionId: id,
        type: query.toLowerCase().includes('hint') ? 'hint' : query.toLowerCase().includes('approach') ? 'approach' : 'explain'
      });
      setMessages([...newMessages, { role: 'ai', content: res.data.response }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'ai', content: "Sorry, I'm having trouble connecting to my brain right now." }]);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen bg-background">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>;

  if (!question) return <div className="flex items-center justify-center h-screen bg-background text-gray-500">Question not found</div>;

  return (
    <div className="relative">
      <main className={`transition-all duration-300 ${aiPanelOpen ? 'pr-80' : ''}`}>
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Problem Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  question.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                  question.difficulty === 'Medium' ? 'bg-orange-100 text-orange-700' :
                  'bg-red-100 text-red-700'
                }`}>{question.difficulty}</span>
                <span className="text-xs text-gray-500">Topics: {question.topic}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{question.title}</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleToggleBookmark}
                className={`flex items-center px-4 py-2 border font-bold rounded-lg transition-colors ${
                  isBookmarked ? 'bg-primary/10 border-primary text-primary' : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="material-symbols-outlined mr-2" style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "" }}>bookmark</span>
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </button>
              <button className="flex items-center px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                <span className="material-symbols-outlined text-lg mr-2">play_arrow</span>
                Run Code
              </button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Left: Problem Statement & Editor */}
            <div className="col-span-12 lg:col-span-7 space-y-6">
              <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Description</h2>
                <div className="prose prose-slate max-w-none text-sm space-y-4 text-gray-700">
                  <p>{question.description}</p>
                </div>
              </div>

              {/* Code Editor Area */}
              <div className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-lg border border-gray-800 flex flex-col">
                <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-gray-800">
                  <div className="flex items-center gap-4">
                    <select 
                      className="bg-transparent text-gray-300 text-xs font-bold outline-none cursor-pointer hover:text-white transition-colors"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option value="cpp">C++</option>
                      <option value="java">Java</option>
                      <option value="python">Python 3</option>
                    </select>
                    <div className="h-4 w-[1px] bg-gray-700"></div>
                    <span className="text-[10px] text-gray-500 font-mono">Solution.{language === 'python' ? 'py' : language === 'java' ? 'java' : 'cpp'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-md hover:bg-gray-700">
                      <span className="material-symbols-outlined text-sm">settings</span>
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-md hover:bg-gray-700">
                      <span className="material-symbols-outlined text-sm">fullscreen</span>
                    </button>
                  </div>
                </div>
                <div className="relative flex-1">
                  <textarea 
                    className="w-full h-80 bg-transparent p-6 text-gray-300 font-mono text-sm outline-none resize-none leading-relaxed"
                    spellCheck="false"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  ></textarea>
                </div>
                
                {/* Output Console */}
                {output && (
                  <div className="bg-black/50 border-t border-gray-800 p-4 font-mono text-xs max-h-40 overflow-y-auto">
                    <p className="text-gray-500 mb-1">Output:</p>
                    <pre className={`${output.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                      {output}
                    </pre>
                  </div>
                )}

                <div className="bg-[#2d2d2d] p-4 flex justify-end gap-3 border-t border-gray-800">
                    <button 
                      onClick={() => { setCode(defaultCode[language]); setOutput(''); }}
                      className="px-6 py-2 bg-gray-700 text-gray-300 text-xs font-bold rounded-lg hover:bg-gray-600 transition-all"
                    >
                      Reset
                    </button>
                    <button 
                      onClick={handleRunCode}
                      disabled={isRunningCode}
                      className="px-6 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                      {isRunningCode ? 'Running...' : 'Run Code'}
                    </button>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Examples</h2>
                <div className="space-y-6">
                  {question.examples?.map((ex, i) => (
                    <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <span className="text-xs font-bold text-primary block mb-2">Example {i + 1}:</span>
                      <div className="space-y-2">
                        <div className="bg-white p-3 rounded border border-gray-200 font-code text-xs">
                          Input: {ex.input}
                        </div>
                        <div className="bg-white p-3 rounded border border-gray-200 font-code text-xs">
                          Output: {ex.output}
                        </div>
                        {ex.explanation && <p className="text-xs text-gray-500 italic">Explanation: {ex.explanation}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Meta & Constraints */}
            <div className="col-span-12 lg:col-span-5 space-y-6">
              <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold mb-4">Constraints</h3>
                <ul className="space-y-3">
                  {question.constraints?.map((c, i) => (
                    <li key={i} className="flex items-start">
                      <span className="material-symbols-outlined text-sm text-primary mt-1 mr-2">check_circle</span>
                      <code className="bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200 text-xs text-gray-600">{c}</code>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold mb-4">My Notes</h3>
                <textarea 
                  className="w-full h-32 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  placeholder="Write your notes here..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                ></textarea>
                <button 
                  onClick={handleSaveNote}
                  disabled={isSavingNote}
                  className="mt-3 w-full bg-primary text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSavingNote ? 'Saving...' : 'Save Note'}
                </button>
              </div>

              <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden group">
                <h3 className="text-lg font-bold mb-2 relative z-10">Stuck on this?</h3>
                <p className="text-xs text-slate-400 mb-4 relative z-10">Our AI tutor can help you understand the recursive nature of BST validation without spoiling the solution.</p>
                <button 
                  onClick={() => setAiPanelOpen(true)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition-all relative z-10"
                >
                  Ask AI Assistant
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* AI Assistant Panel */}
      {aiPanelOpen && (
        <aside className="fixed right-0 top-14 bottom-0 w-80 bg-gray-50 border-l border-gray-200 flex flex-col overflow-hidden z-40">
          <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
            <div>
              <span className="text-sm font-bold text-blue-600">AI Assistant</span>
              <p className="text-[10px] text-gray-500">Hints & Explanations</p>
            </div>
            <button onClick={() => setAiPanelOpen(false)} className="text-gray-400 hover:text-gray-600">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
          
          <div className="flex border-b border-gray-200 bg-white text-[10px] font-bold uppercase text-gray-500">
            <button className="flex-1 py-3 text-blue-600 border-b-2 border-blue-600 flex items-center justify-center">Chat</button>
            <button className="flex-1 py-3 hover:bg-gray-50 flex items-center justify-center">Hints</button>
            <button className="flex-1 py-3 hover:bg-gray-50 flex items-center justify-center">History</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex items-start space-x-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'ai' && (
                  <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-white text-[10px]">smart_toy</span>
                  </div>
                )}
                <div className={`${
                  msg.role === 'ai' ? 'bg-white border border-gray-200 text-gray-700' : 'bg-blue-600 text-white'
                } p-3 rounded-lg text-xs max-w-[85%] shadow-sm`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-white border-t border-gray-200">
            <div className="relative">
              <textarea 
                className="w-full p-3 pr-10 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-600 outline-none resize-none" 
                placeholder="Ask a question..." 
                rows="2"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
              />
              <button 
                onClick={handleSendMessage}
                className="absolute right-2 bottom-2 p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};

export default QuestionDetail;
