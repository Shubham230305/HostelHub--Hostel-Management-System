import { useEffect, useState } from 'react';
import {
  Users,
  Building2,
  DoorOpen,
  ClipboardCheck,
  Wrench,
  RefreshCw,
} from 'lucide-react';

import dashboardService from '../../services/dashboardService';
import StatCard from '../../components/dashboard/StatCard';
import OccupancyChart from '../../components/dashboard/OccupancyChart';

import './AdminDashboard.css';

function formatDate(value) {
  if (!value) return '—';

  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminDashboard() {
  const [statistics, setStatistics] = useState(null);
  const [hostelOccupancy, setHostelOccupancy] = useState([]);
  const [roomOccupancy, setRoomOccupancy] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    setLoading(true);
    setError('');

    const results = await Promise.allSettled([
      dashboardService.getAdminDashboard(),
      dashboardService.getHostelOccupancy(),
      dashboardService.getRoomOccupancy(),
      dashboardService.getMaintenanceRequests(),
    ]);

    const [statsResult, hostelResult, roomResult, maintenanceResult] = results;

    if (statsResult.status === 'fulfilled') {
      setStatistics(statsResult.value.data);
    }

    if (hostelResult.status === 'fulfilled') {
      setHostelOccupancy(hostelResult.value.data);
    }

    if (roomResult.status === 'fulfilled') {
      setRoomOccupancy(roomResult.value.data);
    }

    if (maintenanceResult.status === 'fulfilled') {
      setMaintenanceRequests(maintenanceResult.value.data);
    }

    const failed = results.some((result) => result.status === 'rejected');

    if (failed) {
      setError(
        'Some dashboard information could not be loaded. Please refresh.'
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const recentRequests = [...maintenanceRequests]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner" />
        <p>Loading dashboard information...</p>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="dashboard-error">
        <h2>Unable to load dashboard</h2>
        <p>{error || 'Please try again.'}</p>
        <button onClick={loadDashboard}>
          <RefreshCw size={16} /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-welcome">
        <div>
          <span className="section-eyebrow">OVERVIEW</span>
          <h2>Good day, Administrator</h2>
          <p>Here is what's happening across your hostels.</p>
        </div>

        <button className="refresh-button" onClick={loadDashboard}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && <div className="dashboard-warning">{error}</div>}

      <section className="stats-grid">
        <StatCard
          label="Total users"
          value={statistics.totalUsers}
          icon={Users}
          description={`${statistics.totalStudents} students`}
          tone="blue"
        />

        <StatCard
          label="Total hostels"
          value={statistics.totalHostels}
          icon={Building2}
          description={`${statistics.totalRooms} rooms registered`}
          tone="purple"
        />

        <StatCard
          label="Active allocations"
          value={statistics.totalActiveAllocations}
          icon={ClipboardCheck}
          description="Currently active"
          tone="green"
        />

        <StatCard
          label="Maintenance requests"
          value={statistics.totalMaintenanceRequests}
          icon={Wrench}
          description={`${statistics.openMaintenanceRequests} awaiting attention`}
          tone="orange"
        />
      </section>

      <section className="dashboard-middle-grid">
        <OccupancyChart data={hostelOccupancy} />

        <section className="dashboard-panel occupancy-summary">
          <div className="panel-heading">
            <div>
              <h3>Room availability</h3>
              <p>Current bed occupancy</p>
            </div>
          </div>

          <div className="availability-number">
            <strong>
              {roomOccupancy.reduce(
                (sum, room) => sum + (room.occupiedBeds || 0),
                0
              )}
            </strong>
            <span>Occupied beds</span>
          </div>

          <div className="availability-divider" />

          <div className="availability-row">
            <span>Total capacity</span>
            <strong>
              {roomOccupancy.reduce(
                (sum, room) => sum + (room.capacity || 0),
                0
              )}
            </strong>
          </div>

          <div className="availability-row">
            <span>Available beds</span>
            <strong>
              {roomOccupancy.reduce(
                (sum, room) => sum + (room.availableBeds || 0),
                0
              )}
            </strong>
          </div>

          <div className="availability-row">
            <span>Registered rooms</span>
            <strong>{roomOccupancy.length}</strong>
          </div>
        </section>
      </section>

      <section className="dashboard-bottom-grid">
        <section className="dashboard-panel maintenance-summary">
          <div className="panel-heading">
            <div>
              <h3>Maintenance overview</h3>
              <p>Request status distribution</p>
            </div>
          </div>

          <div className="maintenance-status-list">
            <div className="maintenance-status-row">
              <span className="status-dot open" />
              <span>Open</span>
              <strong>{statistics.openMaintenanceRequests}</strong>
            </div>

            <div className="maintenance-status-row">
              <span className="status-dot progress" />
              <span>In progress</span>
              <strong>{statistics.inProgressMaintenanceRequests}</strong>
            </div>

            <div className="maintenance-status-row">
              <span className="status-dot resolved" />
              <span>Resolved</span>
              <strong>{statistics.resolvedMaintenanceRequests}</strong>
            </div>

            <div className="maintenance-status-row">
              <span className="status-dot rejected" />
              <span>Rejected</span>
              <strong>{statistics.rejectedMaintenanceRequests}</strong>
            </div>
          </div>
        </section>

        <section className="dashboard-panel recent-requests">
          <div className="panel-heading">
            <div>
              <h3>Recent maintenance requests</h3>
              <p>Latest requests recorded in the system</p>
            </div>
          </div>

          {recentRequests.length === 0 ? (
            <div className="chart-empty">
              No maintenance requests found.
            </div>
          ) : (
            <div className="request-list">
              {recentRequests.map((request) => (
                <div className="request-row" key={request.id}>
                  <div className="request-icon">
                    <DoorOpen size={18} />
                  </div>

                  <div className="request-info">
                    <strong>{request.title}</strong>
                    <span>
                      Room {request.roomNumber || '—'} ·{' '}
                      {request.studentName || 'Unknown student'}
                    </span>
                  </div>

                  <div className="request-meta">
                    <span
                      className={`request-status ${request.status?.toLowerCase()}`}
                    >
                      {request.status?.replace('_', ' ')}
                    </span>
                    <small>{formatDate(request.createdAt)}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </div>
  );
}