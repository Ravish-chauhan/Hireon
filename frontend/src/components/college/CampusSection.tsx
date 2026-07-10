import React from 'react'
import {
  BuildingIcon,
  HomeIcon,
  AwardIcon,
  CalendarIcon,
  LibraryIcon,
  ActivityIcon,
} from 'lucide-react'

interface CampusSectionProps {
  college: {
    campus_area_acres: number
    hostel_available: boolean
    scholarships_available: boolean
    established_year: number
  }
}

export function CampusSection({ college }: CampusSectionProps) {
  const facilities = [
    {
      icon: BuildingIcon,
      label: 'Campus Area',
      value: `${college.campus_area_acres} acres`,
      description: 'Sprawling green campus',
    },
    {
      icon: HomeIcon,
      label: 'Hostel Facility',
      value: college.hostel_available ? 'Available' : 'Not Available',
      description: college.hostel_available ? 'Separate for boys & girls' : 'Day scholar only',
    },
    {
      icon: AwardIcon,
      label: 'Scholarships',
      value: college.scholarships_available ? 'Available' : 'Not Available',
      description: college.scholarships_available ? 'Merit & need-based' : 'Contact for details',
    },
    {
      icon: CalendarIcon,
      label: 'Established',
      value: college.established_year.toString(),
      description: `${new Date().getFullYear() - college.established_year}+ years of excellence`,
    },
    {
      icon: LibraryIcon,
      label: 'Library',
      value: 'World-class',
      description: 'Extensive collection',
    },
    {
      icon: ActivityIcon,
      label: 'Sports',
      value: 'Excellent',
      description: 'Indoor & outdoor facilities',
    },
  ]

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#FF6B4A]/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B4A] to-[#E85D3F] rounded-xl flex items-center justify-center">
          <BuildingIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-[#6B3410]">
            Campus & Facilities
          </h2>
          <p className="text-[#8B4513] text-sm">World-class infrastructure</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {facilities.map((facility, index) => {
          const Icon = facility.icon
          return (
            <div
              key={index}
              className="bg-gradient-to-br from-[#FFF5E9] to-[#FFE4D6] rounded-xl p-5 border border-[#FF6B4A]/20 hover:border-[#FF6B4A] transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border-2 border-[#FF6B4A]/30 flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#FF6B4A]" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-[#6B3410] mb-1">
                    {facility.label}
                  </div>
                  <div className="text-xl font-black text-[#FF6B4A] mb-1">
                    {facility.value}
                  </div>
                  <div className="text-sm text-[#8B4513]">
                    {facility.description}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}