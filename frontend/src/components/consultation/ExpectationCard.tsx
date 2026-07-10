import React from 'react'

interface ExpectationCardProps {
  expectation: {
    id: string
    title: string
    description: string
    icon: React.ReactNode
  }
}

export const ExpectationCard: React.FC<ExpectationCardProps> = ({
  expectation,
}) => {
  return (
    <div className="group relative">
      {/* Hover Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0066FF]/0 to-[#0F0C89]/0 group-hover:from-[#0066FF]/10 group-hover:to-[#0F0C89]/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500" />

      <div className="relative bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10 shadow-sm">
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#0066FF] to-[#0F0C89] flex items-center justify-center mb-4 text-white group-hover:from-[#0F0C89] group-hover:to-[#0066FF] transition-all duration-500 shadow-lg group-hover:shadow-blue-500/20">
            {expectation.icon}
          </div>

          {/* Title */}
          <h3 className="text-gray-900 font-bold text-base sm:text-lg mb-2 group-hover:text-[#0066FF] transition-colors">
            {expectation.title}
          </h3>

          {/* Description */}
          <p className="text-gray-500 text-sm leading-relaxed">
            {expectation.description}
          </p>
        </div>
      </div>
    </div>
  )
}