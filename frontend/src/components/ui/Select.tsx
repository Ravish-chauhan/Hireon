import React from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: {
    value: string
    label: string
  }[]
}

export function Select({
  label,
  options,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className="w-full group">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`
            w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 bg-white text-gray-900 appearance-none
            focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400
            hover:border-gray-300 cursor-pointer transition-all duration-300
            ${className}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-transform group-hover:text-gray-600"
          size={18}
        />
      </div>
    </div>
  )
}