import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Search,
  Plus,
  RefreshCw,
  Pencil,
  Trash2,
  Users as UsersIcon,
  X,
  Mail,
  Phone,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

import api from '../../services/api';
import userService from '../../services/userService';
import './Users.css';

const emptyForm = {
  name: '',
  email: '',
  mobile: '',
  password: '',
  address: '',
  dateOfBirth: '',
  roleId: '',
};

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  error.message ||
  'Something went wrong. Please try again.';

const formatDate = (value) => {
  if (!value) return '—';

  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [usersResult, rolesResult] = await Promise.all([
        userService.getAllUsers(),
        api.get('/roles'),
      ]);

      setUsers(Array.isArray(usersResult) ? usersResult : []);
      setRoles(Array.isArray(rolesResult.data) ? rolesResult.data : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredUsers = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !searchText ||
        user.name?.toLowerCase().includes(searchText) ||
        user.email?.toLowerCase().includes(searchText) ||
        user.mobile?.toLowerCase().includes(searchText);

      const matchesRole =
        roleFilter === 'ALL' ||
        user.role?.toUpperCase() === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const studentCount = users.filter(
    (user) => user.role?.toUpperCase() === 'STUDENT'
  ).length;

  const staffCount = users.filter(
    (user) => user.role?.toUpperCase() === 'MAINTENANCE'
  ).length;

  const openCreateModal = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    const matchingRole = roles.find(
      (role) => role.name === user.role
    );

    setEditingUser(user);
    setForm({
      name: user.name || '',
      email: user.email || '',
      mobile: user.mobile || '',
      password: '',
      address: user.address || '',
      dateOfBirth: user.dateOfBirth || '',
      roleId: matchingRole ? String(matchingRole.id) : '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingUser(null);
    setForm(emptyForm);
    setFormError('');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    setSuccess('');

    if (!form.name.trim()) {
      setFormError("Please enter the user's name.");
      return;
    }

    if (!form.email.trim()) {
      setFormError("Please enter the user's email.");
      return;
    }

    if (form.password.length < 8) {
      setFormError('Password must contain at least 8 characters.');
      return;
    }

    if (!form.roleId) {
      setFormError('Please select a role.');
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      mobile: form.mobile.trim(),
      password: form.password,
      address: form.address.trim(),
      dateOfBirth: form.dateOfBirth || null,
      roleId: Number(form.roleId),
    };

    setSaving(true);

    try {
      if (editingUser) {
        await userService.updateUser(editingUser.id, payload);
        setSuccess('User updated successfully.');
      } else {
        await userService.createUser(payload);
        setSuccess('User created successfully.');
      }

      setModalOpen(false);
      setEditingUser(null);
      setForm(emptyForm);
      await loadData();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}? This action cannot be undone.`
    );

    if (!confirmed) return;

    setError('');
    setSuccess('');

    try {
      await userService.deleteUser(user.id);
      setSuccess(`${user.name} was deleted successfully.`);
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="users-page">
      <div className="users-heading">
        <div>
          <span className="users-eyebrow">ADMINISTRATION</span>
          <h1>User Management</h1>
          <p>Manage accounts, contact information and access roles.</p>
        </div>

        <div className="users-heading-actions">
          <button
            className="users-btn users-btn-secondary"
            onClick={loadData}
            disabled={loading}
            type="button"
          >
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            Refresh
          </button>

          <button
            className="users-btn users-btn-primary"
            onClick={openCreateModal}
            type="button"
          >
            <Plus size={17} />
            Add user
          </button>
        </div>
      </div>

      {success && (
        <div className="users-alert users-alert-success">
          <ShieldCheck size={18} />
          {success}
          <button onClick={() => setSuccess('')} type="button">
            <X size={16} />
          </button>
        </div>
      )}

      {error && (
        <div className="users-alert users-alert-error">
          <AlertCircle size={18} />
          {error}
          <button onClick={() => setError('')} type="button">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="users-stats">
        <div className="users-stat-card">
          <div className="users-stat-icon users-icon-blue">
            <UsersIcon size={21} />
          </div>
          <div>
            <span>Total users</span>
            <strong>{users.length}</strong>
          </div>
        </div>

        <div className="users-stat-card">
          <div className="users-stat-icon users-icon-green">
            <UsersIcon size={21} />
          </div>
          <div>
            <span>Students</span>
            <strong>{studentCount}</strong>
          </div>
        </div>

        <div className="users-stat-card">
          <div className="users-stat-icon users-icon-purple">
            <ShieldCheck size={21} />
          </div>
          <div>
            <span>Maintenance staff</span>
            <strong>{staffCount}</strong>
          </div>
        </div>
      </div>

      <section className="users-panel">
        <div className="users-panel-heading">
          <div>
            <h2>All users</h2>
            <p>{filteredUsers.length} user(s) found</p>
          </div>
        </div>

        <div className="users-toolbar">
          <div className="users-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by name, email or mobile..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            className="users-role-filter"
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
          >
            <option value="ALL">All roles</option>
            {roles.map((role) => (
              <option key={role.id} value={role.name}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="users-state">
            <RefreshCw className="spin" size={25} />
            <p>Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="users-state">
            <UsersIcon size={32} />
            <h3>No users found</h3>
            <p>Try changing your search or add a new user.</p>
          </div>
        ) : (
          <div className="users-table-wrap">
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Contact</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th className="users-actions-column">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="users-identity">
                        <div className="users-avatar">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <strong>{user.name}</strong>
                          <span> ID: #{user.id}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="users-contact">
                        <span><Mail size={14} /> {user.email}</span>
                        <span><Phone size={14} /> {user.mobile || 'Not provided'}</span>
                      </div>
                    </td>

                    <td>
                      <span className={`users-role users-role-${user.role?.toLowerCase()}`}>
                        {user.role || 'UNKNOWN'}
                      </span>
                    </td>

                    <td>{formatDate(user.createdAt)}</td>

                    <td>
                      <span className={`users-status ${user.isActive ? 'is-active' : 'is-inactive'}`}>
                        <span />
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    <td>
                      <div className="users-row-actions">
                        <button
                          type="button"
                          title="Edit user"
                          onClick={() => openEditModal(user)}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          title="Delete user"
                          className="users-delete-action"
                          onClick={() => handleDelete(user)}
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
      </section>

      {modalOpen && (
        <div className="users-modal-backdrop" onMouseDown={closeModal}>
          <section
            className="users-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="users-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="users-modal-header">
              <div>
                <span className="users-eyebrow">USER DIRECTORY</span>
                <h2 id="users-modal-title">
                  {editingUser ? 'Edit user' : 'Create new user'}
                </h2>
                <p>
                  {editingUser
                    ? 'Update the account information and set a new password.'
                    : 'Enter the details to create a new account.'}
                </p>
              </div>

              <button
                type="button"
                className="users-modal-close"
                onClick={closeModal}
                disabled={saving}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="users-form-grid">
                <label>
                  Full name *
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    maxLength={100}
                    required
                  />
                </label>

                <label>
                  Email address *
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    maxLength={100}
                    required
                  />
                </label>

                <label>
                  Mobile number
                  <input
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                    maxLength={15}
                  />
                </label>

                <label>
                  Date of birth
                  <input
                    name="dateOfBirth"
                    type="date"
                    value={form.dateOfBirth}
                    onChange={handleChange}
                  />
                </label>

                <label className="users-form-full">
                  Address
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter address"
                    rows={2}
                  />
                </label>

                <label>
                  {editingUser ? 'New password *' : 'Password *'}
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Minimum 8 characters"
                    minLength={8}
                    autoComplete="new-password"
                    required
                  />
                </label>

                <label>
                  Role *
                  <select
                    name="roleId"
                    value={form.roleId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {formError && (
                <div className="users-form-error">
                  <AlertCircle size={16} />
                  {formError}
                </div>
              )}

              <div className="users-modal-footer">
                <button
                  type="button"
                  className="users-btn users-btn-secondary"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="users-btn users-btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? 'Saving...'
                    : editingUser
                      ? 'Save changes'
                      : 'Create user'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};

export default Users;