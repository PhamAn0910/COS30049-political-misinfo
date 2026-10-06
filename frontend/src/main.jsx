// Role/Owner: Member 1 (Full-Stack & Integration Lead)
// Core Responsibility: React root mounting and DOM render bootstrap
// Key Interface/Contract: Binds `App.jsx` to `#root` element in `index.html`

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
