// controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
// import bcrypt from 'bcrypt';


// Login function
const login = async (req, res) => {
    try {
        // Ensure req.body exists and is an object
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({
                success: false,
                message: 'البيانات المرسلة غير صحيحة'
            });
        }

        // Extract username and password safely
        const username = req.body.username;
        const password = req.body.password;

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

        let isPasswordValid = false;

        
            // For other users, check hashed password
            isPasswordValid = await bcrypt.compare(
                password,
                user.passwordhash || user.password_hash || user.PasswordHash || ''
            );
        

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
                // role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Update last login timestamp
        const updateLoginQuery = 'UPDATE users SET lastlogin = CURRENT_TIMESTAMP WHERE id = $1';
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
                // email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في الخادم، يرجى المحاولة مرة أخرى'
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
        signup,
        logout,
        getProfile
    };