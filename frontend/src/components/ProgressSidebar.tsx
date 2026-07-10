import React, { useState } from 'react'
import { FileTextIcon, CheckCircle2Icon, ArrowLeft, CloudIcon, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

type Section = {
  id: string
  label: string
  completed: boolean
  color: string
}

type ProgressSidebarProps = {
  currentPage: string
  sections: Section[]
  onNavigate: (pageId: string) => void
}

export function ProgressSidebar({
  currentPage,
  sections,
  onNavigate,
}: ProgressSidebarProps) {
  const navigate = useNavigate()
  const completedCount = sections.filter((s) => s.completed).length
  const totalCount = sections.length
  const progress = (completedCount / totalCount) * 100
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)

  return (
    <>
      {/* Desktop Sidebar - Premium Dark Theme with Enhanced Interactivity */}
      <aside className="hidden md:flex w-72 min-h-screen bg-gradient-to-b from-[#0A084B] via-[#0A084B] to-[#050424] flex-col pt-6 border-r border-white/5 sticky top-0 h-screen">
        {/* Custom scrollbar styles - visible thin scrollbar */}
        <style>{`
          .sidebar-scroll::-webkit-scrollbar { width: 4px; }
          .sidebar-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 4px; }
          .sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
          .sidebar-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
          .sidebar-scroll { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.2) rgba(255,255,255,0.05); }
        `}</style>
        {/* Back Button with hover effect */}
        <div className="flex-shrink-0 px-5 mb-4">
          <button
            onClick={() => navigate('/resume-builder')}
            className="group flex items-center gap-2 text-white/50 hover:text-white transition-all duration-300 text-sm font-medium px-3 py-2 hover:bg-white/10 rounded-xl w-fit hover:translate-x-[-2px]"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-[-3px]" />
            Back to Templates
          </button>
        </div>

        {/* Header with Logo - Animated */}
        <div className="flex-shrink-0 px-6 mb-6">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-11 h-11 bg-gradient-to-br from-[#FF9A35] to-[#FFD700] rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 transition-all duration-300 group-hover:shadow-orange-500/40 group-hover:scale-105">
              <FileTextIcon className="w-6 h-6 text-[#0A084B]" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg transition-colors duration-300 group-hover:text-amber-100">Resume</h2>
              <p className="text-white/40 text-xs font-medium">Builder</p>
            </div>
          </div>
        </div>

        {/* Progress Card - Interactive */}
        <div className="flex-shrink-0 mx-5 mb-6 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 hover:shadow-lg hover:shadow-white/5 cursor-default group">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14">
              <svg className="w-full h-full -rotate-90 transition-transform duration-500 group-hover:scale-105">
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="4"
                  fill="none"
                  className="transition-all duration-300"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  stroke="url(#progressGradientGold)"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 22}`}
                  strokeDashoffset={`${2 * Math.PI * 22 * (1 - progress / 100)}`}
                  className="transition-all duration-700 ease-out"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="progressGradientGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF9A35" />
                    <stop offset="100%" stopColor="#FFD700" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-sm font-bold transition-all duration-300 group-hover:scale-110">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white flex items-center gap-2">
                Progress
                {completedCount === totalCount && (
                  <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                )}
              </p>
              <p className="text-xs text-white/50 mt-0.5 transition-colors duration-300 group-hover:text-white/70">
                {completedCount} of {totalCount} done
              </p>
              {/* Progress bar mini */}
              <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FF9A35] to-[#FFD700] transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section Navigation - Enhanced Interactivity */}
        <div
          className="flex-1 min-h-0 px-4 py-2 space-y-1.5 overflow-y-auto sidebar-scroll"
          onWheel={(e) => {
            e.stopPropagation();
            const container = e.currentTarget;
            container.scrollTop += e.deltaY;
          }}
        >
          <p className="text-[11px] font-semibold text-white/30 uppercase tracking-wider px-3 mb-3">
            Sections
          </p>
          {sections.map((section, index) => {
            const isActive = currentPage === section.id
            const isCompleted = section.completed
            const isHovered = hoveredSection === section.id

            return (
              <button
                key={section.id}
                onClick={() => onNavigate(section.id)}
                onMouseEnter={() => setHoveredSection(section.id)}
                onMouseLeave={() => setHoveredSection(null)}
                className={`w-full flex items-center gap-3 px-3 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden
                  ${isActive
                    ? 'bg-white/10 backdrop-blur-sm border border-white/10 shadow-lg shadow-white/5'
                    : 'hover:bg-white/[0.07] hover:translate-x-1'
                  }`}
              >
                {/* Hover glow effect */}
                {isHovered && !isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
                )}

                {/* Step Number/Check with hover animation */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 font-semibold text-sm
                    ${isActive
                      ? 'bg-gradient-to-br from-[#FF9A35] to-[#FFD700] text-[#0A084B] shadow-lg shadow-orange-500/30 scale-105'
                      : isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/30 group-hover:scale-105'
                        : 'bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white/70 group-hover:scale-105'
                    }`}
                >
                  {isCompleted && !isActive ? (
                    <CheckCircle2Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  ) : (
                    <span className="transition-transform duration-300 group-hover:scale-110">{index + 1}</span>
                  )}
                </div>

                {/* Label with animations */}
                <div className="flex-1 text-left relative z-10">
                  <span
                    className={`text-sm font-medium block transition-all duration-300
                      ${isActive
                        ? 'text-white'
                        : 'text-white/60 group-hover:text-white/90 group-hover:translate-x-0.5'
                      }`}
                  >
                    {section.label}
                  </span>
                  {isCompleted && !isActive && (
                    <span className="text-[11px] text-emerald-400/80 font-medium flex items-center gap-1 transition-all duration-300 group-hover:text-emerald-400">
                      <CheckCircle2Icon className="w-3 h-3" /> Completed
                    </span>
                  )}
                  {isActive && (
                    <span className="text-[11px] text-amber-400/80 font-medium animate-pulse">● Working on this</span>
                  )}
                </div>

                {/* Active/Hover Indicator */}
                <div className={`w-1 h-7 rounded-full transition-all duration-300 overflow-hidden
                  ${isActive
                    ? 'bg-gradient-to-b from-[#FF9A35] to-[#FFD700] opacity-100'
                    : isHovered
                      ? 'bg-white/30 opacity-100'
                      : 'opacity-0'
                  }`}
                />
              </button>
            )
          })}
        </div>

        {/* Footer - Auto-save Status with animation */}
        <div className="flex-shrink-0 px-5 py-5 border-t border-white/5 group cursor-default">
          <div className="flex items-center gap-3 transition-all duration-300 group-hover:translate-x-1">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center transition-all duration-300 group-hover:bg-emerald-500/20 group-hover:scale-105">
              <CloudIcon className="w-4 h-4 text-emerald-400 transition-transform duration-300" />
            </div>
            <div>
              <p className="text-[11px] text-white/40 transition-colors duration-300 group-hover:text-white/60">Your progress</p>
              <p className="text-sm text-white/70 font-medium flex items-center gap-2 transition-colors duration-300 group-hover:text-white/90">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                Auto-saved
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Horizontal Navigation - Enhanced */}
      <nav className="md:hidden fixed top-[72px] left-0 right-0 z-40 bg-[#0A084B]/95 backdrop-blur-lg border-b border-white/5 pt-2 pb-2">
        <div className="flex overflow-x-auto whitespace-nowrap px-4 py-2 scrollbar-hide gap-2 no-scrollbar">
          {sections.map((section, index) => {
            const isActive = currentPage === section.id
            const isCompleted = section.completed

            return (
              <button
                key={section.id}
                onClick={() => onNavigate(section.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 flex-shrink-0 active:scale-95
                  ${isActive
                    ? 'bg-gradient-to-r from-[#FF9A35] to-[#FFD700] shadow-lg shadow-orange-500/20'
                    : 'bg-white/5 hover:bg-white/10 active:bg-white/15'
                  }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all duration-300
                    ${isActive
                      ? 'bg-[#0A084B]/30 text-[#0A084B]'
                      : isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-white/10 text-white/50'
                    }`}
                >
                  {isCompleted && !isActive ? (
                    <CheckCircle2Icon className="w-3 h-3" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span
                  className={`text-xs font-semibold transition-colors duration-300
                    ${isActive ? 'text-[#0A084B]' : 'text-white/70'}`}
                >
                  {section.label}
                </span>
              </button>
            )
          })}
        </div>
        {/* Progress bar line for mobile */}
        <div className="h-0.5 bg-white/5 w-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FF9A35] to-[#FFD700] transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </nav>
    </>
  )
}