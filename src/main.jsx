// Keep Render backend alive — ping every 10 minutes
const keepAlive = () => {
  fetch('https://task-79s6.onrender.com/api/login', { method: 'GET' })
    .catch(() => {}); // silently ignore errors
};

keepAlive(); // ping on app load
setInterval(keepAlive, 10 * 60 * 1000); // then every 10 minutes

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);