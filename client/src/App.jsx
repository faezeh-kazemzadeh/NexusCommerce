// client/src/App.jsx
import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

import { setBaseURL } from './core/services/apiClient';
import { Axios } from 'axios';

import AppRouter from './core/router/AppRouter';
function App() {
  useEffect(() => {
       const API_BASE_URL = '/api'; 
    setBaseURL(API_BASE_URL);
    console.log(`Axios Base URL set to: ${API_BASE_URL}`);
  }, []);
  return (
    <>
    <AppRouter />
      
    </>
  );
}

export default App;