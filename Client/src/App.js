// App.js - Main application file
import React from 'react';
import { PrimeReactProvider } from 'primereact/api';
import AppRoutes from './routes/AppRoutes';

// Import styles
import './App.css';
// Import contact page specific styles (include once the file is created)
import './styles/contact-page.css';

function App() {
  return (
    <PrimeReactProvider>
      <AppRoutes />
    </PrimeReactProvider>
  );
}

export default App;