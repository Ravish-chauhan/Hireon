import React from 'react'
import { MapPinIcon, GlobeIcon, ArrowRightIcon } from 'lucide-react'
import { useScrollReveal, getAnimationClasses } from '../../hooks/useScrollReveal'

export function DualFocusSection() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal({ delay: 0 })
  const { ref: indiaRef, isVisible: indiaVisible } = useScrollReveal({ delay: 200 })
  const { ref: globalRef, isVisible: globalVisible } = useScrollReveal({ delay: 300 })

  return (
    <section className="py-24 relative overflow-hidden bg-white">
      {/* Diagonal Split Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#e64f26]/5 to-transparent"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 60%, 0 100%)',
          }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-tl from-[#e63939]/5 to-transparent"
          style={{
            clipPath: 'polygon(0 40%, 100% 0, 100% 100%, 0 100%)',
          }}
        />
      </div>

      {/* Subtle glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#e64f26]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#e63939]/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          ref={headerRef}
          className={`text-center mb-8 sm:mb-16 ${getAnimationClasses(headerVisible, 'fadeInUp')}`}
        >
          <span className="inline-block px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-[#e64f26]/10 to-[#e63939]/10 text-[#e64f26] rounded-full text-xs sm:text-sm font-bold mb-4 sm:mb-6 border border-[#e64f26]/20">
            OUR DUAL FOCUS
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6">
            Your Path, Your Choice —{' '}
            <span className="bg-gradient-to-r from-[#e64f26] to-[#e63939] text-transparent bg-clip-text">
              India or Global
            </span>
          </h2>
          <p className="text-sm sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Whether you want to study in Bharat or go global, we ensure you find
            the right path backed by opportunities, clarity, and confidence.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-8">
          {/* India Focus */}
          <div
            ref={indiaRef}
            className={`group ${getAnimationClasses(indiaVisible, 'fadeInLeft', 'duration-700')}`}
          >
            <div className="relative h-full bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="relative h-48 sm:h-80 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Study in India"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <MapPinIcon className="text-white" size={16} />
                    </div>
                    <h3 className="text-lg sm:text-3xl font-black text-white">
                      Study in Bharat
                    </h3>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-8">
                <p className="text-sm sm:text-lg text-gray-700 mb-4 sm:mb-6">
                  Discover the rich educational heritage and cutting-edge
                  opportunities available across India's premier institutions.
                </p>
                <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
                  {['IITs', 'IIMs', 'Medical'].map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 sm:px-3 bg-gradient-to-r from-[#e64f26]/10 to-[#e63939]/10 text-[#e64f26] rounded-full text-xs sm:text-sm font-medium border border-[#e64f26]/20 hover:border-[#e64f26]/40 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <a href="/colleges" className="flex items-center gap-1 sm:gap-2 text-[#e64f26] font-bold hover:gap-2 sm:hover:gap-4 transition-all text-xs sm:text-base group/link">
                  Learn More About EduNiaa
                  <ArrowRightIcon className="w-3 h-3 sm:w-4 sm:h-4 group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* Global Focus */}
          <div
            ref={globalRef}
            className={`group hidden lg:block ${getAnimationClasses(globalVisible, 'fadeInRight', 'duration-700')}`}
          >
            <div className="relative h-full bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="relative h-80 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Study Globally"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <GlobeIcon className="text-white" size={24} />
                    </div>
                    <h3 className="text-3xl font-black text-white">
                      Go Global
                    </h3>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <p className="text-lg text-gray-700 mb-6">
                  Expand your horizons with international education
                  opportunities tailored to your goals. Our expertise spans
                  across continents, helping you find the perfect global
                  institution.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['USA', 'UK', 'Canada', 'Australia', 'Europe'].map((country) => (
                    <span
                      key={country}
                      className="px-3 py-1 bg-gradient-to-r from-[#e63939]/10 to-[#e64f26]/10 text-[#e63939] rounded-full text-sm font-medium border border-[#e63939]/20 hover:border-[#e63939]/40 transition-colors"
                    >
                      {country}
                    </span>
                  ))}
                </div>
                <button className="flex items-center gap-2 text-[#e63939] font-bold hover:gap-4 transition-all group/link">
                  Explore Global Universities
                  <ArrowRightIcon size={20} className="group-hover/link:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DualFocusSection