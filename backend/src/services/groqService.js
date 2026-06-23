const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const generateMCQ = async (article) => {
    try {
        const prompt = `
You are a Railway and SSC exam expert question setter.

Based on this news article, generate 1 MCQ question.

Article Title: ${article.title}
Article Summary: ${article.summary}
Topic: ${article.topic}

Rules:
- Question must be exam relevant
- Must have exactly 4 options (A, B, C, D)
- Only one correct answer
- Question should test factual knowledge
- Keep it concise and clear

Respond ONLY in this exact JSON format, nothing else:
{
  "question": "question text here",
  "options": {
    "A": "option 1",
    "B": "option 2", 
    "C": "option 3",
    "D": "option 4"
  },
  "correct": "A",
  "explanation": "brief explanation why this is correct",
  "topic": "${article.topic}",
  "source": "${article.title}"
}`;

        const response = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
            max_tokens: 500
        });

        const text = response.choices[0].message.content.trim();

        // Clean response and parse JSON
        const cleaned = text.replace(/```json|```/g, '').trim();
        const mcq = JSON.parse(cleaned);
        return mcq;

    } catch (error) {
        console.error('Groq MCQ error:', error.message);
        return null;
    }
};

const generateDailyQuestions = async (articles) => {
    console.log('Generating MCQ questions from articles...');
    const questions = [];

    for (const article of articles) {
        if (questions.length >= 30) break; // Max 30 questions daily

        const mcq = await generateMCQ(article);
        if (mcq) {
            questions.push(mcq);
            console.log(`✅ Question ${questions.length} generated`);
        }

        // Small delay to avoid rate limit
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`Total questions generated: ${questions.length}`);
    return questions;
};

module.exports = { generateDailyQuestions };