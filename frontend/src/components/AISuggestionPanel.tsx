import React from 'react'
import { SparklesIcon, XIcon } from 'lucide-react'

type AISuggestionPanelProps = {
  suggestions: string[]
  onSelectSuggestion: (suggestion: string) => void
  onClose?: () => void
}

export function AISuggestionPanel({
  suggestions,
  onSelectSuggestion,
  onClose,
}: AISuggestionPanelProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-4 h-4 text-[#4169FF]" />
          <span className="text-sm font-medium text-gray-700">
            AI Suggestions
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Close suggestions"
          >
            <XIcon className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Suggestions list */}
      <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelectSuggestion(suggestion)}
            className="w-full text-left px-3 py-2.5 text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Footer hint */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
        <p className="text-xs text-gray-400">Click a suggestion to add it</p>
      </div>
    </div>
  )
}