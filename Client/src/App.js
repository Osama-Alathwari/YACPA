// App.js - Main application file
import React, { Suspense } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import AppRoutes from './routes/AppRoutes';

// Import i18n (needs to be loaded before the app)
import './i18n';

// Import styles
import './App.css';
import './styles/contact-page.css';
import './styles/about-page.css';

// Simple loading component
const Loading = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className="pi pi-spin pi-spinner text-4xl text-blue-500 mb-3"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <PrimeReactProvider>
        <AppRoutes />
      </PrimeReactProvider>
    </Suspense>
  );
}

export default App;