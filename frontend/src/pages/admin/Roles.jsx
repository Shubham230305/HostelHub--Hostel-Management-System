import { useEffect, useMemo, useState } from 'react';
import {
  Edit,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';

import roleService from '../../services/roleService';
import './Roles.css';

const emptyForm = {
  name: '',
  description: '',
};

function getErrorMessage(error, fallback = 'Something went wrong.') {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  const loadRoles = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await roleService.getAllRoles();
      setRoles(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load roles.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const filteredRoles = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return roles;
    }

    return roles.filter(
      (role) =>
        role.name?.toLowerCase().includes(value) ||
        role.description?.toLowerCase().includes(value)
    );
  }, [roles, search]);

  const openCreateModal = () => {
    setEditingRole(null);
    setForm(emptyForm);
    setFormError('');
    setError('');
    setSuccess('');
    setModalOpen(true);
  };

  const openEditModal = (role) => {
    setEditingRole(role);
    setForm({
      name: role.name || '',
      description: role.description || '',
    });
    setFormError('');
    setError('');
    setSuccess('');
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingRole(null);
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
      setFormError('Role name is required.');
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
      };

      if (editingRole) {
        await roleService.updateRole(editingRole.id, payload);
        setSuccess('Role updated successfully.');
      } else {
        await roleService.createRole(payload);
        setSuccess('Role created successfully.');
      }

      setModalOpen(false);
      setEditingRole(null);
      setForm(emptyForm);

      await loadRoles();
    } catch (err) {
      setFormError(
        getErrorMessage(
          err,
          editingRole ? 'Unable to update role.' : 'Unable to create role.'
        )
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="roles-page">
      <div className="roles-header">
        <div>
          <div className="roles-title-row">
            <ShieldCheck size={28} />
            <h1>Role Management</h1>
          </div>

          <p>Manage the roles available in HostelHub.</p>
        </div>

        <div className="roles-actions">
          <button
            className="roles-btn roles-btn-secondary"
            onClick={loadRoles}
            disabled={loading}
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <button
            className="roles-btn roles-btn-primary"
            onClick={openCreateModal}
          >
            <Plus size={18} />
            Add Role
          </button>
        </div>
      </div>

      {error && <div className="roles-alert roles-alert-error">{error}</div>}

      {success && (
        <div className="roles-alert roles-alert-success">{success}</div>
      )}

      <div className="roles-toolbar">
        <div className="roles-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search roles..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <div className="roles-card">
        {loading ? (
          <div className="roles-state">
            <div className="roles-spinner"></div>
            <p>Loading roles...</p>
          </div>
        ) : filteredRoles.length === 0 ? (
          <div className="roles-state">
            <ShieldCheck size={42} />
            <h3>No roles found</h3>
            <p>
              {search
                ? 'Try changing your search.'
                : 'No roles are currently available.'}
            </p>
          </div>
        ) : (
          <div className="roles-table-wrapper">
            <table className="roles-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Role</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredRoles.map((role) => (
                  <tr key={role.id}>
                    <td>#{role.id}</td>

                    <td>
                      <span className={`role-pill role-${role.name?.toLowerCase()}`}>
                        {role.name}
                      </span>
                    </td>

                    <td>
                      {role.description || (
                        <span className="roles-muted">No description</span>
                      )}
                    </td>

                    <td>
                      <button
                        className="roles-icon-btn"
                        title="Edit role"
                        onClick={() => openEditModal(role)}
                      >
                        <Edit size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="roles-modal-backdrop" onMouseDown={closeModal}>
          <div
            className="roles-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="roles-modal-header">
              <div>
                <h2>{editingRole ? 'Edit Role' : 'Create Role'}</h2>
                <p>
                  {editingRole
                    ? 'Update the selected role.'
                    : 'Add a new role to HostelHub.'}
                </p>
              </div>

              <button
                className="roles-close-btn"
                onClick={closeModal}
                disabled={saving}
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="roles-alert roles-alert-error">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="roles-form-group">
                <label htmlFor="role-name">
                  Role Name <span>*</span>
                </label>

                <input
                  id="role-name"
                  name="name"
                  type="text"
                  maxLength={50}
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. STUDENT"
                  disabled={saving}
                />
              </div>

              <div className="roles-form-group">
                <label htmlFor="role-description">Description</label>

                <textarea
                  id="role-description"
                  name="description"
                  rows="4"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the responsibilities of this role"
                  disabled={saving}
                />
              </div>

              <div className="roles-modal-footer">
                <button
                  type="button"
                  className="roles-btn roles-btn-secondary"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="roles-btn roles-btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? 'Saving...'
                    : editingRole
                    ? 'Update Role'
                    : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}