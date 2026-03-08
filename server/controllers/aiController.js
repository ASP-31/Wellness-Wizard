const { GoogleGenAI } = require("@google/genai"); // Modern unified SDK
const User = require("../models/User");
const ScanHistory = require("../models/ScanHistory");

// Initialize Gemini with the stable v1 endpoint
const client = new GoogleGenAI({ 
    apiKey: process.env.GEMINI_API_KEY,
    apiVersion: 'v1' 
});

exports.analyzeFood = async (req, res) => {
    try {
        const { userId, imageBase64 } = req.body;

        // 1. Validate User and context
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // 2. Clean Base64: Remove data:image/xxx;base64 prefix
        const pureBase64 = imageBase64.includes(",")
            ? imageBase64.split(",")[1]
            : imageBase64;

        // 3. Prepare personalized nutritionist prompt
        const diet = user.preferences?.dietType || "General";
        const allergies = (user.preferences?.allergies || []).join(", ") || "None";

        const prompt = `
            You are a clinical nutritionist. Analyze this food image for a user with these constraints:
            - Diet: ${diet}
            - Allergies: ${allergies}

            Return a JSON object with:
            {
                "foodName": "string",
                "isHealthy": boolean,
                "reasoning": "string",
                "macros": { "calories": number, "carbs": number, "protein": number, "fats": number }
            }
            Do not include any markdown formatting like \`\`\`json.
        `;

        // 4. Call Gemini 2.0/3.0 Flash
        const response = await client.models.generateContent({
            model: "gemini-2.5-flash", // Stable production identifier
            contents: [
                { text: prompt },
                { inlineData: { data: pureBase64, mimeType: "image/jpeg" } },
            ],
            config: { 
                response_mime_type: "application/json" // New snake_case requirement
            }
        });

        // 5. Clean and Parse the response
        let text = response.text;
        
        // Remove markdown backticks if the AI added them despite the prompt
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
            text = text.substring(firstBrace, lastBrace + 1);
        }

        const analysis = JSON.parse(text);

        // 6. Defensive Number Parsing (extracts numbers from "500 Kcal" or "20g")
        const extractNum = (val) => {
            if (!val) return 0;
            const matches = String(val).match(/(\d+(\.\d+)?)/);
            return matches ? parseFloat(matches[0]) : 0;
        };

        // Dig for nested nutrition keys the AI might invent
        const rawNutr = analysis.nutrition_per_100g || analysis.macros || {};

        // 7. Save the Scan to MongoDB
        const newScan = new ScanHistory({
            userId: user._id,
            foodName: analysis.food_item || analysis.foodName || "Unknown Food",
            isHealthy: analysis.isHealthy || (analysis.overall_recommendation === "Recommended"),
            reasoning: analysis.recommendation_reason || analysis.reasoning || "Analysis complete.",
            macros: {
                calories: extractNum(rawNutr.calories),
                carbs: extractNum(rawNutr.carbohydrates || rawNutr.carbs),
                protein: extractNum(rawNutr.protein),
                fats: extractNum(rawNutr.total_fats || rawNutr.fats)
            }
        });

        await newScan.save();

        // 8. Send the successful result back to the client
        res.json({
            message: "Success",
            data: newScan
        });

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "Server Error during AI analysis" });
    }
};