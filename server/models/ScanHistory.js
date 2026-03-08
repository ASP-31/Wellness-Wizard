const mongoose = require('mongoose');

const ScanHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    foodName: { type: String, required: true },
    isHealthy: { type: Boolean },
    reasoning: { type: String },
    macros: {
        calories: Number,
        carbs: Number,
        protein: Number,
        fats: Number
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ScanHistory', ScanHistorySchema);