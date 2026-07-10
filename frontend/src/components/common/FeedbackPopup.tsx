import React from 'react'
import { FeedbackForm } from '../ui/FeedbackForm'
import { FaTimes } from 'react-icons/fa'

interface FeedbackPopupProps {
  isOpen: boolean
  onClose: () => void
}

export const FeedbackPopup: React.FC<FeedbackPopupProps> = ({ isOpen, onClose }) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 overflow-hidden"
      onClick={handleOverlayClick}
      style={{ pointerEvents: 'auto' }}
    >
      <div className="relative w-full sm:w-auto sm:max-w-md md:max-w-lg" onClick={(e) => e.stopPropagation()}>
        {/* Rotated Background - Hidden on mobile */}
        <div
          className="absolute left-0 top-0 w-full h-full rounded-t-[20px] sm:rounded-[20px] bg-[rgba(237,235,250,0.52)] hidden sm:block"
          style={{ transform: 'rotate(2deg)' }}
        ></div>

        {/* Main Content */}
        <div 
          className="relative bg-white rounded-t-[20px] sm:rounded-[20px] border-t border-l border-r sm:border border-[rgba(76,76,76,0.15)] p-4 sm:p-6 shadow-2xl max-h-[80vh] sm:max-h-[90vh] overflow-y-auto scrollbar-hide"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-10"
          >
            <FaTimes size={18} />
          </button>

          {/* Header */}
          <div className="mb-4 pr-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#0F0C89] mb-2">
              Share Your Feedback
            </h2>
            <p className="text-gray-600 text-sm">
              Help us improve by sharing your thoughts and suggestions.
            </p>
          </div>

          {/* Form */}
          <div className="[&>div]:!bg-transparent [&>div]:!border-0 [&>div]:!p-0 [&>div]:!shadow-none">
            <FeedbackForm />
          </div>
        </div>
      </div>
    </div>
  )
}