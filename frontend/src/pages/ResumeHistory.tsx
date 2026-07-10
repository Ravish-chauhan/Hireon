import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { FiEye, FiCalendar, FiFileText, FiStar } from "react-icons/fi";
import { pdfToImagesFromUrl } from "../utils/pdfToImages";

interface ResumeAnalysis {
  _id: string;
  overallScore: number;
  createdAt: string;
  rawResume: string;
  jobDescription?: string;
  resumeId: string;
}

interface ResumeWithImage extends ResumeAnalysis {
  resumeImage?: string | null;
  imageLoading?: boolean;
}

const ResumeHistory: React.FC = () => {
  const [analyses, setAnalyses] = useState<ResumeWithImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/resumes/history");
        const analysesData = response.data.analyses || [];
        
        // Set initial data without images
        const initialAnalyses = analysesData.map((analysis: ResumeAnalysis) => ({
          ...analysis,
          resumeImage: undefined,
          imageLoading: true
        }));
        setAnalyses(initialAnalyses);
        setLoading(false);
        
        // Fetch images in background
        analysesData.forEach(async (analysis: ResumeAnalysis, index: number) => {
          try {
            if (analysis.resumeId) {
              const resumeResponse = await api.get(`/resumes/${analysis.resumeId}`);
              const fileUrl = resumeResponse.data.resume?.fileUrl;
              
              if (fileUrl) {
                const images = await pdfToImagesFromUrl(fileUrl);
                setAnalyses(prev => prev.map((item, i) => 
                  i === index 
                    ? { ...item, resumeImage: images[0] || undefined, imageLoading: false }
                    : item
                ));
              } else {
                setAnalyses(prev => prev.map((item, i) => 
                  i === index ? { ...item, imageLoading: false } : item
                ));
              }
            } else {
              setAnalyses(prev => prev.map((item, i) => 
                i === index ? { ...item, imageLoading: false } : item
              ));
            }
          } catch (error) {
            console.error("Failed to fetch resume image for analysis:", analysis._id, error);
            setAnalyses(prev => prev.map((item, i) => 
              i === index ? { ...item, imageLoading: false } : item
            ));
          }
        });
      } catch (error) {
        console.error("Failed to fetch resume history:", error);
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Work";
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-28 pb-16 bg-gray-50 min-h-screen">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <main className="pt-28 pb-16 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Resume Analysis History
            </h1>
            <p className="text-lg text-gray-600">
              Track your resume improvements over time
            </p>
          </div>

          {analyses.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiFileText className="text-4xl text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                No Resume Analyses Yet
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Upload and analyze your first resume to start tracking your progress and improvements.
              </p>
              <Link
                to="/resume-upload"
                className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-semibold shadow-lg"
              >
                <FiFileText className="mr-2" />
                Upload Your First Resume
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analyses.map((analysis) => {
                const score = Math.round(analysis.overallScore || 0);
                return (
                  <div
                    key={analysis._id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    {/* Resume Thumbnail */}
                    <div className="h-48 bg-gray-100 relative overflow-hidden">
                      {analysis.imageLoading ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        </div>
                      ) : analysis.resumeImage ? (
                        <img
                          src={analysis.resumeImage}
                          alt="Resume preview"
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiFileText className="text-4xl text-gray-400" />
                        </div>
                      )}
                      
                      {/* Score Badge */}
                      <div className="absolute top-4 right-4">
                        <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(score)}`}>
                          {score}/100
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <FiStar className="text-orange-500" />
                          <span className="font-semibold text-gray-900">
                            {getScoreLabel(score)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <FiCalendar size={14} />
                          {new Date(analysis.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {analysis.rawResume.substring(0, 120)}...
                      </p>
                      
                      {analysis.jobDescription && (
                        <div className="mb-4">
                          <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                            Job-Targeted Analysis
                          </span>
                        </div>
                      )}
                      
                      <Link
                        to={`/resume-analysis/${analysis._id}`}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-semibold shadow-md"
                      >
                        <FiEye size={16} />
                        View Full Analysis
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ResumeHistory;