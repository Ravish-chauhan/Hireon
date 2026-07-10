import api from './api';

export const abroadCollegeService = {
    getColleges: async (params: any = {}) => {
        return await api.get('/college-abroad', { params });
    },
    getCountries: async () => {
        return await api.get('/college-abroad/countries');
    },
    getSpecialties: async () => {
        return await api.get('/college-abroad/specialties');
    }
};
