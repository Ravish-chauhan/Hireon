import React from 'react'
import { CheckCircle2, Star } from 'lucide-react'

interface ConsultantCardProps {
  consultant: {
    id: string
    name: string
    specialty: string
    experience: string
    avatar: string
  }
  isSelected: boolean
  onSelect: () => void
}

export const ConsultantCard: React.FC<ConsultantCardProps> = ({
  consultant,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className={`relative group cursor-pointer transition-all duration-300 hover:-translate-y-2 ${isSelected ? 'scale-105' : ''
        }`}
      onClick={onSelect}
    >
      {/* Glow Effect on Selection */}
      {isSelected && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0066FF] to-[#0F0C89] rounded-2xl blur opacity-50 animate-pulse" />
      )}

      <div
        className={`relative bg-white p-4 sm:p-5 rounded-2xl border transition-all duration-300 shadow-sm ${isSelected
          ? 'border-[#0066FF] bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg shadow-blue-500/10'
          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
          }`}
      >
        {/* Selection Indicator */}
        <div className="absolute top-3 right-3">
          {isSelected ? (
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#0066FF] to-[#0F0C89] flex items-center justify-center shadow-lg shadow-blue-500/30">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-blue-400 transition-colors" />
          )}
        </div>

        {/* Avatar */}
        <div className="text-center mb-3">
          <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full flex items-center justify-center text-3xl sm:text-4xl mb-3 transition-all duration-300 ${isSelected
            ? 'bg-gradient-to-br from-[#0066FF] to-[#0F0C89] shadow-lg shadow-blue-500/30'
            : 'bg-gray-100 group-hover:bg-blue-50'
            }`}>
            {consultant.avatar}
          </div>

          <h3 className="text-gray-900 font-bold text-base sm:text-lg mb-1">
            {consultant.name}
          </h3>

          <p className={`font-semibold text-xs sm:text-sm mb-1 ${isSelected ? 'text-[#0066FF]' : 'text-gray-500'
            }`}>
            {consultant.specialty}
          </p>

          <p className="text-gray-400 text-xs">
            {consultant.experience}
          </p>
        </div>

        {/* Rating */}
        <div className="flex justify-center gap-0.5 mt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${isSelected
                ? 'text-[#0066FF] fill-[#0066FF]'
                : 'text-gray-300 fill-gray-300'
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}