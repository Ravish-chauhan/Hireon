import React, { useState, useEffect, useRef } from 'react'
import {
  SparklesIcon, Loader2, Code2, Users, Globe, Plus, X, Lightbulb,
  Zap, ChevronDown, Sparkles, FolderPlus
} from 'lucide-react'
import { useResumeFormNav } from './ResumeForm'
import { useResume } from '../context/ResumeContext'
import { aiSummaryService } from '../services/aiSummaryService'
import { FormPageLayout, GlassCard, AIButton, FormNavigation } from '../components/resume/FormPageLayout'

// Predefined skill suggestions for each category
const skillSuggestions: Record<string, string[]> = {
  'Technical Skills': [
    'JavaScript', 'TypeScript', 'Python', 'React', 'Node.js', 'SQL',
    'AWS', 'Docker', 'Git', 'MongoDB', 'Java', 'C++', 'GraphQL',
    'Kubernetes', 'REST APIs', 'PostgreSQL', 'Redis', 'Linux'
  ],
  'Soft Skills': [
    'Leadership', 'Communication', 'Problem Solving', 'Team Management',
    'Critical Thinking', 'Time Management', 'Adaptability', 'Creativity',
    'Collaboration', 'Decision Making', 'Conflict Resolution', 'Mentoring'
  ],
  'Languages': [
    'English (Fluent)', 'Spanish (Conversational)', 'French (Basic)',
    'German (Intermediate)', 'Mandarin (Native)', 'Hindi (Fluent)',
    'Arabic (Basic)', 'Portuguese (Intermediate)', 'Japanese (Basic)'
  ]
}

// Category icons and colors
const categoryConfig: Record<string, { icon: React.ElementType; color: string; bgColor: string; borderColor: string }> = {
  'Technical Skills': {
    icon: Code2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  'Soft Skills': {
    icon: Users,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  'Languages': {
    icon: Globe,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200'
  }
}

const defaultCategoryConfig = {
  icon: Zap,
  color: 'text-orange-600',
  bgColor: 'bg-orange-50',
  borderColor: 'border-orange-200'
}

// Skill Chip Component
function SkillChip({
  skill,
  onRemove,
  color = 'blue'
}: {
  skill: string
  onRemove: () => void
  color?: string
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    purple: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
    emerald: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
    orange: 'bg-orange-100 text-orange-700 hover:bg-orange-200'
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${colorClasses[color] || colorClasses.blue} group`}>
      {skill}
      <button
        onClick={onRemove}
        className="opacity-60 hover:opacity-100 transition-opacity"
        aria-label={`Remove ${skill}`}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </span>
  )
}

// Add Skill Input Component
function AddSkillInput({
  categoryName,
  suggestions,
  onAdd,
  existingSkills
}: {
  categoryName: string
  suggestions: string[]
  onAdd: (skill: string) => void
  existingSkills: string[]
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = suggestions
        .filter(s =>
          s.toLowerCase().includes(inputValue.toLowerCase()) &&
          !existingSkills.includes(s)
        )
        .slice(0, 6)
      setFilteredSuggestions(filtered)
    } else {
      setFilteredSuggestions(
        suggestions.filter(s => !existingSkills.includes(s)).slice(0, 6)
      )
    }
  }, [inputValue, suggestions, existingSkills])

  const handleAdd = (skill: string) => {
    if (skill.trim() && !existingSkills.includes(skill.trim())) {
      onAdd(skill.trim())
      setInputValue('')
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      handleAdd(inputValue)
    } else if (e.key === 'Escape') {
      setIsExpanded(false)
      setInputValue('')
    }
  }

  if (!isExpanded) {
    return (
      <button
        onClick={() => {
          setIsExpanded(true)
          setTimeout(() => inputRef.current?.focus(), 100)
        }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-500 
          hover:text-blue-600 hover:bg-blue-50 rounded-full border border-dashed border-slate-300 
          hover:border-blue-300 transition-all"
      >
        <Plus className="w-4 h-4" />
        Add Skill
      </button>
    )
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            setTimeout(() => {
              if (!inputValue.trim()) setIsExpanded(false)
            }, 200)
          }}
          placeholder="Type a skill..."
          className="w-48 px-3 py-1.5 text-sm border border-slate-300 rounded-full 
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
        />
        <button
          onClick={() => setIsExpanded(false)}
          className="p-1 text-slate-400 hover:text-slate-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 
          rounded-xl shadow-lg z-10 py-2 max-h-48 overflow-y-auto">
          <p className="px-3 py-1 text-xs text-slate-400 font-medium">Suggestions</p>
          {filteredSuggestions.map((suggestion, i) => (
            <button
              key={i}
              onClick={() => handleAdd(suggestion)}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 
                hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Category Card Component
function CategoryCard({
  categoryName,
  skills,
  onAddSkill,
  onRemoveSkill,
  suggestions,
  isCustom = false,
  onDeleteCategory
}: {
  categoryName: string
  skills: string[]
  onAddSkill: (skill: string) => void
  onRemoveSkill: (skill: string) => void
  suggestions: string[]
  isCustom?: boolean
  onDeleteCategory?: () => void
}) {
  const config = categoryConfig[categoryName] || defaultCategoryConfig
  const Icon = config.icon
  const chipColor = config.color.replace('text-', '').replace('-600', '')

  return (
    <GlassCard className="p-5" hover={false}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${config.bgColor} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${config.color}`} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{categoryName}</h3>
            <p className="text-xs text-slate-500">{skills.length} skill{skills.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        {isCustom && onDeleteCategory && (
          <button
            onClick={onDeleteCategory}
            className="text-slate-400 hover:text-red-500 transition-colors p-1"
            title="Delete category"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <SkillChip
            key={index}
            skill={skill}
            onRemove={() => onRemoveSkill(skill)}
            color={chipColor}
          />
        ))}
        <AddSkillInput
          categoryName={categoryName}
          suggestions={suggestions}
          onAdd={onAddSkill}
          existingSkills={skills}
        />
      </div>

      {skills.length === 0 && (
        <p className="text-sm text-slate-400 mt-2">
          Click "Add Skill" to add your {categoryName.toLowerCase()}
        </p>
      )}
    </GlassCard>
  )
}

export function SkillsPage() {
  const { handleNext, handleBack, navigateTo } = useResumeFormNav()
  const { resumeData, updateSkills } = useResume()

  // Initialize skills state from context
  const [skillCategories, setSkillCategories] = useState<Record<string, string[]>>(() => {
    // Try to load from resumeData
    if (typeof resumeData.skills === 'object' && resumeData.skills !== null) {
      const existingSkills = resumeData.skills as Record<string, string[]>
      if (Object.keys(existingSkills).length > 0) {
        return existingSkills
      }
    }
    // Default empty categories
    return {
      'Technical Skills': [],
      'Soft Skills': [],
      'Languages': []
    }
  })

  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const newCategoryInputRef = useRef<HTMLInputElement>(null)

  // Sync with context
  useEffect(() => {
    updateSkills(skillCategories)
  }, [skillCategories, updateSkills])

  // Calculate total skills count
  const totalSkills = Object.values(skillCategories).reduce((sum, skills) => sum + skills.length, 0)

  const handleAddSkill = (category: string, skill: string) => {
    setSkillCategories(prev => ({
      ...prev,
      [category]: [...(prev[category] || []), skill]
    }))
  }

  const handleRemoveSkill = (category: string, skill: string) => {
    setSkillCategories(prev => ({
      ...prev,
      [category]: prev[category].filter(s => s !== skill)
    }))
  }

  const handleAddCategory = () => {
    if (newCategoryName.trim() && !skillCategories[newCategoryName.trim()]) {
      setSkillCategories(prev => ({
        ...prev,
        [newCategoryName.trim()]: []
      }))
      setNewCategoryName('')
      setShowAddCategory(false)
    }
  }

  const handleDeleteCategory = (category: string) => {
    if (window.confirm(`Are you sure you want to delete "${category}" and all its skills?`)) {
      setSkillCategories(prev => {
        const updated = { ...prev }
        delete updated[category]
        return updated
      })
    }
  }

  const handleGenerateAISkills = async () => {
    const jobTitle = resumeData.summary?.jobTitle
    const jobDescription = resumeData.summary?.jobDescription

    if (!jobTitle) {
      alert('Please complete the Summary section first with your target job title to generate relevant skills.')
      return
    }

    setIsGeneratingAI(true)
    try {
      const response = await aiSummaryService.generateSkills(jobTitle, jobDescription)

      // Merge AI-generated skills with existing
      setSkillCategories(prev => {
        const updated = { ...prev }
        Object.entries(response.skills).forEach(([category, skills]) => {
          if (skills && skills.length > 0) {
            const existingSkills = updated[category] || []
            const newSkills = skills.filter((s: string) => !existingSkills.includes(s))
            updated[category] = [...existingSkills, ...newSkills]
          }
        })
        return updated
      })
    } catch (error) {
      console.error('Failed to generate AI skills:', error)
      alert('Failed to generate skills. Please try again.')
    } finally {
      setIsGeneratingAI(false)
    }
  }

  // Determine which categories are default vs custom
  const defaultCategories = ['Technical Skills', 'Soft Skills', 'Languages']
  const orderedCategories = [
    ...defaultCategories.filter(c => c in skillCategories),
    ...Object.keys(skillCategories).filter(c => !defaultCategories.includes(c))
  ]

  return (
    <FormPageLayout
      currentStep={3}
      totalSteps={7}
      stepName="Skills"
      title="Showcase Your Expertise"
      subtitle="Add technical skills, soft skills, and tools that define your professional profile."
      onNavigate={navigateTo}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Skills Counter */}
        <div className="flex justify-center">
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl border-2 transition-all ${totalSkills >= 6
            ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200'
            : 'bg-slate-50 border-slate-200'
            }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${totalSkills >= 6 ? 'bg-emerald-500' : 'bg-blue-500'
              }`}>
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className={`text-2xl font-bold ${totalSkills >= 6 ? 'text-emerald-600' : 'text-slate-700'}`}>
                {totalSkills}
              </span>
              <span className="text-slate-500 ml-1">skill{totalSkills !== 1 ? 's' : ''}</span>
            </div>
            <div className={`text-sm px-3 py-1 rounded-full ${totalSkills >= 6
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-slate-100 text-slate-600'
              }`}>
              {totalSkills >= 6 ? '✓ Great!' : 'Aim for 6+'}
            </div>
          </div>
        </div>

        {/* AI Skills Generator Card */}
        <GlassCard className="p-6" hover={false}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20 flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900">AI Skills Generator</h3>
              <p className="text-sm text-slate-500 mt-1">
                Generate personalized skill suggestions based on your target job role.
                {!resumeData.summary?.jobTitle && (
                  <span className="text-amber-600 block mt-1">
                    ⚠️ Complete the Summary section first with your target job title.
                  </span>
                )}
              </p>
            </div>
            <AIButton
              onClick={handleGenerateAISkills}
              isLoading={isGeneratingAI}
              disabled={!resumeData.summary?.jobTitle}
              className="!px-5"
            >
              {isGeneratingAI ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <SparklesIcon className="w-4 h-4" />
              )}
              {isGeneratingAI ? 'Generating...' : 'Generate Skills'}
            </AIButton>
          </div>
        </GlassCard>

        {/* Skill Category Cards */}
        <div className="space-y-4">
          {orderedCategories.map((category) => (
            <CategoryCard
              key={category}
              categoryName={category}
              skills={skillCategories[category] || []}
              onAddSkill={(skill) => handleAddSkill(category, skill)}
              onRemoveSkill={(skill) => handleRemoveSkill(category, skill)}
              suggestions={skillSuggestions[category] || []}
              isCustom={!defaultCategories.includes(category)}
              onDeleteCategory={
                !defaultCategories.includes(category)
                  ? () => handleDeleteCategory(category)
                  : undefined
              }
            />
          ))}
        </div>

        {/* Add Custom Category */}
        <div className="pt-2">
          {showAddCategory ? (
            <GlassCard className="p-4" hover={false}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <FolderPlus className="w-5 h-5 text-slate-600" />
                </div>
                <input
                  ref={newCategoryInputRef}
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddCategory()
                    if (e.key === 'Escape') setShowAddCategory(false)
                  }}
                  placeholder="Category name (e.g., Tools, Frameworks)"
                  className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl
                    text-slate-900 placeholder-slate-400 outline-none text-sm
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  autoFocus
                />
                <button
                  onClick={handleAddCategory}
                  disabled={!newCategoryName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl
                    hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowAddCategory(false)
                    setNewCategoryName('')
                  }}
                  className="px-4 py-2 text-slate-500 text-sm font-medium hover:text-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </GlassCard>
          ) : (
            <button
              onClick={() => {
                setShowAddCategory(true)
                setTimeout(() => newCategoryInputRef.current?.focus(), 100)
              }}
              className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed 
                border-slate-200 rounded-2xl text-slate-500 hover:text-blue-600 hover:border-blue-300 
                hover:bg-blue-50/50 transition-all font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Custom Category
            </button>
          )}
        </div>

        {/* Pro Tip */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="font-semibold text-amber-800 mb-1">Pro Tip</p>
            <p className="text-sm text-amber-700">
              Include a mix of technical skills (programming languages, tools) and soft skills
              (leadership, communication). Tailor your skills to match the job description for best results.
            </p>
          </div>
        </div>

        <FormNavigation onBack={handleBack} onNext={handleNext} />
      </div>
    </FormPageLayout>
  )
}