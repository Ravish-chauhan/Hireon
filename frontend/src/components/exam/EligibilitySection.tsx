import React from 'react'
import {
  GraduationCap,
  Globe,
  CheckCircle,
  Calendar,
  Clock,
  Award,
  Sparkles
} from 'lucide-react'

interface EligibilitySectionProps {
  exam: {
    eligibility: string
    exam_level: string
    exam_frequency?: string
    preparation_time?: string
    score_validity?: string
  }
}

export function EligibilitySection({ exam }: EligibilitySectionProps) {
  const eligibilityItems = [
    {
      icon: GraduationCap,
      title: 'Educational Qualification',
      value: exam.eligibility,
      gradient: 'from-violet-500 to-purple-600',
      shadowColor: 'shadow-violet-500/30',
      bgGradient: 'from-violet-50 to-purple-50',
      borderColor: 'border-violet-200/50',
      textColor: 'text-violet-700',
    },
    {
      icon: Globe,
      title: 'Exam Level',
      value: exam.exam_level,
      gradient: 'from-cyan-500 to-blue-600',
      shadowColor: 'shadow-cyan-500/30',
      bgGradient: 'from-cyan-50 to-blue-50',
      borderColor: 'border-cyan-200/50',
      textColor: 'text-cyan-700',
    },
    ...(exam.exam_frequency ? [{
      icon: Calendar,
      title: 'Exam Frequency',
      value: exam.exam_frequency,
      gradient: 'from-emerald-500 to-teal-600',
      shadowColor: 'shadow-emerald-500/30',
      bgGradient: 'from-emerald-50 to-teal-50',
      borderColor: 'border-emerald-200/50',
      textColor: 'text-emerald-700',
    }] : []),
    ...(exam.preparation_time ? [{
      icon: Clock,
      title: 'Recommended Prep Time',
      value: exam.preparation_time,
      gradient: 'from-orange-500 to-red-500',
      shadowColor: 'shadow-orange-500/30',
      bgGradient: 'from-orange-50 to-red-50',
      borderColor: 'border-orange-200/50',
      textColor: 'text-orange-700',
    }] : []),
    ...(exam.score_validity ? [{
      icon: Award,
      title: 'Score Validity',
      value: exam.score_validity,
      gradient: 'from-fuchsia-500 to-pink-600',
      shadowColor: 'shadow-fuchsia-500/30',
      bgGradient: 'from-fuchsia-50 to-pink-50',
      borderColor: 'border-fuchsia-200/50',
      textColor: 'text-fuchsia-700',
    }] : []),
  ]

  return (
    <div className="relative">
      {/* Background Glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/10 via-transparent to-violet-500/10 rounded-[40px] blur-2xl opacity-60" />

      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-500/20 rounded-full blur-2xl" />

          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/40">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Eligibility Criteria</h2>
              <p className="text-slate-400 text-sm">Who can appear for this exam</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="space-y-4">
            {eligibilityItems.map((item, index) => {
              const Icon = item.icon
              return (
                <div
                  key={index}
                  className={`group relative overflow-hidden bg-gradient-to-r ${item.bgGradient} rounded-2xl p-6 border ${item.borderColor} hover:shadow-xl transition-all duration-300`}
                >
                  {/* Hover glow effect */}
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${item.gradient} rounded-full blur-2xl opacity-20`} />

                  <div className="relative flex items-start gap-5">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg ${item.shadowColor} flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className={`text-xs ${item.textColor} font-bold uppercase tracking-widest mb-2`}>
                        {item.title}
                      </div>
                      <div className="text-lg font-bold text-slate-900 leading-relaxed">
                        {item.value}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Important Note */}
          <div className="mt-8 p-5 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 rounded-2xl border border-amber-200/50">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30 flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-amber-800 mb-1">Important Note</div>
                <p className="text-sm text-amber-700 leading-relaxed">
                  Please verify the latest eligibility criteria on the official website as requirements may be updated annually.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}