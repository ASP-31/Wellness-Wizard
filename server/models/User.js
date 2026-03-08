const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  
  // Physical Profile for BMR calculations
  stats: {
    age: Number,
    gender: { type: String, enum: ['male', 'female', 'other'] },
    weight: Number, // in kg
    height: Number, // in cm
    activityLevel: { 
      type: String, 
      enum: ['sedentary', 'moderate', 'active', 'athlete'],
      default: 'moderate'
    }
  },

  // The "AI Context" Data
  preferences: {
    dietType: { 
      type: String, 
      enum: ['None', 'Keto', 'Vegan', 'Paleo', 'Diabetic', 'Low-Carb'], 
      default: 'None' 
    },
    allergies: [String], // e.g., ["Peanuts", "Gluten"]
    dislikedIngredients: [String]
  },

  // Daily Targets (Calculated on Signup)
  dailyGoals: {
    calories: { type: Number, default: 2000 },
    protein: { type: Number, default: 150 },
    carbs: { type: Number, default: 200 },
    fats: { type: Number, default: 70 }
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);