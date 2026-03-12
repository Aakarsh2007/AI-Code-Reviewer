const crypto = require('crypto');
const aiService = require("../services/ai.service");
const Review = require("../models/review.model");
const redisClient = require("../config/redis"); 

module.exports.getReview = async (req, res) => {
    try {
        const { code, language = 'javascript' } = req.body;

        if (!code) {
            return res.status(400).send("Code is required");
        }

        const codeHash = crypto.createHash('sha256').update(code).digest('hex');
        const cacheKey = `code_review:${language}:${codeHash}`;

        const cachedResponse = await redisClient.get(cacheKey);
        
        if (cachedResponse) {
            console.log("⚡ Serving review from Redis Cache!");
            return res.status(200).json(JSON.parse(cachedResponse));
        }

        console.log(`🧠 Cache miss. Sending ${language} code to Groq AI...`);

        const aiResponse = await aiService.generateCodeReview(code, language);

        const savedReview = new Review({
            language: language,
            originalCode: code,
            aiResponse: aiResponse
        });
        await savedReview.save();
        console.log("✅ Review saved to MongoDB!");

        await redisClient.setEx(cacheKey, 86400, JSON.stringify(aiResponse));
        console.log("⚡ Review cached in Redis!");

        res.status(200).json(aiResponse);
        
    } catch (error) {
        console.error("Error in ai.controller:", error.message);
        res.status(500).send("An error occurred while communicating with the AI service or database.");
    }
};

module.exports.getHistory = async (req, res) => {
    try {
        const history = await Review.find().sort({ createdAt: -1 });
        res.status(200).json(history);
    } catch (error) {
        console.error("Error fetching history:", error.message);
        res.status(500).send("An error occurred while fetching review history.");
    }
};

module.exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedReview = await Review.findByIdAndDelete(id);
        
        if (!deletedReview) {
            return res.status(404).json({ error: "Review not found" });
        }
        
        console.log(`🗑️ Deleted review: ${id}`);
        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error("Error deleting review:", error.message);
        res.status(500).send("An error occurred while deleting the review.");
    }
};