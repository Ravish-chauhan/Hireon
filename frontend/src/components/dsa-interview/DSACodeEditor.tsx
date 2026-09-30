import React, { useState, useEffect, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import type {
  DSAProblem,
  DSALanguage,
  DSAExecutionNormalizedResult,
  DSATestResultItem,
} from '../../types/dsaInterview';
import {
  saveDSACode,
  executeDSACode,
  getDSAExecutionStatus,
} from '../../services/dsaInterviewService';

interface DSACodeEditorProps {
  interviewId: string;
  problem: DSAProblem | null;
  initialLanguage?: string;
  initialCode?: string;
  onCodeChange?: (code: string) => void;
  onLanguageChange?: (language: string) => void;
  onInterviewUpdate?: (interview: any) => void;
}

const SUPPORTED_LANGUAGES: { id: DSALanguage; label: string; monacoLang: string }[] = [
  { id: 'javascript', label: 'JavaScript', monacoLang: 'javascript' },
  { id: 'python', label: 'Python', monacoLang: 'python' },
  { id: 'java', label: 'Java', monacoLang: 'java' },
  { id: 'cpp', label: 'C++', monacoLang: 'cpp' },
];

export const getStarterCodeForLang = (lang: string, problem: DSAProblem | null): string => {
  if (problem?.starterCode && Array.isArray(problem.starterCode)) {
    const found = problem.starterCode.find(
      (s) => s.language?.toLowerCase() === lang?.toLowerCase()
    );
    if (found?.code) return found.code;
  }

  // Sensible default fallbacks if starter code is not defined for problem
  switch (lang?.toLowerCase()) {
    case 'python':
      return 'def solution():\n    # Your code here\n    pass\n';
    case 'java':
      return 'class Solution {\n    public void solve() {\n        // Your code here\n    }\n}\n';
    case 'cpp':
      return 'class Solution {\npublic:\n    void solve() {\n        // Your code here\n    }\n};\n';
    case 'javascript':
    default:
      return 'function solution() {\n  // Your code here\n}\n';
  }
};

const DSACodeEditor: React.FC<DSACodeEditorProps> = ({
  interviewId,
  problem,
  initialLanguage = 'javascript',
  initialCode = '',
  onCodeChange,
  onLanguageChange,
  onInterviewUpdate,
}) => {
  const normalizedInitialLang: DSALanguage = (
    SUPPORTED_LANGUAGES.some((l) => l.id === initialLanguage?.toLowerCase())
      ? initialLanguage.toLowerCase()
      : 'javascript'
  ) as DSALanguage;

  const [currentLanguage, setCurrentLanguage] = useState<DSALanguage>(normalizedInitialLang);
  const [code, setCode] = useState<string>(() => {
    if (initialCode && initialCode.trim()) {
      return initialCode;
    }
    return getStarterCodeForLang(normalizedInitialLang, problem);
  });

  // Drafts cache per language so switching doesn't destroy unsaved code
  const draftsRef = useRef<Record<string, string>>({
    [normalizedInitialLang]:
      initialCode && initialCode.trim()
        ? initialCode
        : getStarterCodeForLang(normalizedInitialLang, problem),
  });

  // Autosave status
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'unsaved'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Execution Event status
  const [executing, setExecuting] = useState<boolean>(false);
  const [executingMode, setExecutingMode] = useState<'run' | 'submit' | null>(null);
  const [executionBanner, setExecutionBanner] = useState<{
    type: 'run' | 'submit';
    message: string;
    timestamp: string;
  } | null>(null);

  // Execution Results Drawer
  const [executionResult, setExecutionResult] = useState<DSAExecutionNormalizedResult | null>(null);
  const [selectedTestIndex, setSelectedTestIndex] = useState<number>(0);
  const [isResultsOpen, setIsResultsOpen] = useState<boolean>(false);

  // Synchronize when problem finishes loading if code is still empty
  useEffect(() => {
    if (!code || !code.trim()) {
      const defaultCode = getStarterCodeForLang(currentLanguage, problem);
      setCode(defaultCode);
      draftsRef.current[currentLanguage] = defaultCode;
    }
  }, [problem]);

  // Debounced save
  const triggerDebouncedSave = useCallback(
    (newCode: string, lang: string) => {
      setSaveStatus('unsaved');

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(async () => {
        setSaveStatus('saving');
        try {
          const res = await saveDSACode(interviewId, {
            programmingLanguage: lang,
            candidateCode: newCode,
          });

          if (res?.success) {
            setSaveStatus('saved');
            const now = new Date();
            setLastSavedTime(
              now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            );
          } else {
            setSaveStatus('unsaved');
          }
        } catch (err) {
          console.error('Autosave error:', err);
          setSaveStatus('unsaved');
        }
      }, 800);
    },
    [interviewId]
  );

  const handleEditorChange = (value: string | undefined) => {
    const updatedCode = value || '';
    setCode(updatedCode);
    draftsRef.current[currentLanguage] = updatedCode;
    onCodeChange?.(updatedCode);
    triggerDebouncedSave(updatedCode, currentLanguage);
  };

  const handleLanguageSelect = (newLang: DSALanguage) => {
    if (newLang === currentLanguage) return;

    draftsRef.current[currentLanguage] = code;

    let newLangCode = draftsRef.current[newLang];
    if (!newLangCode || !newLangCode.trim()) {
      newLangCode = getStarterCodeForLang(newLang, problem);
      draftsRef.current[newLang] = newLangCode;
    }

    setCurrentLanguage(newLang);
    setCode(newLangCode);
    onLanguageChange?.(newLang);
    onCodeChange?.(newLangCode);

    triggerDebouncedSave(newLangCode, newLang);
  };

  const handleResetCode = () => {
    const starter = getStarterCodeForLang(currentLanguage, problem);
    const confirmed = window.confirm(
      `Reset code to the default starter template for ${currentLanguage.toUpperCase()}? Any unsaved edits in this language will be reverted.`
    );
    if (!confirmed) return;

    setCode(starter);
    draftsRef.current[currentLanguage] = starter;
    onCodeChange?.(starter);
    triggerDebouncedSave(starter, currentLanguage);
  };

  // Poll execution results from server
  const pollExecution = (execId: string, mode: 'run' | 'submit') => {
    let attempts = 0;
    const maxAttempts = 25; // 25 * 800ms = 20s max polling

    const interval = setInterval(async () => {
      attempts++;
      try {
        const execRes = await getDSAExecutionStatus(interviewId, execId);

        if (execRes?.success && execRes.result && execRes.status !== 'running' && execRes.status !== 'queued') {
          clearInterval(interval);
          setExecuting(false);
          setExecutingMode(null);
          setExecutionResult(execRes.result);
          setSelectedTestIndex(0);
          setIsResultsOpen(true);

          if (execRes.interview) {
            onInterviewUpdate?.(execRes.interview);
          }

          if (mode === 'submit') {
            const isPassed = execRes.result.status === 'passed';
            setExecutionBanner({
              type: 'submit',
              message: isPassed
                ? '🎉 All test cases passed! Proceeding to Complexity Discussion.'
                : `⚠️ Submission had failures (${execRes.result.testsPassed}/${execRes.result.testsTotal} passed). Let's debug with the interviewer.`,
              timestamp: new Date().toLocaleTimeString(),
            });
          } else {
            const isPassed = execRes.result.status === 'passed';
            setExecutionBanner({
              type: 'run',
              message: isPassed
                ? '✅ All visible test cases passed!'
                : `⚠️ Visible tests: ${execRes.result.testsPassed}/${execRes.result.testsTotal} passed.`,
              timestamp: new Date().toLocaleTimeString(),
            });
          }
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          setExecuting(false);
          setExecutingMode(null);
          setExecutionBanner({
            type: mode,
            message: '⏱ Execution request timed out. Please try running again.',
            timestamp: new Date().toLocaleTimeString(),
          });
        }
      } catch (err) {
        clearInterval(interval);
        setExecuting(false);
        setExecutingMode(null);
      }
    }, 800);
  };

  // Handle Run
  const handleRun = async () => {
    if (executing) return;
    setExecuting(true);
    setExecutingMode('run');
    setIsResultsOpen(false);

    try {
      const res = await executeDSACode(interviewId, {
        executionMode: 'run',
        programmingLanguage: currentLanguage,
        candidateCode: code,
      });

      if (res?.success && (res.executionId || res.executionRequest?.executionId)) {
        const execId = res.executionId || res.executionRequest?.executionId;
        setExecutionBanner({
          type: 'run',
          message: '⚡ Running visible test cases in secure sandbox...',
          timestamp: new Date().toLocaleTimeString(),
        });
        pollExecution(execId!, 'run');
      } else {
        setExecuting(false);
        setExecutingMode(null);
        setExecutionBanner({
          type: 'run',
          message: '❌ Failed to dispatch run request.',
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    } catch (err) {
      setExecuting(false);
      setExecutingMode(null);
      setExecutionBanner({
        type: 'run',
        message: '❌ Error requesting execution.',
        timestamp: new Date().toLocaleTimeString(),
      });
    }
  };

  // Handle Submit
  const handleSubmit = async () => {
    if (executing) return;
    setExecuting(true);
    setExecutingMode('submit');
    setIsResultsOpen(false);

    try {
      const res = await executeDSACode(interviewId, {
        executionMode: 'submit',
        programmingLanguage: currentLanguage,
        candidateCode: code,
      });

      if (res?.success && (res.executionId || res.executionRequest?.executionId)) {
        const execId = res.executionId || res.executionRequest?.executionId;
        setExecutionBanner({
          type: 'submit',
          message: '🚀 Evaluating complete test suite in secure sandbox...',
          timestamp: new Date().toLocaleTimeString(),
        });
        pollExecution(execId!, 'submit');
      } else {
        setExecuting(false);
        setExecutingMode(null);
        setExecutionBanner({
          type: 'submit',
          message: '❌ Failed to dispatch submit request.',
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    } catch (err) {
      setExecuting(false);
      setExecutingMode(null);
      setExecutionBanner({
        type: 'submit',
        message: '❌ Error submitting code.',
        timestamp: new Date().toLocaleTimeString(),
      });
    }
  };

  const currentMonacoLang =
    SUPPORTED_LANGUAGES.find((l) => l.id === currentLanguage)?.monacoLang || 'javascript';

  const selectedTest: DSATestResultItem | undefined =
    executionResult?.testResults?.[selectedTestIndex];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#1e1e1e',
        color: '#fff',
        borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Toolbar */}
      <div
        style={{
          padding: '0.65rem 1rem',
          background: 'rgba(15, 23, 42, 0.8)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        {/* Language Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label
            htmlFor="dsa-language-select"
            style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}
          >
            Language:
          </label>
          <select
            id="dsa-language-select"
            value={currentLanguage}
            onChange={(e) => handleLanguageSelect(e.target.value as DSALanguage)}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: '#0d1b2a',
              color: '#38bdf8',
              fontWeight: 600,
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.label}
              </option>
            ))}
          </select>

          {/* Reset Code Button */}
          <button
            onClick={handleResetCode}
            title="Reset code to starter template"
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#94a3b8',
              fontSize: '0.78rem',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            ↺ Reset
          </button>
        </div>

        {/* Autosave Status & Results Drawer Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {executionResult && (
            <button
              onClick={() => setIsResultsOpen((prev) => !prev)}
              style={{
                padding: '0.25rem 0.6rem',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: isResultsOpen ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                color: isResultsOpen ? '#38bdf8' : '#cbd5e1',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {isResultsOpen ? '▼ Hide Results' : '▲ Show Results'} (
              {executionResult.testsPassed}/{executionResult.testsTotal})
            </button>
          )}

          <div style={{ fontSize: '0.75rem' }}>
            {saveStatus === 'saving' && (
              <span style={{ color: '#fbbf24' }}>⟳ Saving...</span>
            )}
            {saveStatus === 'saved' && (
              <span style={{ color: '#4ade80' }}>
                ✓ Saved {lastSavedTime ? `at ${lastSavedTime}` : ''}
              </span>
            )}
            {saveStatus === 'unsaved' && (
              <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>● Unsaved</span>
            )}
          </div>
        </div>
      </div>

      {/* Execution Event Banner */}
      {executionBanner && (
        <div
          style={{
            padding: '0.65rem 1rem',
            background:
              executionBanner.type === 'submit'
                ? 'rgba(56, 189, 248, 0.15)'
                : 'rgba(74, 222, 128, 0.15)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            color: executionBanner.type === 'submit' ? '#38bdf8' : '#4ade80',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>{executionBanner.message}</span>
          <button
            onClick={() => setExecutionBanner(null)}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Monaco Editor Container */}
      <div style={{ flex: 1, minHeight: '250px', position: 'relative' }}>
        <Editor
          height="100%"
          language={currentMonacoLang}
          theme="vs-dark"
          value={code}
          onChange={handleEditorChange}
          options={{
            automaticLayout: true,
            fontSize: 14,
            lineNumbers: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            tabSize: currentLanguage === 'python' ? 4 : 2,
            fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
            bracketPairColorization: { enabled: true },
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </div>

      {/* Test Results Drawer (Appears when tests have run) */}
      {isResultsOpen && executionResult && (
        <div
          style={{
            maxHeight: '220px',
            background: '#0d1b2a',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header of Drawer */}
          <div
            style={{
              padding: '0.45rem 1rem',
              background: 'rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: executionResult.status === 'passed' ? '#4ade80' : '#f87171',
                }}
              >
                {executionResult.status === 'passed' ? '✓ Accepted' : `✗ ${executionResult.status.replace(/_/g, ' ')}`}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                {executionResult.testsPassed} / {executionResult.testsTotal} Passed (
                {executionResult.timeMs}ms)
              </span>
            </div>

            {/* Test Case Selector Tabs */}
            <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto' }}>
              {executionResult.testResults.map((tc, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedTestIndex(idx)}
                  style={{
                    padding: '0.2rem 0.55rem',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    border: 'none',
                    background:
                      selectedTestIndex === idx
                        ? tc.passed
                          ? 'rgba(74, 222, 128, 0.25)'
                          : 'rgba(239, 68, 68, 0.25)'
                        : 'rgba(255, 255, 255, 0.05)',
                    color: tc.passed ? '#4ade80' : '#f87171',
                    cursor: 'pointer',
                  }}
                >
                  Case {tc.testNumber} {tc.passed ? '✓' : '✗'}
                </button>
              ))}
            </div>
          </div>

          {/* Test Case Details Body */}
          <div style={{ padding: '0.75rem 1rem', overflowY: 'auto', flex: 1, fontSize: '0.8rem' }}>
            {executionResult.compileError && (
              <div style={{ color: '#f87171', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                <strong>Compilation Error:</strong>
                <pre style={{ margin: '0.25rem 0', background: 'rgba(0,0,0,0.4)', padding: '0.5rem', borderRadius: '4px' }}>
                  {executionResult.compileError}
                </pre>
              </div>
            )}

            {selectedTest && !executionResult.compileError && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontFamily: 'monospace' }}>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                    Input:
                  </div>
                  <div style={{ color: '#38bdf8', background: 'rgba(0,0,0,0.3)', padding: '0.35rem 0.5rem', borderRadius: '4px', marginTop: '0.2rem' }}>
                    {selectedTest.input}
                  </div>
                </div>

                <div>
                  <div style={{ color: '#94a3b8', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                    Expected:
                  </div>
                  <div style={{ color: '#4ade80', background: 'rgba(0,0,0,0.3)', padding: '0.35rem 0.5rem', borderRadius: '4px', marginTop: '0.2rem' }}>
                    {selectedTest.expectedOutput}
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                    Actual Output:
                  </div>
                  <div
                    style={{
                      color: selectedTest.passed ? '#4ade80' : '#f87171',
                      background: 'rgba(0,0,0,0.3)',
                      padding: '0.35rem 0.5rem',
                      borderRadius: '4px',
                      marginTop: '0.2rem',
                    }}
                  >
                    {selectedTest.actualOutput || (selectedTest.error ? `Error: ${selectedTest.error}` : 'None')}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Action Bar: Run & Submit */}
      <div
        style={{
          padding: '0.75rem 1.25rem',
          background: 'rgba(15, 23, 42, 0.95)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
          {executing ? (
            <span style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              ⟳ {executingMode === 'submit' ? 'Evaluating complete test suite...' : 'Running visible test cases in sandbox...'}
            </span>
          ) : (
            'Secure Isolated Sandbox: Runs via isolated execution engine with CPU, memory, and output limits.'
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {/* Run Button (Visible Tests) */}
          <button
            onClick={handleRun}
            disabled={executing || !code.trim()}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: executing ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: executing || !code.trim() ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.15s ease',
            }}
          >
            {executing && executingMode === 'run' ? '⏳ Running...' : '▶ Run'}
          </button>

          {/* Submit Button (Full Suite) */}
          <button
            onClick={handleSubmit}
            disabled={executing || !code.trim()}
            style={{
              padding: '0.55rem 1.4rem',
              borderRadius: '8px',
              border: 'none',
              background: executing || !code.trim()
                ? 'rgba(74, 222, 128, 0.3)'
                : 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: '#fff',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: executing || !code.trim() ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.15s ease',
              boxShadow: '0 2px 8px rgba(34, 197, 94, 0.25)',
            }}
          >
            {executing && executingMode === 'submit' ? '⏳ Submitting...' : '🚀 Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DSACodeEditor;
