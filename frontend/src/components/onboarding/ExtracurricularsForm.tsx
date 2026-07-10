import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FaTrophy, FaPlus, FaTrash } from 'react-icons/fa';

interface ExtracurricularsFormProps {
  profileData: any;
  onUpdate: () => void;
  onNext: () => void;
}

interface Extracurricular {
  type: string;
  title: string;
  description: string;
  year: number;
}

const ExtracurricularsForm: React.FC<ExtracurricularsFormProps> = ({ profileData, onUpdate, onNext }) => {
  const [extracurricularsList, setExtracurricularsList] = useState<Extracurricular[]>([]);
  const [loading, setLoading] = useState(false);

  const activityTypes = [
    'Sports', 'Music', 'Dance', 'Drama/Theatre', 'Art', 'Photography',
    'Debate', 'Quiz', 'Science Fair', 'Olympiad', 'Volunteer Work',
    'Leadership', 'Club Activity', 'Competition', 'Award', 'Other'
  ];

  useEffect(() => {
    if (profileData?.extracurriculars?.length > 0) {
      setExtracurricularsList(profileData.extracurriculars);
    } else {
      setExtracurricularsList([{
        type: '',
        title: '',
        description: '',
        year: new Date().getFullYear()
      }]);
    }
  }, [profileData]);

  const addExtracurricular = () => {
    setExtracurricularsList([...extracurricularsList, {
      type: '',
      title: '',
      description: '',
      year: new Date().getFullYear()
    }]);
  };

  const removeExtracurricular = (index: number) => {
    if (extracurricularsList.length > 1) {
      setExtracurricularsList(extracurricularsList.filter((_, i) => i !== index));
    }
  };

  const updateExtracurricular = (index: number, field: keyof Extracurricular, value: any) => {
    const updated = [...extracurricularsList];
    updated[index] = { ...updated[index], [field]: value };
    setExtracurricularsList(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validExtracurriculars = extracurricularsList.filter(activity => 
        activity.type && activity.title && activity.year
      );

      await api.put('/users/profile', {
        extracurriculars: validExtracurriculars
      });

      toast.success('Activities information updated successfully!');
      onNext();
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update activities information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {extracurricularsList.map((activity, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-6 relative">
          {extracurricularsList.length > 1 && (
            <button
              type="button"
              onClick={() => removeExtracurricular(index)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-3 mb-6">
            <FaTrophy className="w-5 h-5 text-[#FF8855]" />
            <h3 className="text-lg font-semibold text-gray-800">
              Activity {index + 1}
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Type *
              </label>
              <select
                value={activity.type}
                onChange={(e) => updateExtracurricular(index, 'type', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8855] focus:border-transparent"
                required
              >
                <option value="">Select Type</option>
                {activityTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year *
              </label>
              <input
                type="number"
                value={activity.year}
                onChange={(e) => updateExtracurricular(index, 'year', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8855] focus:border-transparent"
                min="2000"
                max="2030"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title/Achievement *
              </label>
              <input
                type="text"
                value={activity.title}
                onChange={(e) => updateExtracurricular(index, 'title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8855] focus:border-transparent"
                placeholder="e.g., State Level Basketball Championship, School Debate Winner"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={activity.description}
                onChange={(e) => updateExtracurricular(index, 'description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8855] focus:border-transparent"
                placeholder="Describe your role, achievement, or impact..."
              />
            </div>
          </div>
        </div>
      ))}

      <div className="text-center">
        <button
          type="button"
          onClick={addExtracurricular}
          className="flex items-center gap-2 mx-auto px-6 py-3 border-2 border-dashed border-[#FF8855] text-[#FF8855] rounded-lg hover:bg-[#FF8855] hover:text-white transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          Add Another Activity
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

export default ExtracurricularsForm;