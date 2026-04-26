# 🥗 AI Macro Vision

**AI Macro Vision** is a full-stack MERN application that uses **Google Gemini 3.0** to provide instant nutritional analysis from food images. Designed for users on specific diets like **Keto**, it tracks daily macros and provides a visual dashboard of nutritional progress.

## 🚀 Features

* **AI Image Analysis**: Upload a photo of your meal and get instant estimates for Calories, Protein, Carbs, and Fats.
* **Dynamic Progress Tracking**: Real-time progress bars that change color based on daily goals (e.g., turning red if you exceed carb limits).
* **Keto-Focused Logic**: Specialized "Verdict" system that flags food items based on Keto compatibility.
* **Data Export**: Download a text-based nutrition report of your recent scans for offline tracking.
* **Persistent History**: All scans are securely stored in **MongoDB** for long-term progress monitoring.

## 🛠️ Tech Stack

* **Frontend**: React.js, Tailwind CSS, Axios, Axios-Retry.
* **Backend**: Node.js, Express.js.
* **Database**: MongoDB.
* **AI Engine**: Gemini 3.0 API.
* **Resiliency & SRE**: Opossum (Circuit Breakers), Pino (Structured Logging), Helmet (Security).

## 🛡️ Enterprise Stability & SRE Upgrades

Recently upgraded to handle production scaling safely:
* **Circuit Breakers**: `opossum` wrapped around the Gemini API to prevent app hangs on AI service degradation.
* **Exponential Backoff**: Configured `axios-retry` on the client to automatically retry failed requests smoothly.
* **Rate Limiting**: Applied global API rate limiting and strict constraints on costly AI analysis endpoints.
* **Database Indexes**: Implemented compound MongoDB indexing to handle thousands of deep dashboard history queries flawlessly.
* **Logging**: Integrated `Pino` JSON structured logging for detailed telemetry on deployments.

## 📋 Installation & Setup

### 1. Prerequisites

* Node.js (v18+)
* MongoDB Atlas Account
* Gemini API Key

### 2. Backend Setup

```bash
cd server
npm install

```

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
GEMINI_API_KEY=your_api_key
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

```

```bash
npm run dev

```

### 3. Frontend Setup

```bash
cd client
npm install
npm start

```

## 👤 Author

**Arjun S Pai** *Computer Science & Engineering Student* *Model Engineering College (MEC)*

---

### 🛡️ Future Scope

* Integration with wearable fitness trackers.
* Multi-language support for regional Indian cuisines.
* Recipe suggestions based on remaining daily macro budget.
