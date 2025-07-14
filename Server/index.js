import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/authRoutes.js';
import { PORT } from './config.js';
import { startTokenCleanup } from './utils/tokenCleanup.js';

dotenv.config();

const app = express();
startTokenCleanup();
const corsOrigins = process.env.CORS_ORIGINS.split(',');

// Configure CORS
app.use(cors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));

app.use(express.json());

// Define a route
app.get('/', (req, res) => {
    res.send(`Hello World! ${req.hostname} || ${req.ip} || ${req.ips}`);
});

app.use('/api/auth', router);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
