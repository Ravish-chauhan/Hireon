import React from 'react'
import { TrendingUpIcon, BriefcaseIcon } from 'lucide-react'

interface PlacementSectionProps {
  college: {
    placement_percentage: number
    average_salary_lpa: number
    highest_salary_lpa: number
    top_recruiters: string[]
  }
}

export function PlacementSection({ college }: PlacementSectionProps) {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#FF6B4A]/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B4A] to-[#E85D3F] rounded-xl flex items-center justify-center">
            <TrendingUpIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-[#6B3410]">
              Placement Statistics
            </h2>
            <p className="text-[#8B4513] text-sm">
              Outstanding career outcomes
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 rounded-xl p-6 text-center border border-green-200">
            <div className="text-5xl font-black text-green-600 mb-2">{college.placement_percentage}%</div>
            <div className="text-[#8B4513] font-semibold">Placement Rate</div>
          </div>

          <div className="bg-[#FFF5E9] rounded-xl p-6 text-center border border-[#FF6B4A]/30">
            <div className="text-5xl font-black text-[#FF6B4A] mb-2">₹{college.average_salary_lpa}L</div>
            <div className="text-[#8B4513] font-semibold">Average Package</div>
          </div>

          <div className="bg-orange-50 rounded-xl p-6 text-center border border-orange-200">
            <div className="text-5xl font-black text-orange-600 mb-2">₹{college.highest_salary_lpa}L</div>
            <div className="text-[#8B4513] font-semibold">Highest Package</div>
          </div>
        </div>
      </div>

      {/* Top Recruiters */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#FF6B4A]/10">
        <div className="flex items-center gap-2 mb-5">
          <BriefcaseIcon className="w-6 h-6 text-[#FF6B4A]" />
          <h3 className="font-black text-[#6B3410] text-xl">Top Recruiters</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {college.top_recruiters.map((recruiter, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-[#FFF5E9] to-[#FFE4D6] text-[#8B4513] px-4 py-3 rounded-lg font-semibold text-center border border-[#FF6B4A]/20 text-sm"
            >
              {recruiter}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}