import React, { useState } from 'react'
import toast from 'react-hot-toast'

const feedbackTypes = [
  { value: 'bug', label: 'Bug Report' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'improvement', label: 'Improvement Suggestion' },
  { value: 'general', label: 'General Feedback' },
  { value: 'other', label: 'Other' },
]

export const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    type: '',
    subject: '',
    message: '',
    rating: 5,
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const getBackendUrl = () => {
    const origin = window.location.origin
    if (origin.includes('eduniaa.com') || origin.includes('vercel.app')) {
      return 'https://eduniaa.onrender.com'
    }
    return 'http://localhost:5000'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`${getBackendUrl()}/api/feedback/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Anonymous',
          email: 'feedback@eduniaa.com',
          rating: formData.rating,
          category: formData.type,
          message: `${formData.subject}: ${formData.message}`,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data?.error || 'Submission failed')
      }

      toast.success('Thank you for your feedback!')
      setFormData({ type: '', subject: '', message: '', rating: 5 })
    } catch (err) {
      console.error(err)
      toast.error('Failed to submit feedback. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-[20px] border border-[rgba(76,76,76,0.15)] p-4 sm:p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Feedback Type */}
        <div className="flex flex-col gap-2">
          <label className="text-[#1A0404] text-xs font-medium">
            Feedback Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className={`h-[40px] px-4 rounded-lg border border-[#DADADA] bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0F0C89]
              ${formData.type ? 'text-[#1A0404]' : 'text-[#B0B0B0]'}`}
          >
            <option value="" disabled>
              Select feedback type
            </option>
            {feedbackTypes.map((t) => (
              <option key={t.value} value={t.value} className="text-[#1A0404]">
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div className="flex flex-col gap-2">
          <label className="text-[#1A0404] text-xs font-medium">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            placeholder="Brief description of your feedback"
            className="h-[40px] px-4 rounded-lg border border-[#DADADA] bg-white text-xs font-medium placeholder:text-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-[#0F0C89]"
          />
        </div>

        {/* Rating */}
        <div className="flex flex-col gap-2">
          <label className="text-[#1A0404] text-xs font-medium">
            Overall Rating
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, rating: star }))
                }
                className={`text-2xl transition-transform hover:scale-110
                  ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                aria-label={`Rate ${star}`}
              >
                ★
              </button>
            ))}
            <span className="ml-2 text-xs text-gray-600">
              ({formData.rating}/5)
            </span>
          </div>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-2">
          <label className="text-[#1A0404] text-xs font-medium">
            Your Feedback
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Please share your detailed feedback..."
            className="px-4 py-3 rounded-lg border border-[#DADADA] bg-white text-xs font-medium placeholder:text-[#B0B0B0] resize-none focus:outline-none focus:ring-2 focus:ring-[#0F0C89]"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-[48px] rounded-lg bg-[#0F0C89] hover:bg-[#0D0A70] transition disabled:opacity-50"
        >
          <span className="text-white text-lg font-medium">
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </span>
        </button>
      </form>
    </div>
  )
}