import React from 'react'
import { PlusIcon, Loader2 } from 'lucide-react'

type Option = {
  text: string
}

const defaultOptions: Option[] = [
  {
    text: 'Highly-motivated employee with desire to take on new challenges. Strong work ethic, adaptability, and exceptional interpersonal skills. Adept at working effectively unsupervised and quickly mastering new skills.',
  },
  {
    text: 'Hardworking employee with customer service, multitasking, and time management abilities. Devoted to giving every customer a positive and memorable experience.',
  },
  {
    text: 'Outgoing student pursuing flexible part-time employment with weekend and evening shift availability.',
  },
  {
    text: 'Dedicated professional with proven track record in project management and team leadership. Committed to delivering high-quality results within tight deadlines.',
  },
]

type PrewrittenOptionsProps = {
  onSelect: (text: string) => void
  options?: Option[]
  isLoading?: boolean
}

export function PrewrittenOptions({ onSelect, options = defaultOptions, isLoading = false }: PrewrittenOptionsProps) {
  return (
    <div className="w-full h-full flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800">Prewritten options</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span className="ml-2 text-sm text-gray-600">Generating summaries...</span>
          </div>
        ) : (
          options.map((option, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
            >
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                {option.text}
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => onSelect(option.text)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#F5C563] hover:bg-[#E5B553] text-gray-900 text-xs font-medium rounded-full transition-colors"
                >
                  <PlusIcon className="w-3 h-3" />
                  Add
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}