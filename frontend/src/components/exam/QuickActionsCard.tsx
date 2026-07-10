import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { BookOpen, MessageCircle, UserPlus, ArrowRight, Sparkles } from 'lucide-react'

interface QuickActionsCardProps {
  exam: {
    name: string
  }
}

export function QuickActionsCard({ exam }: QuickActionsCardProps) {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="relative group">
      {/* Animated Background Glow */}
      <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-violet-500/20 rounded-[32px] blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 shadow-2xl">
        {/* Decorative Orbs */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Quick Actions</h3>
          </div>
          <p className="text-slate-400 text-sm mb-6">Get started with your {exam.name} preparation</p>

          <div className="space-y-3">
            {user ? (
              <>
                <button
                  onClick={() => navigate('/assessment')}
                  className="w-full group/btn relative overflow-hidden bg-white text-slate-900 py-4 px-5 rounded-xl font-semibold transition-all hover:shadow-xl hover:shadow-white/20 hover:-translate-y-0.5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover/btn:bg-gradient-to-br group-hover/btn:from-cyan-400 group-hover/btn:to-blue-600 group-hover/btn:text-white transition-all">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold">Take Assessment</div>
                      <div className="text-xs text-slate-500">Check your preparation level</div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => navigate('/book-consultation')}
                  className="w-full group/btn relative overflow-hidden bg-white/10 backdrop-blur-sm text-white py-4 px-5 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold">Book Consultation</div>
                      <div className="text-xs text-white/60">Talk to an expert</div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/register')}
                className="w-full group/btn relative overflow-hidden bg-white text-slate-900 py-4 px-5 rounded-xl font-semibold transition-all hover:shadow-xl hover:shadow-white/20 hover:-translate-y-0.5 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover/btn:bg-gradient-to-br group-hover/btn:from-cyan-400 group-hover/btn:to-blue-600 group-hover/btn:text-white transition-all">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold">Get Started Free</div>
                    <div className="text-xs text-slate-500">Create your account today</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}