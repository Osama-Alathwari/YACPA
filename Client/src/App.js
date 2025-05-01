// App.js - Main application file
import React from 'react';
import HomePage from './pages/HomePage';
import { PrimeReactProvider } from 'primereact/api';

// Import styles (we've moved PrimeReact imports to index.css to control ordering)
import './App.css';

function App() {
  return (
    <PrimeReactProvider>
      <HomePage />
    </PrimeReactProvider>
  );
}

export default App;