import React, { useState } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const careerOptions = [
  {
    value: 'medical',
    label: 'Medical',
  },
  {
    value: 'engineering',
    label: 'Engineering',
  },
  {
    value: 'mba',
    label: 'MBA',
  },
  {
    value: 'clat',
    label: 'CLAT',
  },
  {
    value: 'other',
    label: 'Other',
  },
]

export const LeadForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    career: '',
    message: '',
  })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Map career values to match backend expectations
      const careerMapping = {
        'medical': 'Medical',
        'engineering': 'Engineering', 
        'mba': 'MBA',
        'clat': 'Other',
        'other': 'Other'
      }
      
      const heroFormData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        careerInterest: careerMapping[formData.career as keyof typeof careerMapping] || 'Other',
        message: formData.message || '',
        date: 'Not specified',
        time: 'Not specified'
      }
      
      const response = await api.post('/hero-form', heroFormData)
      
      if (response.data.success) {
        window.location.href = '/review-booked'
      }
    } catch (error: any) {
      console.error('Form submission error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Something went wrong. Please try again.'
      toast.error(errorMessage)
    }
  }

  return (
    <div className="bg-white rounded-[20px] border border-[rgba(76,76,76,0.15)] p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Full Name */}
        <div className="flex flex-col gap-2">
          <label className="text-[#1A0404] text-xs font-medium leading-[140%] tracking-[-0.12px]">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Name *"
            className="h-[33px] px-[15px] py-[14px] rounded-lg border border-[#DADADA] bg-white text-xs font-medium leading-[140%] tracking-[-0.12px] placeholder:text-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-[#0F0C89] focus:border-transparent"
          />
        </div>

        {/* Email Address */}
        <div className="flex flex-col gap-2">
          <label className="text-[#1A0404] text-xs font-medium leading-[140%] tracking-[-0.12px]">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="You@example.com"
            className="h-[33px] px-[15px] py-[14px] rounded-lg border border-[#DADADA] bg-white text-xs font-medium leading-[140%] tracking-[-0.12px] placeholder:text-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-[#0F0C89] focus:border-transparent"
          />
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-2">
          <label className="text-[#1A0404] text-xs font-medium leading-[140%] tracking-[-0.12px]">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Your Phone Number"
            className="h-[33px] px-[15px] py-[14px] rounded-lg border border-[#DADADA] bg-white text-xs font-medium leading-[140%] tracking-[-0.12px] placeholder:text-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-[#0F0C89] focus:border-transparent"
          />
        </div>

        {/* Interested Career Path */}
        <div className="flex flex-col gap-2">
          <label className="text-[#1A0404] text-xs font-medium leading-[140%] tracking-[-0.12px]">
            Interested Career Path
          </label>
          <select
  name="career"
  value={formData.career}
  onChange={handleChange}
  required
  style={{ color: formData.career ? '#1A0404' : '#B0B0B0' }}
  className="h-[33px] px-[15px] rounded-lg border border-[#DADADA] bg-white text-xs font-medium leading-[140%] tracking-[-0.12px] focus:outline-none focus:ring-2 focus:ring-[#0F0C89] focus:border-transparent"
>
  <option value="" disabled>
    Select Career Path
  </option>
  {careerOptions.map((option) => (
    <option key={option.value} value={option.value} className="text-[#1A0404]">
      {option.label}
    </option>
  ))}
</select>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-2">
          <label className="text-[#1A0404] text-xs font-medium leading-[140%] tracking-[-0.12px]">
            Message (Optional)
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={3}
            placeholder="Tell us about your educational goals"
            className="px-[15px] py-[14px] rounded-lg border border-[#DADADA] bg-white text-xs font-medium leading-[140%] tracking-[-0.12px] placeholder:text-[#B0B0B0] resize-none focus:outline-none focus:ring-2 focus:ring-[#0F0C89] focus:border-transparent"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full h-[49px] flex items-center justify-center rounded-lg bg-[#0F0C89] hover:bg-[#0D0A70] transition-colors"
        >
          <span className="text-white text-center text-lg font-medium leading-[125%]">
            Talk to an Expert
          </span>
        </button>
      </form>
    </div>
  )
}