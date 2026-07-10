import React from 'react'
import {
  SearchIcon,
  UsersIcon,
  BookOpenIcon,
  TrendingUpIcon,
  AwardIcon,
} from 'lucide-react'
import { useScrollReveal, getAnimationClasses } from '../../hooks/useScrollReveal'
import { useCounterAnimation } from '../../hooks/useCounterAnimation'

const StatCounter = ({ value, label, description, icon, gradient, index }: {
  value: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  index: number;
}) => {
  // Extract numeric value for animation
  const numericMatch = value.match(/(\d+)/);
  const numericValue = numericMatch ? parseInt(numericMatch[1]) : 0;
  const suffix = value.replace(/\d+/, '');

  const { ref, displayValue } = useCounterAnimation({ end: numericValue, suffix })

  return (
    <div
      ref={ref}
      className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:-translate-y-1"
    >
      <div
        className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-2 sm:mb-3 mx-auto group-hover:scale-110 transition-transform duration-300`}
      >
        <div className="scale-75 sm:scale-100">{icon}</div>
      </div>
      <div className="text-lg sm:text-2xl font-black bg-gradient-to-r from-[#e64f26] to-[#e63939] text-transparent bg-clip-text mb-1">
        {displayValue}
      </div>
      <div className="text-xs sm:text-sm font-semibold text-gray-800 mb-1">
        {label}
      </div>
      <div className="text-xs text-gray-600 hidden sm:block">
        {description}
      </div>
    </div>
  )
}

export function ExpertiseTimeline() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal({ delay: 0 })
  const { ref: videoRef, isVisible: videoVisible } = useScrollReveal({ delay: 100 })
  const { ref: statsRef, isVisible: statsVisible } = useScrollReveal({ delay: 200 })
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollReveal({ delay: 300 })
  const { ref: commitmentRef, isVisible: commitmentVisible } = useScrollReveal({ delay: 400 })

  const stats = [
    {
      value: '10000+',
      label: 'Students Guided',
      icon: <UsersIcon size={24} />,
      description: 'Successfully guided to their dream institutions'
    },
    {
      value: '95%',
      label: 'Success Rate',
      icon: <TrendingUpIcon size={24} />,
      description: 'Students achieve their admission goals'
    },
    {
      value: '50+',
      label: 'Countries',
      icon: <SearchIcon size={24} />,
      description: 'Global reach across continents'
    },
    {
      value: '1000+',
      label: 'Universities',
      icon: <BookOpenIcon size={24} />,
      description: 'Partner institutions worldwide'
    },
  ]

  const features = [
    {
      icon: <SearchIcon size={20} />,
      title: 'Research-Driven Evaluation',
      description: 'We analyze your academic profile, extracurricular activities, and personal interests to identify the best-fit educational pathways.'
    },
    {
      icon: <UsersIcon size={20} />,
      title: 'Expert Mentoring',
      description: 'Our team of experienced counselors provides personalized guidance throughout your educational journey with 16+ years of expertise.'
    },
    {
      icon: <BookOpenIcon size={20} />,
      title: 'Authentic Storytelling',
      description: 'We help you craft compelling narratives that authentically showcase your journey, achievements, and aspirations.'
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-[#fff5eb] to-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#e64f26]/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#e63939]/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          ref={headerRef}
          className={`text-center mb-8 sm:mb-16 ${getAnimationClasses(headerVisible, 'fadeInUp')}`}
        >
          <span className="inline-block px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-[#e64f26]/10 to-[#e63939]/10 text-[#e64f26] rounded-full text-xs sm:text-sm font-bold mb-4 sm:mb-6 border border-[#e64f26]/20">
            OUR EXPERTISE
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6">
            No Two Journeys Are{' '}
            <span className="bg-gradient-to-r from-[#e64f26] to-[#e63939] text-transparent bg-clip-text">
              The Same
            </span>
          </h2>
          <p className="text-sm sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Through research-driven evaluation, expert mentoring, and authentic
            storytelling, we help students present who they genuinely are —
            their strengths, passions, and potential.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Video Section */}
          <div
            ref={videoRef}
            className={`lg:col-span-4 ${getAnimationClasses(videoVisible, 'fadeInLeft', 'duration-700')}`}
          >
            <div className="relative">
              <div className="relative aspect-[16/9] lg:aspect-[9/16] bg-gray-900 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl group">
                <video
                  className="w-full h-full object-cover"
                  controls
                  preload="metadata"
                  poster="/api/placeholder/400/700"
                >
                  <source src="/advid.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="lg:col-span-8">
            {/* Stats Grid */}
            <div
              ref={statsRef}
              className={`grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 ${getAnimationClasses(statsVisible, 'fadeInUp')}`}
            >
              {stats.map((stat, index) => (
                <StatCounter
                  key={index}
                  value={stat.value}
                  label={stat.label}
                  description={stat.description}
                  icon={stat.icon}
                  gradient={index % 2 === 0 ? 'from-[#e64f26] to-[#e63939]' : 'from-[#e63939] to-[#e64f26]'}
                  index={index}
                />
              ))}
            </div>

            {/* Feature Cards */}
            <div
              ref={featuresRef}
              className={`space-y-3 sm:space-y-4 ${getAnimationClasses(featuresVisible, 'fadeInUp', 'delay-200')}`}
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-3 sm:border-l-4 border-[#e64f26] group hover:-translate-y-1"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-[#e64f26] to-[#e63939] flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <div className="scale-75 sm:scale-100">{feature.icon}</div>
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-lg font-bold text-gray-800 mb-1 sm:mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>


          </div>
        </div>

        {/* Our Commitment Section - Now below both left and right content */}
        <div
          ref={commitmentRef}
          className={`mt-12 ${getAnimationClasses(commitmentVisible, 'fadeInUp')}`}
        >
          <div className="bg-gradient-to-r from-[#e64f26]/10 to-[#e63939]/10 rounded-2xl p-8 border border-[#e64f26]/20 hover:border-[#e64f26]/40 transition-colors duration-300">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#e64f26] to-[#e63939] flex items-center justify-center">
                <AwardIcon className="text-white" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Our Commitment</h3>
            </div>
            <p className="text-gray-700 leading-relaxed text-center max-w-4xl mx-auto text-lg">
              Every student's journey is unique. We combine cutting-edge AI technology with human expertise
              to provide personalized guidance that helps students discover and pursue their ideal educational path,
              whether in India or abroad.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ExpertiseTimeline