import React, { useState } from 'react'
import {
  PhoneIcon,
  CalendarIcon,
  ClockIcon,
  MessageSquareIcon,
  RocketIcon,
  Sparkles,
} from 'lucide-react'

interface ConsultationFormProps {
  onSubmit: (data: {
    phoneNumber: string
    startDate: string
    selectedTime: string
    notes: string
  }) => void
  loading?: boolean
}

export const ConsultationForm: React.FC<ConsultationFormProps> = ({ onSubmit, loading }) => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [startDate, setStartDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [notes, setNotes] = useState('')

  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM',
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      phoneNumber,
      startDate,
      selectedTime,
      notes,
    })
  }

  return (
    <div className="relative">
      {/* Background Glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-[#0066FF]/5 to-[#0F0C89]/5 rounded-3xl blur-xl opacity-50" />

      <form
        onSubmit={handleSubmit}
        className="relative bg-white rounded-2xl p-6 sm:p-8 md:p-10 border border-gray-200 shadow-lg"
      >
        {/* Form Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 mb-4">
            <Sparkles className="w-4 h-4 text-[#0066FF]" />
            <span className="text-gray-700 text-sm font-medium">Book Your Session</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Schedule Consultation</h3>
          <p className="text-gray-500 text-sm">Fill in your details and we'll confirm your booking</p>
        </div>

        <div className="space-y-6">
          {/* Phone Number */}
          <div>
            <label className="flex items-center text-sm font-semibold mb-3 text-gray-700">
              <PhoneIcon className="w-4 h-4 mr-2 text-[#0066FF]" />
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition-all"
              placeholder="Enter your 10-digit phone number"
              required
            />
          </div>

          {/* Preferred Date */}
          <div>
            <label className="flex items-center text-sm font-semibold mb-3 text-gray-700">
              <CalendarIcon className="w-4 h-4 mr-2 text-[#0066FF]" />
              Preferred Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition-all"
              required
            />
          </div>

          {/* Time Slots Grid */}
          <div>
            <label className="flex items-center text-sm font-semibold mb-3 text-gray-700">
              <ClockIcon className="w-4 h-4 mr-2 text-[#0066FF]" />
              Preferred Time
            </label>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={`px-3 py-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${selectedTime === time
                    ? 'bg-gradient-to-r from-[#0066FF] to-[#0F0C89] text-white shadow-lg shadow-blue-500/30'
                    : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300'
                    }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="flex items-center text-sm font-semibold mb-3 text-gray-700">
              <MessageSquareIcon className="w-4 h-4 mr-2 text-[#0066FF]" />
              Additional Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition-all min-h-[120px] resize-none"
              placeholder="Share any specific questions or concerns you'd like to discuss..."
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || !phoneNumber || !startDate || !selectedTime}
              className="w-full group relative px-8 py-4 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#0F0C89] text-white font-bold text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <span className="flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    <RocketIcon className="w-5 h-5 group-hover:animate-bounce" />
                    Book Consultation
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}