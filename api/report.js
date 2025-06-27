// api/report.js
const mongoose = require('mongoose');
const VideoReport = require('../models/VideoReport'); // Path to your model
const connectDb = require('../database'); // Path to your DB connection

module.exports = async (req, res) => {
    // Set CORS headers manually for Vercel functions
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins for now
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    await connectDb(); // Ensure database is connected

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { videoId } = req.body;

    if (!videoId) {
        return res.status(400).json({ message: 'Video ID is required.' });
    }

    try {
        let video = await VideoReport.findOne({ videoId: videoId });

        if (video) {
            video.reportCount += 1;
            await video.save();
            return res.status(200).json({ message: 'Report updated', reportCount: video.reportCount });
        } else {
            video = new VideoReport({ videoId: videoId, reportCount: 1 });
            await video.save();
            return res.status(201).json({ message: 'Video reported', reportCount: 1 });
        }
    } catch (error) {
        console.error('Error processing report:', error);
        res.status(500).json({ message: 'Server error during reporting.', error: error.message });
    }
};