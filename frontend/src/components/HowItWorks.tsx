import React, { useContext } from 'react'
import { FileCheck, ListPlus, Sparkles, Download, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useScrollReveal, getAnimationClasses } from '../hooks/useScrollReveal'

const steps = [
  {
    icon: <FileCheck className="h-8 w-8" />,
    number: '01',
    title: 'Choose Your Template',
    description: 'Browse 50+ professionally designed, ATS-friendly templates perfect for jobs, internships & top university applications.',
    color: 'from-green-400 to-emerald-600',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    icon: <ListPlus className="h-8 w-8" />,
    number: '02',
    title: 'Add Your Details',
    description: 'Fill in your experience, skills, education, research & extracurriculars with AI-powered suggestions for impactful bullet points.',
    color: 'from-blue-400 to-indigo-600',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: <Sparkles className="h-8 w-8" />,
    number: '03',
    title: 'Polish with AI',
    description: 'Let our AI enhance your content with action verbs, quantifiable achievements, and keywords for recruiters & admissions committees.',
    color: 'from-orange-400 to-amber-600',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
  {
    icon: <Download className="h-8 w-8" />,
    number: '04',
    title: 'Download & Apply',
    description: 'Export your polished resume in PDF, Word, or other formats and start landing interviews & acceptance letters!',
    color: 'from-purple-400 to-violet-600',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
]

const HowItWorks: React.FC = () => {
  const navigate = useNavigate()
  const auth = useContext(AuthContext)
  const isAuthenticated = auth?.isAuthenticated
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal({ delay: 0 })
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollReveal({ delay: 400 })

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-white via-gray-50/50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center mb-16 ${getAnimationClasses(headerVisible, 'fadeInUp')}`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0F0C89] mb-6">
            <span className="text-white font-medium text-sm">How It Works</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Create Your Perfect Resume in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-[#0F0C89]">
              4 Simple Steps
            </span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            Our AI-powered builder guides you through each step, making resume creation
            fast, easy, and effective.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
          {steps.map((step, index) => (
            <StepCard key={index} step={step} index={index} />
          ))}
        </div>

        {/* CTA */}
        <div
          ref={ctaRef}
          className={`text-center ${getAnimationClasses(ctaVisible, 'fadeInUp')}`}
        >
          <button
            onClick={() => isAuthenticated ? navigate('/resume-collection') : navigate('/login')}
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-xl bg-gradient-to-r from-[#0F0C89] to-[#0066FF] text-white font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg shadow-blue-500/25"
          >
            Start Building Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  )
}

interface StepCardProps {
  step: typeof steps[0]
  index: number
}

const StepCard: React.FC<StepCardProps> = ({ step, index }) => {
  const { ref, isVisible } = useScrollReveal({ delay: index * 100 })

  return (
    <div
      ref={ref}
      className={`group relative ${getAnimationClasses(isVisible, 'fadeInUp', 'duration-700')}`}
    >
      <div className="relative h-full bg-white rounded-3xl p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden z-10">
        {/* Gradient Border Effect */}
        <div className={`absolute inset-0 p-[2px] rounded-3xl bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
        <div className="absolute inset-[2px] bg-white rounded-[22px] -z-10" />

        {/* Background Gradient on Hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none`} />

        {/* Step Number Watermark */}
        <div className="absolute -top-4 -right-4 text-8xl font-black text-gray-50/80 group-hover:text-gray-100/50 transition-colors duration-500 select-none pointer-events-none z-0">
          {step.number}
        </div>

        <div className="relative z-10">
          {/* Icon */}
          <div className={`w-16 h-16 ${step.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm group-hover:shadow-md`}>
            <div className={step.iconColor}>
              {step.icon}
            </div>
          </div>

          {/* Content */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#0066FF] transition-colors duration-300">
            {step.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {step.description}
          </p>


        </div>

        {/* Connecting Arrow (except last) - Desktop Only */}
        {index < 3 && (
          <div className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2 z-20">
            <div className="w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-300">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HowItWorks
