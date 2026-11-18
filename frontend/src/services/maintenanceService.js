import api from './api';

const maintenanceService = {
  getAllRequests: async () => {
    const response = await api.get('/maintenance');
    return response.data;
  },

  getRequestById: async (id) => {
    const response = await api.get(`/maintenance/${id}`);
    return response.data;
  },

  getRequestsByStatus: async (status) => {
    const response = await api.get(`/maintenance/status/${status}`);
    return response.data;
  },

  assignRequest: async (requestId, staffId) => {
    const response = await api.put(
      `/maintenance/${requestId}/assign/${staffId}`
    );
    return response.data;
  },

  updateStatus: async (requestId, status) => {
    const response = await api.put(
      `/maintenance/${requestId}/status/${status}`
    );
    return response.data;
  },

  deleteRequest: async (id) => {
    await api.delete(`/maintenance/${id}`);
  },

  getMyRequests: async () => {
    const response = await api.get('/maintenance/my');
    return response.data;
  },

  createMyRequest: async (requestData) => {
    const response = await api.post('/maintenance/my', requestData);
    return response.data;
  },

  getMyAssignedRequests: async () => {
    const response = await api.get('/maintenance/my-assigned');
    return response.data;
  },

  updateMyStatus: async (requestId, status) => {
    const response = await api.put(
      `/maintenance/${requestId}/my-status/${status}`
    );
    return response.data;
  },
};

export default maintenanceService;