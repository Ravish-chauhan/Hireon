import React from 'react'
import { CheckCircle2 } from 'lucide-react'

interface SessionTypeCardProps {
  sessionType: {
    id: string
    title: string
    description: string
    icon: React.ReactNode
  }
  isSelected: boolean
  onSelect: () => void
}

export const SessionTypeCard: React.FC<SessionTypeCardProps> = ({
  sessionType,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className={`relative group cursor-pointer transition-all duration-300 hover:-translate-y-1 ${isSelected ? 'scale-[1.02]' : ''
        }`}
      onClick={onSelect}
    >
      {/* Glow Effect on Selection */}
      {isSelected && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0066FF] to-[#0F0C89] rounded-2xl blur opacity-40" />
      )}

      <div
        className={`relative bg-white p-5 sm:p-6 rounded-2xl border transition-all duration-300 shadow-sm ${isSelected
          ? 'border-[#0066FF] bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg shadow-blue-500/10'
          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
          }`}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${isSelected
            ? 'bg-gradient-to-br from-[#0066FF] to-[#0F0C89] shadow-lg shadow-blue-500/30'
            : 'bg-gradient-to-br from-[#0066FF] to-[#0F0C89] group-hover:shadow-lg group-hover:shadow-blue-500/20'
            }`}>
            <div className="text-white">{sessionType.icon}</div>
          </div>

          {/* Content */}
          <div className="flex-grow min-w-0">
            <h3 className="text-gray-900 font-bold text-base sm:text-lg mb-1">
              {sessionType.title}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              {sessionType.description}
            </p>
          </div>

          {/* Selection Indicator */}
          <div className="flex-shrink-0 pt-1">
            {isSelected ? (
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#0066FF] to-[#0F0C89] flex items-center justify-center shadow-lg shadow-blue-500/30">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-blue-400 transition-colors" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}