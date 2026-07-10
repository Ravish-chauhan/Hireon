import React, { useState, useRef } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface DocumentsProps {
  profileData: any;
  onUpdate: () => void;
}

const Documents: React.FC<DocumentsProps> = ({ profileData, onUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const documentTypes = [
    { value: 'resume', label: 'Resume/CV' },
    { value: 'transcript', label: 'Academic Transcript' },
    { value: 'certificate', label: 'Certificate' },
    { value: 'id_proof', label: 'ID Proof' },
    { value: 'test_score', label: 'Test Score Report' },
    { value: 'recommendation', label: 'Recommendation Letter' },
    { value: 'other', label: 'Other' }
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!selectedType) {
      toast.error('Please select document type first');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('type', selectedType);

      await api.post('/users/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Document uploaded successfully!');
      setSelectedType('');
      onUpdate();
    } catch (error: any) {
      toast.error(error.error || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    
    try {
      await api.delete(`/users/documents/${id}`);
      toast.success('Document deleted!');
      onUpdate();
    } catch (error: any) {
      toast.error(error.error || 'Failed to delete document');
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'resume': return '📄';
      case 'transcript': return '📊';
      case 'certificate': return '🏆';
      case 'id_proof': return '🆔';
      case 'test_score': return '📝';
      case 'recommendation': return '💌';
      default: return '📎';
    }
  };

  const getDocumentLabel = (type: string) => {
    const docType = documentTypes.find(dt => dt.value === type);
    return docType ? docType.label : 'Document';
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Upload Section */}
      <div className="bg-gray-50 rounded-lg p-4 md:p-6 border">
        <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-[#0B2447]">Upload New Document</h3>
        
        <div className="space-y-3 md:space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8855] text-sm md:text-base"
            >
              <option value="">Select document type</option>
              {documentTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={!selectedType || uploading}
              className="bg-[#FF8855] text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold hover:bg-[#e6794d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
              {uploading ? 'Uploading...' : 'Choose File'}
            </button>
            <span className="text-xs md:text-sm text-gray-500">
              PDF, DOC, DOCX, JPG, PNG (Max 10MB)
            </span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-3 md:space-y-4">
        <h3 className="text-base md:text-lg font-semibold text-[#0B2447]">Uploaded Documents</h3>
        
        {profileData?.documents?.length > 0 ? (
          <div className="space-y-3">
            {profileData.documents.map((doc: any) => (
              <div key={doc._id} className="bg-white border rounded-lg p-3 md:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center space-x-3 md:space-x-4 min-w-0 flex-1">
                    <span className="text-xl md:text-2xl flex-shrink-0">{getDocumentIcon(doc.type)}</span>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-gray-800 text-sm md:text-base truncate">{getDocumentLabel(doc.type)}</h4>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs md:text-sm text-gray-500">
                        <span>Uploaded: {new Date(doc.createdAt || Date.now()).toLocaleDateString()}</span>
                        <span className={`px-2 py-1 rounded-full text-xs w-fit ${
                          doc.verified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {doc.verified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {doc.url && (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 p-2 text-lg md:text-xl"
                        title="View Document"
                      >
                        👁️
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(doc._id)}
                      className="text-red-600 hover:text-red-800 p-2 text-lg md:text-xl"
                      title="Delete Document"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 md:py-8 text-gray-500">
            <span className="text-3xl md:text-4xl mb-3 md:mb-4 block">📄</span>
            <p className="text-sm md:text-base">No documents uploaded yet</p>
            <p className="text-xs md:text-sm">Upload your academic documents to complete your profile</p>
          </div>
        )}
      </div>

      {/* Document Guidelines */}
      <div className="bg-blue-50 rounded-lg p-4 md:p-6 border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2 md:mb-3 text-sm md:text-base">Document Guidelines</h4>
        <ul className="text-xs md:text-sm text-blue-700 space-y-1 md:space-y-2">
          <li>• Upload clear, high-quality scans or photos</li>
          <li>• Ensure all text is readable and complete</li>
          <li>• Academic transcripts should include all semesters</li>
          <li>• Test score reports should be official copies</li>
          <li>• Documents verified within 24-48 hours</li>
        </ul>
      </div>
    </div>
  );
};

export default Documents;