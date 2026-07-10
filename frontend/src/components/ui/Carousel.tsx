import React, { useCallback, useEffect, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

interface CarouselProps {
  children: React.ReactNode[]
  autoPlay?: boolean
  interval?: number
  showArrows?: boolean
  showDots?: boolean
  className?: string
}

export const Carousel = ({
  children,
  autoPlay = true,
  interval = 5000,
  showArrows = true,
  showDots = true,
  className = '',
}: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % children.length)
  }, [children.length])

  const goToPrev = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + children.length) % children.length,
    )
  }, [children.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && !isHovering) {
      const timer = setTimeout(goToNext, interval)
      return () => clearTimeout(timer)
    }
  }, [autoPlay, currentIndex, goToNext, interval, isHovering])

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {children.map((child, index) => (
          <div key={index} className="w-full flex-shrink-0">
            {child}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2 shadow-md z-10 text-white"
            style={{ backgroundColor: 'rgba(15, 12, 137, 1)' }}
            aria-label="Previous slide"
          >
            <ChevronLeftIcon size={20} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 shadow-md z-10 text-white"
            style={{ backgroundColor: 'rgba(15, 12, 137, 1)' }}
            aria-label="Next slide"
          >
            <ChevronRightIcon size={20} />
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {children.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2.5 w-2.5 rounded-full transition-all ${index === currentIndex ? 'w-6' : 'bg-gray-300 hover:bg-gray-400'}`}
              style={{
                backgroundColor: index === currentIndex ? 'rgba(15, 12, 137, 1)' : undefined
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}