import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startDSAInterview } from '../../services/dsaInterviewService';
import type { DSADifficulty } from '../../types/dsaInterview';

// ===================================
// DSA Interview Setup Page
// ===================================
// Placeholder page for starting a DSA interview.
// Will be enhanced with a full UI in later phases.

const DSAInterviewSetup: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [difficulty, setDifficulty] = useState<DSADifficulty | ''>('');
  const [language, setLanguage] = useState('javascript');

  const handleStart = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await startDSAInterview({
        difficulty: difficulty || undefined,
        programmingLanguage: language,
      });

      if (result?.success && result.interviewId) {
        navigate(`/dsa-interview/${result.interviewId}`);
      } else {
        setError('Failed to start DSA interview. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0A2647 0%, #144272 50%, #205295 100%)',
      padding: '2rem',
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '3rem',
        maxWidth: '520px',
        width: '100%',
        color: '#fff',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #FF9D42, #FFD700)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            🧠 DSA Interview
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.95rem' }}>
            Practice data structures & algorithms with an AI interviewer
          </p>
        </div>

        {/* Difficulty Selection */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.85rem',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '0.5rem',
            fontWeight: 500,
          }}>
            Difficulty (optional)
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as DSADifficulty | '')}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
              fontSize: '0.95rem',
              outline: 'none',
            }}
          >
            <option value="">Random</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Language Selection */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.85rem',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '0.5rem',
            fontWeight: 500,
          }}>
            Programming Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
              fontSize: '0.95rem',
              outline: 'none',
            }}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
          }}>
            {error}
          </div>
        )}

        {/* Start Button */}
        <button
          onClick={handleStart}
          disabled={loading}
          style={{
            width: '100%',
            padding: '1rem',
            borderRadius: '14px',
            border: 'none',
            background: loading
              ? 'rgba(255, 157, 66, 0.4)'
              : 'linear-gradient(135deg, #FF9D42, #FF6B00)',
            color: '#fff',
            fontSize: '1.05rem',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Starting Interview...' : 'Start DSA Interview'}
        </button>

        <p style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          fontSize: '0.8rem',
          color: 'rgba(255, 255, 255, 0.4)',
        }}>
          You'll be presented with a DSA problem and guided through solving it step-by-step.
        </p>
      </div>
    </div>
  );
};

export default DSAInterviewSetup;
