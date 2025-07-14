// controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import { v4 as uuidv4 } from 'uuid';


// Login function
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Input validation
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'اسم المستخدم وكلمة المرور مطلوبان'
            });
        }

        // Check if user exists
        const userQuery = 'SELECT * FROM users WHERE username = $1 AND isactive = true';
        const userResult = await pool.query(userQuery, [username]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'اسم المستخدم أو كلمة المرور غير صحيحة'
            });
        }

        const user = userResult.rows[0];

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.passwordhash);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'اسم المستخدم أو كلمة المرور غير صحيحة'
            });
        }

        // Generate unique JWT ID for this token
        const jwtId = uuidv4();
        const tokenExpiry = '24h';

        // Generate JWT token with JTI
        const token = jwt.sign(
            {
                userId: user.id,
                username: user.username,
                role: user.role,
                jti: jwtId // JWT ID for blacklisting
            },
            process.env.JWT_SECRET,
            { 
                expiresIn: tokenExpiry,
                // jwtid: jwtId
            }
        );

        // Update last login
        await pool.query(
            'UPDATE users SET lastlogin = CURRENT_TIMESTAMP WHERE id = $1', 
            [user.id]
        );

        res.json({
            success: true,
            message: 'تم تسجيل الدخول بنجاح',
            token,
            user: {
                id: user.id,
                username: user.username,
                name: user.name || user.username,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في الخادم'
        });
    }
};

// Signup function
const signup = async (req, res) => {
    try {
        const { username, password, email, phoneNumber } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'اسم المستخدم وكلمة المرور مطلوبة'
            });
        }

        // Check if username already exists
        const userCheck = await pool.query(
            'SELECT id FROM users WHERE username = $1',
            [username]
        );
        if (userCheck.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'اسم المستخدم مستخدم بالفعل'
            });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert new user into the database
        const insertQuery = `
            INSERT INTO users (username, passwordhash, email, phonenumber)
            VALUES ($1, $2, $3, $4)
            RETURNING id, username, email, phonenumber, isactive, createdat
        `;
        const insertResult = await pool.query(insertQuery, [
            username,
            hashedPassword,
            email || null,
            phoneNumber || null
        ]);

        res.status(201).json({
            success: true,
            message: 'تم إنشاء المستخدم بنجاح',
            user: insertResult.rows[0]
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء إنشاء المستخدم'
        });
    }
};

// Logout function
const logout = async (req, res) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(400).json({
                success: false,
                message: 'لا يوجد رمز مميز'
            });
        }

        const token = authHeader.substring(7);
        
        // Decode token to get JTI and expiration
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add token to blacklist
        const blacklistQuery = `
            INSERT INTO token_blacklist (token_jti, user_id, expires_at)
            VALUES ($1, $2, to_timestamp($3))
            ON CONFLICT (token_jti) DO NOTHING
        `;
        
        await pool.query(blacklistQuery, [
            decoded.jti,
            decoded.userId,
            decoded.exp
        ]);

        res.json({
            success: true,
            message: 'تم تسجيل الخروج بنجاح'
        });

    } catch (error) {
        console.error('Logout error:', error);
        
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'رمز مميز غير صالح'
            });
        }
        
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
        signup,
        logout,
        getProfile
    };