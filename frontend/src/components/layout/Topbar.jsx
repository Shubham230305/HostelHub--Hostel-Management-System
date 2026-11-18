import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Menu, LogOut } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const pageTitles = {
  '/admin': 'Dashboard',
  '/admin/users': 'User Management',
  '/admin/roles': 'Role Management',
  '/admin/hostels': 'Hostel Management',
  '/admin/rooms': 'Room Management',
  '/admin/allocations': 'Room Allocations',
  '/admin/maintenance': 'Maintenance Requests',
  '/admin/reports': 'Reports',

  '/student': 'Student Dashboard',
  '/student/profile': 'My Profile',
  '/student/room': 'My Room',
  '/student/maintenance': 'My Maintenance',
  '/student/create-request': 'Create Maintenance Request',

  '/maintenance': 'Maintenance Dashboard',
  '/maintenance/assigned': 'Assigned Requests',
};

const roleLabels = {
  ADMIN: 'Administrator',
  STUDENT: 'Student',
  MAINTENANCE: 'Maintenance Staff',
};

export default function Topbar({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const role = user?.role
    ?.toUpperCase()
    .replace(/^ROLE_/, '');

  const roleLabel = roleLabels[role] || 'User';

  const title =
    pageTitles[location.pathname] || `${roleLabel} Dashboard`;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="app-topbar">
      <div className="topbar-left">
        <button
          className="mobile-menu-button"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu size={21} />
        </button>

        <div>
          <span className="topbar-breadcrumb">
            HostelHub / {roleLabel}
          </span>
          <h1>{title}</h1>
        </div>
      </div>

      <div className="topbar-actions">
        <button
          className="notification-button"
          aria-label="Notifications"
        >
          <Bell size={19} />
        </button>

        <div className="topbar-user">
          <div className="user-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>

          <div className="topbar-user-details">
            <strong>{user?.name || 'User'}</strong>
            <span>{roleLabel}</span>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </header>
  );
}