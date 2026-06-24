const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// Test connection
const testConnection = async () => {
    const { data, error } = await supabase
        .from('questions')
        .select('count');

    if (error) {
        console.error('❌ Supabase connection error:', error.message);
    } else {
        console.log('✅ Supabase connected successfully');
    }
};

testConnection();

module.exports = supabase;