import React, { useState } from 'react'
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react'
import { useScrollReveal, getAnimationClasses } from '../hooks/useScrollReveal'

const faqData = [
  {
    question: 'Is the resume builder really free to use?',
    answer: 'Yes! You can create, customize, and preview your resume completely free. We offer premium features for advanced customization and additional templates, but our core builder is free forever.',
  },
  {
    question: 'Is this suitable for Ivy League & top university applications?',
    answer: 'Absolutely! Our templates are designed to meet the standards of top universities worldwide including Ivy League schools, Oxbridge, and other elite institutions. Many students have used our builder to successfully gain admission to their dream universities.',
  },
  {
    question: 'Are your templates ATS-friendly and admissions-ready?',
    answer: 'Yes! All our templates are designed with both ATS (Applicant Tracking Systems) and university admissions compatibility in mind. We use clean formatting, standard fonts, and proper structure that works for corporate recruiters and admissions committees alike.',
  },
  {
    question: 'How does the AI content generation work?',
    answer: 'Our AI has been trained on millions of successful resumes and applications across different industries and universities. Simply enter your role or achievement, and it generates relevant, impactful bullet points. You can then customize these suggestions to match your unique experience.',
  },
  {
    question: 'Can I create versions for both jobs and university applications?',
    answer: 'Yes! You can create unlimited versions tailored for different purposes. Whether you\'re applying to jobs, internships, or universities, you can customize each resume to highlight the most relevant experiences and skills.',
  },
  {
    question: 'What file formats can I download my resume in?',
    answer: 'You can download your finished resume in multiple formats including PDF (most recommended for applications), Microsoft Word (.docx), and plain text. PDF ensures your formatting stays perfect across all devices and systems.',
  },
  {
    question: 'Does this work for scholarship applications?',
    answer: 'Absolutely! The same quality and optimization that works for university admissions also applies to scholarship applications. Many students have successfully used our builder for competitive scholarships.',
  },
  {
    question: 'Is it suitable for international students?',
    answer: 'Yes! Our builder is designed for students worldwide. Whether you\'re applying to US, UK, European, or other international universities, our templates and AI suggestions are tailored to meet global standards.',
  },
  {
    question: 'How long does it take to create a resume?',
    answer: 'Most users complete their resume in under 10-15 minutes! With our AI suggestions and pre-built templates, you can have a professional, application-ready resume quickly.',
  },
]

const FAQAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal({ delay: 0 })

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center mb-12 ${getAnimationClasses(headerVisible, 'fadeInUp')}`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200/50 mb-6">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span className="text-blue-800 font-medium text-sm">FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-[#0F0C89]">
              Questions
            </span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            Everything you need to know about our resume builder
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <FAQItem
              key={index}
              item={item}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => toggleAccordion(index)}
            />
          ))}
        </div>

        {/* Help CTA */}
        <div className="mt-12 text-center p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl border border-blue-100/50">
          <Sparkles className="w-8 h-8 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h3>
          <p className="text-gray-600 mb-4">
            Our support team is here to help you create the perfect resume or CV
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0F0C89] text-white font-medium hover:bg-[#0D0A70] transition-all duration-300 hover:scale-105"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  )
}

interface FAQItemProps {
  item: typeof faqData[0]
  index: number
  isOpen: boolean
  onToggle: () => void
}

const FAQItem: React.FC<FAQItemProps> = ({ item, index, isOpen, onToggle }) => {
  const { ref, isVisible } = useScrollReveal({ delay: index * 50 })

  return (
    <div
      ref={ref}
      className={`${getAnimationClasses(isVisible, 'fadeInUp', 'duration-500')}`}
    >
      <div
        className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen
          ? 'border-blue-200 shadow-lg shadow-blue-500/10'
          : 'border-gray-100 hover:border-blue-100 hover:shadow-md'
          }`}
      >
        <button
          onClick={onToggle}
          className="w-full px-6 py-5 text-left flex justify-between items-center gap-4 focus:outline-none"
        >
          <span className={`font-semibold transition-colors duration-300 ${isOpen ? 'text-[#0066FF]' : 'text-gray-900'}`}>
            {item.question}
          </span>
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-blue-100 rotate-180' : 'bg-gray-100'
              }`}
          >
            <ChevronDown className={`w-5 h-5 transition-colors duration-300 ${isOpen ? 'text-blue-600' : 'text-gray-500'}`} />
          </div>
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="px-6 pb-5 text-gray-600 leading-relaxed">
            {item.answer}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQAccordion
