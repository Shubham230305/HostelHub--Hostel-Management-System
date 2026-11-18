import api from './api';

const allocationService = {
  getAllAllocations: async () => {
    const response = await api.get('/allocations');
    return response.data;
  },

  getAllocationById: async (id) => {
    const response = await api.get(`/allocations/${id}`);
    return response.data;
  },

  getStudentAllocation: async (studentId) => {
    const response = await api.get(`/allocations/student/${studentId}`);
    return response.data;
  },

  getRoomAllocations: async (roomId) => {
    const response = await api.get(`/allocations/room/${roomId}`);
    return response.data;
  },

  createAllocation: async (allocationData) => {
    const response = await api.post('/allocations', allocationData);
    return response.data;
  },

  vacateAllocation: async (allocationId) => {
    const response = await api.put(
      `/allocations/${allocationId}/vacate`
    );
    return response.data;
  },

  getMyAllocation: async () => {
    const response = await api.get('/allocations/my');
    return response.data;
  },
};

export default allocationService;