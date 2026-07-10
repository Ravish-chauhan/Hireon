import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircleIcon } from 'lucide-react'

interface NeedHelpCardProps {
  collegeName: string
}

export function NeedHelpCard({ collegeName }: NeedHelpCardProps) {
  const navigate = useNavigate()

  return (
    <div className="bg-gradient-to-br from-[#FF6B4A] to-[#E85D3F] rounded-2xl p-6 shadow-lg text-white">
      <h3 className="text-xl font-black mb-3">Need Help?</h3>

      <p className="text-white/90 mb-5 text-sm leading-relaxed">
        Get personalized guidance for {collegeName} admission process from our
        expert counselors.
      </p>

      <button 
        onClick={() => navigate('/book-consultation')}
        className="w-full bg-white text-[#FF6B4A] py-4 rounded-xl font-bold transition-all hover:bg-[#FFF5E9] shadow-md hover:shadow-lg flex items-center justify-center gap-2"
      >
        <MessageCircleIcon className="w-5 h-5" />
        Talk to Expert
      </button>
    </div>
  )
}