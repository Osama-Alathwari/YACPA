import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url'
import memberRoutes from './routes/memberRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { PORT } from './config.js';
import { startTokenCleanup } from './utils/tokenCleanup.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

startTokenCleanup();
const corsOrigins = process.env.CORS_ORIGINS.split(',');

// Configure CORS
app.use(cors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define a route
app.get('/', (req, res) => {
    res.send(`YACPA Management System API - ${req.hostname} || ${req.ip} || ${req.ips}`);
});

app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
