// config.js
import dotenv from 'dotenv';
dotenv.config();
export const PORT = process.env.PORT;
export const SECRET_KEY = process.env.SECRET_KEY;
export const DATABASE_URL = process.env.DATABASE_URL;
