import React, { useState, useEffect } from 'react'
import { ChevronDownIcon, ChevronUpIcon, X, SparklesIcon, Loader2, GraduationCap, MapPin, Calendar, Award, Plus, Lightbulb } from 'lucide-react'
import { useResumeFormNav } from './ResumeForm'
import { useResume } from '../context/ResumeContext'
import { aiSummaryService } from '../services/aiSummaryService'
import RichTextEditor from '../components/RichTextEditor'
import { FormPageLayout, GlassCard, AIButton, FormNavigation } from '../components/resume/FormPageLayout'

const months = [
  'Month', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const years = ['Year', ...Array.from({ length: 30 }, (_, i) => String(2024 - i))]

export function EducationPage() {
  const { handleNext, handleBack, navigateTo } = useResumeFormNav()
  const { resumeData, updateEducation } = useResume()
  const [educationEntries, setEducationEntries] = useState(() => {
    if (resumeData.education.length > 0) {
      return resumeData.education
    }
    return [{
      id: `edu-${Date.now()}`,
      schoolName: '',
      schoolLocation: '',
      degree: '',
      fieldOfStudy: '',
      startMonth: 'Month',
      startYear: 'Year',
      gradMonth: 'Month',
      gradYear: 'Year',
      gpa: '',
      stillEnrolled: false,
      achievements: [],
      activities: '',
      editorContent: ''
    }]
  })
  const [detailsExpanded, setDetailsExpanded] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (resumeData.education.length > 0 && !isInitialized) {
      setEducationEntries(resumeData.education)
      setIsInitialized(true)
    }
  }, [resumeData.education, isInitialized])

  useEffect(() => {
    updateEducation(educationEntries)
  }, [educationEntries, updateEducation])

  const addEducationEntry = () => {
    setEducationEntries([...educationEntries, {
      id: `edu-${Date.now()}`,
      schoolName: '',
      schoolLocation: '',
      degree: '',
      fieldOfStudy: '',
      startMonth: 'Month',
      startYear: 'Year',
      gradMonth: 'Month',
      gradYear: 'Year',
      gpa: '',
      stillEnrolled: false,
      achievements: [],
      activities: '',
      editorContent: ''
    }])
  }

  const deleteEducationEntry = (index: number) => {
    if (educationEntries.length > 1) {
      setEducationEntries(educationEntries.filter((_, i) => i !== index))
    }
  }

  const updateEducationEntry = (index: number, field: string, value: any) => {
    const updated = [...educationEntries]
    updated[index] = { ...updated[index], [field]: value }
    setEducationEntries(updated)
  }

  const handleEnhanceEducation = async () => {
    const entry = educationEntries[0]
    if (!entry.schoolName || !entry.degree) return
    setIsEnhancing(true)
    try {
      const response = await aiSummaryService.generateEducationSuggestions({
        institution: entry.schoolName,
        degree: entry.degree,
        fieldOfStudy: entry.fieldOfStudy,
        gpa: entry.gpa
      })
      setSuggestions(response.suggestions || [])
      setDetailsExpanded(true)
    } catch (error) {
      console.error('Failed to get suggestions:', error)
    } finally {
      setIsEnhancing(false)
    }
  }

  const addSuggestionToEditor = (suggestion: string) => {
    const currentContent = educationEntries[0]?.editorContent || ''
    const newContent = currentContent ? `${currentContent}\n• ${suggestion}` : `• ${suggestion}`
    updateEducationEntry(0, 'editorContent', newContent)
    setSuggestions(suggestions.filter(s => s !== suggestion))
  }

  const inputClasses = `w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl
    text-slate-900 placeholder-slate-400 outline-none
    focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white
    transition-all duration-200`

  const selectClasses = `w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl
    text-slate-900 outline-none cursor-pointer appearance-none
    focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`

  return (
    <FormPageLayout
      currentStep={4}
      totalSteps={7}
      stepName="Education"
      title="Your Education"
      subtitle="Add your educational background to showcase your academic achievements."
      onNavigate={navigateTo}
    >
      <div className="max-w-4xl mx-auto">
        {/* Education Entries */}
        {educationEntries.map((entry, index) => (
          <GlassCard key={index} className="p-6 md:p-8 mb-6 relative" hover={false}>
            {index > 0 && (
              <button
                onClick={() => deleteEducationEntry(index)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {index === 0 ? 'Highest Degree' : `Education ${index + 1}`}
                </h3>
                <p className="text-slate-500 text-sm">
                  {index === 0 ? 'Start with your highest qualification' : 'Additional education'}
                </p>
              </div>
            </div>

            {/* Institution & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-500" />
                  Institution <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={entry.schoolName}
                  onChange={(e) => updateEducationEntry(index, 'schoolName', e.target.value)}
                  placeholder="e.g., Stanford University"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  Location
                </label>
                <input
                  type="text"
                  value={entry.schoolLocation}
                  onChange={(e) => updateEducationEntry(index, 'schoolLocation', e.target.value)}
                  placeholder="e.g., Stanford, CA"
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Degree & Field of Study */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Degree <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={entry.degree}
                  onChange={(e) => updateEducationEntry(index, 'degree', e.target.value)}
                  placeholder="e.g., Bachelor of Science"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Field of Study
                </label>
                <input
                  type="text"
                  value={entry.fieldOfStudy}
                  onChange={(e) => updateEducationEntry(index, 'fieldOfStudy', e.target.value)}
                  placeholder="e.g., Computer Science"
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Dates & GPA */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  Start Date
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select
                      value={entry.startMonth}
                      onChange={(e) => updateEducationEntry(index, 'startMonth', e.target.value)}
                      className={selectClasses}
                    >
                      {months.map((m) => (<option key={m} value={m}>{m}</option>))}
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                  <div className="relative flex-1">
                    <select
                      value={entry.startYear}
                      onChange={(e) => updateEducationEntry(index, 'startYear', e.target.value)}
                      className={selectClasses}
                    >
                      {years.map((y) => (<option key={y} value={y}>{y}</option>))}
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Graduation Date
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select
                      value={entry.gradMonth}
                      onChange={(e) => updateEducationEntry(index, 'gradMonth', e.target.value)}
                      disabled={entry.stillEnrolled}
                      className={`${selectClasses} ${entry.stillEnrolled ? 'opacity-50' : ''}`}
                    >
                      {months.map((m) => (<option key={m} value={m}>{m}</option>))}
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                  <div className="relative flex-1">
                    <select
                      value={entry.gradYear}
                      onChange={(e) => updateEducationEntry(index, 'gradYear', e.target.value)}
                      disabled={entry.stillEnrolled}
                      className={`${selectClasses} ${entry.stillEnrolled ? 'opacity-50' : ''}`}
                    >
                      {years.map((y) => (<option key={y} value={y}>{y}</option>))}
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={entry.stillEnrolled}
                    onChange={(e) => updateEducationEntry(index, 'stillEnrolled', e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 accent-blue-600"
                  />
                  <span className="text-sm text-slate-600">Still enrolled</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-500" />
                  GPA (optional)
                </label>
                <input
                  type="text"
                  value={entry.gpa}
                  onChange={(e) => updateEducationEntry(index, 'gpa', e.target.value)}
                  placeholder="e.g., 3.8/4.0"
                  className={inputClasses}
                />
              </div>
            </div>

            {/* AI Enhancement Button */}
            {index === 0 && (
              <div className="flex justify-end mb-4">
                <AIButton
                  onClick={handleEnhanceEducation}
                  isLoading={isEnhancing}
                  disabled={!entry.schoolName || !entry.degree}
                >
                  {isEnhancing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <SparklesIcon className="w-4 h-4" />
                  )}
                  {isEnhancing ? 'Thinking...' : 'Get AI Suggestions'}
                </AIButton>
              </div>
            )}
          </GlassCard>
        ))}

        {/* Achievements Section */}
        <GlassCard className="mb-6" hover={false}>
          <button
            onClick={() => setDetailsExpanded(!detailsExpanded)}
            className="w-full flex items-center justify-between p-5 text-left"
          >
            <span className="font-semibold text-slate-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Add Achievements & Activities (Optional)
            </span>
            {detailsExpanded ? (
              <ChevronUpIcon className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-slate-400" />
            )}
          </button>
          {detailsExpanded && (
            <div className="px-5 pb-5 border-t border-slate-100 pt-5">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div className="w-full lg:w-64 flex-shrink-0">
                    <p className="text-sm text-slate-500 mb-3">AI Suggestions (click to add):</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => addSuggestionToEditor(suggestion)}
                          className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm
                            hover:bg-blue-100 transition-colors text-left"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {/* Editor */}
                <div className="flex-1 min-h-[200px] bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                  <RichTextEditor
                    value={educationEntries[0]?.editorContent || ''}
                    onChange={(content) => updateEducationEntry(0, 'editorContent', content)}
                    placeholder="• Dean's List, 3 semesters&#10;• President of Computer Science Club&#10;• Published research paper on machine learning"
                  />
                </div>
              </div>
            </div>
          )}
        </GlassCard>

        {/* Add Another Button */}
        <div className="mb-6">
          <button
            onClick={addEducationEntry}
            className="flex items-center gap-2 px-6 py-3 text-blue-600 border border-blue-200 
              rounded-xl font-medium hover:bg-blue-50 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Another Education
          </button>
        </div>

        <FormNavigation onBack={handleBack} onNext={handleNext} />
      </div>
    </FormPageLayout>
  )
}