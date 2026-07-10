import React from 'react'
import { ClipboardCheckIcon, CheckCircle2Icon, TargetIcon } from 'lucide-react'

interface ExamsSectionProps {
  college: {
    entrance_exams: string[]
    eligibility_criteria: string
    cutoff_percentile: number
  }
}

export function ExamsSection({ college }: ExamsSectionProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#FF6B4A]/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B4A] to-[#E85D3F] rounded-xl flex items-center justify-center">
          <ClipboardCheckIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-[#6B3410]">Admissions</h2>
          <p className="text-[#8B4513] text-sm">
            Entrance exams and eligibility
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Accepted Exams */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2Icon className="w-5 h-5 text-[#FF6B4A]" />
            <h3 className="font-bold text-[#6B3410] text-lg">Accepted Exams</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {college.entrance_exams.map((exam, index) => (
              <span 
                key={index}
                className="bg-blue-50 text-blue-700 px-5 py-2 rounded-lg font-semibold border border-blue-200"
              >
                {exam}
              </span>
            ))}
          </div>
        </div>

        {/* Eligibility */}
        <div className="bg-[#FFF5E9] rounded-xl p-5 border border-[#FF6B4A]/20">
          <div className="flex items-center gap-2 mb-2">
            <TargetIcon className="w-5 h-5 text-[#FF6B4A]" />
            <h3 className="font-bold text-[#6B3410]">Eligibility Criteria</h3>
          </div>
          <p className="text-[#8B4513]">{college.eligibility_criteria}</p>
        </div>

        {/* Cutoff */}
        <div className="bg-green-50 rounded-xl p-5 border border-green-200">
          <h3 className="font-bold text-[#6B3410] mb-2">Cutoff Percentile</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-green-600">{college.cutoff_percentile}%</span>
            <span className="text-green-600 font-medium">
              {college.cutoff_percentile > 95 ? 'Highly competitive' : 'Competitive'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}