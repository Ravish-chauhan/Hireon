import React from 'react'
import { Link } from 'react-router-dom'
import { SparklesIcon } from 'lucide-react'
import { useScrollReveal, getAnimationClasses } from '../../hooks/useScrollReveal'
import { useCounterAnimation } from '../../hooks/useCounterAnimation'

const StatCounter = ({ end, suffix, label }: { end: number; suffix: string; label: string }) => {
  const { ref, displayValue } = useCounterAnimation({ end, suffix })

  return (
    <div ref={ref} className="text-center group">
      <div className="text-white font-bold text-xl sm:text-2xl lg:text-3xl leading-none mb-1 group-hover:scale-110 transition-transform duration-300">
        {displayValue}
      </div>
      <div className="text-white/80 text-xs sm:text-sm font-medium">{label}</div>
    </div>
  )
}

export function HeroSection() {
  const { ref: badgeRef, isVisible: badgeVisible } = useScrollReveal({ delay: 0 })
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal({ delay: 100 })
  const { ref: descRef, isVisible: descVisible } = useScrollReveal({ delay: 200 })
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollReveal({ delay: 300 })
  const { ref: imageRef, isVisible: imageVisible } = useScrollReveal({ delay: 200 })

  return (
    <section className="relative min-h-[120vh] lg:min-h-screen flex items-center justify-center overflow-hidden pt-12 lg:pt-20">
      {/* Parallax Background Image */}
      <div
        className="absolute inset-0 z-0 bg-fixed bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80)'
        }}
      />
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#e64f26]/20 to-[#e63939]/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-[#e63939]/20 to-[#e64f26]/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="order-1">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl lg:rounded-3xl p-8 lg:p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-colors duration-300">
              <div
                ref={badgeRef}
                className={`mb-4 lg:mb-6 ${getAnimationClasses(badgeVisible, 'fadeInDown')}`}
              >
                <span className="inline-flex items-center gap-2 px-3 lg:px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium text-xs lg:text-sm border border-white/30 hover:bg-white/30 transition-colors">
                  <SparklesIcon size={14} className="lg:w-4 lg:h-4" />
                  <span className="hidden sm:inline">Bharat's #1 AI-Powered Platform</span>
                  <span className="sm:hidden">#1 AI Platform</span>
                </span>
              </div>

              <h1
                ref={titleRef}
                className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 lg:mb-6 leading-none ${getAnimationClasses(titleVisible, 'fadeInUp')}`}
              >
                <span className="block bg-gradient-to-r from-[#e64f26] via-[#e63939] to-[#e64f26] text-transparent bg-clip-text">
                  EduNiaa
                </span>
              </h1>

              <p
                ref={descRef}
                className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4 lg:mb-6 ${getAnimationClasses(descVisible, 'fadeInUp', 'delay-100')}`}
              >
                Redefining Admission Guidance
              </p>

              <p className={`text-sm sm:text-base lg:text-lg text-white/90 mb-6 lg:mb-8 max-w-xl ${getAnimationClasses(descVisible, 'fadeInUp', 'delay-200')}`}>
                Where AI meets 16+ years of expertise to transform how students
                discover their perfect educational path — in India and beyond.
              </p>

              <div
                ref={ctaRef}
                className={`flex flex-col sm:flex-row gap-3 lg:gap-4 ${getAnimationClasses(ctaVisible, 'fadeInUp', 'delay-300')}`}
              >
                <Link to="/book-consultation" className="group relative px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-[#e64f26] to-[#e63939] text-white rounded-full font-bold text-sm lg:text-lg overflow-hidden transition-all hover:shadow-2xl hover:scale-105 inline-block text-center">
                  <span className="relative z-10">Book Consultation</span>
                </Link>
                <Link to="/profile" className="px-6 lg:px-8 py-3 lg:py-4 bg-white/20 backdrop-blur-sm text-white rounded-full font-bold text-sm lg:text-lg border-2 border-white/30 hover:bg-white/30 transition-all inline-block text-center">
                  View Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Right Content - Image Grid */}
          <div
            ref={imageRef}
            className={`relative h-[400px] sm:h-[500px] lg:h-[600px] order-2 hidden lg:block ${getAnimationClasses(imageVisible, 'fadeInRight', 'duration-1000')}`}
          >
            <div className="absolute inset-0 grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
              <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl group">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Students collaborating"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#e64f26]/40 to-transparent" />
              </div>

              <div className="relative rounded-2xl lg:rounded-3xl shadow-xl mt-6 sm:mt-8 lg:mt-12 bg-gradient-to-br from-[#e64f26] to-[#e63939] flex items-center justify-center group hover:scale-105 transition-transform duration-300">
                <div className="text-center text-white p-3 sm:p-4 lg:p-6">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-black mb-1 lg:mb-2">16+</div>
                  <div className="text-xs sm:text-sm font-semibold mb-1">Years Experience</div>
                  <div className="text-xs opacity-90 hidden sm:block">Trusted expertise</div>
                </div>
              </div>

              <div className="relative rounded-2xl lg:rounded-3xl shadow-xl bg-white flex items-center justify-center group hover:scale-105 transition-transform duration-300">
                <div className="text-center p-3 sm:p-4 lg:p-6">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-[#e64f26] to-[#e63939] text-transparent bg-clip-text mb-1 lg:mb-2">5.2K+</div>
                  <div className="text-xs sm:text-sm font-semibold text-gray-800 mb-1">Students Guided</div>
                  <div className="text-xs text-gray-600 hidden sm:block">Success stories</div>
                </div>
              </div>

              <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl group">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="University campus"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#e63939]/40 to-transparent" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="max-w-4xl mx-auto mt-16 lg:mt-24 px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-gradient-to-r from-[#e64f26] to-[#e63939] backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <StatCounter end={5200} suffix="+" label="Students Guided" />
            <StatCounter end={16} suffix="+" label="Years Experience" />
            <StatCounter end={95} suffix="%" label="Success Rate" />
            <StatCounter end={50} suffix="+" label="Countries" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection