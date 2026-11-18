import { useEffect, useMemo, useState } from 'react';
import {
  ClipboardList,
  RefreshCw,
  Search,
  UserRound,
  Wrench,
  X,
} from 'lucide-react';

import maintenanceService from '../../services/maintenanceService';
import userService from '../../services/userService';
import './Maintenance.css';

const STATUS_OPTIONS = [
  'OPEN',
  'IN_PROGRESS',
  'RESOLVED',
  'REJECTED',
];

function getErrorMessage(error, fallback = 'Something went wrong.') {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

function formatDate(value) {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function Maintenance() {
  const [requests, setRequests] = useState([]);
  const [staff, setStaff] = useState([]);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [requestData, userData] = await Promise.all([
        maintenanceService.getAllRequests(),
        userService.getAllUsers(),
      ]);

      setRequests(
        Array.isArray(requestData) ? requestData : []
      );

      setStaff(
        Array.isArray(userData)
          ? userData.filter(
              (user) =>
                user.role?.toUpperCase() === 'MAINTENANCE'
            )
          : []
      );
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          'Unable to load maintenance requests.'
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredRequests = useMemo(() => {
    const value = search.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesSearch =
        !value ||
        request.title?.toLowerCase().includes(value) ||
        request.description?.toLowerCase().includes(value) ||
        request.studentName?.toLowerCase().includes(value) ||
        request.roomNumber?.toLowerCase().includes(value);

      const matchesStatus =
        statusFilter === 'ALL' ||
        request.status?.toUpperCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, search, statusFilter]);

  const openDetails = (request) => {
    setSelectedRequest(request);
    setNewStatus(request.status?.toUpperCase() || 'OPEN');
    setSelectedStaffId(
      request.assignedToId ? String(request.assignedToId) : ''
    );
    setError('');
    setSuccess('');
  };

  const closeDetails = () => {
    if (updating) return;

    setSelectedRequest(null);
    setNewStatus('');
    setSelectedStaffId('');
  };

  const handleUpdate = async () => {
    if (!selectedRequest) return;

    try {
      setUpdating(true);
      setError('');
      setSuccess('');

      if (
        selectedStaffId &&
        String(selectedStaffId) !==
          String(selectedRequest.assignedToId || '')
      ) {
        await maintenanceService.assignRequest(
          selectedRequest.id,
          Number(selectedStaffId)
        );
      }

      if (
        newStatus &&
        newStatus !== selectedRequest.status?.toUpperCase()
      ) {
        await maintenanceService.updateStatus(
          selectedRequest.id,
          newStatus
        );
      }

      setSuccess('Maintenance request updated successfully.');

      await loadData();

      const refreshedRequest = requests.find(
        (request) => request.id === selectedRequest.id
      );

      if (refreshedRequest) {
        setSelectedRequest({
          ...refreshedRequest,
          status: newStatus,
          assignedToId: selectedStaffId
            ? Number(selectedStaffId)
            : selectedRequest.assignedToId,
        });
      }
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          'Unable to update maintenance request.'
        )
      );
    } finally {
      setUpdating(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
      case 'OPEN':
        return 'maintenance-status maintenance-status-open';

      case 'IN_PROGRESS':
        return 'maintenance-status maintenance-status-progress';

      case 'RESOLVED':
        return 'maintenance-status maintenance-status-resolved';

      case 'REJECTED':
        return 'maintenance-status maintenance-status-rejected';

      default:
        return 'maintenance-status';
    }
  };

  return (
    <div className="maintenance-page">
      <div className="maintenance-header">
        <div>
          <div className="maintenance-title-row">
            <Wrench size={28} />
            <h1>Maintenance Requests</h1>
          </div>

          <p>
            Review, assign and manage hostel maintenance requests.
          </p>
        </div>

        <button
          className="maintenance-btn maintenance-btn-secondary"
          onClick={loadData}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="maintenance-alert maintenance-alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="maintenance-alert maintenance-alert-success">
          {success}
        </div>
      )}

      <div className="maintenance-toolbar">
        <div className="maintenance-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search requests..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select
          className="maintenance-filter"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="ALL">All Statuses</option>

          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      <div className="maintenance-card">
        {loading ? (
          <div className="maintenance-state">
            <div className="maintenance-spinner"></div>
            <p>Loading maintenance requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="maintenance-state">
            <ClipboardList size={44} />
            <h3>No maintenance requests found</h3>
            <p>
              {search || statusFilter !== 'ALL'
                ? 'Try changing your search or filter.'
                : 'There are no maintenance requests.'}
            </p>
          </div>
        ) : (
          <div className="maintenance-table-wrapper">
            <table className="maintenance-table">
              <thead>
                <tr>
                  <th>Request</th>
                  <th>Student</th>
                  <th>Room</th>
                  <th>Assigned To</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <div className="maintenance-request">
                        <strong>{request.title}</strong>

                        <span>
                          {request.description
                            ? request.description.length > 60
                              ? `${request.description.substring(
                                  0,
                                  60
                                )}...`
                              : request.description
                            : 'No description'}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="maintenance-person">
                        <UserRound size={16} />
                        {request.studentName || '—'}
                      </div>
                    </td>

                    <td>{request.roomNumber || '—'}</td>

                    <td>
                      {request.assignedToName || (
                        <span className="maintenance-unassigned">
                          Unassigned
                        </span>
                      )}
                    </td>

                    <td>
                      <span className={getStatusClass(request.status)}>
                        {request.status?.replace('_', ' ') || '—'}
                      </span>
                    </td>

                    <td>{formatDate(request.createdAt)}</td>

                    <td>
                      <button
                        className="maintenance-view-btn"
                        onClick={() => openDetails(request)}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedRequest && (
        <div
          className="maintenance-modal-backdrop"
          onMouseDown={closeDetails}
        >
          <div
            className="maintenance-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="maintenance-modal-header">
              <div>
                <h2>{selectedRequest.title}</h2>
                <p>
                  Request #{selectedRequest.id}
                </p>
              </div>

              <button
                className="maintenance-close-btn"
                onClick={closeDetails}
                disabled={updating}
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="maintenance-alert maintenance-alert-error">
                {error}
              </div>
            )}

            {success && (
              <div className="maintenance-alert maintenance-alert-success">
                {success}
              </div>
            )}

            <div className="maintenance-details">
              <div className="maintenance-detail-block">
                <label>Description</label>
                <p>
                  {selectedRequest.description ||
                    'No description provided.'}
                </p>
              </div>

              <div className="maintenance-detail-grid">
                <div>
                  <label>Student</label>
                  <p>{selectedRequest.studentName || '—'}</p>
                </div>

                <div>
                  <label>Room</label>
                  <p>{selectedRequest.roomNumber || '—'}</p>
                </div>

                <div>
                  <label>Created</label>
                  <p>{formatDate(selectedRequest.createdAt)}</p>
                </div>

                <div>
                  <label>Resolved</label>
                  <p>{formatDate(selectedRequest.resolvedAt)}</p>
                </div>
              </div>

              <div className="maintenance-form-group">
                <label>Assign Maintenance Staff</label>

                <select
                  value={selectedStaffId}
                  onChange={(event) =>
                    setSelectedStaffId(event.target.value)
                  }
                  disabled={updating}
                >
                  <option value="">Unassigned</option>

                  {staff.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} — {member.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="maintenance-form-group">
                <label>Request Status</label>

                <select
                  value={newStatus}
                  onChange={(event) =>
                    setNewStatus(event.target.value)
                  }
                  disabled={updating}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="maintenance-modal-footer">
              <button
                className="maintenance-btn maintenance-btn-secondary"
                onClick={closeDetails}
                disabled={updating}
              >
                Cancel
              </button>

              <button
                className="maintenance-btn maintenance-btn-primary"
                onClick={handleUpdate}
                disabled={updating}
              >
                {updating ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}