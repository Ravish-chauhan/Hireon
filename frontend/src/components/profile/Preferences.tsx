import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface PreferencesProps {
  profileData: any;
  onUpdate: () => void;
}

const Preferences: React.FC<PreferencesProps> = ({ profileData, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      programInterests: profileData?.preferences?.programInterests || [],
      preferredLocations: profileData?.preferences?.preferredLocations || [],
      budgetRange: profileData?.preferences?.budgetRange || '',
      careerGoals: profileData?.preferences?.careerGoals || '',
      specializations: profileData?.preferences?.specializations || []
    }
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      // Convert comma-separated strings to arrays
      const formattedData = {
        ...data,
        programInterests: typeof data.programInterests === 'string' 
          ? data.programInterests.split(',').map((s: string) => s.trim()).filter(Boolean)
          : data.programInterests,
        preferredLocations: typeof data.preferredLocations === 'string'
          ? data.preferredLocations.split(',').map((s: string) => s.trim()).filter(Boolean)
          : data.preferredLocations,
        specializations: typeof data.specializations === 'string'
          ? data.specializations.split(',').map((s: string) => s.trim()).filter(Boolean)
          : data.specializations
      };

      await api.put('/users/preferences', formattedData);
      toast.success('Preferences updated successfully!');
      onUpdate();
    } catch (error: any) {
      toast.error(error.error || 'Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Program Interests</label>
          <input
            type="text"
            {...register('programInterests')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8855]"
            placeholder="MBA, Engineering, Medicine, Law (comma separated)"
          />
          <p className="text-xs text-gray-500 mt-1">Enter programs you're interested in, separated by commas</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Locations</label>
          <input
            type="text"
            {...register('preferredLocations')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8855]"
            placeholder="Delhi, Mumbai, Bangalore, International (comma separated)"
          />
          <p className="text-xs text-gray-500 mt-1">Cities or regions where you'd like to study</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
          <select
            {...register('budgetRange')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8855]"
          >
            <option value="">Select Budget Range</option>
            <option value="0-5L">₹0 - ₹5 Lakhs</option>
            <option value="5-10L">₹5 - ₹10 Lakhs</option>
            <option value="10-20L">₹10 - ₹20 Lakhs</option>
            <option value="20-50L">₹20 - ₹50 Lakhs</option>
            <option value="50L+">₹50 Lakhs+</option>
            <option value="no-limit">No Budget Limit</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Specializations</label>
          <input
            type="text"
            {...register('specializations')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8855]"
            placeholder="Finance, Marketing, Computer Science, Data Science (comma separated)"
          />
          <p className="text-xs text-gray-500 mt-1">Specific areas of interest within your chosen program</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Career Goals</label>
          <textarea
            {...register('careerGoals')}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8855]"
            placeholder="Describe your career aspirations and what you hope to achieve..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FF8855] text-white py-3 rounded-lg font-semibold hover:bg-[#e6794d] transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Preferences'}
        </button>
      </form>

      {/* Current Preferences Display */}
      {profileData?.preferences && (
        <div className="bg-gray-50 rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4 text-[#0B2447]">Current Preferences</h3>
          
          {profileData.preferences.programInterests?.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Program Interests:</h4>
              <div className="flex flex-wrap gap-2">
                {profileData.preferences.programInterests.map((program: string, index: number) => (
                  <span key={index} className="bg-[#FF8855] text-white px-3 py-1 rounded-full text-sm">
                    {program}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profileData.preferences.preferredLocations?.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Preferred Locations:</h4>
              <div className="flex flex-wrap gap-2">
                {profileData.preferences.preferredLocations.map((location: string, index: number) => (
                  <span key={index} className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                    {location}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profileData.preferences.budgetRange && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Budget Range:</h4>
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                {profileData.preferences.budgetRange}
              </span>
            </div>
          )}

          {profileData.preferences.specializations?.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Specializations:</h4>
              <div className="flex flex-wrap gap-2">
                {profileData.preferences.specializations.map((spec: string, index: number) => (
                  <span key={index} className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profileData.preferences.careerGoals && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Career Goals:</h4>
              <p className="text-gray-600 bg-white p-3 rounded border">
                {profileData.preferences.careerGoals}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Preferences;