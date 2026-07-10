import React from 'react'
import { BuildingIcon, StarIcon } from 'lucide-react'

interface AcceptanceSectionProps {
  exam: {
    accepted_by: string[]
    popular_colleges: string[]
  }
}

export function AcceptanceSection({ exam }: AcceptanceSectionProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#FF6B4A]/10">
      <h2 className="text-3xl font-black text-[#6B3410] mb-6">Accepted By</h2>
      
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-[#FF6B4A] to-[#E85D3F] w-10 h-10 rounded-xl flex items-center justify-center">
              <BuildingIcon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-black text-[#6B3410]">Institution Types</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {exam.accepted_by.map((type: string, idx: number) => (
              <span
                key={idx}
                className="bg-gradient-to-br from-[#FFF5E9] to-[#FFE4D6] text-[#8B4513] px-4 py-2 rounded-full font-semibold text-sm border border-[#FF6B4A]/20"
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-[#FF6B4A] to-[#E85D3F] w-10 h-10 rounded-xl flex items-center justify-center">
              <StarIcon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-black text-[#6B3410]">Popular Colleges</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {exam.popular_colleges.map((college: string, idx: number) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-[#FFF5E9] to-[#FFE4D6] p-4 rounded-xl border border-[#FF6B4A]/20"
              >
                <div className="text-[#8B4513] font-semibold">{college}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}