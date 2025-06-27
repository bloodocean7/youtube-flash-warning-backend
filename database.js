// database.js
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file for local development

// This URI will come from Vercel's environment variables in production
// For local testing, you might put it in a .env file or hardcode for dev.
const DB_URI = process.env.MONGO_URI;

if (!DB_URI) {
    console.error("MONGO_URI environment variable is not set!");
    // In a real app, you might throw an error or exit here.
}

async function connectDb() {
    if (mongoose.connections[0].readyState) {
        console.log('Already connected to MongoDB.');
        return; // Already connected
    }
    try {
        await mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        });
        console.log('MongoDB connected successfully.');
    } catch (err) {
        console.error('Could not connect to MongoDB:', err.message);
        // In a real app, you might want to retry connection or handle this gracefully.
    }
}

module.exports = connectDb;