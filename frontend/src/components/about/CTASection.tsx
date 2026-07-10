import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon, MailIcon, PhoneIcon } from 'lucide-react'
import { useScrollReveal, getAnimationClasses } from '../../hooks/useScrollReveal'

export function CTASection() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal({ delay: 0 })
  const { ref: buttonsRef, isVisible: buttonsVisible } = useScrollReveal({ delay: 200 })
  const { ref: contactRef, isVisible: contactVisible } = useScrollReveal({ delay: 400 })

  return (
    <section className="py-12 sm:py-24 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#e64f26] via-[#e63939] to-[#e64f26]" />

      {/* Animated Glow Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-96 sm:h-96 bg-white/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-96 sm:h-96 bg-white/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px]" />
      </div>

      {/* Subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`
      }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center text-white">
          <div
            ref={headerRef}
            className={getAnimationClasses(headerVisible, 'fadeInUp')}
          >
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-black mb-4 sm:mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-sm sm:text-xl md:text-2xl mb-8 sm:mb-12 text-white/90 max-w-3xl mx-auto px-4">
              Join thousands of students who've transformed their educational
              dreams into reality with EduNiaa
            </p>
          </div>

          <div
            ref={buttonsRef}
            className={`flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-16 ${getAnimationClasses(buttonsVisible, 'fadeInUp', 'delay-200')}`}
          >
            <Link
              to="/register"
              className="group px-6 py-3 sm:px-8 sm:py-4 bg-white text-[#e64f26] rounded-full font-bold text-sm sm:text-lg flex items-center gap-2 sm:gap-3 shadow-xl hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all duration-300 hover:scale-105"
            >
              Get Started Today
              <ArrowRightIcon
                className="group-hover:translate-x-1 transition-transform duration-300"
                size={16}
              />
            </Link>
            <Link
              to="/book-consultation"
              className="px-6 py-3 sm:px-8 sm:py-4 bg-white/10 backdrop-blur-md text-white rounded-full font-bold text-sm sm:text-lg border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 inline-block hover:scale-105"
            >
              Schedule a Consultation
            </Link>
          </div>

          <div
            ref={contactRef}
            className={`grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 max-w-2xl mx-auto ${getAnimationClasses(contactVisible, 'fadeInUp', 'delay-400')}`}
          >
            <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 group">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MailIcon size={20} />
                </div>
                <div className="text-left">
                  <div className="text-xs sm:text-sm text-white/70">Email Us</div>
                  <div className="font-bold text-sm sm:text-base">contact@eduniaa.com</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 group">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <PhoneIcon size={20} />
                </div>
                <div className="text-left">
                  <div className="text-xs sm:text-sm text-white/70">Call Us</div>
                  <div className="font-bold text-sm sm:text-base">+91 9163591151</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection