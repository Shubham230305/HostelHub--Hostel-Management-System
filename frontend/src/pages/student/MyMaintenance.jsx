import { useEffect, useState } from 'react';
import { RefreshCw, Wrench, Search } from 'lucide-react';
import maintenanceService from '../../services/maintenanceService';
import './StudentMaintenance.css';

function formatDate(value) {
  return value
    ? new Date(value).toLocaleString('en-IN')
    : 'Not available';
}

export default function MyMaintenance() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await maintenanceService.getMyRequests();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Unable to load maintenance requests.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      `${request.title} ${request.description} ${request.roomNumber || ''}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      status === 'ALL' || request.status === status;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="maintenance-page">
      <div className="maintenance-page-header">
        <div>
          <h1>My Maintenance</h1>
          <p>Track the maintenance requests you have submitted.</p>
        </div>

        <button className="maintenance-button" onClick={loadRequests}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="maintenance-toolbar">
        <div className="maintenance-search">
          <Search size={17} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search requests..."
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="maintenance-state">Loading requests...</div>
      ) : error ? (
        <div className="maintenance-state maintenance-error">
          {error}
          <button className="maintenance-button" onClick={loadRequests}>
            Try Again
          </button>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="maintenance-empty">
          <Wrench size={36} />
          <h2>No Requests Found</h2>
          <p>
            {requests.length === 0
              ? 'You have not submitted any maintenance requests yet.'
              : 'No requests match your search or status filter.'}
          </p>
        </div>
      ) : (
        <div className="maintenance-request-list">
          {filteredRequests.map((request) => (
            <article className="maintenance-request-card" key={request.id}>
              <div className="maintenance-request-top">
                <div>
                  <span className="maintenance-request-id">
                    Request #{request.id}
                  </span>
                  <h2>{request.title}</h2>
                </div>

                <span
                  className={`maintenance-status status-${request.status?.toLowerCase()}`}
                >
                  {request.status?.replace('_', ' ')}
                </span>
              </div>

              <p className="maintenance-description">
                {request.description}
              </p>

              <div className="maintenance-request-meta">
                <span>Room: {request.roomNumber || 'N/A'}</span>
                <span>
                  Assigned to: {request.assignedToName || 'Not assigned'}
                </span>
                <span>Submitted: {formatDate(request.createdAt)}</span>
                {request.resolvedAt && (
                  <span>Resolved: {formatDate(request.resolvedAt)}</span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}