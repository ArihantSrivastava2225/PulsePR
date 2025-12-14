import { fetchTechNews } from '../services/news.service.js';
import { analyzePROpportunities } from '../services/ai.service.js';

export const getPROpportunities = async (req, res) => {
    try {
        // 1. Get real-time news
        const news = await fetchTechNews();

        // 2. Analyze with AI
        const analysis = await analyzePROpportunities(news);

        // 3. Return combined data
        res.json({
            success: true,
            data: {
                news: news.slice(0, 10), // Send back top 10 news items for display
                ...analysis // Spread summaryText and companies
            }
        });
    } catch (error) {
        console.error("Controller Error:", error);

        if (error.message === "RATE_LIMIT_EXCEEDED") {
            return res.status(429).json({
                success: false,
                message: "AI Service is currently busy (Rate Limit). Please try again in a minute.",
                error: "Rate Limit Exceeded"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to generate insights",
            error: error.message
        });
    }
};
