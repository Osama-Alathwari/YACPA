// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is authenticated on initial load
    useEffect(() => {
        // Check for saved token in localStorage
        const token = localStorage.getItem('token');

        if (token) {
            // Here you would typically validate the token with your backend
            // For demo purposes, we'll just consider having a token as being authenticated
            setIsAuthenticated(true);

            // Mock user data - in a real app, this would come from decoded token or a user profile API
            setUser({
                id: 1,
                username: 'admin',
                name: 'أحمد محمد',
                role: 'admin',
                permissions: ['view_members', 'add_members', 'edit_members', 'renew_subscriptions', 'view_reports']
            });
        }

        // Set loading to false once we've checked authentication
        setIsLoading(false);
    }, []);

    // Login function
    const login = async (username, password) => {
        try {
            setIsLoading(true);

            // This would be an actual API call in a real app
            // Simulating API call with timeout
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Validate credentials (mock)
            if (username === 'admin' && password === '123456') {
                // Mock successful login
                const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substr(2);

                // Store token
                localStorage.setItem('token', mockToken);

                // Set auth state
                setIsAuthenticated(true);
                setUser({
                    id: 1,
                    username: 'admin',
                    name: 'أحمد محمد',
                    role: 'admin',
                    permissions: ['view_members', 'add_members', 'edit_members', 'renew_subscriptions', 'view_reports']
                });

                return { success: true };
            } else {
                return {
                    success: false,
                    error: 'Invalid username or password'
                };
            }
        } catch (error) {
            return {
                success: false,
                error: error.message || 'An error occurred during login'
            };
        } finally {
            setIsLoading(false);
        }
    };

    // Logout function
    const logout = () => {
        // Remove token from storage
        localStorage.removeItem('token');

        // Reset auth state
        setIsAuthenticated(false);
        setUser(null);
    };

    // Check if user has a specific permission
    const hasPermission = (permission) => {
        if (!user || !user.permissions) {
            return false;
        }

        return user.permissions.includes(permission);
    };

    // Context value
    const value = {
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
        hasPermission
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;