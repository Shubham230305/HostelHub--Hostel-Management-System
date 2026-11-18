import { useEffect, useMemo, useState } from 'react';
import {
  Edit,
  Home,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from 'lucide-react';

import roomService from '../../services/roomService';
import hostelService from '../../services/hostelService';
import './Rooms.css';

const emptyForm = {
  roomNumber: '',
  floorNumber: '',
  capacity: '',
  hostelId: '',
};

function getErrorMessage(error, fallback = 'Something went wrong.') {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [hostels, setHostels] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [search, setSearch] = useState('');
  const [hostelFilter, setHostelFilter] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [roomData, hostelData] = await Promise.all([
        roomService.getAllRooms(),
        hostelService.getAllHostels(),
      ]);

      setRooms(Array.isArray(roomData) ? roomData : []);
      setHostels(Array.isArray(hostelData) ? hostelData : []);
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load rooms and hostels.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredRooms = useMemo(() => {
    const value = search.trim().toLowerCase();

    return rooms.filter((room) => {
      const matchesSearch =
        !value ||
        room.roomNumber?.toLowerCase().includes(value) ||
        room.hostelName?.toLowerCase().includes(value);

      const matchesHostel =
        !hostelFilter || String(room.hostelId) === String(hostelFilter);

      return matchesSearch && matchesHostel;
    });
  }, [rooms, search, hostelFilter]);

  const openCreateModal = () => {
    setEditingRoom(null);

    setForm({
      ...emptyForm,
      hostelId: hostels.length === 1 ? String(hostels[0].id) : '',
    });

    setFormError('');
    setError('');
    setSuccess('');
    setModalOpen(true);
  };

  const openEditModal = (room) => {
    setEditingRoom(room);

    setForm({
      roomNumber: room.roomNumber || '',
      floorNumber:
        room.floorNumber !== null && room.floorNumber !== undefined
          ? String(room.floorNumber)
          : '',
      capacity:
        room.capacity !== null && room.capacity !== undefined
          ? String(room.capacity)
          : '',
      hostelId: room.hostelId ? String(room.hostelId) : '',
    });

    setFormError('');
    setError('');
    setSuccess('');
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingRoom(null);
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormError('');
    setError('');
    setSuccess('');

    if (!form.roomNumber.trim()) {
      setFormError('Room number is required.');
      return;
    }

    if (form.floorNumber === '') {
      setFormError('Floor number is required.');
      return;
    }

    if (Number(form.floorNumber) < 0) {
      setFormError('Floor number cannot be negative.');
      return;
    }

    if (form.capacity === '') {
      setFormError('Room capacity is required.');
      return;
    }

    if (Number(form.capacity) < 1) {
      setFormError('Room capacity must be at least 1.');
      return;
    }

    if (!form.hostelId) {
      setFormError('Please select a hostel.');
      return;
    }

    if (
      editingRoom &&
      editingRoom.occupiedBeds &&
      Number(form.capacity) < editingRoom.occupiedBeds
    ) {
      setFormError(
        `Capacity cannot be less than the current occupied beds (${editingRoom.occupiedBeds}).`
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        roomNumber: form.roomNumber.trim(),
        floorNumber: Number(form.floorNumber),
        capacity: Number(form.capacity),
        hostelId: Number(form.hostelId),
      };

      if (editingRoom) {
        await roomService.updateRoom(editingRoom.id, payload);
        setSuccess('Room updated successfully.');
      } else {
        await roomService.createRoom(payload);
        setSuccess('Room created successfully.');
      }

      setModalOpen(false);
      setEditingRoom(null);
      setForm(emptyForm);

      await loadData();
    } catch (err) {
      setFormError(
        getErrorMessage(
          err,
          editingRoom ? 'Unable to update room.' : 'Unable to create room.'
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (room) => {
    const confirmed = window.confirm(
      `Delete room ${room.roomNumber}?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setError('');
      setSuccess('');

      await roomService.deleteRoom(room.id);

      setSuccess('Room deleted successfully.');
      await loadData();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          'Unable to delete room. Make sure it is not being used by an allocation.'
        )
      );
    }
  };

  const getOccupancyText = (room) => {
    const occupied = room.occupiedBeds || 0;
    const capacity = room.capacity || 0;

    return `${occupied} / ${capacity}`;
  };

  return (
    <div className="rooms-page">
      <div className="rooms-header">
        <div>
          <div className="rooms-title-row">
            <Home size={28} />
            <h1>Room Management</h1>
          </div>

          <p>Manage hostel rooms, capacity and availability.</p>
        </div>

        <div className="rooms-actions">
          <button
            className="rooms-btn rooms-btn-secondary"
            onClick={loadData}
            disabled={loading}
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <button
            className="rooms-btn rooms-btn-primary"
            onClick={openCreateModal}
            disabled={hostels.length === 0}
          >
            <Plus size={18} />
            Add Room
          </button>
        </div>
      </div>

      {error && <div className="rooms-alert rooms-alert-error">{error}</div>}

      {success && (
        <div className="rooms-alert rooms-alert-success">{success}</div>
      )}

      <div className="rooms-toolbar">
        <div className="rooms-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search room or hostel..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select
          value={hostelFilter}
          onChange={(event) => setHostelFilter(event.target.value)}
          className="rooms-filter"
        >
          <option value="">All Hostels</option>

          {hostels.map((hostel) => (
            <option key={hostel.id} value={hostel.id}>
              {hostel.name}
            </option>
          ))}
        </select>
      </div>

      {hostels.length === 0 && !loading && (
        <div className="rooms-alert rooms-alert-warning">
          No hostels are available. Create a hostel before adding rooms.
        </div>
      )}

      <div className="rooms-card">
        {loading ? (
          <div className="rooms-state">
            <div className="rooms-spinner"></div>
            <p>Loading rooms...</p>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="rooms-state">
            <Home size={44} />
            <h3>No rooms found</h3>
            <p>
              {search || hostelFilter
                ? 'Try changing your search or filter.'
                : 'Add your first room to get started.'}
            </p>
          </div>
        ) : (
          <div className="rooms-table-wrapper">
            <table className="rooms-table">
              <thead>
                <tr>
                  <th>Room</th>
                  <th>Hostel</th>
                  <th>Floor</th>
                  <th>Capacity</th>
                  <th>Occupancy</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredRooms.map((room) => (
                  <tr key={room.id}>
                    <td>
                      <div className="room-number">
                        <div className="room-icon">
                          <Home size={17} />
                        </div>

                        <div>
                          <strong>{room.roomNumber}</strong>
                          <span>ID #{room.id}</span>
                        </div>
                      </div>
                    </td>

                    <td>{room.hostelName || '—'}</td>

                    <td>Floor {room.floorNumber}</td>

                    <td>{room.capacity}</td>

                    <td>
                      <div className="room-occupancy">
                        <strong>{getOccupancyText(room)}</strong>

                        <div className="occupancy-bar">
                          <div
                            className="occupancy-fill"
                            style={{
                              width: `${Math.min(
                                ((room.occupiedBeds || 0) /
                                  Math.max(room.capacity || 1, 1)) *
                                  100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span
                        className={
                          room.isAvailable
                            ? 'room-status room-status-available'
                            : 'room-status room-status-full'
                        }
                      >
                        {room.isAvailable ? 'Available' : 'Full'}
                      </span>
                    </td>

                    <td>
                      <div className="room-row-actions">
                        <button
                          className="rooms-icon-btn"
                          title="Edit room"
                          onClick={() => openEditModal(room)}
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          className="rooms-icon-btn rooms-delete-btn"
                          title="Delete room"
                          onClick={() => handleDelete(room)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="rooms-modal-backdrop" onMouseDown={closeModal}>
          <div
            className="rooms-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="rooms-modal-header">
              <div>
                <h2>{editingRoom ? 'Edit Room' : 'Add Room'}</h2>
                <p>
                  {editingRoom
                    ? 'Update room information.'
                    : 'Enter the details for the new room.'}
                </p>
              </div>

              <button
                className="rooms-close-btn"
                onClick={closeModal}
                disabled={saving}
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="rooms-alert rooms-alert-error">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="rooms-form-grid">
                <div className="rooms-form-group">
                  <label>
                    Room Number <span>*</span>
                  </label>

                  <input
                    name="roomNumber"
                    value={form.roomNumber}
                    onChange={handleChange}
                    placeholder="e.g. 101"
                    disabled={saving}
                  />
                </div>

                <div className="rooms-form-group">
                  <label>
                    Floor Number <span>*</span>
                  </label>

                  <input
                    name="floorNumber"
                    type="number"
                    min="0"
                    value={form.floorNumber}
                    onChange={handleChange}
                    placeholder="e.g. 1"
                    disabled={saving}
                  />
                </div>

                <div className="rooms-form-group">
                  <label>
                    Capacity <span>*</span>
                  </label>

                  <input
                    name="capacity"
                    type="number"
                    min="1"
                    value={form.capacity}
                    onChange={handleChange}
                    placeholder="e.g. 3"
                    disabled={saving}
                  />
                </div>

                <div className="rooms-form-group">
                  <label>
                    Hostel <span>*</span>
                  </label>

                  <select
                    name="hostelId"
                    value={form.hostelId}
                    onChange={handleChange}
                    disabled={saving}
                  >
                    <option value="">Select hostel</option>

                    {hostels.map((hostel) => (
                      <option key={hostel.id} value={hostel.id}>
                        {hostel.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {editingRoom && (
                <div className="rooms-info">
                  <strong>Current occupancy:</strong>{' '}
                  {editingRoom.occupiedBeds || 0} /{' '}
                  {editingRoom.capacity || 0} beds
                </div>
              )}

              <div className="rooms-modal-footer">
                <button
                  type="button"
                  className="rooms-btn rooms-btn-secondary"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rooms-btn rooms-btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? 'Saving...'
                    : editingRoom
                    ? 'Update Room'
                    : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}