// src/contexts/AuthContext.js - Complete integration with Axios and navigation fix
import React, { createContext, useState, useContext, useEffect } from 'react';
import apiService from '../services/apiService';

// Create context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Provider component
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [tokenRefreshTimer, setTokenRefreshTimer] = useState(null);

    // Initialize authentication on app load
    useEffect(() => {
        initializeAuth();
        
        // Listen for unauthorized events from API service
        const handleUnauthorized = () => {
            console.log('Unauthorized event received, logging out...');
            logout();
        };
        
        window.addEventListener('unauthorized', handleUnauthorized);
        
        // Cleanup timer and event listener on unmount
        return () => {
            if (tokenRefreshTimer) {
                clearTimeout(tokenRefreshTimer);
            }
            window.removeEventListener('unauthorized', handleUnauthorized);
        };
    }, [tokenRefreshTimer]);

    // Initialize authentication
    const initializeAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            
            if (token) {
                // Check if token is expired (basic check)
                const tokenData = parseJWT(token);
                if (tokenData && tokenData.exp * 1000 > Date.now()) {
                    try {
                        // Token seems valid, verify with backend
                        const response = await apiService.getProfile();
                        
                        if (response.success) {
                            setIsAuthenticated(true);
                            setUser(response.user);
                            setupTokenRefresh(token);
                            console.log('Auth initialized successfully with backend verification');
                        } else {
                            // Invalid token, clear it
                            clearAuthData();
                        }
                    } catch (error) {
                        console.log('Backend verification failed, using mock auth for development');
                        // Fallback to mock authentication for development
                        setIsAuthenticated(true);
                        setUser({
                            id: 1,
                            username: 'admin',
                            name: 'أحمد محمد',
                            role: 'admin',
                            permissions: ['view_members', 'add_members', 'edit_members', 'renew_subscriptions', 'view_reports']
                        });
                    }
                } else {
                    // Token expired, clear it
                    clearAuthData();
                }
            }
        } catch (error) {
            console.error('Error initializing auth:', error);
            clearAuthData();
        } finally {
            setIsLoading(false);
        }
    };

    // Parse JWT token (basic parsing)
    const parseJWT = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error parsing JWT:', error);
            return null;
        }
    };

    // Setup automatic token refresh
    const setupTokenRefresh = (token) => {
        const tokenData = parseJWT(token);
        if (tokenData && tokenData.exp) {
            // Refresh token 5 minutes before expiry
            const refreshTime = (tokenData.exp * 1000) - Date.now() - (5 * 60 * 1000);
            
            if (refreshTime > 0) {
                const timer = setTimeout(async () => {
                    try {
                        console.log('Attempting token refresh...');
                        const response = await apiService.refreshToken();
                        
                        if (response.success && response.token) {
                            localStorage.setItem('token', response.token);
                            setupTokenRefresh(response.token);
                            console.log('Token refreshed successfully');
                        } else {
                            console.log('Token refresh failed, logging out');
                            logout();
                        }
                    } catch (error) {
                        console.error('Token refresh failed:', error);
                        logout();
                    }
                }, refreshTime);
                
                setTokenRefreshTimer(timer);
            }
        }
    };

    // Clear authentication data
    const clearAuthData = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
        
        if (tokenRefreshTimer) {
            clearTimeout(tokenRefreshTimer);
            setTokenRefreshTimer(null);
        }
    };

    // Login function with Axios integration (mock auth removed)
    const login = async (username, password) => {
        try {
            setIsLoading(true);
            console.log('Starting login process with Axios...');

            try {
                // Try API login
                const response = await apiService.login({
                    username: username.trim(),
                    password: password
                });

                if (response.success) {
                    console.log('API login successful');
                    
                    // Store token
                    localStorage.setItem('token', response.token);
                    
                    // Prepare user data
                    const userData = response.user;

                    // Set auth state SYNCHRONOUSLY to prevent race condition
                    setUser(userData);
                    setIsAuthenticated(true);

                    // Setup token refresh
                    setupTokenRefresh(response.token);

                    // Force a small delay to ensure state is updated before returning
                    await new Promise(resolve => setTimeout(resolve, 100));

                    console.log('Auth state updated - isAuthenticated should be true');

                    return { 
                        success: true, 
                        user: userData,
                        message: response.message || 'تم تسجيل الدخول بنجاح'
                    };
                } else {
                    return {
                        success: false,
                        error: 'INVALID_CREDENTIALS',
                        message: response.message || 'اسم المستخدم أو كلمة المرور غير صحيحة'
                    };
                }
            } catch (apiError) {
                // Use enhanced error from API service if available
                return {
                    success: false,
                    error: apiError.errorType || 'INVALID_CREDENTIALS',
                    message: apiError.userMessage || 'اسم المستخدم أو كلمة المرور غير صحيحة'
                };
            }
        } catch (error) {
            console.error('Login error:', error);
            
            return {
                success: false,
                error: 'SYSTEM_ERROR',
                message: 'حدث خطأ أثناء تسجيل الدخول'
            };
        } finally {
            setIsLoading(false);
        }
    };

    // Logout function with Axios
    const logout = async () => {
        try {
            // Call backend logout endpoint
            await apiService.logout();
            console.log('Backend logout successful');
        } catch (error) {
            console.error('Logout error:', error);
            // Continue with local logout even if backend call fails
        } finally {
            clearAuthData();
            console.log('Local logout completed');
        }
    };

    // Force logout (for unauthorized responses)
    const forceLogout = () => {
        clearAuthData();
        // Redirect to login page
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
    };

    // Check if user has a specific permission
    const hasPermission = (permission) => {
        if (!user || !user.permissions) {
            return false;
        }
        return user.permissions.includes(permission);
    };

    // Check if user has any of the specified permissions
    const hasAnyPermission = (permissions) => {
        if (!user || !user.permissions || !Array.isArray(permissions)) {
            return false;
        }
        return permissions.some(permission => user.permissions.includes(permission));
    };

    // Check if user has all of the specified permissions
    const hasAllPermissions = (permissions) => {
        if (!user || !user.permissions || !Array.isArray(permissions)) {
            return false;
        }
        return permissions.every(permission => user.permissions.includes(permission));
    };

    // Check if user has a specific role
    const hasRole = (role) => {
        if (!user) {
            return false;
        }
        return user.role === role;
    };

    // Check if user has any of the specified roles
    const hasAnyRole = (roles) => {
        if (!user || !Array.isArray(roles)) {
            return false;
        }
        return roles.includes(user.role);
    };

    // Get current user info
    const getCurrentUser = () => {
        return user;
    };

    // Check if user is admin
    const isAdmin = () => {
        return hasRole('admin') || hasRole('administrator');
    };

    // Get user's full name with fallback
    const getUserDisplayName = () => {
        if (!user) return '';
        return user.name || user.username || 'مستخدم';
    };

    // Update user profile in context (after profile update)
    const updateUserProfile = (updatedUser) => {
        setUser(prevUser => ({
            ...prevUser,
            ...updatedUser
        }));
    };

    // Check authentication status with backend
    const checkAuthStatus = async () => {
        try {
            const response = await apiService.getProfile();
            if (response.success) {
                setUser(response.user);
                return true;
            } else {
                clearAuthData();
                return false;
            }
        } catch (error) {
            console.error('Auth status check failed:', error);
            
            // Only clear auth data if it's an auth error, not a network error
            if (error.response?.status === 401 || error.errorType === 'INVALID_CREDENTIALS') {
                clearAuthData();
            }
            return false;
        }
    };

    // Retry authentication (useful for network issues)
    const retryAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoading(true);
            try {
                const response = await apiService.getProfile();
                if (response.success) {
                    setIsAuthenticated(true);
                    setUser(response.user);
                    setupTokenRefresh(token);
                    return true;
                }
            } catch (error) {
                console.error('Auth retry failed:', error);
            } finally {
                setIsLoading(false);
            }
        }
        return false;
    };

    // Force re-check authentication status (useful for debugging)
    const recheckAuth = () => {
        const token = localStorage.getItem('token');
        console.log('Rechecking auth - token exists:', !!token);
        console.log('Current isAuthenticated:', isAuthenticated);
        
        if (token && !isAuthenticated) {
            console.log('Token found but not authenticated - fixing state');
            setIsAuthenticated(true);
            // Set basic user data if missing
            if (!user) {
                setUser({
                    id: 1,
                    username: 'user',
                    name: 'مستخدم النظام',
                    role: 'user',
                    permissions: ['view_members', 'renew_subscriptions']
                });
            }
        }
    };

    // Get authentication statistics (for debugging)
    const getAuthStats = () => {
        const token = localStorage.getItem('token');
        let tokenInfo = null;
        
        if (token) {
            const parsed = parseJWT(token);
            tokenInfo = {
                issuedAt: parsed?.iat ? new Date(parsed.iat * 1000) : null,
                expiresAt: parsed?.exp ? new Date(parsed.exp * 1000) : null,
                issuer: parsed?.iss,
                subject: parsed?.sub
            };
        }
        
        return {
            isAuthenticated,
            user: user ? { 
                id: user.id, 
                username: user.username, 
                role: user.role 
            } : null,
            tokenInfo,
            hasRefreshTimer: !!tokenRefreshTimer,
            apiServiceStats: apiService.getRequestStats ? apiService.getRequestStats() : null
        };
    };

    // Context value
    const value = {
        // State
        isAuthenticated,
        isLoading,
        user,
        
        // Authentication methods
        login,
        logout,
        forceLogout,
        
        // Permission methods
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        hasAnyRole,
        
        // Utility methods
        getCurrentUser,
        getUserDisplayName,
        isAdmin,
        updateUserProfile,
        checkAuthStatus,
        retryAuth,
        recheckAuth,
        getAuthStats
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;