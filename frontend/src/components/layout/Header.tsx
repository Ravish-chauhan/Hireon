import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const location = useLocation()
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrolled = (winScroll / height) * 100
      setScrollProgress(scrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Resume Builder', href: '/resume-builder' },
    { label: 'Resume Analyzer', href: '/resume-upload' },
  ]

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? 'bg-[#1A1A2E]/95 backdrop-blur-lg shadow-lg py-1'
        : 'bg-[#1A1A2E] py-2'
        }`}
    >
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#FF6B5A] via-[#FFB088] to-[#FF6B5A]"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="container mx-auto px-8 sm:px-16 md:px-8 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center w-32 sm:w-36 md:w-40 lg:w-44 overflow-hidden">
            <Link to="/" className="flex items-center justify-center w-full h-full text-white font-bold text-xl">
              EduNiaa
            </Link>
          </div>

          <nav className="hidden min-[850px]:flex items-center space-x-4">
            {navItems.map((item) => {
              const isActive = item.href === location.pathname ||
                (item.href === '/' && location.pathname === '/')

              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`relative px-4 py-2 text-sm font-bold transition-all duration-300 group ${isActive
                    ? 'text-[#FF6B5A]'
                    : 'text-white/80 hover:text-white'
                    }`}
                >
                  <span className="relative">
                    {item.label}
                  </span>
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#FF6B5A] transition-all duration-300 ${isActive ? 'w-1/2' : 'w-0 group-hover:w-1/2 opacity-50'
                    }`} />
                </Link>
              )
            })}
          </nav>

          <div className="flex min-[850px]:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative p-3 rounded-lg text-white hover:text-[#FFB088] focus:outline-none transition-all duration-300 group"
            >
              <div className="relative w-6 h-6 flex flex-col justify-center items-center">
                <span className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45' : '-translate-y-2'
                  }`} />
                <span className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100'
                  }`} />
                <span className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45' : 'translate-y-2'
                  }`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out min-[850px]:hidden ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <nav className="bg-white/95 backdrop-blur-xl border-t mt-2 py-4 px-4 shadow-xl">
          <div className="flex flex-col space-y-1">
            {navItems.map((item, index) => {
              const isActive = item.href === location.pathname ||
                (item.href === '/' && location.pathname === '/')

              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 transform hover:translate-x-2 ${isActive
                    ? 'text-[#FF6B5A] bg-red-50'
                    : 'text-gray-700 hover:text-[#FF6B5A] hover:bg-gray-50'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </header >
  )
}
