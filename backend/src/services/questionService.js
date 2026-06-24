const supabase = require('../config/db');

const saveQuestions = async (questions) => {
    try {
        const formatted = questions.map(q => ({
            question: q.question,
            option_a: q.options.A,
            option_b: q.options.B,
            option_c: q.options.C,
            option_d: q.options.D,
            correct_answer: q.correct,
            explanation: q.explanation,
            topic: q.topic,
            source: q.source
        }));

        const { data, error } = await supabase
            .from('questions')
            .insert(formatted)
            .select();

        if (error) throw error;

        console.log(`✅ Saved ${data.length} questions to database`);
        return data;

    } catch (error) {
        console.error('Save error:', error.message);
        return [];
    }
};

const getTodayQuestions = async () => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const { data, error } = await supabase
            .from('questions')
            .select('*')
            .gte('created_at', `${today}T00:00:00`)
            .lte('created_at', `${today}T23:59:59`)
            .limit(30);

        if (error) throw error;
        return data;

    } catch (error) {
        console.error('Fetch error:', error.message);
        return [];
    }
};

module.exports = { saveQuestions, getTodayQuestions };