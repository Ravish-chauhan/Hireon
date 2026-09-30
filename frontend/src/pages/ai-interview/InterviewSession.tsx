import React, { useEffect, useState, useRef, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowRight, FiClock, FiMessageSquare,
  FiMic, FiMicOff, FiCamera, FiCameraOff, FiCode,
} from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import Timer from '../../components/ai-interview/Timer';
import CodeEditorPanel from '../../components/ai-interview/CodeEditorPanel';
import { getInterview, submitAnswer } from '../../services/interviewService';
import { AuthContext } from '../../context/AuthContext';

// Type declarations for Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface QuestionData {
  question: string;
  difficulty: string;
  timer: number;
}

interface InterviewData {
  interviewId: string;
  currentQuestion: number;
  totalQuestions: number;
  question: QuestionData;
}

const InterviewSession: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [interviewData, setInterviewData] = useState<InterviewData | null>(null);

  // Fetch interview on mount
  useEffect(() => {
    const fetchInterview = async () => {
      if (!id) return;
      const response = await getInterview(id);
      const data = response?.interview;

      if (!data) {
        navigate('/ai-interview');
        return;
      }

      if (data.status === 'completed') {
        navigate(`/ai-interview/${id}/report`, { replace: true });
        return;
      }

      setInterviewData({
        interviewId: data._id,
        currentQuestion: data.currentQuestion,
        totalQuestions: data.questions.length,
        question: data.questions[data.currentQuestion],
      });
      setLoading(false);
    };
    fetchInterview();
  }, [id, navigate]);

  if (loading || !interviewData) {
    return (
      <div className="min-h-screen bg-[#07000F] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  return <InterviewUI interviewData={interviewData} user={auth?.user} />;
};


// ══════════════════════════════════════════════════════
// Interview UI (inner component)
// ══════════════════════════════════════════════════════

interface InterviewUIProps {
  interviewData: InterviewData;
  user: any;
}

const InterviewUI: React.FC<InterviewUIProps> = ({ interviewData: initialData, user }) => {
  const navigate = useNavigate();

  // State
  const [question, setQuestion] = useState<QuestionData>(initialData.question);
  const [currentIndex, setCurrentIndex] = useState(initialData.currentQuestion || 0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(initialData.question.timer || 60);
  const [timerActive, setTimerActive] = useState(true);

  // UI toggles
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);

  // Speech
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [subtitle, setSubtitle] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voiceGender, setVoiceGender] = useState('female');
  const [introSpoken, setIntroSpoken] = useState(false);

  // Refs
  const aiVideoRef = useRef<HTMLVideoElement>(null);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const micOnRef = useRef(micOn);

  // Keep micOnRef in sync
  useEffect(() => { micOnRef.current = micOn; }, [micOn]);

  const videoSource = voiceGender === 'male'
    ? '/ai-interview/male-ai.mp4'
    : '/ai-interview/female-ai.mp4';

  const userName = user?.fullName || 'there';
  const userInitial = userName.charAt(0).toUpperCase();
  const progress = ((currentIndex + 1) / initialData.totalQuestions) * 100;
  const micVisualOn = micOn && !isAIPlaying;

  // ── Load voices ──
  useEffect(() => {
    const load = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;
      const female = voices.find((v) => /zira|samantha|female/i.test(v.name));
      const male = voices.find((v) => /david|mark|male/i.test(v.name));
      if (female) { setSelectedVoice(female); setVoiceGender('female'); }
      else if (male) { setSelectedVoice(male); setVoiceGender('male'); }
      else { setSelectedVoice(voices[0]); setVoiceGender('female'); }
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
  }, []);

  // ── Speech recognition ──
  useEffect(() => {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.lang = 'en-US';
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = (e: any) => {
      const t = e.results[e.results.length - 1][0].transcript;
      setAnswer((prev) => prev + ' ' + t);
    };
    recognitionRef.current = rec;
  }, []);

  const startMic = () => { try { recognitionRef.current?.start(); } catch {} };
  const stopMic = () => { recognitionRef.current?.stop(); };

  const toggleMic = () => {
    if (micOn) { stopMic(); } else { startMic(); }
    setMicOn(!micOn);
  };

  // ── Camera ──
  const toggleCamera = async () => {
    if (cameraOn) {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setCameraOn(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        setCameraOn(true);
        setTimeout(() => {
          if (userVideoRef.current) userVideoRef.current.srcObject = stream;
        }, 100);
      } catch { setCameraOn(false); }
    }
  };

  // ── Speak ──
  const speakText = useCallback((text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice || !text?.trim()) { resolve(); return; }
      window.speechSynthesis.cancel();
      setTimeout(() => {
        const utter = new SpeechSynthesisUtterance(
          text.replace(/,/g, ', ... ').replace(/\./g, '. ... ')
        );
        utter.voice = selectedVoice;
        utter.rate = 0.92;
        utter.pitch = 1.05;
        utter.volume = 1;
        utter.onstart = () => {
          setIsAIPlaying(true);
          stopMic();
          aiVideoRef.current?.play();
        };
        utter.onend = () => {
          aiVideoRef.current?.pause();
          if (aiVideoRef.current) aiVideoRef.current.currentTime = 0;
          setIsAIPlaying(false);
          if (micOnRef.current) startMic();
          setTimeout(() => { setSubtitle(''); resolve(); }, 300);
        };
        setSubtitle(text);
        window.speechSynthesis.speak(utter);
      }, 150);
    });
  }, [selectedVoice]);

  // ── Welcome + First Question ──
  useEffect(() => {
    if (!selectedVoice || introSpoken) return;
    const runIntro = async () => {
      setIntroSpoken(true);
      await new Promise((r) => setTimeout(r, 1200));
      await speakText(`Welcome ${userName.split(' ')[0]}! Let's begin your interview.`);
      await new Promise((r) => setTimeout(r, 900));
      await speakText(initialData.question.question);
    };
    runIntro();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVoice]);

  // ── Speak question on change ──
  useEffect(() => {
    if (!introSpoken || !selectedVoice) return;
    const speak = async () => {
      await new Promise((r) => setTimeout(r, 900));
      await speakText(question.question);
    };
    speak();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question]);

  // ── Timer reset ──
  useEffect(() => {
    setTimeLeft(question.timer || 60);
    setTimerActive(true);
  }, [question]);

  // ── Timer countdown ──
  useEffect(() => {
    if (timeLeft <= 0 || !timerActive) return;
    const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, timerActive]);

  // ── Auto-submit at 0 ──
  useEffect(() => {
    if (timeLeft !== 0) return;
    const autoSubmit = async () => {
      await speakText('Time is up. Submitting your answer now.');
      const finalAnswer = answer.trim() || 'No answer provided. Time over.';
      setSubmitting(true);
      const res = await submitAnswer({ interviewId: initialData.interviewId, answer: finalAnswer });
      if (!res) { setSubmitting(false); return; }
      if (res.completed) {
        setFeedback(res.feedback);
        await new Promise((r) => setTimeout(r, 700));
        await speakText(res.feedback?.feedback || 'Great job! Your interview is complete.');
        setSubmitting(false);
        navigate(`/ai-interview/${initialData.interviewId}/report`);
        return;
      }
      setFeedback(res.feedback);
      await new Promise((r) => setTimeout(r, 700));
      await speakText(res.feedback?.feedback || 'Let\'s move to the next question.');
      setSubmitting(false);
      setQuestion(res.question);
      setCurrentIndex(res.currentQuestion);
      setAnswer('');
      setFeedback(null);
    };
    autoSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  // ── Submit ──
  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setTimerActive(false);
    setSubmitting(true);
    const res = await submitAnswer({ interviewId: initialData.interviewId, answer });
    if (!res) { setSubmitting(false); return; }
    if (res.completed) {
      setFeedback(res.feedback);
      await new Promise((r) => setTimeout(r, 700));
      await speakText(res.feedback?.feedback || 'Great job! Your interview is complete.');
      setSubmitting(false);
      navigate(`/ai-interview/${initialData.interviewId}/report`);
      return;
    }
    setFeedback(res.feedback);
    await new Promise((r) => setTimeout(r, 700));
    await speakText(res.feedback?.feedback || 'Let\'s move to the next question.');
    setSubmitting(false);
    setQuestion(res.question);
    setCurrentIndex(res.currentQuestion);
    setAnswer('');
    setFeedback(null);
  };

  // ── Code editor → append ──
  const handleCodeSubmit = (code: string) => {
    setAnswer((prev) => {
      const separator = prev.trim() ? '\n\n--- Code ---\n' : '--- Code ---\n';
      return prev + separator + code;
    });
    setCodeOpen(false);
  };

  // ── Cleanup ──
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis.cancel();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-3 sm:p-5">
      <CodeEditorPanel
        open={codeOpen}
        onClose={() => setCodeOpen(false)}
        onSubmitCode={handleCodeSubmit}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-5xl bg-[#0E1016] border border-white/10 rounded-2xl sm:rounded-[24px] overflow-hidden shadow-[0_0_60px_rgba(255,255,255,.03)] grid lg:grid-cols-[36%_64%]"
      >
        {/* ── LEFT: AI Video + User Camera + Controls ── */}
        <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-white/[0.08] p-4 sm:p-5 gap-3">
          {/* AI Video */}
          <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
            <video
              ref={aiVideoRef}
              src={videoSource}
              muted
              playsInline
              preload="auto"
              loop
              className="w-full h-full object-cover"
            />
            {isAIPlaying && (
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
                <div className="flex gap-0.5 items-end h-3">
                  {[1,2,3].map(i => (
                    <motion.div
                      key={i}
                      className="w-0.5 bg-white rounded-full"
                      animate={{ height: ['4px','12px','4px'] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-white/80">AI Speaking</span>
              </div>
            )}
          </div>

          {/* Subtitle */}
          <div className="min-h-[52px] flex items-center">
            <AnimatePresence>
              {subtitle && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="w-full rounded-xl bg-white/5 border border-white/[0.08] px-3 py-2"
                >
                  <p className="text-xs text-white/65 leading-relaxed text-center">{subtitle}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Camera */}
          <div className="relative rounded-xl overflow-hidden bg-[#17181E] border border-white/[0.08] aspect-video flex items-center justify-center">
            {cameraOn ? (
              <>
                <video
                  ref={userVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5">
                  <span className="text-[10px] text-white/70">You</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{userInitial}</span>
                </div>
                <span className="text-xs text-white/35">{userName.split(' ')[0]}</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-1.5 pt-1">
            <div className="flex items-center justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
                onClick={toggleMic}
                title={micOn ? 'Mute mic' : 'Unmute mic'}
                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                  micVisualOn ? 'bg-white/10 border-white/15 text-white' : 'bg-red-500/20 border-red-500/30 text-red-400'
                }`}
              >
                {micVisualOn ? <FiMic size={15} /> : <FiMicOff size={15} />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
                onClick={toggleCamera}
                title={cameraOn ? 'Turn off camera' : 'Turn on camera'}
                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                  cameraOn ? 'bg-white/10 border-white/15 text-white' : 'bg-white/5 border-white/10 text-white/45 hover:text-white/70'
                }`}
              >
                {cameraOn ? <FiCamera size={15} /> : <FiCameraOff size={15} />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
                onClick={() => setCodeOpen(true)}
                title="Open code editor"
                className="w-10 h-10 rounded-xl flex items-center justify-center border bg-white/5 border-white/10 text-white/45 hover:text-white/70 hover:border-white/20 transition-all"
              >
                <FiCode size={15} />
              </motion.button>
            </div>

            <div className="min-h-[14px] flex items-center justify-center">
              {micOn && isAIPlaying && (
                <span className="text-[10px] text-red-400/80">Mic paused — AI is speaking</span>
              )}
            </div>

            <span className="text-[10px] text-white/35 text-center">
              Coding question? Use <FiCode size={9} className="inline -mt-0.5" /> to write &amp; add code
            </span>
          </div>
        </div>

        {/* ── RIGHT: Question + Answer ── */}
        <div className="flex flex-col p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-white">AI Interview</h2>
              <div className="flex items-center gap-2 text-zinc-500 text-xs mt-0.5">
                <FiClock size={11} />
                <span>{question?.difficulty}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5 min-w-[110px]">
              <Timer timeLeft={timeLeft} totalTime={question?.timer || 60} />
            </div>
          </div>

          {/* Question */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={question?.question}
            className="relative overflow-hidden rounded-xl bg-[#17181E] border border-white/[0.08] p-4 sm:p-5 mb-4"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none" />
            <div className="relative flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center shrink-0">
                <FiMessageSquare size={14} />
              </div>
              <p className="text-xs text-zinc-500">Question {currentIndex + 1}</p>
            </div>
            <p className="relative text-white text-sm sm:text-base leading-7">{question.question}</p>
          </motion.div>

          {/* Progress */}
          <div className="mb-3">
            <div className="flex justify-between text-[10px] text-white/35 mb-1">
              <span>Progress</span>
              <span>{currentIndex + 1}/{initialData.totalQuestions}</span>
            </div>
            <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Answer */}
          <div className="flex-1 flex flex-col min-h-0">
            <label className="text-xs font-medium text-zinc-400 mb-1.5">Your Answer</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => { if (e.ctrlKey && e.key === 'Enter') handleSubmit(); }}
              rows={5}
              placeholder="Write your answer here… or speak if mic is on"
              className="flex-1 w-full rounded-xl bg-[#17181E] border border-white/[0.08] p-4 text-sm text-white outline-none resize-none focus:border-white/25 transition placeholder-white/20"
            />
          </div>

          {/* Feedback */}
          <div className="mt-3 min-h-[0px]">
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 max-h-40 overflow-y-auto"
                >
                  <p className="text-xs uppercase tracking-widest text-green-400 mb-2">AI Feedback</p>
                  <p className="text-sm text-zinc-300 leading-6">{feedback.feedback}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.08]">
            <span className="text-xs text-zinc-600 hidden sm:block">
              Press{' '}
              <kbd className="mx-1 rounded bg-white/10 px-1.5 py-0.5 text-white text-[10px]">Ctrl+Enter</kbd>
              to submit
            </span>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={submitting || !answer.trim()}
              onClick={handleSubmit}
              className="ml-auto h-10 min-w-[150px] justify-center px-5 rounded-xl bg-white text-black text-sm font-semibold flex items-center gap-2 disabled:opacity-40 transition"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-black border-t-transparent animate-spin" />
                  Submitting…
                </>
              ) : (
                <>Submit Answer <FiArrowRight size={15} /></>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InterviewSession;
