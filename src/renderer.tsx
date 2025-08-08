import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// Antd styles will be imported automatically by babel-plugin-import

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
