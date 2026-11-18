import api from './api';

const hostelService = {
  getAllHostels: async () => {
    const response = await api.get('/hostels');
    return response.data;
  },

  getHostelById: async (id) => {
    const response = await api.get(`/hostels/${id}`);
    return response.data;
  },

  createHostel: async (hostelData) => {
    const response = await api.post('/hostels', hostelData);
    return response.data;
  },

  updateHostel: async (id, hostelData) => {
    const response = await api.put(`/hostels/${id}`, hostelData);
    return response.data;
  },

  deleteHostel: async (id) => {
    await api.delete(`/hostels/${id}`);
  },
};

export default hostelService;