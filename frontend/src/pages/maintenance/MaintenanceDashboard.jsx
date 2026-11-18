import { useEffect, useState } from 'react';
import {
  ClipboardList,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
} from 'lucide-react';

import dashboardService from '../../services/dashboardService';
import './MaintenanceStaff.css';

function StatCard({ icon: Icon, title, value }) {
  return (
    <div className="staff-stat-card">
      <div className="staff-stat-icon">
        <Icon size={22} />
      </div>
      <div>
        <span>{title}</span>
        <strong>{value ?? 0}</strong>
      </div>
    </div>
  );
}

export default function MaintenanceDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await dashboardService.getMaintenanceDashboard();
      setDashboard(response.data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Unable to load maintenance dashboard.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return <div className="staff-page">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="staff-page">
        <p className="staff-error">{error}</p>
        <button className="staff-button" onClick={loadDashboard}>
          <RefreshCw size={16} /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="staff-page">
      <div className="staff-page-header">
        <div>
          <h1>Maintenance Dashboard</h1>
          <p>
            Welcome back, {dashboard?.staffName || 'Maintenance Staff'}!
          </p>
        </div>

        <button className="staff-button" onClick={loadDashboard}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="staff-stats-grid">
        <StatCard
          icon={ClipboardList}
          title="Total Assigned"
          value={dashboard?.totalAssignedRequests}
        />
        <StatCard
          icon={AlertCircle}
          title="Open Requests"
          value={dashboard?.openRequests}
        />
        <StatCard
          icon={Clock}
          title="In Progress"
          value={dashboard?.inProgressRequests}
        />
        <StatCard
          icon={CheckCircle}
          title="Resolved"
          value={dashboard?.resolvedRequests}
        />
        <StatCard
          icon={XCircle}
          title="Rejected"
          value={dashboard?.rejectedRequests}
        />
      </div>

      <section className="staff-welcome-panel">
        <h2>Work Summary</h2>
        <p>
          You currently have {dashboard?.totalAssignedRequests ?? 0}
          {' '}assigned maintenance request(s).
        </p>
        <p>
          Open and in-progress requests need attention. Update each
          request after completing the required work.
        </p>
      </section>
    </div>
  );
}