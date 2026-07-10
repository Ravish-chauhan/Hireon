import React from 'react'
import {
  Clock,
  Calendar,
  CreditCard,
  FileText,
  Target,
  CheckCircle,
  XCircle,
  Zap,
  TrendingUp
} from 'lucide-react'

interface QuickStatsCardProps {
  exam: {
    exam_duration: string
    exam_frequency: string
    registration_fee?: number
    total_questions?: number | string
    total_marks?: number | string
    max_score?: number | string
    marking_scheme?: string
    negative_marking?: boolean
    score_validity?: string
    sections?: string[]
  }
}

export function QuickStatsCard({ exam }: QuickStatsCardProps) {
  const stats = [
    {
      icon: Clock,
      label: 'Duration',
      value: exam.exam_duration,
      gradient: 'from-violet-500 to-purple-600',
      shadowColor: 'shadow-violet-500/30',
    },
    {
      icon: Calendar,
      label: 'Frequency',
      value: exam.exam_frequency,
      gradient: 'from-cyan-500 to-blue-600',
      shadowColor: 'shadow-cyan-500/30',
    },
    {
      icon: FileText,
      label: 'Questions',
      value: exam.total_questions || 'Varies',
      gradient: 'from-emerald-500 to-teal-600',
      shadowColor: 'shadow-emerald-500/30',
    },
    {
      icon: Target,
      label: 'Max Marks',
      value: exam.total_marks || exam.max_score || 'Varies',
      gradient: 'from-orange-500 to-red-500',
      shadowColor: 'shadow-orange-500/30',
    },
  ]

  return (
    <div className="relative">
      {/* Background Glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/10 via-transparent to-cyan-500/10 rounded-[40px] blur-2xl opacity-60" />

      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
        {/* Animated Border Gradient */}
        <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-br from-violet-500/20 via-transparent to-cyan-500/20" />

        {/* Header with glassmorphism */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
          {/* Decorative orbs */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-500/20 rounded-full blur-2xl" />

          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-xl shadow-violet-500/40">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Quick Stats</h2>
              <p className="text-slate-400 text-sm">Key examination details at a glance</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="relative p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className="group relative"
                >
                  {/* Hover glow effect */}
                  <div className={`absolute -inset-2 bg-gradient-to-r ${stat.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500`} />

                  <div className="relative bg-white rounded-2xl p-5 border border-gray-100 shadow-lg group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-300">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 shadow-lg ${stat.shadowColor} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-black text-slate-900 mb-1 leading-tight">
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-500 font-semibold uppercase tracking-widest">
                      {stat.label}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Additional Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
            {/* Registration Fee */}
            {exam.registration_fee && (
              <div className="group relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200/50 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-400/20 to-transparent rounded-full blur-2xl" />
                <div className="relative flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-amber-700 font-bold uppercase tracking-widest mb-0.5">Registration Fee</div>
                    <div className="text-2xl font-black text-slate-900">₹{exam.registration_fee.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Marking Scheme */}
            {exam.marking_scheme && (
              <div className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200/50 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-2xl" />
                <div className="relative flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-blue-700 font-bold uppercase tracking-widest mb-0.5">Marking Scheme</div>
                    <div className="text-sm font-bold text-slate-900">{exam.marking_scheme}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Negative Marking */}
            <div className={`group relative overflow-hidden rounded-2xl p-5 border hover:shadow-xl transition-all duration-300 ${exam.negative_marking
              ? 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200/50'
              : 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200/50'
              }`}>
              <div className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl ${exam.negative_marking ? 'bg-gradient-to-br from-red-400/20' : 'bg-gradient-to-br from-emerald-400/20'
                } to-transparent`} />
              <div className="relative flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${exam.negative_marking
                  ? 'bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/30'
                  : 'bg-gradient-to-br from-emerald-500 to-green-600 shadow-emerald-500/30'
                  }`}>
                  {exam.negative_marking ? (
                    <XCircle className="w-6 h-6 text-white" />
                  ) : (
                    <CheckCircle className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <div className={`text-xs font-bold uppercase tracking-widest mb-0.5 ${exam.negative_marking ? 'text-red-700' : 'text-emerald-700'
                    }`}>Negative Marking</div>
                  <div className={`text-xl font-black ${exam.negative_marking ? 'text-red-600' : 'text-emerald-600'
                    }`}>
                    {exam.negative_marking ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sections */}
          {exam.sections && exam.sections.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-900">Exam Sections</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {exam.sections.map((section, idx) => (
                  <span
                    key={idx}
                    className="group relative px-5 py-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-default"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative">{section}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}