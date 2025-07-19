// src/services/apiService.js - Complete API service for AuthContext integration
import axios from 'axios';

class ApiService {
    constructor() {
        this.baseURL = process.env.REACT_APP_API_URL;

        // Create axios instance
        this.api = axios.create({
            baseURL: this.baseURL,
            timeout: 10000, // 10 seconds timeout
            headers: {
                'Content-Type': 'application/json',
            }
        });

        // Setup interceptors
        this.setupInterceptors();
    }

    setupInterceptors() {
        // Request interceptor - Add auth token to all requests
        this.api.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                // Add request timestamp for debugging
                config.metadata = { startTime: new Date() };

                console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);

                return config;
            },
            (error) => {
                console.error('❌ Request interceptor error:', error);
                return Promise.reject(error);
            }
        );

        // Response interceptor - Handle common responses and errors
        this.api.interceptors.response.use(
            (response) => {
                // Add response time for debugging
                if (response.config.metadata) {
                    response.config.metadata.endTime = new Date();
                    response.duration = response.config.metadata.endTime - response.config.metadata.startTime;
                }

                console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${response.duration}ms)`);

                return response;
            },
            (error) => {
                // Handle common error responses
                if (error.response) {
                    // Server responded with error status
                    const { status, data } = error.response;

                    console.log(`❌ API Error: ${status} - ${error.config?.url}`);

                    switch (status) {
                        case 401:
                            // Only handle as unauthorized if it's not the login endpoint
                            if (!error.config.url.includes('/auth/login')) {
                                // Unauthorized - token expired or invalid
                                console.log('🔐 Unauthorized - dispatching event');
                                this.handleUnauthorized();
                            }
                            break;
                        case 403:
                            // Forbidden - insufficient permissions
                            console.warn('🚫 Access forbidden:', data.message);
                            break;
                        case 429:
                            // Too many requests
                            console.warn('⏰ Rate limit exceeded:', data.message);
                            break;
                        case 500:
                            // Server error
                            console.error('🔥 Server error:', data.message);
                            break;
                        default:
                            console.error('⚠️ API error:', status, data.message);
                    }

                    // Enhance error with more details
                    error.message = data.message || error.message;
                    error.errorCode = data.errorCode;
                    error.statusCode = status;
                } else if (error.request) {
                    // Network error
                    console.error('🌐 Network error:', error.message);
                    error.message = 'Network error. Please check your internet connection.';
                    error.errorCode = 'NETWORK_ERROR';
                } else {
                    // Request setup error
                    console.error('⚙️ Request config error:', error.message);
                    error.message = 'Request configuration error';
                    error.errorCode = 'CONFIG_ERROR';
                }

                return Promise.reject(error);
            }
        );
    }

    // Handle unauthorized responses
    handleUnauthorized() {
        // Clear token and dispatch custom event for auth context to handle
        localStorage.removeItem('token');

        // Dispatch custom event for auth context to handle
        window.dispatchEvent(new CustomEvent('unauthorized'));

        console.log('🚪 Unauthorized event dispatched');
    }

    // Authentication endpoints
    async login(credentials) {
        try {
            console.log('🔐 Attempting login...');
            const response = await this.api.post('/auth/login', credentials);
            console.log('✅ Login successful');
            return response.data;
        } catch (error) {
            console.error('❌ Login API error:', error);
            throw this.enhanceAuthError(error);
        }
    }

    async logout() {
        try {
            console.log('🚪 Attempting logout...');
            const response = await this.api.post('/auth/logout');
            console.log('✅ Logout successful');
            return response.data;
        } catch (error) {
            console.error('❌ Logout API error:', error);
            // Don't throw error for logout - continue with local logout
            return { success: true, message: 'Logged out locally' };
        }
    }

    async getProfile() {
        try {
            console.log('👤 Fetching user profile...');
            const response = await this.api.get('/auth/profile');
            console.log('✅ Profile fetched successfully');
            return response.data;
        } catch (error) {
            console.error('❌ Get profile API error:', error);
            throw error;
        }
    }

    async refreshToken() {
        try {
            console.log('🔄 Refreshing token...');
            const response = await this.api.post('/auth/refresh');
            console.log('✅ Token refreshed successfully');
            return response.data;
        } catch (error) {
            console.error('❌ Refresh token API error:', error);
            throw error;
        }
    }

    async forgotPassword(email) {
        try {
            console.log('📧 Sending forgot password request...');
            const response = await this.api.post('/auth/forgot-password', { email });
            console.log('✅ Forgot password request sent');
            return response.data;
        } catch (error) {
            console.error('❌ Forgot password API error:', error);
            throw error;
        }
    }

    async resetPassword(token, newPassword) {
        try {
            console.log('🔑 Resetting password...');
            const response = await this.api.post('/auth/reset-password', {
                token,
                password: newPassword
            });
            console.log('✅ Password reset successful');
            return response.data;
        } catch (error) {
            console.error('❌ Reset password API error:', error);
            throw error;
        }
    }

    // Member endpoints
    async getMembers() {
        try {
            const response = await this.api.get('/members/get');
            return response.data;
        } catch (error) {
            console.error('❌ Get members API error:', error);
            throw error;
        }
    }

    async getMember(id) {
        try {
            const response = await this.api.get(`/members/${id}`);
            return response.data;
        } catch (error) {
            console.error('❌ Get member API error:', error);
            throw error;
        }
    }

    // Update the createMember method in apiService.js

    async createMember(memberData) {
        try {
            console.log('👤 Creating new member...');

            // Create FormData for file uploads
            const formData = new FormData();

            // Add text fields
            const textFields = [
                'fullNameArabic', 'fullNameEnglish', 'surname', 'idType', 'idNumber',
                'qualification', 'businessName', 'businessType', 'headOfficeAddress',
                'localBranchAddress', 'licenseNumber', 'licenseIssueDate', 'phone1',
                'phone2', 'mobile', 'whatsapp', 'email', 'paymentMethod', 'referenceNumber',
                'referenceDate', 'registrationFee', 'totalAmount', 'notes'
            ];

            textFields.forEach(field => {
                if (memberData[field] !== null && memberData[field] !== undefined) {
                    // Handle dates
                    if (field === 'licenseIssueDate' || field === 'referenceDate') {
                        if (memberData[field] instanceof Date) {
                            formData.append(field, memberData[field].toISOString().split('T')[0]);
                        } else {
                            formData.append(field, memberData[field]);
                        }
                    } else {
                        formData.append(field, memberData[field]);
                    }
                }
            });

            // Add subscription years as JSON string
            if (memberData.subscriptionYears && Array.isArray(memberData.subscriptionYears)) {
                formData.append('subscriptionYears', JSON.stringify(memberData.subscriptionYears));
            }

            // Add file fields
            const fileFields = [
                'profileImage', 'idImage', 'licenseImage', 'degreeImage',
                'signatureImage', 'paymentReceipt'
            ];

            fileFields.forEach(field => {
                if (memberData[field] && memberData[field] instanceof File) {
                    formData.append(field, memberData[field]);
                }
            });

            // Use multipart/form-data for file uploads
            const response = await this.api.post('/members/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 30000, // 30 seconds for file uploads
            });

            console.log('✅ Member created successfully');
            return response.data;
        } catch (error) {
            console.error('❌ Create member API error:', error);
            throw error;
        }
    }

    async updateMember(id, memberData) {
        try {
            const response = await this.api.put(`/members/${id}`, memberData);
            return response.data;
        } catch (error) {
            console.error('❌ Update member API error:', error);
            throw error;
        }
    }

    async deleteMember(id) {
        try {
            const response = await this.api.delete(`/members/${id}`);
            return response.data;
        } catch (error) {
            console.error('❌ Delete member API error:', error);
            throw error;
        }
    }

    // Health check
    async healthCheck() {
        try {
            console.log('🏥 Checking API health...');
            const response = await this.api.get('/health');
            console.log('✅ API health check passed');
            return response.data;
        } catch (error) {
            console.error('❌ Health check failed:', error);
            return {
                status: 'error',
                message: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    // Enhance authentication errors with user-friendly messages
    enhanceAuthError(error) {
        if (error.response) {
            const { status, data } = error.response;

            switch (status) {
                case 400:
                    error.userMessage = 'بيانات تسجيل الدخول غير صحيحة';
                    error.errorType = 'VALIDATION_ERROR';
                    break;
                case 401:
                    error.userMessage = 'اسم المستخدم أو كلمة المرور غير صحيحة';
                    error.errorType = 'INVALID_CREDENTIALS';
                    break;
                case 403:
                    error.userMessage = 'الحساب غير مفعل أو معطل';
                    error.errorType = 'ACCOUNT_DISABLED';
                    break;
                case 429:
                    error.userMessage = 'محاولات تسجيل دخول كثيرة جداً، يرجى المحاولة لاحقاً';
                    error.errorType = 'RATE_LIMITED';
                    break;
                case 500:
                    error.userMessage = 'خطأ في الخادم، يرجى المحاولة لاحقاً';
                    error.errorType = 'SERVER_ERROR';
                    break;
                default:
                    error.userMessage = data.message || 'حدث خطأ غير متوقع';
                    error.errorType = 'UNKNOWN_ERROR';
            }
        } else if (error.code === 'ECONNABORTED') {
            error.userMessage = 'انتهت مهلة الاتصال، يرجى المحاولة مرة أخرى';
            error.errorType = 'TIMEOUT_ERROR';
        } else if (error.request) {
            error.userMessage = 'تعذر الاتصال بالخادم، تحقق من اتصالك بالإنترنت';
            error.errorType = 'NETWORK_ERROR';
        } else {
            error.userMessage = 'حدث خطأ غير متوقع';
            error.errorType = 'UNKNOWN_ERROR';
        }

        return error;
    }

    // Cancel request utility
    createCancelToken() {
        return axios.CancelToken.source();
    }

    // Check if error is a cancellation
    isCancel(error) {
        return axios.isCancel(error);
    }

    // Get request statistics (for debugging)
    getRequestStats() {
        return {
            baseURL: this.baseURL,
            timeout: this.api.defaults.timeout,
            defaultHeaders: this.api.defaults.headers,
            environment: process.env.NODE_ENV,
            timestamp: new Date().toISOString()
        };
    }

    // Test connection to API
    async testConnection() {
        try {
            console.log('🧪 Testing API connection...');
            const startTime = Date.now();

            await this.healthCheck();

            const responseTime = Date.now() - startTime;
            console.log(`✅ Connection test passed (${responseTime}ms)`);

            return {
                success: true,
                responseTime,
                message: 'Connection successful'
            };
        } catch (error) {
            console.error('❌ Connection test failed:', error);
            return {
                success: false,
                error: error.message,
                message: 'Connection failed'
            };
        }
    }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;

// Export the class as well for testing or multiple instances
export { ApiService };