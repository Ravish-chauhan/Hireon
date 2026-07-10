import React from 'react'
import { CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useScrollReveal, getAnimationClasses } from '../../hooks/useScrollReveal'

// Step configuration with page IDs
const steps = [
    { id: 'bio', name: 'Bio', short: 'Bio' },
    { id: 'summary', name: 'Summary', short: 'Sum' },
    { id: 'skills', name: 'Skills', short: 'Skill' },
    { id: 'education', name: 'Education', short: 'Edu' },
    { id: 'experience', name: 'Experience', short: 'Exp' },
    { id: 'projects', name: 'Projects', short: 'Proj' },
    { id: 'optional', name: 'Optional', short: 'Opt' },
]

interface FormPageLayoutProps {
    children: React.ReactNode
    currentStep: number
    totalSteps?: number
    stepName: string
    title: string
    subtitle?: string
    onNavigate?: (pageId: string) => void
}

export function FormPageLayout({
    children,
    currentStep,
    stepName,
    title,
    subtitle,
    onNavigate,
}: FormPageLayoutProps) {
    const navigate = useNavigate()
    const { ref: headerRef, isVisible } = useScrollReveal()

    const handleStepClick = (stepId: string, stepIndex: number) => {
        if (onNavigate) {
            onNavigate(stepId)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
            {/* Subtle Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
            </div>

            <main className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Mobile Back Button */}
                    <button
                        onClick={() => navigate('/resume-builder')}
                        className="md:hidden flex items-center gap-2 text-slate-500 mb-6 font-medium hover:text-slate-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Templates
                    </button>

                    {/* Progress Indicator - Now Clickable */}
                    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8">
                        {steps.map((step, index) => {
                            const isCompleted = index + 1 < currentStep
                            const isCurrent = index + 1 === currentStep
                            const isClickable = onNavigate !== undefined

                            return (
                                <React.Fragment key={step.name}>
                                    <button
                                        onClick={() => handleStepClick(step.id, index + 1)}
                                        disabled={!isClickable}
                                        className={`flex flex-col items-center group transition-all duration-200 ${isClickable ? 'cursor-pointer' : 'cursor-default'
                                            }`}
                                    >
                                        <div
                                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-300 ${isCompleted
                                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 group-hover:scale-110'
                                                    : isCurrent
                                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 ring-4 ring-blue-100'
                                                        : isClickable
                                                            ? 'bg-slate-100 text-slate-400 border border-slate-200 group-hover:bg-slate-200 group-hover:text-slate-600 group-hover:scale-105 group-hover:border-slate-300'
                                                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                                                }`}
                                        >
                                            {isCompleted ? (
                                                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                            ) : (
                                                index + 1
                                            )}
                                        </div>
                                        <span
                                            className={`text-[10px] sm:text-xs mt-1.5 font-medium transition-colors ${isCurrent
                                                    ? 'text-blue-600'
                                                    : isCompleted
                                                        ? 'text-emerald-600 group-hover:text-emerald-700'
                                                        : isClickable
                                                            ? 'text-slate-400 group-hover:text-slate-600'
                                                            : 'text-slate-400'
                                                }`}
                                        >
                                            <span className="hidden sm:inline">{step.name}</span>
                                            <span className="sm:hidden">{step.short}</span>
                                        </span>
                                    </button>
                                    {index < steps.length - 1 && (
                                        <div
                                            className={`w-6 sm:w-12 h-0.5 mt-[-16px] transition-colors ${isCompleted ? 'bg-emerald-500' : 'bg-slate-200'
                                                }`}
                                        />
                                    )}
                                </React.Fragment>
                            )
                        })}
                    </div>

                    {/* Header */}
                    <div
                        ref={headerRef}
                        className={`text-center mb-8 md:mb-12 ${getAnimationClasses(isVisible, 'fadeInUp')}`}
                    >
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Main Content */}
                    <div className="relative">{children}</div>
                </div>
            </main>
        </div>
    )
}


// Modern Glass Card Component
interface GlassCardProps {
    children: React.ReactNode
    className?: string
    hover?: boolean
}

export function GlassCard({ children, className = '', hover = true }: GlassCardProps) {
    return (
        <div
            className={`
        bg-white rounded-2xl border border-slate-200/80 shadow-sm
        ${hover ? 'hover:shadow-md hover:border-slate-300/80 transition-all duration-300' : ''}
        ${className}
      `}
        >
            {children}
        </div>
    )
}

// Modern Input Component
interface PremiumInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    icon?: React.ReactNode
    required?: boolean
}

export function PremiumInput({ label, icon, required, className = '', ...props }: PremiumInputProps) {
    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    {icon && <span className="text-blue-500">{icon}</span>}
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                className={`
          w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl
          text-slate-900 placeholder-slate-400 outline-none
          focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white
          transition-all duration-200
          ${className}
        `}
                {...props}
            />
        </div>
    )
}

// AI Action Button
interface AIButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean
    variant?: 'primary' | 'secondary'
}

export function AIButton({
    children,
    isLoading,
    disabled,
    variant = 'primary',
    className = '',
    ...props
}: AIButtonProps) {
    const baseStyles = `
    flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium
    transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
  `

    const variants = {
        primary: `
      bg-gradient-to-r from-blue-600 to-indigo-600 text-white
      hover:from-blue-700 hover:to-indigo-700
      shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30
    `,
        secondary: `
      bg-slate-100 text-slate-700 border border-slate-200
      hover:bg-slate-200 hover:border-slate-300
    `,
    }

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {children}
        </button>
    )
}

// Navigation Buttons
interface FormNavigationProps {
    onBack?: () => void
    onNext?: () => void
    backLabel?: string
    nextLabel?: string
    showBack?: boolean
    showNext?: boolean
}

export function FormNavigation({
    onBack,
    onNext,
    backLabel = 'Back',
    nextLabel = 'Continue',
    showBack = true,
    showNext = true,
}: FormNavigationProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8">
            {showBack && onBack ? (
                <button
                    onClick={onBack}
                    className="w-full sm:w-auto px-8 py-3 border-2 border-slate-200 rounded-full text-slate-600 font-semibold
            hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {backLabel}
                </button>
            ) : (
                <div />
            )}
            {showNext && onNext && (
                <button
                    onClick={onNext}
                    className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold
            hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25
            hover:shadow-xl hover:shadow-blue-500/30 flex items-center justify-center gap-2"
                >
                    {nextLabel}
                    <ArrowRight className="w-4 h-4" />
                </button>
            )}
        </div>
    )
}
