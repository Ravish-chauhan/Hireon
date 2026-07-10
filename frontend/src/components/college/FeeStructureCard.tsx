import React from 'react'
import { IndianRupeeIcon, InfoIcon } from 'lucide-react'

interface FeeStructureCardProps {
  college: {
    fees_inr: number
    scholarships_available: boolean
  }
}

export function FeeStructureCard({ college }: FeeStructureCardProps) {
  const formatFees = (fees: number) => {
    if (fees === 0 || fees < 1000) return 'Contact College'
    if (fees < 100000) return `₹${(fees / 1000).toFixed(0)}K`
    return `₹${(fees / 100000).toFixed(1)}L`
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#FF6B4A]/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B4A] to-[#E85D3F] rounded-xl flex items-center justify-center">
          <IndianRupeeIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-[#6B3410]">Fee Structure</h2>
          <p className="text-[#8B4513] text-sm">
            {college.scholarships_available ? 'Affordable education with scholarships' : 'Affordable education'}
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#FFF5E9] to-[#FFE4D6] rounded-xl p-6 mb-4 border border-[#FF6B4A]/30">
        <div className="flex justify-between items-center">
          <span className="text-[#8B4513] font-semibold">
            Annual Program Fee
          </span>
          <div className="text-right">
            <div className="text-4xl font-black text-[#FF6B4A]">{formatFees(college.fees_inr)}</div>
            <div className="text-sm text-[#8B4513]/60">per year</div>
          </div>
        </div>
      </div>

      {college.scholarships_available && (
        <div className="flex items-start gap-2 bg-green-50 rounded-lg p-4 border border-green-200 mb-4">
          <InfoIcon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-900 leading-relaxed">
            Scholarships available for eligible students. Merit and need-based financial assistance programs offered.
          </p>
        </div>
      )}

      <div className="flex items-start gap-2 bg-blue-50 rounded-lg p-4 border border-blue-200">
        <InfoIcon className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-900 leading-relaxed">
          Fees may vary by program. Additional costs for hostel and other facilities.
        </p>
      </div>
    </div>
  )
}