import api from './api';

export const consultationService = {
  // Book a new consultation
  bookConsultation: async (consultationData: any) => {
    return await api.post('/consultation', consultationData);
  },

  // Get all consultations of the logged-in user
  getConsultations: async () => {
    return await api.get('/consultation/me');
  },
};




