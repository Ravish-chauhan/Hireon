import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Users, Trophy, ArrowRight, Calendar, FileText } from 'lucide-react'
import { useScrollReveal, getAnimationClasses } from '../../hooks/useScrollReveal'

interface Exam {
    id: string
    name: string
    full_name: string
    category: string
    conducting_body: string
    exam_duration: string
    exam_frequency: string
    registration_fee?: number
    max_score?: number | string
    total_questions?: number | string
    typical_exam_months?: string[]
    difficulty_level?: string
    official_website?: string
}

interface ExamCardProps {
    exam: Exam
    index: number
}

const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
        'Engineering': 'from-blue-500 to-indigo-600',
        'Medical': 'from-green-500 to-emerald-600',
        'Management': 'from-purple-500 to-violet-600',
        'Law': 'from-amber-500 to-orange-600',
        'Language': 'from-pink-500 to-rose-600',
        'General Graduate': 'from-cyan-500 to-teal-600',
        'Undergraduate': 'from-indigo-500 to-blue-600',
    }
    return colors[category] || 'from-gray-500 to-slate-600'
}

const ExamCard: React.FC<ExamCardProps> = ({ exam, index }) => {
    const navigate = useNavigate()
    const { ref, isVisible } = useScrollReveal({ delay: index * 50 })
    const categoryGradient = getCategoryColor(exam.category)

    // Get exam month display
    const examMonth = exam.typical_exam_months?.[0] || 'TBA'

    return (
        <div
            ref={ref}
            className={`group relative ${getAnimationClasses(isVisible, 'fadeInUp', 'duration-700')}`}
        >
            <div
                className="relative h-full bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border border-gray-100 hover:border-transparent"
                onClick={() => navigate(`/exams/${exam.id}`)}
            >
                {/* Gradient Border Effect on Hover */}
                <div className={`absolute inset-0 p-[2px] rounded-2xl bg-gradient-to-br ${categoryGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
                <div className="absolute inset-[2px] bg-white rounded-[14px] -z-10" />

                {/* Rank Watermark */}
                <div className="absolute -top-2 -right-2 text-7xl font-black text-gray-50 group-hover:text-gray-100/60 transition-colors duration-500 select-none pointer-events-none z-0">
                    #{String(index + 1).padStart(2, '0')}
                </div>

                <div className="relative z-10 p-6">
                    {/* Header - Category Badge */}
                    <div className="flex items-start justify-between gap-2 mb-4">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r ${categoryGradient} text-white shadow-sm`}>
                            {exam.category}
                        </span>
                        {exam.typical_exam_months && exam.typical_exam_months.length > 0 && (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                                <Calendar className="w-3 h-3" />
                                {examMonth}
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-[#0066FF] transition-colors duration-300 leading-tight">
                        {exam.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-1">
                        {exam.full_name}
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-gradient-to-br from-gray-50 to-white p-3 rounded-xl border border-gray-100 group-hover:border-blue-100 transition-colors">
                            <div className="flex items-center gap-2 mb-1">
                                <Clock className="w-3.5 h-3.5 text-blue-500" />
                                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Duration</span>
                            </div>
                            <div className="text-sm font-bold text-gray-900">{exam.exam_duration}</div>
                        </div>
                        <div className="bg-gradient-to-br from-gray-50 to-white p-3 rounded-xl border border-gray-100 group-hover:border-green-100 transition-colors">
                            <div className="flex items-center gap-2 mb-1">
                                <FileText className="w-3.5 h-3.5 text-green-500" />
                                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Questions</span>
                            </div>
                            <div className="text-sm font-bold text-gray-900">{exam.total_questions || 'Varies'}</div>
                        </div>
                    </div>

                    {/* Conducting Body */}
                    <div className="mb-4 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <div>
                                <span className="text-xs text-gray-400 font-medium">Conducted by </span>
                                <span className="text-xs font-semibold text-gray-700">{exam.conducting_body}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                        <div>
                            {exam.max_score && (
                                <div className="flex items-center gap-2">
                                    <Trophy className="w-4 h-4 text-[#FF9A35]" />
                                    <span className="text-xs text-gray-500">
                                        Max Score: <span className="font-bold text-gray-900">{exam.max_score}</span>
                                    </span>
                                </div>
                            )}
                            {exam.registration_fee && (
                                <div className="text-xs text-gray-500 mt-1">
                                    Fee: <span className="font-bold text-gray-900">₹{exam.registration_fee.toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0F0C89] to-[#0066FF] text-white font-semibold text-xs shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300">
                            Details
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ExamCard
