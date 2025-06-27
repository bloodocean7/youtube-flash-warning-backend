// models/VideoReport.js
const mongoose = require('mongoose');

const videoReportSchema = new mongoose.Schema({
    videoId: { type: String, required: true, unique: true },
    reportCount: { type: Number, default: 0 }
});

module.exports = mongoose.models.VideoReport || mongoose.model('VideoReport', videoReportSchema);