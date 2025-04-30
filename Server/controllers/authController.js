// controllers/authController.js
import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { SECRET_KEY } from '../config.js';
import userModels from '../models/userModels.js';

const { sign } = jwt;
const { addUser, findUserByUsername } = userModels;

const signup = async (req, res) => {
    const { username, password } = req.body;
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await hash(password, 10);
    await addUser(username, hashedPassword);

    res.status(201).json({ message: 'User created successfully' });
};

const login = async (req, res) => {
    const { username, password } = req.body;

    const user = await findUserByUsername(username);
    if (!user) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isMatch = await compare(password, user.passwordhash);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    const token = sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token });
};

export default {
    signup,
    login,
};
