import mongoose from 'mongoose';

const scanHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    foodName: { type: String, required: true },
    imageUrl: { type: String }, // New field for the photo
    isHealthy: { type: Boolean },
    reasoning: { type: String },
    macros: {
        calories: Number,
        carbs: Number,
        protein: Number,
        fats: Number
    }
}, { timestamps: true });

export default mongoose.model("ScanHistory", scanHistorySchema);