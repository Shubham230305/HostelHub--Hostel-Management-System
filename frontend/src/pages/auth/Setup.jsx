import { useEffect, useState } from 'react';
import { Eye, EyeOff, LockKeyhole, Mail, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import setupService from '../../services/setupService';
import useAuth from '../../hooks/useAuth';
import './Setup.css';

export default function Setup() {
  const navigate = useNavigate();
  const { setAuthData } = useAuth();

  const [setupRequired, setSetupRequired] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    address: '',
    dateOfBirth: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSetup, setCheckingSetup] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkSetupStatus = async () => {
      try {
        const status = await setupService.getStatus();
        setSetupRequired(status);
      } catch {
        setError('Unable to check initial setup status.');
      } finally {
        setCheckingSetup(false);
      }
    };

    checkSetupStatus();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please enter the warden name.');
      return;
    }

    if (!formData.email.trim()) {
      setError('Please enter the email address.');
      return;
    }

    if (!formData.password || formData.password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    try {
      setLoading(true);

      const authData = await setupService.initialize({
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim() || null,
        password: formData.password,
        address: formData.address.trim() || null,
        dateOfBirth: formData.dateOfBirth || null,
      });

      setAuthData(authData);

      navigate('/admin', { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Unable to complete initial setup. Please try again.';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingSetup) {
    return (
      <div className="setup-status-page">
        <div className="setup-status-card">
          <div className="setup-status-logo">
            <span className="setup-brand-mark">H</span>
            <span>HostelHub</span>
          </div>

          <h2>Checking installation status...</h2>

          <p>
            Please wait while HostelHub checks whether initial
            setup is required.
          </p>
        </div>
      </div>
    );
  }

  if (!setupRequired) {
    return (
      <div className="setup-status-page">
        <div className="setup-status-card">
          <div className="setup-status-logo">
            <span className="setup-brand-mark">H</span>
            <span>HostelHub</span>
          </div>

          <span className="setup-status-eyebrow">
            SETUP COMPLETED
          </span>

          <h2>HostelHub is already configured.</h2>

          <p>
            The initial Warden account has already been created
            for this HostelHub installation.
          </p>

          <button
            type="button"
            className="setup-status-button"
            onClick={() => navigate('/login')}
          >
            Go to Login
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="setup-page">
      <section className="setup-brand-panel">
        <div className="setup-brand-content">
          <div className="setup-brand-logo">
            <span className="setup-brand-mark">H</span>
            <span>HostelHub</span>
          </div>

          <div className="setup-brand-message">
            <span className="setup-brand-eyebrow">
              FIRST-TIME SETUP
            </span>

            <h1>Set up your hostel management system.</h1>

            <p>
              Create the first Warden account to begin managing
              your hostel with HostelHub.
            </p>
          </div>

          <div className="setup-brand-footer">
            <span>One hostel. One system. Simple management.</span>
            <span>HostelHub © 2026</span>
          </div>
        </div>
      </section>

      <section className="setup-form-panel">
        <div className="setup-form-wrapper">
          <div className="setup-mobile-brand">
            <span className="setup-brand-mark">H</span>
            <span>HostelHub</span>
          </div>

          <div className="setup-heading">
            <span className="setup-form-eyebrow">
              INITIAL ADMINISTRATOR
            </span>

            <h2>Create your Warden account</h2>

            <p>
              This account will be the first administrator of
              this HostelHub installation.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="setup-form">

            <div className="setup-field">
              <label htmlFor="name">Full name</label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>

            <div className="setup-field">
              <label htmlFor="email">Email address</label>

              <div className="setup-input-with-icon">
                <Mail size={18} />

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="warden@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="setup-field">
              <label htmlFor="mobile">Mobile number</label>

              <input
                id="mobile"
                name="mobile"
                type="tel"
                placeholder="Enter mobile number"
                value={formData.mobile}
                onChange={handleChange}
                autoComplete="tel"
              />
            </div>

            <div className="setup-field">
              <label htmlFor="password">Password</label>

              <div className="setup-input-with-icon">
                <LockKeyhole size={18} />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="setup-password-toggle"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="setup-field">
              <label htmlFor="address">Address</label>

              <textarea
                id="address"
                name="address"
                placeholder="Enter hostel/warden address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="setup-field">
              <label htmlFor="dateOfBirth">Date of birth</label>

              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            {error && (
              <div className="setup-error" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="setup-submit"
              disabled={loading}
            >
              {loading ? (
                'Creating account...'
              ) : (
                <>
                  Create Warden Account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="setup-bottom">
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
              >
                Sign in
              </button>
            </p>

            <span>
              The first account is automatically assigned ADMIN
              access.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}