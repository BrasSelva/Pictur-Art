import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from '../pages/HomePage';
import LoginPage from '../pages/login-register/LoginPage';
import RegisterPage from '../pages/login-register/RegisterPage';
import MotDePasseOublie from '../pages/login-register/motDePasseOublie';

import AlbumPage from '../pages/album/AlbumPage';
import ProfilagePage from '../pages/ProfilPage';
import LayoutConnecte from '../components/LayoutConnecte';
import PrivateRoute from '../components/PrivateRoute';

import MediaPage from '../pages/media/MediaPage';
import CodeTemporaire from '../pages/login-register/Temporaire';
import NouveauMotDePasse from '../pages/login-register/NouveauMotDePasse';

function AppRouter() {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/mot-de-passe-oublie" element={<MotDePasseOublie />} />
      <Route path="/codeTemporaire" element={<CodeTemporaire />} />
      <Route path="/nouveau-mot-de-passe" element={<NouveauMotDePasse />} />

      {/* Routes protégées */}
      <Route
        path="/albumPage"
        element={
          <PrivateRoute>
            <LayoutConnecte>
              <AlbumPage />
            </LayoutConnecte>
          </PrivateRoute>
        }
      />
      <Route
        path="/album"
        element={
          <PrivateRoute>
            <LayoutConnecte>
              <AlbumPage />
            </LayoutConnecte>
          </PrivateRoute>
        }
      />
      <Route
        path="/profilagePage"
        element={
          <PrivateRoute>
            <LayoutConnecte>
              <ProfilagePage />
            </LayoutConnecte>
          </PrivateRoute>
        }
      />

      {/* Route media (à protéger si besoin) */}
      <Route
        path="/album/:id_album/medias"
        element={
            <PrivateRoute>
            <LayoutConnecte>
                <MediaPage />
            </LayoutConnecte>
            </PrivateRoute>
        }
        />
    </Routes>
  );
}

export default AppRouter;
