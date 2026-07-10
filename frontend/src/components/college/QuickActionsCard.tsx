import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarIcon, ClipboardListIcon, ExternalLinkIcon } from 'lucide-react'

interface QuickActionsCardProps {
  college: {
    website_url: string
  }
}

export function QuickActionsCard({ college }: QuickActionsCardProps) {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#FF6B4A]/10">
      <h3 className="text-xl font-black text-[#6B3410] mb-4">Quick Actions</h3>

      <div className="space-y-3">
        <button 
          onClick={() => navigate('/book-consultation')}
          className="w-full bg-gradient-to-r from-[#FF6B4A] to-[#E85D3F] text-white py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
        >
          <CalendarIcon className="w-5 h-5" />
          Book Consultation
        </button>

        <button 
          onClick={() => navigate('/assessment')}
          className="w-full bg-white text-[#FF6B4A] border-2 border-[#FF6B4A] py-4 rounded-xl font-bold transition-all hover:bg-[#FFF5E9] flex items-center justify-center gap-2"
        >
          <ClipboardListIcon className="w-5 h-5" />
          Take Assessment
        </button>

        <button 
          onClick={() => window.open(college.website_url, '_blank')}
          className="w-full bg-[#FFF5E9] text-[#8B4513] py-4 rounded-xl font-bold transition-all hover:bg-[#FFE4D6] border border-[#FF6B4A]/20 flex items-center justify-center gap-2"
        >
          <ExternalLinkIcon className="w-5 h-5" />
          Visit Website
        </button>
      </div>
    </div>
  )
}