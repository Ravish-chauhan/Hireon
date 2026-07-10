import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FaMapMarkerAlt, FaDollarSign, FaGraduationCap } from 'react-icons/fa';

interface PreferencesFormProps {
  profileData: any;
  onUpdate: () => void;
  onNext: () => void;
}

const PreferencesForm: React.FC<PreferencesFormProps> = ({ profileData, onUpdate, onNext }) => {
  const [preferences, setPreferences] = useState({
    preferredLocations: [] as string[],
    budgetMin: '',
    budgetMax: '',
    programInterests: [] as string[]
  });
  const [loading, setLoading] = useState(false);

  const locations = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
    'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
    'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad',
    'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik'
  ];

  const programs = [
    'Engineering', 'Medical', 'MBA', 'Law', 'Arts', 'Science',
    'Commerce', 'Computer Science', 'Information Technology',
    'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering',
    'Electronics Engineering', 'Chemical Engineering', 'Biotechnology',
    'Pharmacy', 'Nursing', 'Physiotherapy', 'Dentistry',
    'Management', 'Finance', 'Marketing', 'Human Resources',
    'Architecture', 'Design', 'Fashion Design', 'Interior Design',
    'Mass Communication', 'Journalism', 'Psychology', 'Social Work'
  ];

  useEffect(() => {
    if (profileData?.preferences) {
      setPreferences({
        preferredLocations: profileData.preferences.preferredLocations || [],
        budgetMin: profileData.preferences.budgetMin?.toString() || '',
        budgetMax: profileData.preferences.budgetMax?.toString() || '',
        programInterests: profileData.preferences.programInterests || []
      });
    }
  }, [profileData]);

  const toggleLocation = (location: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredLocations: prev.preferredLocations.includes(location)
        ? prev.preferredLocations.filter(l => l !== location)
        : [...prev.preferredLocations, location]
    }));
  };

  const toggleProgram = (program: string) => {
    setPreferences(prev => ({
      ...prev,
      programInterests: prev.programInterests.includes(program)
        ? prev.programInterests.filter(p => p !== program)
        : [...prev.programInterests, program]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const preferencesData = {
        preferredLocations: preferences.preferredLocations,
        budgetMin: preferences.budgetMin ? parseInt(preferences.budgetMin) : undefined,
        budgetMax: preferences.budgetMax ? parseInt(preferences.budgetMax) : undefined,
        programInterests: preferences.programInterests
      };

      await api.put('/users/profile', {
        preferences: preferencesData
      });

      toast.success('Preferences updated successfully!');
      onNext();
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Preferred Locations */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <FaMapMarkerAlt className="w-5 h-5 text-[#FF8855]" />
          <h3 className="text-lg font-semibold text-gray-800">Preferred Locations</h3>
        </div>
        <p className="text-gray-600 mb-4">Select cities where you'd like to study (select multiple)</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {locations.map(location => (
            <button
              key={location}
              type="button"
              onClick={() => toggleLocation(location)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                preferences.preferredLocations.includes(location)
                  ? 'bg-[#FF8855] text-white border-[#FF8855]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[#FF8855]'
              }`}
            >
              {location}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Range */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <FaDollarSign className="w-5 h-5 text-[#FF8855]" />
          <h3 className="text-lg font-semibold text-gray-800">Budget Range (Annual Fees)</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Budget (₹)
            </label>
            <input
              type="number"
              value={preferences.budgetMin}
              onChange={(e) => setPreferences({ ...preferences, budgetMin: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8855] focus:border-transparent"
              placeholder="e.g., 50000"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Budget (₹)
            </label>
            <input
              type="number"
              value={preferences.budgetMax}
              onChange={(e) => setPreferences({ ...preferences, budgetMax: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8855] focus:border-transparent"
              placeholder="e.g., 500000"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Program Interests */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <FaGraduationCap className="w-5 h-5 text-[#FF8855]" />
          <h3 className="text-lg font-semibold text-gray-800">Program Interests</h3>
        </div>
        <p className="text-gray-600 mb-4">Select fields/programs you're interested in (select multiple)</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {programs.map(program => (
            <button
              key={program}
              type="button"
              onClick={() => toggleProgram(program)}
              className={`px-4 py-2 rounded-lg border transition-colors text-left ${
                preferences.programInterests.includes(program)
                  ? 'bg-[#FF8855] text-white border-[#FF8855]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[#FF8855]'
              }`}
            >
              {program}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-[#FF8855] text-white rounded-lg hover:bg-[#e6794d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save & Continue'}
        </button>
      </div>
    </form>
  );
};

export default PreferencesForm;