import React from 'react'
import {
  Monitor,
  FileText,
  Target,
  Award,
  CheckCircle,
  AlertTriangle,
  Layers,
  Zap
} from 'lucide-react'

interface ExamPatternSectionProps {
  exam: {
    exam_mode: string
    total_questions?: number | string
    total_marks?: number | string
    max_score?: number | string
    sections: string[]
    marking_scheme: string
    negative_marking: boolean
  }
}

export function ExamPatternSection({ exam }: ExamPatternSectionProps) {
  const patternStats = [
    {
      icon: Monitor,
      label: 'Exam Mode',
      value: exam.exam_mode,
      gradient: 'from-violet-500 to-purple-600',
      shadowColor: 'shadow-violet-500/30',
    },
    ...(exam.total_questions ? [{
      icon: FileText,
      label: 'Total Questions',
      value: String(exam.total_questions),
      gradient: 'from-cyan-500 to-blue-600',
      shadowColor: 'shadow-cyan-500/30',
    }] : []),
    ...(exam.total_marks ? [{
      icon: Target,
      label: 'Total Marks',
      value: String(exam.total_marks),
      gradient: 'from-orange-500 to-red-500',
      shadowColor: 'shadow-orange-500/30',
    }] : []),
    ...(exam.max_score ? [{
      icon: Award,
      label: 'Maximum Score',
      value: String(exam.max_score),
      gradient: 'from-emerald-500 to-teal-600',
      shadowColor: 'shadow-emerald-500/30',
    }] : []),
  ]

  return (
    <div className="relative">
      {/* Background Glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/10 via-transparent to-orange-500/10 rounded-[40px] blur-2xl opacity-60" />

      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl" />

          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-xl shadow-violet-500/40">
              <Layers className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Exam Pattern</h2>
              <p className="text-slate-400 text-sm">Understanding the structure and format</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
            {patternStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="group relative">
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

          {/* Sections */}
          {exam.sections && exam.sections.length > 0 && (
            <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shadow-lg">
                  <FileText className="w-5 h-5 text-white" />
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

          {/* Marking Scheme Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-2xl" />
              <div className="relative flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-xs text-blue-700 font-bold uppercase tracking-widest mb-2">Marking Scheme</div>
                  <div className="text-lg font-bold text-slate-900">{exam.marking_scheme}</div>
                </div>
              </div>
            </div>

            <div className={`group relative overflow-hidden rounded-2xl p-6 border hover:shadow-xl transition-all duration-300 ${exam.negative_marking
                ? 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200/50'
                : 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200/50'
              }`}>
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl ${exam.negative_marking ? 'bg-gradient-to-br from-red-400/20' : 'bg-gradient-to-br from-emerald-400/20'
                } to-transparent`} />
              <div className="relative flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 ${exam.negative_marking
                    ? 'bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/30'
                    : 'bg-gradient-to-br from-emerald-500 to-green-600 shadow-emerald-500/30'
                  }`}>
                  {exam.negative_marking ? (
                    <AlertTriangle className="w-7 h-7 text-white" />
                  ) : (
                    <CheckCircle className="w-7 h-7 text-white" />
                  )}
                </div>
                <div>
                  <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${exam.negative_marking ? 'text-red-700' : 'text-emerald-700'
                    }`}>Negative Marking</div>
                  <div className={`text-xl font-black ${exam.negative_marking ? 'text-red-600' : 'text-emerald-600'
                    }`}>
                    {exam.negative_marking ? 'Yes - Be Careful!' : 'No - Attempt All!'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}