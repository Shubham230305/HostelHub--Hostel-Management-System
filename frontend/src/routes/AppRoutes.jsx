import { Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import DashboardLayout from '../components/layout/DashboardLayout';

import useAuth from '../hooks/useAuth';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Setup from '../pages/auth/Setup';
import AdminDashboard from '../pages/admin/AdminDashboard';
import NotFound from '../pages/NotFound';
import Users from '../pages/admin/Users';
import Roles from '../pages/admin/Roles';
import Hostels from '../pages/admin/Hostels';
import Rooms from '../pages/admin/Rooms';
import Allocations from '../pages/admin/Allocations';
import Maintenance from '../pages/admin/Maintenance';
import Reports from '../pages/admin/Reports';
import StudentDashboard from '../pages/student/StudentDashboard';
import MyProfile from '../pages/student/MyProfile';
import MyRoom from '../pages/student/MyRoom';
import MyMaintenance from '../pages/student/MyMaintenance';
import CreateMaintenance from '../pages/student/CreateMaintenance';
import MaintenanceDashboard from '../pages/maintenance/MaintenanceDashboard';
import AssignedRequests from '../pages/maintenance/AssignedRequests';

function HomeRedirect() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const dashboardRoutes = {
    ADMIN: '/admin',
    STUDENT: '/student',
    MAINTENANCE: '/maintenance',
  };

  return (
    <Navigate
      to={dashboardRoutes[user.role?.toUpperCase()] || '/unauthorized'}
      replace
    />
  );
}

function Unauthorized() {
  return (
    <div style={{ padding: '40px' }}>
      <h1>Access denied</h1>
      <p>You do not have permission to access this page.</p>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/setup" element={<Setup />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/roles" element={<Roles />} />
            <Route path="/admin/hostels" element={<Hostels />} />
            <Route path="/admin/rooms" element={<Rooms />} />
            <Route path="/admin/allocations" element={<Allocations />} />
            <Route path="/admin/maintenance" element={<Maintenance />} />
            <Route path="/admin/reports" element={<Reports />} />
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRoles={['STUDENT']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<MyProfile />} />
            <Route path="/student/room" element={<MyRoom />} />
            <Route path="/student/maintenance" element={<MyMaintenance />} />
            <Route path="/student/create-request" element={<CreateMaintenance />} />
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRoles={['MAINTENANCE']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/maintenance" element={<MaintenanceDashboard />} />
            <Route path="/maintenance/assigned" element={<AssignedRequests />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}