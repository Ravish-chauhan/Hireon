import api from './api';

interface CollegeFilters {
  search?: string;
  state?: string;
  tier?: string;
  min_placement?: number;
  max_fees?: number;
  min_salary?: number;
  programs?: string[];
  entrance_exams?: string[];
  scholarships_available?: boolean;
  hostel_available?: boolean;
  sort_by?: string;
  page?: number;
  limit?: number;
}

export const collegeService = {
  getAllColleges: async (filters: CollegeFilters = {}) => {
    return await api.get('/colleges', { params: filters });
  },

  getCollegeById: async (id: string) => {
    return await api.get(`/colleges/${id}`);
  },

  compareColleges: async (collegeIds: string[]) => {
    return await api.post('/colleges/compare', { collegeIds });
  },

  getFilterMetadata: async () => {
    return await api.get('/colleges/meta/filters');
  },

  getCollegeStats: async () => {
    return await api.get('/colleges/meta/stats');
  },

  getStates: async () => {
    return await api.get('/colleges/meta/states');
  },

  getTiers: async () => {
    return await api.get('/colleges/meta/tiers');
  },

  getCategories: async () => {
    return await api.get('/colleges/meta/categories');
  },
};
