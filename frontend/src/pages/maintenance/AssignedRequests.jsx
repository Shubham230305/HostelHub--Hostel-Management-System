import { useEffect, useState } from 'react';
import { RefreshCw, ClipboardList } from 'lucide-react';

import maintenanceService from '../../services/maintenanceService';
import './MaintenanceStaff.css';

function formatDate(value) {
  return value
    ? new Date(value).toLocaleString('en-IN')
    : 'Not available';
}

export default function AssignedRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState('ALL');

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await maintenanceService.getMyAssignedRequests();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Unable to load assigned requests.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const updateStatus = async (requestId, status) => {
    try {
      setUpdatingId(requestId);
      setError('');

      const updated = await maintenanceService.updateMyStatus(
        requestId,
        status
      );

      setRequests((current) =>
        current.map((request) =>
          request.id === requestId ? updated : request
        )
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Unable to update request status.'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredRequests = requests.filter(
    (request) => filter === 'ALL' || request.status === filter
  );

  return (
    <div className="staff-page">
      <div className="staff-page-header">
        <div>
          <h1>Assigned Requests</h1>
          <p>Manage maintenance requests assigned to you.</p>
        </div>

        <button className="staff-button" onClick={loadRequests}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {error && <div className="staff-alert">{error}</div>}

      <div className="staff-toolbar">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="ALL">All Requests</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="REJECTED">Rejected</option>
        </select>

        <span>{filteredRequests.length} request(s)</span>
      </div>

      {loading ? (
        <div className="staff-empty">Loading assigned requests...</div>
      ) : filteredRequests.length === 0 ? (
        <div className="staff-empty">
          <ClipboardList size={36} />
          <h2>No Assigned Requests</h2>
          <p>No requests are currently available for this filter.</p>
        </div>
      ) : (
        <div className="staff-request-list">
          {filteredRequests.map((request) => (
            <article className="staff-request-card" key={request.id}>
              <div className="staff-request-heading">
                <div>
                  <span>Request #{request.id}</span>
                  <h2>{request.title}</h2>
                </div>
                <span
                  className={`maintenance-status status-${request.status?.toLowerCase()}`}
                >
                  {request.status?.replace('_', ' ')}
                </span>
              </div>

              <p>{request.description}</p>

              <div className="staff-request-meta">
                <span>Student: {request.studentName}</span>
                <span>Room: {request.roomNumber}</span>
                <span>Submitted: {formatDate(request.createdAt)}</span>
              </div>

              {request.resolvedAt && (
                <p className="staff-resolved-date">
                  Resolved: {formatDate(request.resolvedAt)}
                </p>
              )}

              {request.status !== 'RESOLVED' &&
                request.status !== 'REJECTED' && (
                  <div className="staff-request-actions">
                    {request.status === 'OPEN' && (
                      <button
                        className="staff-button staff-primary"
                        disabled={updatingId === request.id}
                        onClick={() =>
                          updateStatus(request.id, 'IN_PROGRESS')
                        }
                      >
                        {updatingId === request.id
                          ? 'Updating...'
                          : 'Start Work'}
                      </button>
                    )}

                    {request.status === 'IN_PROGRESS' && (
                      <button
                        className="staff-button staff-success"
                        disabled={updatingId === request.id}
                        onClick={() =>
                          updateStatus(request.id, 'RESOLVED')
                        }
                      >
                        {updatingId === request.id
                          ? 'Updating...'
                          : 'Mark Resolved'}
                      </button>
                    )}
                  </div>
                )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}