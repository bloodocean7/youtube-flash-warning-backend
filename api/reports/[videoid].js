// api/reports/[videoId].js
const mongoose = require('mongoose');
const VideoReport = require('../../models/VideoReport'); // Path to your model
const connectDb = require('../../database'); // Path to your DB connection

module.exports = async (req, res) => {
    // Set CORS headers manually for Vercel functions
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins for now
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    await connectDb();

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // Vercel's req.query will contain dynamic segments like [videoId]
    const videoId = req.query.videoId; // This gets the value from the URL path e.g. /api/reports/abcdefg

    if (!videoId) {
        return res.status(400).json({ message: 'Video ID is required.' });
    }

    try {
        const video = await VideoReport.findOne({ videoId: videoId });

        if (video) {
            return res.status(200).json({ reportCount: video.reportCount });
        } else {
            return res.status(200).json({ reportCount: 0 });
        }
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ message: 'Server error fetching report.', error: error.message });
    }
};