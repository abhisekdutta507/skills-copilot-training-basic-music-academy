import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const classesApi = {
    getAll: () => api.get('/classes').then(r => r.data),
    getById: (id) => api.get(`/classes/${id}`).then(r => r.data),
};
