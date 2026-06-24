const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { fetchNews } = require('./services/rssService');
const { generateDailyQuestions } = require('./services/groqService');
const { saveQuestions, getTodayQuestions } = require('./services/questionService');

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'RailwayReady Backend Running!' });
});

// Fetch news test
app.get('/fetch-news', async (req, res) => {
    const articles = await fetchNews();
    res.json({ total: articles.length, articles });
});

// Generate questions test
app.get('/generate-questions', async (req, res) => {
    const articles = await fetchNews();
    const questions = await generateDailyQuestions(articles);
    res.json({ total: questions.length, questions });
});

// Daily questions — main route
app.get('/daily-questions', async (req, res) => {
    let questions = await getTodayQuestions();

    if (questions.length > 0) {
        console.log('Returning existing questions from DB');
        return res.json({ total: questions.length, questions });
    }

    console.log('Generating new questions...');
    const articles = await fetchNews();
    const generated = await generateDailyQuestions(articles);
    questions = await saveQuestions(generated);

    res.json({ total: questions.length, questions });
});

// Save user answers
app.post('/save-answers', async (req, res) => {
    const supabase = require('./config/db');
    const { answers } = req.body;

    try {
        const { data, error } = await supabase
            .from('user_answers')
            .insert(answers);

        if (error) throw error;
        res.json({ success: true });
    } catch (error) {
        console.error('Save answers error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Analysis route
app.get('/analysis', async (req, res) => {
    const supabase = require('./config/db');

    try {
        const { data: answers, error } = await supabase
            .from('user_answers')
            .select('*, questions(topic)');

        if (error) throw error;

        if (!answers || answers.length === 0) {
            return res.json({
                totalAnswered: 0,
                totalCorrect: 0,
                totalWrong: 0,
                accuracy: 0,
                topicData: [],
                weakTopics: []
            });
        }

        const totalAnswered = answers.length;
        const totalCorrect = answers.filter(a => a.is_correct).length;
        const totalWrong = totalAnswered - totalCorrect;
        const accuracy = Math.round((totalCorrect / totalAnswered) * 100);

        // Topic wise breakdown
        const topicMap = {};
        answers.forEach(a => {
            const topic = a.questions?.topic || 'UNKNOWN';
            if (!topicMap[topic]) topicMap[topic] = { correct: 0, wrong: 0, total: 0 };
            topicMap[topic].total += 1;
            if (a.is_correct) topicMap[topic].correct += 1;
            else topicMap[topic].wrong += 1;
        });

        const topicData = Object.entries(topicMap).map(([topic, data]) => ({
            topic,
            correct: data.correct,
            wrong: data.wrong,
            total: data.total
        }));

        const weakTopics = topicData.filter(t => t.correct / t.total < 0.5);

        res.json({
            totalAnswered,
            totalCorrect,
            totalWrong,
            accuracy,
            topicData,
            weakTopics
        });

    } catch (error) {
        console.error('Analysis error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});