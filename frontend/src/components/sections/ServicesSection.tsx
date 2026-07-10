import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaBook,
  FaGraduationCap,
  FaClipboardList,
  FaGlobe,
  FaAward,
  FaBrain,
  FaArrowRight,
} from 'react-icons/fa'
import { useScrollReveal, getAnimationClasses } from '../../hooks/useScrollReveal'

export const ServicesSection = () => {
  const navigate = useNavigate()

  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal({ delay: 0 })

  const services = [
    {
      title: 'Career Counseling',
      description:
        'Personalized guidance to help you discover the right career path based on your interests, aptitude, and goals.',
      icon: <FaBrain size={24} />,
      href: '/book-consultation',
    },
    {
      title: 'University Admissions',
      description:
        'Comprehensive support throughout the college application process, from selection to acceptance.',
      icon: <FaGraduationCap size={24} />,
      href: '/book-consultation',
    },
    {
      title: 'Entrance Exam Preparation',
      description:
        'Strategic preparation plans and resources for competitive exams like JEE, NEET, CLAT, CAT, and more.',
      icon: <FaClipboardList size={24} />,
      href: '/exams',
    },
    {
      title: 'Study Abroad Programs',
      description:
        'Expert guidance on international education opportunities, visa processes, and scholarship options.',
      icon: <FaGlobe size={24} />,
      href: '/colleges',
    },
    {
      title: 'Scholarship Guidance',
      description:
        'Assistance in identifying and applying for scholarships to make education more affordable.',
      icon: <FaAward size={24} />,
      href: '/book-consultation',
    },
    {
      title: 'Skill Development',
      description:
        'Courses and workshops to develop essential skills that complement academic qualifications.',
      icon: <FaBook size={24} />,
      href: '/exams',
    },
  ]

  return (
    <section
      id="services"
      className="bg-white py-12 md:py-16 lg:py-20"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-12 md:gap-16">
          <header
            ref={headerRef}
            className={`flex flex-col items-center justify-center gap-6 text-center max-w-4xl ${getAnimationClasses(headerVisible, 'fadeInUp')}`}
          >
            <div className="inline-flex items-center gap-0.5 px-4 py-2 rounded-xl bg-[#2925f3]">
              <span className="text-white text-center font-medium text-sm sm:text-base leading-tight">
                Our Services
              </span>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 md:gap-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#191A15] text-center leading-tight">
                What We Do
              </h1>

              <p className="text-[#191A15] text-base sm:text-lg md:text-xl leading-relaxed text-center max-w-3xl">
                We offer a comprehensive range of educational services to guide
                students at every step of their academic journey.
              </p>
            </div>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                service={service}
                index={index}
                navigate={navigate}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

interface ServiceCardProps {
  service: {
    title: string
    description: string
    icon: React.ReactElement
    href: string
  }
  index: number
  navigate: ReturnType<typeof useNavigate>
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index, navigate }) => {
  const { ref, isVisible } = useScrollReveal({ delay: index * 100 })

  return (
    <article
      ref={ref}
      className={`flex flex-col items-center gap-4 sm:gap-6 px-4 sm:px-5 py-6 sm:py-8 bg-white rounded-[40px] sm:rounded-[60px] shadow-[0px_50px_100px_#edebfa] relative hover:scale-105 hover:shadow-2xl transition-all duration-500 max-w-sm mx-auto group cursor-pointer ${getAnimationClasses(isVisible, 'fadeInUp', 'duration-700')}`}
      onClick={() => navigate(service.href)}
    >
      <div
        className="absolute top-4 sm:top-5 left-[calc(50%-25px)] sm:left-[calc(50%-30px)] w-[50px] sm:w-[60px] h-[50px] sm:h-[60px] bg-[#313ef70d] rounded-[25px] sm:rounded-[30px] group-hover:scale-110 group-hover:bg-[#313ef71a] transition-all duration-300"
        aria-hidden="true"
      />

      <div className="relative w-6 sm:w-8 h-6 sm:h-8 text-[#2925f3] z-10 group-hover:scale-110 transition-transform duration-300">
        {React.cloneElement(service.icon, { size: 32 })}
      </div>

      <div className="flex flex-col items-center gap-2 sm:gap-3 text-center">
        <h2 className="font-bold text-[#0066ff] text-lg sm:text-xl leading-tight group-hover:text-[#0F0C89] transition-colors duration-300">
          {service.title}
        </h2>

        <p className="font-normal text-[#696983] text-xs sm:text-sm leading-5">
          {service.description}
        </p>
      </div>

      <button
        className="w-[40px] sm:w-[45px] h-[40px] sm:h-[45px] bg-[#0f0c89] rounded-[20px] sm:rounded-[22px] cursor-pointer transition-all duration-300 hover:scale-110 hover:rotate-12 hover:bg-[#0066ff] focus:outline-none focus:ring-2 focus:ring-[#0066ff] focus:ring-offset-2 flex items-center justify-center group-hover:animate-bounce"
        aria-label={`Learn more about ${service.title}`}
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          navigate(service.href)
        }}
      >
        <FaArrowRight className="text-white text-sm sm:text-base" />
      </button>
    </article>
  )
}