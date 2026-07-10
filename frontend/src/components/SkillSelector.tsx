import React from 'react'
import { SearchIcon, PlusIcon, ChevronDownIcon, SparklesIcon, Loader2 } from 'lucide-react'
import { aiSummaryService } from '../services/aiSummaryService'
import { useResume } from '../context/ResumeContext'

type SkillSelectorProps = {
  onSelect: (skill: string) => void
  onSkillsChange?: (skills: { [category: string]: string[] }) => void
}

const skillCategories = {
  'Technical Skills': [
    'JavaScript',
    'Python',
    'React',
    'Node.js',
    'SQL',
    'AWS',
    'Git',
    'Docker',
    'MongoDB',
    'TypeScript',
    'HTML/CSS',
    'Java'
  ],
  'Soft Skills': [
    'Leadership',
    'Training & Development',
    'Organizational skills',
    'Troubleshooting',
    'Customer service',
    'Analytical and critical thinking',
    'Team management',
    'Written communication',
    'Organization and time management',
    'Verbal communication',
    'Problem solving',
    'Project management'
  ],
  'Languages': [
    'English (Fluent)',
    'Spanish (Conversational)',
    'French (Basic)',
    'German (Intermediate)',
    'Mandarin (Native)',
    'Hindi (Fluent)',
    'Arabic (Basic)',
    'Portuguese (Intermediate)'
  ]
}

export function SkillSelector({ onSelect, onSkillsChange }: SkillSelectorProps) {
  const { resumeData } = useResume()
  const [categories, setCategories] = React.useState(skillCategories)
  const [expandedCategories, setExpandedCategories] = React.useState<Record<string, boolean>>({
    'Technical Skills': true,
    'Soft Skills': false,
    'Languages': false
  })
  const [isGeneratingSkills, setIsGeneratingSkills] = React.useState(false)
  const [selectedSkills, setSelectedSkills] = React.useState<Record<string, string[]>>({})
  const [newCategoryName, setNewCategoryName] = React.useState('')
  const [newSkillName, setNewSkillName] = React.useState('')
  const [addingSkillTo, setAddingSkillTo] = React.useState<string | null>(null)
  const [showAddCategory, setShowAddCategory] = React.useState(false)

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const addCategory = () => {
    if (newCategoryName.trim()) {
      setCategories(prev => ({
        ...prev,
        [newCategoryName]: []
      }))
      setExpandedCategories(prev => ({
        ...prev,
        [newCategoryName]: true
      }))
      setNewCategoryName('')
      setShowAddCategory(false)
    }
  }

  const addSkillToCategory = (category: string) => {
    if (newSkillName.trim()) {
      setCategories(prev => ({
        ...prev,
        [category]: [...prev[category], newSkillName]
      }))
      setNewSkillName('')
      setAddingSkillTo(null)
    }
  }

  const toggleSkillSelection = (category: string, skill: string) => {
    setSelectedSkills(prev => {
      const categorySkills = prev[category] || []
      const isSelected = categorySkills.includes(skill)
      
      const newSkills = isSelected
        ? {
            ...prev,
            [category]: categorySkills.filter(s => s !== skill)
          }
        : {
            ...prev,
            [category]: [...categorySkills, skill]
          }
      
      // Call the callback to update context
      onSkillsChange?.(newSkills)
      
      return newSkills
    })
  }

  const getSelectedSkillsForCategory = (category: string) => {
    return selectedSkills[category] || []
  }

  const handleGenerateAISkills = async () => {
    console.log('🎯 SkillSelector: Generate AI skills clicked');
    
    const jobTitle = resumeData.summary?.jobTitle
    const jobDescription = resumeData.summary?.jobDescription
    
    console.log('🎯 Job context:', { jobTitle, jobDescription: !!jobDescription });
    
    if (!jobTitle) {
      alert('Please complete the summary section first to generate relevant skills')
      return
    }

    setIsGeneratingSkills(true)
    console.log('🔄 Setting generating skills state to true');
    
    try {
      console.log('📤 Calling AI skills service...');
      const response = await aiSummaryService.generateSkills(jobTitle, jobDescription)
      console.log('✅ AI skills service response:', response);
      
      // Merge AI-generated skills with existing categories
      const newCategories = { ...categories }
      Object.entries(response.skills).forEach(([category, skills]) => {
        if (skills && skills.length > 0) {
          newCategories[category] = [...(newCategories[category] || []), ...skills]
          // Remove duplicates
          newCategories[category] = Array.from(new Set(newCategories[category]))
        }
      })
      
      setCategories(newCategories)
      console.log('📊 Updated categories with AI skills');
      
      // Expand all categories to show new skills
      const newExpanded = { ...expandedCategories }
      Object.keys(response.skills).forEach(category => {
        newExpanded[category] = true
      })
      setExpandedCategories(newExpanded)
      
    } catch (error) {
      console.error('❌ Failed to generate AI skills:', error)
      alert('Failed to generate skills. Please try again.')
    } finally {
      setIsGeneratingSkills(false)
      console.log('✅ Setting generating skills state to false');
    }
  }

  return (
    <div className="w-full h-full flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Search skills"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#4169FF] transition-colors"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        <button
          onClick={handleGenerateAISkills}
          disabled={isGeneratingSkills}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all"
        >
          {isGeneratingSkills ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <SparklesIcon className="w-4 h-4" />
          )}
          {isGeneratingSkills ? 'Generating...' : 'Generate AI Skills'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {Object.entries(categories).map(([category, skills]) => (
          <div key={category} className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => toggleCategory(category)}
                className="flex items-center gap-2 text-left flex-1"
              >
                <h3 className="text-sm font-semibold text-gray-800">{category}</h3>
                <span className="text-xs text-gray-500">({getSelectedSkillsForCategory(category).length})</span>
                <ChevronDownIcon 
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    expandedCategories[category] ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              <button
                onClick={() => setAddingSkillTo(category)}
                className="text-xs text-[#4169FF] hover:underline"
              >
                + Add skill
              </button>
            </div>
            
            {expandedCategories[category] && (
              <div className="space-y-2 ml-2">
                {addingSkillTo === category && (
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      placeholder="Enter skill name"
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                      onKeyPress={(e) => e.key === 'Enter' && addSkillToCategory(category)}
                    />
                    <button
                      onClick={() => addSkillToCategory(category)}
                      className="px-2 py-1 text-xs bg-[#4169FF] text-white rounded"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setAddingSkillTo(null)}
                      className="px-2 py-1 text-xs text-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                {skills.map((skill, index) => {
                  const isSelected = getSelectedSkillsForCategory(category).includes(skill)
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSkillSelection(category, skill)}
                        className="w-3 h-3 accent-[#4169FF]"
                      />
                      <button
                        onClick={() => {
                          onSelect(`${category}:\n${skill}`)
                          toggleSkillSelection(category, skill)
                        }}
                        className="flex items-center gap-2 flex-1 text-left group"
                      >
                        <span className={`text-sm transition-colors ${
                          isSelected ? 'text-[#4169FF] font-medium' : 'text-gray-700 group-hover:text-gray-900'
                        }`}>
                          {skill}
                        </span>
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
        
        {/* Add Category Section */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          {showAddCategory ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category name"
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg"
                onKeyPress={(e) => e.key === 'Enter' && addCategory()}
              />
              <button
                onClick={addCategory}
                className="px-3 py-2 text-sm bg-[#4169FF] text-white rounded-lg"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddCategory(false)}
                className="px-3 py-2 text-sm text-gray-500"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAddCategory(true)}
              className="flex items-center gap-2 text-sm text-[#4169FF] hover:underline"
            >
              <PlusIcon className="w-4 h-4" />
              Add Custom Category
            </button>
          )}
        </div>
      </div>
    </div>
  )
}