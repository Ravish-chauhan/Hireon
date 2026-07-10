import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FaFileAlt, FaPlus, FaTrash, FaCalendar } from 'react-icons/fa';

interface TestHistoryFormProps {
  profileData: any;
  onUpdate: () => void;
  onNext: () => void;
}

interface TestHistory {
  exam: string;
  attemptDate: string;
  score: string;
}

const TestHistoryForm: React.FC<TestHistoryFormProps> = ({ profileData, onUpdate, onNext }) => {
  const [testHistoryList, setTestHistoryList] = useState<TestHistory[]>([]);
  const [loading, setLoading] = useState(false);

  const examTypes = [
    'JEE Main', 'JEE Advanced', 'NEET', 'CAT', 'XAT', 'SNAP', 'CMAT',
    'GATE', 'GRE', 'GMAT', 'TOEFL', 'IELTS', 'SAT', 'ACT',
    'CLAT', 'AILET', 'LSAT', 'UPSC', 'SSC', 'Banking PO',
    'Class 10 Board', 'Class 12 Board', 'Other'
  ];

  useEffect(() => {
    if (profileData?.testHistory?.length > 0) {
      const formattedTests = profileData.testHistory.map((test: any) => ({
        exam: test.exam || '',
        attemptDate: test.attemptDate ? new Date(test.attemptDate).toISOString().split('T')[0] : '',
        score: test.score || ''
      }));
      setTestHistoryList(formattedTests);
    } else {
      setTestHistoryList([{
        exam: '',
        attemptDate: '',
        score: ''
      }]);
    }
  }, [profileData]);

  const addTestHistory = () => {
    setTestHistoryList([...testHistoryList, {
      exam: '',
      attemptDate: '',
      score: ''
    }]);
  };

  const removeTestHistory = (index: number) => {
    if (testHistoryList.length > 1) {
      setTestHistoryList(testHistoryList.filter((_, i) => i !== index));
    }
  };

  const updateTestHistory = (index: number, field: keyof TestHistory, value: any) => {
    const updated = [...testHistoryList];
    updated[index] = { ...updated[index], [field]: value };
    setTestHistoryList(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validTests = testHistoryList.filter(test => 
        test.exam && test.attemptDate && test.score
      );

      await api.put('/users/profile', {
        testHistory: validTests
      });

      toast.success('Test history updated successfully!');
      onNext();
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update test history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {testHistoryList.map((test, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-6 relative">
          {testHistoryList.length > 1 && (
            <button
              type="button"
              onClick={() => removeTestHistory(index)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-3 mb-6">
            <FaFileAlt className="w-5 h-5 text-[#FF8855]" />
            <h3 className="text-lg font-semibold text-gray-800">
              Test {index + 1}
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exam Name *
              </label>
              <select
                value={test.exam}
                onChange={(e) => updateTestHistory(index, 'exam', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8855] focus:border-transparent"
                required
              >
                <option value="">Select Exam</option>
                {examTypes.map(exam => (
                  <option key={exam} value={exam}>{exam}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendar className="inline w-4 h-4 mr-2" />
                Attempt Date *
              </label>
              <input
                type="date"
                value={test.attemptDate}
                onChange={(e) => updateTestHistory(index, 'attemptDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8855] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Score/Result *
              </label>
              <input
                type="text"
                value={test.score}
                onChange={(e) => updateTestHistory(index, 'score', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8855] focus:border-transparent"
                placeholder="e.g., 95 percentile, 1400/1600, 85%"
                required
              />
            </div>
          </div>
        </div>
      ))}

      <div className="text-center">
        <button
          type="button"
          onClick={addTestHistory}
          className="flex items-center gap-2 mx-auto px-6 py-3 border-2 border-dashed border-[#FF8855] text-[#FF8855] rounded-lg hover:bg-[#FF8855] hover:text-white transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          Add Another Test
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

export default TestHistoryForm;