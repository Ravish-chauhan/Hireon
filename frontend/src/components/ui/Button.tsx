import React from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'orange'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  icon?: React.ReactNode
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  icon,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transform active:scale-95'

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base', 
    lg: 'px-8 py-4 text-lg'
  }

  const variants = {
    primary:
      'bg-gradient-to-r from-accent-500 to-orange-500 text-white hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5 focus:ring-orange-400',
    secondary:
      'bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg hover:-translate-y-0.5 focus:ring-gray-300',
    outline:
      'border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 hover:shadow-lg hover:-translate-y-0.5',
    ghost: 'text-blue-600 hover:bg-blue-50 hover:text-blue-700',
    orange:
      'bg-gradient-to-r from-[#FF8C42] to-[#FF7A2F] text-white hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 rounded-xl font-bold',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        icon && <span className="mr-2">{icon}</span>
      )}
      {children}
    </button>
  )
}