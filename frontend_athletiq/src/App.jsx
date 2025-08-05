import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/Landingpage';
import LoginForm from './pages/LoginForm';
import RegisterForm from './pages/RegisterForm';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';

const App = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (authToken, userData) => {
    // Debug: See what userData looks like after login
    console.log('Logged in user:', userData);
    setToken(authToken);
    setUser(userData);
    console.log("userData",userData);
    
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Debug: See what user is on every render
  useEffect(() => {
    console.log('Current user in App:', user);
  }, [user]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" />
            ) : (
              <LoginForm onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/register"
          element={
            user ? (
              <Navigate to="/dashboard" />
            ) : (
              <RegisterForm />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            user ? (
              
              (user.role && user.role.toLowerCase() === 'admin') ? (
                <AdminDashboard user={user} token={token} onLogout={handleLogout} />
              ) : (
                <UserDashboard user={user} token={token} onLogout={handleLogout} />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;