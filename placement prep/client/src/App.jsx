import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import QuestionsLibrary from './pages/QuestionsLibrary';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MockTests from './pages/MockTests';
import MockTestAttempt from './pages/MockTestAttempt';
import QuestionDetail from './pages/QuestionDetail';
import AdminPanel from './pages/AdminPanel';
import StudyPlanner from './pages/StudyPlanner';
import Roadmaps from './pages/Roadmaps';
import Resources from './pages/Resources';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Layout from './components/layout/Layout';

import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Mock Test Attempt is full-screen, no layout */}
          <Route path="/mock-test/:id" element={<ProtectedRoute><MockTestAttempt /></ProtectedRoute>} />
          
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/questions" element={<QuestionsLibrary />} />
            <Route path="/questions/:id" element={<QuestionDetail />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/roadmaps" element={<Roadmaps />} />
            <Route path="/planner" element={<StudyPlanner />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/mock-tests" element={<MockTests />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
