const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { fetchNews } = require('./services/rssService');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'RailwayReady Backend Running!' });
});

// Test news route
app.get('/fetch-news', async (req, res) => {
    const articles = await fetchNews();
    res.json({
        total: articles.length,
        articles
    });
});


const { generateDailyQuestions } = require('./services/groqService');

app.get('/generate-questions', async (req, res) => {
    const { fetchNews } = require('./services/rssService');

    console.log('Fetching news...');
    const articles = await fetchNews();

    console.log('Generating questions...');
    const questions = await generateDailyQuestions(articles);

    res.json({
        total: questions.length,
        questions
    });
});





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});