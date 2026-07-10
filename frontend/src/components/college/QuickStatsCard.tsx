import React from 'react'

interface QuickStatsCardProps {
  college: {
    average_salary_lpa: number
    highest_salary_lpa: number
    placement_percentage: number
    fees_inr: number
    campus_area_acres: number
  }
}

export function QuickStatsCard({ college }: QuickStatsCardProps) {
  const formatFees = (fees: number) => {
    if (fees === 0 || fees < 1000) return 'Contact College'
    if (fees < 100000) return `₹${(fees / 1000).toFixed(0)}K`
    return `₹${(fees / 100000).toFixed(1)}L`
  }

  const stats = [
    {
      label: 'Average Salary',
      value: `₹${college.average_salary_lpa}L`,
    },
    {
      label: 'Highest Salary',
      value: `₹${college.highest_salary_lpa}L`,
    },
    {
      label: 'Placement Rate',
      value: `${college.placement_percentage}%`,
    },
    {
      label: 'Total Fees (annually)',
      value: formatFees(college.fees_inr),
    },
    {
      label: 'Campus Area',
      value: `${college.campus_area_acres} acres`,
    },
  ]

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#FF6B4A]/10">
      <h3 className="text-2xl font-black text-[#6B3410] mb-6">
        Key Statistics
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-[#FFF5E9] to-[#FFE4D6] rounded-xl p-4 border border-[#FF6B4A]/20"
          >
            <div className="text-sm text-[#8B4513] mb-1">{stat.label}</div>
            <div className="text-2xl font-black text-[#FF6B4A]">
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}