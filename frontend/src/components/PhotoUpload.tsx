import React, { useState, useEffect } from 'react'
import { UserIcon, PencilIcon } from 'lucide-react'
import { useResume } from '../context/ResumeContext'

export function PhotoUpload() {
  const { resumeData, updateBio } = useResume()
  const [photo, setPhoto] = useState<string | null>(resumeData.bio.image || null)

  useEffect(() => {
    setPhoto(resumeData.bio.image || null)
  }, [resumeData.bio.image])

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setPhoto(imageUrl)
        updateBio({ ...resumeData.bio, image: imageUrl })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-32 h-32 bg-[#DCE6F9] border-2 border-[#4169FF] rounded-lg flex items-center justify-center overflow-hidden">
        {photo ? (
          <img src={photo} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <UserIcon className="w-16 h-16 text-white" fill="currentColor" />
        )}
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-[#4169FF] font-medium hover:underline cursor-pointer">
          <PencilIcon className="w-3 h-3" />
          <span className="text-sm">{photo ? 'Change photo' : 'Upload photo'}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </label>
        {photo && (
          <button 
            type="button"
            onClick={() => {
              setPhoto(null)
              updateBio({ ...resumeData.bio, image: undefined })
            }}
            className="flex items-center gap-2 text-red-500 font-medium hover:underline cursor-pointer"
          >
            <span className="text-sm">Remove</span>
          </button>
        )}
      </div>
    </div>
  )
}