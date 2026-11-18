import { useEffect, useState } from 'react';
import { BedDouble, Building2, RefreshCw } from 'lucide-react';

import studentService from '../../services/studentService';
import './Student.css';

export default function MyRoom() {
  const [allocation, setAllocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRoom = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await studentService.getMyAllocation();
      setAllocation(data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Unable to load your room allocation.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoom();
  }, []);

  if (loading) return <div className="student-page">Loading room details...</div>;

  if (error) {
    return (
      <div className="student-page">
        <p className="student-error">{error}</p>
        <button className="student-button" onClick={loadRoom}>
          <RefreshCw size={16} /> Try Again
        </button>
      </div>
    );
  }

  const room = allocation?.room || {};
  const hostel = room?.hostel || allocation?.hostel || {};

  return (
    <div className="student-page">
      <div className="student-page-header">
        <div>
          <h1>My Room</h1>
          <p>View your current hostel and room allocation.</p>
        </div>
        <button className="student-button" onClick={loadRoom}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {allocation ? (
        <section className="student-panel">
          <div className="student-room-banner">
            <div className="student-room-banner-icon">
              <BedDouble size={30} />
            </div>
            <div>
              <span>Allocated Room</span>
              <h2>
                {room?.roomNumber || allocation?.roomNumber || 'Room details'}
              </h2>
            </div>
          </div>

          <div className="student-room-details">
            <div>
              <span>Hostel Name</span>
              <strong>
                {hostel?.name || allocation?.hostelName || 'Not available'}
              </strong>
            </div>
            <div>
              <span>Room Number</span>
              <strong>
                {room?.roomNumber || allocation?.roomNumber || 'Not available'}
              </strong>
            </div>
            <div>
              <span>Room Capacity</span>
              <strong>{room?.capacity ?? 'Not available'}</strong>
            </div>
            <div>
              <span>Occupied Beds</span>
              <strong>{room?.occupiedBeds ?? 'Not available'}</strong>
            </div>
            <div>
              <span>Allocation Status</span>
              <strong>{allocation?.status || 'Active'}</strong>
            </div>
            <div>
              <span>Allocation Date</span>
              <strong>
                {allocation?.allocationDate
                  ? new Date(`${allocation.allocationDate}T00:00:00`)
                      .toLocaleDateString('en-IN')
                  : 'Not available'}
              </strong>
            </div>
          </div>
        </section>
      ) : (
        <section className="student-panel student-no-room">
          <Building2 size={34} />
          <h2>No Room Allocated</h2>
          <p>You do not currently have an active room allocation.</p>
        </section>
      )}
    </div>
  );
}