import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LockKeyhole, Mail, ArrowRight } from 'lucide-react';

import useAuth from '../../hooks/useAuth';
import './Login.css';

const dashboardRoutes = {
  ADMIN: '/admin',
  STUDENT: '/student',
  MAINTENANCE: '/maintenance',
};

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

    if (!formData.email.trim() || !formData.password) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);

      const authData = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      const role = authData.role?.toUpperCase().replace(/^ROLE_/, '');
      const destination = dashboardRoutes[role];

      if (!destination) {
        setError('Your account does not have a recognized role.');
        return;
      }

      navigate(destination, { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Unable to sign in. Please check your credentials and try again.';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <section className="login-brand-panel">
        <div className="brand-content">
          <div className="brand-logo">
            <span className="brand-mark">H</span>
            <span>HostelHub</span>
          </div>

          <div className="brand-message">
            <span className="brand-eyebrow">HOSTEL MANAGEMENT SYSTEM</span>
            <h1>A better way to manage hostel life.</h1>
            <p>
              One place for accommodation, room allocation
              and everyday hostel operations.
            </p>
          </div>

          <div className="brand-footer">
            <span>Organized living. Simpler management.</span>
            <span>HostelHub © 2026</span>
          </div>
        </div>
      </section>

      <section className="login-form-panel">
        <div className="login-form-wrapper">
          <div className="mobile-brand">
            <span className="brand-mark">H</span>
            <span>HostelHub</span>
          </div>

          <div className="login-heading">
            <span className="form-eyebrow">WELCOME BACK</span>
            <h2>Sign in to your account</h2>
            <p>Enter your credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-field">
              <label htmlFor="email">Email address</label>

              <div className="field-input">
                <Mail size={18} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="password">Password</label>

              <div className="field-input">
                <LockKeyhole size={18} />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="login-error" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? (
                'Signing in...'
              ) : (
                <>
                  Sign in
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="login-bottom">
            <p>
              New to HostelHub? <Link to="/register">Create an account</Link>
            </p>
            <span>Secure access for hostel members</span>
          </div>
        </div>
      </section>
    </div>
  );
}