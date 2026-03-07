# Welness-Wizard
🥗 AI MacroVision: Personalized Nutrition & Health Guard
AI MacroVision is a high-performance MERN stack application that acts as a real-time nutritional auditor. It bridges the gap between generic calorie counting and personalized health by using Gemini 1.5 Flash to analyze food labels against a user's unique medical and dietary profile.

✨ Key Features
📸 Snap & Analyze: Upload a photo of any nutrition label or ingredient list for instant OCR and analysis.

⚖️ Contextual Health Logic: Moving beyond "good" or "bad"—the AI judges food based on your goals (e.g., flagging high sodium for hypertension or low protein for muscle gain).

🎯 Live Macro Budgeting: Dynamic dashboard that updates your remaining Carbs, Protein, and Fats the moment you scan an item.

🚫 Hidden Ingredient Detector: Automatically flags ultra-processed additives, hidden sugars, and allergens.

📊 Historical Trends: MongoDB-backed history to track your dietary improvements over time.

🛠️ Tech Stack & Architecture
The MERN + AI Blueprint
Frontend: React.js + Tailwind CSS (Mobile-responsive UI).

Backend: Node.js + Express.js (RESTful API Architecture).

Database: MongoDB Atlas (NoSQL Document Storage for flexible user profiles).

Intelligence: Gemini 1.5 Flash (Multimodal Vision-to-Text reasoning).

Media: Cloudinary (Image hosting & transformation).

📂 Project Structure
Plaintext
ai-macro-vision/
├── 📁 client/                # React Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/    # Reusable UI (Camera, Charts)
│   │   ├── 📁 context/       # Auth & Macro State Management
│   │   └── 📁 hooks/         # Custom API hooks
├── 📁 server/                # Node.js Backend
│   ├── 📁 controllers/       # AI Logic & DB Operations
│   ├── 📁 models/            # MongoDB Schemas (User, Scans)
│   ├── 📁 routes/            # Express API Endpoints
│   └── server.js             # Server Entry Point
└── 📄 .env.example           # Template for API Keys
⚙️ Setup & Installation
Clone & Install

Bash
git clone https://github.com/narasimha-prabhu/ai-macro-vision.git
npm run install-all # Custom script to install client & server deps
Environment Configuration
Create a .env file in the /server directory:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_ai_key
CLOUDINARY_CLOUD_NAME=your_name
Launch

Bash
npm run dev # Starts both concurrently
🧪 How the AI Logic Works
When an image is uploaded, the backend constructs a Contextual System Prompt:

"User Profile: Keto Diet, 50g Carb Limit. Scanned Item: Granola Bar. Logic: Extract Carbs, check for hidden Maltodextrin, and calculate % of 50g limit used."

👨‍💻 About the Developer
Narasimha Prabhu
B.Tech Computer Science & Engineering | Model Engineering College
