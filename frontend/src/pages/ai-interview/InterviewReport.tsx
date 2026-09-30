import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FiArrowLeft,
  FiAward,
  FiTarget,
  FiTrendingUp,
  FiPrinter,
  FiCheckCircle,
  FiAlertCircle,
  FiHelpCircle
} from 'react-icons/fi';
import { getInterview } from '../../services/interviewService';

interface Feedback {
  score?: number;
  correctness?: number;
  clarity?: number;
  relevance?: number;
  detail?: number;
  efficiency?: number;
  communication?: number;
  problemSolving?: number;
  creativity?: number;
  feedback?: string;
  improvements?: string[];
}

interface QuestionItem {
  question: string;
  userAnswer?: string;
  difficulty?: string;
  timer?: number;
  feedback?: Feedback;
}

interface InterviewReportData {
  _id: string;
  type: string;
  role: string;
  overallScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  questions: QuestionItem[];
  status: string;
  createdAt: string;
}

const InterviewReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<InterviewReportData | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!id) return;
      const response = await getInterview(id);
      const interview = response?.interview;

      if (!interview) {
        navigate('/ai-interview');
        return;
      }

      if (interview.status !== 'completed') {
        navigate(`/ai-interview/${id}`, { replace: true });
        return;
      }

      setReport(interview);
      setLoading(false);
    };

    fetchReport();
  }, [id, navigate]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07000F] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="min-h-screen bg-[#0B0D13] text-white py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto rounded-3xl bg-[#12151E] border border-white/10 overflow-hidden shadow-2xl"
      >
        {/* Header Bar */}
        <div className="border-b border-white/10 px-6 sm:px-8 py-6 flex flex-wrap items-center justify-between gap-4 bg-[#161A26]">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate('/ai-interview')}
              className="inline-flex items-center gap-2 text-xs text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-full transition w-fit"
            >
              <FiArrowLeft size={13} />
              <span>Back to Setup</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Interview Performance Report
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Role: <span className="text-white font-medium capitalize">{report.role}</span> &bull; Type:{' '}
              <span className="text-white font-medium uppercase">{report.type}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition"
            >
              <FiPrinter size={15} />
              <span>Print Report</span>
            </button>
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl">
              <FiAward className="text-emerald-400" size={18} />
              <span className="text-xs sm:text-sm font-medium text-emerald-400">Completed</span>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-8" ref={reportRef}>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-[#181C2A] border border-white/10 p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Overall Score</p>
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                  <FiTarget size={18} />
                </div>
              </div>
              <div className="mt-4">
                <h2 className="text-4xl font-extrabold text-white">
                  {report.overallScore}
                  <span className="text-lg text-zinc-500 font-normal">/100</span>
                </h2>
              </div>
            </div>

            <div className="rounded-2xl bg-[#181C2A] border border-white/10 p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Questions</p>
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                  <FiHelpCircle size={18} />
                </div>
              </div>
              <div className="mt-4">
                <h2 className="text-4xl font-extrabold text-white">
                  {report.questions?.length || 0}
                  <span className="text-lg text-zinc-500 font-normal"> Answered</span>
                </h2>
              </div>
            </div>

            <div className="rounded-2xl bg-[#181C2A] border border-white/10 p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">AI Evaluation</p>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <FiTrendingUp size={18} />
                </div>
              </div>
              <div className="mt-4">
                <h2 className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
                  <FiCheckCircle size={22} />
                  <span>Success</span>
                </h2>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="rounded-2xl bg-[#181C2A] border border-white/10 p-6 sm:p-7">
            <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Executive AI Summary
            </h3>
            <p className="mt-3.5 text-sm sm:text-base leading-7 text-zinc-300">
              {report.summary || 'No summary available.'}
            </p>
          </div>

          {/* Strengths and Weaknesses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="rounded-2xl bg-[#181C2A] border border-emerald-500/20 p-6 flex flex-col">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <FiTrendingUp size={16} />
                </div>
                <h3 className="text-base font-semibold text-white">Identified Strengths</h3>
              </div>
              <div className="space-y-3 flex-1">
                {report.strengths?.length > 0 ? (
                  report.strengths.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-3.5"
                    >
                      <span className="text-emerald-400 font-bold mt-0.5">&bull;</span>
                      <p className="text-sm text-zinc-300 leading-relaxed">{item}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500">No specific strengths documented.</p>
                )}
              </div>
            </div>

            {/* Weaknesses / Improvements */}
            <div className="rounded-2xl bg-[#181C2A] border border-amber-500/20 p-6 flex flex-col">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                  <FiAlertCircle size={16} />
                </div>
                <h3 className="text-base font-semibold text-white">Areas to Improve</h3>
              </div>
              <div className="space-y-3 flex-1">
                {report.weaknesses?.length > 0 ? (
                  report.weaknesses.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-xl bg-amber-500/5 border border-amber-500/10 p-3.5"
                    >
                      <span className="text-amber-400 font-bold mt-0.5">&bull;</span>
                      <p className="text-sm text-zinc-300 leading-relaxed">{item}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500">No weaknesses documented.</p>
                )}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="rounded-2xl bg-[#181C2A] border border-white/10 p-6 sm:p-7">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4">
              Actionable Recommendations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {report.recommendations?.length > 0 ? (
                report.recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3.5 rounded-xl border border-white/10 bg-white/[0.02] p-4"
                  >
                    <div className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed">{rec}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-500">No recommendations available.</p>
              )}
            </div>
          </div>

          {/* Question by Question Breakdown */}
          <div className="space-y-5 pt-4">
            <h3 className="text-xl font-bold text-white">Detailed Question Breakdown</h3>

            {report.questions?.map((q, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-[#181C2A] border border-white/10 p-6 sm:p-7 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <span className="text-xs font-medium uppercase tracking-widest text-zinc-400">
                    Question {idx + 1} &bull; Difficulty: <span className="text-white capitalize">{q.difficulty || 'Normal'}</span>
                  </span>
                  {q.feedback?.score !== undefined && (
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-white/10 text-white font-semibold">
                      Score: {q.feedback.score}/100
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-base font-semibold text-white leading-relaxed">{q.question}</h4>
                </div>

                <div className="rounded-xl bg-black/30 border border-white/5 p-4">
                  <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-1.5">
                    Your Response
                  </p>
                  <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {q.userAnswer || 'No answer submitted'}
                  </p>
                </div>

                {q.feedback && (
                  <div className="space-y-3">
                    {/* Score Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="rounded-lg bg-white/[0.02] border border-white/5 p-2.5 text-center">
                        <p className="text-[11px] text-zinc-400">Clarity</p>
                        <p className="text-base font-bold text-white mt-0.5">{q.feedback.clarity ?? 0}/100</p>
                      </div>
                      <div className="rounded-lg bg-white/[0.02] border border-white/5 p-2.5 text-center">
                        <p className="text-[11px] text-zinc-400">Relevance</p>
                        <p className="text-base font-bold text-white mt-0.5">{q.feedback.relevance ?? 0}/100</p>
                      </div>
                      <div className="rounded-lg bg-white/[0.02] border border-white/5 p-2.5 text-center">
                        <p className="text-[11px] text-zinc-400">Communication</p>
                        <p className="text-base font-bold text-white mt-0.5">{q.feedback.communication ?? 0}/100</p>
                      </div>
                      <div className="rounded-lg bg-white/[0.02] border border-white/5 p-2.5 text-center">
                        <p className="text-[11px] text-zinc-400">Correctness</p>
                        <p className="text-base font-bold text-white mt-0.5">{q.feedback.correctness ?? 0}/100</p>
                      </div>
                    </div>

                    {/* AI Feedback */}
                    {q.feedback.feedback && (
                      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
                          Interviewer Feedback
                        </p>
                        <p className="text-sm text-zinc-300 leading-relaxed">{q.feedback.feedback}</p>
                      </div>
                    )}

                    {/* Improvements */}
                    {q.feedback.improvements && q.feedback.improvements.length > 0 && (
                      <div className="pt-2">
                        <p className="text-xs font-semibold text-zinc-400 mb-2">Key Tips for this Question:</p>
                        <div className="space-y-1.5">
                          {q.feedback.improvements.map((tip, tipIdx) => (
                            <p key={tipIdx} className="text-xs text-zinc-300 flex items-start gap-2">
                              <span className="text-emerald-400">&rarr;</span>
                              <span>{tip}</span>
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InterviewReport;
