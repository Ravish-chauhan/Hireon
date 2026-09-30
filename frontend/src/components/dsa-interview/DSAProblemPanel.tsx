import React from 'react';
import type { DSAProblem } from '../../types/dsaInterview';

interface DSAProblemPanelProps {
  problem: DSAProblem | null;
}

const DSAProblemPanel: React.FC<DSAProblemPanelProps> = ({ problem }) => {
  if (!problem) {
    return (
      <div style={{ padding: '1.5rem', color: 'rgba(255, 255, 255, 0.6)' }}>
        No problem details available.
      </div>
    );
  }

  const getDifficultyBadge = (difficulty: string) => {
    const diff = (difficulty || 'medium').toLowerCase();
    const config: Record<string, { bg: string; color: string; border: string }> = {
      easy: { bg: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', border: 'rgba(74, 222, 128, 0.35)' },
      medium: { bg: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', border: 'rgba(251, 191, 36, 0.35)' },
      hard: { bg: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: 'rgba(239, 68, 68, 0.35)' },
    };
    const c = config[diff] || config.medium;
    return (
      <span
        style={{
          padding: '0.2rem 0.6rem',
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: 600,
          background: c.bg,
          color: c.color,
          border: `1px solid ${c.border}`,
          textTransform: 'capitalize',
        }}
      >
        {diff}
      </span>
    );
  };

  return (
    <div
      style={{
        padding: '1.5rem',
        overflowY: 'auto',
        height: '100%',
        color: '#e2e8f0',
        fontSize: '0.92rem',
        lineHeight: 1.6,
      }}
    >
      {/* Title & Metadata */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0, color: '#fff' }}>
            {problem.title}
          </h2>
          {getDifficultyBadge(problem.difficulty)}
        </div>

        {/* Topics */}
        {problem.topics && problem.topics.length > 0 && (
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
            {problem.topics.map((topic, i) => (
              <span
                key={i}
                style={{
                  padding: '0.15rem 0.5rem',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)', marginBottom: '1.25rem' }} />

      {/* Description */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: '0.5rem' }}>
          Description
        </h4>
        <div style={{ whiteSpace: 'pre-wrap', color: '#cbd5e1', lineHeight: 1.65 }}>
          {problem.description}
        </div>
      </div>

      {/* Examples */}
      {problem.examples && problem.examples.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: '0.75rem' }}>
            Examples
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {problem.examples.map((ex, idx) => (
              <div
                key={idx}
                style={{
                  padding: '0.9rem',
                  borderRadius: '8px',
                  background: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: '0.85rem',
                  fontFamily: 'monospace',
                }}
              >
                <div style={{ marginBottom: '0.35rem' }}>
                  <strong style={{ color: '#94a3b8' }}>Input: </strong>
                  <span style={{ color: '#38bdf8' }}>{ex.input}</span>
                </div>
                <div style={{ marginBottom: ex.explanation ? '0.35rem' : 0 }}>
                  <strong style={{ color: '#94a3b8' }}>Output: </strong>
                  <span style={{ color: '#4ade80' }}>{ex.output}</span>
                </div>
                {ex.explanation && (
                  <div style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    <strong>Explanation: </strong> {ex.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Constraints */}
      {problem.constraints && problem.constraints.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: '0.5rem' }}>
            Constraints
          </h4>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#cbd5e1' }}>
            {problem.constraints.map((c, i) => (
              <li key={i} style={{ marginBottom: '0.3rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DSAProblemPanel;
