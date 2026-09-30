import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getDSAInterview, sendDSAMessage } from '../../services/dsaInterviewService';
import DSACodeEditor from '../../components/dsa-interview/DSACodeEditor';
import DSAProblemPanel from '../../components/dsa-interview/DSAProblemPanel';
import type {
  DSAInterview,
  DSAMessage,
  DSAPhase,
} from '../../types/dsaInterview';

// ===================================
// DSA Interview Session Page
// ===================================

const DSAInterviewSession: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [interview, setInterview] = useState<DSAInterview | null>(null);
  const [messages, setMessages] = useState<DSAMessage[]>([]);
  const [currentPhase, setCurrentPhase] = useState<DSAPhase>('INTRODUCTION');
  const [lastAction, setLastAction] = useState<string>('');
  const [approachStatus, setApproachStatus] = useState<string>('');
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [codingTab, setCodingTab] = useState<'problem' | 'chat'>('problem');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load interview on mount
  useEffect(() => {
    const loadInterview = async () => {
      if (!id) return;

      const result = await getDSAInterview(id);
      if (result?.success) {
        setInterview(result.interview);
        setMessages(result.interview.conversationHistory || []);
        setCurrentPhase(result.interview.currentPhase);
        setLastAction(result.interview.lastAction || '');
        setApproachStatus(result.interview.approachStatus || '');
        setHintsUsed(result.interview.hintsUsed || 0);
      } else {
        setError('Failed to load interview');
      }
      setLoading(false);
    };

    loadInterview();
  }, [id]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, codingTab]);

  const handleSend = async () => {
    if (!input.trim() || !id || sending) return;

    const userMessage = input.trim();
    setInput('');
    setSending(true);

    // Optimistically add user message
    const optimisticMsg: DSAMessage = {
      role: 'candidate',
      content: userMessage,
      phase: currentPhase,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const result = await sendDSAMessage(id, { message: userMessage });

      if (result?.success) {
        setMessages(result.conversationHistory);
        setCurrentPhase(result.currentPhase);
        if (result.lastAction) setLastAction(result.lastAction);
        if (result.approachStatus) setApproachStatus(result.approachStatus);
        if (typeof result.hintsUsed === 'number') setHintsUsed(result.hintsUsed);
      } else {
        setError('Failed to send message');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Phase badge color
  const getPhaseColor = (phase: DSAPhase) => {
    const colors: Record<string, string> = {
      START: '#94a3b8',
      INTRODUCTION: '#60a5fa',
      PROBLEM_PRESENTATION: '#a78bfa',
      UNDERSTANDING: '#34d399',
      APPROACH_DISCUSSION: '#fbbf24',
      APPROACH_REVIEW: '#fb923c',
      CODING: '#38bdf8',
      TESTING: '#4ade80',
      DEBUGGING: '#ef4444',
      COMPLEXITY: '#c084fc',
      FINAL_EVALUATION: '#facc15',
      END: '#64748b',
    };
    return colors[phase] || '#9ca3af';
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0A2647',
        color: '#fff',
        fontSize: '1.2rem',
      }}>
        Loading interview...
      </div>
    );
  }

  if (error && !interview) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0A2647',
        color: '#fca5a5',
        fontSize: '1.2rem',
      }}>
        {error}
      </div>
    );
  }

  const isCompleted = interview?.status === 'completed' || currentPhase === 'END';

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #0A2647 0%, #0d1b2a 100%)',
      color: '#fff',
    }}>
      {/* Header */}
      <div style={{
        padding: '0.85rem 1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0.25)',
      }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>
            🧠 DSA Interview
            {interview?.problemId && typeof interview.problemId === 'object' && (
              <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontWeight: 400, marginLeft: '0.5rem' }}>
                — {interview.problemId.title}
              </span>
            )}
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {hintsUsed > 0 && (
            <div style={{
              padding: '0.25rem 0.65rem',
              borderRadius: '20px',
              fontSize: '0.72rem',
              fontWeight: 600,
              background: 'rgba(234, 179, 8, 0.15)',
              color: '#facc15',
              border: '1px solid rgba(234, 179, 8, 0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}>
              💡 Hints: {hintsUsed}
            </div>
          )}

          {approachStatus && (
            <div style={{
              padding: '0.25rem 0.65rem',
              borderRadius: '20px',
              fontSize: '0.72rem',
              fontWeight: 600,
              background: approachStatus === 'approved'
                ? 'rgba(74, 222, 128, 0.15)'
                : approachStatus === 'needs_revision'
                ? 'rgba(239, 68, 68, 0.15)'
                : 'rgba(251, 191, 36, 0.15)',
              color: approachStatus === 'approved'
                ? '#4ade80'
                : approachStatus === 'needs_revision'
                ? '#f87171'
                : '#fbbf24',
              border: `1px solid ${
                approachStatus === 'approved'
                  ? 'rgba(74, 222, 128, 0.35)'
                  : approachStatus === 'needs_revision'
                  ? 'rgba(239, 68, 68, 0.35)'
                  : 'rgba(251, 191, 36, 0.35)'
              }`,
            }}>
              Approach: {approachStatus.replace(/_/g, ' ')}
            </div>
          )}

          {lastAction && (
            <div style={{
              padding: '0.25rem 0.65rem',
              borderRadius: '20px',
              fontSize: '0.72rem',
              fontWeight: 600,
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#cbd5e1',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}>
              Action: {lastAction.replace(/_/g, ' ')}
            </div>
          )}

          <div style={{
            padding: '0.3rem 0.8rem',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 600,
            background: `${getPhaseColor(currentPhase)}20`,
            color: getPhaseColor(currentPhase),
            border: `1px solid ${getPhaseColor(currentPhase)}40`,
          }}>
            {currentPhase.replace(/_/g, ' ')}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {['CODING', 'TESTING', 'DEBUGGING'].includes(currentPhase) ? (
        /* ==================================================== */
        /* CODING PHASE WORKSPACE: Dual-Panel with Monaco Editor */
        /* ==================================================== */
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', height: 'calc(100vh - 60px)' }}>
          {/* Left Panel: Problem Statement or Interviewer Chat */}
          <div style={{
            width: '42%',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(10, 25, 47, 0.6)',
          }}>
            {/* Left Panel Tabs */}
            <div style={{
              display: 'flex',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(0, 0, 0, 0.3)',
            }}>
              <button
                onClick={() => setCodingTab('problem')}
                style={{
                  padding: '0.65rem 1.25rem',
                  border: 'none',
                  background: codingTab === 'problem' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  color: codingTab === 'problem' ? '#38bdf8' : '#94a3b8',
                  borderBottom: codingTab === 'problem' ? '2px solid #38bdf8' : '2px solid transparent',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                }}
              >
                📄 Problem Details
              </button>
              <button
                onClick={() => setCodingTab('chat')}
                style={{
                  padding: '0.65rem 1.25rem',
                  border: 'none',
                  background: codingTab === 'chat' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  color: codingTab === 'chat' ? '#38bdf8' : '#94a3b8',
                  borderBottom: codingTab === 'chat' ? '2px solid #38bdf8' : '2px solid transparent',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                }}
              >
                💬 Interviewer Chat
              </button>
            </div>

            {/* Left Panel Body */}
            {codingTab === 'problem' ? (
              <DSAProblemPanel problem={interview?.problemId || null} />
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        justifyContent: msg.role === 'candidate' ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <div style={{
                        maxWidth: '85%',
                        padding: '0.75rem 1rem',
                        borderRadius: msg.role === 'candidate' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                        background: msg.role === 'candidate'
                          ? 'linear-gradient(135deg, #FF9D42, #FF6B00)'
                          : 'rgba(255, 255, 255, 0.08)',
                        color: '#fff',
                        fontSize: '0.85rem',
                        lineHeight: 1.5,
                        whiteSpace: 'pre-wrap',
                      }}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat input inside coding mode */}
                <div style={{
                  padding: '0.75rem 1rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  background: 'rgba(0, 0, 0, 0.3)',
                }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask the interviewer a question..."
                      style={{
                        flex: 1,
                        padding: '0.6rem 0.85rem',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: '#fff',
                        fontSize: '0.85rem',
                        outline: 'none',
                      }}
                    />
                    <button
                      onClick={handleSend}
                      disabled={sending || !input.trim()}
                      style={{
                        padding: '0.6rem 1rem',
                        borderRadius: '10px',
                        border: 'none',
                        background: sending || !input.trim()
                          ? 'rgba(255, 157, 66, 0.3)'
                          : 'linear-gradient(135deg, #FF9D42, #FF6B00)',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        cursor: sending || !input.trim() ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {sending ? '...' : 'Send'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Monaco Code Editor */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            <DSACodeEditor
              interviewId={id!}
              problem={interview?.problemId || null}
              initialLanguage={interview?.programmingLanguage}
              initialCode={interview?.candidateCode}
              onCodeChange={(c) => setInterview((prev) => (prev ? { ...prev, candidateCode: c } : null))}
              onLanguageChange={(l) => setInterview((prev) => (prev ? { ...prev, programmingLanguage: l } : null))}
              onInterviewUpdate={(updated) => {
                if (updated.currentPhase) setCurrentPhase(updated.currentPhase);
                if (updated.conversationHistory) setMessages(updated.conversationHistory);
                if (updated.lastAction) setLastAction(updated.lastAction);
                if (updated.approachStatus) setApproachStatus(updated.approachStatus);
                if (updated.hintsUsed !== undefined) setHintsUsed(updated.hintsUsed);
                setInterview((prev) => (prev ? { ...prev, ...updated } : null));
              }}
            />
          </div>
        </div>
      ) : (
        /* ==================================================== */
        /* CONVERSATION VIEW: Pre-coding phases                 */
        /* ==================================================== */
        <>
          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'candidate' ? 'flex-end' : 'flex-start',
                }}
              >
                <div style={{
                  maxWidth: '75%',
                  padding: '0.9rem 1.2rem',
                  borderRadius: msg.role === 'candidate' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.role === 'candidate'
                    ? 'linear-gradient(135deg, #FF9D42, #FF6B00)'
                    : 'rgba(255, 255, 255, 0.08)',
                  color: '#fff',
                  fontSize: '0.92rem',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          {!isCompleted && (
            <div style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(0, 0, 0, 0.3)',
            }}>
              {error && (
                <div style={{
                  color: '#fca5a5',
                  fontSize: '0.8rem',
                  marginBottom: '0.5rem',
                }}>
                  {error}
                </div>
              )}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your response..."
                  rows={2}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    borderRadius: '14px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#fff',
                    fontSize: '0.92rem',
                    resize: 'none',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={sending || !input.trim()}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '14px',
                    border: 'none',
                    background: sending || !input.trim()
                      ? 'rgba(255, 157, 66, 0.3)'
                      : 'linear-gradient(135deg, #FF9D42, #FF6B00)',
                    color: '#fff',
                    fontWeight: 600,
                    cursor: sending || !input.trim() ? 'not-allowed' : 'pointer',
                    alignSelf: 'flex-end',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {sending ? '...' : 'Send'}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Completed banner */}
      {isCompleted && (
        <div style={{
          padding: '1.5rem',
          textAlign: 'center',
          background: 'rgba(74, 222, 128, 0.1)',
          borderTop: '1px solid rgba(74, 222, 128, 0.2)',
          color: '#4ade80',
          fontWeight: 600,
        }}>
          ✅ Interview completed
        </div>
      )}
    </div>
  );
};

export default DSAInterviewSession;

