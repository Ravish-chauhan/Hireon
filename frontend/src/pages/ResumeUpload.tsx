import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { uploadResume, analyzeResume } from "../services/analyseResumeService";
import { FiUploadCloud, FiUser, FiFileText } from "react-icons/fi";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { seoConfig } from '../config/seoConfig';

const ResumeUpload = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const jobRoleSuggestions = [
    "Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer",
    "Data Scientist", "Product Manager", "UI/UX Designer", "DevOps Engineer",
    "Marketing Manager", "Sales Representative", "Business Analyst", "Project Manager",
    "Graphic Designer", "Content Writer", "Digital Marketing Specialist", "HR Manager"
  ];

  const filteredSuggestions = jobRoleSuggestions.filter(role => 
    role.toLowerCase().includes(jobRole.toLowerCase()) && role.toLowerCase() !== jobRole.toLowerCase()
  );

  const handleUpload = async () => {
    if (!resumeFile) return alert("Please upload your resume");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", resumeFile);

      const uploadRes = await uploadResume(formData);
      const resumeId = uploadRes.data.resumeId;

      const analysisRes = await analyzeResume(resumeId, jobDescription, jobRole);

      navigate(`/resume-analysis/${analysisRes.data.analysis._id}`);
    } catch (err: any) {
      console.error(err);
      alert(err.error || "Upload failed");
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{seoConfig.resumeUpload.title}</title>
        <meta name="description" content={seoConfig.resumeUpload.description} />
        <meta name="keywords" content={seoConfig.resumeUpload.keywords} />
        <link rel="canonical" href={seoConfig.resumeUpload.canonical} />
      </Helmet>
      <Header />

      {/* Background */}
      <div className="min-h-screen w-full pt-28 pb-28 relative overflow-hidden bg-gradient-to-br from-[#FFF9F4] via-[#FFEDE0] to-[#FFDCC6]">

        {/* Glass Shine */}
        <div className="absolute inset-0 pointer-events-none 
          bg-[linear-gradient(115deg,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0.18)_40%,rgba(255,255,255,0)_80%)]
          opacity-60"></div>

        {/* Shine Bar */}
        <div className="absolute top-20 right-10 w-[500px] h-[120px] 
          bg-white/40 rounded-3xl blur-2xl transform rotate-[12deg] opacity-40 pointer-events-none"></div>

        {/* ---------------------------------------------------------------- */}
        {/*                     LOADING SCREEN WITH GIF                     */}
        {/* ---------------------------------------------------------------- */}
        {loading && (
          <div className="flex flex-col items-center justify-center mt-24 mb-16">
            <img
              src="/resume-scan.gif"
              alt="Scanning Resume"
              className="w-[260px] h-auto mb-6 drop-shadow-xl"
            />
            <p className="text-lg text-[#3B1F0C] font-semibold">
              Analyzing your resume…
            </p>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/*                        FORM (hidden on load)                    */}
        {/* ---------------------------------------------------------------- */}
        {!loading && (
          <div className="relative max-w-5xl mx-auto w-[95%] px-4">

            <h1 className="text-5xl font-semibold text-[#2B1608] text-center tracking-tight">
              Improve Your Resume with <span className="text-orange-600 font-bold">AI Precision</span>
            </h1>

            <p className="text-gray-700 text-xl text-center mt-3 mb-16">
              Get instant ATS score, keyword analysis and actionable improvement tips.
            </p>

            <div className="space-y-8">

              {/* NAME */}
              <div>
                <label className="text-[#2B1608] font-semibold text-lg flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                    <FiUser className="w-5 h-5" />
                  </div>
                  Your Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  className="
                    w-full 
                    h-16 
                    px-6 
                    text-lg
                    rounded-2xl
                    bg-white/90 backdrop-blur-md
                    border border-white/30
                    hover:border-orange-300 
                    transition-all duration-300
                    focus:ring-2 focus:ring-orange-400/50 
                    focus:border-orange-400
                    focus:outline-none
                    shadow-lg hover:shadow-xl
                    placeholder:text-gray-400
                  "
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              {/* JOB ROLE */}
              <div className="relative">
                <label className="text-[#2B1608] font-semibold text-lg flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                    <FiUser className="w-5 h-5" />
                  </div>
                  Job Role <span className="text-sm font-normal text-gray-500">(Optional)</span>
                </label>

                <input
                  type="text"
                  placeholder="e.g. Software Engineer, Product Manager..."
                  className="
                    w-full 
                    h-16 
                    px-6 
                    text-lg
                    rounded-2xl
                    bg-white/90 backdrop-blur-md
                    border border-white/30
                    hover:border-orange-300 
                    transition-all duration-300
                    focus:ring-2 focus:ring-orange-400/50 
                    focus:border-orange-400
                    focus:outline-none
                    shadow-lg hover:shadow-xl
                    placeholder:text-gray-400
                  "
                  value={jobRole}
                  onChange={(e) => {
                    setJobRole(e.target.value);
                    setShowSuggestions(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowSuggestions(jobRole.length > 0)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />

                {/* Suggestions Dropdown */}
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl max-h-48 overflow-y-auto z-20">
                    {filteredSuggestions.slice(0, 8).map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-6 py-4 hover:bg-orange-50 cursor-pointer text-[#2B1608] transition-all duration-200 hover:scale-[1.02] first:rounded-t-2xl last:rounded-b-2xl"
                        onMouseDown={() => {
                          setJobRole(suggestion);
                          setShowSuggestions(false);
                        }}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* JOB DESCRIPTION */}
              <div>
                <label className="text-[#2B1608] font-semibold text-lg flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-green-100 text-green-600">
                    <FiFileText className="w-5 h-5" />
                  </div>
                  Job Description <span className="text-sm font-normal text-gray-500">(Optional)</span>
                </label>

                <textarea
                  placeholder="Paste the job description to get targeted analysis..."
                  className="
                    w-full 
                    h-40 
                    px-6 py-4
                    text-lg
                    rounded-2xl
                    bg-white/90 backdrop-blur-md
                    border border-white/30
                    hover:border-orange-300 
                    transition-all duration-300
                    focus:ring-2 focus:ring-orange-400/50 
                    focus:border-orange-400
                    focus:outline-none
                    shadow-lg hover:shadow-xl
                    placeholder:text-gray-400
                    resize-none
                  "
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                ></textarea>
              </div>

              {/* UPLOAD BOX */}
              <div
                className="
                  w-full 
                  py-20 
                  rounded-3xl 
                  border-2 border-dashed border-orange-300
                  bg-gradient-to-br from-orange-50/50 to-white/50 backdrop-blur-md
                  shadow-xl
                  hover:shadow-2xl
                  hover:border-orange-400
                  hover:scale-[1.02]
                  transition-all duration-300
                  cursor-pointer flex flex-col items-center justify-center
                  relative group
                "
              >
                <div className="p-6 rounded-full bg-orange-100 group-hover:bg-orange-200 transition-colors duration-300 mb-6">
                  <FiUploadCloud size={48} className="text-orange-600" />
                </div>

                <h3 className="text-xl font-bold text-[#2B1608] mb-2">
                  {resumeFile ? resumeFile.name : "Upload Your Resume"}
                </h3>
                <p className="text-gray-600 text-center max-w-sm">
                  {resumeFile ? "File selected successfully" : "Drag & drop your resume here or click to browse"}
                </p>
                <p className="text-sm text-gray-500 mt-2">Supports PDF, DOC, DOCX</p>

                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              {/* BUTTON */}
              <button
                onClick={handleUpload}
                disabled={loading || !resumeFile}
                className="
                  w-full 
                  h-16 
                  rounded-2xl 
                  text-white 
                  text-xl 
                  font-bold
                  bg-gradient-to-r from-orange-500 to-brand-600
                  shadow-xl hover:shadow-2xl 
                  hover:scale-105 active:scale-95
                  transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  flex items-center justify-center gap-3
                "
              >
                <FiUploadCloud className="w-6 h-6" />
                {resumeFile ? "Analyze Resume" : "Upload & Analyze"}
              </button>

            </div>
          </div>
        )}

      </div>

      <Footer />
    </>
  );
};

export default ResumeUpload;
