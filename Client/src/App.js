// src/App.js
import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import { Toast } from 'primereact/toast';

// Import i18n (needs to be loaded before the app)
import './i18n';

// Import auth context
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';

// Import pages
import HomePage from './pages/HomePage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactusPage';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';

// Import dashboard routes
import DashboardRoutes from './routes/DashboardRoutes';

// Import styles
import './App.css';
import './styles/contact-page.css';
import './styles/about-page.css';
import './styles/dashboard.css';
import './styles/login-animations.css';

// Simple loading component
const Loading = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className="pi pi-spin pi-spinner text-4xl text-blue-500 mb-3"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const [isReady, setIsReady] = useState(false);
  const toast = React.createRef();

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return <Loading />;
  }

  return (
    <Suspense fallback={<Loading />}>
      <PrimeReactProvider>
        <AuthProvider>
          <LanguageProvider>
            <Router>
              <Toast ref={toast} position="top-right" />
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutUsPage />} />
                <Route path="/contact" element={<ContactUsPage />} />
                <Route path="/membership" element={<HomePage />} /> {/* Replace with actual MembershipPage when available */}
                <Route path="/events" element={<HomePage />} /> {/* Replace with actual EventsPage when available */}
                <Route path="/resources" element={<HomePage />} /> {/* Replace with actual ResourcesPage when available */}

                {/* Auth routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/logout" element={<LogoutPage />} />

                {/* Dashboard routes - protected */}
                <Route
                  path="/dashboard/*"
                  element={
                    <ProtectedRoute>
                      <DashboardRoutes />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </LanguageProvider>
        </AuthProvider>
      </PrimeReactProvider>
    </Suspense>
  );
}

export default App;