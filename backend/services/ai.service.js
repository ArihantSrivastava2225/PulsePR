import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const analyzePROpportunities = async (newsItems) => {
    try {
        if (!newsItems || newsItems.length === 0) {
            return {
                summaryText: "No news items available to analyze.",
                companies: []
            };
        }

        // Prepare the prompt
        // Limit to top 8 items to avoid hitting token limits on free tier
        const newsContext = newsItems.slice(0, 8).map((item, index) =>
            `${index + 1}. Title: ${item.title}\n   Source: ${item.source}\n   Snippet: ${item.snippet}`
        ).join('\n\n');

        const prompt = `
        You are a PR expert finding business opportunities for "PulsePR", a PR agency.
        Analyze the following recent tech news headlines and snippets to identify companies that might need PR services.
        
        Look for:
        - Funding announcements (need to announce growth)
        - Crisis situations (need reputation management)
        - Product launches (need buzz)
        - Market expansion (need brand awareness)

        News Data:
        ${newsContext}

        Return a JSON object with this structure (no markdown formatting, just raw JSON):
        {
            "summaryText": "A 2-3 sentence high-level overview of the current tech PR landscape based on these stories.",
            "companies": [
                {
                    "name": "Company Name",
                    "trigger": "E.g., Raised Series B, Data Breach, New CEO",
                    "reason": "Why they need PR right now",
                    "suggestedPitch": "One sentence pitch idea for PulsePR to reach out with"
                }
            ]
        }
        
        Identify at least 3-5 good targets if possible.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean up markdown code blocks if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(text);

    } catch (error) {
        console.error("Error analyzing PR opportunities:", error);

        if (error.message.includes('429') || error.message.includes('Quota')) {
            throw new Error("RATE_LIMIT_EXCEEDED");
        }
        throw new Error("Failed to analyze PR opportunities");
    }
};
