import React, { useRef, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useScrollReveal, getAnimationClasses } from '../hooks/useScrollReveal'
import { useCounterAnimation } from '../hooks/useCounterAnimation'
import { Sparkles, FileText, ArrowRight, CheckCircle2, Zap, Shield, Star } from 'lucide-react'

const StatCounter = ({ end, suffix, label, prefix = '' }: { end: number; suffix: string; label: string; prefix?: string }) => {
  const { ref, displayValue } = useCounterAnimation({ end, suffix, prefix })

  return (
    <div ref={ref} className="text-center group hover:-translate-y-1 transition-transform duration-300">
      <div className="text-white font-bold text-3xl sm:text-4xl md:text-5xl leading-none mb-1 group-hover:text-[#FF9A35] transition-colors">
        {displayValue}
      </div>
      <div className="text-white/60 text-xs sm:text-sm font-medium tracking-wide">{label}</div>
    </div>
  )
}

const ResumeHero: React.FC = () => {
  const navigate = useNavigate()
  const auth = useContext(AuthContext)
  const isAuthenticated = auth?.isAuthenticated
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const cardContainerRef = useRef<HTMLDivElement>(null)

  const { ref: badgeRef, isVisible: badgeVisible } = useScrollReveal({ delay: 0 })
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal({ delay: 100 })
  const { ref: descRef, isVisible: descVisible } = useScrollReveal({ delay: 200 })
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollReveal({ delay: 300 })
  const { ref: trustRef, isVisible: trustVisible } = useScrollReveal({ delay: 400 })
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollReveal({ delay: 200 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardContainerRef.current) return
    const rect = cardContainerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -10 // Max 10 deg rotation
    const rotateY = ((x - centerX) / centerX) * 10

    setRotate({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 })
  }

  const trustPoints = [
    { icon: <Shield className="w-4 h-4" />, text: 'ATS-Friendly' },
    { icon: <CheckCircle2 className="w-4 h-4" />, text: 'Admissions-Ready' },
    { icon: <Zap className="w-4 h-4" />, text: 'AI-Powered' },
  ]

  // Placeholder avatars for social proof
  const avatars = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Mark",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
  ]

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#0A084B]">
      {/* Deep Rich Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a1494] via-[#0A084B] to-[#050424]" />

      {/* Subtle Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`
      }} />

      {/* Animated Glow Orbs - More Subtle */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative w-full py-20 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

            {/* Left Content */}
            <div className="w-full lg:w-1/2 text-center lg:text-left z-10">
              {/* Premium Badge */}
              <div
                ref={badgeRef}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mb-8 hover:bg-white/10 transition-colors cursor-default ${getAnimationClasses(badgeVisible, 'fadeInDown')}`}
              >
                <span className="flex h-2 w-2 rounded-full bg-[#FF9A35] animate-pulse" />
                <span className="text-white/90 font-medium text-sm tracking-wide">
                  #1 AI Resume Builder
                </span>
                <div className="w-px h-3 bg-white/20 mx-1" />
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-3 h-3 text-[#FF9A35] fill-[#FF9A35]" />
                  ))}
                </div>
              </div>

              {/* Title */}
              <h1
                ref={titleRef}
                className={`text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-8 ${getAnimationClasses(titleVisible, 'fadeInUp')}`}
              >
                <div className="text-white mb-2">Create a Resume</div>
                <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9A35] via-[#FFD700] to-[#FF9A35] animate-gradient bg-[length:200%_auto] pb-2">
                  That Opens Doors
                </div>
              </h1>

              {/* Description */}
              <p
                ref={descRef}
                className={`text-white/70 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10 ${getAnimationClasses(descVisible, 'fadeInUp', 'delay-100')}`}
              >
                Stand out with professionally designed templates, AI-powered content enhancements, and optimization for both ATS systems and top university admissions worldwide.
              </p>

              {/* CTAs */}
              <div
                ref={ctaRef}
                className={`flex flex-col sm:flex-row gap-5 justify-center lg:justify-start mb-12 ${getAnimationClasses(ctaVisible, 'fadeInUp', 'delay-200')}`}
              >
                <button
                  onClick={() => isAuthenticated ? navigate('/resume-collection') : navigate('/login')}
                  className="group relative px-8 py-4 rounded-xl bg-white text-[#0F0C89] font-bold text-lg shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div className="relative flex items-center gap-3 z-10">
                    <Sparkles className="w-5 h-5 text-[#FF9A35]" />
                    <span>Build My Resume</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                <button
                  onClick={() => isAuthenticated ? navigate('/resume-upload') : navigate('/login')}
                  className="group px-8 py-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white font-semibold text-lg hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
                >
                  <span className="flex items-center gap-3">
                    <FileText className="w-5 h-5" />
                    Import Resume
                  </span>
                </button>
              </div>

              {/* Social Proof & Trust */}
              <div
                ref={trustRef}
                className={`flex flex-col sm:flex-row items-center gap-8 justify-center lg:justify-start ${getAnimationClasses(trustVisible, 'fadeInUp', 'delay-300')}`}
              >
                {/* Avatar Pile */}
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {avatars.map((avatar, i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0A084B] overflow-hidden bg-white/10 backdrop-blur-sm z-10 hover:z-20 hover:scale-110 transition-transform duration-300">
                        <img src={avatar} alt="User" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-[#0A084B] bg-gradient-to-br from-[#FF9A35] to-[#FFD700] flex items-center justify-center text-[#0A084B] font-bold text-xs z-10">
                      10k+
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="flex gap-0.5 mb-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-3 h-3 text-[#FF9A35] fill-[#FF9A35]" />
                      ))}
                    </div>
                    <div className="text-white/60 text-xs font-medium">Trusted by professionals & students</div>
                  </div>
                </div>

                <div className="w-px h-10 bg-white/10 hidden sm:block" />

                <div className="flex flex-wrap gap-4">
                  {trustPoints.map((point, index) => (
                    <div key={index} className="flex items-center gap-2 text-white/50 text-sm font-medium">
                      <div className="text-green-400 opacity-80">{point.icon}</div>
                      <span>{point.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right - 3D Resume Showcase */}
            <div
              ref={cardsRef}
              className={`w-full lg:w-1/2 relative ${getAnimationClasses(cardsVisible, 'fadeInRight', 'duration-1000')}`}
            >
              <div
                ref={cardContainerRef}
                className="relative h-[500px] sm:h-[600px] lg:h-[650px]"
                style={{ perspective: '1000px' }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {/* Front Card (Main) - 3D Transform Applied Here */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-[85%] h-[90%] bg-white rounded-2xl shadow-[0_25px_70px_-20px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-200 ease-out group"
                  style={{
                    transform: `translateX(-50%) rotateX(${rotate.x * 0.5}deg) rotateY(${rotate.y * 0.5}deg)`,
                    transformOrigin: 'center center',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    willChange: 'transform',
                    boxShadow: '0 25px 70px -20px rgba(0,0,0,0.6)',
                    border: '1px solid rgba(0,0,0,0.1)',
                  }}
                >
                  {/* Executive Blue Template Preview */}

                  {/* Blue Header - Refined */}
                  <div className="h-[180px] bg-gradient-to-br from-[#1e293b] via-[#1e293b] to-[#0f172a] px-8 pt-8 pb-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

                    <div className="relative z-10">
                      {/* Name & Title */}
                      <div className="mb-6">
                        <h2 className="text-3xl font-extrabold mb-1.5 tracking-tight">Alexander Morgan</h2>
                        <p className="text-blue-100/90 text-base font-medium tracking-[0.05em] uppercase">Senior Product Designer</p>
                      </div>

                      {/* Contact Info - Cleaner Layout */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-300/80 font-medium mb-5">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-blue-300/60" />
                          San Francisco, CA
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-blue-300/60" />
                          alex.morgan@email.com
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-blue-300/60" />
                          linkedin.com/in/alexm
                        </span>
                      </div>

                      {/* Skills Tags - Better Positioned */}
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2.5 py-1 bg-white/10 backdrop-blur-sm rounded-md text-[10px] font-semibold tracking-wide border border-white/10">UI/UX DESIGN</span>
                        <span className="px-2.5 py-1 bg-white/10 backdrop-blur-sm rounded-md text-[10px] font-semibold tracking-wide border border-white/10">PRODUCT STRATEGY</span>
                        <span className="px-2.5 py-1 bg-white/10 backdrop-blur-sm rounded-md text-[10px] font-semibold tracking-wide border border-white/10">DESIGN SYSTEMS</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content - Cleaner Spacing */}
                  <div className="p-7 space-y-7 bg-white">
                    {/* Summary */}
                    <div>
                      <h3 className="text-[11px] font-black text-[#1e293b] pb-1.5 mb-2.5 uppercase tracking-[0.08em] border-b-[2.5px] border-[#1e293b]/90">Professional Summary</h3>
                      <div className="space-y-1.5">
                        <div className="h-1.5 bg-gray-100 rounded-full w-full" />
                        <div className="h-1.5 bg-gray-100 rounded-full w-[97%]" />
                        <div className="h-1.5 bg-gray-100 rounded-full w-[92%]" />
                      </div>
                    </div>

                    {/* Experience - Better Organized */}
                    <div>
                      <h3 className="text-[11px] font-black text-[#1e293b] pb-1.5 mb-3 uppercase tracking-[0.08em] border-b-[2.5px] border-[#1e293b]/90">Work Experience</h3>

                      <div className="space-y-5">
                        {[1, 2].map((i) => (
                          <div key={i} className="relative pl-3.5 border-l-2 border-gray-200">
                            <div className="absolute -left-[4.5px] top-1 w-1.5 h-1.5 rounded-full bg-[#1e293b] ring-2 ring-white" />
                            <div className="flex justify-between items-baseline mb-0.5">
                              <div className="h-2.5 bg-gray-800 rounded w-32" />
                              <div className="h-2 bg-gray-400 rounded w-16" />
                            </div>
                            <div className="h-2 bg-gray-300 rounded w-24 mb-2" />
                            <div className="space-y-1">
                              <div className="h-1.5 bg-gray-100 rounded w-[96%]" />
                              <div className="h-1.5 bg-gray-100 rounded w-[88%]" />
                              <div className="h-1.5 bg-gray-100 rounded w-[92%]" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Hover Overlay CTA */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A084B]/95 via-[#0A084B]/80 to-transparent flex items-end justify-center pb-12 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[1px]">
                    <button
                      onClick={() => isAuthenticated ? navigate('/resume-collection') : navigate('/login')}
                      className="px-6 py-3 bg-white text-[#0A084B] rounded-xl font-bold text-base shadow-2xl hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300 flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-[#FF9A35]" />
                      Use This Template
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Floating Elements - Better Positioned */}
                <div
                  className="absolute -right-4 sm:-right-6 top-8 bg-white rounded-2xl p-3.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] animate-float z-20 border border-gray-100/50"
                >
                  <div className="flex gap-3 items-center">
                    <div className="relative w-14 h-14">
                      <svg className="w-full h-full -rotate-90">
                        <circle cx="50%" cy="50%" r="42%" fill="none" stroke="#f1f5f9" strokeWidth="5" />
                        <circle cx="50%" cy="50%" r="42%" fill="none" stroke="#22c55e" strokeWidth="5" strokeDasharray="264" strokeDashoffset="18" strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center font-bold text-lg text-[#22c55e]">95</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">ATS Score</div>
                      <div className="text-sm font-bold text-gray-900">Top 5%</div>
                    </div>
                  </div>
                </div>

                <div
                  className="absolute -left-4 sm:-left-6 bottom-24 bg-white rounded-2xl p-3.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] animate-float z-20 border border-gray-100/50"
                  style={{ animationDelay: '1.5s' }}
                >
                  <div className="flex gap-3 items-center">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FF9A35] to-[#FFD700] flex items-center justify-center shadow-inner">
                      <Sparkles className="w-6 h-6 text-white drop-shadow-sm" />
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Content</div>
                      <div className="text-sm font-bold text-gray-900">AI-Enhanced</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* New Stats Bar */}
          <div className="max-w-4xl mx-auto mt-20 lg:mt-32 px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCounter end={100} suffix="%" label="ATS & Admission Ready" />
              <StatCounter end={10} suffix="+" label="Templates" />
              <StatCounter end={10} suffix="k+" label="Success Stories" />
              <StatCounter end={5} suffix=" min" label="Avg. Build Time" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default ResumeHero
