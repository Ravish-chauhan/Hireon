import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { rewriteResume } from "../services/analyseResumeService";
import { pdfToImagesFromUrl } from "../utils/pdfToImages";

import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

import {
  FiChevronDown,
  FiChevronUp,
  FiCopy,
  FiCheckCircle,
  FiAlertTriangle,
  FiStar,
  FiZap,
  FiTarget,
  FiTrendingUp,
  FiFileText,
} from "react-icons/fi";

/* ---------------- HELPERS ---------------- */
function convertItem(item: any) {
  if (!item) return "";
  if (typeof item === "string") return item;
  return Object.entries(item)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}

function getLabel(score: number) {
  if (score >= 90) return { text: "Excellent", className: "bg-[#E6FFEF] text-[#087f5b] border-[#a7f3d0]" };
  if (score >= 70) return { text: "Strong", className: "bg-[#E6FFEF] text-[#087f5b] border-[#a7f3d0]" };
  if (score >= 40) return { text: "Good Start", className: "bg-[#FFF7E6] text-[#b45309] border-[#fcd34d]" };
  return { text: "Needs Work", className: "bg-[#FFEDEE] text-[#9f1239] border-[#fecaca]" };
}

/* ---------------- SECTION STYLES (direct Tailwind/hex) ---------------- */
const SECTION_STYLES: Record<string, { title: string; icon: React.ReactNode; bg: string; iconColor: string }> = {
  strengths: {
    title: "Strengths",
    icon: <FiCheckCircle className="w-5 h-5" />,
    bg: "bg-[#F0FFF4] border-[#BBF7D0]",
    iconColor: "text-[#059669]",
  },
  weaknesses: {
    title: "Weaknesses",
    icon: <FiAlertTriangle className="w-5 h-5" />,
    bg: "bg-[#FFF1F2] border-[#FECACA]",
    iconColor: "text-[#B91C1C]",
  },
  suggestedImprovements: {
    title: "Suggested Improvements",
    icon: <FiTrendingUp className="w-5 h-5" />,
    bg: "bg-[#FFFBEB] border-[#FEF3C7]",
    iconColor: "text-[#B45309]",
  },
  skillsToAdd: {
    title: "Skills To Add",
    icon: <FiStar className="w-5 h-5" />,
    bg: "bg-[#EFF6FF] border-[#BFDBFE]",
    iconColor: "text-[#1D4ED8]",
  },
  missingKeywords: {
    title: "Missing Keywords",
    icon: <FiTarget className="w-5 h-5" />,
    bg: "bg-[#FAF5FF] border-[#E9D5FF]",
    iconColor: "text-[#6D28D9]",
  },
  criticalFixes: {
    title: "Critical Fixes",
    icon: <FiZap className="w-5 h-5" />,
    bg: "bg-[#FFF1F2] border-[#FECACA]",
    iconColor: "text-[#991B1B]",
  },
};

/* ---------------- SCORE GAUGE ---------------- */
const ScoreGauge: React.FC<{ score: number }> = ({ score }) => {
  const circumference = Math.PI * 55;
  const dash = (circumference * Math.max(0, Math.min(score, 100))) / 100;

  return (
    <div className="relative w-[180px] h-[110px]">
      <svg width="180" height="110" viewBox="0 0 150 100" className="drop-shadow-sm">
        <path d="M20 80 A55 55 0 0 1 130 80" stroke="#E6DCD3" strokeWidth="12" strokeLinecap="round" fill="none" />
        <path
          d="M20 80 A55 55 0 0 1 130 80"
          stroke="#FF7A2A"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${dash} ${circumference}`}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
        <span className="text-4xl font-bold text-[#2B1608]">{score}</span>
        <span className="text-sm text-[#6B5245]">/100</span>
      </div>
    </div>
  );
};

/* ---------------- SCORE CARD ---------------- */
const ScoreCard: React.FC<{ title: string; score: number; icon: React.ReactNode }> = ({ title, score, icon }) => {
  const label = getLabel(score);
  return (
    <div className="p-6 rounded-xl border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-md border-white/20 cursor-pointer hover:bg-white/90">
      <div className="flex justify-between items-start gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#FF7A2A]/10 text-[#FF7A2A]">{icon}</div>
          <div>
            <h4 className="font-semibold text-[#2B1608]">{title}</h4>
            <div className="text-2xl font-bold text-[#2B1608]">
              {score}
              <span className="text-sm font-normal text-[#6B5245]">/100</span>
            </div>
          </div>
        </div>

        <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${label.className}`}>{label.text}</span>
      </div>
    </div>
  );
};

/* ---------------- FEEDBACK SECTION ---------------- */
const FeedbackSection: React.FC<{ sectionKey: string; items: any[] }> = ({ sectionKey, items }) => {
  const style = SECTION_STYLES[sectionKey];
  if (!style || !items?.length) return null;

  return (
    <div className={`rounded-xl p-6 border ${style.bg} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`${style.iconColor} p-2 bg-white rounded-lg shadow-sm`}>{style.icon}</div>
        <h4 className="text-lg font-semibold text-[#2B1608]">{style.title}</h4>
        <div className="ml-auto text-xs px-2 py-1 rounded-full bg-white border text-[#6B5245]">
          {items.length} {items.length === 1 ? "item" : "items"}
        </div>
      </div>

      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="bg-white p-4 rounded-lg border text-sm text-[#2B1608] hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
            {convertItem(it)}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------- COLLAPSIBLE SECTION ---------------- */
const CollapsibleSection: React.FC<{
  section: string;
  content: any;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ section, content, isOpen, onToggle }) => {
  return (
    <div className="border rounded-xl overflow-hidden bg-white/80 backdrop-blur-md border-white/20 shadow-md hover:shadow-lg transition-all duration-300 hover:bg-white/90">
      <button onClick={onToggle} className="w-full p-5 flex justify-between items-center hover:bg-gray-50 transition-colors duration-200">
        <div className="flex items-center gap-3">
          <FiFileText className="text-[#6B5245]" />
          <span className="font-medium text-[#2B1608]">{section}</span>
        </div>
        {isOpen ? <FiChevronUp className="text-[#6B5245]" /> : <FiChevronDown className="text-[#6B5245]" />}
      </button>

      {isOpen && (
        <div className="p-5 border-t bg-gray-50">
          <div className="text-sm text-[#2B1608] leading-relaxed whitespace-pre-wrap font-medium">{convertItem(content)}</div>
        </div>
      )}
    </div>
  );
};

/* ---------------- MAIN COMPONENT ---------------- */
const ResumeAnalysis: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [resumeImages, setResumeImages] = useState<string[]>([]);
  const [rewrittenResume, setRewrittenResume] = useState<string>("");
  const [rewriteLoading, setRewriteLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const [openSections, setOpenSections] = useState<{ [k: string]: boolean }>({});

  const toggle = (k: string) => setOpenSections((p) => ({ ...p, [k]: !p[k] }));

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await api.get(`/resumes/analysis/${id}`);
        const data = res.data.analysis;
        setAnalysis(data);

        if (data?.fileUrl) {
          const imgs = await pdfToImagesFromUrl(data.fileUrl);
          setResumeImages(imgs);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(rewrittenResume);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-[#FAF9F7]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#FF7A2A]/30 border-t-[#FF7A2A] rounded-full animate-spin mx-auto" />
            <p className="mt-3 text-[#6B5245]">Analyzing your resume...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!analysis) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-[#FAF9F7]">
          <div className="bg-white p-8 rounded-xl border shadow text-center border-[#E6DCD3]">
            <FiAlertTriangle className="w-12 h-12 text-[#B91C1C] mx-auto mb-3" />
            <p className="text-[#2B1608] font-semibold text-lg">Analysis Not Found</p>
            <p className="text-[#6B5245] mt-2">We couldn't find the resume analysis you're looking for.</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const overall = Math.round(analysis.overallScore ?? 0);
  const overallLabel = getLabel(overall);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-cream-50 via-orange-50/30 to-brand-50/20 pt-28 pb-16">
        <div className="max-w-[95%] mx-auto px-2 sm:px-4 relative z-10">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-[#2B1608] mb-3">Resume Analysis</h1>
            <p className="text-[#6B5245] text-lg">AI-powered insights to make your resume stronger</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[570px_1fr] gap-10">
            {/* LEFT: Resume Preview */}
            <aside className="xl:sticky xl:top-28 xl:self-start">
              <div className="rounded-2xl border bg-white/80 backdrop-blur-md border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:bg-white/90">
                <div className="p-5 border-b bg-white border-[#E6DCD3]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#FF7A2A]/10 text-[#FF7A2A]">
                      <FiFileText />
                    </div>
                    <div>
                      <p className="font-semibold text-[#2B1608]">Uploaded Resume</p>
                      <p className="text-sm text-[#6B5245]">Preview of your document</p>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  {resumeImages.length > 0 ? (
                    <div className="space-y-4">
                      {resumeImages.map((src, idx) => (
                        <img
                          key={idx}
                          src={src}
                          alt={`resume-page-${idx}`}
                          className="w-full rounded-xl border shadow-sm"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="aspect-[8.5/11] bg-[#FFF3E8] rounded-xl border-2 border-dashed border-[#E6DCD3] flex items-center justify-center">
                      <div className="text-center">
                        <FiFileText className="w-12 h-12 text-[#6B5245] mx-auto mb-2" />
                        <p className="text-sm text-[#6B5245]">Resume preview</p>
                        <p className="text-xs text-[#6B5245]/70 mt-1">PDF visualization will appear here</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </aside>

            {/* RIGHT: Analysis */}
            <section className="space-y-8">
              {/* Overall Score */}
              <div className="rounded-2xl border bg-white/80 backdrop-blur-md border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 p-8 hover:bg-white/90">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <ScoreGauge score={overall} />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-semibold text-[#2B1608]">Overall Score</h3>
                      <span className={`px-3 py-1 text-sm rounded-full border ${overallLabel.className}`}>{overallLabel.text}</span>
                    </div>
                    <p className="text-[#6B5245]">Your resume has been analyzed across structure, content, ATS compatibility and tone.</p>
                  </div>
                </div>
              </div>

              {/* Score Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ScoreCard title="Tone & Style" score={Math.round(analysis.toneStyleScore ?? 0)} icon={<FiStar />} />
                <ScoreCard title="Content Quality" score={Math.round(analysis.contentScore ?? 0)} icon={<FiFileText />} />
                <ScoreCard title="Structure" score={Math.round(analysis.structureScore ?? 0)} icon={<FiTarget />} />
                <ScoreCard title="Skills Match" score={Math.round(analysis.skillsScore ?? 0)} icon={<FiTrendingUp />} />
              </div>

              {/* ATS Summary */}
              <div className="rounded-2xl border bg-[#FFF5EE] border-[#FFEDD5] shadow-lg hover:shadow-xl transition-all duration-300 p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[#FF7A2A] text-white">
                    <FiZap className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-[#2B1608]">ATS Compatibility</h4>
                      <span className="px-2 py-1 text-xs font-bold rounded bg-[#FF7A2A] text-white">{analysis.atsScore}/100</span>
                    </div>
                    <p className="text-[#6B5245]">{analysis.summary}</p>
                  </div>
                </div>
              </div>

              {/* Feedback Sections */}
              <div className="space-y-6">
                {["strengths", "weaknesses", "suggestedImprovements", "skillsToAdd", "missingKeywords", "criticalFixes"].map((key) => (
                  <FeedbackSection key={key} sectionKey={key} items={analysis[key]} />
                ))}
              </div>

              {/* Section-wise Feedback */}
              {analysis.sectionWiseFeedback && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-[#2B1608] flex items-center gap-2">
                    <FiFileText className="text-[#6B5245]" /> Section-by-Section Feedback
                  </h3>

                  {Object.entries(analysis.sectionWiseFeedback).map(([section, content]) => (
                    <CollapsibleSection
                      key={section}
                      section={section}
                      content={content}
                      isOpen={!!openSections[section]}
                      onToggle={() => toggle(section)}
                    />
                  ))}
                </div>
              )}

              {/* Rewrite */}
              <div className="hidden rounded-2xl border bg-white/80 backdrop-blur-md border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 p-8 hover:bg-white/90">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-[#FF7A2A]/10 text-[#FF7A2A]">
                    <FiZap />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#2B1608]">AI Resume Rewriter</h4>
                    <p className="text-[#6B5245] text-sm">Generate an optimized version of your resume.</p>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    setRewriteLoading(true);
                    try {
                      const res = await rewriteResume(id!);
                      setRewrittenResume(res.data.rewrittenResume);
                    } catch (err) {
                      console.error(err);
                    } finally {
                      setRewriteLoading(false);
                    }
                  }}
                  disabled={rewriteLoading}
                  className="w-full py-4 rounded-xl bg-[#FF7A2A] text-white font-semibold shadow-lg hover:bg-[#e6641f] hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:transform-none"
                >
                  {rewriteLoading ? "Rewriting..." : "Rewrite My Resume"}
                </button>

                {rewrittenResume && (
                  <div className="mt-6 bg-[#FFF8F4] border border-[#E6DCD3] p-6 rounded-xl shadow-md animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <FiCheckCircle className="text-green-600 w-5 h-5" />
                        <p className="font-semibold text-[#2B1608] text-lg">AI Rewritten Resume</p>
                      </div>
                      <button onClick={handleCopy} className="px-4 py-2 rounded-lg border bg-white text-sm hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2">
                        {copied ? "Copied!" : <><FiCopy /> Copy</>}
                      </button>
                    </div>

                    <pre className="whitespace-pre-wrap text-sm text-[#2B1608] leading-relaxed">{rewrittenResume}</pre>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ResumeAnalysis;