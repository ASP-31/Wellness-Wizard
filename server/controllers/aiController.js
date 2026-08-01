import { GoogleGenerativeAI } from "@google/generative-ai";
import User from "../models/User.js";
import ScanHistory from "../models/ScanHistory.js";
import CircuitBreaker from "opossum";
import logger from "../utils/logger.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const callGeminiApi = async ({ model, prompt, pureBase64, mimeType }) => {
    let result;
    if (pureBase64) {
        result = await model.generateContent([
            prompt,
            { inlineData: { data: pureBase64, mimeType } }
        ]);
    } else {
        result = await model.generateContent(prompt);
    }
    const response = await result.response;
    return JSON.parse(response.text());
};

const breakerOptions = {
    timeout: 20000, 
    errorThresholdPercentage: 50, 
    resetTimeout: 30000
};
const aiBreaker = new CircuitBreaker(callGeminiApi, breakerOptions);

aiBreaker.on('open', () => logger.warn("AI Circuit Breaker opened"));
aiBreaker.on('halfOpen', () => logger.info("AI Circuit Breaker half-open"));
aiBreaker.on('close', () => logger.info("AI Circuit Breaker closed"));

export const analyzeImage = async (req, res) => {
    try {
        const { imageBase64 } = req.body;
        if (!imageBase64) return res.status(400).json({ error: "No image payload provided" });
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        let mimeType = "image/jpeg";
        if (imageBase64.includes("data:")) {
            mimeType = imageBase64.split(";")[0].split(":")[1];
        }
        
        const pureBase64 = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;

        const diet = user.preference || "General";
        const allergies = user.allergies || "None";

        const prompt = `
            Act as a clinical nutritionist and expert dietitian. Analyze this food image.
            User Profile: Diet Focus: ${diet}, Allergies/Restrictions: ${allergies}.

            Return a valid JSON object matching exactly this schema:
            {
                "foodName": "Descriptive Food Name",
                "isHealthy": true/false,
                "healthScore": number (1 to 100),
                "portionSize": "Estimated portion e.g. ~300g (1 plate)",
                "reasoning": "Detailed nutritional analysis breakdown, noting any allergen warnings if present",
                "dietAdvice": "Actionable personalized advice specifically tailored to user's ${diet} goal",
                "macros": { "calories": number, "carbs": number, "protein": number, "fats": number },
                "micros": { "fiber": number, "sugar": number, "sodium": number }
            }
            Output ONLY valid JSON. No markdown formatting or extra text.
        `;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const analysis = await aiBreaker.fire({ model, prompt, pureBase64, mimeType });

        const newScan = new ScanHistory({
            userId: user._id,
            imageUrl: req.body.imagePreviewUrl || "",
            foodName: analysis.foodName || "Identified Meal",
            isHealthy: analysis.isHealthy !== undefined ? analysis.isHealthy : true,
            healthScore: analysis.healthScore || 80,
            portionSize: analysis.portionSize || "1 serving",
            reasoning: analysis.reasoning || "Balanced meal analyzed by AI.",
            dietAdvice: analysis.dietAdvice || `Fits well with your ${diet} plan.`,
            macros: analysis.macros || { calories: 350, carbs: 40, protein: 20, fats: 10 },
            micros: analysis.micros || { fiber: 5, sugar: 4, sodium: 300 }
        });

        await newScan.save();
        res.json({ message: "Success", data: newScan });

    } catch (error) {
        logger.error({ err: error }, "AI Image Analysis Error");
        if (aiBreaker.opened) {
            return res.status(503).json({ error: "AI service is currently busy. Please try again in a few moments." });
        }
        res.status(500).json({ error: "Analysis failed. Please check your image format or try again." });
    }
};

export const analyzeText = async (req, res) => {
    try {
        const { mealDescription } = req.body;
        if (!mealDescription || !mealDescription.trim()) {
            return res.status(400).json({ error: "Please enter a valid meal description." });
        }
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const diet = user.preference || "General";
        const allergies = user.allergies || "None";

        const prompt = `
            Act as a clinical nutritionist. Analyze this text meal description: "${mealDescription}".
            User Profile: Diet Focus: ${diet}, Allergies/Restrictions: ${allergies}.

            Return a valid JSON object matching exactly this schema:
            {
                "foodName": "Clean Title of the Meal",
                "isHealthy": true/false,
                "healthScore": number (1 to 100),
                "portionSize": "Estimated portion based on description",
                "reasoning": "Nutritional evaluation and allergen alerts if relevant",
                "dietAdvice": "Specific tip tailored to ${diet} target",
                "macros": { "calories": number, "carbs": number, "protein": number, "fats": number },
                "micros": { "fiber": number, "sugar": number, "sodium": number }
            }
            Output ONLY valid JSON.
        `;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const analysis = await aiBreaker.fire({ model, prompt });

        const newScan = new ScanHistory({
            userId: user._id,
            imageUrl: "",
            foodName: analysis.foodName || mealDescription,
            isHealthy: analysis.isHealthy !== undefined ? analysis.isHealthy : true,
            healthScore: analysis.healthScore || 85,
            portionSize: analysis.portionSize || "1 portion",
            reasoning: analysis.reasoning || "Meal logged via text prompt.",
            dietAdvice: analysis.dietAdvice || `Good fit for ${diet} diet goals.`,
            macros: analysis.macros || { calories: 300, carbs: 35, protein: 25, fats: 8 },
            micros: analysis.micros || { fiber: 4, sugar: 3, sodium: 250 }
        });

        await newScan.save();
        res.json({ message: "Success", data: newScan });

    } catch (error) {
        logger.error({ err: error }, "AI Text Analysis Error");
        res.status(500).json({ error: "Text meal analysis failed. Please try again." });
    }
};