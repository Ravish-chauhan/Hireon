import React from 'react'

interface TestimonialCardProps {
  name: string
  role: string
  testimonial: string
  image: string
  rating?: number
}

export const TestimonialCard = ({
  name,
  role,
  testimonial,
  image,
  rating = 5,
}: TestimonialCardProps) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg shadow-md border-2 border-blue-300 flex flex-col">
      <div className="flex items-center mb-4">
        <img
          src={image}
          alt={name}
          className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-orange-300"
        />
        <div>
          <h4 className="font-semibold text-gray-800">{name}</h4>
          <p className="text-sm text-gray-600">{role}</p>
        </div>
      </div>
      <div className="mb-3 flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${i < rating ? 'text-orange-500' : 'text-gray-300'}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-gray-700 italic">"{testimonial}"</p>
    </div>
  )
}