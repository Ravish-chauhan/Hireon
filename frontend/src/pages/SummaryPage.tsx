import React, { useState, useEffect } from 'react'
import { SparklesIcon, Loader2, Wand2, Briefcase, FileText, Lightbulb, ChevronRight, Target, Zap } from 'lucide-react'
import { useResumeFormNav } from './ResumeForm'
import { useResume } from '../context/ResumeContext'
import { aiSummaryService, SummaryOption } from '../services/aiSummaryService'
import RichTextEditor from '../components/RichTextEditor'
import { FormPageLayout, GlassCard, AIButton, FormNavigation } from '../components/resume/FormPageLayout'

export function SummaryPage() {
  const { handleNext, handleBack, navigateTo } = useResumeFormNav()
  const { resumeData, updateSummary } = useResume()

  const [jobTitle, setJobTitle] = useState(resumeData.summary?.jobTitle || '')
  const [jobDescription, setJobDescription] = useState(resumeData.summary?.jobDescription || '')
  const [summary, setSummary] = useState(resumeData.summary?.content || '')
  const [aiSuggestions, setAiSuggestions] = useState<SummaryOption[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null)

  useEffect(() => {
    updateSummary({ jobTitle, jobDescription, content: summary })
  }, [jobTitle, jobDescription, summary, updateSummary])

  const handleGenerateSummaries = async () => {
    if (!jobTitle.trim() || !jobDescription.trim()) return
    setIsGenerating(true)
    try {
      const response = await aiSummaryService.generateSummaries(jobTitle, jobDescription)
      setAiSuggestions(response.summaries || [])
    } catch (error) {
      console.error('Failed to generate summaries:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleEnhanceSummary = async () => {
    if (!summary.trim()) return
    setIsEnhancing(true)
    try {
      const response = await aiSummaryService.enhanceSummary(summary, jobTitle)
      setSummary(response.enhancedSummary)
    } catch (error) {
      console.error('Failed to enhance summary:', error)
    } finally {
      setIsEnhancing(false)
    }
  }

  const handleSelectSuggestion = (index: number, text: string) => {
    setSelectedSuggestion(index)
    setSummary(text)
  }

  const inputClasses = `w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl
    text-slate-900 placeholder-slate-400 outline-none
    focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
    transition-all duration-200 shadow-sm`

  return (
    <FormPageLayout
      currentStep={2}
      totalSteps={7}
      stepName="Summary"
      title="Professional Summary"
      subtitle="A compelling summary helps recruiters understand your value at a glance."
      onNavigate={navigateTo}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Step 1: Target Job Information */}
        <GlassCard className="p-6 md:p-8" hover={false}>
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">Step 1</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Target Job Information</h3>
              <p className="text-sm text-slate-500 mt-0.5">Help our AI understand what position you're applying for</p>
            </div>
          </div>

          {/* Stacked layout for better UX */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-400" />
                Target Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g., Senior Software Engineer, Product Manager, Data Analyst"
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here. Include key responsibilities, required skills, and qualifications for best results..."
                rows={5}
                className={`${inputClasses} resize-none`}
              />
              <p className="text-xs text-slate-400 mt-2">
                💡 Tip: Include the full job description for more tailored AI suggestions
              </p>
            </div>
          </div>

          {/* Generate Button */}
          <div className="mt-6 flex justify-end">
            <AIButton
              onClick={handleGenerateSummaries}
              isLoading={isGenerating}
              disabled={!jobTitle.trim() || !jobDescription.trim()}
              className="!px-6"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <SparklesIcon className="w-4 h-4" />
              )}
              {isGenerating ? 'Generating Summaries...' : 'Generate AI Summaries'}
            </AIButton>
          </div>
        </GlassCard>

        {/* Step 2: AI Suggestions (only show when we have suggestions) */}
        {aiSuggestions.length > 0 && (
          <GlassCard className="p-6 md:p-8" hover={false}>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 flex-shrink-0">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">Step 2</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">AI-Generated Summaries</h3>
                <p className="text-sm text-slate-500 mt-0.5">Click on a summary to use it, or write your own below</p>
              </div>
            </div>

            <div className="grid gap-4">
              {aiSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectSuggestion(index, suggestion.text)}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 group
                    ${selectedSuggestion === index
                      ? 'border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-500/10'
                      : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md'
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold transition-colors
                      ${selectedSuggestion === index
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                      }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 leading-relaxed">{suggestion.text}</p>
                      <div className="flex items-center gap-2 mt-3">
                        {selectedSuggestion === index ? (
                          <span className="text-xs font-medium text-blue-600 flex items-center gap-1">
                            <Zap className="w-3 h-3" /> Selected
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-slate-400 group-hover:text-blue-500 flex items-center gap-1">
                            Click to use <ChevronRight className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Step 3: Your Summary Editor */}
        <GlassCard className="overflow-hidden" hover={false}>
          <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    {aiSuggestions.length > 0 ? 'Step 3' : 'Step 2'}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Your Summary</h3>
                <p className="text-sm text-slate-500">Write or edit your professional summary</p>
              </div>
            </div>
            <AIButton
              onClick={handleEnhanceSummary}
              isLoading={isEnhancing}
              disabled={!summary.trim()}
              variant="secondary"
              className="!py-2.5 !px-5"
            >
              {isEnhancing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
              {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
            </AIButton>
          </div>

          <div className="p-5 min-h-[280px]">
            <div className="h-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <RichTextEditor
                value={summary}
                onChange={setSummary}
                placeholder="Write a compelling professional summary that highlights your key skills, experience, and what makes you stand out. Aim for 3-4 sentences that capture your professional identity..."
              />
            </div>
            {!summary && !aiSuggestions.length && (
              <div className="mt-4 flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-700">Pro Tip</p>
                  <p className="text-sm text-blue-600 mt-0.5">
                    Enter your target job details above and click "Generate AI Summaries" to get personalized suggestions tailored to your desired role.
                  </p>
                </div>
              </div>
            )}
          </div>
        </GlassCard>

        <FormNavigation onBack={handleBack} onNext={handleNext} />
      </div>
    </FormPageLayout>
  )
}