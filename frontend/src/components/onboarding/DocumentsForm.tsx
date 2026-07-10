import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FaFileAlt, FaUpload, FaTrash, FaCheck, FaClock } from 'react-icons/fa';

interface DocumentsFormProps {
  profileData: any;
  onUpdate: () => void;
  onNext: () => void;
}

interface Document {
  type: string;
  url: string;
  verified: boolean;
  file?: File;
}

const DocumentsForm: React.FC<DocumentsFormProps> = ({ profileData, onUpdate, onNext }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);

  const documentTypes = [
    { value: 'transcript', label: '10th/12th Marksheet' },
    { value: 'id_proof', label: 'ID Proof (Aadhar/Passport)' },
    { value: 'recommendation', label: 'Recommendation Letter' },
    { value: 'certificate', label: 'Achievement Certificate' },
    { value: 'resume', label: 'Resume/CV' },
    { value: 'other', label: 'Other Document' }
  ];

  useEffect(() => {
    if (profileData?.documents?.length > 0) {
      setDocuments(profileData.documents);
    }
  }, [profileData]);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'edunia_documents'); // You'll need to set this up in Cloudinary
    
    const response = await fetch('https://api.cloudinary.com/v1_1/dmlvthmqr/raw/upload', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    return data.secure_url;
  };

  const handleFileChange = async (type: string, file: File) => {
    setLoading(true);
    try {
      const url = await uploadToCloudinary(file);
      
      const existingIndex = documents.findIndex(doc => doc.type === type);
      if (existingIndex >= 0) {
        const updated = [...documents];
        updated[existingIndex] = { type, url, verified: false };
        setDocuments(updated);
      } else {
        setDocuments([...documents, { type, url, verified: false }]);
      }
      
      toast.success('Document uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  const removeDocument = (type: string) => {
    setDocuments(documents.filter(doc => doc.type !== type));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put('/users/profile', {
        documents: documents
      });

      toast.success('Documents updated successfully!');
      onNext();
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update documents');
    } finally {
      setLoading(false);
    }
  };

  const getDocumentByType = (type: string) => {
    return documents.find(doc => doc.type === type);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-8">
      <div className="grid gap-3 md:gap-6">
        {documentTypes.map(docType => {
          const existingDoc = getDocumentByType(docType.value);
          
          return (
            <div key={docType.value} className="border border-gray-200 rounded-lg p-3 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 md:mb-4 gap-2">
                <div className="flex items-center gap-2 md:gap-3">
                  <FaFileAlt className="w-4 h-4 md:w-5 md:h-5 text-[#FF8855] flex-shrink-0" />
                  <h3 className="text-sm md:text-lg font-semibold text-gray-800">{docType.label}</h3>
                </div>
                
                {existingDoc && (
                  <div className="flex items-center gap-2">
                    {existingDoc.verified ? (
                      <span className="flex items-center gap-1 text-green-600 text-xs md:text-sm">
                        <FaCheck className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="hidden sm:inline">Verified</span>
                        <span className="sm:hidden">✓</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-yellow-600 text-xs md:text-sm">
                        <FaClock className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="hidden sm:inline">Pending Verification</span>
                        <span className="sm:hidden">Pending</span>
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeDocument(docType.value)}
                      className="text-red-500 hover:text-red-700 ml-1 md:ml-2 p-1"
                    >
                      <FaTrash className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                  </div>
                )}
              </div>

              {existingDoc ? (
                <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-gray-700 text-sm md:text-base">Document uploaded</span>
                    <a
                      href={existingDoc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF8855] hover:text-[#e6794d] text-xs md:text-sm font-medium"
                    >
                      View Document
                    </a>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-8 text-center">
                  <FaUpload className="w-6 h-6 md:w-8 md:h-8 text-gray-400 mx-auto mb-2 md:mb-4" />
                  <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">Upload {docType.label}</p>
                  <label className="inline-flex items-center gap-1 md:gap-2 px-4 py-2 md:px-6 md:py-3 bg-[#FF8855] text-white rounded-lg hover:bg-[#e6794d] transition-colors cursor-pointer text-sm md:text-base">
                    <FaUpload className="w-3 h-3 md:w-4 md:h-4" />
                    Choose File
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileChange(docType.value, file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    PDF, JPG, PNG, DOC, DOCX (Max 10MB)
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
        <div className="flex items-start gap-2 md:gap-3">
          <div className="text-blue-600 mt-1 flex-shrink-0">
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-blue-800 font-medium mb-1 text-sm md:text-base">Document Guidelines</h4>
            <ul className="text-blue-700 text-xs md:text-sm space-y-1">
              <li>• Upload clear, readable copies</li>
              <li>• All documents verified by our team</li>
              <li>• Verified documents improve credibility</li>
              <li>• Update documents anytime from profile</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-center md:justify-end">
        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-6 md:px-8 py-3 bg-[#FF8855] text-white rounded-lg hover:bg-[#e6794d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base font-medium"
        >
          {loading ? 'Saving...' : 'Complete Profile'}
        </button>
      </div>
    </form>
  );
};

export default DocumentsForm;