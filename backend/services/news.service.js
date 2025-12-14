import Parser from 'rss-parser';

const parser = new Parser();

export const fetchTechNews = async () => {
    try {
        // Fetch from TechCrunch and The Verge
        const feeds = await Promise.all([
            parser.parseURL('https://techcrunch.com/feed/'),
            parser.parseURL('https://www.theverge.com/rss/index.xml')
        ]);

        const newsItems = feeds.flatMap(feed => feed.items).map(item => ({
            title: item.title,
            source: item.link?.includes('techcrunch') ? 'TechCrunch' : 'The Verge',
            link: item.link,
            pubDate: item.pubDate,
            snippet: item.contentSnippet || item.content,
        }));

        // Sort by date descending and take top 20
        return newsItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate)).slice(0, 20);
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
};

export const fetchSocialStats = async () => {
    // Mocking social stats as real APIs require complex auth/payment
    // In a real app, this would call Twitter/LinkedIn APIs
    return {
        mentions: Math.floor(Math.random() * 500) + 100,
        sentiment: Math.floor(Math.random() * 30) + 70, // 70-100% positive
        reach: (Math.floor(Math.random() * 1000) + 500) + 'K',
        trending: ['AI', 'Tech', 'Innovation', 'Startup'][Math.floor(Math.random() * 4)]
    };
};
