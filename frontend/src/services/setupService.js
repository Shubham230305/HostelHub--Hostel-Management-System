import api from './api';

const setupService = {
  getStatus: async () => {
    const response = await api.get('/setup/status');
    return response.data;
  },

  initialize: async (setupData) => {
    const response = await api.post('/setup/initialize', setupData);
    return response.data;
  },
};

export default setupService;