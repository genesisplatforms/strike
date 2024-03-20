import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Public/App';
import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from "../src/Public/scrollToTop";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ScrollToTop />
    <App />
  </BrowserRouter>
);
