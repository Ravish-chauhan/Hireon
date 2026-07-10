import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface BasicInfoProps {
  profileData: any;
  onUpdate: () => void;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ profileData, onUpdate }) => {
  const { user, setUser } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      fullName: profileData?.profile?.fullName || '',
      dob: profileData?.profile?.dob || '',
      gender: profileData?.profile?.gender || '',
      city: profileData?.profile?.location?.city || '',
      state: profileData?.profile?.location?.state || '',
      country: profileData?.profile?.location?.country || 'India'
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await api.put('/users/profile', {
        fullName: data.fullName,
        dob: data.dob,
        gender: data.gender,
        location: {
          city: data.city,
          state: data.state,
          country: data.country
        }
      });
      toast.success('Profile updated successfully!');
      onUpdate();
    } catch (error: any) {
      toast.error(error.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('profileImage', file);

      const response = await api.post('/users/profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Update user in auth context with new profile picture
      if (user && response.data?.profilePicture) {
        setUser({
          ...user,
          profilePicture: response.data.profilePicture
        });
      }
      
      toast.success('Profile picture updated!');
      onUpdate();
    } catch (error: any) {
      toast.error(error.error || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {profileData?.profilePicture?.url ? (
              <img 
                src={profileData.profilePicture.url} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl text-gray-400">👤</span>
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-0 right-0 bg-[#FF8855] text-white p-2 rounded-full hover:bg-[#e6794d] transition-colors disabled:opacity-50"
          >
            {uploading ? '⏳' : '📷'}
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              {...register('fullName', { required: 'Full name is required' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8855]"
              placeholder="Enter your full name"
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message as string}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              {...register('dob')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8855]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select
              {...register('gender')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8855]"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              {...register('city')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8855]"
              placeholder="Enter your city"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <input
              type="text"
              {...register('state')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8855]"
              placeholder="Enter your state"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <input
              type="text"
              {...register('country')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8855]"
              placeholder="Enter your country"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FF8855] text-white py-3 rounded-lg font-semibold hover:bg-[#e6794d] transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Basic Info'}
        </button>
      </form>
    </div>
  );
};

export default BasicInfo;