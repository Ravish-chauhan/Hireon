import React from 'react'
import { StarIcon } from 'lucide-react'

type BestPracticePanelProps = {
  title: string
  count: number
  target: number
}

export function BestPracticePanel({
  title,
  count,
  target,
}: BestPracticePanelProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-[#E0F2FE] flex items-center justify-center flex-shrink-0">
          <StarIcon className="w-4 h-4 text-[#0284C7]" fill="currentColor" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-sm mb-1">
            Best practice
          </h4>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">{title}</p>
            <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium text-gray-600">
              {count}
            </span>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-[#0284C7] h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (count / target) * 100)}%`,
              }}
            />
          </div>
          <button className="text-[#4169FF] text-xs font-medium mt-2 hover:underline">
            Ignore
          </button>
        </div>
      </div>
    </div>
  )
}