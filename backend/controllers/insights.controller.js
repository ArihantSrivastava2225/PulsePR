import { fetchTechNews, fetchSocialStats } from '../services/news.service.js';

export const getInsights = async (req, res) => {
    try {
        const news = await fetchTechNews();
        const socialStats = await fetchSocialStats();

        // Calculate summary stats based on "real" data (mocked for now where APIs are missing)
        const summaryStats = [
            { label: "Total Mentions", value: socialStats.mentions, change: "+12%", trend: "up" },
            { label: "Positive Sentiment", value: `${socialStats.sentiment}%`, change: "+5%", trend: "up" },
            { label: "Media Reach", value: socialStats.reach, change: "-3%", trend: "down" },
            { label: "Trending Topics", value: "8", change: "0%", trend: "neutral" },
        ];

        // Generate a simple summary text based on the top news item
        const topNews = news[0];
        const summaryText = topNews
            ? `This week's highlights: ${topNews.source} reports "${topNews.title}". Sentiment is generally positive.`
            : "No significant news found this week.";

        res.status(200).json({
            success: true,
            data: {
                news,
                summaryStats,
                summaryText,
                socialStats
            }
        });
    } catch (error) {
        console.error("Error in getInsights:", error);
        res.status(500).json({ success: false, message: "Failed to fetch insights" });
    }
};
