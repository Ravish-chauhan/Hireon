import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useScrollReveal, getAnimationClasses } from '../../hooks/useScrollReveal'

export const ConsultationSection = () => {
  const navigate = useNavigate()

  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal({ delay: 0 })
  const { ref: imageRef, isVisible: imageVisible } = useScrollReveal({ delay: 200 })

  const benefits = [
    {
      id: 1,
      title: 'Personalized Career Roadmap',
      description:
        'Get a customized plan tailored to your strengths and aspirations',
      isActive: true,
    },
    {
      id: 2,
      title: 'Scholarship Opportunities',
      description: 'Access exclusive scholarship programs worth crores',
      isActive: false,
    },
    {
      id: 3,
      title: 'Document Support',
      description: 'Expert help with SOPs, LORs, resumes, and applications.',
      isActive: false,
    },
    {
      id: 4,
      title: 'End-to-End Assistance',
      description:
        'From career clarity to admission & visa everything handled in one place.',
      isActive: false,
    },
  ]

  return (
    <section className="bg-white py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-4 2xl:max-w-[1350px]">
        <div className="flex flex-col items-center justify-center gap-8 md:gap-12">
          <header
            ref={headerRef}
            className={`flex flex-col items-center justify-center gap-6 text-center max-w-4xl ${getAnimationClasses(headerVisible, 'fadeInUp')}`}
          >
            <div className="inline-flex items-center gap-0.5 px-4 py-2 rounded-xl bg-[#2925f3]">
              <span className="text-white text-center font-medium text-sm sm:text-base leading-tight">
                Education Partner
              </span>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 md:gap-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#191A15] text-center leading-tight">
                Begin Your Success Journey Today
              </h1>

              <p className="text-[#191A15] text-base sm:text-lg md:text-xl leading-relaxed text-center max-w-3xl">
                From choosing the right course to securing top university
                admissions, we stand beside you as a trusted partner in every
                decision.
              </p>
            </div>
          </header>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8 lg:gap-12 w-full">
            {/* Image collage */}
            <div
              ref={imageRef}
              className={`relative w-full max-w-[240px] sm:max-w-[300px] md:max-w-[380px] lg:max-w-[588px] h-[180px] sm:h-[220px] md:h-[280px] lg:h-[672px] flex-shrink-0 mx-auto lg:mx-0 order-1 lg:order-1 ${getAnimationClasses(imageVisible, 'fadeInLeft', 'duration-1000')}`}
              role="img"
              aria-label="Education consultation images collage"
            >
              <img
                className="absolute top-0 left-0 w-full lg:w-[596px] h-full lg:h-[229px] object-cover rounded-md sm:rounded-lg hover:scale-105 transition-transform duration-500"
                alt="Students collaborating in study environment"
                src="/hero.jpg"
              />

              <img
                className="hidden lg:block absolute top-[130px] sm:top-[160px] md:top-[200px] lg:top-[509px] right-0 lg:left-[299px] w-[48%] lg:w-[293px] h-[45px] sm:h-[55px] md:h-[75px] lg:h-[171px] object-cover rounded-md sm:rounded-lg hover:scale-105 transition-transform duration-500"
                alt="Students working together on laptops"
                src="/culture.jpg"
              />

              <img
                className="hidden lg:block absolute top-[55px] sm:top-[70px] md:top-[90px] lg:top-[246px] left-0 w-[48%] lg:w-[290px] h-[70px] sm:h-[85px] md:h-[105px] lg:h-[434px] object-cover rounded-md sm:rounded-lg hover:scale-105 transition-transform duration-500"
                alt="Student holding educational materials"
                src="/career-hero.jpg"
              />

              <img
                className="hidden lg:block absolute top-[55px] sm:top-[70px] md:top-[90px] lg:top-[246px] right-0 lg:left-[299px] w-[48%] lg:w-[293px] h-[70px] sm:h-[85px] md:h-[105px] lg:h-[242px] object-cover rounded-md sm:rounded-lg hover:scale-105 transition-transform duration-500"
                alt="Group learning session in classroom"
                src="/jee.jpg"
              />
            </div>

            {/* Benefits section */}
            <div className="flex flex-col w-full max-w-[550px] items-start gap-4 sm:gap-6 order-2 lg:order-2">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-[#191A15] leading-tight">
                Why Fill Out the Form Now?
              </h2>

              <div className="flex gap-3 sm:gap-4 w-full relative">
                <div className="w-2 sm:w-3 lg:w-3 bg-[#2925f3] rounded-full relative min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[480px]">
                  {benefits.map((_, index) => (
                    <TimelineDot key={index} index={index} />
                  ))}
                </div>

                <div className="flex flex-col gap-4 sm:gap-6 flex-1">
                  {benefits.map((benefit, index) => (
                    <BenefitCard key={benefit.id} benefit={benefit} index={index} />
                  ))}
                </div>
              </div>

              <button
                className="w-full bg-[#2925f3] hover:bg-[#1e1fb8] hover:scale-105 text-white font-medium text-sm sm:text-base lg:text-lg py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-300 hover:shadow-xl"
                onClick={() => navigate('/book-consultation')}
              >
                Book My Free Consultation
              </button>

              <p className="text-center text-[#6b6969] text-xs sm:text-sm w-full">
                ⚡ Get a response within 24 hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const TimelineDot = ({ index }: { index: number }) => {
  const { ref, isVisible } = useScrollReveal({ delay: index * 150 + 300 })

  return (
    <div
      ref={ref}
      className={`absolute w-2 h-2 sm:w-3 sm:h-3 lg:w-3 lg:h-3 bg-white border-2 border-[#2925f3] rounded-full transition-all duration-500 ${isVisible
          ? 'scale-100 opacity-100 shadow-[0_0_10px_rgba(41,37,243,0.5)]'
          : 'scale-0 opacity-0'
        }`}
      style={{
        top: `${index * 25 + 12.5}%`,
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    />
  )
}

interface BenefitCardProps {
  benefit: {
    id: number
    title: string
    description: string
    isActive: boolean
  }
  index: number
}

const BenefitCard: React.FC<BenefitCardProps> = ({ benefit, index }) => {
  const { ref, isVisible } = useScrollReveal({ delay: index * 150 + 300 })

  return (
    <div
      ref={ref}
      className={`flex flex-col gap-1 sm:gap-2 lg:gap-2 p-3 sm:p-4 lg:p-5 rounded-lg sm:rounded-xl transition-all duration-500 cursor-pointer group ${benefit.isActive
          ? 'bg-[#edebfaa6] shadow-md'
          : 'border border-gray-200 hover:bg-[#edebfaa6] hover:border-[#2925f3] hover:shadow-lg'
        } ${getAnimationClasses(isVisible, 'fadeInRight', 'duration-500')}`}
    >
      <h3 className="font-bold text-[#191A15] text-base sm:text-lg lg:text-xl leading-tight group-hover:text-[#2925f3] transition-colors duration-300">
        {benefit.title}
      </h3>
      <p className="text-[#696983] text-xs sm:text-sm lg:text-base leading-relaxed">
        {benefit.description}
      </p>
    </div>
  )
}