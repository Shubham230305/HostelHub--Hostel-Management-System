import { useEffect, useState } from 'react';
import { UserRound, RefreshCw } from 'lucide-react';

import studentService from '../../services/studentService';
import './Student.css';

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await studentService.getMyProfile();
      setProfile(data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Unable to load your profile.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) return <div className="student-page">Loading profile...</div>;

  if (error) {
    return (
      <div className="student-page">
        <p className="student-error">{error}</p>
        <button className="student-button" onClick={loadProfile}>
          <RefreshCw size={16} /> Try Again
        </button>
      </div>
    );
  }

  const fields = [
    ['Full Name', profile?.name],
    ['Email Address', profile?.email],
    ['Mobile Number', profile?.mobile],
    ['Address', profile?.address],
    ['Date of Birth', profile?.dateOfBirth],
    ['Role', profile?.role],
    ['Account Status', profile?.isActive ? 'Active' : 'Inactive'],
    [
      'Email Verification',
      profile?.emailVerified ? 'Verified' : 'Not verified',
    ],
  ];

  return (
    <div className="student-page">
      <div className="student-page-header">
        <div>
          <h1>My Profile</h1>
          <p>View your registered personal information.</p>
        </div>
        <button className="student-button" onClick={loadProfile}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <section className="student-panel">
        <div className="student-profile-heading">
          <div className="student-profile-avatar">
            <UserRound size={30} />
          </div>
          <div>
            <h2>{profile?.name || 'Student'}</h2>
            <p>{profile?.email}</p>
          </div>
        </div>

        <div className="student-profile-grid">
          {fields.map(([label, value]) => (
            <div className="student-profile-field" key={label}>
              <span>{label}</span>
              <strong>{value || 'Not provided'}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}