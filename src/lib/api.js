import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const classesApi = {
    getAll: () => api.get('/classes').then(r => r.data),
    getFiltered: (params) => api.get('/classes', { params }).then(r => r.data),
    getDemoEligible: () => api.get('/classes', { params: { demoAvailable: 'true' } }).then(r => r.data),
    getById: (id) => api.get(`/classes/${id}`).then(r => r.data),
};

export const enrollmentsApi = {
    submit: (data) => api.post('/enrollments', data).then(r => r.data),
    completePayment: (id, data) => api.post(`/enrollments/${id}/payment`, data).then(r => r.data),
};

export const demoRequestsApi = {
    submit: (data) => api.post('/demo-requests', data).then(r => r.data),
};

export const adminCoursesApi = {
    getAll: () => api.get('/admin/courses').then(r => r.data),
    getById: (id) => api.get(`/admin/courses/${id}`).then(r => r.data),
    create: (data) => api.post('/admin/courses', data).then(r => r.data),
    update: (id, data) => api.put(`/admin/courses/${id}`, data).then(r => r.data),
    remove: (id) => api.delete(`/admin/courses/${id}`).then(r => r.data),
};

export const adminEnrollmentsApi = {
    getAll: (params) => api.get('/admin/enrollments', { params }).then(r => r.data),
    refund: (id) => api.post(`/admin/enrollments/${id}/refund`).then(r => r.data),
};

export const adminDemoRequestsApi = {
    getAll: (params) => api.get('/admin/demo-requests', { params }).then(r => r.data),
    updateStatus: (id, status) =>
        api.patch(`/admin/demo-requests/${id}`, { status }).then(r => r.data),
};

