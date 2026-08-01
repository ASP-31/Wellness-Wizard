// server/utils/macroEngine.js
export const calculateMacros = (user) => {
    const weight = parseFloat(user.weight) || 70;
    const height = parseFloat(user.height) || 170;
    const age = parseInt(user.age, 10) || 25;
    const gender = user.gender || 'male';
    const activityLevel = user.activityLevel || user.activity || 'moderate';
    const preference = user.preference || (user.preferences && user.preferences[0]) || 'Balanced';
    const goalType = user.goalType || 'maintenance'; // 'deficit', 'maintenance', 'surplus'

    // 1. Calculate BMR using Mifflin-St Jeor Formula
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr = gender === 'male' ? bmr + 5 : bmr - 161;

    // 2. Adjust for Activity Level
    const activityMultipliers = { sedentary: 1.2, moderate: 1.55, active: 1.75 };
    const multiplier = activityMultipliers[activityLevel] || 1.55;
    let tdee = Math.max(1200, bmr * multiplier);

    // 3. Adjust Calorie Goal based on Weight Objective
    if (goalType === 'deficit') {
        tdee *= 0.85; // 15% Calorie Deficit for Fat Loss
    } else if (goalType === 'surplus') {
        tdee *= 1.15; // 15% Calorie Surplus for Muscle Building
    }

    const totalCalories = Math.round(tdee);

    // 4. Calculate Macro Split based on Diet Preference
    let proteinGrams, carbsGrams, fatsGrams;

    if (preference === 'Keto') {
        carbsGrams = Math.round((totalCalories * 0.05) / 4);   // 5% carbs
        proteinGrams = Math.round((totalCalories * 0.25) / 4); // 25% protein
        fatsGrams = Math.round((totalCalories * 0.70) / 9);    // 70% fats
    } else if (preference === 'High Protein') {
        proteinGrams = Math.round((totalCalories * 0.40) / 4); // 40% protein
        carbsGrams = Math.round((totalCalories * 0.35) / 4);   // 35% carbs
        fatsGrams = Math.round((totalCalories * 0.25) / 9);    // 25% fats
    } else if (preference === 'Low Carb') {
        carbsGrams = Math.round((totalCalories * 0.20) / 4);   // 20% carbs
        proteinGrams = Math.round((totalCalories * 0.45) / 4); // 45% protein
        fatsGrams = Math.round((totalCalories * 0.35) / 9);    // 35% fats
    } else { // Balanced
        proteinGrams = Math.round((totalCalories * 0.30) / 4); // 30% protein
        carbsGrams = Math.round((totalCalories * 0.45) / 4);   // 45% carbs
        fatsGrams = Math.round((totalCalories * 0.25) / 9);    // 25% fats
    }

    return {
        calories: totalCalories,
        protein: proteinGrams,
        carbs: carbsGrams,
        fats: fatsGrams
    };
};