import api from './api';
import axios from 'axios';

export const uploadService = {
  getPresignedUrl: async (fileName: string, fileType: string) => {
    return await api.post('/upload/presigned-url', {
      fileName,
      fileType,
    });
  },

  uploadToS3: async (presignedUrl: string, file: File, onProgress?: (percent: number) => void) => {
    return await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          if (onProgress) {
            onProgress(percentCompleted);
          }
        }
      },
    });
  },

  uploadDocument: async (file: File, documentType: string, onProgress?: (percent: number) => void) => {
    try {
      const response = await uploadService.getPresignedUrl(
        file.name,
        file.type
      );
      const { presignedUrl, fileUrl } = response.data;

      await uploadService.uploadToS3(presignedUrl, file, onProgress);

      await api.post('/documents', {
        fileName: file.name,
        fileUrl,
        documentType,
        fileSize: file.size,
      });

      return fileUrl;
    } catch (error) {
      throw error;
    }
  },

  deleteDocument: async (documentId: string) => {
    return await api.delete(`/documents/${documentId}`);
  },

  getDocuments: async () => {
    return await api.get('/documents');
  },
};
