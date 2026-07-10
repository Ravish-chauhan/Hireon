import React from 'react'
import { ZoomInIcon, SparklesIcon } from 'lucide-react'
import { useResume } from '../context/ResumeContext'
import { getTemplateById } from './resume/templates'

type ResumePreviewLargeProps = {
  // Optional override data - if not provided, uses context
  data?: any
}

export function ResumePreviewLarge({ data: overrideData }: ResumePreviewLargeProps) {
  const { templateData, selectedTemplate } = useResume()
  
  // Always use templateData from context, ignore overrideData for now
  const data = templateData
  
  const renderTemplate = () => {
    // Get template ID from URL or context
    let templateId = selectedTemplate || 'template-1'
    
    // Map specific URL template ID to our template IDs
    if (templateId === '6933035f639a2ec7c9b2ecdc') {
      templateId = 'template-1'
    }
    
    const template = getTemplateById(templateId)
    const TemplateComponent = template?.component
    
    if (!TemplateComponent) {
      return (
        <div className="p-8 text-center text-gray-500">
          <p>Template "{templateId}" not found</p>
          <p className="text-sm mt-2">Available: template-1, template-2, template-3</p>
        </div>
      )
    }
    
    return <TemplateComponent data={data} />
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative group">
        {/* Live indicator */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg z-10">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          Live Preview
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 group-hover:shadow-3xl group-hover:scale-[1.02]" style={{ width: '440px', height: '570px' }}>
          <div className="w-full h-full overflow-hidden">
            <div className="w-full h-full transform scale-[0.52] origin-top-left" style={{ width: '8.5in', minHeight: '11in' }}>
              {renderTemplate()}
            </div>
          </div>
        </div>

        {/* Zoom button */}
        <button
          className="absolute bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-br from-[#F5C563] to-[#F59E0B] flex items-center justify-center shadow-xl hover:shadow-2xl transition-all hover:scale-110 group-hover:rotate-12 duration-300"
          aria-label="Zoom preview"
        >
          <ZoomInIcon className="w-6 h-6 text-white" strokeWidth={2.5} />
        </button>
      </div>

      {/* Change template link */}
      <button className="mt-8 flex items-center gap-2 text-[#4169FF] text-base font-semibold hover:gap-3 transition-all group">
        <SparklesIcon className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
        <span className="underline decoration-2 underline-offset-4">
          Change template
        </span>
      </button>
    </div>
  )
}