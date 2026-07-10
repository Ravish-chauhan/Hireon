import api from './api';

interface NewsFilters {
  category?: string;
  featured?: boolean;
  limit?: number;
  page?: number;
  sort?: string;
}

export const newsService = {
  getAllNews: async (filters: NewsFilters = {}) => {
    return await api.get('/news', { params: filters });
  },

  getNewsById: async (id: string) => {
    return await api.get(`/news/${id}`);
  },

  getFeaturedNews: async () => {
    return await api.get('/news/featured/homepage');
  },

  getCategories: async () => {
    return await api.get('/news/meta/categories');
  },
};