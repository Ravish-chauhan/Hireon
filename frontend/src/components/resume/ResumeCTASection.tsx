import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { useScrollReveal, getAnimationClasses } from '../../hooks/useScrollReveal'
import { ArrowRight, Sparkles, Shield, Clock, Download } from 'lucide-react'

const ResumeCTASection: React.FC = () => {
    const navigate = useNavigate()
    const auth = useContext(AuthContext)
    const isAuthenticated = auth?.isAuthenticated
    const { ref, isVisible } = useScrollReveal({ delay: 0 })

    const trustIndicators = [
        { icon: <Shield className="w-5 h-5" />, text: 'ATS & Admissions Ready' },
        { icon: <Clock className="w-5 h-5" />, text: '5-Minute Setup' },
        { icon: <Download className="w-5 h-5" />, text: 'Instant Download' },
        { icon: <Sparkles className="w-5 h-5" />, text: 'AI-Powered' },
    ]

    return (
        <section className="py-16 md:py-24 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0F0C89] via-[#1a1494] to-[#0066FF]" />

            {/* Animated Background Decorations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-white/10 to-transparent rounded-full" />

                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div
                ref={ref}
                className={`relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center ${getAnimationClasses(isVisible, 'fadeInUp')}`}
            >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
                    <Sparkles className="w-4 h-4 text-[#FF9A35]" />
                    <span className="text-white/90 font-medium text-sm">Start Your Journey</span>
                </div>

                {/* Headline */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    Ready to Reach Your{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9A35] to-[#FFD700]">
                        Dream Destination?
                    </span>
                </h2>

                {/* Description */}
                <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                    Join thousands who've landed dream jobs and university acceptances with our
                    AI-powered builder. It's free to start—no credit card required.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                    <button
                        onClick={() => isAuthenticated ? navigate('/resume-collection') : navigate('/login')}
                        className="group inline-flex items-center justify-center gap-3 px-10 py-5 rounded-xl bg-white text-[#0F0C89] font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg"
                    >
                        Create My Resume Free
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                    <button
                        onClick={() => isAuthenticated ? navigate('/resume-upload') : navigate('/login')}
                        className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-xl bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold text-lg transition-all duration-300 hover:bg-white/20 hover:scale-105"
                    >
                        Import Existing Resume
                    </button>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                    {trustIndicators.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 text-white/70"
                        >
                            <div className="text-[#FF9A35]">{item.icon}</div>
                            <span className="text-sm font-medium">{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ResumeCTASection
