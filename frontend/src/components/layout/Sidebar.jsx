import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Building2,
  DoorOpen,
  ClipboardList,
  Wrench,
  BarChart3,
  X,
  UserRound,
  BedDouble,
  PlusCircle,
} from 'lucide-react';

import useAuth from '../../hooks/useAuth';
import './DashboardLayout.css';

const navigation = {
  ADMIN: {
    title: 'ADMINISTRATION',
    links: [
      { label: 'Overview', path: '/admin', icon: LayoutDashboard },
      { label: 'Users', path: '/admin/users', icon: Users },
      { label: 'Roles', path: '/admin/roles', icon: ShieldCheck },
      { label: 'Hostels', path: '/admin/hostels', icon: Building2 },
      { label: 'Rooms', path: '/admin/rooms', icon: DoorOpen },
      { label: 'Allocations', path: '/admin/allocations', icon: ClipboardList },
      { label: 'Maintenance', path: '/admin/maintenance', icon: Wrench },
      { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
    ],
  },

  STUDENT: {
    title: 'STUDENT MENU',
    links: [
      { label: 'Dashboard', path: '/student', icon: LayoutDashboard },
      { label: 'My Profile', path: '/student/profile', icon: UserRound },
      { label: 'My Room', path: '/student/room', icon: BedDouble },
      { label: 'My Maintenance', path: '/student/maintenance', icon: Wrench },
      { label: 'Create Request', path: '/student/create-request', icon: PlusCircle },
    ],
  },

  MAINTENANCE: {
    title: 'MAINTENANCE MENU',
    links: [
      { label: 'Dashboard', path: '/maintenance', icon: LayoutDashboard },
      { label: 'Assigned Requests', path: '/maintenance/assigned', icon: ClipboardList },
    ],
  },
};

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();

  const role = user?.role
    ?.toUpperCase()
    .replace(/^ROLE_/, '');

  const menu = navigation[role] || {
    title: 'MENU',
    links: [],
  };

  return (
    <aside className={`app-sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="sidebar-brand">
        <span className="sidebar-brand-mark">H</span>
        <span>HostelHub</span>

        <button
          className="sidebar-close"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X size={19} />
        </button>
      </div>

      <div className="sidebar-section-label">
        {menu.title}
      </div>

      <nav className="sidebar-navigation">
        {menu.links.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={true}
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={19} strokeWidth={1.8} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="sidebar-footer-mark">H</span>
        <div>
          <strong>HostelHub</strong>
          <small>Management Portal</small>
        </div>
      </div>
    </aside>
  );
}