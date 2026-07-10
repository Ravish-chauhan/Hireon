import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FaGraduationCap, FaPlus, FaTrash, FaUniversity, FaCalendar, FaTrophy } from 'react-icons/fa';

interface EducationFormProps {
  profileData: any;
  onUpdate: () => void;
  onNext: () => void;
}

interface Education {
  level: string;
  institution: string;
  boardOrUniversity: string;
  yearOfCompletion: number;
  percentageOrCGPA: string;
  achievements: string[];
}

const EducationForm: React.FC<EducationFormProps> = ({ profileData, onUpdate, onNext }) => {
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [loading, setLoading] = useState(false);

  const educationLevels = [
    { value: '10th', label: '10th Grade' },
    { value: '12th', label: '12th Grade' },
    { value: 'undergrad', label: 'Undergraduate' },
    { value: 'postgrad', label: 'Postgraduate' }
  ];

  useEffect(() => {
    if (profileData?.education?.length > 0) {
      setEducationList(profileData.education);
    } else {
      // Initialize with one empty education entry
      setEducationList([{
        level: '',
        institution: '',
        boardOrUniversity: '',
        yearOfCompletion: new Date().getFullYear(),
        percentageOrCGPA: '',
        achievements: []
      }]);
    }
  }, [profileData]);

  const addEducation = () => {
    setEducationList([...educationList, {
      level: '',
      institution: '',
      boardOrUniversity: '',
      yearOfCompletion: new Date().getFullYear(),
      percentageOrCGPA: '',
      achievements: []
    }]);
  };

  const removeEducation = (index: number) => {
    if (educationList.length > 1) {
      setEducationList(educationList.filter((_, i) => i !== index));
    }
  };

  const updateEducation = (index: number, field: keyof Education, value: any) => {
    const updated = [...educationList];
    updated[index] = { ...updated[index], [field]: value };
    setEducationList(updated);
  };

  const addAchievement = (eduIndex: number) => {
    const updated = [...educationList];
    updated[eduIndex].achievements.push('');
    setEducationList(updated);
  };

  const updateAchievement = (eduIndex: number, achievementIndex: number, value: string) => {
    const updated = [...educationList];
    updated[eduIndex].achievements[achievementIndex] = value;
    setEducationList(updated);
  };

  const removeAchievement = (eduIndex: number, achievementIndex: number) => {
    const updated = [...educationList];
    updated[eduIndex].achievements.splice(achievementIndex, 1);
    setEducationList(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filter out empty education entries
      const validEducation = educationList.filter(edu => 
        edu.level && edu.institution && edu.yearOfCompletion
      );

      await api.put('/users/profile', {
        education: validEducation
      });

      toast.success('Education information updated successfully!');
      onNext();
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update education information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {educationList.map((education, eduIndex) => (
        <div key={eduIndex} className="border border-gray-200 rounded-lg p-6 relative">
          {educationList.length > 1 && (
            <button
              type="button"
              onClick={() => removeEducation(eduIndex)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-3 mb-6">
            <FaGraduationCap className="w-5 h-5 text-[#FF8855]" />
            <h3 className="text-lg font-semibold text-gray-800">
              Education {eduIndex + 1}
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Education Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Education Level *
              </label>
              <select
                value={education.level}
                onChange={(e) => updateEducation(eduIndex, 'level', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8855] focus:border-transparent"
                required
              >
                <option value="">Select Level</option>
                {educationLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Institution */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaUniversity className="inline w-4 h-4 mr-2" />
                Institution/School *
              </label>
              <input
                type="text"
                value={education.institution}
                onChange={(e) => updateEducation(eduIndex, 'institution', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8855] focus:border-transparent"
                placeholder="Enter institution name"
                required
              />
            </div>

            {/* Board/University */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Board/University
              </label>
              <input
                type="text"
                value={education.boardOrUniversity}
                onChange={(e) => updateEducation(eduIndex, 'boardOrUniversity', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8855] focus:border-transparent"
                placeholder="e.g., CBSE, ICSE, Mumbai University"
              />
            </div>

            {/* Year of Completion */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendar className="inline w-4 h-4 mr-2" />
                Year of Completion *
              </label>
              <input
                type="number"
                value={education.yearOfCompletion}
                onChange={(e) => updateEducation(eduIndex, 'yearOfCompletion', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8855] focus:border-transparent"
                min="1990"
                max="2030"
                required
              />
            </div>

            {/* Percentage/CGPA */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Percentage/CGPA
              </label>
              <input
                type="text"
                value={education.percentageOrCGPA}
                onChange={(e) => updateEducation(eduIndex, 'percentageOrCGPA', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8855] focus:border-transparent"
                placeholder="e.g., 85%, 8.5 CGPA"
              />
            </div>
          </div>

          {/* Achievements */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                <FaTrophy className="inline w-4 h-4 mr-2" />
                Achievements & Awards
              </label>
              <button
                type="button"
                onClick={() => addAchievement(eduIndex)}
                className="text-[#FF8855] hover:text-[#e6794d] text-sm flex items-center gap-1"
              >
                <FaPlus className="w-3 h-3" />
                Add Achievement
              </button>
            </div>

            {education.achievements.map((achievement, achievementIndex) => (
              <div key={achievementIndex} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={achievement}
                  onChange={(e) => updateAchievement(eduIndex, achievementIndex, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8855] focus:border-transparent"
                  placeholder="Enter achievement or award"
                />
                <button
                  type="button"
                  onClick={() => removeAchievement(eduIndex, achievementIndex)}
                  className="text-red-500 hover:text-red-700 px-2"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Add Education Button */}
      <div className="text-center">
        <button
          type="button"
          onClick={addEducation}
          className="flex items-center gap-2 mx-auto px-6 py-3 border-2 border-dashed border-[#FF8855] text-[#FF8855] rounded-lg hover:bg-[#FF8855] hover:text-white transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          Add Another Education
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

export default EducationForm;