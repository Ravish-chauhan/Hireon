import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface EducationProps {
  profileData: any;
  onUpdate: () => void;
}

const Education: React.FC<EducationProps> = ({ profileData, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/users/education/${editingId}`, data);
        toast.success('Education updated!');
      } else {
        await api.post('/users/education', data);
        toast.success('Education added!');
      }
      reset();
      setShowForm(false);
      setEditingId(null);
      onUpdate();
    } catch (error: any) {
      toast.error(error.error || 'Failed to save education');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (edu: any) => {
    reset({
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      startYear: edu.startYear,
      endYear: edu.endYear,
      grade: edu.grade
    });
    setEditingId(edu._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this education entry?')) return;
    
    try {
      await api.delete(`/users/education/${id}`);
      toast.success('Education deleted!');
      onUpdate();
    } catch (error: any) {
      toast.error(error.error || 'Failed to delete education');
    }
  };

  return (
    <div className="space-y-6">
      {/* Education List */}
      <div className="space-y-4">
        {profileData?.education?.map((edu: any) => (
          <div key={edu._id} className="bg-gray-50 rounded-lg p-4 border">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-[#0B2447]">{edu.degree}</h3>
                <p className="text-[#FF8855] font-medium">{edu.institution}</p>
                <p className="text-gray-600">{edu.fieldOfStudy}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>{edu.startYear} - {edu.endYear || 'Present'}</span>
                  {edu.grade && <span>Grade: {edu.grade}</span>}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(edu)}
                  className="text-blue-600 hover:text-blue-800 p-1"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(edu._id)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-gray-500 hover:border-[#FF8855] hover:text-[#FF8855] transition-colors"
        >
          + Add Education
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-gray-50 rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Education' : 'Add Education'}
          </h3>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
                <input
                  type="text"
                  {...register('institution', { required: 'Institution is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8855]"
                  placeholder="University/College name"
                />
                {errors.institution && <p className="text-red-500 text-sm mt-1">{errors.institution.message as string}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                <input
                  type="text"
                  {...register('degree', { required: 'Degree is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8855]"
                  placeholder="Bachelor's, Master's, etc."
                />
                {errors.degree && <p className="text-red-500 text-sm mt-1">{errors.degree.message as string}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
                <input
                  type="text"
                  {...register('fieldOfStudy')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8855]"
                  placeholder="Computer Science, Business, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade/CGPA</label>
                <input
                  type="text"
                  {...register('grade')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8855]"
                  placeholder="8.5 CGPA, 85%, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Year</label>
                <input
                  type="number"
                  {...register('startYear', { required: 'Start year is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8855]"
                  placeholder="2020"
                />
                {errors.startYear && <p className="text-red-500 text-sm mt-1">{errors.startYear.message as string}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Year</label>
                <input
                  type="number"
                  {...register('endYear')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8855]"
                  placeholder="2024 (leave empty if ongoing)"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#FF8855] text-white py-3 rounded-lg font-semibold hover:bg-[#e6794d] transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : editingId ? 'Update' : 'Add Education'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  reset();
                }}
                className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Education;