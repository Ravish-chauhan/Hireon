import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FaUser, FaPhone, FaMapMarkerAlt, FaCalendar, FaCamera } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

interface BasicInfoFormProps {
  profileData: any;
  onUpdate: () => void;
  onNext: () => void;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ profileData, onUpdate, onNext }) => {
  const { refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    dob: '',
    gender: '',
    city: '',
    state: '',
    country: 'India'
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('BasicInfoForm received profileData:', profileData);
    console.log('Profile picture in data:', profileData?.profilePicture);
    if (profileData?.profile) {
      const newFormData = {
        fullName: profileData.profile.fullName || '',
        phone: profileData.profile.phone || '',
        dob: profileData.profile.dob ? new Date(profileData.profile.dob).toISOString().split('T')[0] : '',
        gender: profileData.profile.gender || '',
        city: profileData.profile.location?.city || '',
        state: profileData.profile.location?.state || '',
        country: profileData.profile.location?.country || 'India'
      };
      console.log('Setting form data:', newFormData);
      setFormData(newFormData);
    }
    if (profileData?.profilePicture?.url) {
      setProfilePicturePreview(profileData.profilePicture.url);
    }
  }, [profileData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('profileImage', file);
    
    const response = await api.post('/users/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data.data.profilePicture.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let profilePictureUrl = profileData?.profilePicture?.url || '';
      
      // Upload profile picture if changed
      if (profilePicture) {
        try {
          profilePictureUrl = await uploadToCloudinary(profilePicture);
          console.log('Profile picture uploaded:', profilePictureUrl);
        } catch (uploadError) {
          console.error('Cloudinary upload failed:', uploadError);
          toast.error('Profile picture upload failed, but other data will be saved');
        }
      }

      const updateData = {
        profile: {
          fullName: formData.fullName,
          phone: formData.phone,
          dob: formData.dob,
          gender: formData.gender,
          location: {
            city: formData.city,
            state: formData.state,
            country: formData.country
          }
        },
        ...(profilePictureUrl && {
          profilePicture: {
            url: profilePictureUrl
          }
        })
      };

      console.log('Sending data:', updateData);
      const response = await api.put('/users/profile', updateData);
      console.log('Profile update response:', response);
      console.log('Response data:', response.data);
      toast.success('Basic information updated successfully!');
      await refreshUser(); // Refresh user data in AuthContext
      await onUpdate(); // Refetch profile data first
      onNext();
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update basic information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* Profile Picture */}
      <div className="flex justify-center mb-6 sm:mb-8">
        <div className="relative">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
            {profilePicturePreview ? (
              <img 
                src={profilePicturePreview} 
                alt="Profile Preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUser className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
            )}
          </div>
          <label className="absolute bottom-0 right-0 bg-[#FF8855] text-white p-1.5 sm:p-2 rounded-full cursor-pointer hover:bg-[#e6794d] transition-colors">
            <FaCamera className="w-3 h-3 sm:w-4 sm:h-4" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* Full Name */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            <FaUser className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Full Name *
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8855] focus:border-transparent text-sm sm:text-base"
            placeholder="Enter your full name"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            <FaPhone className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8855] focus:border-transparent text-sm sm:text-base"
            placeholder="Enter 10-digit phone number"
            required
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            <FaCalendar className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Date of Birth
          </label>
          <input
            type="date"
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8855] focus:border-transparent text-sm sm:text-base"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Gender
          </label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8855] focus:border-transparent text-sm sm:text-base"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* City */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            <FaMapMarkerAlt className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            City *
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8855] focus:border-transparent text-sm sm:text-base"
            placeholder="Enter your city"
            required
          />
        </div>

        {/* State */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            State *
          </label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8855] focus:border-transparent text-sm sm:text-base"
            placeholder="Enter your state"
            required
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 sm:px-8 sm:py-3 bg-[#FF8855] text-white rounded-lg hover:bg-[#e6794d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {loading ? 'Saving...' : 'Save & Continue'}
        </button>
      </div>
    </form>
  );
};

export default BasicInfoForm;