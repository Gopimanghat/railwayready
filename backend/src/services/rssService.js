const RSSParser = require('rss-parser');
const parser = new RSSParser();

const RSS_FEEDS = {
    NATIONAL: 'https://www.thehindu.com/news/national/feeder/default.rss',
    SPORTS: 'https://www.thehindu.com/sport/feeder/default.rss',
    INTERNATIONAL: 'https://www.thehindu.com/news/international/feeder/default.rss',
    ECONOMY: 'https://www.thehindu.com/business/Economy/feeder/default.rss',
    SCIENCE: 'https://www.thehindu.com/sci-tech/feeder/default.rss',
    PIB: 'https://www.pib.gov.in/ViewRss.aspx?reg=1&lang=1',
};

const fetchNews = async () => {
    try {
        const allArticles = [];

        for (const [topic, url] of Object.entries(RSS_FEEDS)) {
            try {
                console.log(`Fetching ${topic}...`);
                const feed = await parser.parseURL(url);

                const articles = feed.items.slice(0, 5).map(item => ({
                    title: item.title || '',
                    summary: item.contentSnippet
                        || item.content
                        || item.summary
                        || item.title
                        || '',
                    topic: topic,
                    link: item.link || '',
                    date: item.pubDate || new Date().toISOString()
                }));

                allArticles.push(...articles);
                console.log(`✅ ${topic}: ${articles.length} articles`);

            } catch (feedError) {
                console.log(`❌ Failed ${topic}: ${feedError.message}`);
                // Continue to next feed even if one fails
            }
        }

        console.log(`Total articles fetched: ${allArticles.length}`);
        return allArticles;

    } catch (error) {
        console.error('RSS fetch error:', error.message);
        return [];
    }
};

module.exports = { fetchNews };