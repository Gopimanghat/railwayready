import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🚂 RailwayReady</h1>
        <p style={styles.subtitle}>AI Powered Current Affairs Quiz</p>
        <p style={styles.description}>
          Daily 25 questions from today's news — 
          National, Sports, International, Economy & Science
        </p>
        <button
          style={styles.startButton}
          onClick={() => navigate('/quiz')}
        >
          Start Today's Quiz →
        </button>
        <button
          style={styles.analysisButton}
          onClick={() => navigate('/analysis')}
        >
          View My Analysis 📊
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Arial, sans-serif'
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '50px',
    textAlign: 'center',
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  title: {
    fontSize: '2.5rem',
    color: '#1a1a2e',
    marginBottom: '10px'
  },
  subtitle: {
    color: '#0f3460',
    fontSize: '1.1rem',
    marginBottom: '20px'
  },
  description: {
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '30px'
  },
  startButton: {
    background: 'linear-gradient(135deg, #0f3460, #533483)',
    color: 'white',
    border: 'none',
    padding: '15px 40px',
    borderRadius: '50px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    display: 'block',
    width: '100%',
    marginBottom: '15px'
  },
  analysisButton: {
    background: 'transparent',
    color: '#0f3460',
    border: '2px solid #0f3460',
    padding: '15px 40px',
    borderRadius: '50px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    display: 'block',
    width: '100%'
  }
};

export default Home;