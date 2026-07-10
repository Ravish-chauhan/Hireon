import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface ExtracurricularsProps {
  profileData: any;
  onUpdate: () => void;
}

const Extracurriculars: React.FC<ExtracurricularsProps> = ({ profileData, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/users/extracurriculars/${editingId}`, data);
        toast.success('Activity updated!');
      } else {
        await api.post('/users/extracurriculars', data);
        toast.success('Activity added!');
      }
      reset();
      setShowForm(false);
      setEditingId(null);
      onUpdate();
    } catch (error: any) {
      toast.error(error.error || 'Failed to save activity');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (activity: any) => {
    reset({
      title: activity.title,
      organization: activity.organization,
      role: activity.role,
      startDate: activity.startDate?.split('T')[0],
      endDate: activity.endDate?.split('T')[0],
      description: activity.description
    });
    setEditingId(activity._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;
    
    try {
      await api.delete(`/users/extracurriculars/${id}`);
      toast.success('Activity deleted!');
      onUpdate();
    } catch (error: any) {
      toast.error(error.error || 'Failed to delete activity');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {profileData?.extracurriculars?.map((activity: any) => (
          <div key={activity._id} className="bg-gray-50 rounded-lg p-4 border">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-[#0B2447]">{activity.title}</h3>
                <p className="text-[#FF8855] font-medium">{activity.organization}</p>
                {activity.role && <p className="text-gray-600">{activity.role}</p>}
                <div className="text-sm text-gray-500 mt-2">
                  {activity.startDate && new Date(activity.startDate).toLocaleDateString()} - {activity.endDate ? new Date(activity.endDate).toLocaleDateString() : 'Present'}
                </div>
                {activity.description && (
                  <p className="text-gray-700 mt-2">{activity.description}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(activity)}
                  className="text-blue-600 hover:text-blue-800 p-1"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(activity._id)}
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
          + Add Extracurricular Activity
        </button>
      )}

      {showForm && (
        <div className="bg-gray-50 rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Activity' : 'Add Activity'}
          </h3>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  {...register('title', { required: 'Title is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8855]"
                  placeholder="Activity name"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message as string}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
                <input
                  type="text"
                  {...register('organization')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8855]"
                  placeholder="Club, NGO, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <input
                  type="text"
                  {...register('role')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8855]"
                  placeholder="President, Member, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  {...register('startDate')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8855]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  {...register('endDate')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8855]"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty if ongoing</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8855]"
                placeholder="Describe your involvement and achievements..."
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#FF8855] text-white py-3 rounded-lg font-semibold hover:bg-[#e6794d] transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : editingId ? 'Update' : 'Add Activity'}
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

export default Extracurriculars;