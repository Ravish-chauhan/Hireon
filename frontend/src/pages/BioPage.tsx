import React, { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Globe, Plus, Trash2, CheckCircle } from 'lucide-react'
import { useResumeFormNav } from './ResumeForm'
import { PhotoUpload } from '../components/PhotoUpload'
import { useResume } from '../context/ResumeContext'
import { FormPageLayout, GlassCard, FormNavigation } from '../components/resume/FormPageLayout'

const socialOptions = ['LinkedIn', 'GitHub', 'Portfolio', 'Twitter', 'Other']

export function BioPage() {
  const { handleNext, handleBack, navigateTo } = useResumeFormNav()
  const { resumeData, updateBio } = useResume()

  const [firstName, setFirstName] = useState(resumeData.bio.firstName || '')
  const [surname, setSurname] = useState(resumeData.bio.surname || '')
  const [email, setEmail] = useState(resumeData.bio.email || '')
  const [phone, setPhone] = useState(resumeData.bio.phone || '')
  const [city, setCity] = useState(resumeData.bio.city || '')
  const [country, setCountry] = useState(resumeData.bio.country || '')
  const [photo, setPhoto] = useState<string | null>(resumeData.bio.image || null)
  const [linkedin, setLinkedin] = useState(resumeData.bio.linkedin || '')
  const [github, setGithub] = useState(resumeData.bio.github || '')
  const [website, setWebsite] = useState(resumeData.bio.website || '')

  useEffect(() => {
    updateBio({
      firstName,
      surname,
      email,
      phone,
      city,
      country,
      image: photo || undefined,
      linkedin: linkedin || undefined,
      github: github || undefined,
      website: website || undefined
    })
  }, [firstName, surname, email, phone, city, country, photo, linkedin, github, website, updateBio])

  // Calculate completion percentage
  const filledFields = [firstName, surname, email, phone, city, country].filter(Boolean).length
  const completionPercent = Math.round((filledFields / 6) * 100)

  const inputClasses = `w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl
    text-slate-900 placeholder-slate-400 outline-none
    focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white
    transition-all duration-200`

  return (
    <FormPageLayout
      currentStep={1}
      totalSteps={7}
      stepName="Bio"
      title="Personal Information"
      subtitle="Let's start with your basic details. This helps recruiters know how to reach you."
      onNavigate={navigateTo}
    >
      <div className="max-w-3xl mx-auto">
        <GlassCard className="p-6 md:p-8" hover={false}>
          {/* Photo & Name Section */}
          <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
            <div className="flex-shrink-0">
              <PhotoUpload />
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    placeholder="Doe"
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" />
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-500" />
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className={inputClasses}
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="New York"
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="USA"
                className={inputClasses}
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="border-t border-slate-100 pt-6">
            <label className="block text-sm font-medium text-slate-700 mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              Social & Portfolio Links
            </label>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">LinkedIn</label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/johndoe"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">GitHub</label>
                <input
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/johndoe"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Portfolio/Website</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://johndoe.com"
                  className={inputClasses}
                />
              </div>
            </div>
          </div>

          {/* Completion Indicator */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-sm flex items-center gap-2">
                {completionPercent === 100 && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                Profile Completion
              </span>
              <span className={`text-sm font-semibold ${completionPercent === 100 ? 'text-emerald-500' : 'text-blue-600'}`}>
                {completionPercent}%
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${completionPercent === 100
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                  }`}
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>
        </GlassCard>

        <FormNavigation
          onBack={handleBack}
          onNext={handleNext}
          showBack={false}
        />
      </div>
    </FormPageLayout>
  )
}