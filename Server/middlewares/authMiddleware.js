// middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const verifyToken = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'لا يوجد رمز مميز، الوصول مرفوض'
            });
        }

        // Extract token
        const token = authHeader.substring(7);

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

        // Check if token is blacklisted
        const blacklistQuery = `
            SELECT 1 FROM token_blacklist 
            WHERE token_jti = $1 AND expires_at > CURRENT_TIMESTAMP
        `;
        const blacklistResult = await pool.query(blacklistQuery, [decoded.jti]);

        if (blacklistResult.rows.length > 0) {
            return res.status(401).json({
                success: false,
                message: 'تم إلغاء صلاحية الرمز المميز'
            });
        }

        // Check if user still exists and is active
        const userQuery = `
            SELECT id, username, role, isactive
            FROM users 
            WHERE id = $1 AND isactive = true
        `;
        const userResult = await pool.query(userQuery, [decoded.userId]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'المستخدم غير موجود أو غير مفعل'
            });
        }

        // const user = userResult.rows[0];

        // Optional: Check token version for additional security
        // if (user.token_version && decoded.tokenVersion !== user.token_version) {
        //     return res.status(401).json({
        //         success: false,
        //         message: 'انتهت صلاحية الجلسة'
        //     });
        // }

        // Add user info to request object
        req.user = {
            userId: decoded.userId,
            username: decoded.username,
            role: decoded.role,
            jti: decoded.jti
        };

        next();
    } catch (error) {
        console.error('Token verification error:', error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'رمز مميز غير صالح'
            });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'انتهت صلاحية الرمز المميز'
            });
        } else {
            return res.status(500).json({
                success: false,
                message: 'خطأ في التحقق من الرمز المميز'
            });
        }
    }
};

// Middleware to check specific roles
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'المستخدم غير مسجل'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'ليس لديك صلاحية للوصول لهذا المورد'
            });
        }

        next();
    };
};

export default verifyToken;
export { requireRole };