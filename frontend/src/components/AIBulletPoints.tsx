import React, { useState, useEffect } from 'react'
import { Wand2, RefreshCw, Copy, Sparkles, Check, Zap, Brain, Target } from 'lucide-react'
import { useScrollReveal, getAnimationClasses } from '../hooks/useScrollReveal'

const sampleBulletPoints = [
  'Developed and deployed scalable web applications serving 10,000+ daily active users',
  'Led cross-functional team of 5 engineers, delivering projects 20% ahead of schedule',
  'Conducted independent research on machine learning algorithms, presenting findings at 2 national science fairs',
  'Founded Environmental Club with 45+ members, organizing campus-wide sustainability initiatives',
  'Achieved 99th percentile SAT; selected as National Merit Scholar finalist',
]

const AIBulletPoints: React.FC = () => {
  const [currentBullet, setCurrentBullet] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [copied, setCopied] = useState<number | null>(null)

  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal({ delay: 0 })
  const { ref: leftRef, isVisible: leftVisible } = useScrollReveal({ delay: 100 })
  const { ref: rightRef, isVisible: rightVisible } = useScrollReveal({ delay: 200 })

  // Typewriter effect
  useEffect(() => {
    if (!isTyping) return

    const text = sampleBulletPoints[currentBullet]
    let index = 0

    const typeInterval = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index))
        index++
      } else {
        setIsTyping(false)
        clearInterval(typeInterval)
      }
    }, 30)

    return () => clearInterval(typeInterval)
  }, [currentBullet, isTyping])

  const handleRegenerate = () => {
    setCurrentBullet((prev) => (prev + 1) % sampleBulletPoints.length)
    setDisplayText('')
    setIsTyping(true)
  }

  const handleCopy = (index: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(index)
    setTimeout(() => setCopied(null), 2000)
  }

  const features = [
    { icon: <Brain className="w-5 h-5" />, title: 'Context-Aware', desc: 'Understands your goals' },
    { icon: <Target className="w-5 h-5" />, title: 'Dual Optimized', desc: 'For jobs & admissions' },
    { icon: <Zap className="w-5 h-5" />, title: 'Instant Results', desc: 'Generate in seconds' },
  ]

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center mb-16 ${getAnimationClasses(headerVisible, 'fadeInUp')}`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200/50 mb-6">
            <Sparkles className="w-4 h-4 text-orange-600 animate-pulse" />
            <span className="text-orange-800 font-medium text-sm">AI-Powered</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Let AI Write Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600">
              Bullet Points
            </span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            Simply enter your role or achievements and our AI generates impactful, achievement-focused
            bullet points for jobs, internships, or university applications.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Interactive Demo */}
          <div
            ref={leftRef}
            className={`${getAnimationClasses(leftVisible, 'fadeInLeft', 'duration-700')}`}
          >
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Header Bar */}
              <div className="bg-gradient-to-r from-[#0F0C89] to-[#0066FF] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wand2 className="w-5 h-5 text-white" />
                  <span className="text-white font-semibold">AI Content Generator</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/30" />
                  <div className="w-3 h-3 rounded-full bg-white/30" />
                  <div className="w-3 h-3 rounded-full bg-white/30" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role / Achievement
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      defaultValue="Software Developer"
                      className="w-full p-4 pr-36 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-gray-50"
                    />
                    <button
                      onClick={handleRegenerate}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-all duration-300 hover:scale-105"
                    >
                      <RefreshCw className={`w-4 h-4 ${isTyping ? 'animate-spin' : ''}`} />
                      Generate
                    </button>
                  </div>
                </div>

                {/* Typing Result */}
                <div className="mb-6">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl min-h-[80px] flex items-center">
                    <Sparkles className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                    <p className="text-gray-800">
                      {displayText}
                      {isTyping && <span className="inline-block w-0.5 h-5 bg-blue-500 ml-1 animate-pulse" />}
                    </p>
                  </div>
                </div>

                {/* Sample Bullet Points */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-500">More suggestions:</p>
                  {sampleBulletPoints.slice(1, 4).map((bullet, index) => (
                    <div
                      key={index}
                      className="group p-4 border border-gray-100 rounded-xl bg-white hover:bg-gray-50 flex items-start gap-3 cursor-pointer transition-all duration-300 hover:border-blue-200"
                      onClick={() => handleCopy(index, bullet)}
                    >
                      <button className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-blue-100 transition-colors duration-300">
                        {copied === index ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
                        )}
                      </button>
                      <p className="text-sm text-gray-700 leading-relaxed">{bullet}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right - Features */}
          <div
            ref={rightRef}
            className={`${getAnimationClasses(rightVisible, 'fadeInRight', 'duration-700')}`}
          >
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Write Better, Faster, Smarter
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Our AI has analyzed millions of successful resumes and applications to understand what gets
                  candidates hired and admitted. Now it's your turn to leverage that knowledge.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="group flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-300"
                  >
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-gray-600 text-sm">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-[#0066FF]">3x</div>
                  <div className="text-sm text-gray-600">Faster writing</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#0066FF]">100+</div>
                  <div className="text-sm text-gray-600">Industries covered</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#0066FF]">∞</div>
                  <div className="text-sm text-gray-600">Variations</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AIBulletPoints
