import React, { useState, useRef, useEffect } from 'react'
import { useResume } from '../context/ResumeContext'
import { resumeTemplates } from '../components/resume/templates'
import resumeService from '../services/resumeService'

import {
  FileTextIcon,
  Edit2Icon,
  ChevronDownIcon,
  PlusIcon,
  ArrowLeft,
  SettingsIcon,
  LayoutIcon,
  DownloadIcon,
  CheckIcon,
  XIcon,
  FileIcon,
  BookOpenIcon,
  Loader2Icon,
  Palette,
  Type,
  LayoutTemplate
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const sections = [
  'Heading',
  'Summary',
  'Skills',
  'Experience',
  'Education and Training',
  'Languages',
]

type FinalDraftPageProps = {
  onNavigate?: (page: string) => void
}

export function FinalDraftPage({ onNavigate }: FinalDraftPageProps) {
  const navigate = useNavigate()
  const { templateData, selectedTemplate, setSelectedTemplate } = useResume()
  // Default name from data or fallback
  const [resumeName, setResumeName] = useState(templateData.personalInfo.name ? `${templateData.personalInfo.name.split(' ')[0]}'s Resume` : 'My Resume')
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false)
  const [showMobileDesign, setShowMobileDesign] = useState(false)
  const [showMobileActions, setShowMobileActions] = useState(false)
  const [currentView, setCurrentView] = useState<'resume' | 'sop' | 'cover'>('resume')
  const [sopData, setSopData] = useState<any>(null)
  const [coverLetterData, setCoverLetterData] = useState<any>(null)
  const [showSopForm, setShowSopForm] = useState(false)
  const [showCoverForm, setShowCoverForm] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const resumeRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [documentSettings, setDocumentSettings] = useState({
    marginX: 0.6,
    marginY: 0.6,
    fontFamilyName: 'Inter',
    fontFamilyHeading: 'Inter',
    fontFamilyBody: 'Inter',
    fontSizeName: 32,
    fontSizeHeading: 16,
    fontSizeBody: 13,
    lineSpacing: 1.5,
    skillsLayout: 'inline-wrap',
    skillsSeparator: ' • ',
    spacingSkillsItem: 8,
    spacingSection: 24,
    spacingSectionHeading: 12,
    spacingItem: 20,
    spacingRoleCompany: 4,
    spacingRoleDescription: 8,
    spacingListItems: 4,
    spacingSkillsRow: 8,
    headerAlignment: 'left',
    spacingNameTitle: 6,
    spacingTitleContact: 8
  })
  
  const [activeTab, setActiveTab] = useState<'design' | 'typography' | 'templates'>('typography')

  // Dynamically load selected Google Fonts into the browser DOM so live preview works
  useEffect(() => {
    const uniqueFonts = Array.from(new Set([
      documentSettings.fontFamilyName, 
      documentSettings.fontFamilyHeading, 
      documentSettings.fontFamilyBody
    ]));
    
    uniqueFonts.forEach(font => {
      const fontId = `google-font-${font.replace(/\s+/g, '-')}`;
      if (!document.getElementById(fontId)) {
        const link = document.createElement('link');
        link.id = fontId;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, '+')}:wght@400;500;600;700&display=swap`;
        document.head.appendChild(link);
      }
    });
  }, [documentSettings.fontFamilyName, documentSettings.fontFamilyHeading, documentSettings.fontFamilyBody]);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const padding = window.innerWidth < 1024 ? 32 : 64
        const containerWidth = containerRef.current.clientWidth - padding
        const resumeWidth = 8.5 * 96 // 816px

        if (containerWidth < resumeWidth) {
          setScale(containerWidth / resumeWidth)
        } else {
          // On desktop, don't let it get too huge if the screen is massive
          const maxScale = 1.1
          const calculatedScale = containerWidth / resumeWidth
          setScale(Math.min(calculatedScale, maxScale))
        }
      }
    }

    updateScale()
    // Small delay to ensure containerRef is ready
    const timer = setTimeout(updateScale, 100)
    window.addEventListener('resize', updateScale)
    return () => {
      window.removeEventListener('resize', updateScale)
      clearTimeout(timer)
    }
  }, [])

  const handleSaveDraft = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const draftId = urlParams.get('draft')

      const draft = {
        id: draftId || undefined,
        userId: 'current-user-id', // TODO: Get from auth context
        name: resumeName,
        template: selectedTemplate,
        data: {
          resumeData: templateData,
          selectedTemplate
        }
      }

      await resumeService.saveDraft(draft)
      alert('Draft saved successfully!')
    } catch (error) {
      console.error('Failed to save draft:', error)
      alert('Failed to save draft. Please try again.')
    }
  }

  const generateSOP = async (formData: any) => {
    setIsGenerating(true)
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://api.eduniaa.com/api'}/ai/generate-sop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData: templateData,
          sopDetails: formData
        })
      })
      const result = await response.json()
      setSopData(result.sopContent)
      setShowSopForm(false)
      setCurrentView('sop')
    } catch (error) {
      console.error('SOP generation failed:', error)
      alert('Failed to generate SOP. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const generateCoverLetter = async (formData: any) => {
    setIsGenerating(true)
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://api.eduniaa.com/api'}/ai/generate-cover-letter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData: templateData,
          jobDetails: formData
        })
      })
      const result = await response.json()
      setCoverLetterData(result.coverContent)
      setShowCoverForm(false)
      setCurrentView('cover')
    } catch (error) {
      console.error('Cover letter generation failed:', error)
      alert('Failed to generate cover letter. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async (format: 'pdf' | 'word', documentType: 'resume' | 'sop' | 'cover' = 'resume') => {
    if (!resumeRef.current) return

    setShowDownloadDropdown(false)
    
    const getDocumentName = () => {
      const baseName = resumeName.replace(/[^a-z0-9]/gi, '_').toLowerCase()
      switch (documentType) {
        case 'sop': return `${baseName}_sop`
        case 'cover': return `${baseName}_cover_letter`
        default: return baseName
      }
    }

    if (format === 'pdf') {
      setIsDownloading(true)
      try {
        // ── Collect ALL stylesheets (same-origin + external fonts) ──
        const inlineStyles: string[] = []
        const fontLinkFetches: Promise<string>[] = []

        Array.from(document.styleSheets).forEach(sheet => {
          if (sheet.href) {
            // External stylesheet (e.g. Google Fonts CDN) — fetch its raw CSS text
            fontLinkFetches.push(
              fetch(sheet.href)
                .then(r => r.text())
                .catch(() => '') // silently skip if blocked
            )
          } else {
            // Same-origin inline/embedded stylesheet — read cssRules directly
            try {
              if (sheet.cssRules) {
                const rules = Array.from(sheet.cssRules)
                  .map(rule => rule.cssText)
                  .join('\n')
                inlineStyles.push(rules)
              }
            } catch {
              // cross-origin without CORS — skip
            }
          }
        })

        const externalStyles = await Promise.all(fontLinkFetches)
        let allStyles = [...externalStyles, ...inlineStyles].join('\n')
        
        // Strip any existing Google Fonts @import rules from the app's stylesheets
        // We do this because we only want to inject the specific font selected by the user.
        // Otherwise Puppeteer will try to download and embed all 10 font families (76 files), causing a timeout.
        allStyles = allStyles.replace(/@import\s+url\([^)]*fonts\.googleapis\.com[^)]*\)\s*;?/gi, '');

        // ── Strip the transform:scale() wrapper before sending to Puppeteer ──
        const cloneNode = resumeRef.current.cloneNode(true) as HTMLElement
        cloneNode.style.transform = 'none'
        cloneNode.style.transformOrigin = 'unset'
        cloneNode.style.width = '816px'   // exact A4 width at 96dpi
        cloneNode.style.minHeight = '1056px'
        const cleanHTML = cloneNode.outerHTML
        
        console.log("🚀 Generating PDF. Stripped extra fonts. allStyles length:", allStyles.length);

        // ── Build complete standalone HTML document ──
        // Explicit Google Fonts @import for ALL fonts used across templates
        // This ensures the fontEmbedder can find and base64-inline every font file.
        const uniqueFonts = Array.from(new Set([
          documentSettings.fontFamilyName, 
          documentSettings.fontFamilyHeading, 
          documentSettings.fontFamilyBody
        ]));
        
        const fontImports = uniqueFonts.map(font => 
          `@import url('https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, '+')}:wght@400;500;600;700&display=swap');`
        ).join('\n');

        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Resume</title>
            <style>
              /* ── Selected Google Fonts ── */
              ${fontImports}

              /* ── High-quality vector PDF base styles ── */
              @page {
                margin: 0;
                size: 210mm 297mm;
              }
              html, body {
                margin: 0;
                padding: 0;
                width: 816px;
                background: white;
              }
              * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
                /* Crisp antialiased text — matches Canva/Figma export quality */
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                text-rendering: geometricPrecision;
              }
              /* Ensure SVG icons (lucide-react) render crisply */
              svg {
                shape-rendering: geometricPrecision;
              }
              /* All app styles including fonts from browser */
              ${allStyles}
            </style>
          </head>
          <body>
            ${cleanHTML}
          </body>
          </html>
        `

        // ── Send to Puppeteer backend (sole PDF engine) ──
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL || 'https://api.eduniaa.com/api'}/pdf/generate-resume-pdf`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              html: htmlContent,
              filename: `${getDocumentName()}.pdf`
            })
          }
        )

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('PDF generation error:', errorData)
          throw new Error(errorData.details || errorData.error || 'PDF generation failed')
        }

        // Download the PDF
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${getDocumentName()}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

      } catch (error: any) {
        console.error('PDF generation failed:', error)
        alert(`PDF generation failed: ${error.message || 'Unknown error'}. Please check your connection and try again.`)
      } finally {
        setIsDownloading(false)
      }
    } else if (format === 'word') {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Resume</title>
        </head>
        <body>
          ${resumeRef.current.outerHTML}
        </body>
        </html>
      `

      const blob = new Blob([htmlContent], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      })

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${getDocumentName()}.docx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const currentTemplate = resumeTemplates.find(t => t.id === selectedTemplate) || resumeTemplates[0]
  const TemplateComponent = currentTemplate.component

  const renderCurrentView = () => {
    if (currentView === 'resume') {
      return <TemplateComponent data={{ ...templateData, settings: documentSettings }} />
    } else if (currentView === 'sop' && sopData) {
      return (
        <div className="p-8 bg-white h-full">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">Statement of Purpose</h1>
            <div className="space-y-4 text-justify leading-relaxed">
              {sopData.split('\n').map((paragraph: string, index: number) => (
                paragraph.trim() && <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      )
    } else if (currentView === 'cover' && coverLetterData) {
      return (
        <div className="p-8 bg-white h-full">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="text-right mb-4">
                <p>{templateData.personalInfo.name}</p>
                <p>{(templateData.personalInfo as any).email || 'Email not provided'}</p>
                <p>{(templateData.personalInfo as any).phone || 'Phone not provided'}</p>
              </div>
              <div className="mb-6">
                <p>{new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <div className="space-y-4 text-justify leading-relaxed">
              {coverLetterData.split('\n').map((paragraph: string, index: number) => (
                paragraph.trim() && <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
            <div className="mt-8">
              <p>Sincerely,</p>
              <p className="mt-4">{templateData.personalInfo.name}</p>
            </div>
          </div>
        </div>
      )
    }
    return <TemplateComponent data={{ ...templateData, settings: documentSettings }} />
  }

  const handleSectionClick = (sectionIndex: number) => {
    const pageMap = [
      'bio',
      'summary',
      'skills',
      'experience',
      'education',
      'optional',
    ]
    if (onNavigate && pageMap[sectionIndex]) {
      onNavigate(pageMap[sectionIndex])
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-[#2C3E5F]">
      {/* Left Sidebar - Canva-Style Editor - Hidden on Mobile */}
      <aside className="hidden lg:flex w-96 flex-col border-r border-gray-700 bg-[#1E293B]">
        <div className="p-6 pb-2 border-b border-gray-700">
          <button
            onClick={() => navigate('/resume-builder')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Templates
          </button>
          
          <div className="flex gap-2 mb-4 bg-gray-800 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('design')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === 'design' ? 'bg-[#FF6B5A] text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
            >
              <Palette className="w-4 h-4" />
              Design
            </button>
            <button 
              onClick={() => setActiveTab('typography')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === 'typography' ? 'bg-[#FF6B5A] text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
            >
              <Type className="w-4 h-4" />
              Text
            </button>
            <button 
              onClick={() => setActiveTab('templates')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === 'templates' ? 'bg-[#FF6B5A] text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
            >
              <LayoutTemplate className="w-4 h-4" />
              Theme
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6" data-lenis-prevent>
          {activeTab === 'design' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="space-y-6">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <LayoutIcon className="w-5 h-5 text-[#FF6B5A]" />
                  Spacing & Margins
                </h3>
                
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 space-y-5">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm text-gray-300 font-medium">Horizontal Margin</label>
                      <span className="text-xs font-semibold bg-gray-700 text-gray-300 px-2 py-1 rounded">{documentSettings.marginX}in</span>
                    </div>
                    <input 
                      type="range" min="0" max="1.5" step="0.1"
                      value={documentSettings.marginX}
                      onChange={(e) => setDocumentSettings(s => ({ ...s, marginX: Number(e.target.value) }))}
                      className="w-full accent-[#FF6B5A]"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm text-gray-300 font-medium">Vertical Margin</label>
                      <span className="text-xs font-semibold bg-gray-700 text-gray-300 px-2 py-1 rounded">{documentSettings.marginY}in</span>
                    </div>
                    <input 
                      type="range" min="0" max="1.5" step="0.1"
                      value={documentSettings.marginY}
                      onChange={(e) => setDocumentSettings(s => ({ ...s, marginY: Number(e.target.value) }))}
                      className="w-full accent-[#FF6B5A]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm text-gray-300 font-medium">Line Spacing</label>
                      <span className="text-xs font-semibold bg-gray-700 text-gray-300 px-2 py-1 rounded">{documentSettings.lineSpacing}x</span>
                    </div>
                    <input 
                      type="range" min="1.0" max="2.5" step="0.1"
                      value={documentSettings.lineSpacing}
                      onChange={(e) => setDocumentSettings(s => ({ ...s, lineSpacing: Number(e.target.value) }))}
                      className="w-full accent-[#FF6B5A]"
                    />
                  </div>

                  {/* Advanced Spacing Settings */}
                  <div className="border-t border-gray-700 pt-4 mt-4 space-y-5">
                    <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Advanced Margins</h4>

                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm text-gray-300 font-medium">Section Gap</label>
                        <span className="text-xs font-semibold bg-gray-700 text-gray-300 px-2 py-1 rounded">{documentSettings.spacingSection}px</span>
                      </div>
                      <input type="range" min="8" max="48" step="1" value={documentSettings.spacingSection} onChange={(e) => setDocumentSettings(s => ({ ...s, spacingSection: Number(e.target.value) }))} className="w-full accent-[#FF6B5A]" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm text-gray-300 font-medium">Section Heading Gap</label>
                        <span className="text-xs font-semibold bg-gray-700 text-gray-300 px-2 py-1 rounded">{documentSettings.spacingSectionHeading}px</span>
                      </div>
                      <input type="range" min="0" max="32" step="1" value={documentSettings.spacingSectionHeading} onChange={(e) => setDocumentSettings(s => ({ ...s, spacingSectionHeading: Number(e.target.value) }))} className="w-full accent-[#FF6B5A]" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm text-gray-300 font-medium">Item Gap</label>
                        <span className="text-xs font-semibold bg-gray-700 text-gray-300 px-2 py-1 rounded">{documentSettings.spacingItem}px</span>
                      </div>
                      <input type="range" min="4" max="32" step="1" value={documentSettings.spacingItem} onChange={(e) => setDocumentSettings(s => ({ ...s, spacingItem: Number(e.target.value) }))} className="w-full accent-[#FF6B5A]" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm text-gray-300 font-medium">Role / Company Gap</label>
                        <span className="text-xs font-semibold bg-gray-700 text-gray-300 px-2 py-1 rounded">{documentSettings.spacingRoleCompany}px</span>
                      </div>
                      <input type="range" min="0" max="16" step="1" value={documentSettings.spacingRoleCompany} onChange={(e) => setDocumentSettings(s => ({ ...s, spacingRoleCompany: Number(e.target.value) }))} className="w-full accent-[#FF6B5A]" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm text-gray-300 font-medium">Description Gap</label>
                        <span className="text-xs font-semibold bg-gray-700 text-gray-300 px-2 py-1 rounded">{documentSettings.spacingRoleDescription}px</span>
                      </div>
                      <input type="range" min="0" max="24" step="1" value={documentSettings.spacingRoleDescription} onChange={(e) => setDocumentSettings(s => ({ ...s, spacingRoleDescription: Number(e.target.value) }))} className="w-full accent-[#FF6B5A]" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm text-gray-300 font-medium">Bullet Point Gap</label>
                        <span className="text-xs font-semibold bg-gray-700 text-gray-300 px-2 py-1 rounded">{documentSettings.spacingListItems}px</span>
                      </div>
                      <input type="range" min="0" max="16" step="1" value={documentSettings.spacingListItems} onChange={(e) => setDocumentSettings(s => ({ ...s, spacingListItems: Number(e.target.value) }))} className="w-full accent-[#FF6B5A]" />
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-4 mt-4 space-y-5">
                    <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Header Styling</h4>

                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm text-gray-300 font-medium">Header Alignment</label>
                      </div>
                      <select
                        value={documentSettings.headerAlignment}
                        onChange={(e) => setDocumentSettings(s => ({ ...s, headerAlignment: e.target.value }))}
                        className="w-full p-2.5 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-[#FF6B5A] outline-none text-sm transition-colors"
                      >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm text-gray-300 font-medium">Name & Title Spacing</label>
                        <span className="text-xs font-semibold bg-gray-700 text-gray-300 px-2 py-1 rounded">{documentSettings.spacingNameTitle}px</span>
                      </div>
                      <input type="range" min="0" max="24" step="1" value={documentSettings.spacingNameTitle} onChange={(e) => setDocumentSettings(s => ({ ...s, spacingNameTitle: Number(e.target.value) }))} className="w-full accent-[#FF6B5A]" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm text-gray-300 font-medium">Title & Contact Spacing</label>
                        <span className="text-xs font-semibold bg-gray-700 text-gray-300 px-2 py-1 rounded">{documentSettings.spacingTitleContact}px</span>
                      </div>
                      <input type="range" min="0" max="24" step="1" value={documentSettings.spacingTitleContact} onChange={(e) => setDocumentSettings(s => ({ ...s, spacingTitleContact: Number(e.target.value) }))} className="w-full accent-[#FF6B5A]" />
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-4 mt-4 space-y-5">
                    <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Skills Styling</h4>

                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm text-gray-300 font-medium">Skills Layout</label>
                      </div>
                      <select
                        value={documentSettings.skillsLayout}
                        onChange={(e) => setDocumentSettings(s => ({ ...s, skillsLayout: e.target.value }))}
                        className="w-full p-2.5 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-[#FF6B5A] outline-none text-sm transition-colors"
                      >
                        <option value="inline-wrap">Inline Flow (Side-by-side wrap)</option>
                        <option value="inline-stacked">Stacked Row (One category per line, inline)</option>
                        <option value="block">Block (One category per line, values below)</option>
                        <option value="two-column">Two Column Grid</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm text-gray-300 font-medium">Skills Separator</label>
                      </div>
                      <select
                        value={documentSettings.skillsSeparator}
                        onChange={(e) => setDocumentSettings(s => ({ ...s, skillsSeparator: e.target.value }))}
                        className="w-full p-2.5 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-[#FF6B5A] outline-none text-sm transition-colors"
                      >
                        <option value=" • ">Bullet ( • )</option>
                        <option value=", ">Comma (, )</option>
                        <option value=" | ">Pipe ( | )</option>
                        <option value=" - ">Dash ( - )</option>
                        <option value=" ">Space Only</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm text-gray-300 font-medium">Skill Item Gap</label>
                        <span className="text-xs font-semibold bg-gray-700 text-gray-300 px-2 py-1 rounded">{documentSettings.spacingSkillsItem}px</span>
                      </div>
                      <input type="range" min="0" max="24" step="1" value={documentSettings.spacingSkillsItem} onChange={(e) => setDocumentSettings(s => ({ ...s, spacingSkillsItem: Number(e.target.value) }))} className="w-full accent-[#FF6B5A]" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm text-gray-300 font-medium">Category Row Gap</label>
                        <span className="text-xs font-semibold bg-gray-700 text-gray-300 px-2 py-1 rounded">{documentSettings.spacingSkillsRow}px</span>
                      </div>
                      <input type="range" min="0" max="32" step="1" value={documentSettings.spacingSkillsRow} onChange={(e) => setDocumentSettings(s => ({ ...s, spacingSkillsRow: Number(e.target.value) }))} className="w-full accent-[#FF6B5A]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'typography' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                <Type className="w-5 h-5 text-[#FF6B5A]" />
                Typography
              </h3>

              {/* Name Font Settings */}
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 space-y-4">
                <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Name</h4>
                <div>
                  <select
                    value={documentSettings.fontFamilyName}
                    onChange={(e) => setDocumentSettings(s => ({ ...s, fontFamilyName: e.target.value }))}
                    className="w-full p-2.5 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-[#FF6B5A] outline-none text-sm transition-colors"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Merriweather">Merriweather</option>
                    <option value="Playfair Display">Playfair Display</option>
                  </select>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-gray-300 font-medium">Size</label>
                    <span className="text-xs font-semibold bg-gray-700 text-gray-300 px-2 py-1 rounded">{documentSettings.fontSizeName}px</span>
                  </div>
                  <input 
                    type="range" min="20" max="48" step="1"
                    value={documentSettings.fontSizeName}
                    onChange={(e) => setDocumentSettings(s => ({ ...s, fontSizeName: Number(e.target.value) }))}
                    className="w-full accent-[#FF6B5A]"
                  />
                </div>
              </div>

              {/* Heading Font Settings */}
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 space-y-4">
                <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Headings</h4>
                <div>
                  <select
                    value={documentSettings.fontFamilyHeading}
                    onChange={(e) => setDocumentSettings(s => ({ ...s, fontFamilyHeading: e.target.value }))}
                    className="w-full p-2.5 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-[#FF6B5A] outline-none text-sm transition-colors"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Merriweather">Merriweather</option>
                    <option value="Playfair Display">Playfair Display</option>
                  </select>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-gray-300 font-medium">Size</label>
                    <span className="text-xs font-semibold bg-gray-700 text-gray-300 px-2 py-1 rounded">{documentSettings.fontSizeHeading}px</span>
                  </div>
                  <input 
                    type="range" min="12" max="24" step="1"
                    value={documentSettings.fontSizeHeading}
                    onChange={(e) => setDocumentSettings(s => ({ ...s, fontSizeHeading: Number(e.target.value) }))}
                    className="w-full accent-[#FF6B5A]"
                  />
                </div>
              </div>

              {/* Body Font Settings */}
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 space-y-4">
                <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Body Text</h4>
                <div>
                  <select
                    value={documentSettings.fontFamilyBody}
                    onChange={(e) => setDocumentSettings(s => ({ ...s, fontFamilyBody: e.target.value }))}
                    className="w-full p-2.5 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-[#FF6B5A] outline-none text-sm transition-colors"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Merriweather">Merriweather</option>
                    <option value="Playfair Display">Playfair Display</option>
                  </select>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-gray-300 font-medium">Size</label>
                    <span className="text-xs font-semibold bg-gray-700 text-gray-300 px-2 py-1 rounded">{documentSettings.fontSizeBody}px</span>
                  </div>
                  <input 
                    type="range" min="9" max="16" step="1"
                    value={documentSettings.fontSizeBody}
                    onChange={(e) => setDocumentSettings(s => ({ ...s, fontSizeBody: Number(e.target.value) }))}
                    className="w-full accent-[#FF6B5A]"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                <LayoutTemplate className="w-5 h-5 text-[#FF6B5A]" />
                Resume Templates
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {resumeTemplates.map((template) => {
                  const ThumbnailComponent = template.component
                  return (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`relative aspect-[8.5/11] bg-white rounded-lg overflow-hidden group transition-all duration-200 ${
                        selectedTemplate === template.id 
                          ? 'ring-4 ring-[#FF6B5A] shadow-lg shadow-[#FF6B5A]/20 scale-[1.02]' 
                          : 'hover:ring-4 hover:ring-gray-500 hover:scale-[1.02] shadow-md'
                      }`}
                    >
                      <div className="w-full h-full relative overflow-hidden">
                        <div className="absolute top-0 left-0" style={{
                          transform: 'scale(0.15)',
                          transformOrigin: 'top left',
                          width: '850px',
                          height: '1100px',
                          pointerEvents: 'none',
                          textAlign: 'initial'
                        }}>
                          <ThumbnailComponent data={templateData} />
                        </div>
                      </div>
                      {selectedTemplate === template.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-[#FF6B5A] rounded-full flex items-center justify-center shadow-md">
                          <CheckIcon className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content - Preview */}
      <main className="flex-1 flex flex-col bg-[#1E293B] relative overflow-hidden">
        <div className="h-16 flex items-center justify-between px-4 lg:justify-center border-b border-gray-700">
          <button
            onClick={() => navigate('/resume-builder')}
            className="lg:hidden p-2 text-gray-400"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-4">
            <div className="flex bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setCurrentView('resume')}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  currentView === 'resume' ? 'bg-white text-gray-900' : 'text-gray-300 hover:text-white'
                }`}
              >
                Resume
              </button>
              {sopData && (
                <button
                  onClick={() => setCurrentView('sop')}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    currentView === 'sop' ? 'bg-white text-gray-900' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  SOP
                </button>
              )}
              {coverLetterData && (
                <button
                  onClick={() => setCurrentView('cover')}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    currentView === 'cover' ? 'bg-white text-gray-900' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Cover Letter
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-white">
              <input
                type="text"
                value={resumeName}
                onChange={(e) => setResumeName(e.target.value)}
                className="bg-transparent text-white font-medium border-b border-gray-500 focus:border-white outline-none px-1 text-center min-w-[150px]"
                placeholder="Enter resume name"
              />
              <Edit2Icon className="w-3 h-3 text-gray-400" />
            </div>
          </div>

          <button className="lg:absolute lg:right-6 text-sm text-white flex items-center gap-1 hover:text-gray-300">
            More Options
            <ChevronDownIcon className="w-4 h-4" />
          </button>
        </div>

        <div
          ref={containerRef}
          className="flex-1 p-4 lg:p-8 flex flex-col items-center overflow-x-hidden overflow-y-auto bg-[#1a1f36] relative"
          data-lenis-prevent
        >
          {/* Main Paper Wrapper */}
          <div
            style={{
              width: `${8.5 * 96 * scale}px`,
              height: `${11 * 96 * scale}px`,
              minHeight: `${11 * 96 * scale}px`,
            }}
            className="flex items-start justify-center transition-all duration-300 ease-out py-4"
          >
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
                width: '850px', // Force desktop-like width behavior
                minHeight: '1100px',
                flexShrink: 0,
              }}
              className="bg-white shadow-2xl overflow-hidden"
            >
              <div 
                ref={resumeRef} 
                className="w-full h-full bg-white transition-all duration-300 relative"
                style={{
                  '--margin-x': `${documentSettings.marginX}in`,
                  '--margin-y': `${documentSettings.marginY}in`,
                  '--font-family-name': `"${documentSettings.fontFamilyName}", sans-serif`,
                  '--font-family-heading': `"${documentSettings.fontFamilyHeading}", sans-serif`,
                  '--font-family-body': `"${documentSettings.fontFamilyBody}", sans-serif`,
                  '--font-size-name': `${documentSettings.fontSizeName}px`,
                  '--font-size-heading': `${documentSettings.fontSizeHeading}px`,
                  '--font-size-body': `${documentSettings.fontSizeBody}px`,
                  '--line-spacing': documentSettings.lineSpacing,
                  '--spacing-section': `${documentSettings.spacingSection}px`,
                  '--spacing-section-heading': `${documentSettings.spacingSectionHeading}px`,
                  '--spacing-item': `${documentSettings.spacingItem}px`,
                  '--spacing-role-company': `${documentSettings.spacingRoleCompany}px`,
                  '--spacing-role-description': `${documentSettings.spacingRoleDescription}px`,
                  '--spacing-list-items': `${documentSettings.spacingListItems}px`,
                  '--spacing-skills-row': `${documentSettings.spacingSkillsRow}px`,
                  '--spacing-name-title': `${documentSettings.spacingNameTitle}px`,
                  '--spacing-title-contact': `${documentSettings.spacingTitleContact}px`,
                  '--header-alignment': documentSettings.headerAlignment,
                } as React.CSSProperties}
              >
                <style>{`
                  /* Global Font Overrides for the Resume */
                  .resume-page {
                    font-family: var(--font-family-body) !important;
                    line-height: var(--line-spacing) !important;
                  }
                  .resume-page * {
                    line-height: var(--line-spacing) !important;
                  }
                  /* Target Name classes across templates */
                  .resume-page h1, 
                  .resume-page .text-\\[32px\\], 
                  .resume-page .text-\\[28px\\], 
                  .resume-page .text-\\[24px\\],
                  .resume-page .text-\\[36px\\] {
                    font-family: var(--font-family-name) !important;
                    font-size: var(--font-size-name) !important;
                  }
                  /* Target Heading classes across templates */
                  .resume-page h2, 
                  .resume-page h3,
                  .resume-page .text-\\[18px\\], 
                  .resume-page .text-\\[16px\\], 
                  .resume-page .text-\\[14px\\] {
                    font-family: var(--font-family-heading) !important;
                    font-size: var(--font-size-heading) !important;
                  }
                  /* Target Body classes across templates */
                  .resume-page p, 
                  .resume-page li, 
                  .resume-page span,
                  .resume-page .text-\\[13px\\], 
                  .resume-page .text-\\[12px\\], 
                  .resume-page .text-\\[11px\\], 
                  .resume-page .text-\\[10px\\],
                  .resume-page .text-\\[9pt\\],
                  .resume-page .text-\\[10pt\\] {
                    font-family: var(--font-family-body) !important;
                    font-size: var(--font-size-body) !important;
                  }
                `}</style>
                {renderCurrentView()}
              </div>
            </div>
          </div>

          {/* PDF Generation Overlay */}
          {isDownloading && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40 rounded-lg">
              <div className="flex flex-col items-center gap-4 p-8 bg-white/10 rounded-2xl border border-white/20">
                <Loader2Icon className="w-10 h-10 text-white animate-spin" />
                <p className="text-white font-semibold text-lg">Generating High-Quality PDF...</p>
                <p className="text-white/70 text-sm text-center max-w-xs">Embedding fonts & rendering vector graphics for crisp output at any zoom level</p>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden flex border-t border-gray-700 bg-[#2C3E5F] px-6 py-3 justify-between items-center sticky bottom-0 z-50">
          <button
            onClick={() => setShowMobileDesign(true)}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-white"
          >
            <LayoutIcon className="w-6 h-6" />
            <span className="text-[10px] font-medium uppercase tracking-wider">Design</span>
          </button>

          <div className="w-px h-8 bg-gray-700" />

          <button
            onClick={() => setShowMobileActions(true)}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-white"
          >
            <SettingsIcon className="w-6 h-6" />
            <span className="text-[10px] font-medium uppercase tracking-wider">Actions</span>
          </button>

          <div className="w-px h-8 bg-gray-700" />

          <button
            onClick={() => handleDownload('pdf')}
            disabled={isDownloading}
            className={`p-3 rounded-full text-white shadow-lg transition-transform ${isDownloading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#4169FF] active:scale-95'}`}
          >
            {isDownloading ? <Loader2Icon className="w-6 h-6 animate-spin" /> : <DownloadIcon className="w-6 h-6" />}
          </button>
        </div>
      </main>

      {/* Right Sidebar - Actions - Hidden on Mobile */}
      <aside className="hidden lg:flex w-72 bg-[#2C3E5F] border-l border-gray-700 flex flex-col">
        <div className="p-6 space-y-6">
          <div className="relative">
            <button
              onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
              className="w-full flex items-center justify-center gap-2 p-3 bg-white rounded hover:bg-gray-50 transition-colors"
            >
              <DownloadIcon className="w-5 h-5 text-gray-700" />
              <span className="text-sm font-medium text-gray-900">Download</span>
              <ChevronDownIcon className="w-4 h-4 text-gray-700" />
            </button>

            {showDownloadDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-2">
                  <div className="text-xs font-semibold text-gray-500 px-2 py-1">Resume</div>
                  <button
                    onClick={() => handleDownload('pdf', 'resume')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded"
                  >
                    Download Resume as PDF
                  </button>
                  <button
                    onClick={() => handleDownload('word', 'resume')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded"
                  >
                    Download Resume as Word
                  </button>
                  
                  {sopData && (
                    <>
                      <div className="text-xs font-semibold text-gray-500 px-2 py-1 mt-2 border-t pt-2">SOP</div>
                      <button
                        onClick={() => handleDownload('pdf', 'sop')}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded"
                      >
                        Download SOP as PDF
                      </button>
                      <button
                        onClick={() => handleDownload('word', 'sop')}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded"
                      >
                        Download SOP as Word
                      </button>
                    </>
                  )}
                  
                  {coverLetterData && (
                    <>
                      <div className="text-xs font-semibold text-gray-500 px-2 py-1 mt-2 border-t pt-2">Cover Letter</div>
                      <button
                        onClick={() => handleDownload('pdf', 'cover')}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded"
                      >
                        Download Cover Letter as PDF
                      </button>
                      <button
                        onClick={() => handleDownload('word', 'cover')}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded"
                      >
                        Download Cover Letter as Word
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleSaveDraft}
            className="w-full py-3 bg-[#4169FF] text-white font-bold rounded hover:bg-[#3158E8] transition-colors shadow-lg"
          >
            Save Draft
          </button>

          <div className="space-y-3">
            <button
              onClick={() => setShowSopForm(true)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 text-white font-medium rounded hover:bg-green-700 transition-colors"
              disabled={isGenerating}
            >
              <BookOpenIcon className="w-4 h-4" />
              {isGenerating ? 'Generating...' : 'Generate SOP'}
            </button>
            
            <button
              onClick={() => setShowCoverForm(true)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 text-white font-medium rounded hover:bg-purple-700 transition-colors"
              disabled={isGenerating}
            >
              <FileIcon className="w-4 h-4" />
              {isGenerating ? 'Generating...' : 'Generate Cover Letter'}
            </button>
          </div>

          <div className="border-t border-dashed border-gray-600 pt-6">
            <button className="flex items-center gap-2 text-[#F5C563] font-medium hover:text-[#E5B553]">
              <span className="text-lg font-serif">AB</span>
              Spell Check
            </button>
          </div>

          <div className="border-t border-dashed border-gray-600 pt-6">
            <h3 className="text-white font-bold mb-4">Resume Sections</h3>
            <div className="space-y-4">
              {sections.map((section, index) => (
                <button
                  key={index}
                  onClick={() => handleSectionClick(index)}
                  className="flex items-center gap-3 text-white hover:text-[#F5C563] transition-colors w-full text-left group"
                >
                  <div className="w-5 h-5 rounded-full bg-white text-[#2C3E5F] flex items-center justify-center text-xs font-bold group-hover:bg-[#F5C563] transition-colors">
                    {index + 1}
                  </div>
                  <span className="text-sm">{section}</span>
                </button>
              ))}
              <button className="flex items-center gap-2 text-[#F5C563] text-sm font-medium hover:text-[#E5B553] ml-1">
                <PlusIcon className="w-4 h-4" />
                Add a section
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Design Drawer */}
      {showMobileDesign && (
        <div className="lg:hidden fixed inset-0 z-[60] flex flex-col bg-[#2C3E5F]">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="text-white font-bold">Design Options</h3>
            <button onClick={() => setShowMobileDesign(false)} className="text-gray-400">
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 text-white pb-32">
            <h3 className="font-medium mb-4 border-t border-gray-700 pt-4 mt-4">Document Settings</h3>
            
            <div className="space-y-6 mb-8">
              {/* Margins */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider block">Margin X (Left/Right)</label>
                  <span className="text-xs text-white">{documentSettings.marginX}in</span>
                </div>
                <input 
                  type="range" min="0" max="1.5" step="0.1"
                  value={documentSettings.marginX}
                  onChange={(e) => setDocumentSettings(s => ({ ...s, marginX: Number(e.target.value) }))}
                  className="w-full accent-[#FF6B5A]"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider block">Margin Y (Top/Bottom)</label>
                  <span className="text-xs text-white">{documentSettings.marginY}in</span>
                </div>
                <input 
                  type="range" min="0" max="1.5" step="0.1"
                  value={documentSettings.marginY}
                  onChange={(e) => setDocumentSettings(s => ({ ...s, marginY: Number(e.target.value) }))}
                  className="w-full accent-[#FF6B5A]"
                />
              </div>

              {/* Typography */}
              <div>
                <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">Name</h4>
                <select
                  value={documentSettings.fontFamilyName}
                  onChange={(e) => setDocumentSettings(s => ({ ...s, fontFamilyName: e.target.value }))}
                  className="w-full p-2 mb-3 bg-gray-800 text-white rounded text-sm border border-gray-700 focus:border-[#FF6B5A] outline-none"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Lato">Lato</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Merriweather">Merriweather</option>
                  <option value="Playfair Display">Playfair Display</option>
                </select>
                <div className="flex justify-between mb-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider block">Size</label>
                  <span className="text-xs text-white">{documentSettings.fontSizeName}px</span>
                </div>
                <input 
                  type="range" min="20" max="48" step="1"
                  value={documentSettings.fontSizeName}
                  onChange={(e) => setDocumentSettings(s => ({ ...s, fontSizeName: Number(e.target.value) }))}
                  className="w-full accent-[#FF6B5A] mb-6"
                />
              </div>

              <div>
                <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">Headings</h4>
                <select
                  value={documentSettings.fontFamilyHeading}
                  onChange={(e) => setDocumentSettings(s => ({ ...s, fontFamilyHeading: e.target.value }))}
                  className="w-full p-2 mb-3 bg-gray-800 text-white rounded text-sm border border-gray-700 focus:border-[#FF6B5A] outline-none"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Lato">Lato</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Merriweather">Merriweather</option>
                  <option value="Playfair Display">Playfair Display</option>
                </select>
                <div className="flex justify-between mb-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider block">Size</label>
                  <span className="text-xs text-white">{documentSettings.fontSizeHeading}px</span>
                </div>
                <input 
                  type="range" min="12" max="24" step="1"
                  value={documentSettings.fontSizeHeading}
                  onChange={(e) => setDocumentSettings(s => ({ ...s, fontSizeHeading: Number(e.target.value) }))}
                  className="w-full accent-[#FF6B5A] mb-6"
                />
              </div>

              <div>
                <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">Body Text</h4>
                <select
                  value={documentSettings.fontFamilyBody}
                  onChange={(e) => setDocumentSettings(s => ({ ...s, fontFamilyBody: e.target.value }))}
                  className="w-full p-2 mb-3 bg-gray-800 text-white rounded text-sm border border-gray-700 focus:border-[#FF6B5A] outline-none"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Lato">Lato</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Merriweather">Merriweather</option>
                  <option value="Playfair Display">Playfair Display</option>
                </select>
                <div className="flex justify-between mb-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider block">Size</label>
                  <span className="text-xs text-white">{documentSettings.fontSizeBody}px</span>
                </div>
                <input 
                  type="range" min="9" max="16" step="1"
                  value={documentSettings.fontSizeBody}
                  onChange={(e) => setDocumentSettings(s => ({ ...s, fontSizeBody: Number(e.target.value) }))}
                  className="w-full accent-[#FF6B5A] mb-2"
                />
              </div>

              {/* Line Spacing */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider block">Line Spacing</label>
                  <span className="text-xs text-white">{documentSettings.lineSpacing}x</span>
                </div>
                <input 
                  type="range" min="1.0" max="2.5" step="0.1"
                  value={documentSettings.lineSpacing}
                  onChange={(e) => setDocumentSettings(s => ({ ...s, lineSpacing: Number(e.target.value) }))}
                  className="w-full accent-[#FF6B5A]"
                />
              </div>
            </div>

            <h3 className="font-medium mb-4 border-t border-gray-700 pt-4">Templates</h3>
            <div className="grid grid-cols-2 gap-4">
              {resumeTemplates.map((template) => {
                const ThumbnailComponent = template.component
                return (
                  <button
                    key={template.id}
                    onClick={() => {
                      setSelectedTemplate(template.id)
                      setShowMobileDesign(false)
                    }}
                    className={`relative aspect-[8.5/11] bg-white rounded overflow-hidden ${selectedTemplate === template.id ? 'ring-2 ring-[#F5C563]' : ''}`}
                  >
                    <div className="w-full h-full relative overflow-hidden">
                      <div className="absolute top-0 left-0" style={{ transform: 'scale(0.15)', transformOrigin: 'top left', width: '850px', height: '1100px' }}>
                        <ThumbnailComponent data={templateData} />
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Actions Drawer */}
      {showMobileActions && (
        <div className="lg:hidden fixed inset-0 z-[60] flex flex-col bg-[#2C3E5F]">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="text-white font-bold">Actions & Progress</h3>
            <button onClick={() => setShowMobileActions(false)} className="text-gray-400">
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 text-white pb-32">
            <div className="space-y-4 mb-8">
              <button
                onClick={handleSaveDraft}
                className="w-full py-3 bg-[#4169FF] text-white font-bold rounded shadow-lg"
              >
                Save Draft
              </button>
              <button className="w-full flex items-center justify-center gap-2 p-3 bg-white rounded text-gray-900 font-medium">
                Spell Check
              </button>
            </div>

            <h3 className="font-bold mb-4">Resume Sections</h3>
            <div className="space-y-3">
              {sections.map((section, index) => (
                <button
                  key={index}
                  onClick={() => {
                    handleSectionClick(index)
                    setShowMobileActions(false)
                  }}
                  className="flex items-center gap-3 text-white w-full text-left p-3 hover:bg-white/5 rounded-xl transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-white text-[#2C3E5F] flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="text-sm">{section}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SOP Generation Form */}
      {showSopForm && (
        <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-2">Generate Statement of Purpose</h3>
            <p className="text-gray-600 text-sm mb-6">We'll use your resume information to create a personalized SOP. Just provide the specific details below.</p>
            
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target as HTMLFormElement)
              generateSOP({
                university: formData.get('university'),
                program: formData.get('program'),
                degree: formData.get('degree'),
                specialization: formData.get('specialization'),
                startDate: formData.get('startDate'),
                researchInterest: formData.get('researchInterest'),
                careerGoals: formData.get('careerGoals'),
                whyProgram: formData.get('whyProgram'),
                whyUniversity: formData.get('whyUniversity'),
                additionalInfo: formData.get('additionalInfo')
              })
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Target University/Institution *</label>
                  <input name="university" type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="e.g., Stanford University" required />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Program Name *</label>
                  <input name="program" type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="e.g., Computer Science" required />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Degree Level *</label>
                  <select name="degree" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" required>
                    <option value="">Select Degree</option>
                    <option value="Bachelor's">Bachelor's</option>
                    <option value="Master's">Master's</option>
                    <option value="PhD">PhD</option>
                    <option value="Certificate">Certificate</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Specialization/Track</label>
                  <input name="specialization" type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="e.g., Machine Learning, Data Science" />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Intended Start Date</label>
                  <select name="startDate" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option value="">Select Term</option>
                    <option value="Fall 2024">Fall 2024</option>
                    <option value="Spring 2025">Spring 2025</option>
                    <option value="Fall 2025">Fall 2025</option>
                    <option value="Spring 2026">Spring 2026</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Research Interests (Optional)</label>
                  <textarea name="researchInterest" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-20" placeholder="Specific research areas or topics you're interested in..."></textarea>
                  <p className="text-xs text-gray-500 mt-1">We'll automatically include your skills and experience from your resume</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Long-term Career Goals</label>
                  <textarea name="careerGoals" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-20" placeholder="What do you want to achieve after completing this program?"></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Why This Program? *</label>
                  <textarea name="whyProgram" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-24" placeholder="What specific aspects of this program attract you?" required></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Why This University? *</label>
                  <textarea name="whyUniversity" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-24" placeholder="What makes this university special for you?" required></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Additional Information</label>
                  <textarea name="additionalInfo" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-20" placeholder="Any other relevant information (achievements, challenges overcome, etc.)"></textarea>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-blue-800 mb-2">📋 Auto-included from your resume:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Personal background and summary</li>
                  <li>• Educational qualifications and achievements</li>
                  <li>• Professional experience and responsibilities</li>
                  <li>• Technical skills and competencies</li>
                  <li>• Projects and accomplishments</li>
                </ul>
              </div>
              
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowSopForm(false)} className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors" disabled={isGenerating}>
                  {isGenerating ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating SOP...
                    </span>
                  ) : 'Generate SOP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cover Letter Generation Form */}
      {showCoverForm && (
        <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-2">Generate Cover Letter</h3>
            <p className="text-gray-600 text-sm mb-6">We'll create a tailored cover letter using your resume. Just provide the job-specific details below.</p>
            
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target as HTMLFormElement)
              generateCoverLetter({
                company: formData.get('company'),
                position: formData.get('position'),
                department: formData.get('department'),
                jobType: formData.get('jobType'),
                applicationSource: formData.get('applicationSource'),
                keyRequirements: formData.get('keyRequirements'),
                whyCompany: formData.get('whyCompany'),
                whyRole: formData.get('whyRole'),
                availabilityDate: formData.get('availabilityDate'),
                salaryExpectation: formData.get('salaryExpectation'),
                additionalInfo: formData.get('additionalInfo')
              })
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Company Name *</label>
                  <input name="company" type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="e.g., Google, Microsoft" required />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Job Title *</label>
                  <input name="position" type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="e.g., Software Engineer, Data Analyst" required />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Department/Team</label>
                  <input name="department" type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="e.g., Engineering, Marketing" />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Job Type</label>
                  <select name="jobType" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="">Select Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">How did you find this job?</label>
                  <select name="applicationSource" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="">Select Source</option>
                    <option value="Company Website">Company Website</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Job Board">Job Board</option>
                    <option value="Referral">Employee Referral</option>
                    <option value="Recruiter">Recruiter Contact</option>
                    <option value="Career Fair">Career Fair</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Availability Date</label>
                  <select name="availabilityDate" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="">Select Availability</option>
                    <option value="Immediately">Immediately</option>
                    <option value="2 weeks notice">2 weeks notice</option>
                    <option value="1 month">1 month</option>
                    <option value="2-3 months">2-3 months</option>
                    <option value="Negotiable">Negotiable</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Key Job Requirements/Skills *</label>
                  <textarea name="keyRequirements" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24" placeholder="List the main requirements from the job posting that match your background..." required></textarea>
                  <p className="text-xs text-gray-500 mt-1">We'll automatically match these with your skills and experience</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Why This Company? *</label>
                  <textarea name="whyCompany" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24" placeholder="What attracts you to this company? (culture, mission, products, reputation...)" required></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Why This Role? *</label>
                  <textarea name="whyRole" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24" placeholder="Why are you interested in this specific position?" required></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Salary Expectation (Optional)</label>
                  <input name="salaryExpectation" type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="e.g., $80,000 - $100,000, Negotiable, As per company standards" />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Additional Information</label>
                  <textarea name="additionalInfo" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-20" placeholder="Any other relevant information (portfolio links, certifications, etc.)"></textarea>
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-purple-800 mb-2">📋 Auto-included from your resume:</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Professional summary and career highlights</li>
                  <li>• Relevant work experience and achievements</li>
                  <li>• Technical and soft skills matching job requirements</li>
                  <li>• Educational background and certifications</li>
                  <li>• Notable projects and accomplishments</li>
                  <li>• Professional contact information</li>
                </ul>
              </div>
              
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowCoverForm(false)} className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors" disabled={isGenerating}>
                  {isGenerating ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating Cover Letter...
                    </span>
                  ) : 'Generate Cover Letter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}