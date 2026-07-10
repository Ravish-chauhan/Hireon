import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useScrollReveal, getAnimationClasses } from '../../hooks/useScrollReveal'
import { useCounterAnimation } from '../../hooks/useCounterAnimation'
import {
  Users,
  Calendar,
  Star,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  GraduationCap,
  Trophy,
  Target,
} from 'lucide-react'

const StatCounter = ({ end, suffix, label }: { end: number; suffix: string; label: string }) => {
  const { ref, displayValue } = useCounterAnimation({ end, suffix })

  return (
    <div ref={ref} className="text-center group hover:-translate-y-1 transition-transform duration-300">
      <div className="text-gray-900 font-bold text-3xl sm:text-4xl md:text-5xl leading-none mb-1 group-hover:text-[#0066FF] transition-colors">
        {displayValue}
      </div>
      <div className="text-gray-500 text-xs sm:text-sm font-medium tracking-wide">{label}</div>
    </div>
  )
}

interface ConsultationHeroProps {
  onViewBookings?: () => void
}

const ConsultationHero: React.FC<ConsultationHeroProps> = ({ onViewBookings }) => {
  const navigate = useNavigate()

  const { ref: badgeRef, isVisible: badgeVisible } = useScrollReveal({ delay: 0 })
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal({ delay: 100 })
  const { ref: descRef, isVisible: descVisible } = useScrollReveal({ delay: 200 })
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollReveal({ delay: 300 })
  const { ref: statsRef, isVisible: statsVisible } = useScrollReveal({ delay: 400 })

  const trustPoints = [
    { icon: <CheckCircle2 className="w-4 h-4" />, text: 'Personalized Advice' },
    { icon: <Star className="w-4 h-4" />, text: 'Expert Consultants' },
    { icon: <Sparkles className="w-4 h-4" />, text: 'Free First Session' },
  ]

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-white pt-20">
      {/* Light Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-gray-50" />

      {/* Subtle Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`
      }} />

      {/* Animated Glow Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[30%] right-[10%] w-[400px] h-[400px] bg-blue-400/5 rounded-full blur-[80px] animate-pulse-slow" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative w-full py-12 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left Content */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              {/* Premium Badge */}
              <div
                ref={badgeRef}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 mb-8 hover:bg-blue-100 transition-colors cursor-default ${getAnimationClasses(badgeVisible, 'fadeInDown')}`}
              >
                <span className="flex h-2 w-2 rounded-full bg-[#0066FF] animate-pulse" />
                <span className="text-gray-700 font-medium text-sm tracking-wide">
                  Expert Education Consultation
                </span>
                <div className="w-px h-3 bg-gray-300 mx-1" />
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-3 h-3 text-[#0066FF] fill-[#0066FF]" />
                  ))}
                </div>
              </div>

              {/* Title */}
              <h1
                ref={titleRef}
                className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight mb-8 ${getAnimationClasses(titleVisible, 'fadeInUp')}`}
              >
                <div className="text-gray-900 mb-2">Get Expert</div>
                <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] via-[#0F0C89] to-[#0066FF] animate-gradient bg-[length:200%_auto] pb-2">
                  Guidance Today
                </div>
              </h1>

              {/* Description */}
              <p
                ref={descRef}
                className={`text-gray-600 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10 ${getAnimationClasses(descVisible, 'fadeInUp', 'delay-100')}`}
              >
                Connect with our experienced education consultants who have helped 5,000+ students achieve their dreams. From profile building to final admissions, we guide you at every step.
              </p>

              {/* CTAs */}
              <div
                ref={ctaRef}
                className={`flex flex-col sm:flex-row gap-5 justify-center lg:justify-start mb-12 ${getAnimationClasses(ctaVisible, 'fadeInUp', 'delay-200')}`}
              >
                <a
                  href="#consultation-form"
                  className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#0F0C89] text-white font-bold text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden text-center"
                >
                  <div className="relative flex items-center justify-center gap-3 z-10">
                    <Calendar className="w-5 h-5 text-white" />
                    <span>Book Free Consultation</span>
                  </div>
                </a>

                <button
                  onClick={() => navigate('/my-consultations')}
                  className="group px-8 py-4 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold text-lg hover:bg-gray-50 hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 shadow-sm"
                >
                  <span className="flex items-center justify-center gap-3">
                    <MessageCircle className="w-5 h-5 text-[#0066FF]" />
                    View My Bookings
                  </span>
                </button>
              </div>

              {/* Trust Points */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                {trustPoints.map((point, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                    <div className="text-green-500">{point.icon}</div>
                    <span>{point.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Floating Cards */}
            <div className="w-full lg:w-1/2 relative hidden lg:block">
              <div className="relative h-[500px]">
                {/* Main Featured Consultant Card */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] bg-white rounded-2xl p-6 border border-gray-200 shadow-2xl hover:scale-105 transition-transform duration-500">
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#0066FF] to-[#0F0C89] flex items-center justify-center text-4xl mb-3 shadow-lg shadow-blue-500/30">
                      👤
                    </div>
                    <h3 className="text-gray-900 font-bold text-xl">Expert Counselor</h3>
                    <p className="text-gray-500 text-sm">20+ Years Experience</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <GraduationCap className="w-4 h-4 text-[#0066FF]" />
                      <span>IIT/IIM Admission Expert</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Trophy className="w-4 h-4 text-[#0066FF]" />
                      <span>5000+ Students Guided</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Target className="w-4 h-4 text-[#0066FF]" />
                      <span>98% Success Rate</span>
                    </div>
                  </div>
                </div>

                {/* Floating Strategy Card */}
                <div className="absolute top-4 right-4 bg-white rounded-2xl p-4 shadow-2xl animate-float transform rotate-6 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Strategy</div>
                      <div className="text-sm font-bold text-gray-900">Admission Planning</div>
                    </div>
                  </div>
                </div>

                {/* Floating Career Card */}
                <div className="absolute bottom-20 left-0 bg-white rounded-2xl p-4 shadow-2xl animate-float transform -rotate-6 hover:rotate-0 transition-transform duration-500" style={{ animationDelay: '1.5s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Guidance</div>
                      <div className="text-sm font-bold text-gray-900">Career Counseling</div>
                    </div>
                  </div>
                </div>

                {/* Floating Session Card */}
                <div className="absolute top-24 left-8 bg-white rounded-2xl p-4 shadow-2xl animate-float transform rotate-3 hover:rotate-0 transition-transform duration-500" style={{ animationDelay: '3s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Sessions</div>
                      <div className="text-sm font-bold text-gray-900">1-on-1 Expert Call</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div
            ref={statsRef}
            className={`mt-16 lg:mt-24 ${getAnimationClasses(statsVisible, 'fadeInUp', 'delay-400')}`}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-3xl mx-auto pt-8 border-t border-gray-200">
              <StatCounter end={6} suffix="+" label="Expert Consultants" />
              <StatCounter end={5000} suffix="+" label="Sessions Completed" />
              <StatCounter end={98} suffix="%" label="Success Rate" />
              <StatCounter end={30} suffix=" min" label="Session Duration" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ConsultationHero
