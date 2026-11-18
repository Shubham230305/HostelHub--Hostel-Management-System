import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft } from 'lucide-react';

import studentService from '../../services/studentService';
import maintenanceService from '../../services/maintenanceService';
import './StudentMaintenance.css';

export default function CreateMaintenance() {
  const navigate = useNavigate();

  const [allocation, setAllocation] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadAllocation = async () => {
      try {
        setLoading(true);
        const data = await studentService.getMyAllocation();
        setAllocation(data);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
          'Unable to find your active room allocation.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadAllocation();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!allocation?.roomId) {
      setError('An active room allocation is required.');
      return;
    }

    if (title.trim().length > 100) {
      setError('Title cannot exceed 100 characters.');
      return;
    }

    if (description.trim().length > 1000) {
      setError('Description cannot exceed 1000 characters.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      await maintenanceService.createMyRequest({
        title: title.trim(),
        description: description.trim(),
        roomId: allocation.roomId,
      });

      setSuccess('Maintenance request submitted successfully.');

      setTimeout(() => {
        navigate('/student/maintenance');
      }, 900);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Unable to submit maintenance request.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="maintenance-page">Loading room details...</div>;
  }

  return (
    <div className="maintenance-page">
      <div className="maintenance-page-header">
        <div>
          <h1>Create Maintenance Request</h1>
          <p>Report a problem in your allocated room.</p>
        </div>

        <button
          className="maintenance-button"
          onClick={() => navigate('/student/maintenance')}
        >
          <ArrowLeft size={16} /> My Requests
        </button>
      </div>

      {error && <div className="maintenance-alert">{error}</div>}
      {success && <div className="maintenance-success">{success}</div>}

      {!allocation ? (
        <section className="maintenance-form-card">
          <h2>No Active Room Allocation</h2>
          <p>
            You need an active room allocation before submitting a
            maintenance request.
          </p>
        </section>
      ) : (
        <form className="maintenance-form-card" onSubmit={handleSubmit}>
          <h2>Room Information</h2>

          <div className="maintenance-allocation-info">
            <div>
              <span>Hostel</span>
              <strong>{allocation.hostelName}</strong>
            </div>
            <div>
              <span>Room</span>
              <strong>{allocation.roomNumber}</strong>
            </div>
          </div>

          <div className="maintenance-form-divider" />

          <h2>Request Details</h2>

          <label className="maintenance-field">
            <span>Request Title *</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Water leakage in bathroom"
              maxLength={100}
              required
            />
            <small>{title.length}/100 characters</small>
          </label>

          <label className="maintenance-field">
            <span>Description *</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              rows={6}
              maxLength={1000}
              required
            />
            <small>{description.length}/1000 characters</small>
          </label>

          <button
            className="maintenance-submit"
            type="submit"
            disabled={submitting}
          >
            <Send size={17} />
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      )}
    </div>
  );
}