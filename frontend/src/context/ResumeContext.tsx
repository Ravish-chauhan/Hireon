import React, { useState, createContext, useContext, ReactNode, useMemo, useCallback, useEffect } from 'react'
import { TemplateResumeData } from '../types/resume'
import { resumeService } from '../services/resumeService'

type ResumeFormData = {
  // Bio/Personal Info
  bio: {
    firstName: string
    surname: string
    city: string
    country: string
    pinCode: string
    phone: string
    email: string
    linkedin?: string
    github?: string
    website?: string
    image?: string
    socialLinks?: { id: string; platform: string; url: string }[]
    socialLinksFormat?: 'name' | 'url'
  }
  // Summary with job context
  summary: {
    jobTitle: string
    jobDescription: string
    content: string
  }
  // Skills with categories
  skills: {
    [category: string]: string[]
  }
  // Experience entries
  experience: {
    id: string
    jobTitle: string
    employer: string
    city: string
    country: string
    startMonth: string
    startYear: string
    endMonth: string
    endYear: string
    currentlyWorkHere: boolean
    description: string
  }[]
  // Education entries
  education: {
    id: string
    schoolName: string
    schoolLocation: string
    degree: string
    fieldOfStudy: string
    gpa: string
    startMonth: string
    startYear: string
    gradMonth: string
    gradYear: string
    stillEnrolled: boolean
    achievements: string[]
    activities: string
    editorContent: string
  }[]
  // Project entries
  projects: {
    id: string
    projectName: string
    projectRole: string
    projectLink: string
    startMonth: string
    startYear: string
    endMonth: string
    endYear: string
    currentProject: boolean
    description: string
  }[]
  // Optional details
  optionalDetails: {
    certifications: {
      id: string
      name: string
      issuer: string
      date?: string
      month?: string
      year?: string
    }[]
    languages: {
      id: string
      language: string
      proficiency: string
    }[]
    awards: {
      id: string
      title: string
      description: string
      date?: string
      month?: string
      year?: string
    }[]
    publications: {
      id: string
      title: string
      authors: string
      journal: string
      url?: string
      month?: string
      year?: string
    }[]
    memberships: {
      id: string
      organization: string
      role?: string
      startMonth?: string
      startYear?: string
      endMonth?: string
      endYear?: string
      current: boolean
    }[]
    volunteer: {
      id: string
      organization: string
      role: string
      description: string
      startMonth?: string
      startYear?: string
      endMonth?: string
      endYear?: string
      current: boolean
    }[]
  }
}

type ResumeContextType = {
  resumeData: ResumeFormData
  selectedTemplate: string
  templateData: TemplateResumeData
  updateBio: (bio: Partial<ResumeFormData['bio']>) => void
  updateSummary: (summary: Partial<ResumeFormData['summary']>) => void
  updateSkills: (skills: ResumeFormData['skills']) => void
  updateExperience: (experience: ResumeFormData['experience']) => void
  updateEducation: (education: ResumeFormData['education']) => void
  updateProjects: (projects: ResumeFormData['projects']) => void
  updateOptionalDetails: (details: Partial<ResumeFormData['optionalDetails']>) => void
  setSelectedTemplate: (templateId: string) => void
  setResumeData: React.Dispatch<React.SetStateAction<ResumeFormData>>
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined)

export function ResumeProvider({ children }: { children: ReactNode }) {
  // Initialize template from URL
  const getInitialTemplate = () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      return urlParams.get('template') || 'template-1'
    }
    return 'template-1'
  }

  const [selectedTemplate, setSelectedTemplateState] = useState(getInitialTemplate)

  // Load draft data if editing existing draft
  useEffect(() => {
    const loadDraftData = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const draftId = urlParams.get('draft')

      if (draftId) {
        try {
          const draft = await resumeService.getDraft(draftId)
          if (draft.data) {
            setResumeData(draft.data.resumeData || draft.data)
            setSelectedTemplateState(draft.template)
          }
        } catch (error) {
          console.error('Failed to load draft:', error)
        }
      }
    }

    loadDraftData()
  }, [])

  const setSelectedTemplate = useCallback((templateId: string) => {
    setSelectedTemplateState(templateId)
  }, [])
  // Initialize with default data (draft loading handled separately)
  const getInitialResumeData = (): ResumeFormData => {

    return {
      bio: {
        firstName: 'John',
        surname: 'Doe',
        city: 'New York',
        country: 'USA',
        pinCode: '10001',
        phone: '+1 (555) 123-4567',
        email: 'john.doe@email.com',
        linkedin: 'linkedin.com/in/johndoe',
        github: 'github.com/johndoe'
      },
      summary: {
        jobTitle: '',
        jobDescription: '',
        content: 'Experienced professional with a strong background in technology and innovation.'
      },
      skills: {
        'Technical Skills': ['JavaScript', 'React', 'Node.js'],
        'Soft Skills': ['Leadership', 'Communication', 'Problem Solving']
      },
      experience: [],
      education: [],
      projects: [],
      optionalDetails: {
        certifications: [],
        languages: [],
        awards: [],
        publications: [],
        memberships: [],
        volunteer: []
      }
    }
  }

  const [resumeData, setResumeData] = useState<ResumeFormData>(getInitialResumeData())

  // Convert form data to template format with proper null checks
  const templateData: TemplateResumeData = useMemo(() => ({
    personalInfo: {
      name: `${resumeData.bio?.firstName || ''} ${resumeData.bio?.surname || ''}`.trim() || 'Your Name',
      title: resumeData.summary?.jobTitle || '',
      image: resumeData.bio?.image,
      contact: {
        email: resumeData.bio?.email || '',
        phone: resumeData.bio?.phone || '',
        location: `${resumeData.bio?.city || ''}, ${resumeData.bio?.country || ''}`.replace(', ', '') || '',
        linkedin: resumeData.bio?.linkedin,
        github: resumeData.bio?.github,
        website: resumeData.bio?.website,
        socialLinks: resumeData.bio?.socialLinks?.length ? resumeData.bio.socialLinks : [
          ...(resumeData.bio?.linkedin ? [{ id: 'old-li', platform: 'LinkedIn', url: resumeData.bio.linkedin }] : []),
          ...(resumeData.bio?.github ? [{ id: 'old-gh', platform: 'GitHub', url: resumeData.bio.github }] : []),
          ...(resumeData.bio?.website ? [{ id: 'old-web', platform: 'Portfolio', url: resumeData.bio.website }] : [])
        ],
        socialLinksFormat: resumeData.bio?.socialLinksFormat || 'name'
      }
    },
    summary: resumeData.summary?.content || '',
    experience: resumeData.experience?.map(exp => ({
      id: exp.id || `exp-${Date.now()}`,
      title: exp.jobTitle || '',
      company: exp.employer || '',
      location: `${exp.city || ''}, ${exp.country || ''}`.replace(', ', '') || '',
      startDate: `${exp.startMonth || ''} ${exp.startYear || ''}`.trim() || '',
      endDate: exp.currentlyWorkHere ? 'Present' : `${exp.endMonth || ''} ${exp.endYear || ''}`.trim() || '',
      description: exp.description ? exp.description.split('\n').filter(line => line.trim()) : []
    })) || [],
    education: resumeData.education?.map(edu => {
      // Combine achievements and editor content for description
      const achievements = edu.achievements?.filter(a => a.trim()).join(' • ') || ''
      const editorPoints = edu.editorContent ? edu.editorContent.split('\n').filter(line => line.trim()) : []
      const allDescriptions = [...(achievements ? [achievements] : []), ...editorPoints].filter(d => d.trim())

      return {
        id: edu.id || `edu-${Date.now()}`,
        degree: edu.degree || '',
        institution: edu.schoolName || '',
        location: edu.schoolLocation || '',
        graduationDate: edu.stillEnrolled ? 'Expected' : `${edu.gradMonth || ''} ${edu.gradYear || ''}`.trim() || '',
        gpa: edu.gpa,
        honors: achievements,
        coursework: editorPoints,
        description: allDescriptions
      }
    }) || [],
    skills: resumeData.skills ? Object.entries(resumeData.skills).map(([category, skills], index) => ({
      id: `skill-${index}`,
      category,
      skills: skills || []
    })) : [],
    projects: resumeData.projects?.map(proj => ({
      id: proj.id || `proj-${Date.now()}`,
      name: proj.projectName || '',
      role: proj.projectRole || '',
      description: proj.description ? proj.description.split('\n').filter(line => line.trim()) : [],
      startDate: `${proj.startMonth !== 'Month' ? proj.startMonth : ''} ${proj.startYear !== 'Year' ? proj.startYear : ''}`.trim() || '',
      endDate: proj.currentProject ? 'Present' : `${proj.endMonth !== 'Month' ? proj.endMonth : ''} ${proj.endYear !== 'Year' ? proj.endYear : ''}`.trim() || '',
      date: proj.currentProject ? 'Ongoing' : `${proj.endMonth !== 'Month' ? proj.endMonth : ''} ${proj.endYear !== 'Year' ? proj.endYear : ''}`.trim() || '',
      link: proj.projectLink,
      technologies: []
    })) || [],
    certificates: resumeData.optionalDetails?.certifications?.map(cert => ({
      ...cert,
      date: cert.month && cert.year && cert.month !== 'Month' && cert.year !== 'Year'
        ? `${cert.month} ${cert.year}`
        : cert.date || ''
    })) || [],
    awards: resumeData.optionalDetails?.awards?.map(award => ({
      ...award,
      date: award.month && award.year && award.month !== 'Month' && award.year !== 'Year'
        ? `${award.month} ${award.year}`
        : award.date || ''
    })) || [],
    languages: resumeData.optionalDetails?.languages || [],
    publications: resumeData.optionalDetails?.publications?.map(pub => ({
      ...pub,
      date: pub.month && pub.year && pub.month !== 'Month' && pub.year !== 'Year'
        ? `${pub.month} ${pub.year}`
        : ''
    })) || [],
    memberships: resumeData.optionalDetails?.memberships?.map(mem => ({
      ...mem,
      startDate: mem.startMonth && mem.startYear && mem.startMonth !== 'Month' && mem.startYear !== 'Year'
        ? `${mem.startMonth} ${mem.startYear}` : '',
      endDate: mem.current ? 'Present' :
        (mem.endMonth && mem.endYear && mem.endMonth !== 'Month' && mem.endYear !== 'Year'
          ? `${mem.endMonth} ${mem.endYear}` : '')
    })) || [],
    volunteer: resumeData.optionalDetails?.volunteer?.map(vol => ({
      ...vol,
      startDate: vol.startMonth && vol.startYear && vol.startMonth !== 'Month' && vol.startYear !== 'Year'
        ? `${vol.startMonth} ${vol.startYear}` : '',
      endDate: vol.current ? 'Present' :
        (vol.endMonth && vol.endYear && vol.endMonth !== 'Month' && vol.endYear !== 'Year'
          ? `${vol.endMonth} ${vol.endYear}` : '')
    })) || [],
    sectionOrder: ['summary', 'experience', 'skills', 'education', 'projects', 'certificates', 'awards', 'languages']
  }), [resumeData])

  const updateBio = useCallback((bio: Partial<ResumeFormData['bio']>) => {
    setResumeData((prev) => ({
      ...prev,
      bio: {
        ...prev.bio,
        ...bio,
      },
    }))
  }, [])

  const updateSummary = useCallback((summary: Partial<ResumeFormData['summary']>) => {
    setResumeData((prev) => ({
      ...prev,
      summary: {
        ...prev.summary,
        ...summary,
      },
    }))
  }, [])

  const updateSkills = useCallback((skills: ResumeFormData['skills']) => {
    setResumeData((prev) => ({
      ...prev,
      skills,
    }))
  }, [])

  const updateExperience = useCallback((experience: ResumeFormData['experience']) => {
    setResumeData((prev) => ({
      ...prev,
      experience,
    }))
  }, [])

  const updateEducation = useCallback((education: ResumeFormData['education']) => {
    setResumeData((prev) => ({
      ...prev,
      education,
    }))
  }, [])

  const updateProjects = useCallback((projects: ResumeFormData['projects']) => {
    setResumeData((prev) => ({
      ...prev,
      projects,
    }))
  }, [])

  const updateOptionalDetails = useCallback((details: Partial<ResumeFormData['optionalDetails']>) => {
    setResumeData((prev) => ({
      ...prev,
      optionalDetails: {
        ...prev.optionalDetails,
        ...details,
      },
    }))
  }, [])

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        selectedTemplate,
        templateData,
        updateBio,
        updateSummary,
        updateSkills,
        updateExperience,
        updateEducation,
        updateProjects,
        updateOptionalDetails,
        setSelectedTemplate,
        setResumeData,
      }}
    >
      {children}
    </ResumeContext.Provider>
  )
}

export function useResume() {
  const context = useContext(ResumeContext)
  if (!context) {
    throw new Error('useResume must be used within ResumeProvider')
  }
  return context
}