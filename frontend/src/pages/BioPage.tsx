import React, { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Globe, Plus, Trash2, CheckCircle } from 'lucide-react'
import { useResumeFormNav } from './ResumeForm'
import { PhotoUpload } from '../components/PhotoUpload'
import { useResume } from '../context/ResumeContext'
import { FormPageLayout, GlassCard, FormNavigation } from '../components/resume/FormPageLayout'

const socialOptions = ['LinkedIn', 'GitHub', 'Portfolio', 'Twitter', 'Other']

export function BioPage() {
  const { handleNext, handleBack, navigateTo } = useResumeFormNav()
  const { resumeData, updateBio, setResumeData } = useResume()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const [firstName, setFirstName] = useState(resumeData.bio.firstName || '')
  const [surname, setSurname] = useState(resumeData.bio.surname || '')
  const [email, setEmail] = useState(resumeData.bio.email || '')
  const [phone, setPhone] = useState(resumeData.bio.phone || '')
  const [city, setCity] = useState(resumeData.bio.city || '')
  const [country, setCountry] = useState(resumeData.bio.country || '')
  const [photo, setPhoto] = useState<string | null>(resumeData.bio.image || null)
  const [socialLinks, setSocialLinks] = useState<{id: string; platform: string; url: string}[]>(() => {
    if (resumeData.bio.socialLinks && resumeData.bio.socialLinks.length > 0) {
      return resumeData.bio.socialLinks;
    }
    const initialLinks = [];
    if (resumeData.bio.linkedin) initialLinks.push({ id: `link-${Date.now()}-1`, platform: 'LinkedIn', url: resumeData.bio.linkedin });
    if (resumeData.bio.github) initialLinks.push({ id: `link-${Date.now()}-2`, platform: 'GitHub', url: resumeData.bio.github });
    if (resumeData.bio.website) initialLinks.push({ id: `link-${Date.now()}-3`, platform: 'Portfolio', url: resumeData.bio.website });
    return initialLinks;
  })
  const [socialLinksFormat, setSocialLinksFormat] = useState<'name' | 'url'>(resumeData.bio.socialLinksFormat || 'name')

  useEffect(() => {
    updateBio({
      firstName,
      surname,
      email,
      phone,
      city,
      country,
      image: photo || undefined,
      linkedin: socialLinks.find(l => l.platform === 'LinkedIn')?.url,
      github: socialLinks.find(l => l.platform === 'GitHub')?.url,
      website: socialLinks.find(l => l.platform === 'Portfolio' || l.platform === 'Website')?.url,
      socialLinks: socialLinks,
      socialLinksFormat: socialLinksFormat
    })
  }, [firstName, surname, email, phone, city, country, photo, socialLinks, socialLinksFormat, updateBio])

  // Calculate completion percentage
  const filledFields = [firstName, surname, email, phone, city, country].filter(Boolean).length
  const completionPercent = Math.round((filledFields / 6) * 100)

  const inputClasses = `w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl
    text-slate-900 placeholder-slate-400 outline-none
    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadError(null)

    const formData = new FormData()
    formData.append('resume', file)

    try {
      const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://api.eduniaa.com/api';
      const response = await fetch(`${apiUrl}/ai/parse-resume`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to parse resume')
      }

      const data = await response.json()
      if (data.success && data.data) {
        const parsed = data.data;
        setResumeData((prev) => ({ ...prev, ...parsed }))
        
        if (parsed.bio) {
          setFirstName(parsed.bio.firstName || '')
          setSurname(parsed.bio.surname || '')
          setEmail(parsed.bio.email || '')
          setPhone(parsed.bio.phone || '')
          setCity(parsed.bio.city || '')
          setCountry(parsed.bio.country || '')
          if (parsed.bio.socialLinks) {
            setSocialLinks(parsed.bio.socialLinks)
          }
        }
      } else {
        throw new Error(data.error || 'Parsing failed')
      }
    } catch (error: any) {
      setUploadError(error.message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <FormPageLayout
      currentStep={1}
      totalSteps={7}
      stepName="Bio"
      title="Personal Information"
      subtitle="Let's start with your basic details. This helps recruiters know how to reach you."
      onNavigate={navigateTo}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Import Resume Section */}
        <GlassCard className="p-6 md:p-8 bg-blue-50/50 border-blue-100" hover={false}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                Fast-track your resume! 🚀
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Upload your existing resume (PDF) and we'll automatically fill out the builder for you.
              </p>
            </div>
            <div className="flex-shrink-0 relative">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <button
                type="button"
                disabled={isUploading}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Parsing...
                  </>
                ) : (
                  'Upload PDF'
                )}
              </button>
            </div>
          </div>
          {uploadError && (
            <p className="mt-3 text-sm text-red-500 font-medium bg-red-50 p-3 rounded-lg border border-red-100">
              {uploadError}
            </p>
          )}
        </GlassCard>

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
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500" />
                Social & Portfolio Links
              </label>
              <button
                type="button"
                onClick={() => setSocialLinks([...socialLinks, { id: `link-${Date.now()}`, platform: 'LinkedIn', url: '' }])}
                className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Link
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-sm font-medium text-slate-700">Display links as:</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={socialLinksFormat === 'name'}
                  onChange={() => setSocialLinksFormat('name')}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-slate-600">Platform Name (e.g. LinkedIn)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={socialLinksFormat === 'url'}
                  onChange={() => setSocialLinksFormat('url')}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-slate-600">Full URL (e.g. linkedin.com/in/you)</span>
              </label>
            </div>

            <div className="space-y-4">
              {socialLinks.map((link, index) => (
                <div key={link.id} className="flex gap-3 items-start">
                  <div className="w-1/3">
                    <select
                      value={link.platform}
                      onChange={(e) => {
                        const newLinks = [...socialLinks];
                        newLinks[index].platform = e.target.value;
                        setSocialLinks(newLinks);
                      }}
                      className={inputClasses}
                    >
                      {socialOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...socialLinks];
                        newLinks[index].url = e.target.value;
                        setSocialLinks(newLinks);
                      }}
                      placeholder="https://"
                      className={inputClasses}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newLinks = socialLinks.filter(l => l.id !== link.id);
                      setSocialLinks(newLinks);
                    }}
                    className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors mt-0.5"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {socialLinks.length === 0 && (
                <div className="text-center py-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                  <p className="text-sm text-slate-500">No social links added yet.</p>
                </div>
              )}
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