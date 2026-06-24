import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Quiz = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState([]);

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get('http://localhost:5000/daily-questions');
setQuestions(res.data.questions.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // Timer
  useEffect(() => {
    if (loading || showAnswer) return;
    if (timer === 0) {
      handleNext(null);
      return;
    }
    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
 }, [timer, loading, showAnswer]);

  const handleSelect = (option) => {
    if (showAnswer) return;
    setSelected(option);
    setShowAnswer(true);

    const isCorrect = option === questions[current].correct_answer;
    if (isCorrect) setScore(prev => prev + 1);

    setAnswers(prev => [...prev, {
      question: questions[current].question,
      selected: option,
      correct: questions[current].correct_answer,
      isCorrect,
      explanation: questions[current].explanation,
      topic: questions[current].topic
    }]);
  };

  const handleNext = async (option) => {
    if (!showAnswer && option === null) {
      // Time up - no answer
      setAnswers(prev => [...prev, {
        question: questions[current].question,
        selected: null,
        correct: questions[current].correct_answer,
        isCorrect: false,
        explanation: questions[current].explanation,
        topic: questions[current].topic
      }]);
    }

if (current + 1 >= questions.length) {
      try {
        await axios.post('http://localhost:5000/save-answers', {
          answers: answers.map(a => ({
            question_id: null,
            selected_answer: a.selected,
            is_correct: a.isCorrect
          }))
        });
      } catch (err) {
        console.error('Save error:', err);
      }
      navigate('/results', { state: { score, total: questions.length, answers } });
      return;
    }

    setCurrent(prev => prev + 1);
    setSelected(null);
    setShowAnswer(false);
    setTimer(30);
  };

  if (loading) return (
    <div style={styles.container}>
      <div style={styles.loadingBox}>
        <h2 style={{color:'white'}}>Loading today's questions...</h2>
        <p style={{color:'#aaa'}}>Fetching from AI</p>
      </div>
    </div>
  );

  if (questions.length === 0) return (
    <div style={styles.container}>
      <h2 style={{color:'white'}}>No questions found. Try again!</h2>
    </div>
  );

  const question = questions[current];
  const options = ['A', 'B', 'C', 'D'];
  const optionKeys = {
    A: question.option_a,
    B: question.option_b,
    C: question.option_c,
    D: question.option_d
  };

  const getOptionStyle = (option) => {
    if (!showAnswer) return styles.option;
    if (option === question.correct_answer) return {...styles.option, ...styles.correct};
    if (option === selected && option !== question.correct_answer) return {...styles.option, ...styles.wrong};
    return {...styles.option, ...styles.dimmed};
  };

  const timerColor = timer > 20 ? '#00ff88' : timer > 10 ? '#ffaa00' : '#ff4444';

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.progress}>
          Question {current + 1}/{questions.length}
        </span>
        <span style={{...styles.timer, color: timerColor}}>
          ⏱ {timer}s
        </span>
        <span style={styles.scoreText}>
          Score: {score}
        </span>
      </div>

      {/* Progress bar */}
      <div style={styles.progressBar}>
        <div style={{
          ...styles.progressFill,
          width: `${((current + 1) / questions.length) * 100}%`
        }} />
      </div>

      <div style={styles.card}>
        {/* Topic badge */}
        <span style={styles.badge}>{question.topic}</span>

        <h2 style={styles.question}>{question.question}</h2>

        <div style={styles.options}>
          {options.map(option => (
            <button
              key={option}
              style={getOptionStyle(option)}
              onClick={() => handleSelect(option)}
            >
              <span style={styles.optionLetter}>{option}</span>
              {optionKeys[option]}
            </button>
          ))}
        </div>

        {showAnswer && (
          <div style={styles.explanation}>
            <p style={styles.explanationText}>
              💡 {question.explanation}
            </p>
            <p style={styles.source}>📰 {question.source}</p>
            <button style={styles.nextButton} onClick={() => handleNext(selected)}>
              {current + 1 >= questions.length ? 'See Results →' : 'Next Question →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  loadingBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '700px',
    margin: '0 auto 15px',
    color: 'white'
  },
  progress: { fontSize: '1rem', color: '#aaa' },
  timer: { fontSize: '1.3rem', fontWeight: 'bold' },
  scoreText: { fontSize: '1rem', color: '#00ff88' },
  progressBar: {
    maxWidth: '700px',
    margin: '0 auto 20px',
    height: '6px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '10px'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #00ff88, #0f3460)',
    borderRadius: '10px',
    transition: 'width 0.3s ease'
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '30px',
    maxWidth: '700px',
    margin: '0 auto'
  },
  badge: {
    background: '#0f3460',
    color: 'white',
    padding: '5px 15px',
    borderRadius: '50px',
    fontSize: '0.8rem',
    marginBottom: '15px',
    display: 'inline-block'
  },
  question: {
    fontSize: '1.2rem',
    color: '#1a1a2e',
    lineHeight: '1.6',
    marginBottom: '25px',
    marginTop: '15px'
  },
  options: { display: 'flex', flexDirection: 'column', gap: '12px' },
  option: {
    padding: '15px 20px',
    borderRadius: '12px',
    border: '2px solid #e0e0e0',
    background: 'white',
    cursor: 'pointer',
    fontSize: '1rem',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    transition: 'all 0.2s'
  },
  correct: {
    background: '#e8f5e9',
    border: '2px solid #4caf50',
    color: '#2e7d32'
  },
  wrong: {
    background: '#ffebee',
    border: '2px solid #f44336',
    color: '#c62828'
  },
  dimmed: { opacity: 0.5 },
  optionLetter: {
    fontWeight: 'bold',
    color: '#0f3460',
    minWidth: '25px'
  },
  explanation: {
    marginTop: '20px',
    padding: '20px',
    background: '#f0f4ff',
    borderRadius: '12px',
    borderLeft: '4px solid #0f3460'
  },
  explanationText: {
    color: '#333',
    lineHeight: '1.6',
    marginBottom: '8px'
  },
  source: { color: '#666', fontSize: '0.85rem', marginBottom: '15px' },
  nextButton: {
    background: 'linear-gradient(135deg, #0f3460, #533483)',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '50px',
    fontSize: '1rem',
    cursor: 'pointer',
    width: '100%'
  }
};

export default Quiz;