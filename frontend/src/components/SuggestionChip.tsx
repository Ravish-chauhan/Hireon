import React from 'react'
import { PlusIcon } from 'lucide-react'

type SuggestionChipProps = {
  text: string
  onClick?: () => void
}

export function SuggestionChip({ text, onClick }: SuggestionChipProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left w-full"
    >
      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#F5C563] flex items-center justify-center">
        <PlusIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
      </span>
      <span className="text-gray-700 text-sm leading-relaxed pt-1">{text}</span>
    </button>
  )
}