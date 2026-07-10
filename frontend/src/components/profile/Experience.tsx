import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface ExperienceProps {
  profileData: any;
  onUpdate: () => void;
}

const Experience: React.FC<ExperienceProps> = ({ profileData, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/users/experience/${editingId}`, data);
        toast.success('Experience updated!');
      } else {
        await api.post('/users/experience', data);
        toast.success('Experience added!');
      }
      reset();
      setShowForm(false);
      setEditingId(null);
      onUpdate();
    } catch (error: any) {
      toast.error(error.error || 'Failed to save experience');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (exp: any) => {
    reset({
      company: exp.company,
      position: exp.position,
      startDate: exp.startDate?.split('T')[0],
      endDate: exp.endDate?.split('T')[0],
      description: exp.description,
      location: exp.location
    });
    setEditingId(exp._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return;
    
    try {
      await api.delete(`/users/experience/${id}`);
      toast.success('Experience deleted!');
      onUpdate();
    } catch (error: any) {
      toast.error(error.error || 'Failed to delete experience');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {profileData?.professionalExperience?.map((exp: any) => (
          <div key={exp._id} className="bg-gray-50 rounded-lg p-4 border">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-[#0B2447]">{exp.position}</h3>
                <p className="text-[#FF8855] font-medium">{exp.company}</p>
                {exp.location && <p className="text-gray-600">{exp.location}</p>}
                <div className="text-sm text-gray-500 mt-2">
                  {exp.startDate && new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                </div>
                {exp.description && (
                  <p className="text-gray-700 mt-2">{exp.description}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(exp)}
                  className="text-blue-600 hover:text-blue-800 p-1"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(exp._id)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-gray-500 hover:border-[#FF8855] hover:text-[#FF8855] transition-colors"
        >
          + Add Experience
        </button>
      )}

      {showForm && (
        <div className="bg-gray-50 rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Experience' : 'Add Experience'}
          </h3>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <input
                  type="text"
                  {...register('company', { required: 'Company is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8855]"
                  placeholder="Company name"
                />
                {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company.message as string}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                <input
                  type="text"
                  {...register('position', { required: 'Position is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8855]"
                  placeholder="Job title"
                />
                {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position.message as string}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  {...register('location')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8855]"
                  placeholder="City, Country"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  {...register('startDate', { required: 'Start date is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8855]"
                />
                {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message as string}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  {...register('endDate')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8855]"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty if currently working</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8855]"
                placeholder="Describe your role and achievements..."
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#FF8855] text-white py-3 rounded-lg font-semibold hover:bg-[#e6794d] transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : editingId ? 'Update' : 'Add Experience'}
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

export default Experience;