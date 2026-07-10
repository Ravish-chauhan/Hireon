import React from 'react'
import { Brain, Heart, Target, Shield } from 'lucide-react'
import { useScrollReveal, getAnimationClasses } from '../../hooks/useScrollReveal'

export function PhilosophySection() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal({ delay: 0 })
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollReveal({ delay: 200 })
  const { ref: trustRef, isVisible: trustVisible } = useScrollReveal({ delay: 400 })

  const differentiators = [
    {
      icon: <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />,
      title: 'Human-Centric Approach',
      description: 'Seasoned experts who deeply understand student needs and provide empathetic guidance.',
      gradient: 'from-[#e64f26] to-[#e63939]',
    },
    {
      icon: <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white" />,
      title: 'AI-Enhanced Accuracy',
      description: 'Intelligent algorithms that evaluate profiles, match programs, and forecast opportunities.',
      gradient: 'from-blue-500 to-purple-600',
    },
    {
      icon: <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white" />,
      title: 'End-to-End Support',
      description: 'From the first call to acceptance, our workflow is structured, transparent, and lightning-fast.',
      gradient: 'from-green-500 to-teal-600',
    },
    {
      icon: <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />,
      title: 'Zero-Scam Assurance',
      description: 'No false promises, no shady agents, no chaos. Just clean, ethical guidance powered by truth and tech.',
      gradient: 'from-orange-500 to-red-600',
    },
  ]

  return (
    <section className="py-12 sm:py-24 relative overflow-hidden">
      {/* Parallax Background Image */}
      <div
        className="absolute inset-0 bg-fixed bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)'
        }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Animated Background Glow Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-48 h-48 sm:w-96 sm:h-96 bg-[#e64f26]/15 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-96 sm:h-96 bg-[#e63939]/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Philosophy Section */}
        <div
          ref={headerRef}
          className={`text-center mb-8 sm:mb-16 ${getAnimationClasses(headerVisible, 'fadeInUp')}`}
        >
          <span className="inline-block px-3 py-1 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm text-[#FF9A35] rounded-full text-xs sm:text-sm font-bold mb-4 sm:mb-6 border border-white/20">
            OUR PHILOSOPHY
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-8 leading-tight text-white">
            Admissions Shouldn't Feel Like{' '}
            <span className="bg-gradient-to-r from-[#FF9A35] via-[#e64f26] to-[#e63939] text-transparent bg-clip-text">
              Guesswork
            </span>
          </h2>
          <p className="text-sm sm:text-xl text-white/80 max-w-4xl mx-auto leading-relaxed px-4">
            With EduNiaa, students get the perfect balance of human understanding and AI-driven precision,
            making every decision smarter, faster, and stress-free.
          </p>
        </div>

        {/* What Makes Us Different */}
        <div className="mb-12 sm:mb-20">
          <h3 className="text-xl sm:text-3xl font-bold text-center text-white mb-6 sm:mb-12">
            What Makes Us Different
          </h3>

          <div
            ref={cardsRef}
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 ${getAnimationClasses(cardsVisible, 'fadeInUp')}`}
          >
            {differentiators.map((item, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${item.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {item.icon}
                </div>
                <h4 className="text-sm sm:text-xl font-bold text-gray-900 mb-2 sm:mb-4 text-center">{item.title}</h4>
                <p className="text-gray-600 text-center leading-relaxed text-xs sm:text-base">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Students Trust EduNiaa */}
        <div
          ref={trustRef}
          className={`bg-gradient-to-r from-[#e64f26] to-[#e63939] rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-center text-white relative overflow-hidden ${getAnimationClasses(trustVisible, 'fadeInUp')}`}
        >
          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 bg-black/10 rounded-2xl sm:rounded-3xl" />

          {/* Glow effects */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-[80px]" />

          <div className="relative z-10">
            <h3 className="text-xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Why Students Trust EduNiaa
            </h3>
            <div className="mb-6 sm:mb-8">
              <p className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4">Because we don't "counsel."</p>
              <p className="text-sm sm:text-xl leading-relaxed max-w-4xl mx-auto">
                We strategize, personalize, and deliver results using a hybrid model the industry has never seen before.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-4xl mx-auto border border-white/20 hover:bg-white/15 transition-colors duration-300">
              <p className="text-sm sm:text-lg leading-relaxed">
                EduNiaa isn't just another platform; it's the evolution of admission mentorship.
                A future where every student feels guided, supported, and empowered — not misled.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PhilosophySection