import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(reg => console.log('✅ Service Worker enregistré', reg))
      .catch(err => console.error('❌ Échec SW', err));
  });
}

root.render(<React.StrictMode><App /></React.StrictMode>);
