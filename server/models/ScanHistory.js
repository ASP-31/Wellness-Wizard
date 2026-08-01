import mongoose from 'mongoose';

const scanHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    foodName: { type: String, required: true },
    imageUrl: { type: String },
    isHealthy: { type: Boolean },
    healthScore: { type: Number, default: 80 },
    portionSize: { type: String, default: "1 serving" },
    reasoning: { type: String },
    dietAdvice: { type: String },
    macros: {
        calories: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        protein: { type: Number, default: 0 },
        fats: { type: Number, default: 0 }
    },
    micros: {
        fiber: { type: Number, default: 0 },
        sugar: { type: Number, default: 0 },
        sodium: { type: Number, default: 0 }
    }
}, { timestamps: true });

// Explicit compound index to optimize dashboard queries mapping user history
scanHistorySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("ScanHistory", scanHistorySchema);