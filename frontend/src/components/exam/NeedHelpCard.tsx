import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, Sparkles, ArrowRight } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'

interface NeedHelpCardProps {
  examName: string
}

export function NeedHelpCard({ examName }: NeedHelpCardProps) {
  const navigate = useNavigate()

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`Hi! I need guidance for ${examName} exam preparation. Please help me with details and strategies.`)
    window.open(`https://wa.me/919163591151?text=${message}`, '_blank')
  }

  return (
    <div className="relative group">
      {/* Animated Background Glow */}
      <div className="absolute -inset-2 bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-fuchsia-600/20 rounded-[32px] blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 shadow-2xl">
        {/* Decorative Orbs */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-500/20 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-fuchsia-500/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-xl shadow-orange-500/30 mb-4">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">
              Need Help with <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">{examName}</span>?
            </h3>
            <p className="text-slate-400 text-sm">
              Get personalized guidance from our expert counselors
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            {/* Book Consultation */}
            <button
              onClick={() => navigate('/book-consultation')}
              className="w-full group/btn relative overflow-hidden bg-white text-slate-900 py-3.5 px-5 rounded-xl font-bold transition-all hover:shadow-xl hover:shadow-white/20 hover:-translate-y-0.5 flex items-center justify-center gap-3"
            >
              <Phone className="w-5 h-5 text-amber-500" />
              <span>Book Free Consultation</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>

            {/* WhatsApp Button */}
            <button
              onClick={handleWhatsAppClick}
              className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3.5 px-5 rounded-xl font-bold transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-3"
            >
              <FaWhatsapp className="w-5 h-5" />
              <span>Chat on WhatsApp</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Trust Indicator */}
          <div className="mt-5 pt-4 border-t border-white/10 text-center">
            <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Experts online • Usually replies within 5 mins</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}