import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/login-register/LoginPage';
import RegisterPage from './pages/login-register/RegisterPage';
import MotDePasseOublie from './pages/login-register/motDePasseOublie';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/mot-de-passe-oublie" element={<MotDePasseOublie />} />
      </Routes>
    </Router>
  );
}

export default App;
