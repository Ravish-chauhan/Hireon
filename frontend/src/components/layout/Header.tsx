import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0
      setScrollProgress(scrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const navItems = [
    { label: 'Features', href: '/#features' },
    { label: 'How it Works', href: '/#how-it-works' },
    { label: 'AI Interview', href: '/ai-interview' },
    { label: 'DSA Interview', href: '/dsa-interview' },
    { label: 'Job Board', href: '/jobs' },
    { label: 'Resume Builder', href: '/resume-builder' },
    { label: 'Resume Analyzer', href: '/resume-upload' },
  ]

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent ${
        isScrolled ? 'py-3 backdrop-blur-xs' : 'py-5'
      }`}
    >
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-black/80 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="container mx-auto px-4 sm:px-8 max-w-7xl">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center transition-transform group-hover:scale-105">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <span className="font-bold text-xl sm:text-2xl text-neutral-900 tracking-tight font-display">
              EduNiaa
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden min-[850px]:flex items-center space-x-6">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-neutral-700 hover:text-black transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden min-[850px]:flex items-center space-x-3">
            <button
              onClick={() => navigate('/resume-builder')}
              className="px-4 py-2 text-sm font-semibold text-neutral-900 border border-neutral-400 rounded-lg hover:bg-neutral-900/5 transition duration-200 cursor-pointer bg-transparent"
            >
              Log in
            </button>
            <button
              onClick={() => navigate('/resume-builder')}
              className="px-4 py-2 text-sm font-semibold text-white bg-black rounded-lg hover:bg-neutral-800 transition duration-200 shadow-sm cursor-pointer"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex min-[850px]:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-neutral-800 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1.5">
                <span className={`h-0.5 w-6 bg-black transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`h-0.5 w-6 bg-black transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`h-0.5 w-6 bg-black transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="min-[850px]:hidden bg-[#FAF7F2] border-b border-neutral-200 px-6 py-5 space-y-4 shadow-lg">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-base font-medium text-neutral-800 hover:text-black py-1"
            >
              {item.label}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => { setIsMobileMenuOpen(false); navigate('/resume-builder'); }}
              className="w-full py-2.5 text-sm font-semibold text-neutral-800 border border-neutral-300 rounded-lg bg-white"
            >
              Log in
            </button>
            <button
              onClick={() => { setIsMobileMenuOpen(false); navigate('/resume-builder'); }}
              className="w-full py-2.5 text-sm font-semibold text-white bg-black rounded-lg"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
