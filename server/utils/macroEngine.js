// server/utils/macroEngine.js
export const calculateMacros = (user) => {
    const { weight, height, age, gender, activityLevel, preference } = user;

    // 1. Calculate BMR
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr = gender === 'male' ? bmr + 5 : bmr - 161;

    // 2. Adjust for Activity
    const activityMultipliers = { sedentary: 1.2, moderate: 1.55, active: 1.75 };
    const tdee = bmr * activityMultipliers[activityLevel];

    // 3. Apply Diet Preference (Example: Keto)
    if (preference === 'Keto') {
        return {
            calories: Math.round(tdee),
            carbs: Math.round((tdee * 0.05) / 4), // 5% carbs
            protein: Math.round((tdee * 0.25) / 4), // 25% protein
            fats: Math.round((tdee * 0.70) / 9)    // 70% fats
        };
    }
    // Default Balanced Macros
    return { calories: Math.round(tdee), protein: 150, carbs: 200, fats: 70 };
};