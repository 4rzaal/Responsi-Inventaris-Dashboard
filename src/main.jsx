import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import App from './App.jsx';
import { initJQueryEffects } from './legacy/jqueryEffects.js';

// Inisialisasi jQuery pada elemen notifikasi yang berada di luar root React.
const cleanupJQuery = initJQueryEffects();

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

if (import.meta.hot) {
  import.meta.hot.dispose(() => cleanupJQuery());
}
