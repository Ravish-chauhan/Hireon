import React, { useState, useEffect } from 'react'
import {
  TrophyIcon,
  AwardIcon,
  MessageSquareIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckCircle2Icon,
  X,
  BookOpenIcon,
  UsersIcon,
  HeartIcon,
  Sparkles,
} from 'lucide-react'
import { useResumeFormNav } from './ResumeForm'
import { useResume } from '../context/ResumeContext'
import { FormPageLayout, GlassCard, FormNavigation } from '../components/resume/FormPageLayout'

const months = [
  'Month', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const years = ['Year', ...Array.from({ length: 30 }, (_, i) => String(2024 - i))]

type OptionalSection = {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  completed: boolean
}

const optionalSections: OptionalSection[] = [
  {
    id: 'awards',
    title: 'Awards & Accomplishments',
    description: 'Showcase your achievements, recognitions, and awards.',
    icon: <TrophyIcon className="w-5 h-5" />,
    completed: false,
  },
  {
    id: 'certifications',
    title: 'Certifications',
    description: 'Professional credentials that prove your expertise.',
    icon: <AwardIcon className="w-5 h-5" />,
    completed: false,
  },
  {
    id: 'languages',
    title: 'Languages',
    description: 'Language proficiencies that expand your reach.',
    icon: <MessageSquareIcon className="w-5 h-5" />,
    completed: false,
  },
  {
    id: 'publications',
    title: 'Publications',
    description: 'Research papers, articles, and published works.',
    icon: <BookOpenIcon className="w-5 h-5" />,
    completed: false,
  },
  {
    id: 'memberships',
    title: 'Professional Memberships',
    description: 'Industry associations and professional organizations.',
    icon: <UsersIcon className="w-5 h-5" />,
    completed: false,
  },
  {
    id: 'volunteer',
    title: 'Volunteer Experience',
    description: 'Community involvement and social responsibility.',
    icon: <HeartIcon className="w-5 h-5" />,
    completed: false,
  },
]

export function OptionalDetailsPage() {
  const { handleNext, handleBack, navigateTo } = useResumeFormNav()
  const { resumeData, updateOptionalDetails } = useResume()
  const [expandedSection, setExpandedSection] = useState<string | null>('awards')

  const [awards, setAwards] = useState(() => resumeData.optionalDetails.awards || [])
  const [certifications, setCertifications] = useState(() => resumeData.optionalDetails.certifications || [])
  const [languages, setLanguages] = useState(() => resumeData.optionalDetails.languages || [])
  const [publications, setPublications] = useState(() => resumeData.optionalDetails.publications || [])
  const [memberships, setMemberships] = useState(() => resumeData.optionalDetails.memberships || [])
  const [volunteer, setVolunteer] = useState(() => resumeData.optionalDetails.volunteer || [])

  useEffect(() => {
    updateOptionalDetails({ awards, certifications, languages, publications, memberships, volunteer })
  }, [awards, certifications, languages, publications, memberships, volunteer, updateOptionalDetails])

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id)
  }

  // Helper functions
  const addAward = () => setAwards([...awards, { id: `award-${Date.now()}`, title: '', description: '', month: 'Month', year: 'Year' }])
  const updateAward = (index: number, field: string, value: string) => {
    const updated = [...awards]; updated[index] = { ...updated[index], [field]: value }; setAwards(updated)
  }
  const deleteAward = (index: number) => setAwards(awards.filter((_, i) => i !== index))

  const addCertification = () => setCertifications([...certifications, { id: `cert-${Date.now()}`, name: '', issuer: '', month: 'Month', year: 'Year' }])
  const updateCertification = (index: number, field: string, value: string) => {
    const updated = [...certifications]; updated[index] = { ...updated[index], [field]: value }; setCertifications(updated)
  }
  const deleteCertification = (index: number) => setCertifications(certifications.filter((_, i) => i !== index))

  const addLanguage = () => setLanguages([...languages, { id: `lang-${Date.now()}`, language: '', proficiency: '' }])
  const updateLanguage = (index: number, field: string, value: string) => {
    const updated = [...languages]; updated[index] = { ...updated[index], [field]: value }; setLanguages(updated)
  }
  const deleteLanguage = (index: number) => setLanguages(languages.filter((_, i) => i !== index))

  const addPublication = () => setPublications([...publications, { id: `pub-${Date.now()}`, title: '', authors: '', journal: '', month: 'Month', year: 'Year', url: '' }])
  const updatePublication = (index: number, field: string, value: string) => {
    const updated = [...publications]; updated[index] = { ...updated[index], [field]: value }; setPublications(updated)
  }
  const deletePublication = (index: number) => setPublications(publications.filter((_, i) => i !== index))

  const addMembership = () => setMemberships([...memberships, { id: `mem-${Date.now()}`, organization: '', role: '', startMonth: 'Month', startYear: 'Year', endMonth: 'Month', endYear: 'Year', current: false }])
  const updateMembership = (index: number, field: string, value: string | boolean) => {
    const updated = [...memberships]; updated[index] = { ...updated[index], [field]: value }; setMemberships(updated)
  }
  const deleteMembership = (index: number) => setMemberships(memberships.filter((_, i) => i !== index))

  const addVolunteer = () => setVolunteer([...volunteer, { id: `vol-${Date.now()}`, organization: '', role: '', startMonth: 'Month', startYear: 'Year', endMonth: 'Month', endYear: 'Year', current: false, description: '' }])
  const updateVolunteer = (index: number, field: string, value: string | boolean) => {
    const updated = [...volunteer]; updated[index] = { ...updated[index], [field]: value }; setVolunteer(updated)
  }
  const deleteVolunteer = (index: number) => setVolunteer(volunteer.filter((_, i) => i !== index))

  const inputClasses = `w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl
    text-slate-900 placeholder-slate-400 outline-none text-sm
    focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all`

  const selectClasses = `px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl
    text-slate-900 outline-none cursor-pointer appearance-none text-sm
    focus:border-blue-500 transition-all`

  const addButtonClasses = `w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 
    hover:border-blue-300 hover:text-blue-600 transition-all font-medium`

  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'awards':
        return (
          <div className="space-y-4">
            {awards.map((award, index) => (
              <div key={award.id} className="bg-slate-50 rounded-xl p-4 relative border border-slate-100">
                {awards.length > 1 && (
                  <button onClick={() => deleteAward(index)} className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <input type="text" placeholder="Award Title" value={award.title} onChange={(e) => updateAward(index, 'title', e.target.value)} className={`${inputClasses} mb-3`} />
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="relative">
                    <select value={award.month || 'Month'} onChange={(e) => updateAward(index, 'month', e.target.value)} className={`w-full ${selectClasses}`}>
                      {months.map((m) => (<option key={m} value={m}>{m}</option>))}
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select value={award.year || 'Year'} onChange={(e) => updateAward(index, 'year', e.target.value)} className={`w-full ${selectClasses}`}>
                      {years.map((y) => (<option key={y} value={y}>{y}</option>))}
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <textarea placeholder="Description..." value={award.description} onChange={(e) => updateAward(index, 'description', e.target.value)} rows={2} className={`${inputClasses} resize-none`} />
              </div>
            ))}
            <button onClick={addAward} className={addButtonClasses}>+ Add Award</button>
          </div>
        )

      case 'certifications':
        return (
          <div className="space-y-4">
            {certifications.map((cert, index) => (
              <div key={cert.id} className="bg-slate-50 rounded-xl p-4 relative border border-slate-100">
                {certifications.length > 1 && (
                  <button onClick={() => deleteCertification(index)} className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="space-y-3">
                  <input type="text" placeholder="Certification Name" value={cert.name} onChange={(e) => updateCertification(index, 'name', e.target.value)} className={inputClasses} />
                  <input type="text" placeholder="Issuing Organization" value={cert.issuer} onChange={(e) => updateCertification(index, 'issuer', e.target.value)} className={inputClasses} />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <select value={cert.month || 'Month'} onChange={(e) => updateCertification(index, 'month', e.target.value)} className={`w-full ${selectClasses}`}>
                        {months.map((m) => (<option key={m} value={m}>{m}</option>))}
                      </select>
                      <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                    <div className="relative">
                      <select value={cert.year || 'Year'} onChange={(e) => updateCertification(index, 'year', e.target.value)} className={`w-full ${selectClasses}`}>
                        {years.map((y) => (<option key={y} value={y}>{y}</option>))}
                      </select>
                      <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addCertification} className={addButtonClasses}>+ Add Certification</button>
          </div>
        )

      case 'languages':
        return (
          <div className="space-y-4">
            {languages.map((lang, index) => (
              <div key={lang.id} className="bg-slate-50 rounded-xl p-4 relative border border-slate-100">
                {languages.length > 1 && (
                  <button onClick={() => deleteLanguage(index)} className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Language (e.g., Spanish)" value={lang.language} onChange={(e) => updateLanguage(index, 'language', e.target.value)} className={inputClasses} />
                  <div className="relative">
                    <select value={lang.proficiency} onChange={(e) => updateLanguage(index, 'proficiency', e.target.value)} className={`w-full ${selectClasses}`}>
                      <option value="">Select Proficiency</option>
                      <option value="Native">Native</option>
                      <option value="Fluent">Fluent</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Basic">Basic</option>
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addLanguage} className={addButtonClasses}>+ Add Language</button>
          </div>
        )

      case 'publications':
        return (
          <div className="space-y-4">
            {publications.map((pub, index) => (
              <div key={pub.id} className="bg-slate-50 rounded-xl p-4 relative border border-slate-100">
                {publications.length > 1 && (
                  <button onClick={() => deletePublication(index)} className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="space-y-3">
                  <input type="text" placeholder="Publication Title" value={pub.title} onChange={(e) => updatePublication(index, 'title', e.target.value)} className={inputClasses} />
                  <input type="text" placeholder="Authors" value={pub.authors} onChange={(e) => updatePublication(index, 'authors', e.target.value)} className={inputClasses} />
                  <input type="text" placeholder="Journal/Publisher" value={pub.journal} onChange={(e) => updatePublication(index, 'journal', e.target.value)} className={inputClasses} />
                  <input type="url" placeholder="URL (optional)" value={pub.url} onChange={(e) => updatePublication(index, 'url', e.target.value)} className={inputClasses} />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <select value={pub.month || 'Month'} onChange={(e) => updatePublication(index, 'month', e.target.value)} className={`w-full ${selectClasses}`}>
                        {months.map((m) => (<option key={m} value={m}>{m}</option>))}
                      </select>
                      <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                    <div className="relative">
                      <select value={pub.year || 'Year'} onChange={(e) => updatePublication(index, 'year', e.target.value)} className={`w-full ${selectClasses}`}>
                        {years.map((y) => (<option key={y} value={y}>{y}</option>))}
                      </select>
                      <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addPublication} className={addButtonClasses}>+ Add Publication</button>
          </div>
        )

      case 'memberships':
        return (
          <div className="space-y-4">
            {memberships.map((mem, index) => (
              <div key={mem.id} className="bg-slate-50 rounded-xl p-4 relative border border-slate-100">
                {memberships.length > 1 && (
                  <button onClick={() => deleteMembership(index)} className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="space-y-3">
                  <input type="text" placeholder="Organization Name" value={mem.organization} onChange={(e) => updateMembership(index, 'organization', e.target.value)} className={inputClasses} />
                  <input type="text" placeholder="Role (optional)" value={mem.role} onChange={(e) => updateMembership(index, 'role', e.target.value)} className={inputClasses} />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Start Date</label>
                      <div className="grid grid-cols-2 gap-2">
                        <select value={mem.startMonth || 'Month'} onChange={(e) => updateMembership(index, 'startMonth', e.target.value)} className={`${selectClasses} text-xs py-2`}>
                          {months.map((m) => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <select value={mem.startYear || 'Year'} onChange={(e) => updateMembership(index, 'startYear', e.target.value)} className={`${selectClasses} text-xs py-2`}>
                          {years.map((y) => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">End Date</label>
                      <div className="grid grid-cols-2 gap-2">
                        <select value={mem.endMonth || 'Month'} onChange={(e) => updateMembership(index, 'endMonth', e.target.value)} disabled={mem.current} className={`${selectClasses} text-xs py-2 ${mem.current ? 'opacity-50' : ''}`}>
                          {months.map((m) => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <select value={mem.endYear || 'Year'} onChange={(e) => updateMembership(index, 'endYear', e.target.value)} disabled={mem.current} className={`${selectClasses} text-xs py-2 ${mem.current ? 'opacity-50' : ''}`}>
                          {years.map((y) => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input type="checkbox" checked={mem.current} onChange={(e) => updateMembership(index, 'current', e.target.checked)} className="w-4 h-4 rounded accent-blue-600" />
                    Current member
                  </label>
                </div>
              </div>
            ))}
            <button onClick={addMembership} className={addButtonClasses}>+ Add Membership</button>
          </div>
        )

      case 'volunteer':
        return (
          <div className="space-y-4">
            {volunteer.map((vol, index) => (
              <div key={vol.id} className="bg-slate-50 rounded-xl p-4 relative border border-slate-100">
                {volunteer.length > 1 && (
                  <button onClick={() => deleteVolunteer(index)} className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="space-y-3">
                  <input type="text" placeholder="Organization Name" value={vol.organization} onChange={(e) => updateVolunteer(index, 'organization', e.target.value)} className={inputClasses} />
                  <input type="text" placeholder="Role/Position" value={vol.role} onChange={(e) => updateVolunteer(index, 'role', e.target.value)} className={inputClasses} />
                  <textarea placeholder="Description..." value={vol.description} onChange={(e) => updateVolunteer(index, 'description', e.target.value)} rows={2} className={`${inputClasses} resize-none`} />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Start Date</label>
                      <div className="grid grid-cols-2 gap-2">
                        <select value={vol.startMonth || 'Month'} onChange={(e) => updateVolunteer(index, 'startMonth', e.target.value)} className={`${selectClasses} text-xs py-2`}>
                          {months.map((m) => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <select value={vol.startYear || 'Year'} onChange={(e) => updateVolunteer(index, 'startYear', e.target.value)} className={`${selectClasses} text-xs py-2`}>
                          {years.map((y) => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">End Date</label>
                      <div className="grid grid-cols-2 gap-2">
                        <select value={vol.endMonth || 'Month'} onChange={(e) => updateVolunteer(index, 'endMonth', e.target.value)} disabled={vol.current} className={`${selectClasses} text-xs py-2 ${vol.current ? 'opacity-50' : ''}`}>
                          {months.map((m) => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <select value={vol.endYear || 'Year'} onChange={(e) => updateVolunteer(index, 'endYear', e.target.value)} disabled={vol.current} className={`${selectClasses} text-xs py-2 ${vol.current ? 'opacity-50' : ''}`}>
                          {years.map((y) => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input type="checkbox" checked={vol.current} onChange={(e) => updateVolunteer(index, 'current', e.target.checked)} className="w-4 h-4 rounded accent-blue-600" />
                    Currently volunteering
                  </label>
                </div>
              </div>
            ))}
            <button onClick={addVolunteer} className={addButtonClasses}>+ Add Volunteer Experience</button>
          </div>
        )

      default:
        return null
    }
  }

  // Count completed sections
  const completedCount = [
    awards.some(a => a.title),
    certifications.some(c => c.name),
    languages.some(l => l.language),
    publications.some(p => p.title),
    memberships.some(m => m.organization),
    volunteer.some(v => v.organization),
  ].filter(Boolean).length

  return (
    <FormPageLayout
      currentStep={7}
      totalSteps={7}
      stepName="Optional"
      title="Final Touches"
      subtitle="Add optional sections to make your resume stand out even more."
      onNavigate={navigateTo}
    >
      <div className="max-w-4xl mx-auto">

        {/* Progress Badge */}
        <div className="flex items-center justify-center mb-8">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-slate-100 border border-slate-200">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <span className="text-slate-700 font-medium">
              {completedCount} section{completedCount !== 1 ? 's' : ''} added
            </span>
            <span className="text-slate-400 text-sm">(all optional)</span>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4 mb-8">
          {optionalSections.map((section) => {
            const hasContent = (() => {
              switch (section.id) {
                case 'awards': return awards.some(a => a.title)
                case 'certifications': return certifications.some(c => c.name)
                case 'languages': return languages.some(l => l.language)
                case 'publications': return publications.some(p => p.title)
                case 'memberships': return memberships.some(m => m.organization)
                case 'volunteer': return volunteer.some(v => v.organization)
                default: return false
              }
            })()

            return (
              <GlassCard key={section.id} className="overflow-hidden" hover={false}>
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-start gap-4 p-5 text-left transition-colors hover:bg-slate-50"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${hasContent
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-slate-100 text-slate-500'
                    }`}>
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900">{section.title}</h3>
                      {hasContent && <CheckCircle2Icon className="w-4 h-4 text-emerald-500" />}
                    </div>
                    <p className="text-sm text-slate-500">{section.description}</p>
                  </div>
                  {expandedSection === section.id ? (
                    <ChevronUpIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                {expandedSection === section.id && (
                  <div className="px-5 pb-5 border-t border-slate-100">
                    <div className="mt-4">
                      {renderSectionContent(section.id)}
                    </div>
                  </div>
                )}
              </GlassCard>
            )
          })}
        </div>

        <FormNavigation
          onBack={handleBack}
          onNext={handleNext}
          nextLabel="Finish & Preview"
        />
      </div>
    </FormPageLayout>
  )
}