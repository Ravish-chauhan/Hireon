import React from 'react'
import { ZoomInIcon } from 'lucide-react'

export function ResumePreview() {
  return (
    <div className="w-72 flex flex-col items-center">
      <div className="relative w-full">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 aspect-[8.5/11]">
          {/* Resume Preview Content */}
          <div className="w-full h-full flex flex-col">
            {/* Header with teal bar */}
            <div className="h-3 bg-[#0D9488] rounded-sm mb-3" />

            {/* Name and contact */}
            <div className="flex gap-3 mb-4">
              <div className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-[#0D9488] font-bold text-xs mb-1">
                  YOUR NAME
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 text-gray-400">✉</div>
                  <div className="h-1.5 bg-[#0D9488] rounded-full w-20" />
                </div>
              </div>
            </div>

            {/* Summary section */}
            <div className="mb-3">
              <div className="text-[6px] font-bold text-gray-700 mb-1">
                SUMMARY
              </div>
              <div className="space-y-1">
                <div className="h-1 bg-[#0D9488] rounded-full w-full" />
                <div className="h-1 bg-[#0D9488] rounded-full w-4/5" />
              </div>
            </div>

            {/* Skills section */}
            <div className="mb-3">
              <div className="text-[6px] font-bold text-gray-700 mb-1">
                SKILLS
              </div>
              <div className="space-y-1">
                <div className="h-1 bg-[#0D9488] rounded-full w-full" />
                <div className="h-1 bg-[#0D9488] rounded-full w-3/4" />
              </div>
            </div>

            {/* Experience section */}
            <div className="mb-3">
              <div className="text-[6px] font-bold text-gray-700 mb-1">
                EXPERIENCE
              </div>
              <div className="space-y-1">
                <div className="h-1 bg-[#0D9488] rounded-full w-full" />
                <div className="h-1 bg-[#0D9488] rounded-full w-full" />
                <div className="h-1 bg-[#0D9488] rounded-full w-2/3" />
              </div>
            </div>

            {/* Education section */}
            <div className="bg-[#FEF3C7] p-2 rounded">
              <div className="text-[6px] font-bold text-gray-700 mb-1">
                EDUCATION AND TRAINING
              </div>
              <div className="space-y-1">
                <div className="h-1 bg-[#F59E0B] rounded-full w-full" />
                <div className="h-1 bg-[#F59E0B] rounded-full w-4/5" />
              </div>
            </div>
          </div>
        </div>

        {/* Zoom button */}
        <button
          className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-[#F5C563] flex items-center justify-center shadow-md hover:bg-[#E5B553] transition-colors"
          aria-label="Zoom preview"
        >
          <ZoomInIcon className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Change template link */}
      <button className="mt-4 text-[#4169FF] text-sm font-medium hover:underline">
        Change template
      </button>
    </div>
  )
}