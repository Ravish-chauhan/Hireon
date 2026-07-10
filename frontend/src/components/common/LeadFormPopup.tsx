import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { LeadForm } from '../ui/LeadForm'
import { FaTimes } from 'react-icons/fa'

interface LeadFormPopupProps {
  isContactTriggered?: boolean
  onContactClose?: () => void
}

export const LeadFormPopup: React.FC<LeadFormPopupProps> = ({ 
  isContactTriggered = false, 
  onContactClose 
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // Show popup if triggered by contact click
    if (isContactTriggered) {
      setIsVisible(true)
      return
    }

    // Only show popup on homepage with timer
    if (location.pathname === '/') {
      const popupDismissed = localStorage.getItem('leadPopupDismissed')
      
      if (!popupDismissed) {
        const timer = setTimeout(() => {
          setIsVisible(true)
        }, 3000)

        return () => clearTimeout(timer)
      }
    }
  }, [location.pathname, isContactTriggered])

  const closePopup = () => {
    setIsVisible(false)
    if (isContactTriggered && onContactClose) {
      onContactClose()
    } else {
      localStorage.setItem('leadPopupDismissed', 'true')
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closePopup()
    }
  }

  // Clear dismissal on page refresh (only for homepage popup)
  useEffect(() => {
    if (!isContactTriggered) {
      const handleBeforeUnload = () => {
        localStorage.removeItem('leadPopupDismissed')
      }
      
      window.addEventListener('beforeunload', handleBeforeUnload)
      return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isContactTriggered])

  // Show popup if contact triggered OR (on homepage and visible)
  if (isContactTriggered) {
    return isVisible ? (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 overflow-hidden"
        onClick={handleOverlayClick}
      >
        <div className="relative w-full sm:w-auto sm:max-w-md md:max-w-lg">
          {/* Rotated Background - Hidden on mobile */}
          <div
            className="absolute left-0 top-0 w-full h-full rounded-t-[20px] sm:rounded-[20px] bg-[rgba(237,235,250,0.52)] hidden sm:block"
            style={{ transform: 'rotate(2deg)' }}
          ></div>

          {/* Main Content */}
          <div className="relative bg-white rounded-t-[20px] sm:rounded-[20px] border-t border-l border-r sm:border border-[rgba(76,76,76,0.15)] p-4 sm:p-6 shadow-2xl max-h-[80vh] sm:max-h-[90vh] overflow-y-auto scrollbar-hide">
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-10"
            >
              <FaTimes size={18} />
            </button>

            {/* Header */}
            <div className="mb-4 pr-8">
              <h2 className="text-lg sm:text-xl font-bold text-[#0F0C89] mb-2">
                Connect With Us!
              </h2>
              <p className="text-gray-600 text-sm">
                Get personalized guidance from our education experts.
              </p>
            </div>

            {/* Form */}
            <div className="[&>div]:!bg-transparent [&>div]:!border-0 [&>div]:!p-0 [&>div]:!shadow-none">
              <LeadForm />
            </div>
          </div>
        </div>
      </div>
    ) : null
  }

  // Homepage popup logic
  if (location.pathname !== '/' || !isVisible) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 overflow-hidden"
      onClick={handleOverlayClick}
    >
      <div className="relative w-full sm:w-auto sm:max-w-md md:max-w-lg">
        {/* Rotated Background - Hidden on mobile */}
        <div
          className="absolute left-0 top-0 w-full h-full rounded-t-[20px] sm:rounded-[20px] bg-[rgba(237,235,250,0.52)] hidden sm:block"
          style={{ transform: 'rotate(2deg)' }}
        ></div>

        {/* Main Content */}
        <div className="relative bg-white rounded-t-[20px] sm:rounded-[20px] border-t border-l border-r sm:border border-[rgba(76,76,76,0.15)] p-4 sm:p-6 shadow-2xl max-h-[80vh] sm:max-h-[90vh] overflow-y-auto scrollbar-hide">
          {/* Close Button */}
          <button
            onClick={closePopup}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-10"
          >
            <FaTimes size={18} />
          </button>

          {/* Header */}
          <div className="mb-4 pr-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#0F0C89] mb-2">
              Connect With Us!
            </h2>
            <p className="text-gray-600 text-sm">
              Get personalized guidance from our education experts.
            </p>
          </div>

          {/* Form */}
          <div className="[&>div]:!bg-transparent [&>div]:!border-0 [&>div]:!p-0 [&>div]:!shadow-none">
            <LeadForm />
          </div>
        </div>
      </div>
    </div>
  )
}