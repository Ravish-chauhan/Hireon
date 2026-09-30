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
  Briefcase,
  Award,
  GraduationCap,
  Search,
  Building2,
  UserCheck,
  Mic,
  Code2,
  Play,
  Volume2,
  Clock,
} from 'lucide-react' // Icons import

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
      icon: <Briefcase className="w-6 h-6" />,
      title: 'Live ATS Job Board',
      description: 'Search, filter, and apply directly to active job openings scraped in real-time from Greenhouse and top ATS platforms.',
      href: '/jobs',
      accent: '#8B5CF6',
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
        {/* ═══════════════════════ UNIFIED CONTINUOUS CANVAS ═══════════════════════ */}
        <div className="relative bg-[#FAF7F2] overflow-hidden">
          {/* Continuous Graph Paper Grid Background Overlay */}
          <div
            className="absolute inset-0 opacity-50 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, #E2DED4 1px, transparent 1px), linear-gradient(to bottom, #E2DED4 1px, transparent 1px)`,
              backgroundSize: '72px 72px',
            }}
          />

          {/* ═══════════════════════ HERO SECTION ═══════════════════════ */}
          <section className="relative min-h-screen flex flex-col justify-center pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 my-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
                
                {/* Left Column: Headline & Action CTAs */}
                <div className="lg:col-span-6 flex flex-col items-start text-left lg:-translate-x-3">
                  {/* Main Headline */}
                  <h1
                    ref={heroTitleRef}
                    className={`font-condensed font-bold uppercase text-5xl sm:text-6xl md:text-7xl lg:text-[84px] text-black leading-[0.92] tracking-tight mb-7 select-none ${getAnimationClasses(heroTitleVisible, 'fadeInUp', 'duration-700')}`}
                  >
                    YOUR CAREER,<br />
                    OUR MISSION.
                  </h1>

                  {/* Handwritten Tagline Slogan */}
                  <div
                    ref={heroDescRef}
                    className={`font-handwriting text-3xl sm:text-4xl lg:text-[42px] font-semibold text-neutral-900 mb-10 flex items-center gap-2.5 flex-wrap ${getAnimationClasses(heroDescVisible, 'fadeInUp', 'duration-700')}`}
                  >
                    <span>Build.</span>
                    <span>Analyze.</span>
                    <span>Practice.</span>
                    <span className="relative inline-block">
                      Get Hired.
                      <svg className="absolute -bottom-3 -left-1 w-[108%] h-4 overflow-visible" viewBox="0 0 170 16" fill="none">
                        <path d="M 4 12 C 50 6 120 6 166 10" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />
                      </svg>
                    </span>
                  </div>

                  {/* Subtitle Paragraph */}
                  <p className="text-neutral-800 text-base sm:text-[17px] max-w-md sm:max-w-lg leading-relaxed font-normal mb-8">
                    All-in-one platform to build your resume, crack interviews, get hired faster and grow your career.
                  </p>

                  {/* CTA Buttons & Arrow */}
                  <div
                    ref={heroCtaRef}
                    className={`flex flex-wrap items-center gap-4 ${getAnimationClasses(heroCtaVisible, 'fadeInUp', 'duration-700')}`}
                  >
                    <button
                      onClick={() => navigate('/resume-builder')}
                      className="bg-black text-white px-7 py-3.5 rounded-xl font-semibold text-base shadow-sm hover:bg-neutral-800 transition-all duration-200 cursor-pointer"
                    >
                      Get Started for Free
                    </button>

                    <div className="flex items-center gap-2">
                      {/* Left-pointing handwritten curved arrow with sharp connected V-tip matching reference image */}
                      <svg className="w-12 h-6 text-black transform translate-y-0.5" viewBox="0 0 54 24" fill="none">
                        <path d="M 50 18 C 34 6 18 6 3 12 M 15 5 L 3 12 L 15 19" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>

                      <button
                        onClick={() => navigate('/jobs')}
                        className="font-semibold text-black underline underline-offset-4 hover:text-neutral-600 transition-colors text-base cursor-pointer"
                      >
                        Book a Demo
                      </button>
                    </div>
                  </div>

                  {/* Trust Note */}
                  <div className="font-handwriting text-xl sm:text-2xl font-bold text-neutral-800 mt-6 select-none">
                    No credit card required
                  </div>
                </div>

                {/* Right Column: Real Torn Notebook Paper Image Canvas */}
                <div className="lg:col-span-6 relative mt-4 lg:mt-0 lg:translate-x-8 lg:-translate-y-8">
                  <div className="relative max-w-[360px] sm:max-w-[420px] lg:max-w-[465px] mx-auto">
                    
                    {/* Top-Right Wire Paperclip Clipping Over Top Right Edge */}
                    <div className="absolute -top-2 right-14 sm:right-22 z-30 pointer-events-none text-neutral-900 drop-shadow-xs">
                      <svg className="w-9 h-18" viewBox="0 0 36 72" fill="none">
                        <path
                          d="M 12 24 L 12 56 A 10 10 0 0 0 32 56 L 32 14 A 12 12 0 0 0 8 14 L 8 48 A 6 6 0 0 0 20 48 L 20 28"
                          stroke="currentColor"
                          strokeWidth="3.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    {/* Top-Right Hand-Drawn Star Doodles */}
                    <div className="absolute -top-4 -right-2 sm:-top-8 sm:-right-8 z-20 pointer-events-none text-neutral-900 flex items-center gap-1">
                      <svg className="w-9 h-9 transform rotate-6" viewBox="0 0 32 32" fill="none">
                        <path d="M16 2L19.5 11L29 12.5L22 19L24 28.5L16 23.5L8 28.5L10 19L3 12.5L12.5 11Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
                      </svg>
                      <svg className="w-5 h-5 transform -rotate-12" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2 C12 7 17 12 22 12 C17 12 12 17 12 22 C12 17 7 12 2 12 C7 12 12 7 12 2 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
                      </svg>
                    </div>

                    {/* Real Notebook Paper Graphic Container */}
                    <div className="relative transform rotate-[0.3deg] transition-transform duration-300">
                      {/* High Quality Torn Notebook Paper PNG Image */}
                      <img
                        src="/hero_page.png"
                        alt="Torn Notebook Paper"
                        className="w-full h-auto drop-shadow-md select-none"
                      />

                      {/* Yellow Sticky Note Badge ("Your Career Toolkit") Attached at Bottom-Right */}
                      <div className="absolute top-[65%] -right-9 sm:-right-16 z-30 pointer-events-none select-none transform rotate-[6deg] hover:rotate-[3deg] transition-transform duration-300">
                        <div className="relative w-36 sm:w-44 bg-[#FFCD29] text-black p-4 sm:p-5 rounded-xs shadow-md border border-amber-400/60 font-handwriting">
                          {/* Realistic Torn-Edge Semi-transparent Scotch Tape at Top Center */}
                          <svg className="absolute -top-4 sm:-top-5 left-1/2 -translate-x-1/2 w-24 sm:w-30 h-7 sm:h-8 z-20 pointer-events-none select-none transform rotate-1 overflow-visible drop-shadow-2xs" viewBox="0 0 120 32" fill="none">
                            <path
                              d="M 4 0 L 116 0 L 118 4 L 115 8 L 118 12 L 115 16 L 118 20 L 115 24 L 118 28 L 116 32 L 4 32 L 2 28 L 5 24 L 2 20 L 5 16 L 2 12 L 5 8 L 2 4 Z"
                              fill="rgba(230, 195, 130, 0.45)"
                              stroke="rgba(215, 175, 110, 0.35)"
                              strokeWidth="0.8"
                            />
                            <line x1="4" y1="1" x2="116" y2="1" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" />
                          </svg>

                          {/* Hand-drawn Star Doodle on Top-Left */}
                          <div className="absolute top-3 left-3 text-black">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
                              <path d="M12 2 L14 8 L20 10 L15 14 L17 20 L12 16 L7 20 L9 14 L4 10 L10 8 Z" stroke="black" strokeWidth="2.2" strokeLinejoin="round" />
                              <circle cx="12" cy="11" r="1.5" fill="black" />
                            </svg>
                          </div>

                          {/* Sticky Note Text */}
                          <div className="text-center pt-3 leading-[1.08] font-bold text-2xl sm:text-[32px] tracking-tight">
                            <div>Your</div>
                            <div>Career</div>
                            <div>Toolkit</div>
                          </div>

                          {/* Dog-eared bottom-left fold effect */}
                          <div className="absolute bottom-0 left-0 w-0 h-0 border-b-[14px] border-b-[#FAF7F2] border-r-[14px] border-r-amber-500/40" />
                        </div>
                      </div>

                      {/* Overlaid Checklist Content (Tilted -3.8deg around center) */}
                      <div className="absolute inset-0 pt-6 sm:pt-10 pb-4 pl-[21%] sm:pl-[22%] lg:pl-[22.5%] pr-4 sm:pr-6 flex flex-col justify-center space-y-2 sm:space-y-3 transform rotate-[-3.8deg] origin-center">
                        {[
                          'AI Resume Builder',
                          'Resume Analyzer',
                          'AI Interview Practice',
                          'Recruiter Assessment',
                          'Job Search',
                          'And More...',
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 sm:gap-5 group">
                            {/* Yellow Box with Checkmark Extending Out Past Top-Right Corner */}
                            <div className="relative w-4.5 h-4.5 sm:w-5 sm:h-5 bg-[#F5B81C] rounded-xs shadow-2xs border border-amber-500/50 flex-shrink-0 overflow-visible">
                              <svg
                                className="absolute -top-1.5 -right-1.5 w-6 h-6 sm:w-7 sm:h-7 text-black pointer-events-none overflow-visible"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M 5 13 L 9.5 17.5 L 21 3.5"
                                  stroke="currentColor"
                                  strokeWidth="2.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>

                            <span className="font-handwriting text-lg sm:text-2xl lg:text-[25px] font-medium text-neutral-800 tracking-wider transition-colors group-hover:text-black">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom-Right Hand-Drawn Loop-De-Loop Arrow Doodle */}
                    <div className="absolute -bottom-14 right-18 sm:right-24 pointer-events-none text-neutral-900 z-10">
                      <svg className="w-24 sm:w-28 h-12" viewBox="0 0 110 50" fill="none">
                        <path
                          d="M 10 40 C 30 50 50 40 45 25 C 40 10 20 20 40 35 C 60 50 90 30 100 12 M 88 14 L 102 10 L 98 26"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* ═══════════════════════ FEATURES / TOOLS SECTION ═══════════════════════ */}
          <section id="features" className="relative pt-6 pb-20 sm:pb-28">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
              {/* Header row */}
              <div
                ref={featuresHeadRef}
                className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 relative ${getAnimationClasses(featuresHeadVisible, 'fadeInUp', 'duration-700')}`}
              >
                {/* Left Column: Yellow Badge & Main Headline */}
                <div className="flex flex-col items-start">
                  {/* Yellow Highlighter Badge */}
                  <div className="inline-block bg-[#FFE52A] text-neutral-950 font-bold text-xs uppercase px-3 py-1 tracking-wider rotate-[-2deg] rounded-xs shadow-xs mb-3.5 select-none">
                    EVERYTHING YOU NEED
                  </div>

                  {/* Main Headline */}
                  <h2 className="font-condensed font-bold uppercase text-4xl sm:text-5xl md:text-6xl text-neutral-900 leading-[0.98] tracking-tight select-none">
                    POWERFUL TOOLS<br />
                    TO GET YOU HIRED
                  </h2>
                </div>

                {/* Right Column: Subtitle with yellow highlights & double underline doodle */}
                <div className="max-w-md md:text-left relative pt-2">
                  <p className="text-neutral-700 text-base sm:text-lg leading-relaxed font-normal">
                    Our AI-powered suite helps students and job seekers{' '}
                    <mark className="bg-[#FFE52A] text-neutral-950 px-1 py-0.5 rounded-xs font-semibold">stand out</mark>{' '}
                    and{' '}
                    <mark className="bg-[#FFE52A] text-neutral-950 px-1 py-0.5 rounded-xs font-semibold">stay ahead.</mark>
                  </p>

                  {/* Hand-drawn double underline curve */}
                  <svg className="w-56 h-3.5 text-neutral-900 mt-2" viewBox="0 0 220 14" fill="none">
                    <path d="M 3 6 Q 110 13 217 5 M 18 10 Q 120 15 202 9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </div>

                {/* Far Top-Right Star Doodle */}
                <div className="hidden lg:block absolute -top-4 right-0 text-neutral-900 pointer-events-none">
                  <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
                    <path d="M16 2L19.5 11L29 12.5L22 19L24 28.5L16 23.5L8 28.5L10 19L3 12.5L12.5 11Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
                    <circle cx="28" cy="4" r="1.5" fill="currentColor" />
                  </svg>
                </div>
              </div>

              {/* 5 Feature Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                {[
                  {
                    id: 'builder',
                    title: 'AI Resume Builder',
                    description: 'Create ATS-friendly, professional resumes in minutes.',
                    linkText: 'Try Now',
                    href: '/resume-builder',
                    hasTape: true,
                    icon: (
                      <svg className="w-8.5 h-8.5 sm:w-9 sm:h-9 text-neutral-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <circle cx="10" cy="9" r="1" fill="currentColor" />
                      </svg>
                    ),
                  },
                  {
                    id: 'analyzer',
                    title: 'Resume Analyzer',
                    description: 'Get instant feedback and score to improve your resume.',
                    linkText: 'Analyze Now',
                    href: '/resume-upload',
                    hasTape: false,
                    icon: (
                      <svg className="w-8.5 h-8.5 sm:w-9 sm:h-9 text-neutral-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                        <path d="M9 12l2 2 4-4" />
                        <line x1="9" y1="17" x2="15" y2="17" />
                      </svg>
                    ),
                  },
                  {
                    id: 'interview',
                    title: 'AI Interview Practice',
                    description: 'Practice with AI, get real-time feedback and improve.',
                    linkText: 'Practice Now',
                    href: '/ai-interview',
                    hasTape: false,
                    icon: (
                      <svg className="w-8.5 h-8.5 sm:w-9 sm:h-9 text-neutral-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" y1="19" x2="12" y2="22" />
                      </svg>
                    ),
                  },
                  {
                    id: 'assessment',
                    title: 'Recruiter Assessment',
                    description: 'Recruiters can assess, shortlist and rate candidates easily.',
                    linkText: 'Learn More',
                    href: '/jobs',
                    hasTape: false,
                    icon: (
                      <svg className="w-8.5 h-8.5 sm:w-9 sm:h-9 text-neutral-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    ),
                  },
                  {
                    id: 'jobs',
                    title: 'Job Search',
                    description: 'Find relevant jobs tailored to your skills and goals.',
                    linkText: 'Explore Jobs',
                    href: '/jobs',
                    hasTape: false,
                    icon: (
                      <svg className="w-8.5 h-8.5 sm:w-9 sm:h-9 text-neutral-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                    ),
                  },
                ].map((tool) => (
                  <div
                    key={tool.id}
                    onClick={() => navigate(tool.href)}
                    className="relative bg-[#FAFAFA] border border-neutral-200/90 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 cursor-pointer group"
                    style={{
                      backgroundImage: 'linear-gradient(transparent 27px, #EAE5DA 28px)',
                      backgroundSize: '100% 28px',
                    }}
                  >
                    {tool.hasTape && (
                      <svg
                        className="absolute -top-2 -left-4 sm:-top-2.5 sm:-left-5 w-17 sm:w-21 h-5 sm:h-6 z-20 pointer-events-none select-none transform rotate-[-19deg] overflow-visible"
                        viewBox="0 0 100 28"
                        fill="none"
                      >
                        <path
                          d="M 4 0 L 96 0 L 98 3.5 L 95 7 L 98 10.5 L 95 14 L 98 17.5 L 95 21 L 98 24.5 L 96 28 L 4 28 L 2 24.5 L 5 21 L 2 17.5 L 5 14 L 2 10.5 L 5 7 L 2 3.5 Z"
                          fill="rgba(140, 192, 232, 0.65)"
                          stroke="rgba(115, 170, 215, 0.45)"
                          strokeWidth="0.8"
                        />
                      </svg>
                    )}

                    <div>
                      {/* Mini Notebook Page Icon Patch using /icon_bg.png */}
                      <div className="relative w-14 h-14 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-200 select-none">
                        <img
                          src="/icon_bg.png"
                          alt="Icon Background"
                          className="absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)] max-w-none object-contain pointer-events-none drop-shadow-xs"
                          style={{ transform: 'scale(1.18)' }}
                        />

                        {/* Icon rendered ABOVE icon_bg.png background */}
                        <div className="relative z-10 text-neutral-900">
                          {tool.icon}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-lg text-neutral-900 mb-2 leading-snug">
                        {tool.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-neutral-600 leading-relaxed mb-6 font-normal">
                        {tool.description}
                      </p>
                    </div>

                    {/* Link Button */}
                    <div className="font-semibold text-sm text-neutral-900 underline underline-offset-4 flex items-center gap-1.5 group-hover:text-black transition-colors pt-2">
                      <span>{tool.linkText}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                ))}
              </div>
              {/* ═══════════════════════ TORN PAPER METRICS BANNER ═══════════════════════ */}
              <div className="mt-14 sm:mt-28 mb-14 sm:mb-20 relative max-w-7xl mx-auto px-2 sm:px-4 select-none">
                {/* High-res Torn Paper Banner Image (/page_strip.png) with expanded bounds */}
                <div className="relative w-full py-16 sm:py-20 px-3 sm:px-14 flex items-center justify-center">
                  <img
                    src="/page_strip.png"
                    alt="Torn Page Strip"
                    className="absolute -inset-y-36 -inset-x-4 sm:-inset-y-64 sm:-inset-x-10 w-[calc(100%+32px)] sm:w-[calc(100%+80px)] h-[calc(100%+288px)] sm:h-[calc(100%+512px)] max-w-none object-fill pointer-events-none drop-shadow-md z-0"
                  />

                  {/* Translucent Yellow Corner Tape on Left Edge */}
                  <svg
                    className="absolute -left-4 top-[72%] sm:-left-7 sm:top-[58%] -translate-y-1/2 w-7 h-14 sm:w-11 sm:h-24 z-20 pointer-events-none select-none transform rotate-[-28deg] sm:rotate-[-14deg] overflow-visible drop-shadow-2xs"
                    viewBox="0 0 42 100"
                    fill="none"
                  >
                    <path
                      d="M 0 4 L 0 96 L 5 98 L 10 95 L 15 98 L 20 95 L 25 98 L 30 95 L 35 98 L 42 96 L 42 4 L 35 2 L 30 5 L 25 2 L 20 5 L 15 2 L 10 5 L 5 2 Z"
                      fill="rgba(240, 205, 95, 0.65)"
                      stroke="rgba(215, 180, 75, 0.4)"
                      strokeWidth="0.8"
                    />
                  </svg>

                  {/* Blue Curly Loop Doodle on Bottom-Right Corner */}
                  <svg
                    className="absolute -bottom-5 -right-3 sm:-bottom-8 sm:-right-6 w-10 sm:w-18 h-10 sm:h-18 z-20 pointer-events-none select-none overflow-visible"
                    viewBox="0 0 60 60"
                    fill="none"
                  >
                    <path
                      d="M 10 25 C 20 5, 45 10, 35 30 C 25 50, 5 35, 25 25 C 45 15, 55 45, 50 50"
                      stroke="#3A82F6"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>

                  {/* Metrics Content positioned at equal distance inside page_strip.png */}
                  <div className="relative z-10 w-full grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-neutral-400/50 py-1 sm:py-2.5">
                    {/* Metric 1 */}
                    <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-4.5 pl-2 pr-1 sm:px-5 py-3 sm:py-4">
                      <div className="relative w-8 h-8 sm:w-[52px] sm:h-[52px] flex items-center justify-center flex-shrink-0 select-none">
                        <img src="/icon_bg.png" alt="patch" className="absolute inset-0 w-full h-full object-cover rounded-md pointer-events-none drop-shadow-2xs" style={{ transform: 'scale(1.15)' }} />
                        <Users className="relative z-10 w-4 h-4 sm:w-[26px] sm:h-[26px] text-neutral-900" strokeWidth={1.75} />
                      </div>
                      <div>
                        <div className="font-extrabold text-lg sm:text-3xl lg:text-[2.1rem] text-neutral-900 tracking-tight leading-none">
                          50K+
                        </div>
                        <div className="text-[10px] sm:text-[13px] lg:text-sm font-semibold text-neutral-700 mt-0.5 sm:mt-1 whitespace-nowrap">
                          Active Users
                        </div>
                      </div>
                    </div>

                    {/* Metric 2 */}
                    <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-4.5 pl-3 pr-1 sm:px-5 py-3 sm:py-4">
                      <div className="relative w-8 h-8 sm:w-[52px] sm:h-[52px] flex items-center justify-center flex-shrink-0 select-none">
                        <img src="/icon_bg.png" alt="patch" className="absolute inset-0 w-full h-full object-cover rounded-md pointer-events-none drop-shadow-2xs" style={{ transform: 'scale(1.15)' }} />
                        <FileText className="relative z-10 w-4 h-4 sm:w-[26px] sm:h-[26px] text-neutral-900" strokeWidth={1.75} />
                      </div>
                      <div>
                        <div className="font-extrabold text-lg sm:text-3xl lg:text-[2.1rem] text-neutral-900 tracking-tight leading-none">
                          120K+
                        </div>
                        <div className="text-[10px] sm:text-[13px] lg:text-sm font-semibold text-neutral-700 mt-0.5 sm:mt-1 whitespace-nowrap">
                          Resumes Built
                        </div>
                      </div>
                    </div>

                    {/* Metric 3 */}
                    <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-4.5 pl-2 pr-1 sm:px-5 py-3.5 sm:py-4 pt-3 sm:pt-4">
                      <div className="relative w-8 h-8 sm:w-[52px] sm:h-[52px] flex items-center justify-center flex-shrink-0 select-none">
                        <img src="/icon_bg.png" alt="patch" className="absolute inset-0 w-full h-full object-cover rounded-md pointer-events-none drop-shadow-2xs" style={{ transform: 'scale(1.15)' }} />
                        <Award className="relative z-10 w-4 h-4 sm:w-[26px] sm:h-[26px] text-neutral-900" strokeWidth={1.75} />
                      </div>
                      <div>
                        <div className="font-extrabold text-lg sm:text-3xl lg:text-[2.1rem] text-neutral-900 tracking-tight leading-none">
                          30K+
                        </div>
                        <div className="text-[10px] sm:text-[13px] lg:text-sm font-semibold text-neutral-700 mt-0.5 sm:mt-1 whitespace-nowrap">
                          Interviews Practiced
                        </div>
                      </div>
                    </div>

                    {/* Metric 4 */}
                    <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-4.5 pl-3 pr-1 sm:px-5 py-3.5 sm:py-4 pt-3 sm:pt-4">
                      <div className="relative w-8 h-8 sm:w-[52px] sm:h-[52px] flex items-center justify-center flex-shrink-0 select-none">
                        <img src="/icon_bg.png" alt="patch" className="absolute inset-0 w-full h-full object-cover rounded-md pointer-events-none drop-shadow-2xs" style={{ transform: 'scale(1.15)' }} />
                        <Briefcase className="relative z-10 w-4 h-4 sm:w-[26px] sm:h-[26px] text-neutral-900" strokeWidth={1.75} />
                      </div>
                      <div>
                        <div className="font-extrabold text-lg sm:text-3xl lg:text-[2.1rem] text-neutral-900 tracking-tight leading-none">
                          15K+
                        </div>
                        <div className="text-[10px] sm:text-[13px] lg:text-sm font-semibold text-neutral-700 mt-0.5 sm:mt-1 whitespace-nowrap">
                          Successful Hires
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

                {/* ═══════════════════════ MADE FOR / WHO IS IT FOR SECTION ═══════════════════════ */}
                <div className="mt-16 sm:mt-24 mb-16 max-w-7xl mx-auto px-4 sm:px-6">
                  {/* Section Header */}
                  <div className="flex flex-col items-start mb-10 select-none">
                    <div className="inline-block bg-[#F5D875] text-neutral-950 font-bold text-xs uppercase px-3 py-1 tracking-wider rotate-[-2deg] rounded-xs shadow-2xs mb-2.5">
                      MADE FOR
                    </div>
                    <h2 className="font-condensed font-bold uppercase text-3xl sm:text-4xl lg:text-5xl text-neutral-900 leading-none tracking-tight">
                      WHO IS IT FOR?
                    </h2>
                    <svg className="w-36 sm:w-44 h-3 text-neutral-900 mt-1.5" viewBox="0 0 160 10" fill="none">
                      <path d="M 2 4 Q 80 9 158 3 M 12 7 Q 80 11 148 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                    </svg>
                  </div>

                  {/* 4 Audience Target Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
                    {/* Card 1: Students */}
                    <div className="relative bg-[#FAF8F3] border border-[#E6E1D5] rounded-2xl p-5 lg:p-6 shadow-2xs hover:shadow-md transition-all duration-200 group flex items-start gap-4">
                      {/* Translucent Light Blue Corner Tape on Top-Left Corner */}
                      <div
                        className="absolute -top-2 -left-4 z-20 pointer-events-none select-none transform rotate-[-28deg] drop-shadow-2xs overflow-hidden"
                        style={{ width: '62px', height: '25px', maxWidth: '62px', maxHeight: '25px' }}
                      >
                        <svg
                          width="62"
                          height="25"
                          viewBox="0 0 70 24"
                          fill="none"
                          className="w-full h-full block"
                        >
                          <path
                            d="M 2 0 L 68 0 L 70 3 L 67 6 L 70 9 L 67 12 L 70 15 L 67 18 L 70 21 L 68 24 L 2 24 L 0 21 L 3 18 L 0 15 L 3 12 L 0 9 L 3 6 L 0 3 Z"
                            fill="rgba(140, 192, 232, 0.75)"
                            stroke="rgba(115, 170, 215, 0.5)"
                            strokeWidth="0.8"
                          />
                        </svg>
                      </div>

                      <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0 select-none">
                        <img src="/icon_bg.png" alt="patch" className="absolute inset-0 w-full h-full object-cover rounded-md pointer-events-none drop-shadow-2xs" style={{ transform: 'scale(1.18)' }} />
                        <GraduationCap className="relative z-10 w-6 h-6 text-neutral-900" strokeWidth={1.75} />
                      </div>
                      <div className="pt-0.5">
                        <h3 className="font-bold text-lg text-neutral-900 mb-1 leading-snug">Students</h3>
                        <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed font-normal">
                          Build your profile and land your dream internships.
                        </p>
                      </div>
                    </div>

                    {/* Card 2: Job Seekers */}
                    <div className="relative bg-[#FAF8F3] border border-[#E6E1D5] rounded-2xl p-5 lg:p-6 shadow-2xs hover:shadow-md transition-all duration-200 group flex items-start gap-4">
                      <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0 select-none">
                        <img src="/icon_bg.png" alt="patch" className="absolute inset-0 w-full h-full object-cover rounded-md pointer-events-none drop-shadow-2xs" style={{ transform: 'scale(1.18)' }} />
                        <Search className="relative z-10 w-6 h-6 text-neutral-900" strokeWidth={1.75} />
                      </div>
                      <div className="pt-0.5">
                        <h3 className="font-bold text-lg text-neutral-900 mb-1 leading-snug">Job Seekers</h3>
                        <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed font-normal">
                          Find the right jobs and kickstart your next opportunity.
                        </p>
                      </div>
                    </div>

                    {/* Card 3: Colleges */}
                    <div className="relative bg-[#FAF8F3] border border-[#E6E1D5] rounded-2xl p-5 lg:p-6 shadow-2xs hover:shadow-md transition-all duration-200 group flex items-start gap-4">
                      <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0 select-none">
                        <img src="/icon_bg.png" alt="patch" className="absolute inset-0 w-full h-full object-cover rounded-md pointer-events-none drop-shadow-2xs" style={{ transform: 'scale(1.18)' }} />
                        <Building2 className="relative z-10 w-6 h-6 text-neutral-900" strokeWidth={1.75} />
                      </div>
                      <div className="pt-0.5">
                        <h3 className="font-bold text-lg text-neutral-900 mb-1 leading-snug">Colleges</h3>
                        <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed font-normal">
                          Empower your students with career-ready tools.
                        </p>
                      </div>
                    </div>

                    {/* Card 4: Recruiters */}
                    <div className="relative bg-[#FAF8F3] border border-[#E6E1D5] rounded-2xl p-5 lg:p-6 shadow-2xs hover:shadow-md transition-all duration-200 group flex items-start gap-4">
                      <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0 select-none">
                        <img src="/icon_bg.png" alt="patch" className="absolute inset-0 w-full h-full object-cover rounded-md pointer-events-none drop-shadow-2xs" style={{ transform: 'scale(1.18)' }} />
                        <UserCheck className="relative z-10 w-6 h-6 text-neutral-900" strokeWidth={1.75} />
                      </div>
                      <div className="pt-0.5">
                        <h3 className="font-bold text-lg text-neutral-900 mb-1 leading-snug">Recruiters</h3>
                        <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed font-normal">
                          Assess better, hire faster, build stronger teams.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

        {/* ═══════════════════════ AI INTERVIEWER SHOWCASE SECTION ═══════════════════════ */}
        <section className="py-20 sm:py-28 bg-[#090C15] text-white relative overflow-hidden">
          {/* Background Ambient Glows */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Career Prep</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-5 font-display">
                Real-Time AI Mock Interviews <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
                  Powered by LangGraph &amp; Groq
                </span>
              </h2>
              <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-normal">
                Practice live technical and behavioral rounds with realistic AI avatars, speech recognition, live code editors, and instant multi-criteria feedback.
              </p>
            </div>

            {/* Interactive Showcase Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Interactive Interview Mockup UI */}
              <div className="lg:col-span-7 bg-[#121624] border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
                {/* Top Simulation Bar */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-xs text-zinc-400 font-mono">Live Interview Simulation &bull; Technical Round</span>
                  </div>
                  <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full text-rose-400 text-xs font-semibold animate-pulse">
                    <Clock className="w-3.5 h-3.5" />
                    <span>01:45 remaining</span>
                  </div>
                </div>

                {/* Video Avatar + Question Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mb-5">
                  {/* Avatar Frame */}
                  <div className="sm:col-span-5 relative rounded-2xl overflow-hidden bg-black aspect-video sm:aspect-square flex items-center justify-center border border-white/10 group">
                    <video
                      src="/ai-interview/female-ai.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm rounded-full px-2.5 py-1">
                      <div className="flex gap-0.5 items-end h-3">
                        <span className="w-0.5 h-2 bg-emerald-400 rounded-full animate-bounce" />
                        <span className="w-0.5 h-3 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-0.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                      <span className="text-[10px] text-white/90 font-medium">AI Speaking</span>
                    </div>
                  </div>

                  {/* Question Box */}
                  <div className="sm:col-span-7 bg-[#1A2033] border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-md">
                          Question 3 of 6 &bull; Medium
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-semibold text-white leading-snug">
                        "Explain how indexing works in MongoDB and how you would diagnose a slow aggregation pipeline in production."
                      </h4>
                    </div>
                    
                    {/* Live Voice Waveform */}
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <Mic className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Speech-to-Text Active</span>
                      </div>
                      <span className="text-[11px] text-zinc-500 font-mono">Web Speech API</span>
                    </div>
                  </div>
                </div>

                {/* Real-Time Feedback Overlay Sample */}
                <div className="bg-[#182030] border border-emerald-500/30 rounded-2xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Instant AI Feedback</span>
                    </div>
                    <span className="text-xs font-bold text-white bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                      Score: 92/100
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    "Solid technical answer. You accurately highlighted compound indexes and executionStats in explain plans. Mentioning index memory limits would make it comprehensive."
                  </p>
                  <div className="grid grid-cols-4 gap-2 mt-3 pt-2.5 border-t border-white/5 text-center text-[10px] text-zinc-400">
                    <div>Clarity: <strong className="text-white">95%</strong></div>
                    <div>Relevance: <strong className="text-white">90%</strong></div>
                    <div>Correctness: <strong className="text-white">94%</strong></div>
                    <div>Efficiency: <strong className="text-white">88%</strong></div>
                  </div>
                </div>

                {/* Bottom Quick Controls Bar */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs text-zinc-400">Monaco Code Editor &bull; In-Browser Execution Ready</span>
                  </div>
                  <button
                    onClick={() => navigate('/ai-interview')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-black bg-white hover:bg-zinc-200 px-4 py-2 rounded-xl transition cursor-pointer"
                  >
                    <span>Try Simulator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Column: Feature Highlights & CTA */}
              <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  {[
                    {
                      icon: <Brain className="w-5 h-5 text-amber-400" />,
                      title: 'Role-Specific Dynamic Questions',
                      desc: 'LangGraph dynamically generates 6 progressive questions (conceptual &rarr; practical &rarr; live coding) tailored to your target job.',
                    },
                    {
                      icon: <Video className="w-5 h-5 text-blue-400" />,
                      title: 'Interactive Multi-Modal Avatars',
                      desc: 'Realistic AI avatar videos, Web Speech API speech recognition, and Text-to-Speech audio create authentic interview pressure.',
                    },
                    {
                      icon: <Code2 className="w-5 h-5 text-purple-400" />,
                      title: 'Built-in Monaco Code Editor',
                      desc: 'Solve coding challenges directly during the interview with syntax highlighting and in-browser JS execution.',
                    },
                    {
                      icon: <Award className="w-5 h-5 text-emerald-400" />,
                      title: '8-Factor Evaluation Report',
                      desc: 'Receive comprehensive feedback with overall scoring, strengths, weak areas, and 5 actionable tips to improve.',
                    },
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                        {feat.icon}
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-white mb-1">{feat.title}</h4>
                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Primary Action Button */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate('/ai-interview')}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-bold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-orange-500/20 transition-all cursor-pointer text-sm sm:text-base"
                  >
                    <span>Start Free Mock Interview</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate('/ai-interview')}
                    className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold px-5 py-3.5 rounded-xl transition cursor-pointer text-sm"
                  >
                    <span>Technical &bull; HR</span>
                  </button>
                </div>
              </div>

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
