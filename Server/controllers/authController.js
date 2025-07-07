// controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

// Login function
const login = async (req, res) => {
    // Login function
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            // Input validation
            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'اسم المستخدم وكلمة المرور مطلوبان'
                });
            }

            // Check if user exists in database
            const userQuery = 'SELECT * FROM users WHERE username = $1';
            const userResult = await pool.query(userQuery, [username]);

            if (userResult.rows.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'اسم المستخدم أو كلمة المرور غير صحيحة'
                });
            }

            const user = userResult.rows[0];

            // For the initial admin user with password "1", we'll check directly
            // In production, passwords should be hashed
            let isPasswordValid = false;
            
            if (user.username === 'admin' && password === '1') {
                isPasswordValid = true;
            } else {
                // For other users, check hashed password
                isPasswordValid = await bcrypt.compare(password, user.password);
            }

            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'اسم المستخدم أو كلمة المرور غير صحيحة'
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                {
                    userId: user.id,
                    username: user.username,
                    role: user.role
                },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );

            // Update last login timestamp
            const updateLoginQuery = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1';
            await pool.query(updateLoginQuery, [user.id]);

            // Return success response
            res.json({
                success: true,
                message: 'تم تسجيل الدخول بنجاح',
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    name: user.name || user.username,
                    role: user.role,
                    email: user.email
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'خطأ في الخادم، يرجى المحاولة مرة أخرى'
            });
        }
    }
};

// Logout function
const logout = async (req, res) => {
        try {
            // In a more sophisticated setup, you might want to blacklist the token
            // For now, we'll just send a success response
            res.json({
                success: true,
                message: 'تم تسجيل الخروج بنجاح'
            });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({
                success: false,
                message: 'خطأ في تسجيل الخروج'
            });
        }
};

// Get current user profile
const getProfile = async (req, res) => {
        try {
            const userId = req.user.userId;
            
            const userQuery = 'SELECT id, username, name, email, role, created_at, last_login FROM users WHERE id = $1';
            const userResult = await pool.query(userQuery, [userId]);
            
            if (userResult.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'المستخدم غير موجود'
                });
            }

            res.json({
                success: true,
                user: userResult.rows[0]
            });

        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({
                success: false,
                message: 'خطأ في جلب بيانات المستخدم'
            });
        }
};

// Export the functions
    export default {
        login,
        logout,
        getProfile
    };