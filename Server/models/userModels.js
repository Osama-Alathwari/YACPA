// models/userModel.js
import pool from '../db.js';

const findUserByUsername = async (username) => {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
};

const addUser = async (username, hashedPassword) => {
    await pool.query('INSERT INTO users (username, passwordhash) VALUES ($1, $2)', [username, hashedPassword]);
};


export default {
    findUserByUsername,
    addUser,
};
