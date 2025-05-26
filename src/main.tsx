import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Detecteer systeemthema en zet body class
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.body.classList.add(prefersDark ? 'dark' : 'light');
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  document.body.classList.toggle('dark', e.matches);
  document.body.classList.toggle('light', !e.matches);
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
) 