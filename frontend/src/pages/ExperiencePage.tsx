import React, { useState, useEffect } from 'react'
import { ChevronDownIcon, X, SparklesIcon, Loader2, Briefcase, MapPin, Calendar, Plus, Lightbulb } from 'lucide-react'
import { useResumeFormNav } from './ResumeForm'
import { useResume } from '../context/ResumeContext'
import { aiSummaryService } from '../services/aiSummaryService'
import { FormPageLayout, GlassCard, AIButton, FormNavigation } from '../components/resume/FormPageLayout'

const months = [
  'Month', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const years = ['Year', ...Array.from({ length: 30 }, (_, i) => String(2024 - i))]

export function ExperiencePage() {
  const { handleNext, handleBack, navigateTo } = useResumeFormNav()
  const { resumeData, updateExperience } = useResume()
  const [experienceEntries, setExperienceEntries] = useState([{
    id: `exp-${Date.now()}`,
    jobTitle: '',
    employer: '',
    city: '',
    country: '',
    startMonth: 'Month',
    startYear: 'Year',
    endMonth: 'Month',
    endYear: 'Year',
    currentlyWorkHere: false,
    description: ''
  }])

  const [isInitialized, setIsInitialized] = useState(false)
  const [generatingIndex, setGeneratingIndex] = useState<number | null>(null)

  useEffect(() => {
    if (resumeData.experience.length > 0 && !isInitialized) {
      setExperienceEntries(resumeData.experience)
      setIsInitialized(true)
    }
  }, [resumeData.experience, isInitialized])

  useEffect(() => {
    updateExperience(experienceEntries)
  }, [experienceEntries, updateExperience])

  const addExperienceEntry = () => {
    setExperienceEntries([...experienceEntries, {
      id: `exp-${Date.now()}`,
      jobTitle: '',
      employer: '',
      city: '',
      country: '',
      startMonth: 'Month',
      startYear: 'Year',
      endMonth: 'Month',
      endYear: 'Year',
      currentlyWorkHere: false,
      description: ''
    }])
  }

  const deleteExperienceEntry = (index: number) => {
    if (experienceEntries.length > 1) {
      setExperienceEntries(experienceEntries.filter((_, i) => i !== index))
    }
  }

  const updateExperienceEntry = (index: number, field: string, value: any) => {
    const updated = [...experienceEntries]
    updated[index] = { ...updated[index], [field]: value }
    setExperienceEntries(updated)
  }

  const handleGenerateExperience = async (index: number) => {
    const entry = experienceEntries[index]
    const targetJobTitle = resumeData.summary?.jobTitle
    const targetJobDescription = resumeData.summary?.jobDescription

    if (!entry.jobTitle.trim() || !entry.employer.trim()) {
      alert('Please fill in the job title and employer first')
      return
    }

    if (!targetJobTitle) {
      alert('Please complete the summary section first to provide job context for AI generation')
      return
    }

    setGeneratingIndex(index)
    try {
      const response = await aiSummaryService.generateExperience({
        jobTitle: entry.jobTitle,
        employer: entry.employer,
        startMonth: entry.startMonth,
        startYear: entry.startYear,
        endMonth: entry.endMonth,
        endYear: entry.endYear,
        currentlyWorkHere: entry.currentlyWorkHere,
        existingDescription: entry.description
      }, targetJobTitle, targetJobDescription)

      const newDescription = entry.description
        ? `${entry.description}\n${response.experienceDescription}`
        : response.experienceDescription

      updateExperienceEntry(index, 'description', newDescription)
    } catch (error) {
      console.error('Failed to generate experience:', error)
      alert('Failed to generate experience description. Please try again.')
    } finally {
      setGeneratingIndex(null)
    }
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
      currentStep={5}
      totalSteps={7}
      stepName="Experience"
      title="Your Work Experience"
      subtitle="Highlight your professional journey with impactful descriptions."
      onNavigate={navigateTo}
    >
      <div className="max-w-4xl mx-auto">

        {/* Experience Entries */}
        {experienceEntries.map((entry, index) => (
          <GlassCard key={index} className="p-6 md:p-8 mb-6 relative" hover={false}>
            {index > 0 && (
              <button
                onClick={() => deleteExperienceEntry(index)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {index === 0 ? 'Most Recent Experience' : `Experience ${index + 1}`}
                </h3>
                <p className="text-slate-500 text-sm">
                  {index === 0 ? 'Start with your current or most recent position' : 'Add previous work experience'}
                </p>
              </div>
            </div>

            {/* Job Title & Employer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-500" />
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={entry.jobTitle}
                  onChange={(e) => updateExperienceEntry(index, 'jobTitle', e.target.value)}
                  placeholder="e.g., Software Engineer"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Employer <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={entry.employer}
                  onChange={(e) => updateExperienceEntry(index, 'employer', e.target.value)}
                  placeholder="e.g., Google"
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  City
                </label>
                <input
                  type="text"
                  value={entry.city}
                  onChange={(e) => updateExperienceEntry(index, 'city', e.target.value)}
                  placeholder="e.g., San Francisco"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={entry.country}
                  onChange={(e) => updateExperienceEntry(index, 'country', e.target.value)}
                  placeholder="e.g., USA"
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  Start Date
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <select
                      value={entry.startMonth}
                      onChange={(e) => updateExperienceEntry(index, 'startMonth', e.target.value)}
                      className={selectClasses}
                    >
                      {months.map((m) => (<option key={m} value={m}>{m}</option>))}
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                  <div className="relative flex-1">
                    <select
                      value={entry.startYear}
                      onChange={(e) => updateExperienceEntry(index, 'startYear', e.target.value)}
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
                  End Date
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <select
                      value={entry.endMonth}
                      onChange={(e) => updateExperienceEntry(index, 'endMonth', e.target.value)}
                      disabled={entry.currentlyWorkHere}
                      className={`${selectClasses} ${entry.currentlyWorkHere ? 'opacity-50' : ''}`}
                    >
                      {months.map((m) => (<option key={m} value={m}>{m}</option>))}
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                  <div className="relative flex-1">
                    <select
                      value={entry.endYear}
                      onChange={(e) => updateExperienceEntry(index, 'endYear', e.target.value)}
                      disabled={entry.currentlyWorkHere}
                      className={`${selectClasses} ${entry.currentlyWorkHere ? 'opacity-50' : ''}`}
                    >
                      {years.map((y) => (<option key={y} value={y}>{y}</option>))}
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <label className="flex items-center gap-2 mt-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={entry.currentlyWorkHere}
                    onChange={(e) => updateExperienceEntry(index, 'currentlyWorkHere', e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 accent-blue-600"
                  />
                  <span className="text-sm text-slate-600">I currently work here</span>
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="pt-5 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <SparklesIcon className="w-4 h-4 text-blue-500" />
                  Description & Achievements
                </label>
                <AIButton
                  onClick={() => handleGenerateExperience(index)}
                  isLoading={generatingIndex === index}
                  disabled={!entry.jobTitle.trim() || !entry.employer.trim()}
                  className="!py-2 !px-4 text-sm"
                >
                  {generatingIndex === index ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <SparklesIcon className="w-4 h-4" />
                  )}
                  {generatingIndex === index ? 'Generating...' : 'Generate with AI'}
                </AIButton>
              </div>
              <textarea
                value={entry.description}
                onChange={(e) => updateExperienceEntry(index, 'description', e.target.value)}
                placeholder="Describe your responsibilities, achievements, and key contributions...&#10;• Led a team of 5 engineers to deliver a project 2 weeks ahead of schedule&#10;• Increased system performance by 40% through optimization"
                rows={5}
                className={`${inputClasses} resize-none`}
              />
            </div>
          </GlassCard>
        ))}

        {/* Add Another Button */}
        <div className="mb-6">
          <button
            onClick={addExperienceEntry}
            className="flex items-center gap-2 px-6 py-3 text-blue-600 border border-blue-200 
              rounded-xl font-medium hover:bg-blue-50 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Another Experience
          </button>
        </div>

        {/* Pro Tip */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 mb-6">
          <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            <span className="font-semibold">Pro Tip:</span> Use the STAR method (Situation, Task, Action, Result)
            to describe your achievements. Include quantifiable metrics like "increased sales by 25%".
          </p>
        </div>

        <FormNavigation onBack={handleBack} onNext={handleNext} />
      </div>
    </FormPageLayout>
  )
}