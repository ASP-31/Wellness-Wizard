import { GoogleGenerativeAI } from "@google/generative-ai";
import User from "../models/User.js";
import ScanHistory from "../models/ScanHistory.js";
import CircuitBreaker from "opossum";
import logger from "../utils/logger.js";

// Initialize with the correct Class name
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Create the isolated function for the circuit breaker
const callGeminiApi = async ({ model, prompt, pureBase64, mimeType }) => {
    const result = await model.generateContent([
        prompt,
        { inlineData: { data: pureBase64, mimeType } }
    ]);
    const response = await result.response;
    return JSON.parse(response.text()); // SDK handles the JSON parsing safely
};

const breakerOptions = {
    timeout: 15000, 
    errorThresholdPercentage: 50, 
    resetTimeout: 30000
};
const aiBreaker = new CircuitBreaker(callGeminiApi, breakerOptions);

aiBreaker.on('open', () => logger.warn("AI Circuit Breaker opened"));
aiBreaker.on('halfOpen', () => logger.info("AI Circuit Breaker half-open"));
aiBreaker.on('close', () => logger.info("AI Circuit Breaker closed"));

export const analyzeImage = async (req, res) => {
    try {
        // Use req.user.id from your 'protect' middleware instead of passing it in body
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

        // Sync with the fields Arjun just added in the ProfileForm
        const diet = user.preference || "General";
        const allergies = user.allergies || "None";

        const prompt = `
            Act as a clinical nutritionist. Analyze this food image.
            User Profile: Diet: ${diet}, Allergies: ${allergies}.

            Return a valid JSON object:
            {
                "foodName": "string",
                "isHealthy": boolean,
                "reasoning": "string (include allergy warnings if found)",
                "macros": { "calories": number, "carbs": number, "protein": number, "fats": number }
            }
            Output only the JSON. No markdown.
        `;

        // Using the stable Gemini 1.5 Flash model
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" } // CamelCase for SDK
        });

        // Use circuit breaker
        const analysis = await aiBreaker.fire({ model, prompt, pureBase64, mimeType });

        // Save to MongoDB with the specific userId
        const newScan = new ScanHistory({
            userId: user._id,
            imageUrl: req.body.imagePreviewUrl || "", // Pass the URL from the frontend
            foodName: analysis.foodName,
            isHealthy: analysis.isHealthy,
            reasoning: analysis.reasoning,
            macros: analysis.macros
        });

        await newScan.save();

        res.json({ message: "Success", data: newScan });

    } catch (error) {
        logger.error({ err: error }, "AI Analysis Error");
        if (aiBreaker.opened) {
            return res.status(503).json({ error: "AI service is currently overwhelmed. Please try again later." });
        }
        res.status(500).json({ error: "Analysis failed. Check your API key and Image format." });
    }
};