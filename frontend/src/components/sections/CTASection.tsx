import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { FaArrowRight, FaRocket } from 'react-icons/fa'
import { useScrollReveal, getAnimationClasses } from '../../hooks/useScrollReveal'

export const CTASection = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const { ref: contentRef, isVisible: contentVisible } = useScrollReveal({ delay: 0 })
  const { ref: buttonRef, isVisible: buttonVisible } = useScrollReveal({ delay: 300 })

  return (
    <section className="bg-white py-8 md:py-12 lg:py-16 relative overflow-hidden">
      {/* Animated background orbs */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200px] sm:w-[280px] lg:w-[350px] h-[200px] sm:h-[280px] lg:h-[350px] bg-[#0066ffb2] rounded-full blur-[100px] sm:blur-[120px] lg:blur-[140px] opacity-20 -z-10 animate-pulse"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/4 left-1/4 w-[100px] sm:w-[150px] lg:w-[200px] h-[100px] sm:h-[150px] lg:h-[200px] bg-[#FF9A35] rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px] opacity-15 -z-10 animate-float"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[80px] sm:w-[120px] lg:w-[180px] h-[80px] sm:h-[120px] lg:h-[180px] bg-[#2925f3] rounded-full blur-[60px] sm:blur-[80px] lg:blur-[100px] opacity-15 -z-10 animate-bounce-slow"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4">
        <div
          ref={contentRef}
          className={`flex flex-col items-center justify-center gap-6 text-center max-w-4xl mx-auto ${getAnimationClasses(contentVisible, 'scaleIn', 'duration-700')}`}
        >
          <div className="flex flex-col gap-3 items-center justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#0F0C89] to-[#0066FF] text-white text-sm font-medium mb-4 animate-pulse">
              <FaRocket className="w-4 h-4" />
              <span>Start Your Journey</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#191a15] text-center leading-tight">
              Ready To Start Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-[#FF9A35] animate-gradient">
                Educational Journey?
              </span>
            </h1>

            <p className="text-[#6b6969] text-sm sm:text-base md:text-lg text-center leading-relaxed max-w-3xl">
              Take the first step towards academic excellence with Eduniaa's
              expert guidance.
              <br />We provide personalized support to help you choose the right
              path and achieve your goals.
            </p>
          </div>

          <button
            ref={buttonRef}
            className={`bg-gradient-to-r from-[#0f0c89] to-[#0066FF] hover:from-[#0d0a70] hover:to-[#0055DD] text-white font-medium text-sm sm:text-base lg:text-lg py-3 sm:py-4 px-8 sm:px-10 lg:px-14 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#0066FF]/30 focus:ring-offset-2 inline-flex items-center gap-3 group relative overflow-hidden ${getAnimationClasses(buttonVisible, 'fadeInUp', 'duration-500')}`}
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
            aria-label="Get Started Today"
          >
            {/* Button shine effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>

            <span className="relative z-10">Get Started Today</span>
            <FaArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  )
}