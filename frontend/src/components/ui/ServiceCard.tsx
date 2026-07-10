import React from 'react'

interface ServiceCardProps {
  title: string
  description: string
  icon: React.ReactNode
  className?: string
}

export const ServiceCard = ({
  title,
  description,
  icon,
  className = '',
}: ServiceCardProps) => {
  return (
    <div
      className={`bg-white p-4 lg:p-6 rounded-lg shadow-md border border-cream-200 transition-transform hover:-translate-y-1 hover:shadow-lg ${className}`}
    >
      <div className="bg-cream-100 p-2 lg:p-3 rounded-lg inline-block mb-3 lg:mb-4 text-brand-600">
        {icon}
      </div>
      <h3 className="text-lg lg:text-xl font-semibold mb-2 lg:mb-3 text-gray-800">{title}</h3>
      <p className="text-sm lg:text-base text-gray-600">{description}</p>
    </div>
  )
}