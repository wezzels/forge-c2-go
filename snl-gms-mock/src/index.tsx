import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Ag-Grid styles - REQUIRED for table interactivity
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
