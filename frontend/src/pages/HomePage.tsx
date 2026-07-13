import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { useScrollReveal, getAnimationClasses } from '../hooks/useScrollReveal'
import { useCounterAnimation } from '../hooks/useCounterAnimation'
import { resumeTemplates } from '../components/resume/templates'
import {
  ArrowRight,
  FileText,
  Sparkles,
  Video,
  Users,
  BarChart3,
  Brain,
  TrendingUp,
  CheckCircle2,
  Star,
  Zap,
  Shield,
  MousePointerClick,
  Palette,
  Download,
  ChevronRight,
} from 'lucide-react'

/* ─────────────────────────── Color tokens ─────────────────────────── */
const colors = {
  cream: '#FAFAF7',
  charcoal: '#1A1A2E',
  softBlack: '#2D2D3F',
  coral: '#FF6B5A',
  coralHover: '#E85A4A',
  peach: '#FFB088',
  sage: '#7CB69D',
  lavender: '#E8E0F0',
  warmGray: '#6B7280',
  lightBorder: '#E8E5DF',
}

/* ─────────────────────────── Stat Counter ─────────────────────────── */
const StatCounter = ({ end, suffix, label, prefix = '' }: { end: number; suffix: string; label: string; prefix?: string }) => {
  const { ref, displayValue } = useCounterAnimation({ end, suffix, prefix })
  return (
    <div ref={ref} className="text-center group">
      <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-1 transition-colors" style={{ color: colors.charcoal }}>
        {displayValue}
      </div>
      <div className="text-sm sm:text-base font-medium" style={{ color: colors.warmGray }}>{label}</div>
    </div>
  )
}

/* ─────────────────────────── How It Works Step ─────────────────────────── */
const HowItWorksStep = ({ step, index, totalSteps }: any) => {
  const { ref: stepRef, isVisible: stepVisible } = useScrollReveal({ delay: index * 150 })
  return (
    <div
      ref={stepRef}
      className={`text-center relative ${getAnimationClasses(stepVisible, 'fadeInUp', 'duration-700')}`}
    >
      {/* Connector line */}
      {index < totalSteps - 1 && (
        <div className="hidden md:block absolute top-14 left-[60%] w-[80%] h-px" style={{ background: `linear-gradient(to right, ${colors.lightBorder}, transparent)` }} />
      )}

      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6 relative" style={{ background: colors.coral + '12' }}>
        <div style={{ color: colors.coral }}>{step.icon}</div>
        <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: colors.coral }}>
          {step.step.replace('0', '')}
        </span>
      </div>
      <h3 className="text-xl font-bold mb-3" style={{ color: colors.softBlack }}>{step.title}</h3>
      <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: colors.warmGray }}>{step.description}</p>
    </div>
  )
}

/* ─────────────────────────── Feature Card ─────────────────────────── */
const FeatureCard = ({
  icon,
  title,
  description,
  href,
  comingSoon = false,
  accent,
  index,
}: {
  icon: React.ReactNode
  title: string
  description: string
  href?: string
  comingSoon?: boolean
  accent: string
  index: number
}) => {
  const { ref, isVisible } = useScrollReveal({ delay: index * 80 })
  const inner = (
    <div
      ref={ref}
      className={`relative group bg-white rounded-2xl p-7 border transition-all duration-500 hover:shadow-xl hover:-translate-y-1 cursor-pointer h-full ${getAnimationClasses(isVisible, 'fadeInUp', 'duration-700')}`}
      style={{ borderColor: colors.lightBorder }}
    >
      {comingSoon && (
        <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: colors.lavender, color: '#6B5B8D' }}>
          Coming Soon
        </span>
      )}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
        style={{ background: accent + '18', color: accent }}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2" style={{ color: colors.softBlack }}>{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: colors.warmGray }}>{description}</p>
      {!comingSoon && (
        <div className="mt-4 flex items-center gap-1 text-sm font-semibold transition-colors" style={{ color: accent }}>
          Explore <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      )}
    </div>
  )

  if (comingSoon || !href) return inner
  return <Link to={href} className="block h-full">{inner}</Link>
}

/* ─────────────────────────── Testimonial Card ─────────────────────── */
const TestimonialCard = ({
  name,
  role,
  quote,
  rating,
  index,
}: {
  name: string
  role: string
  quote: string
  rating: number
  index: number
}) => {
  const { ref, isVisible } = useScrollReveal({ delay: index * 120 })
  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl p-7 border flex flex-col h-full ${getAnimationClasses(isVisible, 'fadeInUp', 'duration-700')}`}
      style={{ borderColor: colors.lightBorder }}
    >
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4" fill={i < rating ? '#FBBF24' : '#E5E7EB'} stroke="none" />
        ))}
      </div>
      <p className="text-sm leading-relaxed flex-1 italic mb-5" style={{ color: colors.warmGray }}>
        "{quote}"
      </p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: colors.coral }}>
          {name.charAt(0)}
        </div>
        <div>
          <div className="font-semibold text-sm" style={{ color: colors.softBlack }}>{name}</div>
          <div className="text-xs" style={{ color: colors.warmGray }}>{role}</div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════ MAIN COMPONENT ═══════════════════════════ */
const HomePage: React.FC = () => {
  const navigate = useNavigate()

  // Scroll reveal refs
  const { ref: heroTitleRef, isVisible: heroTitleVisible } = useScrollReveal({ delay: 0 })
  const { ref: heroDescRef, isVisible: heroDescVisible } = useScrollReveal({ delay: 150 })
  const { ref: heroCtaRef, isVisible: heroCtaVisible } = useScrollReveal({ delay: 250 })
  const { ref: statsRef, isVisible: statsVisible } = useScrollReveal({ delay: 100 })
  const { ref: featuresHeadRef, isVisible: featuresHeadVisible } = useScrollReveal({ delay: 0 })
  const { ref: howRef, isVisible: howVisible } = useScrollReveal({ delay: 0 })
  const { ref: templatesRef, isVisible: templatesVisible } = useScrollReveal({ delay: 0 })
  const { ref: testimonialsRef, isVisible: testimonialsVisible } = useScrollReveal({ delay: 0 })
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollReveal({ delay: 0 })

  const features = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'AI Resume Builder',
      description: 'Canva-quality PDF exports with 14+ professional templates. ATS-optimized, razor-sharp text at any zoom level.',
      href: '/resume-builder',
      accent: colors.coral,
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Resume & GitHub Analysis',
      description: 'AI-powered resume scoring, ATS compatibility check, and GitHub profile analysis with actionable improvements.',
      href: '/resume-upload',
      accent: colors.sage,
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: 'AI Interview Practice',
      description: 'Practice with AI interviewers tailored to your role. Get instant feedback on answers, confidence, and delivery.',
      comingSoon: true,
      accent: '#8B5CF6',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Recruiter AI Interviews',
      description: 'Create AI-powered interviews for candidates. Review video responses and get automated skill assessments.',
      comingSoon: true,
      accent: '#3B82F6',
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'Smart Interview Prep',
      description: 'AI generates role-specific questions based on your resume. Practice with realistic scenarios and get scored.',
      comingSoon: true,
      accent: '#EC4899',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Career Insights',
      description: 'Data-driven career path recommendations. Identify skill gaps and get personalized upskilling suggestions.',
      comingSoon: true,
      accent: '#F59E0B',
    },
  ]

  const howItWorks = [
    {
      step: '01',
      icon: <MousePointerClick className="w-7 h-7" />,
      title: 'Choose a Template',
      description: 'Pick from 14+ professionally designed, ATS-friendly resume templates for any industry.',
    },
    {
      step: '02',
      icon: <Palette className="w-7 h-7" />,
      title: 'Customize Everything',
      description: 'Edit content, adjust margins, font sizes, spacing — full control like Canva and Word combined.',
    },
    {
      step: '03',
      icon: <Download className="w-7 h-7" />,
      title: 'Download & Apply',
      description: 'Export as a high-quality vector PDF with embedded fonts. Crisp text at any zoom level.',
    },
  ]

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Software Engineer at Google',
      quote: 'The PDF quality is insane — zoomed to 400% and the text is still razor sharp. Better than Canva honestly. Got 3 interview calls within a week.',
      rating: 5,
    },
    {
      name: 'Arjun Mehta',
      role: 'MBA Student, IIM Bangalore',
      quote: 'Used the resume builder for my summer internship applications. The ATS-friendly templates and AI suggestions made the whole process 10x easier.',
      rating: 5,
    },
    {
      name: 'Sneha Reddy',
      role: 'Product Designer at Flipkart',
      quote: 'Finally a resume builder that doesn\'t make my PDF look like a screenshot. The margin and font controls give me the precision I need as a designer.',
      rating: 5,
    },
  ]

  // Show 5 templates for the showcase
  const showcaseTemplates = resumeTemplates.slice(0, 5)

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: colors.cream }}>
      <Helmet>
        <title>EduNiaa | AI-Powered Resume Builder, Interview Prep & Career Tools</title>
        <meta name="description" content="Build Canva-quality resumes, practice AI interviews, and get career insights. EduNiaa is your all-in-one platform for landing your dream job." />
        <link rel="canonical" href="https://eduniaa.com" />
      </Helmet>

      <Header />

      <main>
        {/* ═══════════════════════ HERO SECTION ═══════════════════════ */}
        <section className="relative pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-28 overflow-hidden">
          {/* Decorative gradient blobs */}
          <div className="absolute top-20 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: `radial-gradient(circle, ${colors.peach}, transparent)` }} />
          <div className="absolute bottom-0 -right-32 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: `radial-gradient(circle, ${colors.lavender}, transparent)` }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: `radial-gradient(circle, ${colors.coral}40, transparent)` }} />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border" style={{ background: 'white', borderColor: colors.lightBorder }}>
                <Sparkles className="w-4 h-4" style={{ color: colors.coral }} />
                <span className="text-sm font-medium" style={{ color: colors.softBlack }}>AI-Powered Career Platform</span>
              </div>

              {/* Headline */}
              <h1
                ref={heroTitleRef}
                className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight ${getAnimationClasses(heroTitleVisible, 'fadeInUp', 'duration-700')}`}
                style={{ color: colors.charcoal, fontFamily: "'Poppins', sans-serif" }}
              >
                Build Your Career,{' '}
                <span className="relative inline-block">
                  <span style={{ color: colors.coral }}>One Smart Tool</span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 8C50 3 120 2 150 5C180 8 250 4 298 7" stroke={colors.peach} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
                  </svg>
                </span>
                {' '}at a Time
              </h1>

              {/* Subtitle */}
              <p
                ref={heroDescRef}
                className={`text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed ${getAnimationClasses(heroDescVisible, 'fadeInUp', 'duration-700')}`}
                style={{ color: colors.warmGray }}
              >
                From resume building to interview prep — everything you need to land your dream role, powered by AI.
              </p>

              {/* CTA Buttons */}
              <div
                ref={heroCtaRef}
                className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${getAnimationClasses(heroCtaVisible, 'fadeInUp', 'duration-700')}`}
              >
                <button
                  onClick={() => navigate('/resume-builder')}
                  className="group flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: colors.coral }}
                  onMouseEnter={e => (e.currentTarget.style.background = colors.coralHover)}
                  onMouseLeave={e => (e.currentTarget.style.background = colors.coral)}
                >
                  Build Your Resume
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
                <a
                  href="#features"
                  className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base border-2 transition-all duration-300 hover:-translate-y-0.5"
                  style={{ color: colors.softBlack, borderColor: colors.lightBorder, background: 'white' }}
                >
                  Explore Features
                  <ChevronRight className="w-5 h-5" />
                </a>
              </div>

              {/* Trust points */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
                {[
                  { icon: <Shield className="w-4 h-4" />, text: 'ATS-Friendly' },
                  { icon: <Zap className="w-4 h-4" />, text: 'AI-Powered' },
                  { icon: <CheckCircle2 className="w-4 h-4" />, text: 'Free to Start' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm font-medium" style={{ color: colors.sage }}>
                    {item.icon}
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════ STATS BAR ═══════════════════════ */}
        <section className="py-12 sm:py-16 border-y" style={{ borderColor: colors.lightBorder, background: 'white' }}>
          <div
            ref={statsRef}
            className={`container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl ${getAnimationClasses(statsVisible, 'fadeInUp', 'duration-700')}`}
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
              <StatCounter end={14} suffix="+" label="Resume Templates" />
              <StatCounter end={10} suffix="K+" label="Resumes Built" />
              <StatCounter end={98} suffix="%" label="ATS Pass Rate" />
              <StatCounter end={4.9} suffix="" label="User Rating" prefix="" />
            </div>
          </div>
        </section>

        {/* ═══════════════════════ FEATURES GRID ═══════════════════════ */}
        <section id="features" className="py-20 sm:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div
              ref={featuresHeadRef}
              className={`text-center mb-16 ${getAnimationClasses(featuresHeadVisible, 'fadeInUp', 'duration-700')}`}
            >
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-4" style={{ background: colors.coral + '15', color: colors.coral }}>
                Platform Features
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{ color: colors.charcoal, fontFamily: "'Poppins', sans-serif" }}>
                Everything You Need to Succeed
              </h2>
              <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: colors.warmGray }}>
                A suite of AI-powered tools designed to give you an unfair advantage in your job search.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <FeatureCard key={i} {...feature} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════ HOW IT WORKS ═══════════════════════ */}
        <section className="py-20 sm:py-28" style={{ background: 'white' }}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div
              ref={howRef}
              className={`text-center mb-16 ${getAnimationClasses(howVisible, 'fadeInUp', 'duration-700')}`}
            >
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-4" style={{ background: colors.sage + '20', color: colors.sage }}>
                How It Works
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{ color: colors.charcoal, fontFamily: "'Poppins', sans-serif" }}>
                Three Steps to Your Dream Resume
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {howItWorks.map((step, i) => (
                <HowItWorksStep key={i} step={step} index={i} totalSteps={howItWorks.length} />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════ TEMPLATE SHOWCASE ═══════════════════════ */}
        <section className="py-20 sm:py-28 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div
              ref={templatesRef}
              className={`text-center mb-14 ${getAnimationClasses(templatesVisible, 'fadeInUp', 'duration-700')}`}
            >
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-4" style={{ background: '#8B5CF620', color: '#8B5CF6' }}>
                Templates
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{ color: colors.charcoal, fontFamily: "'Poppins', sans-serif" }}>
                Professional Templates for Every Role
              </h2>
              <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: colors.warmGray }}>
                14+ designs crafted for different industries — all ATS-friendly, all exportable as high-quality vector PDFs.
              </p>
            </div>

            {/* Horizontal scroll */}
            <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6">
              {showcaseTemplates.map((template) => {
                const ThumbnailComponent = template.component
                return (
                  <Link
                    key={template.id}
                    to="/resume-builder"
                    className="flex-shrink-0 w-[240px] sm:w-[260px] group snap-start"
                  >
                    <div className="aspect-[8.5/11] bg-white rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 relative" style={{ borderColor: colors.lightBorder }}>
                      <div className="w-full h-full relative overflow-hidden">
                        <div className="absolute top-0 left-0" style={{
                          transform: 'scale(0.27)',
                          transformOrigin: 'top left',
                          width: '850px',
                          height: '1100px',
                          pointerEvents: 'none',
                        }}>
                          <ThumbnailComponent data={{
                            personalInfo: { name: 'John Doe', title: 'Software Engineer', contact: { email: 'john@email.com', phone: '+1 555-0123', location: 'New York, USA' } },
                            summary: 'Experienced software engineer with 5+ years building scalable web applications.',
                            experience: [{ id: '1', title: 'Senior Developer', company: 'Tech Corp', location: 'NYC', startDate: 'Jan 2021', endDate: 'Present', description: ['Led team of 5 engineers', 'Improved performance by 40%'] }],
                            education: [{ id: '1', degree: 'B.S. Computer Science', institution: 'MIT', location: 'Cambridge, MA', graduationDate: '2019' }],
                            skills: [{ id: '1', category: 'Technical', skills: ['React', 'TypeScript', 'Node.js', 'Python'] }],
                            projects: [],
                            certificates: [],
                            awards: [],
                            languages: [{ id: '1', language: 'English', proficiency: 'Native' }],
                            publications: [],
                            memberships: [],
                            volunteer: [],
                            sectionOrder: ['summary', 'experience', 'skills', 'education'],
                          }} />
                        </div>
                      </div>
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 rounded-2xl" />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-center" style={{ color: colors.softBlack }}>
                      {template.name}
                    </p>
                    <p className="text-xs text-center" style={{ color: colors.warmGray }}>
                      {template.category}
                    </p>
                  </Link>
                )
              })}

              {/* "See All" card */}
              <Link
                to="/resume-builder"
                className="flex-shrink-0 w-[240px] sm:w-[260px] snap-start"
              >
                <div className="aspect-[8.5/11] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-2" style={{ borderColor: colors.coral + '40', background: colors.coral + '05' }}>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: colors.coral + '15' }}>
                    <ArrowRight className="w-6 h-6" style={{ color: colors.coral }} />
                  </div>
                  <span className="font-semibold" style={{ color: colors.coral }}>See All 14+ Templates</span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════ TESTIMONIALS ═══════════════════════ */}
        <section className="py-20 sm:py-28" style={{ background: 'white' }}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div
              ref={testimonialsRef}
              className={`text-center mb-14 ${getAnimationClasses(testimonialsVisible, 'fadeInUp', 'duration-700')}`}
            >
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-4" style={{ background: '#FBBF2420', color: '#D97706' }}>
                Testimonials
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{ color: colors.charcoal, fontFamily: "'Poppins', sans-serif" }}>
                Loved by Job Seekers
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <TestimonialCard key={i} {...t} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════ CTA SECTION ═══════════════════════ */}
        <section className="py-20 sm:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div
              ref={ctaRef}
              className={`relative rounded-3xl overflow-hidden py-16 sm:py-20 px-8 sm:px-16 text-center ${getAnimationClasses(ctaVisible, 'scaleIn', 'duration-700')}`}
              style={{ background: `linear-gradient(135deg, ${colors.charcoal}, ${colors.softBlack})` }}
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: colors.coral }} />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 blur-3xl" style={{ background: colors.peach }} />

              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Ready to Stand Out?
                </h2>
                <p className="text-lg text-white/70 max-w-lg mx-auto mb-8">
                  Join thousands who've already landed interviews with resumes built on EduNiaa.
                </p>
                <button
                  onClick={() => navigate('/resume-builder')}
                  className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: colors.coral }}
                  onMouseEnter={e => (e.currentTarget.style.background = colors.coralHover)}
                  onMouseLeave={e => (e.currentTarget.style.background = colors.coral)}
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default HomePage
