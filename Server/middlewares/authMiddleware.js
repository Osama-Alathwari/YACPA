// middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';

import { SECRET_KEY } from '../config.js';

const { verify } = jwt;
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verify(token, SECRET_KEY);
        req.user = decoded; // Attach user to request
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export default verifyToken;
