import { useState } from 'react';
import { Eye, EyeOff, LockKeyhole, Mail, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import authService from '../../services/authService';
import './Register.css';

export default function Register() {
  const navigate = useNavigate();

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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError('');
    setSuccess('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!formData.name.trim()) {
      setError('Please enter your name.');
      return;
    }

    if (!formData.email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!formData.password || formData.password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    try {
      setLoading(true);

      await authService.register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim() || null,
        password: formData.password,
        address: formData.address.trim() || null,
        dateOfBirth: formData.dateOfBirth || null,
      });

      setSuccess(
        'Registration successful. Your student account has been created.'
      );

      setTimeout(() => {
        navigate('/login', {
          replace: true,
          state: {
            message: 'Registration successful. Please log in.',
          },
        });
      }, 1200);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Registration failed. Please try again.';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <section className="register-brand-panel">
        <div className="register-brand-content">
          <div className="register-brand-logo">
            <span className="register-brand-mark">H</span>
            <span>HostelHub</span>
          </div>

          <div className="register-brand-message">
            <span className="register-brand-eyebrow">
              STUDENT REGISTRATION
            </span>

            <h1>Join your hostel management system.</h1>

            <p>
              Create your student account to access your profile,
              room information, and maintenance services.
            </p>
          </div>

          <div className="register-brand-footer">
            <span>Simple hostel management for students.</span>
            <span>HostelHub © 2026</span>
          </div>
        </div>
      </section>

      <section className="register-form-panel">
        <div className="register-form-wrapper">

          <div className="register-mobile-brand">
            <span className="register-brand-mark">H</span>
            <span>HostelHub</span>
          </div>

          <div className="register-heading">
            <span className="register-form-eyebrow">
              CREATE ACCOUNT
            </span>

            <h2>Student registration</h2>

            <p>
              Enter your details to create your HostelHub student
              account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">

            <div className="register-field">
              <label htmlFor="name">Full name</label>

              <div className="register-input-with-icon">
                <UserPlus size={18} />

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="register-field">
              <label htmlFor="email">Email address</label>

              <div className="register-input-with-icon">
                <Mail size={18} />

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="student@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="register-field">
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

            <div className="register-field">
              <label htmlFor="password">Password</label>

              <div className="register-input-with-icon">
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
                  className="register-password-toggle"
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

            <div className="register-field">
              <label htmlFor="address">Address</label>

              <textarea
                id="address"
                name="address"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="register-field">
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
              <div className="register-error" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="register-success" role="status">
                {success}
              </div>
            )}

            <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >
              {loading ? (
                'Creating account...'
              ) : (
                <>
                  Create Student Account
                  <UserPlus size={18} />
                </>
              )}
            </button>
          </form>

          <div className="register-bottom">
            <p>
              Already have an account?{' '}
              <Link to="/login">Sign in</Link>
            </p>

            <span>
              New public accounts are automatically registered as
              STUDENT.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}