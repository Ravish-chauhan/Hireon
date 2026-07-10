import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ResumeProvider, useResume } from '../context/ResumeContext'
import { ProgressSidebar } from '../components/ProgressSidebar'
import { BioPage } from './BioPage'
import { SummaryPage } from './SummaryPage'
import { SkillsPage } from './SkillsPage'
import { EducationPage } from './EducationPage'
import { ExperiencePage } from './ExperiencePage'
import { ProjectPage } from './ProjectPage'
import { OptionalDetailsPage } from './OptionalDetailsPage'
import { FinalDraftPage } from './FinalDraftPage'
import { Header } from '../components/layout/Header'

import { Eye, X } from 'lucide-react'
import { ResumePreviewLarge } from '../components/ResumePreviewLarge'

const ResumeFormContext = React.createContext<{
  handleNext: () => void
  handleBack: () => void
  navigateTo: (pageId: string) => void
}>({ handleNext: () => { }, handleBack: () => { }, navigateTo: () => { } })

export const useResumeFormNav = () => React.useContext(ResumeFormContext)

function ResumeFormContent() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { setSelectedTemplate } = useResume()
  const [currentPage, setCurrentPage] = useState('bio')
  const [showMobilePreview, setShowMobilePreview] = useState(false)

  useEffect(() => {
    const templateId = searchParams.get('template')
    if (templateId) {
      setSelectedTemplate(templateId)
    }
  }, [searchParams, setSelectedTemplate])

  const pageOrder = ['bio', 'summary', 'skills', 'education', 'experience', 'projects', 'optional']
  const currentIndex = pageOrder.indexOf(currentPage)

  const sections = [
    { id: 'bio', label: 'Bio', completed: currentIndex > 0, color: 'from-blue-500 to-cyan-500' },
    { id: 'summary', label: 'Summary', completed: currentIndex > 1, color: 'from-purple-500 to-pink-500' },
    { id: 'skills', label: 'Skills', completed: currentIndex > 2, color: 'from-green-500 to-teal-500' },
    { id: 'education', label: 'Education', completed: currentIndex > 3, color: 'from-orange-500 to-red-500' },
    { id: 'experience', label: 'Experience', completed: currentIndex > 4, color: 'from-indigo-500 to-purple-500' },
    { id: 'projects', label: 'Projects', completed: currentIndex > 5, color: 'from-pink-500 to-rose-500' },
    { id: 'optional', label: 'Optional', completed: currentIndex > 6, color: 'from-yellow-500 to-orange-500' },
  ]

  const handleNext = () => {
    if (currentIndex < pageOrder.length - 1) {
      setCurrentPage(pageOrder[currentIndex + 1])
    } else {
      setCurrentPage('final')
    }
  }

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentPage(pageOrder[currentIndex - 1])
    } else {
      // On the first page, go back to resume builder
      navigate('/resume-builder')
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'bio':
        return <BioPage />
      case 'summary':
        return <SummaryPage />
      case 'skills':
        return <SkillsPage />
      case 'education':
        return <EducationPage />
      case 'experience':
        return <ExperiencePage />
      case 'projects':
        return <ProjectPage />
      case 'optional':
        return <OptionalDetailsPage />
      case 'final':
        return <FinalDraftPage onNavigate={setCurrentPage} />
      default:
        return <BioPage />
    }
  }

  if (currentPage === 'final') {
    return <FinalDraftPage onNavigate={setCurrentPage} />
  }

  return (
    <ResumeFormContext.Provider value={{ handleNext, handleBack, navigateTo: setCurrentPage }}>
      <div className="flex flex-col min-h-screen bg-white">
        {currentPage !== 'final' && (
          <div className="md:hidden">
            <Header />
          </div>
        )}
        <div className={`flex flex-col md:flex-row flex-1 ${currentPage !== 'final' ? 'pt-[72px] md:pt-0' : ''}`}>
          {currentPage !== 'final' && (
            <ProgressSidebar currentPage={currentPage} sections={sections} onNavigate={setCurrentPage} />
          )}
          <div className="flex-1 overflow-x-hidden">
            {renderPage()}
          </div>

          {/* Desktop Preview Panel - Right Side */}
          {currentPage !== 'final' && (
            <div className="hidden md:flex md:w-[400px] lg:w-[450px] xl:w-[500px] bg-[#F8FAFC] border-l border-gray-200 flex-col">
              <div className="p-4 border-b bg-white">
                <h3 className="font-bold text-lg text-[#191A15]">Live Preview</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="flex items-center justify-center">
                  <div className="w-full origin-top scale-[0.6] lg:scale-[0.7] xl:scale-[0.8]">
                    <ResumePreviewLarge />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Floating Preview Button for Mobile - Hidden on Final Draft */}
          {currentPage !== 'final' && (
            <button
              onClick={() => setShowMobilePreview(true)}
              className="md:hidden fixed right-0 top-1/2 -translate-y-1/2 z-50 w-12 h-20 bg-[#0F0C89] text-white rounded-l-2xl shadow-2xl flex items-center justify-center hover:bg-blue-800 transition-all active:scale-95 border-y border-l border-white/20"
              title="Live Preview"
            >
              <Eye className="w-6 h-6" />
            </button>
          )}

          {/* Mobile Preview Modal */}
          {showMobilePreview && (
            <div className="md:hidden fixed inset-0 z-[60] bg-white overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-between p-4 border-b bg-white">
                <h3 className="font-bold text-lg text-[#191A15]">Live Preview</h3>
                <button
                  onClick={() => setShowMobilePreview(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  aria-label="Close preview"
                >
                  <X className="w-6 h-6 text-[#191A15]" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto bg-[#F8FAFC] pb-20">
                <div className="p-4 flex items-center justify-center min-h-full">
                  <div className="w-full max-w-full origin-top scale-[0.8] sm:scale-[0.9] my-10">
                    <ResumePreviewLarge />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ResumeFormContext.Provider>
  )
}

function ResumeForm() {
  return (
    <ResumeProvider>
      <ResumeFormContent />
    </ResumeProvider>
  )
}

export default ResumeForm