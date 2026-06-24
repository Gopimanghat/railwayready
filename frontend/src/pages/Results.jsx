import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { score, total, answers } = location.state || { score: 0, total: 0, answers: [] };

  const percentage = Math.round((score / total) * 100);

  const getGrade = () => {
    if (percentage >= 80) return { grade: 'Excellent! 🏆', color: '#4caf50' };
    if (percentage >= 60) return { grade: 'Good Job! 👍', color: '#2196f3' };
    if (percentage >= 40) return { grade: 'Keep Trying! 💪', color: '#ff9800' };
    return { grade: 'Need More Practice 📚', color: '#f44336' };
  };

  const { grade, color } = getGrade();

  const wrongAnswers = answers.filter(a => !a.isCorrect);
  const rightAnswers = answers.filter(a => a.isCorrect);

  // Topic wise score
  const topicScores = {};
  answers.forEach(a => {
    if (!topicScores[a.topic]) {
      topicScores[a.topic] = { correct: 0, total: 0 };
    }
    topicScores[a.topic].total += 1;
    if (a.isCorrect) topicScores[a.topic].correct += 1;
  });

  return (
    <div style={styles.container}>
      {/* Score Card */}
      <div style={styles.scoreCard}>
        <h1 style={styles.title}>Quiz Complete! 🎉</h1>
        <div style={{ ...styles.scoreBig, color }}>
          {score}/{total}
        </div>
        <div style={styles.percentage}>{percentage}%</div>
        <div style={{ ...styles.grade, color }}>{grade}</div>

        {/* Topic breakdown */}
        <div style={styles.topicSection}>
          <h3 style={styles.sectionTitle}>Topic Wise Score</h3>
          {Object.entries(topicScores).map(([topic, data]) => (
            <div key={topic} style={styles.topicRow}>
              <span style={styles.topicName}>{topic}</span>
              <div style={styles.topicBar}>
                <div style={{
                  ...styles.topicFill,
                  width: `${(data.correct / data.total) * 100}%`,
                  background: data.correct / data.total >= 0.6 ? '#4caf50' : '#f44336'
                }} />
              </div>
              <span style={styles.topicScore}>
                {data.correct}/{data.total}
              </span>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div style={styles.buttons}>
          <button
            style={styles.primaryButton}
            onClick={() => navigate('/quiz')}
          >
            Retake Quiz 🔄
          </button>
          <button
            style={styles.secondaryButton}
            onClick={() => navigate('/analysis')}
          >
            View Analysis 📊
          </button>
          <button
            style={styles.homeButton}
            onClick={() => navigate('/')}
          >
            Home 🏠
          </button>
        </div>
      </div>

      {/* Wrong Answers Review */}
      {wrongAnswers.length > 0 && (
        <div style={styles.reviewSection}>
          <h2 style={styles.reviewTitle}>❌ Wrong Answers — Review These</h2>
          {wrongAnswers.map((a, i) => (
            <div key={i} style={styles.reviewCard}>
              <p style={styles.reviewQuestion}>{i + 1}. {a.question}</p>
              <p style={styles.wrongAnswer}>Your answer: {a.selected || 'Not answered'}</p>
              <p style={styles.correctAnswer}>Correct answer: {a.correct}</p>
              <p style={styles.reviewExplanation}>💡 {a.explanation}</p>
              <span style={styles.topicBadge}>{a.topic}</span>
            </div>
          ))}
        </div>
      )}

      {/* Right Answers Review */}
      {rightAnswers.length > 0 && (
        <div style={styles.reviewSection}>
          <h2 style={{ ...styles.reviewTitle, color: '#4caf50' }}>
            ✅ Correct Answers — Well Done!
          </h2>
          {rightAnswers.map((a, i) => (
            <div key={i} style={{ ...styles.reviewCard, borderLeft: '4px solid #4caf50' }}>
              <p style={styles.reviewQuestion}>{i + 1}. {a.question}</p>
              <p style={styles.correctAnswer}>Correct: {a.correct}</p>
              <p style={styles.reviewExplanation}>💡 {a.explanation}</p>
              <span style={styles.topicBadge}>{a.topic}</span>
            </div>
          ))}
        </div>
      )}
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
  scoreCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '700px',
    margin: '0 auto 30px',
    textAlign: 'center'
  },
  title: {
    fontSize: '1.8rem',
    color: '#1a1a2e',
    marginBottom: '20px'
  },
  scoreBig: {
    fontSize: '4rem',
    fontWeight: 'bold',
    lineHeight: '1'
  },
  percentage: {
    fontSize: '1.5rem',
    color: '#666',
    margin: '10px 0'
  },
  grade: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    marginBottom: '30px'
  },
  topicSection: {
    textAlign: 'left',
    marginBottom: '30px'
  },
  sectionTitle: {
    color: '#1a1a2e',
    marginBottom: '15px'
  },
  topicRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px'
  },
  topicName: {
    width: '120px',
    fontSize: '0.85rem',
    color: '#333'
  },
  topicBar: {
    flex: 1,
    height: '10px',
    background: '#eee',
    borderRadius: '10px',
    overflow: 'hidden'
  },
  topicFill: {
    height: '100%',
    borderRadius: '10px',
    transition: 'width 0.5s ease'
  },
  topicScore: {
    width: '40px',
    fontSize: '0.85rem',
    color: '#333',
    textAlign: 'right'
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #0f3460, #533483)',
    color: 'white',
    border: 'none',
    padding: '15px',
    borderRadius: '50px',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  secondaryButton: {
    background: 'transparent',
    color: '#0f3460',
    border: '2px solid #0f3460',
    padding: '15px',
    borderRadius: '50px',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  homeButton: {
    background: 'transparent',
    color: '#999',
    border: '2px solid #ddd',
    padding: '15px',
    borderRadius: '50px',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  reviewSection: {
    maxWidth: '700px',
    margin: '0 auto 30px'
  },
  reviewTitle: {
    color: '#f44336',
    marginBottom: '15px',
    fontSize: '1.3rem'
  },
  reviewCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '15px',
    borderLeft: '4px solid #f44336'
  },
  reviewQuestion: {
    color: '#1a1a2e',
    fontWeight: 'bold',
    marginBottom: '10px',
    lineHeight: '1.5'
  },
  wrongAnswer: {
    color: '#f44336',
    marginBottom: '5px'
  },
  correctAnswer: {
    color: '#4caf50',
    marginBottom: '8px'
  },
  reviewExplanation: {
    color: '#666',
    fontSize: '0.9rem',
    lineHeight: '1.5',
    marginBottom: '10px'
  },
  topicBadge: {
    background: '#0f3460',
    color: 'white',
    padding: '3px 12px',
    borderRadius: '50px',
    fontSize: '0.75rem'
  }
};

export default Results;