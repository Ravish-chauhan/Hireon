import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loader from '../components/common/Loader';

const HomePage = lazy(() => import('../pages/HomePage'));
const ResumeBuilder = lazy(() => import('../pages/ResumeBuilder'));
const ResumeCollection = lazy(() => import('../pages/ResumeCollection'));
const ResumeEditor = lazy(() => import('../pages/ResumeEditor'));
const ResumeForm = lazy(() => import('../pages/ResumeForm'));
const TemplatePreview = lazy(() => import('../pages/TemplatePreview'));

const ResumeUpload = lazy(() => import('../pages/ResumeUpload'));
const ResumeAnalysis = lazy(() => import('../pages/ResumeAnalysis'));
const ResumeHistory = lazy(() => import('../pages/ResumeHistory'));

const JobPlatform = lazy(() => import('../pages/JobPlatform'));

const InterviewSetup = lazy(() => import('../pages/ai-interview/InterviewSetup'));
const InterviewSession = lazy(() => import('../pages/ai-interview/InterviewSession'));
const InterviewReport = lazy(() => import('../pages/ai-interview/InterviewReport'));

const DSAInterviewSetup = lazy(() => import('../pages/dsa-interview/DSAInterviewSetup'));
const DSAInterviewSession = lazy(() => import('../pages/dsa-interview/DSAInterviewSession'));

const NotFound = lazy(() => import('../pages/NotFound'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        {/* Resume Builder Routes */}
        <Route path="/resume-builder" element={<ResumeBuilder />} />
        <Route path="/resume-collection" element={<ResumeCollection />} />
        <Route path="/resume-editor/:resumeId" element={<ResumeEditor />} />
        <Route path="/resume-editor/template/:templateId" element={<ResumeEditor />} />
        <Route path="/resume-form" element={<ResumeForm />} />
        <Route path="/resume-form/template/:templateId" element={<ResumeForm />} />
        <Route path="/template-preview/:templateId" element={<TemplatePreview />} />

        {/* Resume Analyser Routes */}
        <Route path="/resume-upload" element={<ResumeUpload />} />
        <Route path="/resume-analysis/:id" element={<ResumeAnalysis />} />
        <Route path="/resume-history" element={<ResumeHistory />} />

        {/* Job Platform Routes */}
        <Route path="/jobs" element={<JobPlatform view="search" />} />
        <Route path="/jobs/:jobId" element={<JobPlatform view="job" />} />
        <Route path="/company/:companySlug" element={<JobPlatform view="company" />} />

        {/* AI Interviewer Routes */}
        <Route path="/ai-interview" element={<InterviewSetup />} />
        <Route path="/ai-interview/:id" element={<InterviewSession />} />
        <Route path="/ai-interview/:id/report" element={<InterviewReport />} />

        {/* DSA Interviewer Routes */}
        <Route path="/dsa-interview" element={<DSAInterviewSetup />} />
        <Route path="/dsa-interview/:id" element={<DSAInterviewSession />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
