import React from 'react'
import { useScrollReveal, getAnimationClasses } from '../hooks/useScrollReveal'
import {
  Palette,
  Shield,
  Sparkles,
  HeadphonesIcon,
  FileText,
  Infinity,
  ArrowRight
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const features = [
  {
    icon: <Palette className="w-7 h-7" />,
    title: 'Professional Designs',
    description: 'Choose from 50+ modern templates crafted by professional designers for jobs, internships & university applications.',
    gradient: 'from-pink-500 to-rose-600',
    bgGradient: 'from-pink-50 to-rose-50',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
  },
  {
    icon: <Shield className="w-7 h-7" />,
    title: 'ATS & Admissions Optimized',
    description: 'Every template passes applicant tracking systems and meets the standards of top university admissions offices worldwide.',
    gradient: 'from-emerald-500 to-teal-600',
    bgGradient: 'from-emerald-50 to-teal-50',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    icon: <Sparkles className="w-7 h-7" />,
    title: 'AI-Powered Content',
    description: 'Get intelligent suggestions for bullet points, skills, and summaries tailored to your target role or university.',
    gradient: 'from-orange-500 to-amber-600',
    bgGradient: 'from-orange-50 to-amber-50',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
  {
    icon: <HeadphonesIcon className="w-7 h-7" />,
    title: 'Expert Guidance',
    description: 'Access step-by-step guidance and tips from career & admissions experts throughout your resume building journey.',
    gradient: 'from-purple-500 to-violet-600',
    bgGradient: 'from-purple-50 to-violet-50',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    icon: <FileText className="w-7 h-7" />,
    title: 'Cover Letters & Essays',
    description: 'Create matching cover letters and personal statements with the same professional design for a cohesive application.',
    gradient: 'from-blue-500 to-indigo-600',
    bgGradient: 'from-blue-50 to-indigo-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    icon: <Infinity className="w-7 h-7" />,
    title: 'Unlimited Versions',
    description: 'Create as many versions as you need. Experiment with templates and tailor for each job or university application.',
    gradient: 'from-cyan-500 to-sky-600',
    bgGradient: 'from-cyan-50 to-sky-50',
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-600',
  },
]

const WhyChooseUs: React.FC = () => {
  const navigate = useNavigate()
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal({ delay: 0 })
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollReveal({ delay: 300 })

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center mb-16 ${getAnimationClasses(headerVisible, 'fadeInUp')}`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0F0C89] mb-6">
            <span className="text-white font-medium text-sm">Why Choose Us</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-[#0F0C89]">
              Land Your Dream Opportunity
            </span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
            Our resume builder combines beautiful design, smart AI, and proven strategies
            to help you stand out for jobs, internships, and university admissions.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>

        {/* CTA */}
        <div
          ref={ctaRef}
          className={`text-center ${getAnimationClasses(ctaVisible, 'fadeInUp')}`}
        >
          <button
            onClick={() => navigate('/resume-collection')}
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-xl bg-gradient-to-r from-[#0F0C89] to-[#0066FF] text-white font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg shadow-blue-500/25"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          <p className="mt-4 text-gray-500 text-sm">No credit card required</p>
        </div>
      </div>
    </section>
  )
}

interface FeatureCardProps {
  feature: typeof features[0]
  index: number
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, index }) => {
  const { ref, isVisible } = useScrollReveal({ delay: index * 80 })

  return (
    <div
      ref={ref}
      className={`group relative ${getAnimationClasses(isVisible, 'fadeInUp', 'duration-700')}`}
    >
      <div className={`relative bg-gradient-to-br ${feature.bgGradient} rounded-3xl p-8 border border-gray-100/50 overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1`}>
        {/* Background decoration */}
        <div className={`absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-to-br ${feature.gradient} rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />

        {/* Icon */}
        <div className={`relative w-14 h-14 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
          <div className={feature.iconColor}>
            {feature.icon}
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          {feature.title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {feature.description}
        </p>

        {/* Hover Arrow */}
        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
            <ArrowRight className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default WhyChooseUs
