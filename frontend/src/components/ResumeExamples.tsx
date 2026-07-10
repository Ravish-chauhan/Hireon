import React, { useRef, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { resumeTemplates } from './resume/templates'
import sampleData from '../data/sampleResumeData.json'
import { TemplateResumeData } from '@/types/resume'
import { useScrollReveal, getAnimationClasses } from '../hooks/useScrollReveal'
import { ArrowRight, ChevronLeft, ChevronRight, Eye } from 'lucide-react'

const categories = ['All Templates', 'Professional', 'Creative', 'Modern', 'Technical', 'Simple']

const ResumeExamples: React.FC = () => {
  const navigate = useNavigate()
  const auth = useContext(AuthContext)
  const isAuthenticated = auth?.isAuthenticated
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeCategory, setActiveCategory] = useState('All Templates')
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal({ delay: 0 })
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollReveal({ delay: 200 })

  const handleTemplateClick = (templateId: string) => {
    if (isAuthenticated) {
      navigate(`/resume-form?template=${templateId}`)
    } else {
      navigate('/login')
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-blue-50/30 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center mb-12 ${getAnimationClasses(headerVisible, 'fadeInUp')}`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-200/50 mb-6">
            <Eye className="w-4 h-4 text-purple-600" />
            <span className="text-purple-800 font-medium text-sm">Template Gallery</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              Perfect Template
            </span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Browse our collection of professionally designed templates,
            each crafted to help you make a lasting impression.
          </p>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${activeCategory === category
                  ? 'bg-[#0F0C89] text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-[#0066FF]'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          )}

          {/* Templates Scroll Container */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-2 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {resumeTemplates.map((template, index) => (
              <TemplateCard
                key={template.id}
                template={template}
                index={index}
                onClick={() => handleTemplateClick(template.id)}
                sampleData={sampleData as TemplateResumeData}
              />
            ))}
          </div>
        </div>

        {/* View All CTA */}
        <div
          ref={ctaRef}
          className={`text-center mt-12 ${getAnimationClasses(ctaVisible, 'fadeInUp')}`}
        >
          <button
            onClick={() => isAuthenticated ? navigate('/resume-collection') : navigate('/login')}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white border-2 border-gray-200 hover:border-[#0066FF] text-gray-700 hover:text-[#0066FF] font-semibold text-lg transition-all duration-300 hover:shadow-lg"
          >
            View All Templates
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  )
}

interface TemplateCardProps {
  template: typeof resumeTemplates[0]
  index: number
  onClick: () => void
  sampleData: TemplateResumeData
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, index, onClick, sampleData }) => {
  const { ref, isVisible } = useScrollReveal({ delay: index * 60 })
  const TemplateComponent = template.component

  return (
    <div
      ref={ref}
      className={`flex-shrink-0 w-[280px] snap-center ${getAnimationClasses(isVisible, 'fadeInUp', 'duration-500')}`}
    >
      <div
        onClick={onClick}
        className="group cursor-pointer"
      >
        {/* Template Preview */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg bg-white transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
          <div className="w-full bg-gray-50" style={{ aspectRatio: '8.5/11' }}>
            <div className="w-full h-full overflow-hidden relative">
              <div
                className="absolute top-0 left-0"
                style={{
                  width: '850px',
                  height: '1100px',
                  transform: 'scale(0.329)',
                  transformOrigin: 'top left',
                }}
              >
                <TemplateComponent data={sampleData} />
              </div>
            </div>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0C89]/90 via-[#0F0C89]/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-8">
            <button className="px-6 py-3 bg-white text-[#0F0C89] rounded-xl font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2">
              Use Template
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Template Info */}
        <div className="mt-4 text-center">
          <h3 className="font-semibold text-gray-900 group-hover:text-[#0066FF] transition-colors duration-300">
            {template.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{template.description}</p>
        </div>
      </div>
    </div>
  )
}

export default ResumeExamples
