import { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  Edit,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from 'lucide-react';

import hostelService from '../../services/hostelService';
import './Hostels.css';

const emptyForm = {
  name: '',
  address: '',
  wardenName: '',
  contactNumber: '',
};

function getErrorMessage(error, fallback = 'Something went wrong.') {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

export default function Hostels() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingHostel, setEditingHostel] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  const loadHostels = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await hostelService.getAllHostels();
      setHostels(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load hostels.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHostels();
  }, []);

  const filteredHostels = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return hostels;
    }

    return hostels.filter(
      (hostel) =>
        hostel.name?.toLowerCase().includes(value) ||
        hostel.address?.toLowerCase().includes(value) ||
        hostel.wardenName?.toLowerCase().includes(value) ||
        hostel.contactNumber?.toLowerCase().includes(value)
    );
  }, [hostels, search]);

  const openCreateModal = () => {
    setEditingHostel(null);
    setForm(emptyForm);
    setFormError('');
    setError('');
    setSuccess('');
    setModalOpen(true);
  };

  const openEditModal = (hostel) => {
    setEditingHostel(hostel);

    setForm({
      name: hostel.name || '',
      address: hostel.address || '',
      wardenName: hostel.wardenName || '',
      contactNumber: hostel.contactNumber || '',
    });

    setFormError('');
    setError('');
    setSuccess('');
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingHostel(null);
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

    if (!form.name.trim()) {
      setFormError('Hostel name is required.');
      return;
    }

    if (!form.address.trim()) {
      setFormError('Hostel address is required.');
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        address: form.address.trim(),
        wardenName: form.wardenName.trim(),
        contactNumber: form.contactNumber.trim(),
      };

      if (editingHostel) {
        await hostelService.updateHostel(editingHostel.id, payload);
        setSuccess('Hostel updated successfully.');
      } else {
        await hostelService.createHostel(payload);
        setSuccess('Hostel created successfully.');
      }

      setModalOpen(false);
      setEditingHostel(null);
      setForm(emptyForm);

      await loadHostels();
    } catch (err) {
      setFormError(
        getErrorMessage(
          err,
          editingHostel
            ? 'Unable to update hostel.'
            : 'Unable to create hostel.'
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (hostel) => {
    const confirmed = window.confirm(
      `Delete "${hostel.name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setError('');
      setSuccess('');

      await hostelService.deleteHostel(hostel.id);

      setSuccess('Hostel deleted successfully.');
      await loadHostels();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          'Unable to delete hostel. It may still contain rooms or allocations.'
        )
      );
    }
  };

  return (
    <div className="hostels-page">
      <div className="hostels-header">
        <div>
          <div className="hostels-title-row">
            <Building2 size={28} />
            <h1>Hostel Management</h1>
          </div>

          <p>Manage hostel information and accommodation facilities.</p>
        </div>

        <div className="hostels-actions">
          <button
            className="hostels-btn hostels-btn-secondary"
            onClick={loadHostels}
            disabled={loading}
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <button
            className="hostels-btn hostels-btn-primary"
            onClick={openCreateModal}
          >
            <Plus size={18} />
            Add Hostel
          </button>
        </div>
      </div>

      {error && (
        <div className="hostels-alert hostels-alert-error">{error}</div>
      )}

      {success && (
        <div className="hostels-alert hostels-alert-success">{success}</div>
      )}

      <div className="hostels-toolbar">
        <div className="hostels-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search hostels..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <div className="hostels-card">
        {loading ? (
          <div className="hostels-state">
            <div className="hostels-spinner"></div>
            <p>Loading hostels...</p>
          </div>
        ) : filteredHostels.length === 0 ? (
          <div className="hostels-state">
            <Building2 size={44} />
            <h3>No hostels found</h3>
            <p>
              {search
                ? 'Try changing your search.'
                : 'Add your first hostel to get started.'}
            </p>
          </div>
        ) : (
          <div className="hostels-table-wrapper">
            <table className="hostels-table">
              <thead>
                <tr>
                  <th>Hostel</th>
                  <th>Address</th>
                  <th>Warden</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredHostels.map((hostel) => (
                  <tr key={hostel.id}>
                    <td>
                      <div className="hostel-name">
                        <div className="hostel-icon">
                          <Building2 size={18} />
                        </div>

                        <div>
                          <strong>{hostel.name}</strong>
                          <span>ID #{hostel.id}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="hostel-address">
                        <MapPin size={15} />
                        <span>{hostel.address}</span>
                      </div>
                    </td>

                    <td>{hostel.wardenName || '—'}</td>

                    <td>{hostel.contactNumber || '—'}</td>

                    <td>
                      <span
                        className={
                          hostel.isActive
                            ? 'hostel-status hostel-status-active'
                            : 'hostel-status hostel-status-inactive'
                        }
                      >
                        {hostel.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    <td>
                      <div className="hostel-row-actions">
                        <button
                          className="hostels-icon-btn"
                          title="Edit hostel"
                          onClick={() => openEditModal(hostel)}
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          className="hostels-icon-btn hostels-delete-btn"
                          title="Delete hostel"
                          onClick={() => handleDelete(hostel)}
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
        <div className="hostels-modal-backdrop" onMouseDown={closeModal}>
          <div
            className="hostels-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="hostels-modal-header">
              <div>
                <h2>{editingHostel ? 'Edit Hostel' : 'Add Hostel'}</h2>
                <p>
                  {editingHostel
                    ? 'Update hostel information.'
                    : 'Enter the details for the new hostel.'}
                </p>
              </div>

              <button
                className="hostels-close-btn"
                onClick={closeModal}
                disabled={saving}
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="hostels-alert hostels-alert-error">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="hostels-form-grid">
                <div className="hostels-form-group">
                  <label>
                    Hostel Name <span>*</span>
                  </label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    maxLength={100}
                    placeholder="e.g. Boys Hostel A"
                    disabled={saving}
                  />
                </div>

                <div className="hostels-form-group">
                  <label>Warden Name</label>

                  <input
                    name="wardenName"
                    value={form.wardenName}
                    onChange={handleChange}
                    maxLength={100}
                    placeholder="Enter warden name"
                    disabled={saving}
                  />
                </div>

                <div className="hostels-form-group hostels-full-width">
                  <label>
                    Address <span>*</span>
                  </label>

                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Enter complete hostel address"
                    disabled={saving}
                  />
                </div>

                <div className="hostels-form-group">
                  <label>Contact Number</label>

                  <input
                    name="contactNumber"
                    value={form.contactNumber}
                    onChange={handleChange}
                    maxLength={15}
                    placeholder="Enter contact number"
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="hostels-modal-footer">
                <button
                  type="button"
                  className="hostels-btn hostels-btn-secondary"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="hostels-btn hostels-btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? 'Saving...'
                    : editingHostel
                    ? 'Update Hostel'
                    : 'Create Hostel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}