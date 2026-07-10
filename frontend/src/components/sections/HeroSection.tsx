import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useScrollReveal, getAnimationClasses } from '../../hooks/useScrollReveal'
import { useCounterAnimation } from '../../hooks/useCounterAnimation'

const StatCounter = ({ end, suffix, label }: { end: number; suffix: string; label: string }) => {
  const { ref, displayValue } = useCounterAnimation({ end, suffix })

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="text-[#2925F3] font-bold text-xl sm:text-2xl md:text-3xl leading-none">
        {displayValue}
      </div>
      <div className="text-[rgba(1,5,20,0.8)] text-xs sm:text-sm md:text-lg lg:text-xl leading-relaxed text-center">
        {label}
      </div>
    </div>
  )
}

export const HeroSection = () => {
  const navigate = useNavigate()

  const { ref: badgeRef, isVisible: badgeVisible } = useScrollReveal({ delay: 0 })
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal({ delay: 100 })
  const { ref: descRef, isVisible: descVisible } = useScrollReveal({ delay: 200 })
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollReveal({ delay: 300 })
  const { ref: statsRef, isVisible: statsVisible } = useScrollReveal({ delay: 400 })
  const { ref: imageRef, isVisible: imageVisible } = useScrollReveal({ delay: 200 })

  return (
    <div className="bg-white pt-20 sm:pt-24 md:pt-28 lg:pt-20">
      <div className="mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8 lg:py-12 w-full">
        <div className="flex flex-col md:flex-col-reverse lg:flex-row items-center justify-center gap-8 md:gap-10 lg:gap-12">
          {/* Right Image Section */}
          <div
            ref={imageRef}
            className={`hidden lg:block w-full lg:w-auto flex-shrink-0 max-w-sm md:max-w-md lg:max-w-lg order-1 lg:order-2 ${getAnimationClasses(imageVisible, 'fadeInRight', 'duration-1000')}`}
          >
            <img
              src="/hero.jpg"
              alt="Students achieving academic success"
              className="w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl shadow-2xl object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Left Content Section */}
          <div className="w-full lg:w-auto flex flex-col gap-6 md:gap-8 max-w-4xl px-2 sm:px-0 order-2 lg:order-1">
            {/* Platform Badge */}
            <div
              ref={badgeRef}
              className={`inline-flex items-center gap-0.5 px-3 sm:px-4 py-2 rounded-xl bg-[rgba(237,235,250,0.59)] w-fit mx-auto lg:mx-0 ${getAnimationClasses(badgeVisible, 'fadeInDown', 'duration-500')}`}
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 fill-[#FF9A35] animate-pulse"
                width="20"
                height="19"
                viewBox="0 0 20 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.9861 0L12.3435 6.90983H19.9722L13.8004 11.1803L16.1578 18.0902L9.9861 13.8197L3.81435 18.0902L6.17175 11.1803L5.72205e-06 6.90983H7.6287L9.9861 0Z" />
              </svg>
              <span className="text-[#191A15] text-center font-medium text-sm sm:text-base leading-tight">
                Bharat's #1 Education Platform
              </span>
            </div>

            {/* Main Content */}
            <div className="flex flex-col gap-6 md:gap-8 lg:gap-10 text-center lg:text-left">
              {/* Hero Section */}
              <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
                <h1
                  ref={titleRef}
                  className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight max-w-3xl mx-auto lg:mx-0 ${getAnimationClasses(titleVisible, 'fadeInUp', 'duration-700')}`}
                >
                  <span className="text-[#191A15]">Your Gateway to </span>
                  <span className="text-[#0066FF] relative">
                    Academic Excellence
                    <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-[#0066FF] to-[#FF9A35] rounded-full transform scale-x-0 animate-[scaleX_1s_ease-out_0.5s_forwards] origin-left"></span>
                  </span>
                </h1>
                <p
                  ref={descRef}
                  className={`text-[#191A15] text-base sm:text-lg md:text-xl leading-relaxed text-center lg:text-justify max-w-3xl mx-auto lg:mx-0 ${getAnimationClasses(descVisible, 'fadeInUp', 'duration-700')}`}
                >
                  Join 5,200+ students who secured admissions globally with our AI-powered insights backed by human expertise. From profile building to final admissions, we guide you at every step of your way.
                </p>
              </div>

              {/* CTA Button */}
              <button
                ref={ctaRef}
                className={`flex items-center justify-center gap-3 sm:gap-5 w-fit px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-[#0F0C89] hover:bg-[#0D0A70] hover:scale-105 hover:shadow-xl transition-all duration-300 mx-auto lg:mx-0 group ${getAnimationClasses(ctaVisible, 'fadeInUp', 'duration-500')}`}
                onClick={() => navigate('/assessment')}
              >
                <svg
                  className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_1_157)">
                    <path
                      d="M13.25 2.75H15.75C16.1478 2.75 16.5294 2.90804 16.8107 3.18934C17.092 3.47064 17.25 3.85218 17.25 4.25M13.05 19.14L9.33 19.67L9.86 16L19.41 6.46C19.8365 6.06256 20.4007 5.84619 20.9836 5.85647C21.5665 5.86676 22.1226 6.1029 22.5349 6.51513C22.9471 6.92737 23.1832 7.48353 23.1935 8.06643C23.2038 8.64934 22.9874 9.21348 22.59 9.64L13.05 19.14ZM5.5 0.75H12.5C12.5 0.75 13.25 0.75 13.25 1.5V4C13.25 4 13.25 4.75 12.5 4.75H5.5C5.5 4.75 4.75 4.75 4.75 4V1.5C4.75 1.5 4.75 0.75 5.5 0.75Z"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17.25 18.75V21.75C17.25 22.1478 17.092 22.5294 16.8107 22.8107C16.5294 23.092 16.1478 23.25 15.75 23.25H2.25C1.85218 23.25 1.47064 23.092 1.18934 22.8107C0.908035 22.5294 0.75 22.1478 0.75 21.75V4.25C0.75 3.85218 0.908035 3.47064 1.18934 3.18934C1.47064 2.90804 1.85218 2.75 2.25 2.75H4.75M5.25 8.75H12.25M5.25 13.25H7.75"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1_157">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <span className="text-white text-center text-base sm:text-lg font-medium leading-tight">
                  Take Free Assessment
                </span>
              </button>
            </div>

            {/* Stats Section with Counter Animation */}
            <div
              ref={statsRef}
              className={`flex flex-col justify-center items-center gap-2.5 px-4 sm:px-5 py-4 sm:py-3 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 max-w-2xl mx-auto lg:mx-0 ${getAnimationClasses(statsVisible, 'fadeInUp', 'duration-700')}`}
            >
              <div className="flex flex-row justify-center items-center gap-3 sm:gap-6 md:gap-8 w-full py-2">
                <StatCounter end={5200} suffix="+" label="Admissions Globally" />
                <StatCounter end={15} suffix="+" label="Years Experience" />
                <StatCounter end={98} suffix="%" label="Success Rate" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}