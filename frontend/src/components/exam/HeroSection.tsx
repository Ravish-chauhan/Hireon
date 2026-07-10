import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CalendarIcon,
  ClockIcon,
  GlobeIcon,
  ArrowLeftIcon,
  AwardIcon,
  BookOpenIcon,
  Sparkles,
  FileText,
  Target,
} from 'lucide-react'

interface HeroSectionProps {
  exam: {
    name: string
    full_name: string
    conducting_body: string
    exam_level: string
    exam_duration: string
    exam_frequency: string
    difficulty_level?: string
    preparation_time: string
    description: string
    official_website?: string
    category?: string
    exam_mode?: string
    total_questions?: number | string
    total_marks?: number | string
    typical_exam_months?: string[]
    score_validity?: string
  }
}

export function HeroSection({ exam }: HeroSectionProps) {
  const navigate = useNavigate()

  const getCategoryImage = (category?: string) => {
    const images: { [key: string]: string } = {
      'Engineering': 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'Medical': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'Management': 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'Law': 'https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'Language': 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'General Graduate': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    }
    return images[category || ''] || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }

  // Get exam month display
  const examMonths = exam.typical_exam_months?.join(', ') || 'Check official website'

  return (
    <div className="relative min-h-[75vh] overflow-hidden bg-[#0A084B]">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={getCategoryImage(exam.category)}
          alt={exam.name}
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A084B]/80 via-[#0A084B]/90 to-[#0A084B]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent" />
      </div>

      {/* Glow Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        {/* Back Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate('/exams');
          }}
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors group cursor-pointer bg-transparent border-none p-0"
        >
          <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Exams</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            {/* Badges */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-[#FF9A35] to-[#FFB366] text-white shadow-lg">
                {exam.category}
              </span>
              <span className="px-4 py-2 rounded-xl text-sm font-semibold bg-white/10 backdrop-blur-sm text-white border border-white/20">
                {exam.exam_level}
              </span>
              {exam.exam_mode && (
                <span className="px-4 py-2 rounded-xl text-sm font-semibold bg-white/10 backdrop-blur-sm text-white border border-white/20">
                  {exam.exam_mode}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-2 leading-none">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9A35] via-[#FFD700] to-[#FF9A35]">
                {exam.name}
              </span>
            </h1>
            <h2 className="text-2xl sm:text-3xl font-bold text-white/90 mb-4">
              {exam.full_name}
            </h2>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2 text-white/70">
                <BookOpenIcon className="w-5 h-5 text-[#FF9A35]" />
                <span className="font-medium">{exam.conducting_body}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-white/60 leading-relaxed mb-8 max-w-xl">
              {exam.description}
            </p>

            {/* Key Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <ClockIcon className="w-4 h-4 text-[#FF9A35]" />
                  <span className="text-[10px] text-white/50 font-semibold uppercase tracking-wider">Duration</span>
                </div>
                <div className="text-lg font-black text-white">{exam.exam_duration}</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-[#FF9A35]" />
                  <span className="text-[10px] text-white/50 font-semibold uppercase tracking-wider">Questions</span>
                </div>
                <div className="text-lg font-black text-white">{exam.total_questions || 'Varies'}</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-[#FF9A35]" />
                  <span className="text-[10px] text-white/50 font-semibold uppercase tracking-wider">Max Marks</span>
                </div>
                <div className="text-lg font-black text-white">{exam.total_marks || 'Varies'}</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarIcon className="w-4 h-4 text-[#FF9A35]" />
                  <span className="text-[10px] text-white/50 font-semibold uppercase tracking-wider">Exam In</span>
                </div>
                <div className="text-lg font-black text-white">{examMonths}</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/book-consultation')}
                className="group relative px-8 py-4 rounded-xl bg-white text-[#0F0C89] font-bold text-lg shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex items-center justify-center gap-3"
              >
                <Sparkles className="w-5 h-5 text-[#FF9A35]" />
                Book Free Consultation
              </button>

              {exam.official_website && (
                <button
                  onClick={() => window.open(exam.official_website, '_blank')}
                  className="group px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-lg hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <GlobeIcon className="w-5 h-5" />
                  Official Website
                </button>
              )}
            </div>
          </div>

          {/* Right - Key Highlights Card */}
          <div className="hidden lg:block relative">
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF9A35] to-[#FFD700] flex items-center justify-center">
                  <AwardIcon className="w-5 h-5 text-white" />
                </div>
                Key Highlights
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <ClockIcon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold mb-1">Exam Duration</div>
                    <div className="text-white/60 text-sm">{exam.exam_duration} to complete the exam</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <CalendarIcon className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold mb-1">Conducted In</div>
                    <div className="text-white/60 text-sm">{examMonths} ({exam.exam_frequency})</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <AwardIcon className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold mb-1">Preparation Time</div>
                    <div className="text-white/60 text-sm">{exam.preparation_time} of dedicated study</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <GlobeIcon className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold mb-1">Exam Mode</div>
                    <div className="text-white/60 text-sm">{exam.exam_mode || 'Online & Offline'}</div>
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