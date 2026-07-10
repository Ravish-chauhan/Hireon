import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, BookOpen, Users, Sparkles } from 'lucide-react'
import { useScrollReveal, getAnimationClasses } from '../../hooks/useScrollReveal'

const ExamCTASection: React.FC = () => {
    const navigate = useNavigate()
    const { ref: containerRef, isVisible: containerVisible } = useScrollReveal({ delay: 0 })

    return (
        <section className="relative py-20 md:py-28 overflow-hidden bg-[#0A084B]">
            {/* Deep Rich Gradient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a1494] via-[#0A084B] to-[#050424]" />

            {/* Animated Glow Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse-slow" />
                <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[80px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[#FF9A35]/10 rounded-full blur-[60px]" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                <div
                    ref={containerRef}
                    className={`text-center ${getAnimationClasses(containerVisible, 'fadeInUp')}`}
                >
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF9A35] to-[#FFD700] shadow-lg shadow-orange-500/30 mb-8">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        Need Expert Guidance for{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9A35] via-[#FFD700] to-[#FF9A35]">
                            Your Exam Journey?
                        </span>
                    </h2>

                    {/* Description */}
                    <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        Connect with our expert counselors who have helped thousands of students crack
                        their dream exams. Get personalized strategies and proven preparation roadmaps.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                        <button
                            onClick={() => navigate('/book-consultation')}
                            className="group relative px-8 py-4 rounded-xl bg-white text-[#0F0C89] font-bold text-lg shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                        >
                            <div className="relative flex items-center gap-3 z-10">
                                <Users className="w-5 h-5 text-[#FF9A35]" />
                                <span>Book Free Consultation</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/colleges')}
                            className="group px-8 py-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white font-semibold text-lg hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
                        >
                            <span className="flex items-center gap-3">
                                <BookOpen className="w-5 h-5" />
                                Explore Top Colleges
                            </span>
                        </button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="flex flex-wrap justify-center gap-8 text-white/40 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                            <span>10,000+ Students Guided</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                            <span>Expert Faculty from IITs/IIMs</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                            <span>24/7 Support Available</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ExamCTASection
