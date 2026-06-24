import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

/* eslint-disable */

const Analysis = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('https://railwayready.onrender.com/analysis');
      setStats(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analysis:', error);
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={styles.container}>
      <div style={styles.center}>
        <h2 style={{ color: 'white' }}>Loading Analysis...</h2>
      </div>
    </div>
  );

  if (!stats || stats.totalAnswered === 0) return (
    <div style={styles.container}>
      <div style={styles.center}>
        <h2 style={{ color: 'white' }}>No data yet!</h2>
        <p style={{ color: '#aaa' }}>Complete at least one quiz to see analysis</p>
        <button style={styles.primaryButton} onClick={() => navigate('/quiz')}>
          Start Quiz 🚀
        </button>
      </div>
    </div>
  );

  const pieData = [
    { name: 'Correct', value: stats.totalCorrect },
    { name: 'Wrong', value: stats.totalWrong }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate('/')}>
          ← Home
        </button>
        <h1 style={styles.title}>My Analysis 📊</h1>
      </div>

      {/* Summary Cards */}
      <div style={styles.cardRow}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.totalAnswered}</div>
          <div style={styles.statLabel}>Total Answered</div>
        </div>
        <div style={{ ...styles.statCard, background: '#1b5e20' }}>
          <div style={styles.statNumber}>{stats.totalCorrect}</div>
          <div style={styles.statLabel}>Correct ✅</div>
        </div>
        <div style={{ ...styles.statCard, background: '#b71c1c' }}>
          <div style={styles.statNumber}>{stats.totalWrong}</div>
          <div style={styles.statLabel}>Wrong ❌</div>
        </div>
        <div style={{ ...styles.statCard, background: '#0d47a1' }}>
          <div style={styles.statNumber}>{stats.accuracy}%</div>
          <div style={styles.statLabel}>Accuracy 🎯</div>
        </div>
      </div>

      {/* Pie Chart */}
      <div style={styles.chartCard}>
        <h2 style={styles.chartTitle}>Overall Performance</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={index === 0 ? '#4caf50' : '#f44336'}
                />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Topic wise Bar Chart */}
      <div style={styles.chartCard}>
        <h2 style={styles.chartTitle}>Topic Wise Performance</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={stats.topicData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis
              dataKey="topic"
              tick={{ fill: '#aaa', fontSize: 11 }}
            />
            <YAxis tick={{ fill: '#aaa' }} />
            <Tooltip
              contentStyle={{
                background: '#1a1a2e',
                border: 'none',
                color: 'white'
              }}
            />
            <Bar dataKey="correct" name="Correct" fill="#4caf50" radius={[5, 5, 0, 0]} />
            <Bar dataKey="wrong" name="Wrong" fill="#f44336" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Weak Topics */}
      {stats.weakTopics.length > 0 && (
        <div style={styles.chartCard}>
          <h2 style={{ ...styles.chartTitle, color: '#ff9800' }}>
            ⚠️ Weak Topics — Focus Here
          </h2>
          {stats.weakTopics.map((topic, i) => (
            <div key={i} style={styles.weakTopic}>
              <span style={styles.weakTopicName}>{topic.topic}</span>
              <span style={styles.weakTopicScore}>
                {topic.correct}/{topic.total} correct
              </span>
            </div>
          ))}
        </div>
      )}

      <button
        style={{ ...styles.primaryButton, maxWidth: '700px', margin: '0 auto 30px', display: 'block' }}
        onClick={() => navigate('/quiz')}
      >
        Take Today's Quiz 🚀
      </button>
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
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
    gap: '15px'
  },
  header: {
    maxWidth: '700px',
    margin: '0 auto 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  backButton: {
    background: 'transparent',
    color: 'white',
    border: '1px solid white',
    padding: '8px 16px',
    borderRadius: '50px',
    cursor: 'pointer'
  },
  title: {
    color: 'white',
    fontSize: '1.5rem',
    margin: 0
  },
  cardRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
    maxWidth: '700px',
    margin: '0 auto 20px'
  },
  statCard: {
    background: '#0d3b1e',
    borderRadius: '15px',
    padding: '20px',
    textAlign: 'center'
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: 'white'
  },
  statLabel: {
    color: '#aaa',
    fontSize: '0.85rem',
    marginTop: '5px'
  },
  chartCard: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '20px',
    padding: '25px',
    maxWidth: '700px',
    margin: '0 auto 20px'
  },
  chartTitle: {
    color: 'white',
    marginBottom: '20px',
    fontSize: '1.1rem'
  },
  weakTopic: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 15px',
    background: 'rgba(255,152,0,0.1)',
    borderRadius: '10px',
    marginBottom: '10px',
    borderLeft: '3px solid #ff9800'
  },
  weakTopicName: { color: 'white' },
  weakTopicScore: { color: '#ff9800' },
  primaryButton: {
    background: 'linear-gradient(135deg, #0f3460, #533483)',
    color: 'white',
    border: 'none',
    padding: '15px 30px',
    borderRadius: '50px',
    fontSize: '1rem',
    cursor: 'pointer',
    width: '100%'
  }
};

export default Analysis;