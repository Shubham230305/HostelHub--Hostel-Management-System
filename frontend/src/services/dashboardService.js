import api from './api';

const dashboardService = {
  getAdminDashboard: () => api.get('/dashboard/admin'),
  getStudentDashboard: () => api.get('/dashboard/student'),
  getMaintenanceDashboard: () => api.get('/dashboard/maintenance'),
  getRoomOccupancy: () => api.get('/dashboard/rooms/occupancy'),
  getHostelOccupancy: () => api.get('/dashboard/hostels/occupancy'),
  getMaintenanceRequests: () => api.get('/maintenance'),
};

export default dashboardService;
