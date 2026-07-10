import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MapPinIcon,
  CalendarIcon,
  GlobeIcon,
  ArrowLeftIcon,
  AwardIcon,
  UsersIcon,
} from 'lucide-react'

interface HeroSectionProps {
  college: {
    name: string
    location: string
    state: string
    established_year: number
    national_rank: number
    tier: string
    nirf_rank?: number
    placement_percentage: number
    campus_area_acres: number
    description: string
    website_url: string
  }
}

export function HeroSection({ college }: HeroSectionProps) {
  const navigate = useNavigate()

  return (
    <div className="relative bg-gradient-to-br from-[#FFF5E9] via-[#FFE4D6] to-[#FFEFD5] pt-24">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button 
          onClick={() => navigate('/colleges')}
          className="flex items-center gap-2 text-[#8B4513] hover:text-[#FF6B4A] mb-6 transition-colors group"
        >
          <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Colleges</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="text-5xl font-black text-[#FF6B4A]">#{college.national_rank}</span>
              {college.tier === 'Top 15' && (
                <span className="bg-white px-4 py-2 rounded-full text-sm font-semibold text-[#8B4513] border-2 border-[#FF6B4A]/20">
                  Top 15
                </span>
              )}
              {college.nirf_rank && (
                <span className="bg-gradient-to-r from-[#FF6B4A] to-[#E85D3F] px-4 py-2 rounded-full text-sm font-semibold text-white">
                  NIRF #{college.nirf_rank}
                </span>
              )}
            </div>

            <h1 className="text-4xl lg:text-5xl font-black mb-4 leading-tight text-[#6B3410]">
              {college.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-2 text-[#8B4513]">
                <MapPinIcon className="w-5 h-5 text-[#FF6B4A]" />
                <span className="font-medium">{college.location}, {college.state}</span>
              </div>
              <div className="flex items-center gap-2 text-[#8B4513]">
                <CalendarIcon className="w-5 h-5 text-[#FF6B4A]" />
                <span className="font-medium">Est. {college.established_year}</span>
              </div>
            </div>

            <p className="text-lg text-[#6B3410] leading-relaxed mb-6">
              {college.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-[#FF6B4A]/20">
                <div className="flex items-center gap-2 mb-1">
                  <AwardIcon className="w-5 h-5 text-[#FF6B4A]" />
                  <span className="text-sm text-[#8B4513]">Placement Rate</span>
                </div>
                <div className="text-2xl font-black text-[#FF6B4A]">{college.placement_percentage}%</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-[#FF6B4A]/20">
                <div className="flex items-center gap-2 mb-1">
                  <UsersIcon className="w-5 h-5 text-[#FF6B4A]" />
                  <span className="text-sm text-[#8B4513]">Campus Area</span>
                </div>
                <div className="text-2xl font-black text-[#FF6B4A]">
                  {college.campus_area_acres} acres
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => navigate('/book-consultation')}
                className="bg-gradient-to-r from-[#FF6B4A] to-[#E85D3F] text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Book Consultation
              </button>
              <button 
                onClick={() => window.open(college.website_url, '_blank')}
                className="bg-white text-[#FF6B4A] px-8 py-3 rounded-full font-bold transition-all border-2 border-[#FF6B4A]/30 hover:border-[#FF6B4A] shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <GlobeIcon className="w-5 h-5" />
                Visit Website
              </button>
            </div>
          </div>

          <div className="relative">
            <img 
              src="/illustration1.jpg" 
              alt="Student Success" 
              className="w-full h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  )
}