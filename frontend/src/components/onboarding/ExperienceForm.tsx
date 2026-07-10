import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FaBriefcase, FaPlus, FaTrash, FaBuilding, FaCalendar } from 'react-icons/fa';

interface ExperienceFormProps {
  profileData: any;
  onUpdate: () => void;
  onNext: () => void;
}

interface Experience {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ profileData, onUpdate, onNext }) => {
  const [experienceList, setExperienceList] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profileData?.professionalExperience?.length > 0) {
      const formattedExperience = profileData.professionalExperience.map((exp: any) => ({
        title: exp.title || '',
        company: exp.company || '',
        startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
        endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
        isCurrent: exp.isCurrent || false,
        description: exp.description || ''
      }));
      setExperienceList(formattedExperience);
    } else {
      setExperienceList([{
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: ''
      }]);
    }
  }, [profileData]);

  const addExperience = () => {
    setExperienceList([...experienceList, {
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: ''
    }]);
  };

  const removeExperience = (index: number) => {
    if (experienceList.length > 1) {
      setExperienceList(experienceList.filter((_, i) => i !== index));
    }
  };

  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    const updated = [...experienceList];
    updated[index] = { ...updated[index], [field]: value };
    setExperienceList(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validExperience = experienceList.filter(exp => 
        exp.title && exp.company && exp.startDate
      );

      await api.put('/users/profile', {
        professionalExperience: validExperience
      });

      toast.success('Experience information updated successfully!');
      onNext();
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update experience information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {experienceList.map((experience, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-6 relative">
          {experienceList.length > 1 && (
            <button
              type="button"
              onClick={() => removeExperience(index)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-3 mb-6">
            <FaBriefcase className="w-5 h-5 text-[#FF8855]" />
            <h3 className="text-lg font-semibold text-gray-800">
              Experience {index + 1}
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title/Position *
              </label>
              <input
                type="text"
                value={experience.title}
                onChange={(e) => updateExperience(index, 'title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8855] focus:border-transparent"
                placeholder="e.g., Software Intern, Marketing Assistant"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaBuilding className="inline w-4 h-4 mr-2" />
                Company/Organization *
              </label>
              <input
                type="text"
                value={experience.company}
                onChange={(e) => updateExperience(index, 'company', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8855] focus:border-transparent"
                placeholder="Enter company name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendar className="inline w-4 h-4 mr-2" />
                Start Date *
              </label>
              <input
                type="date"
                value={experience.startDate}
                onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8855] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={experience.endDate}
                onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8855] focus:border-transparent"
                disabled={experience.isCurrent}
              />
              <div className="mt-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={experience.isCurrent}
                    onChange={(e) => updateExperience(index, 'isCurrent', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">Currently working here</span>
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={experience.description}
                onChange={(e) => updateExperience(index, 'description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8855] focus:border-transparent"
                placeholder="Describe your role, responsibilities, and achievements..."
              />
            </div>
          </div>
        </div>
      ))}

      <div className="text-center">
        <button
          type="button"
          onClick={addExperience}
          className="flex items-center gap-2 mx-auto px-6 py-3 border-2 border-dashed border-[#FF8855] text-[#FF8855] rounded-lg hover:bg-[#FF8855] hover:text-white transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          Add Another Experience
        </button>
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

export default ExperienceForm;