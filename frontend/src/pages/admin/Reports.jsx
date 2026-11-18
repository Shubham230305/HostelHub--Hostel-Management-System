import { useEffect, useState } from 'react';
import {
  BarChart3,
  Building2,
  Download,
  RefreshCw,
  Users,
  Wrench,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import dashboardService from '../../services/dashboardService';
import './Reports.css';

function getErrorMessage(error, fallback = 'Something went wrong.') {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

export default function Reports() {
  const [dashboard, setDashboard] = useState(null);
  const [roomOccupancy, setRoomOccupancy] = useState([]);
  const [hostelOccupancy, setHostelOccupancy] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  
  const loadReports = async () => {
    try {
      setLoading(true);
      setError('');

      const [
        dashboardResponse,
        roomResponse,
        hostelResponse,
      ] = await Promise.all([
        dashboardService.getAdminDashboard(),
        dashboardService.getRoomOccupancy(),
        dashboardService.getHostelOccupancy(),
      ]);

      // Axios returns the actual backend response inside .data
      setDashboard(dashboardResponse.data);

      setRoomOccupancy(
        Array.isArray(roomResponse.data)
          ? roomResponse.data
          : []
      );

      setHostelOccupancy(
        Array.isArray(hostelResponse.data)
          ? hostelResponse.data
          : []
      );
    } catch (err) {
      setError(
        getErrorMessage(err, 'Unable to load reports.')
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadReports();
  }, []);

  const maintenanceData = dashboard
    ? [
        {
          name: 'Open',
          value: dashboard.openMaintenanceRequests || 0,
        },
        {
          name: 'In Progress',
          value: dashboard.inProgressMaintenanceRequests || 0,
        },
        {
          name: 'Resolved',
          value: dashboard.resolvedMaintenanceRequests || 0,
        },
        {
          name: 'Rejected',
          value: dashboard.rejectedMaintenanceRequests || 0,
        },
      ]
    : [];

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="reports-page">
        <div className="reports-state">
          <div className="reports-spinner"></div>
          <p>Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reports-page">
        <div className="reports-alert reports-alert-error">
          {error}
        </div>

        <button
          className="reports-btn reports-btn-primary"
          onClick={loadReports}
        >
          <RefreshCw size={17} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <div className="reports-title-row">
            <BarChart3 size={28} />
            <h1>Reports & Analytics</h1>
          </div>

          <p>
            Overview of hostel operations, occupancy and maintenance.
          </p>
        </div>

        <div className="reports-actions">
          <button
            className="reports-btn reports-btn-secondary"
            onClick={loadReports}
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <button
            className="reports-btn reports-btn-primary"
            onClick={handlePrint}
          >
            <Download size={17} />
            Print / Save PDF
          </button>
        </div>
      </div>

      <div className="reports-stat-grid">
        <div className="report-stat">
          <div className="report-stat-icon">
            <Users size={20} />
          </div>

          <div>
            <span>Total Users</span>
            <strong>{dashboard?.totalUsers || 0}</strong>
          </div>
        </div>

        <div className="report-stat">
          <div className="report-stat-icon">
            <Building2 size={20} />
          </div>

          <div>
            <span>Total Hostels</span>
            <strong>{dashboard?.totalHostels || 0}</strong>
          </div>
        </div>

        <div className="report-stat">
          <div className="report-stat-icon">
            <BarChart3 size={20} />
          </div>

          <div>
            <span>Total Rooms</span>
            <strong>{dashboard?.totalRooms || 0}</strong>
          </div>
        </div>

        <div className="report-stat">
          <div className="report-stat-icon">
            <Wrench size={20} />
          </div>

          <div>
            <span>Maintenance Requests</span>
            <strong>
              {dashboard?.totalMaintenanceRequests || 0}
            </strong>
          </div>
        </div>
      </div>

      <div className="reports-grid">
        <section className="reports-panel">
          <div className="reports-panel-header">
            <div>
              <h2>Hostel Occupancy</h2>
              <p>Occupied beds compared with available capacity.</p>
            </div>
          </div>

          <div className="reports-chart">
            {hostelOccupancy.length === 0 ? (
              <div className="reports-empty">
                No hostel occupancy data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={hostelOccupancy}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hostelName" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="occupiedBeds"
                    name="Occupied"
                    fill="#4f46e5"
                  />
                  <Bar
                    dataKey="availableBeds"
                    name="Available"
                    fill="#cbd5e1"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        <section className="reports-panel">
          <div className="reports-panel-header">
            <div>
              <h2>Maintenance Status</h2>
              <p>Current distribution of maintenance requests.</p>
            </div>
          </div>

          <div className="reports-chart reports-pie-chart">
            {maintenanceData.every((item) => item.value === 0) ? (
              <div className="reports-empty">
                No maintenance request data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={maintenanceData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {maintenanceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={[
                          '#f97316',
                          '#3b82f6',
                          '#22c55e',
                          '#ef4444',
                        ][index]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>
      </div>

      <section className="reports-panel reports-room-panel">
        <div className="reports-panel-header">
          <div>
            <h2>Room Occupancy</h2>
            <p>
              Occupancy information for each registered room.
            </p>
          </div>
        </div>

        {roomOccupancy.length === 0 ? (
          <div className="reports-empty">
            No room occupancy data available.
          </div>
        ) : (
          <div className="reports-room-table-wrapper">
            <table className="reports-room-table">
              <thead>
                <tr>
                  <th>Room</th>
                  <th>Hostel</th>
                  <th>Capacity</th>
                  <th>Occupied</th>
                  <th>Available</th>
                  <th>Occupancy</th>
                </tr>
              </thead>

              <tbody>
                {roomOccupancy.map((room) => (
                  <tr key={room.roomId}>
                    <td>{room.roomNumber}</td>
                    <td>{room.hostelName}</td>
                    <td>{room.capacity}</td>
                    <td>{room.occupiedBeds}</td>
                    <td>{room.availableBeds}</td>
                    <td>
                      <div className="report-progress">
                        <div className="report-progress-track">
                          <div
                            className="report-progress-fill"
                            style={{
                              width: `${Math.min(
                                room.occupancyPercentage || 0,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>

                        <span>
                          {Number(
                            room.occupancyPercentage || 0
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}