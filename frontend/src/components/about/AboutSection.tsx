import React from 'react'
import { useScrollReveal, getAnimationClasses } from '../../hooks/useScrollReveal'

export function AboutSection() {
  const { ref: badgeRef, isVisible: badgeVisible } = useScrollReveal({ delay: 0 })
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal({ delay: 100 })
  const { ref: quoteRef, isVisible: quoteVisible } = useScrollReveal({ delay: 150 })
  const { ref: textRef, isVisible: textVisible } = useScrollReveal({ delay: 200 })
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollReveal({ delay: 300 })
  const { ref: imageRef, isVisible: imageVisible } = useScrollReveal({ delay: 100 })

  return (
    <section className="py-12 sm:py-24 relative overflow-hidden bg-white">
      {/* Subtle Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#e64f26]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#e63939]/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Enhanced Visual Section */}
          <div
            ref={imageRef}
            className={`lg:col-span-5 space-y-4 sm:space-y-6 order-1 lg:order-1 ${getAnimationClasses(imageVisible, 'fadeInLeft', 'duration-700')}`}
          >
            {/* Main Image */}
            <div className="relative h-[250px] sm:h-[350px] lg:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl group">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Students collaborating"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#e64f26]/40 to-transparent" />
            </div>

            {/* Accordion Service Cards - Hidden on mobile */}
            <div className="hidden lg:block space-y-3">
              <div className="group bg-white border-2 border-[#e64f26] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-center gap-3 p-4 cursor-pointer">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#e64f26] to-[#e63939] rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-[#e64f26]">Career Counselling</h4>
                </div>
                <div className="max-h-0 group-hover:max-h-20 overflow-hidden transition-all duration-300 px-4 pb-0 group-hover:pb-4">
                  <p className="text-sm text-gray-600">AI-powered career guidance for India & abroad with personalized recommendations</p>
                </div>
              </div>

              <div className="group bg-white border-2 border-[#e63939] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-center gap-3 p-4 cursor-pointer">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#e63939] to-[#e64f26] rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-[#e63939]">Profile Building</h4>
                </div>
                <div className="max-h-0 group-hover:max-h-20 overflow-hidden transition-all duration-300 px-4 pb-0 group-hover:pb-4">
                  <p className="text-sm text-gray-600">Authentic storytelling of your potential with comprehensive profile enhancement</p>
                </div>
              </div>

              <div className="group bg-white border-2 border-[#e64f26] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-center gap-3 p-4 cursor-pointer">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#e64f26] to-[#e63939] rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-[#e64f26]">Application Support</h4>
                </div>
                <div className="max-h-0 group-hover:max-h-20 overflow-hidden transition-all duration-300 px-4 pb-0 group-hover:pb-4">
                  <p className="text-sm text-gray-600">End-to-end SOP, LOR & visa assistance with expert guidance throughout</p>
                </div>
              </div>
            </div>

          </div>

          {/* Content */}
          <div className="lg:col-span-7 order-2 lg:order-2">
            <div className="lg:pl-12">
              <div
                ref={badgeRef}
                className={getAnimationClasses(badgeVisible, 'fadeInDown')}
              >
                <span className="inline-block px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-[#e64f26]/10 to-[#e63939]/10 text-[#e64f26] rounded-full text-xs sm:text-sm font-bold mb-4 sm:mb-6 border border-[#e64f26]/20">
                  ABOUT EDUNIAA
                </span>
              </div>

              <h2
                ref={titleRef}
                className={`text-2xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 leading-tight ${getAnimationClasses(titleVisible, 'fadeInUp')}`}
              >
                Where Human Wisdom Meets{' '}
                <span className="bg-gradient-to-r from-[#e64f26] to-[#e63939] text-transparent bg-clip-text">
                  AI Intelligence
                </span>
              </h2>

              <div
                ref={quoteRef}
                className={`mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-[#e64f26]/5 to-[#e63939]/5 rounded-lg sm:rounded-xl border-l-3 sm:border-l-4 border-[#e64f26] ${getAnimationClasses(quoteVisible, 'fadeInUp', 'delay-100')}`}
              >
                <p className="text-sm sm:text-xl font-semibold text-gray-900 italic">
                  "We don't counsel. We strategize, personalize, and deliver results."
                </p>
              </div>

              <div
                ref={textRef}
                className={`space-y-3 sm:space-y-4 text-sm sm:text-lg text-gray-700 ${getAnimationClasses(textVisible, 'fadeInUp', 'delay-200')}`}
              >
                <p>
                  EduNiaa is where human wisdom meets AI intelligence. Built for today's ambitious learners,
                  EduNiaa blends expert mentorship with powerful AI analysis to guide students seamlessly
                  from their first query to final admission acceptance.
                </p>
                <p>
                  In a world full of confusing choices and unreliable counseling, EduNiaa stands as a
                  transparent, student-first platform committed to accuracy, integrity, and outcomes.
                </p>
                <p className="font-semibold text-gray-900">
                  Our human counselors bring empathy, experience, and clarity — while our AI engine
                  refines profiles, analyzes opportunities, and ensures every student receives the most
                  precise and personalized guidance.
                </p>
              </div>

              <div
                ref={cardsRef}
                className={`mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 ${getAnimationClasses(cardsVisible, 'fadeInUp', 'delay-300')}`}
              >
                <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#e64f26]/20 to-[#e63939]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#e64f26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                      </svg>
                    </div>
                    <div className="font-bold text-gray-900 text-sm sm:text-base">Human-Centric Approach</div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">Seasoned experts who deeply understand student needs</p>
                </div>

                <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#e63939]/20 to-[#e64f26]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#e63939]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="font-bold text-gray-900 text-sm sm:text-base">AI-Enhanced Accuracy</div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">Intelligent algorithms that evaluate profiles and match programs</p>
                </div>

                <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                      </svg>
                    </div>
                    <div className="font-bold text-gray-900 text-sm sm:text-base">End-to-End Support</div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">From first call to acceptance, structured and transparent</p>
                </div>

                <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div className="font-bold text-gray-900 text-sm sm:text-base">Zero-Scam Assurance</div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">No false promises, just clean ethical guidance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection