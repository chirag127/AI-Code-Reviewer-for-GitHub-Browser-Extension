/**
 * AI Code Reviewer for GitHub - Backend Server
 *
 * This Express.js server handles:
 * 1. Receiving code diff data from the extension
 * 2. Processing the diff with Gemini AI
 * 3. Returning review suggestions
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const reviewRoutes = require("./routes/review");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/review", reviewRoutes);

// Test Gemini API endpoint
app.get("/test-gemini", async (req, res) => {
    try {
        const { GoogleGenerativeAI } = require("@google/generative-ai");
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey || apiKey === "your_gemini_api_key_here") {
            return res.status(500).json({
                status: "error",
                message:
                    "Gemini API key is not set. Please update your .env file.",
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash-latest",
        });

        const result = await model.generateContent(
            "Say hello and confirm you are working correctly."
        );
        const response = result.response;
        const text = response.text();

        res.status(200).json({
            status: "ok",
            message: "Gemini API is working correctly",
            response: text,
        });
    } catch (error) {
        console.error("Gemini API test error:", error);
        res.status(500).json({
            status: "error",
            message: `Gemini API test failed: ${error.message}`,
        });
    }
});

// Health check endpoint
app.get("/health", async (req, res) => {
    try {
        // Check if Gemini API key is set
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey === "your_gemini_api_key_here") {
            return res.status(500).json({
                status: "error",
                message:
                    "Gemini API key is not set. Please update your .env file.",
            });
        }

        // Return success
        res.status(200).json({
            status: "ok",
            message:
                "Server is running and API key is set. Note: This does not verify if the API key is valid.",
        });
    } catch (error) {
        console.error("Health check error:", error);
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Server error:", err);
    res.status(500).json({
        error: "Server error",
        message: err.message,
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`AI Code Reviewer backend running on port ${PORT}`);
});
