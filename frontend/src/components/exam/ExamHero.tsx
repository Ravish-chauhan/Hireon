import React from 'react'
import { Search, GraduationCap, BookOpen, Stethoscope, Scale, Briefcase, Globe } from 'lucide-react'
import { useScrollReveal, getAnimationClasses } from '../../hooks/useScrollReveal'
import { useCounterAnimation } from '../../hooks/useCounterAnimation'

interface ExamHeroProps {
    searchTerm: string
    onSearchChange: (value: string) => void
    selectedCategory: string
    onCategoryChange: (category: string) => void
    categories: string[]
    totalExams: number
}

const StatCounter = ({ end, suffix, label }: { end: number; suffix: string; label: string }) => {
    const { ref, displayValue } = useCounterAnimation({ end, suffix })

    return (
        <div ref={ref} className="text-center group hover:-translate-y-1 transition-transform duration-300">
            <div className="text-white font-bold text-3xl sm:text-4xl md:text-5xl leading-none mb-1 group-hover:text-[#FF9A35] transition-colors">
                {displayValue}
            </div>
            <div className="text-white/60 text-xs sm:text-sm font-medium tracking-wide">{label}</div>
        </div>
    )
}

const categoryIcons: Record<string, React.ReactNode> = {
    'Engineering': <GraduationCap className="w-4 h-4" />,
    'Medical': <Stethoscope className="w-4 h-4" />,
    'Management': <Briefcase className="w-4 h-4" />,
    'Law': <Scale className="w-4 h-4" />,
    'Language': <Globe className="w-4 h-4" />,
    'All': <BookOpen className="w-4 h-4" />,
}

const ExamHero: React.FC<ExamHeroProps> = ({
    searchTerm,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    categories,
    totalExams,
}) => {
    const { ref: badgeRef, isVisible: badgeVisible } = useScrollReveal({ delay: 0 })
    const { ref: titleRef, isVisible: titleVisible } = useScrollReveal({ delay: 100 })
    const { ref: descRef, isVisible: descVisible } = useScrollReveal({ delay: 200 })
    const { ref: searchRef, isVisible: searchVisible } = useScrollReveal({ delay: 300 })
    const { ref: categoriesRef, isVisible: categoriesVisible } = useScrollReveal({ delay: 400 })

    return (
        <section className="relative min-h-[70vh] flex items-center overflow-hidden pt-20">
            {/* Fixed Background Image */}
            <div
                className="absolute inset-0 bg-fixed bg-cover bg-center"
                style={{ backgroundImage: `url('/exam.jpg')` }}
            />

            {/* Dark Overlay for readability */}
            <div className="absolute inset-0 bg-black/60" />

            <div className="relative w-full py-12 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Premium Badge */}
                        <div
                            ref={badgeRef}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mb-8 hover:bg-white/10 transition-colors cursor-default ${getAnimationClasses(badgeVisible, 'fadeInDown')}`}
                        >
                            <span className="flex h-2 w-2 rounded-full bg-[#FF9A35] animate-pulse" />
                            <span className="text-white/90 font-medium text-sm tracking-wide">
                                Bharat's Top Competitive Exams
                            </span>
                            <div className="w-px h-3 bg-white/20 mx-1" />
                            <span className="text-[#FF9A35] font-semibold text-sm">{totalExams}+ Exams</span>
                        </div>

                        {/* Title */}
                        <h1
                            ref={titleRef}
                            className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight mb-6 ${getAnimationClasses(titleVisible, 'fadeInUp')}`}
                        >
                            <span className="text-white">Master Your </span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9A35] via-[#FFD700] to-[#FF9A35] animate-gradient bg-[length:200%_auto]">
                                Dream Exam
                            </span>
                        </h1>

                        {/* Description */}
                        <p
                            ref={descRef}
                            className={`text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10 ${getAnimationClasses(descVisible, 'fadeInUp', 'delay-100')}`}
                        >
                            Comprehensive guide to India's top entrance exams. Discover exam patterns,
                            eligibility, preparation strategies, and pathways to your dream career.
                        </p>

                        {/* Search Bar */}
                        <div
                            ref={searchRef}
                            className={`max-w-2xl mx-auto mb-8 ${getAnimationClasses(searchVisible, 'fadeInUp', 'delay-200')}`}
                        >
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF9A35] to-[#0066FF] rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
                                <div className="relative flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden">
                                    <div className="pl-5 pr-3">
                                        <Search className="w-5 h-5 text-white/50" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search exams by name, category, or conducting body..."
                                        value={searchTerm}
                                        onChange={(e) => onSearchChange(e.target.value)}
                                        className="w-full px-2 py-4 bg-transparent text-white placeholder-white/50 focus:outline-none text-base"
                                    />
                                    <button className="px-6 py-4 bg-gradient-to-r from-[#FF9A35] to-[#FFB366] text-white font-semibold hover:from-[#FF8C20] hover:to-[#FFA040] transition-all duration-300">
                                        Search
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Category Pills */}
                        <div
                            ref={categoriesRef}
                            className={`flex flex-wrap justify-center gap-3 mb-12 ${getAnimationClasses(categoriesVisible, 'fadeInUp', 'delay-300')}`}
                        >
                            {categories.slice(0, 7).map((category) => (
                                <button
                                    key={category}
                                    onClick={() => onCategoryChange(category)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${selectedCategory === category
                                        ? 'bg-gradient-to-r from-[#FF9A35] to-[#FFB366] text-white shadow-lg shadow-orange-500/25'
                                        : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    {categoryIcons[category] || <BookOpen className="w-4 h-4" />}
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* Stats Bar */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-3xl mx-auto pt-8 border-t border-white/10">
                            <StatCounter end={totalExams} suffix="+" label="Entrance Exams" />
                            <StatCounter end={50} suffix="L+" label="Aspirants Yearly" />
                            <StatCounter end={100} suffix="%" label="Updated Info" />
                            <StatCounter end={24} suffix="/7" label="Expert Support" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Exam Cards */}
            <div className="absolute right-10 top-1/4 hidden lg:block animate-float z-20">
                <div className="bg-white rounded-2xl p-4 shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">JEE</span>
                        </div>
                        <div>
                            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Engineering</div>
                            <div className="text-sm font-bold text-gray-900">JEE Main & Advanced</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute left-10 bottom-1/3 hidden lg:block animate-float z-20" style={{ animationDelay: '1.5s' }}>
                <div className="bg-white rounded-2xl p-4 shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                            <Stethoscope className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Medical</div>
                            <div className="text-sm font-bold text-gray-900">NEET UG / PG</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute right-20 bottom-1/4 hidden xl:block animate-float z-20" style={{ animationDelay: '3s' }}>
                <div className="bg-white rounded-2xl p-4 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                            <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Management</div>
                            <div className="text-sm font-bold text-gray-900">CAT / XAT / GMAT</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ExamHero
