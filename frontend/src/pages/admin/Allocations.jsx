import { useEffect, useMemo, useState } from 'react';
import {
  BedDouble,
  Plus,
  RefreshCw,
  Search,
  UserRound,
  X,
} from 'lucide-react';

import allocationService from '../../services/allocationService';
import userService from '../../services/userService';
import roomService from '../../services/roomService';
import './Allocations.css';

const emptyForm = {
  studentId: '',
  roomId: '',
};

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

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function Allocations() {
  const [allocations, setAllocations] = useState([]);
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [allocationData, userData, roomData] = await Promise.all([
        allocationService.getAllAllocations(),
        userService.getAllUsers(),
        roomService.getAllRooms(),
      ]);

      setAllocations(
        Array.isArray(allocationData) ? allocationData : []
      );

      setStudents(
        Array.isArray(userData)
          ? userData.filter(
              (user) =>
                user.role?.toUpperCase() === 'STUDENT'
            )
          : []
      );

      setRooms(Array.isArray(roomData) ? roomData : []);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          'Unable to load allocations, students and rooms.'
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredAllocations = useMemo(() => {
    const value = search.trim().toLowerCase();

    return allocations.filter((allocation) => {
      const matchesSearch =
        !value ||
        allocation.studentName?.toLowerCase().includes(value) ||
        allocation.roomNumber?.toLowerCase().includes(value) ||
        allocation.hostelName?.toLowerCase().includes(value);

      const allocationStatus =
        allocation.status?.toUpperCase() ||
        (allocation.active ? 'ACTIVE' : 'VACATED');

      const matchesStatus =
        statusFilter === 'ALL' ||
        allocationStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [allocations, search, statusFilter]);

  const openCreateModal = () => {
    setForm(emptyForm);
    setFormError('');
    setError('');
    setSuccess('');
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setForm(emptyForm);
    setFormError('');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const availableRooms = rooms.filter(
    (room) =>
      room.isAvailable !== false &&
      (room.occupiedBeds || 0) < (room.capacity || 0)
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormError('');
    setError('');
    setSuccess('');

    if (!form.studentId) {
      setFormError('Please select a student.');
      return;
    }

    if (!form.roomId) {
      setFormError('Please select a room.');
      return;
    }

    try {
      setSaving(true);

      const payload = {
        studentId: Number(form.studentId),
        roomId: Number(form.roomId),
      };

      await allocationService.createAllocation(payload);

      setSuccess('Room allocation created successfully.');
      setModalOpen(false);
      setForm(emptyForm);

      await loadData();
    } catch (err) {
      setFormError(
        getErrorMessage(
          err,
          'Unable to create room allocation.'
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const handleVacate = async (allocation) => {
    const confirmed = window.confirm(
      `Vacate room ${allocation.roomNumber} for ${allocation.studentName}?`
    );

    if (!confirmed) return;

    try {
      setError('');
      setSuccess('');

      await allocationService.vacateAllocation(allocation.id);

      setSuccess('Room allocation vacated successfully.');
      await loadData();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          'Unable to vacate this allocation.'
        )
      );
    }
  };

  const getStatus = (allocation) => {
    if (allocation.status) {
      return allocation.status.toUpperCase();
    }

    return allocation.active ? 'ACTIVE' : 'VACATED';
  };

  return (
    <div className="allocations-page">
      <div className="allocations-header">
        <div>
          <div className="allocations-title-row">
            <BedDouble size={28} />
            <h1>Room Allocations</h1>
          </div>

          <p>
            Allocate rooms to students and manage current occupancy.
          </p>
        </div>

        <div className="allocations-actions">
          <button
            className="allocations-btn allocations-btn-secondary"
            onClick={loadData}
            disabled={loading}
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <button
            className="allocations-btn allocations-btn-primary"
            onClick={openCreateModal}
          >
            <Plus size={18} />
            New Allocation
          </button>
        </div>
      </div>

      {error && (
        <div className="allocations-alert allocations-alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="allocations-alert allocations-alert-success">
          {success}
        </div>
      )}

      <div className="allocations-toolbar">
        <div className="allocations-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search student, room or hostel..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select
          className="allocations-filter"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="VACATED">Vacated</option>
        </select>
      </div>

      <div className="allocations-card">
        {loading ? (
          <div className="allocations-state">
            <div className="allocations-spinner"></div>
            <p>Loading allocations...</p>
          </div>
        ) : filteredAllocations.length === 0 ? (
          <div className="allocations-state">
            <BedDouble size={44} />
            <h3>No allocations found</h3>
            <p>
              {search || statusFilter !== 'ALL'
                ? 'Try changing your search or filter.'
                : 'No room allocations are currently available.'}
            </p>
          </div>
        ) : (
          <div className="allocations-table-wrapper">
            <table className="allocations-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Room</th>
                  <th>Hostel</th>
                  <th>Allocated On</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredAllocations.map((allocation) => {
                  const status = getStatus(allocation);

                  return (
                    <tr key={allocation.id}>
                      <td>
                        <div className="allocation-student">
                          <div className="allocation-avatar">
                            <UserRound size={17} />
                          </div>

                          <div>
                            <strong>
                              {allocation.studentName || 'Unknown Student'}
                            </strong>

                            <span>
                              Student ID #{allocation.studentId}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <strong>{allocation.roomNumber || '—'}</strong>
                      </td>

                      <td>{allocation.hostelName || '—'}</td>

                      <td>{formatDate(allocation.allocatedAt || allocation.createdAt)}</td>

                      <td>
                        <span
                          className={
                            status === 'ACTIVE'
                              ? 'allocation-status allocation-status-active'
                              : 'allocation-status allocation-status-vacated'
                          }
                        >
                          {status}
                        </span>
                      </td>

                      <td>
                        {status === 'ACTIVE' ? (
                          <button
                            className="allocation-vacate-btn"
                            onClick={() => handleVacate(allocation)}
                          >
                            Vacate
                          </button>
                        ) : (
                          <span className="allocation-muted">Completed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div
          className="allocations-modal-backdrop"
          onMouseDown={closeModal}
        >
          <div
            className="allocations-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="allocations-modal-header">
              <div>
                <h2>New Room Allocation</h2>
                <p>Assign an available room to a student.</p>
              </div>

              <button
                className="allocations-close-btn"
                onClick={closeModal}
                disabled={saving}
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="allocations-alert allocations-alert-error">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="allocations-form-group">
                <label>
                  Student <span>*</span>
                </label>

                <select
                  name="studentId"
                  value={form.studentId}
                  onChange={handleChange}
                  disabled={saving}
                >
                  <option value="">Select student</option>

                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} — {student.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="allocations-form-group">
                <label>
                  Room <span>*</span>
                </label>

                <select
                  name="roomId"
                  value={form.roomId}
                  onChange={handleChange}
                  disabled={saving}
                >
                  <option value="">Select available room</option>

                  {availableRooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      Room {room.roomNumber} — {room.hostelName} (
                      {room.occupiedBeds || 0}/{room.capacity})
                    </option>
                  ))}
                </select>
              </div>

              {availableRooms.length === 0 && (
                <div className="allocations-info">
                  No rooms currently have available beds.
                </div>
              )}

              <div className="allocations-modal-footer">
                <button
                  type="button"
                  className="allocations-btn allocations-btn-secondary"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="allocations-btn allocations-btn-primary"
                  disabled={saving || availableRooms.length === 0}
                >
                  {saving ? 'Allocating...' : 'Allocate Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}