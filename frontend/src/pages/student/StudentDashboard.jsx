import { useEffect, useState } from 'react';
import {
  BedDouble,
  ClipboardList,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

import studentService from '../../services/studentService';
import './Student.css';

function StatCard({ icon: Icon, title, value, color }) {
  return (
    <div className="student-stat-card">
      <div className="student-stat-icon" style={{ background: color }}>
        <Icon size={22} />
      </div>
      <div>
        <span>{title}</span>
        <h2>{value ?? 0}</h2>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await studentService.getDashboard();
      setDashboard(data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Unable to load student dashboard.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return <div className="student-page">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="student-page">
        <p className="student-error">{error}</p>
        <button className="student-button" onClick={loadDashboard}>
          <RefreshCw size={16} /> Try Again
        </button>
      </div>
    );
  }

  const allocation = dashboard?.allocation;
  const room = allocation?.room || {};
  const hostel = room?.hostel || allocation?.hostel || {};

  return (
    <div className="student-page">
      <div className="student-page-header">
        <div>
          <h1>Student Dashboard</h1>
          <p>Welcome back, {dashboard?.studentName || 'Student'}!</p>
        </div>
        <button className="student-button" onClick={loadDashboard}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="student-stats-grid">
        <StatCard
          icon={ClipboardList}
          title="Total Requests"
          value={dashboard?.totalMaintenanceRequests}
          color="#e0e7ff"
        />
        <StatCard
          icon={Clock}
          title="Open Requests"
          value={dashboard?.openMaintenanceRequests}
          color="#ffedd5"
        />
        <StatCard
          icon={AlertCircle}
          title="In Progress"
          value={dashboard?.inProgressMaintenanceRequests}
          color="#dbeafe"
        />
        <StatCard
          icon={CheckCircle}
          title="Resolved"
          value={dashboard?.resolvedMaintenanceRequests}
          color="#dcfce7"
        />
      </div>

      <section className="student-panel">
        <div className="student-panel-heading">
          <BedDouble size={22} />
          <h2>My Room Allocation</h2>
        </div>

        {allocation ? (
          <div className="student-room-details">
            <div>
              <span>Hostel</span>
              <strong>
                {hostel?.name || allocation?.hostelName || 'Not available'}
              </strong>
            </div>
            <div>
              <span>Room Number</span>
              <strong>
                {room?.roomNumber || allocation?.roomNumber || 'Not available'}
              </strong>
            </div>
            <div>
              <span>Allocation Status</span>
              <strong>{allocation?.status || 'Active'}</strong>
            </div>
            <div>
              <span>Allocated On</span>
              <strong>
                {allocation?.allocationDate
                  ? new Date(`${allocation.allocationDate}T00:00:00`)
                      .toLocaleDateString('en-IN')
                  : 'Not available'}
              </strong>
            </div>
          </div>
        ) : (
          <p className="student-muted">
            You do not currently have an active room allocation.
          </p>
        )}
      </section>
    </div>
  );
}