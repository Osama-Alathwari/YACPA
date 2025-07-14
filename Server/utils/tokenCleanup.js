// utils/tokenCleanup.js
import pool from '../db.js';
import cron from 'node-cron';

// Function to clean up expired tokens
const cleanupExpiredTokens = async () => {
    try {
        const result = await pool.query(
            'DELETE FROM token_blacklist WHERE expires_at < CURRENT_TIMESTAMP'
        );
        
        console.log(`Cleaned up ${result.rowCount} expired blacklisted tokens`);
    } catch (error) {
        console.error('Error cleaning up expired tokens:', error);
    }
};

// Schedule cleanup every hour
const startTokenCleanup = () => {
    // Run every hour at minute 0
    cron.schedule('0 * * * *', cleanupExpiredTokens);
    console.log('Token cleanup scheduler started');
};

export { cleanupExpiredTokens, startTokenCleanup };