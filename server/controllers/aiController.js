import { GoogleGenerativeAI } from "@google/generative-ai";
import User from "../models/User.js";
import ScanHistory from "../models/ScanHistory.js";

// Initialize with the correct Class name
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

        const result = await model.generateContent([
            prompt,
            { inlineData: { data: pureBase64, mimeType } }
        ]);

        const response = await result.response;
        const analysis = JSON.parse(response.text()); // SDK handles the JSON parsing safely

        // Save to MongoDB with the specific userId
        // Inside your analyzeFood controller
        const newScan = new ScanHistory({
            userId: user._id,
            imageUrl: req.body.imagePreviewUrl || "", // Pass the URL from the frontend
            foodName: analysis.foodName,
            // ... rest of the fields

            isHealthy: analysis.isHealthy,
            reasoning: analysis.reasoning,
            macros: analysis.macros
        });

        await newScan.save();

        res.json({ message: "Success", data: newScan });

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "Analysis failed. Check your API key and Image format." });
    }
};