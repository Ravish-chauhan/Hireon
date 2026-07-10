import React, { useState, useEffect } from 'react'
import { ChevronDownIcon, Lightbulb, X, SparklesIcon, Loader2, FolderGit2, Link2, Calendar, Plus, User } from 'lucide-react'
import { useResumeFormNav } from './ResumeForm'
import { useResume } from '../context/ResumeContext'
import { aiSummaryService } from '../services/aiSummaryService'
import { FormPageLayout, GlassCard, AIButton, FormNavigation } from '../components/resume/FormPageLayout'

const months = [
  'Month', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const years = ['Year', ...Array.from({ length: 30 }, (_, i) => String(2024 - i))]

export function ProjectPage() {
  const { handleNext, handleBack, navigateTo } = useResumeFormNav()
  const { resumeData, updateProjects } = useResume()
  const [projectEntries, setProjectEntries] = useState(() =>
    resumeData.projects.length > 0
      ? resumeData.projects.map(proj => ({
        ...proj,
        bullets: proj.description ? proj.description.split('\n').filter(line => line.trim()) : []
      }))
      : [{
        id: `proj-${Date.now()}`,
        projectName: '',
        projectRole: '',
        projectLink: '',
        startMonth: 'Month',
        startYear: 'Year',
        endMonth: 'Month',
        endYear: 'Year',
        currentProject: false,
        description: '',
        bullets: []
      }]
  )

  const [isInitialized, setIsInitialized] = useState(false)
  const [generatingIndex, setGeneratingIndex] = useState<number | null>(null)

  useEffect(() => {
    if (resumeData.projects.length > 0 && !isInitialized) {
      setProjectEntries(resumeData.projects.map(proj => ({
        ...proj,
        bullets: proj.description ? proj.description.split('\n').filter(line => line.trim()) : []
      })))
      setIsInitialized(true)
    }
  }, [resumeData.projects, isInitialized])

  useEffect(() => {
    const updatedProjects = projectEntries.map(proj => ({
      ...proj,
      description: proj.bullets?.join('\n') || proj.description || ''
    }))
    updateProjects(updatedProjects)
  }, [projectEntries, updateProjects])

  const addProjectEntry = () => {
    setProjectEntries([...projectEntries, {
      id: `proj-${Date.now()}`,
      projectName: '',
      projectRole: '',
      projectLink: '',
      startMonth: 'Month',
      startYear: 'Year',
      endMonth: 'Month',
      endYear: 'Year',
      currentProject: false,
      description: '',
      bullets: []
    }])
  }

  const deleteProjectEntry = (index: number) => {
    if (projectEntries.length > 1) {
      setProjectEntries(projectEntries.filter((_, i) => i !== index))
    }
  }

  const updateProjectEntry = (index: number, field: string, value: any) => {
    const updated = [...projectEntries]
    updated[index] = { ...updated[index], [field]: value }
    setProjectEntries(updated)
  }

  const handleGenerateProject = async (index: number) => {
    const entry = projectEntries[index]
    const targetJobTitle = resumeData.summary?.jobTitle
    const targetJobDescription = resumeData.summary?.jobDescription

    if (!entry.projectName.trim() || !entry.projectRole.trim()) {
      alert('Please fill in the project name and your role first')
      return
    }

    if (!targetJobTitle) {
      alert('Please complete the summary section first to provide job context for AI generation')
      return
    }

    setGeneratingIndex(index)
    try {
      const response = await aiSummaryService.generateProject({
        projectName: entry.projectName,
        projectRole: entry.projectRole,
        projectLink: entry.projectLink,
        startMonth: entry.startMonth,
        startYear: entry.startYear,
        endMonth: entry.endMonth,
        endYear: entry.endYear,
        currentProject: entry.currentProject,
        existingDescription: entry.description
      }, targetJobTitle, targetJobDescription)

      const newDescription = entry.description
        ? `${entry.description}\n${response.projectDescription}`
        : response.projectDescription

      updateProjectEntry(index, 'description', newDescription)
    } catch (error) {
      console.error('Failed to generate project:', error)
      alert('Failed to generate project description. Please try again.')
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
      currentStep={6}
      totalSteps={7}
      stepName="Projects"
      title="Showcase Your Projects"
      subtitle="Personal and professional projects demonstrate your initiative and technical skills."
      onNavigate={navigateTo}
    >
      <div className="max-w-4xl mx-auto">

        {/* Project Entries */}
        {projectEntries.map((entry, index) => (
          <GlassCard key={index} className="p-6 md:p-8 mb-6 relative" hover={false}>
            {index > 0 && (
              <button
                onClick={() => deleteProjectEntry(index)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                <FolderGit2 className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {index === 0 ? 'Featured Project' : `Project ${index + 1}`}
                </h3>
                <p className="text-slate-500 text-sm">
                  {index === 0 ? 'Your most impressive project' : 'Additional project'}
                </p>
              </div>
            </div>

            {/* Project Name & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-blue-500" />
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={entry.projectName}
                  onChange={(e) => updateProjectEntry(index, 'projectName', e.target.value)}
                  placeholder="e.g., E-commerce Platform"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-500" />
                  Your Role <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={entry.projectRole}
                  onChange={(e) => updateProjectEntry(index, 'projectRole', e.target.value)}
                  placeholder="e.g., Lead Developer"
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Project Link */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Link2 className="w-4 h-4 text-blue-500" />
                Project Link <span className="text-slate-400 text-xs">(Optional)</span>
              </label>
              <input
                type="url"
                value={entry.projectLink}
                onChange={(e) => updateProjectEntry(index, 'projectLink', e.target.value)}
                placeholder="https://github.com/username/project"
                className={inputClasses}
              />
            </div>

            {/* Date Range */}
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
                      onChange={(e) => updateProjectEntry(index, 'startMonth', e.target.value)}
                      className={selectClasses}
                    >
                      {months.map((m) => (<option key={m} value={m}>{m}</option>))}
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                  <div className="relative flex-1">
                    <select
                      value={entry.startYear}
                      onChange={(e) => updateProjectEntry(index, 'startYear', e.target.value)}
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
                      onChange={(e) => updateProjectEntry(index, 'endMonth', e.target.value)}
                      disabled={entry.currentProject}
                      className={`${selectClasses} ${entry.currentProject ? 'opacity-50' : ''}`}
                    >
                      {months.map((m) => (<option key={m} value={m}>{m}</option>))}
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                  <div className="relative flex-1">
                    <select
                      value={entry.endYear}
                      onChange={(e) => updateProjectEntry(index, 'endYear', e.target.value)}
                      disabled={entry.currentProject}
                      className={`${selectClasses} ${entry.currentProject ? 'opacity-50' : ''}`}
                    >
                      {years.map((y) => (<option key={y} value={y}>{y}</option>))}
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <label className="flex items-center gap-2 mt-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={entry.currentProject}
                    onChange={(e) => updateProjectEntry(index, 'currentProject', e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 accent-blue-600"
                  />
                  <span className="text-sm text-slate-600">Ongoing project</span>
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="pt-5 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <SparklesIcon className="w-4 h-4 text-blue-500" />
                  Project Description
                </label>
                <AIButton
                  onClick={() => handleGenerateProject(index)}
                  isLoading={generatingIndex === index}
                  disabled={!entry.projectName.trim() || !entry.projectRole.trim()}
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
                onChange={(e) => updateProjectEntry(index, 'description', e.target.value)}
                placeholder="Describe the project objectives, your contributions, technologies used...&#10;• Built a full-stack e-commerce platform using React and Node.js&#10;• Implemented payment gateway integration with Stripe"
                rows={5}
                className={`${inputClasses} resize-none`}
              />

              {/* Key Points Preview */}
              {entry.description && entry.description.trim() && (
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Key Points:</h4>
                  <div className="space-y-2">
                    {entry.description.split('\n').filter(line => line.trim()).map((point, pointIndex) => {
                      const points = entry.description.split('\n').filter(line => line.trim());
                      return (
                        <div key={pointIndex} className="flex items-start gap-2 group">
                          <span className="text-blue-500 text-sm mt-2">•</span>
                          <input
                            type="text"
                            value={point.trim()}
                            onChange={(e) => {
                              const newPoints = [...points];
                              newPoints[pointIndex] = e.target.value;
                              updateProjectEntry(index, 'description', newPoints.join('\n'));
                            }}
                            className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg 
                              text-sm text-slate-900 outline-none focus:border-blue-500 transition-all"
                          />
                          <button
                            onClick={() => {
                              const newPoints = points.filter((_, i) => i !== pointIndex);
                              updateProjectEntry(index, 'description', newPoints.join('\n'));
                            }}
                            className="p-1 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        ))}

        {/* Add Another Button */}
        <div className="mb-6">
          <button
            onClick={addProjectEntry}
            className="flex items-center gap-2 px-6 py-3 text-blue-600 border border-blue-200 
              rounded-xl font-medium hover:bg-blue-50 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Another Project
          </button>
        </div>

        {/* Pro Tip */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-start gap-3 mb-6">
          <Lightbulb className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-indigo-800">
            <span className="font-semibold">Pro Tip:</span> Highlight specific technologies,
            measurable outcomes, and your unique contributions. Include links to live demos or GitHub repos.
          </p>
        </div>

        <FormNavigation onBack={handleBack} onNext={handleNext} />
      </div>
    </FormPageLayout>
  )
}