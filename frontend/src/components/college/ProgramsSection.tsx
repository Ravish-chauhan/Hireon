import React from 'react'
import { GraduationCapIcon } from 'lucide-react'

interface ProgramsSectionProps {
  college: {
    programs_offered: string[]
  }
}

export function ProgramsSection({ college }: ProgramsSectionProps) {
  // Map programs to include duration and seats (you can customize this based on your data)
  const programsWithDetails = college.programs_offered.map(program => ({
    name: program,
    duration: program.includes('MBBS') ? '5.5 years' : 
              program.includes('MD') || program.includes('MS') ? '3 years' :
              program.includes('DM') || program.includes('MCh') ? '3 years' : '3-4 years',
    seats: program.includes('MBBS') ? '125' : 
           program.includes('MD') ? '200+' :
           program.includes('MS') ? '150+' :
           program.includes('DM') ? '100+' :
           program.includes('MCh') ? '80+' : 'Varies',
  }))

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#FF6B4A]/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B4A] to-[#E85D3F] rounded-xl flex items-center justify-center">
          <GraduationCapIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-[#6B3410]">
            Programs Offered
          </h2>
          <p className="text-[#8B4513] text-sm">
            Comprehensive education programs
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {programsWithDetails.map((program, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-gradient-to-r from-[#FFF5E9] to-[#FFE4D6] p-4 rounded-xl border border-[#FF6B4A]/20 hover:border-[#FF6B4A] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border-2 border-[#FF6B4A]/30">
                <span className="text-xl font-black text-[#FF6B4A]">
                  {program.name}
                </span>
              </div>
              <div>
                <div className="font-bold text-[#6B3410]">
                  {program.name} Program
                </div>
                <div className="text-sm text-[#8B4513]">
                  Duration: {program.duration}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-[#8B4513]">Seats</div>
              <div className="font-bold text-[#FF6B4A]">{program.seats}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}