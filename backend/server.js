import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import medicineRoutes from './routes/medicineRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication Routes
app.use('/api/auth', authRoutes);

// Medicine Routes
app.use('/api/medicines', medicineRoutes);

// Home Route
app.get('/', (req, res) => {
    res.send('Smart Pharmacy Backend is Running!');
});

// Health Check Route
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Smart Pharmacy API is working!'
    });
});

// Server Port
const PORT = process.env.PORT || 5000;

// Start Server
const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();