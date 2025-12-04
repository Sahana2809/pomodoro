import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TimerProvider } from './context/TimerContext';
import { TaskProvider } from './context/TaskContext';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Stats from './pages/Stats';
import Settings from './pages/Settings';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return user ? children : <Navigate to="/auth" />;
};

function App() {
  return (
    <AuthProvider>
      <TimerProvider>
        <TaskProvider>
          <Router>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              } />
              <Route path="/stats" element={
                <PrivateRoute>
                  <Stats />
                </PrivateRoute>
              } />
              <Route path="/settings" element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              } />
            </Routes>
          </Router>
        </TaskProvider>
      </TimerProvider>
    </AuthProvider>
  );
}

export default App;
