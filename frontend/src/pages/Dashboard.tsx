import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../hooks/useAuth';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { ScoreDistributionChart, DifficultyAccuracyChart, TopicAccuracyChart } from '../components/assessment/AssessmentCharts';
import api from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import {
  BookOpenIcon,
  CalendarIcon,
  UserIcon,
  FileTextIcon,
  TrendingUpIcon,
  TargetIcon,
  AwardIcon,
  SparklesIcon,
  PhoneIcon,
  HomeIcon,
  BrainCircuitIcon,
  MessageSquareIcon,
  SettingsIcon,
  BellIcon,
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  BarChart3Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  GraduationCapIcon,
  ActivityIcon,
  StarIcon,
  MapPinIcon,
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CrownIcon,
  LockIcon,
  EyeIcon,
} from 'lucide-react';
import { pdfToImagesFromUrl } from '../utils/pdfToImages';
import { seoConfig } from '../config/seoConfig';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSection, setExpandedSection] = useState<string[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<any | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAIAnalysisModal, setShowAIAnalysisModal] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showAIAnalysisModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAIAnalysisModal]);
  const [dashboardData, setDashboardData] = useState({
    consultations: [] as any[],
    assessmentResults: [] as any[],
    resumeAnalyses: [] as any[],
    profileCompletion: 0,
    subscription: null as any,
    loading: true,
    notifications: [] as any[],
    userPreferences: null as any,
    monthlyConsultations: [] as any[]
  });

  // Navigation items
  const navItems = [
    { id: 'overview', label: 'Overview', icon: HomeIcon },
    { id: 'assessments', label: 'Assessments', icon: BrainCircuitIcon },
    { id: 'consultations', label: 'Consultations', icon: MessageSquareIcon },
    { id: 'resumes', label: 'Resumes', icon: FileTextIcon },
    { id: 'analytics', label: 'Analytics', icon: BarChart3Icon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  const nextQuestion = () => {
    if (selectedAssessment && currentQuestionIndex < selectedAssessment.attempts.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }
  const premiumSections = [
    {
      id: 'profile-analysis',
      title: 'Profile Analysis',
      icon: UserIcon,
      color: 'from-blue-500 to-blue-600',
      content: {
        score: 85,
        strengths: ['Strong Academic Background', 'Leadership Experience', 'Technical Skills'],
        improvements: ['Extracurricular Activities', 'Research Experience'],
        recommendations: 'Focus on building research portfolio and participating in competitions'
      }
    },
    {
      id: 'shortlisted-colleges',
      title: 'AI College Shortlist',
      icon: GraduationCapIcon,
      color: 'from-green-500 to-green-600',
      content: {
        colleges: [
          { name: 'IIT Delhi', match: 92, location: 'New Delhi', fees: '₹2.5L/year' },
          { name: 'IIT Bombay', match: 89, location: 'Mumbai', fees: '₹2.5L/year' },
          { name: 'BITS Pilani', match: 85, location: 'Pilani', fees: '₹4.5L/year' }
        ]
      }
    },
    {
      id: 'activity-tracker',
      title: 'Activity Tracker',
      icon: ActivityIcon,
      color: 'from-purple-500 to-purple-600',
      content: {
        weeklyGoal: 5,
        completed: 3,
        activities: [
          { name: 'Assessment Practice', completed: 2, target: 3 },
          { name: 'College Research', completed: 1, target: 2 },
          { name: 'Application Prep', completed: 0, target: 1 }
        ]
      }
    }
  ];

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setDashboardData(prev => ({ ...prev, loading: true }));
        
        let consultations: any[] = [];
        let assessmentResults: any[] = [];
        let monthlyConsultations: any[] = [];
        let notifications: any[] = [];
        
        try {
          const consultationsResponse = await api.get('/consultation/me');
          consultations = consultationsResponse.data?.consultations || [];
          console.log('Consultations fetched:', consultations);
        } catch (error) {
          console.log('Error fetching consultations:', error);
          consultations = [];
        }
        
        try {
          const monthlyStatsResponse = await api.get('/consultation/monthly-stats');
          monthlyConsultations = monthlyStatsResponse.data?.data || [];
          console.log('Monthly consultation stats fetched:', monthlyConsultations);
        } catch (error) {
          console.log('Error fetching monthly stats:', error);
          monthlyConsultations = [];
        }
        
        try {
          const notificationsResponse = await api.get('/notifications');
          notifications = notificationsResponse.data?.notifications || [];
          console.log('Notifications fetched:', notifications);
        } catch (error) {
          console.log('Error fetching notifications:', error);
          notifications = [];
        }
        
        try {
          const assessmentsResponse = await api.get('/assessments/history');
          assessmentResults = (assessmentsResponse.data || []).map((assessment: any) => ({
            id: assessment._id,
            type: assessment.examType,
            score: Math.round(((assessment.score || 0) / assessment.attempts.length) * 100),
            percentile: Math.min(95, Math.round(((assessment.score || 0) / assessment.attempts.length) * 100) + Math.floor(Math.random() * 10)),
            date: assessment.createdAt,
            status: assessment.status || 'completed',
            totalQuestions: assessment.attempts.length,
            correctAnswers: assessment.score || 0,
            attempts: assessment.attempts,
            completedAt: assessment.completedAt,
            
            // New structured analysis fields
            overview: assessment.analysisData?.overview,
            chartData: assessment.analysisData?.chartData,
            tentativeExamScore: assessment.analysisData?.tentativeExamScore,
            nextActionPlan: assessment.analysisData?.nextActionPlan,
            
            // Legacy analysis fields
            overallAnalysis: assessment.overallAnalysis,
            strengths: assessment.strengths,
            weaknesses: assessment.weaknesses,
            recommendations: assessment.recommendations,
            studyPlan: assessment.studyPlan,
            topicWiseAnalysis: assessment.topicWiseAnalysis
          }));
        } catch (error) {
          console.log('No assessments found or error fetching assessments');
          assessmentResults = [];
        }
        
        let resumeAnalyses: any[] = [];
        
        try {
          const resumeResponse = await api.get('/resumes/history');
          resumeAnalyses = resumeResponse.data?.analyses || [];
          console.log('Resume analyses fetched:', resumeAnalyses);
        } catch (error) {
          console.log('Error fetching resume analyses:', error);
          resumeAnalyses = [];
        }
        
        const completionRes = await api.get('/users/profile/completion');
        const profileCompletion = completionRes.data?.profileCompletedPercent || 0;
        
        let subscription = null;
        let userPreferences = null;
        try {
          const subscriptionRes = await api.get('/subscriptions/current');
          subscription = subscriptionRes.data?.subscription || null;
        } catch (error) {
          console.log('No active subscription found');
        }
        
        try {
          const profileRes = await api.get('/users/profile');
          const profileData = profileRes.data?.data;
          console.log('Profile data fetched:', profileData);
          
          if (profileData?.preferences) {
            userPreferences = {
              preferredLocations: profileData.preferences.preferredLocations || [],
              budgetMin: profileData.preferences.budgetMin,
              budgetMax: profileData.preferences.budgetMax,
              programInterests: profileData.preferences.programInterests || []
            };
            console.log('User preferences found:', userPreferences);
          } else {
            console.log('No preferences found in profile data');
            userPreferences = null;
          }
        } catch (error) {
          console.log('Error fetching preferences:', error);
          userPreferences = null;
        }
        
        console.log('Final userPreferences:', userPreferences);
        
        setDashboardData({
          consultations,
          profileCompletion,
          subscription,
          assessmentResults,
          resumeAnalyses: resumeAnalyses.map((analysis: any) => ({
            ...analysis,
            resumeImage: undefined,
            imageLoading: true
          })),
          notifications,
          userPreferences,
          monthlyConsultations,
          loading: false
        });
        
        // Fetch resume images in background after setting initial data
        resumeAnalyses.forEach(async (analysis: any, index: number) => {
          try {
            if (analysis.resumeId) {
              const resumeRes = await api.get(`/resumes/${analysis.resumeId}`);
              const fileUrl = resumeRes.data.resume?.fileUrl;
              
              if (fileUrl) {
                const images = await pdfToImagesFromUrl(fileUrl);
                setDashboardData(prev => ({
                  ...prev,
                  resumeAnalyses: prev.resumeAnalyses.map((item, i) => 
                    i === index 
                      ? { ...item, resumeImage: images[0] || undefined, imageLoading: false }
                      : item
                  )
                }));
              } else {
                setDashboardData(prev => ({
                  ...prev,
                  resumeAnalyses: prev.resumeAnalyses.map((item, i) => 
                    i === index ? { ...item, imageLoading: false } : item
                  )
                }));
              }
            } else {
              setDashboardData(prev => ({
                ...prev,
                resumeAnalyses: prev.resumeAnalyses.map((item, i) => 
                  i === index ? { ...item, imageLoading: false } : item
                )
              }));
            }
          } catch (error) {
            console.error("Failed to fetch resume image for analysis:", analysis._id, error);
            setDashboardData(prev => ({
              ...prev,
              resumeAnalyses: prev.resumeAnalyses.map((item, i) => 
                i === index ? { ...item, imageLoading: false } : item
              )
            }));
          }
        });
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setDashboardData({
          consultations: [],
          assessmentResults: [],
          resumeAnalyses: [],
          notifications: [],
          userPreferences: null,
          profileCompletion: user?.fullName ? 50 : 0,
          subscription: null,
          monthlyConsultations: [],
          loading: false
        });
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Stats cards data
  const statsCards = [
    {
      title: 'Complete Profile',
      value: `${Math.round(dashboardData.profileCompletion)}%`,
      icon: UserIcon,
      color: 'from-blue-500 to-blue-600',
      description: 'Get personalised recommendations',
      showProgress: true,
      progress: dashboardData.profileCompletion
    },
    {
      title: 'Expert Sessions',
      value: dashboardData.consultations.length,
      icon: MessageSquareIcon,
      color: 'from-green-500 to-green-600',
      description: 'Consultations booked'
    },
    {
      title: 'Assessments Taken',
      value: dashboardData.assessmentResults.length,
      icon: BrainCircuitIcon,
      color: 'from-purple-500 to-purple-600',
      description: 'Practice tests completed'
    },
    {
      title: 'Resume Reviews',
      value: dashboardData.resumeAnalyses.length,
      icon: FileTextIcon,
      color: 'from-orange-500 to-orange-600',
      description: 'ATS optimizations done'
    }
  ];

  // Chart components
  const InteractiveBarChart = ({ data, title }: { data: any[]; title: string }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" stroke="#666" fontSize={12} />
          <YAxis stroke="#666" fontSize={12} />
          <Tooltip />
          <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const InteractiveLineChart = ({ data, title }: { data: any[]; title: string }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="week" stroke="#666" fontSize={12} />
          <YAxis stroke="#666" fontSize={12} />
          <Tooltip />
          <Line type="monotone" dataKey="progress" stroke="#10B981" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  // Mock chart data
  const monthlyData = dashboardData.monthlyConsultations.length > 0 
    ? dashboardData.monthlyConsultations 
    : [
        { month: 'Jan', value: 0 },
        { month: 'Feb', value: 0 },
        { month: 'Mar', value: 0 },
        { month: 'Apr', value: 0 },
        { month: 'May', value: 0 },
        { month: 'Jun', value: 0 }
      ];

  const weeklyData = [
    { week: 'Week 1', progress: 20 },
    { week: 'Week 2', progress: 40 },
    { week: 'Week 3', progress: 60 },
    { week: 'Week 4', progress: dashboardData.profileCompletion }
  ];

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'assessments':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Assessment Results</h2>
              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => navigate('/assessment-history')} 
                  variant="outline" 
                  className="flex items-center gap-2"
                >
                  <EyeIcon size={16} />
                  View History
                </Button>
                <Button 
                  onClick={() => navigate('/nmat/history')} 
                  variant="outline" 
                  className="flex items-center gap-2"
                >
                  <EyeIcon size={16} />
                  NMAT History
                </Button>
                <Button onClick={() => navigate('/assessment')} className="flex items-center gap-2">
                  <PlusIcon size={16} />
                  Take New Assessment
                </Button>
              </div>
            </div>
            
            {dashboardData.assessmentResults.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Assessments Yet</h3>
                <p className="text-gray-600 mb-6">Take your first assessment to see your progress here</p>
                <Button onClick={() => navigate('/assessment')} className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                  Start Assessment
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Assessment List - Horizontal Scrolling */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Assessments</h3>
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {dashboardData.assessmentResults.map((assessment) => (
                      <div
                        key={assessment.id}
                        onClick={() => setSelectedAssessment(assessment)}
                        className={`bg-white rounded-xl p-4 shadow-sm border-2 transition-all cursor-pointer flex-shrink-0 w-72 ${
                          selectedAssessment?.id === assessment.id
                            ? 'border-orange-500 shadow-lg'
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                            {assessment.type}
                          </span>
                          <span className={`font-bold ${getScoreColor(assessment.correctAnswers || 0, assessment.totalQuestions)}`}>
                            {assessment.correctAnswers || 0}/{assessment.totalQuestions}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span className="truncate">{formatDate(assessment.date)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUpIcon className="w-4 h-4" />
                            <span>{assessment.score}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assessment Details */}
                <div>
                  {selectedAssessment ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                      <div className="p-4 sm:p-6 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                            {selectedAssessment.type} Assessment
                          </h2>
                          <div className="text-left sm:text-right">
                            <div className={`text-xl sm:text-2xl font-bold ${getScoreColor(selectedAssessment.correctAnswers || 0, selectedAssessment.totalQuestions)}`}>
                              {selectedAssessment.score}%
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600">
                              {selectedAssessment.correctAnswers || 0} out of {selectedAssessment.totalQuestions} correct
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="truncate">Completed: {formatDate(selectedAssessment.completedAt || selectedAssessment.date)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>Status: {selectedAssessment.status}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="p-4 sm:p-6 border-b border-gray-200 space-y-3">
                        <button
                          onClick={() => navigate('/assessment-result', { 
                            state: { 
                              results: {
                                score_percentage: selectedAssessment.score,
                                correct_answers: selectedAssessment.correctAnswers,
                                total_questions: selectedAssessment.totalQuestions,
                                percentile: selectedAssessment.percentile,
                                strengths: selectedAssessment.strengths,
                                weaknesses: selectedAssessment.weaknesses,
                                recommendations: selectedAssessment.recommendations,
                                overview: selectedAssessment.overview,
                                chartData: selectedAssessment.chartData,
                                tentativeExamScore: selectedAssessment.tentativeExamScore,
                                nextActionPlan: selectedAssessment.nextActionPlan
                              },
                              examType: selectedAssessment.type
                            }
                          })}
                          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                          <EyeIcon className="w-5 h-5" />
                          View Detailed Result
                        </button>
                        {(selectedAssessment.overallAnalysis || selectedAssessment.strengths?.length > 0 || selectedAssessment.weaknesses?.length > 0) && (
                          <button
                            onClick={() => setShowAIAnalysisModal(true)}
                            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                          >
                            <BrainCircuitIcon className="w-5 h-5" />
                            View AI Analysis
                          </button>
                        )}
                      </div>

                      <div className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
                          <h3 className="text-base sm:text-lg font-bold text-gray-900">Question Review</h3>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                            <span>Question {currentQuestionIndex + 1} of {selectedAssessment.attempts?.length || 0}</span>
                          </div>
                        </div>

                        {selectedAssessment.attempts && selectedAssessment.attempts.length > 0 && selectedAssessment.attempts[currentQuestionIndex] && (
                          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-2">
                              <h4 className="text-lg sm:text-xl font-semibold text-gray-900">
                                Question {currentQuestionIndex + 1}
                              </h4>
                              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold self-start ${
                                selectedAssessment.attempts[currentQuestionIndex].isCorrect 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {selectedAssessment.attempts[currentQuestionIndex].isCorrect ? 'Correct' : 'Incorrect'}
                              </span>
                            </div>
                            
                            {selectedAssessment.attempts[currentQuestionIndex].questionData ? (
                              <>
                                <p className="text-gray-800 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg leading-relaxed">
                                  {selectedAssessment.attempts[currentQuestionIndex].questionData.text || 'Question text not available'}
                                </p>
                                
                                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                                  {(selectedAssessment.attempts[currentQuestionIndex].questionData.options || []).map((option: string, optionIndex: number) => {
                                    const attempt = selectedAssessment.attempts[currentQuestionIndex]
                                    return (
                                      <div
                                        key={optionIndex}
                                        className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                                          optionIndex === attempt.questionData.correctAnswer
                                            ? 'bg-green-50 border-green-300 text-green-800'
                                            : optionIndex === attempt.selectedOption && !attempt.isCorrect
                                            ? 'bg-red-50 border-red-300 text-red-800'
                                            : 'bg-gray-50 border-gray-200'
                                        }`}
                                      >
                                        <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                                          <span className="font-bold text-sm sm:text-base lg:text-lg flex-shrink-0">
                                            {String.fromCharCode(65 + optionIndex)}.
                                          </span>
                                          <span className="flex-1 text-sm sm:text-base">{option}</span>
                                          {optionIndex === attempt.questionData.correctAnswer && (
                                            <span className="text-green-600 font-semibold text-xs sm:text-sm flex-shrink-0">✓ Correct</span>
                                          )}
                                          {optionIndex === attempt.selectedOption && optionIndex !== attempt.questionData.correctAnswer && (
                                            <span className="text-red-600 font-semibold text-xs sm:text-sm flex-shrink-0">✗ Your Answer</span>
                                          )}
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                                
                                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 sm:p-4">
                                  <h5 className="font-bold text-blue-900 mb-2 text-sm sm:text-base lg:text-lg">Explanation:</h5>
                                  <p className="text-blue-800 leading-relaxed text-sm sm:text-base">
                                    {selectedAssessment.attempts[currentQuestionIndex].questionData.explanation || 'Explanation not available'}
                                  </p>
                                </div>
                              </>
                            ) : (
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <h5 className="font-bold text-yellow-900 mb-2">Question Data Not Available</h5>
                                <p className="text-yellow-800">This assessment was created before question details were stored. Only the result is available.</p>
                                <div className="mt-3 text-sm">
                                  <p><strong>Selected Option:</strong> {selectedAssessment.attempts[currentQuestionIndex].selectedOption + 1}</p>
                                  <p><strong>Result:</strong> {selectedAssessment.attempts[currentQuestionIndex].isCorrect ? 'Correct' : 'Incorrect'}</p>
                                </div>
                              </div>
                            )}

                            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                              <div className="flex flex-col gap-4 sm:hidden">
                                <div className="flex justify-between">
                                  <button
                                    onClick={prevQuestion}
                                    disabled={currentQuestionIndex === 0}
                                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                                  >
                                    <ChevronLeftIcon className="w-4 h-4" />
                                    Previous
                                  </button>
                                  <button
                                    onClick={nextQuestion}
                                    disabled={currentQuestionIndex === selectedAssessment.attempts.length - 1}
                                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                                  >
                                    Next
                                    <ChevronRightIcon className="w-4 h-4" />
                                  </button>
                                </div>
                                <div className="flex gap-1 justify-center flex-wrap">
                                  {selectedAssessment.attempts.map((_: any, index: number) => (
                                    <button
                                      key={index}
                                      onClick={() => setCurrentQuestionIndex(index)}
                                      className={`w-7 h-7 rounded-full text-xs font-semibold transition-all ${
                                        index === currentQuestionIndex
                                          ? 'bg-orange-600 text-white'
                                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                      }`}
                                    >
                                      {index + 1}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="hidden sm:flex items-center justify-between">
                                <button
                                  onClick={prevQuestion}
                                  disabled={currentQuestionIndex === 0}
                                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                  <ChevronLeftIcon className="w-5 h-5" />
                                  Previous
                                </button>
                                
                                <div className="flex gap-2 overflow-x-auto max-w-xs lg:max-w-md">
                                  {selectedAssessment.attempts.map((_: any, index: number) => (
                                    <button
                                      key={index}
                                      onClick={() => setCurrentQuestionIndex(index)}
                                      className={`w-8 h-8 rounded-full text-sm font-semibold transition-all flex-shrink-0 ${
                                        index === currentQuestionIndex
                                          ? 'bg-orange-600 text-white'
                                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                      }`}
                                    >
                                      {index + 1}
                                    </button>
                                  ))}
                                </div>

                                <button
                                  onClick={nextQuestion}
                                  disabled={currentQuestionIndex === selectedAssessment.attempts.length - 1}
                                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                  Next
                                  <ChevronRightIcon className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
                      <div className="text-4xl sm:text-6xl mb-4">📋</div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Select an Assessment</h3>
                      <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Choose an assessment from the list to review questions and answers</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      
      case 'consultations':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Consultations</h2>
              <Button onClick={() => navigate('/book-consultation')} className="flex items-center gap-2">
                <PlusIcon size={16} />
                Book Consultation
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardData.consultations.length > 0 ? (
                dashboardData.consultations.map((consultation, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                          <span className="text-2xl">🎓</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{consultation.category || 'General Consultation'}</h3>
                          <p className="text-sm text-gray-600">
                            {consultation.date ? new Date(consultation.date).toLocaleDateString() : 'Date TBD'} at {consultation.time || 'Time TBD'}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        consultation.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        consultation.status === 'Contacted' ? 'bg-blue-100 text-blue-700' :
                        consultation.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {consultation.status || 'Confirmed'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Name:</span> {consultation.userName}</p>
                      <p><span className="font-medium">Consultant:</span> {consultation.consultantName || 'Not assigned'}</p>
                      <p><span className="font-medium">Phone:</span> {consultation.phone}</p>
                      {consultation.message && (
                        <p><span className="font-medium">Notes:</span> {consultation.message}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-200">
                  <MessageSquareIcon size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No consultations yet</h3>
                  <p className="text-gray-600 mb-4">Book your first consultation to get expert guidance</p>
                  <Button onClick={() => navigate('/book-consultation')}>Book Consultation</Button>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'resumes':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Resume Analyses</h2>
              <Button onClick={() => navigate('/resume-upload')} className="flex items-center gap-2">
                <PlusIcon size={16} />
                Analyze Resume
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardData.resumeAnalyses.length > 0 ? (
                dashboardData.resumeAnalyses.map((analysis) => {
                  const score = Math.round(analysis.overallScore || 0);
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
                  return (
                    <div
                      key={analysis._id}
                      onClick={() => navigate(`/resume-analysis/${analysis._id}`)}
                      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
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
                            <FileTextIcon className="text-4xl text-gray-400" />
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
                            <StarIcon className="text-orange-500" size={16} />
                            <span className="font-semibold text-gray-900">
                              {getScoreLabel(score)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <CalendarIcon size={14} />
                            {new Date(analysis.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                          {analysis.rawResume?.substring(0, 120)}...
                        </p>
                        
                        {analysis.jobDescription && (
                          <div className="mb-4">
                            <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                              Job-Targeted Analysis
                            </span>
                          </div>
                        )}
                        
                        <div className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-semibold shadow-md">
                          <EyeIcon size={16} />
                          View Full Analysis
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-200">
                  <FileTextIcon size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No resume analyses yet</h3>
                  <p className="text-gray-600 mb-4">Upload your first resume to get ATS optimization</p>
                  <Button onClick={() => navigate('/resume-upload')}>Analyze Resume</Button>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'analytics':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InteractiveBarChart data={monthlyData} title="Monthly Consultations (Last 6 Months)" />
              <InteractiveLineChart data={weeklyData} title="Profile Progress" />
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            <div className="grid gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h3>
                <div className="space-y-4">
                  <Button onClick={() => navigate('/profile')} variant="outline" className="w-full justify-start">
                    <UserIcon size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                  <Button onClick={() => navigate('/#pricing')} variant="outline" className="w-full justify-start">
                    <AwardIcon size={16} className="mr-2" />
                    Subscription Plans
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return renderOverviewContent();
    }
  };

  const renderOverviewContent = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={28} className="text-white" />
                </div>
              </div>
              <div className="text-lg font-semibold text-gray-800 mb-1">{stat.title}</div>
              <div className="text-sm text-gray-500 mb-3">{stat.description}</div>
              {stat.showProgress ? (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                    <span className="text-sm text-gray-600">Complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${stat.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${stat.progress}%` }}
                    />
                  </div>
                </>
              ) : (
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Premium Features - Always Show */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <SparklesIcon size={24} className="text-yellow-500" />
            Premium Features
          </h3>
          {!dashboardData.subscription && (
            <Button 
              onClick={() => navigate('/#pricing')} 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold px-4 py-2 rounded-lg hover:shadow-lg transition-all"
            >
              <CrownIcon size={16} className="mr-2" />
              Unlock Premium
            </Button>
          )}
        </div>
        <div className="space-y-4">
          {/* Profile Analysis - Full Width */}
          {premiumSections.filter(section => section.id === 'profile-analysis').map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedSection.includes(section.id);
            const isLocked = !dashboardData.subscription;
            return (
              <div key={section.id} className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden ${isLocked ? 'opacity-75' : ''}`}>
                <button
                  onClick={() => {
                    if (isLocked) {
                      navigate('/#pricing');
                    } else {
                      setExpandedSection(prev => 
                        prev.includes(section.id) 
                          ? prev.filter(id => id !== section.id)
                          : [...prev, section.id]
                      );
                    }
                  }}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors relative"
                >
                  {isLocked && (
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                        <LockIcon size={20} className="text-gray-600" />
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${section.color} flex items-center justify-center`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        {section.title}
                        {isLocked && <CrownIcon size={16} className="text-yellow-500" />}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {isLocked ? 'Unlock with Premium subscription' : `Score: ${section.content.score}/100`}
                      </p>
                    </div>
                  </div>
                  {!isLocked && (isExpanded ? <ChevronUpIcon size={20} /> : <ChevronDownIcon size={20} />)}
                </button>
                
                {isExpanded && !isLocked && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    <div className="space-y-4 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-semibold text-green-700 mb-2">Strengths</h5>
                          <ul className="space-y-1">
                            {section.content.strengths.map((strength: string, idx: number) => (
                              <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                                <CheckCircleIcon size={16} className="text-green-500" />
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-semibold text-orange-700 mb-2">Areas for Improvement</h5>
                          <ul className="space-y-1">
                            {section.content.improvements.map((improvement: string, idx: number) => (
                              <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                                <AlertCircleIcon size={16} className="text-orange-500" />
                                {improvement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-blue-900 mb-2">Recommendations</h5>
                        <p className="text-sm text-blue-800">{section.content.recommendations}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          {/* College Shortlist and Activity Tracker - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {premiumSections.filter(section => section.id !== 'profile-analysis').map((section) => {
              const Icon = section.icon;
              const isExpanded = expandedSection.includes(section.id);
              const isLocked = !dashboardData.subscription;
              return (
                <div key={section.id} className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden ${isLocked ? 'opacity-75' : ''}`}>
                  <button
                    onClick={() => {
                      if (isLocked) {
                        navigate('/#pricing');
                      } else {
                        setExpandedSection(prev => 
                          prev.includes(section.id) 
                            ? prev.filter(id => id !== section.id)
                            : [...prev, section.id]
                        );
                      }
                    }}
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors relative"
                  >
                    {isLocked && (
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                          <LockIcon size={20} className="text-gray-600" />
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${section.color} flex items-center justify-center`}>
                        <Icon size={24} className="text-white" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          {section.title}
                          {isLocked && <CrownIcon size={16} className="text-yellow-500" />}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {isLocked ? 'Unlock with Premium subscription' : (
                            section.id === 'shortlisted-colleges' ? `${section.content.colleges.length} colleges matched` :
                            `${section.content.completed}/${section.content.weeklyGoal} weekly goals`
                          )}
                        </p>
                      </div>
                    </div>
                    {!isLocked && (isExpanded ? <ChevronUpIcon size={20} /> : <ChevronDownIcon size={20} />)}
                  </button>
                  
                  {isExpanded && !isLocked && (
                    <div className="px-6 pb-6 border-t border-gray-100">
                      {section.id === 'shortlisted-colleges' && (
                        <div className="space-y-3 pt-4">
                          {section.content.colleges.map((college: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div>
                                <h5 className="font-semibold text-gray-900">{college.name}</h5>
                                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                  <span className="flex items-center gap-1">
                                    <MapPinIcon size={14} />
                                    {college.location}
                                  </span>
                                  <span>{college.fees}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-green-600">{college.match}%</div>
                                <div className="text-xs text-gray-500">Match</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {section.id === 'activity-tracker' && (
                        <div className="space-y-4 pt-4">
                          <div className="grid grid-cols-1 gap-4">
                            {section.content.activities.map((activity: any, idx: number) => (
                              <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                                <h5 className="font-semibold text-gray-900 mb-2">{activity.name}</h5>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm text-gray-600">{activity.completed}/{activity.target}</span>
                                  <span className="text-sm font-medium text-blue-600">
                                    {Math.round((activity.completed / activity.target) * 100)}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-500 h-2 rounded-full" 
                                    style={{ width: `${(activity.completed / activity.target) * 100}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Take Assessment', icon: BrainCircuitIcon, path: '/assessment', color: 'bg-blue-50', iconColor: 'text-blue-600', description: 'Practice tests' },
            { label: 'Book Consultation', icon: CalendarIcon, path: '/book-consultation', color: 'bg-green-50', iconColor: 'text-green-600', description: 'Expert guidance' },
            { label: 'Build Resume', icon: FileTextIcon, path: '/resume-builder', color: 'bg-purple-50', iconColor: 'text-purple-600', description: 'Create resume' },
            { label: 'Analyze Resume', icon: FileTextIcon, path: '/resume-upload', color: 'bg-orange-50', iconColor: 'text-orange-600', description: 'ATS optimization' },
            { label: 'Find Colleges', icon: GraduationCapIcon, path: '/colleges', color: 'bg-indigo-50', iconColor: 'text-indigo-600', description: 'Explore options' },
            { label: 'Complete Profile', icon: UserIcon, path: '/profile', color: 'bg-pink-50', iconColor: 'text-pink-600', description: 'Get recommendations' }
          ].map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors text-center group hover:shadow-sm"
              >
                <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon size={20} className={action.iconColor} />
                </div>
                <div className="text-sm font-medium text-gray-900 mb-1">{action.label}</div>
                <div className="text-xs text-gray-500">{action.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* User Preferences & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Preferences</h3>
          {dashboardData.userPreferences ? (
            <div className="space-y-3">
              {dashboardData.userPreferences.preferredLocations?.length > 0 && (
                <div className="py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600 block mb-2">Preferred Locations</span>
                  <div className="flex flex-wrap gap-2">
                    {dashboardData.userPreferences.preferredLocations.map((location: string, index: number) => (
                      <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                        {location}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {dashboardData.userPreferences.programInterests?.length > 0 && (
                <div className="py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600 block mb-2">Program Interests</span>
                  <div className="flex flex-wrap gap-2">
                    {dashboardData.userPreferences.programInterests.map((program: string, index: number) => (
                      <span key={index} className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        {program}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {(dashboardData.userPreferences.budgetMin || dashboardData.userPreferences.budgetMax) && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Budget Range</span>
                  <span className="text-sm font-medium text-gray-900">
                    ₹{dashboardData.userPreferences.budgetMin ? dashboardData.userPreferences.budgetMin.toLocaleString() : '0'} - 
                    ₹{dashboardData.userPreferences.budgetMax ? dashboardData.userPreferences.budgetMax.toLocaleString() : 'No limit'}
                  </span>
                </div>
              )}
              {(!dashboardData.userPreferences.preferredLocations?.length && 
                !dashboardData.userPreferences.programInterests?.length && 
                !dashboardData.userPreferences.budgetMin && 
                !dashboardData.userPreferences.budgetMax) && (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-4">No preferences data found</p>
                  <Button onClick={() => navigate('/profile')} size="sm">Set Preferences</Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <UserIcon size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No preferences set yet</p>
              <Button onClick={() => navigate('/profile')} size="sm">Set Preferences</Button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
          {dashboardData.notifications.length > 0 ? (
            <div className="space-y-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {dashboardData.notifications.map((notification) => {
                const getIcon = () => {
                  switch (notification.type) {
                    case 'success': return <CheckCircleIcon size={16} className="text-green-600" />;
                    case 'warning': return <AlertCircleIcon size={16} className="text-yellow-600" />;
                    case 'error': return <XCircleIcon size={16} className="text-red-600" />;
                    default: return <BellIcon size={16} className="text-blue-600" />;
                  }
                };
                return (
                  <div key={notification.id} className="flex items-start gap-3">
                    <div className="mt-0.5">{getIcon()}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <BellIcon size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No notifications yet</p>
              <p className="text-sm text-gray-500">Your activity updates will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InteractiveBarChart data={monthlyData} title="Monthly Consultations (Last 6 Months)" />
        <InteractiveLineChart data={weeklyData} title="Profile Completion" />
      </div>
    </div>
  );

  if (dashboardData.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 via-orange-50/30 to-brand-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Helmet>
        <title>{seoConfig.dashboard.title}</title>
        <meta name="description" content={seoConfig.dashboard.description} />
        <meta name="keywords" content={seoConfig.dashboard.keywords} />
        <link rel="canonical" href={seoConfig.dashboard.canonical} />
      </Helmet>
      
      <Header />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="py-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex-1">
                  <div className="bg-white/20 backdrop-blur-md border border-gray-200 shadow-lg text-blue-700 px-4 py-2 rounded-lg inline-flex items-center gap-2 mb-4 pointer-events-none">
                    <GraduationCapIcon size={20} />
                    <span className="font-semibold">Student Dashboard</span>
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">
                    Welcome back, <span className="text-blue-600">{user?.fullName || 'Student'}<span className="text-blue-600">!</span></span> 👋
                  </h1>
                  <p className="text-gray-600 text-lg mb-4">
                    Continue your journey to academic excellence. Track your progress and take the next step.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <div className="bg-green-50 text-green-700 rounded-full px-4 py-2 text-sm font-medium">
                      ⭐ {Math.round(dashboardData.profileCompletion)}% Profile Complete
                    </div>
                  </div>
                </div>
                <div className="flex flex-row gap-3">
                  <Button 
                    onClick={() => navigate('/profile')} 
                    className="bg-blue-50 border-2 border-blue-200 text-blue-700 hover:bg-blue-100 font-semibold px-6 py-3 rounded-xl"
                  >
                    <UserIcon size={20} className="mr-2" />
                    Complete Profile
                  </Button>
                  <Button 
                    onClick={() => navigate('/book-consultation')} 
                    className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl"
                  >
                    <PhoneIcon size={20} className="mr-2" />
                    Book Expert Call
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-4 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center gap-2 py-4 px-3 border-b-2 font-medium text-sm whitespace-nowrap flex-shrink-0 ${
                        activeTab === item.id
                          ? 'border-brand-500 text-brand-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon size={16} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </div>
      </div>
      
      {/* AI Analysis Modal */}
      {showAIAnalysisModal && selectedAssessment && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAIAnalysisModal(false)}
          style={{ overflow: 'hidden' }}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <h2 className="text-2xl font-bold text-gray-900">🤖 AI Analysis - {selectedAssessment.type}</h2>
              <button
                onClick={() => setShowAIAnalysisModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6 overflow-y-auto flex-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#FF6B4A #f1f1f1' }}>
              {/* New Analytics Charts */}
              {selectedAssessment.chartData ? (
                <div className="grid md:grid-cols-3 gap-6">
                  <ScoreDistributionChart data={selectedAssessment.chartData.scoreDistribution} />
                  <DifficultyAccuracyChart data={selectedAssessment.chartData.difficultyAccuracy} />
                  <TopicAccuracyChart data={selectedAssessment.chartData.topicAccuracy} />
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  <ScoreDistributionChart data={{
                    correct: selectedAssessment.correctAnswers || 0,
                    incorrect: (selectedAssessment.totalQuestions || 0) - (selectedAssessment.correctAnswers || 0),
                    unattempted: 0
                  }} />
                  <DifficultyAccuracyChart data={{
                    easy: 75,
                    medium: 60,
                    hard: 45
                  }} />
                  <TopicAccuracyChart data={[
                    { topic: 'Mathematics', accuracyPercent: selectedAssessment.score || 50 },
                    { topic: 'Physics', accuracyPercent: (selectedAssessment.score || 50) - 10 },
                    { topic: 'Chemistry', accuracyPercent: (selectedAssessment.score || 50) + 5 }
                  ]} />
                </div>
              )}

              {/* Tentative Exam Score */}
              {selectedAssessment.tentativeExamScore ? (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <span className="text-white text-xl">📊</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-blue-900">Tentative Actual Exam Score</h3>
                      <p className="text-sm text-blue-700">{selectedAssessment.tentativeExamScore.examName} Estimation</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 border border-blue-200">
                    <div className="text-center mb-4">
                      <div className="text-4xl font-black text-blue-600 mb-2">
                        {selectedAssessment.tentativeExamScore.estimatedScoreRange}
                      </div>
                      <div className="text-sm text-blue-500 font-medium">
                        Confidence Level: {selectedAssessment.tentativeExamScore.confidenceLevel}
                      </div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-xs text-yellow-800 text-center font-medium">
                        ⚠️ {selectedAssessment.tentativeExamScore.note}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <span className="text-white text-xl">📊</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-blue-900">Tentative Actual Exam Score</h3>
                      <p className="text-sm text-blue-700">{selectedAssessment.type} Estimation</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 border border-blue-200">
                    <div className="text-center mb-4">
                      <div className="text-4xl font-black text-blue-600 mb-2">
                        {Math.max(0, (selectedAssessment.score || 0) - 15)}-{Math.min(100, (selectedAssessment.score || 0) + 10)}%
                      </div>
                      <div className="text-sm text-blue-500 font-medium">
                        Confidence Level: {(selectedAssessment.score || 0) > 70 ? 'High' : (selectedAssessment.score || 0) > 50 ? 'Medium' : 'Low'}
                      </div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-xs text-yellow-800 text-center font-medium">
                        ⚠️ This is an indicative estimate, not an official score.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Summary */}
              {selectedAssessment.overview ? (
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#FF6B4A]/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <BrainCircuitIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-[#6B3410]">Performance Summary</h3>
                      <p className="text-sm text-[#8B4513]">Quick insights</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <p className="text-[#6B3410] leading-relaxed">{selectedAssessment.overview.summary}</p>
                  </div>
                </div>
              ) : selectedAssessment.overallAnalysis && (
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#FF6B4A]/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <BrainCircuitIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-[#6B3410]">AI-Powered Analysis</h3>
                      <p className="text-sm text-[#8B4513]">Comprehensive performance insights</p>
                    </div>
                  </div>
                  <div className="prose max-w-none">
                    <p className="text-[#6B3410] leading-relaxed whitespace-pre-line">{selectedAssessment.overallAnalysis}</p>
                  </div>
                </div>
              )}
              
              {/* Strengths & Weaknesses */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#FF6B4A]/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <TrendingUpIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-[#6B3410]">Your Strengths</h3>
                      <p className="text-xs text-[#8B4513]">Areas where you excel</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {selectedAssessment.strengths && selectedAssessment.strengths.length > 0 ? (
                      selectedAssessment.strengths.map((strength: string, index: number) => (
                        <div key={index} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                          <span className="text-green-600 text-lg">✅</span>
                          <div className="flex-1">
                            <p className="text-green-800 font-semibold text-sm">{strength}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <p className="text-2xl mb-2">🎯</p>
                        <p className="font-semibold text-sm">Complete more questions to identify strengths</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#FF6B4A]/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B4A] to-[#E85D3F] rounded-xl flex items-center justify-center">
                      <TargetIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-[#6B3410]">Areas for Improvement</h3>
                      <p className="text-xs text-[#8B4513]">Focus areas</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {selectedAssessment.weaknesses && selectedAssessment.weaknesses.length > 0 ? (
                      selectedAssessment.weaknesses.map((weakness: string, index: number) => (
                        <div key={index} className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <span className="text-orange-600 text-lg">🎯</span>
                          <div className="flex-1">
                            <p className="text-orange-800 font-semibold text-sm">{weakness}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <p className="text-2xl mb-2">💪</p>
                        <p className="font-semibold text-sm">Great job! No major weaknesses identified</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Recommendations */}
              {selectedAssessment.recommendations?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#FF6B4A]/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <BookOpenIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-[#6B3410]">Personalized Recommendations</h3>
                      <p className="text-xs text-[#8B4513]">Next steps to improve</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {selectedAssessment.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <span className="text-blue-600 font-bold mt-1 text-sm">•</span>
                        <span className="text-blue-800 text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Next Action Plan */}
              {selectedAssessment.nextActionPlan ? (
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#FF6B4A]/10">
                  <h3 className="text-xl font-black text-[#6B3410] mb-6">Next Action Plan</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                        <span>🎯</span> Focus Areas
                      </h4>
                      <ul className="space-y-2">
                        {selectedAssessment.nextActionPlan.focusAreas?.map((area: string, index: number) => (
                          <li key={index} className="text-sm text-gray-700 bg-green-50 p-2 rounded border-l-4 border-green-500">
                            {area}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-700 mb-3 flex items-center gap-2">
                        <span>📚</span> Practice Strategy
                      </h4>
                      <ul className="space-y-2">
                        {selectedAssessment.nextActionPlan.practiceStrategy?.map((strategy: string, index: number) => (
                          <li key={index} className="text-sm text-gray-700 bg-blue-50 p-2 rounded border-l-4 border-blue-500">
                            {strategy}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                        <span>⚠️</span> Avoid
                      </h4>
                      <ul className="space-y-2">
                        {selectedAssessment.nextActionPlan.avoid?.map((item: string, index: number) => (
                          <li key={index} className="text-sm text-gray-700 bg-red-50 p-2 rounded border-l-4 border-red-500">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#FF6B4A]/10">
                  <h3 className="text-xl font-black text-[#6B3410] mb-6">Next Action Plan</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                        <span>🎯</span> Focus Areas
                      </h4>
                      <ul className="space-y-2">
                        {selectedAssessment.weaknesses?.slice(0, 2).map((weakness: string, index: number) => (
                          <li key={index} className="text-sm text-gray-700 bg-green-50 p-2 rounded border-l-4 border-green-500">
                            Improve {weakness.toLowerCase()}
                          </li>
                        )) || [
                          <li key="default1" className="text-sm text-gray-700 bg-green-50 p-2 rounded border-l-4 border-green-500">Practice weak topics daily</li>,
                          <li key="default2" className="text-sm text-gray-700 bg-green-50 p-2 rounded border-l-4 border-green-500">Focus on accuracy improvement</li>
                        ]}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-700 mb-3 flex items-center gap-2">
                        <span>📚</span> Practice Strategy
                      </h4>
                      <ul className="space-y-2">
                        <li className="text-sm text-gray-700 bg-blue-50 p-2 rounded border-l-4 border-blue-500">Solve 20 questions daily</li>
                        <li className="text-sm text-gray-700 bg-blue-50 p-2 rounded border-l-4 border-blue-500">Take weekly mock tests</li>
                        <li className="text-sm text-gray-700 bg-blue-50 p-2 rounded border-l-4 border-blue-500">Review incorrect answers</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                        <span>⚠️</span> Avoid
                      </h4>
                      <ul className="space-y-2">
                        <li className="text-sm text-gray-700 bg-red-50 p-2 rounded border-l-4 border-red-500">Rushing through questions</li>
                        <li className="text-sm text-gray-700 bg-red-50 p-2 rounded border-l-4 border-red-500">Skipping concept revision</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Dashboard;