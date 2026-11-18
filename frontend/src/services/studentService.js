import api from './api';

const studentService = {
  getDashboard: async () => {
    const response = await api.get('/dashboard/student');
    return response.data;
  },

  getMyProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  getMyAllocation: async () => {
    const response = await api.get('/allocations/my');
    return response.data;
  },

  getMyMaintenanceRequests: async () => {
    const response = await api.get('/maintenance/my');
    return response.data;
  },

  createMaintenanceRequest: async (requestData) => {
    const response = await api.post('/maintenance/my', requestData);
    return response.data;
  },
};

export default studentService;