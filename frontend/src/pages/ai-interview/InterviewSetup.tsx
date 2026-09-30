import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiArrowRight,
  FiBriefcase,
  FiCheck,
} from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';
import { startInterview } from '../../services/interviewService';

const InterviewSetup: React.FC = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [role, setRole] = useState('');
  const [type, setType] = useState('technical');
  const [starting, setStarting] = useState(false);

  const userName = auth?.user?.fullName || 'Developer';

  const start = async () => {
    if (!role.trim()) return;
    setStarting(true);
    const response = await startInterview({ role, type });
    setStarting(false);

    if (response?.interviewId) {
      navigate(`/ai-interview/${response.interviewId}`);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-3 sm:p-5">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-4xl bg-[#0E1016] border border-white/10 rounded-2xl sm:rounded-[24px] overflow-hidden grid lg:grid-cols-[40%_60%] shadow-[0_0_60px_rgba(255,255,255,.03)]"
      >
        {/* ── LEFT ── */}
        <div className="p-5 sm:p-7 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-start gap-4">
          <div>
            <div
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 cursor-pointer"
            >
              <FiArrowLeft size={12} />
              <span className="text-xs text-zinc-300">Back</span>
            </div>

            <h1 className="mt-4 text-xl sm:text-2xl font-bold text-white leading-snug">
              Welcome back,<br />
              {userName}
            </h1>

            <p className="mt-2 text-xs sm:text-sm leading-6 text-zinc-400">
              Practice realistic AI interviews, receive instant feedback,
              and improve before your next job interview.
            </p>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {[
              'Personalized AI Questions',
              'Role-Based Interview',
              'Detailed Performance Report',
              'Real Interview Experience',
            ].map((item) => (
              <motion.div
                key={item}
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3"
              >
                <div className="w-7 h-7 shrink-0 rounded-lg bg-white flex items-center justify-center">
                  <FiCheck className="text-black" size={13} />
                </div>
                <span className="text-xs sm:text-sm text-zinc-300">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="p-5 sm:p-7 flex flex-col">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-white">Start Interview</h2>
            <p className="mt-1 text-xs text-zinc-500">Configure your interview preferences.</p>
          </div>

          <div className="mt-5 flex-1 space-y-4 overflow-y-auto">
            {/* Role */}
            <div>
              <label className="text-xs font-medium text-zinc-400">Target Role</label>
              <div className="mt-1.5 relative">
                <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                <input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Backend Developer, Data Analyst..."
                  className="w-full h-11 rounded-xl bg-[#17181E] border border-white/10 pl-10 pr-4 text-sm text-white outline-none focus:border-white/30 transition"
                />
              </div>
            </div>

            {/* Interview Type */}
            <div>
              <label className="text-xs font-medium text-zinc-400">Interview Type</label>
              <div className="mt-1.5 flex rounded-xl bg-[#17181E] p-1 border border-white/10">
                {['technical', 'hr'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setType(item)}
                    className={`flex-1 h-9 rounded-lg text-xs sm:text-sm font-medium capitalize transition-all ${
                      type === item ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {item === 'hr' ? 'HR / Behavioral' : 'Technical'}
                  </button>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <div className="rounded-xl border border-white/10 bg-[#17181E] p-4">
              <h3 className="text-sm font-medium text-white">What to expect</h3>
              <p className="mt-1.5 text-xs text-zinc-500 leading-5">
                {type === 'technical'
                  ? '6 questions covering concepts, architecture, and coding. AI will evaluate your answers in real-time with detailed feedback.'
                  : '6 behavioral questions covering communication, teamwork, leadership, and problem solving. Perfect for HR round preparation.'}
              </p>
            </div>
          </div>

          {/* Start Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={!role.trim() || starting}
            onClick={start}
            className="mt-5 h-12 rounded-xl bg-white text-black text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40 transition"
          >
            {starting ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                Starting Interview...
              </>
            ) : (
              <>Start Interview <FiArrowRight size={15} /></>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default InterviewSetup;
