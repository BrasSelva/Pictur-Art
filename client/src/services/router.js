// client/src/services/router.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from '../pages/HomePage';
import LoginPage from '../pages/login-register/LoginPage';
import RegisterPage from '../pages/login-register/RegisterPage';
import MotDePasseOublie from '../pages/login-register/motDePasseOublie';

import MediaPage from '../pages/media/MediaPage'; // ou '../media/MediaPage' selon ta structure

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/mot-de-passe-oublie" element={<MotDePasseOublie />} />
      <Route path="/album/:id_album/medias" element={<MediaPage />} />
    </Routes>
  );
}

export default AppRouter;
