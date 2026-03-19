import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  age: Number,
  gender: { type: String, enum: ['male', 'female'] },
  height: Number, // in cm
  weight: Number, // in kg
  activityLevel: { type: String, enum: ['sedentary', 'moderate', 'active'] },
  preferences: [String], // e.g., ['Keto', 'High Protein']
  goals: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number
  }
});

export default mongoose.model('User', userSchema);