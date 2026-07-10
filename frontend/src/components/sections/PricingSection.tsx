import React, { useEffect, useRef, useState } from 'react'
import { FaCheck, FaArrowRight, FaStar } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

interface PricingTier {
  name: string
  price: string
  subtitle?: string
  features: string[]
  isPopular?: boolean
  buttonText: string
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Ignition Plan',
    price: '₹4,999',
    features: [
      'Profile Analysis',
      'College Shortlist (3–5 colleges) - AI Powered',
      'One Expert Session',
      'Entrance Exam & Timeline Roadmap',
      '2 Mock tests personalised',
      '1 free assessment talk',
    ],
    buttonText: 'Get Started',
  },
  {
    name: 'Momentum Plan',
    price: '₹24,999',
    subtitle: 'Student & Parent Friendly',
    isPopular: true,
    features: [
      'Includes IGNITION',
      'Full Shortlist (10–15 colleges)',
      'SOP / LOR / CV (if required)',
      'Scholarship Eligibility Check',
      'Expert – Parents calls',
      'Priority Support',
      '5 Mock tests personalised',
      'Profile score improvement',
    ],
    buttonText: 'Choose Momentum',
  },
  {
    name: 'Victory Plan',
    price: '₹49,999',
    subtitle: 'Prime',
    features: [
      'Everything in Momentum',
      'Unlimited Shortlist',
      'End-to-end application Exec',
      'SOP / LOR / CV drafting + revision',
      'Scholarship app. help',
      'Unlimited Calls',
      'Senior Strategist',
      '24–48 hr turnaround',
      'Parents priority line',
      'Backup & Reapplication Plan',
      'Monthly personalised AI progress report',
      'On-target Achievers Mock test',
    ],
    buttonText: 'Go Victory',
  },
]

export const PricingSection = () => {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="bg-gradient-to-b from-white to-[#f8f7ff] py-12 md:py-16 lg:py-20"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-12 md:gap-16">
          {/* Header */}
          <header className="flex flex-col items-center justify-center gap-6 text-center max-w-4xl">
            <div className="inline-flex items-center gap-0.5 px-4 py-2 rounded-xl bg-[#2925f3]">
              <span className="text-white text-center font-medium text-sm sm:text-base leading-tight">
                Pricing Plans
              </span>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 md:gap-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#191A15] text-center leading-tight">
                Choose Your Success Path
              </h1>

              <p className="text-[#191A15] text-base sm:text-lg md:text-xl leading-relaxed text-center max-w-3xl">
                Invest in your future with our tailored plans designed to maximize your educational journey.
              </p>
            </div>
          </header>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full max-w-6xl">
            {pricingTiers.map((tier, index) => (
              <div
                key={tier.name}
                className={`
                  group relative flex flex-col rounded-3xl p-6 sm:p-8 transition-all duration-500 ease-out cursor-pointer
                  ${tier.isPopular
                    ? 'bg-[#2925f3] text-white shadow-[0_20px_60px_-15px_rgba(41,37,243,0.4)] scale-[1.02] lg:scale-105'
                    : 'bg-white text-[#191A15] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] hover:bg-[#2925f3] hover:text-white hover:shadow-[0_20px_60px_-15px_rgba(41,37,243,0.4)] hover:scale-105'
                  }
                  hover:-translate-y-2
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                `}
                style={{
                  transitionDelay: isVisible ? `${index * 150}ms` : '0ms',
                }}
              >
                {/* Popular Badge */}
                {tier.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-2 bg-[#FF9D42] text-white font-semibold text-sm rounded-full shadow-lg">
                    <FaStar className="w-3.5 h-3.5" />
                    Most Popular
                  </div>
                )}

                {/* Plan Name & Subtitle */}
                <div className="mb-4">
                  <h3 className={`text-xl sm:text-2xl font-bold transition-colors duration-500 ${tier.isPopular ? 'text-white' : 'text-[#191A15] group-hover:text-white'}`}>
                    {tier.name}
                  </h3>
                  {tier.subtitle && (
                    <p className={`text-sm mt-1 transition-colors duration-500 ${tier.isPopular ? 'text-white/80' : 'text-[#696983] group-hover:text-white/80'}`}>
                      {tier.subtitle}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span className={`text-3xl sm:text-4xl font-bold transition-colors duration-500 ${tier.isPopular ? 'text-white' : 'text-[#2925f3] group-hover:text-white'}`}>
                    {tier.price}
                  </span>
                </div>

                {/* Features List */}
                <ul className="flex-1 space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-start gap-3"
                    >
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 transition-colors duration-500 ${tier.isPopular ? 'bg-white/20' : 'bg-[#2925f3]/10 group-hover:bg-white/20'
                        }`}>
                        <FaCheck className={`w-2.5 h-2.5 transition-colors duration-500 ${tier.isPopular ? 'text-white' : 'text-[#2925f3] group-hover:text-white'}`} />
                      </div>
                      <span className={`text-sm sm:text-base leading-relaxed transition-colors duration-500 ${tier.isPopular ? 'text-white/90' : 'text-[#696983] group-hover:text-white/90'
                        }`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => navigate('/book-consultation')}
                  className={`
                    w-full py-3 sm:py-4 px-6 rounded-xl font-semibold text-base sm:text-lg
                    flex items-center justify-center gap-2 transition-all duration-300
                    ${tier.isPopular
                      ? 'bg-white text-[#2925f3] hover:bg-gray-100 hover:shadow-lg'
                      : 'bg-[#2925f3] text-white group-hover:bg-white group-hover:text-[#2925f3] hover:shadow-lg hover:shadow-[#2925f3]/30'
                    }
                  `}
                >
                  {tier.buttonText}
                  <FaArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
