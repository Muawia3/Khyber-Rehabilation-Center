import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, Card, Alert, LoadingSpinner } from '../../components';
import { useDocumentTitle } from '../../hooks';
import { AuthContext } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { APP_NAME } from '../../utils/constants';
import logoImg from '../../assets/logo.jpeg';

export const AdminLoginPage = () => {
  useDocumentTitle('Staff Login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/admin';

  // If already logged in, redirect immediately
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.login({ email: email.trim(), password });
      if (response?.data?.token) {
        login(response.data.token, response.data.user);
        navigate(redirectPath, { replace: true });
      } else {
        setErrorMessage('Unexpected response from authentication service.');
      }
    } catch (err) {
      setErrorMessage(
        err.message || 'Authentication failed. Please verify your staff credentials and server connection.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="admin-login-screen"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 10%, rgba(1, 156, 220, 0.12) 0%, transparent 60%), #f8fafc',
        padding: 'var(--spacing-6)',
      }}
    >
      <div style={{ width: '100%', maxWidth: '460px' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-8)' }}>
          <img
            src={logoImg}
            alt={APP_NAME}
            style={{
              height: '80px',
              margin: '0 auto var(--spacing-4)',
              objectFit: 'contain',
              backgroundColor: '#fff',
              padding: '6px',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid rgba(1, 156, 220, 0.25)',
            }}
          />
          <h2 style={{ fontSize: '1.75rem', color: 'var(--color-gray-900)', fontWeight: 800 }}>
            Staff Management Portal
          </h2>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginTop: '4px', fontWeight: 600 }}>
            Khyber Rehabilitation Center &bull; Peshawar, KP
          </p>
        </div>

        <Card variant="highlight" style={{ padding: 'var(--spacing-8)', boxShadow: 'var(--shadow-xl)' }}>
          {errorMessage && (
            <div style={{ marginBottom: 'var(--spacing-5)' }}>
              <Alert type="danger" title="Sign In Error">
                {errorMessage}
              </Alert>
            </div>
          )}

          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="adminEmail">
                Staff Email Address
              </label>
              <input
                id="adminEmail"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@khyberrehab.edu.pk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 'var(--spacing-6)' }}>
              <label className="form-label" htmlFor="adminPassword">
                Password
              </label>
              <input
                id="adminPassword"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <Button
              variant="primary"
              type="submit"
              size="lg"
              className="btn-pill"
              disabled={isLoading}
              style={{ width: '100%' }}
            >
              {isLoading ? 'Verifying Credentials...' : 'Sign In to Management Portal'}
            </Button>
          </form>

          <div
            style={{
              marginTop: 'var(--spacing-8)',
              paddingTop: 'var(--spacing-5)',
              borderTop: '1px solid rgba(1, 156, 220, 0.15)',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '11px', color: 'var(--color-gray-400)', margin: '0 0 var(--spacing-3) 0', fontWeight: 600 }}>
              🔒 Authorized staff access only. Public registration is disabled.
            </p>
            <Link
              to="/"
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-primary)',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              &larr; Return to Public Website
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
