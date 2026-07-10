import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface TestHistoryProps {
  profileData: any;
  onUpdate: () => void;
}

const TestHistory: React.FC<TestHistoryProps> = ({ profileData, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/users/test-history/${editingId}`, data);
        toast.success('Test score updated!');
      } else {
        await api.post('/users/test-history', data);
        toast.success('Test score added!');
      }
      reset();
      setShowForm(false);
      setEditingId(null);
      onUpdate();
    } catch (error: any) {
      toast.error(error.error || 'Failed to save test score');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (test: any) => {
    reset({
      testName: test.testName,
      score: test.score,
      maxScore: test.maxScore,
      percentile: test.percentile,
      testDate: test.testDate?.split('T')[0]
    });
    setEditingId(test._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this test score?')) return;
    
    try {
      await api.delete(`/users/test-history/${id}`);
      toast.success('Test score deleted!');
      onUpdate();
    } catch (error: any) {
      toast.error(error.error || 'Failed to delete test score');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {profileData?.testHistory?.map((test: any) => (
          <div key={test._id} className="bg-gray-50 rounded-lg p-4 border">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-[#0B2447]">{test.testName}</h3>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-[#FF8855] font-medium">
                    Score: {test.score}{test.maxScore && `/${test.maxScore}`}
                  </span>
                  {test.percentile && (
                    <span className="text-green-600 font-medium">
                      {test.percentile}%ile
                    </span>
                  )}
                </div>
                {test.testDate && (
                  <p className="text-sm text-gray-500 mt-1">
                    Date: {new Date(test.testDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(test)}
                  className="text-blue-600 hover:text-blue-800 p-1"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(test._id)}
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
          + Add Test Score
        </button>
      )}

      {showForm && (
        <div className="bg-gray-50 rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Test Score' : 'Add Test Score'}
          </h3>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Test Name</label>
                <select
                  {...register('testName', { required: 'Test name is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8855]"
                >
                  <option value="">Select Test</option>
                  <option value="CAT">CAT</option>
                  <option value="GMAT">GMAT</option>
                  <option value="GRE">GRE</option>
                  <option value="NEET">NEET</option>
                  <option value="JEE Main">JEE Main</option>
                  <option value="JEE Advanced">JEE Advanced</option>
                  <option value="CLAT">CLAT</option>
                  <option value="GATE">GATE</option>
                  <option value="IELTS">IELTS</option>
                  <option value="TOEFL">TOEFL</option>
                  <option value="SAT">SAT</option>
                  <option value="Other">Other</option>
                </select>
                {errors.testName && <p className="text-red-500 text-sm mt-1">{errors.testName.message as string}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Test Date</label>
                <input
                  type="date"
                  {...register('testDate')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8855]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Score</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('score', { required: 'Score is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8855]"
                  placeholder="Your score"
                />
                {errors.score && <p className="text-red-500 text-sm mt-1">{errors.score.message as string}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Score</label>
                <input
                  type="number"
                  {...register('maxScore')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8855]"
                  placeholder="Maximum possible score"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Percentile</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  {...register('percentile')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8855]"
                  placeholder="Your percentile"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#FF8855] text-white py-3 rounded-lg font-semibold hover:bg-[#e6794d] transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : editingId ? 'Update' : 'Add Test Score'}
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

export default TestHistory;