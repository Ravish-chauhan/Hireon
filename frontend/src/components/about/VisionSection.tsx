import React from 'react'
import { RocketIcon } from 'lucide-react'
import { useScrollReveal, getAnimationClasses } from '../../hooks/useScrollReveal'

export function VisionSection() {
  const { ref: badgeRef, isVisible: badgeVisible } = useScrollReveal({ delay: 0 })
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal({ delay: 100 })
  const { ref: contentRef, isVisible: contentVisible } = useScrollReveal({ delay: 200 })
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollReveal({ delay: 300 })
  const { ref: imageRef, isVisible: imageVisible } = useScrollReveal({ delay: 150 })

  const values = [
    {
      color: 'bg-[#e64f26]',
      title: 'Intellect',
      description: 'Smart decisions backed by data and expertise'
    },
    {
      color: 'bg-[#e63939]',
      title: 'Innovation',
      description: 'Cutting-edge AI meets human wisdom'
    },
    {
      color: 'bg-[#e64f26]',
      title: 'Integrity',
      description: 'Transparent, ethical guidance always'
    }
  ]

  return (
    <section className="py-12 sm:py-24 relative overflow-hidden bg-white">
      {/* Background with geometric shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#e64f26]/5 to-[#e63939]/5" />
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="vision-pattern"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="50" cy="50" r="2" fill="#e64f26" />
              <circle cx="0" cy="0" r="2" fill="#e63939" />
              <circle cx="100" cy="100" r="2" fill="#e64f26" />
            </pattern>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#vision-pattern)"
          />
        </svg>
      </div>

      {/* Subtle glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#e64f26]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#e63939]/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-12 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <div
              ref={badgeRef}
              className={getAnimationClasses(badgeVisible, 'fadeInDown')}
            >
              <span className="inline-block px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-[#e64f26]/10 to-[#e63939]/10 text-[#e64f26] rounded-full text-xs sm:text-sm font-bold mb-4 sm:mb-6 border border-[#e64f26]/20">
                OUR VISION
              </span>
            </div>

            <h2
              ref={titleRef}
              className={`text-2xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-8 leading-tight ${getAnimationClasses(titleVisible, 'fadeInUp')}`}
            >
              Making Bharat a{' '}
              <span className="bg-gradient-to-r from-[#e64f26] to-[#e63939] text-transparent bg-clip-text">
                Global Education Magnet
              </span>
            </h2>

            <div
              ref={contentRef}
              className={`space-y-4 sm:space-y-6 ${getAnimationClasses(contentVisible, 'fadeInUp', 'delay-100')}`}
            >
              <p className="text-sm sm:text-xl text-gray-700 leading-relaxed">
                To make Bharat a global magnet for education while empowering
                its youth to thrive anywhere in the world with intellect,
                innovation, and integrity.
              </p>

              <div className="bg-gradient-to-r from-[#e64f26]/10 to-[#e63939]/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-l-3 sm:border-l-4 border-[#e64f26]">
                <p className="text-sm sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                  EduNiaa isn't just a consultancy — it's a movement redefining
                  how admissions should truly work.
                </p>
                <p className="text-xs sm:text-base text-gray-700 italic">
                  "The evolution of admission mentorship — where every student feels guided,
                  supported, and empowered, not misled."
                </p>
              </div>

              <div
                ref={cardsRef}
                className={`grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-2 sm:pt-4 ${getAnimationClasses(cardsVisible, 'fadeInUp', 'delay-200')}`}
              >
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                      <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${value.color} group-hover:scale-125 transition-transform duration-300`} />
                      <span className="text-gray-900 font-bold text-xs sm:text-base">{value.title}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div
            ref={imageRef}
            className={`relative order-1 lg:order-2 ${getAnimationClasses(imageVisible, 'fadeInRight', 'duration-700')}`}
          >
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="Students collaborating"
                className="w-full h-auto group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
                <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
                  <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <RocketIcon className="text-white" size={20} />
                  </div>
                  <div className="text-white">
                    <div className="text-xl sm:text-3xl font-black">16+ Years</div>
                    <div className="text-xs sm:text-sm">of Excellence</div>
                  </div>
                </div>
                <p className="text-white/90 text-sm sm:text-lg">
                  Empowering the next generation of global leaders
                </p>
              </div>
            </div>

            {/* Floating Element with smooth animation */}
            <div className="absolute -top-3 -right-3 sm:-top-6 sm:-right-6 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-[#e64f26] to-[#e63939] rounded-2xl sm:rounded-3xl shadow-xl flex items-center justify-center text-white animate-float">
              <div className="text-center">
                <div className="text-lg sm:text-3xl font-black">5.2k+</div>
                <div className="text-xs">Students</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VisionSection