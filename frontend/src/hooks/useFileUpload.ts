import { useState } from 'react';
import { uploadService } from '../services/uploadService';
import toast from 'react-hot-toast';
import { validateFile } from '../utils/validators';

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file: File, documentType: string) => {
    const validation = validateFile(file);
    
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid file');
      return null;
    }

    setUploading(true);
    setProgress(0);

    try {
      const fileUrl = await uploadService.uploadDocument(
        file,
        documentType,
        (progressPercent) => {
          setProgress(progressPercent);
        }
      );

      toast.success('File uploaded successfully');
      return fileUrl;
    } catch (error) {
      toast.error('File upload failed');
      throw error;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return { uploadFile, uploading, progress };
};
