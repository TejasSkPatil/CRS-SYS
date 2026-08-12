import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/auth-context';
import { KeyRound, User as UserIcon } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(username, password);
      navigate('/');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleShortcut = (roleUser: string, rolePass: string) => {
    setUsername(roleUser);
    setPassword(rolePass);
    setError(null);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-icon" style={{ fontSize: '24px', width: '48px', height: '48px', borderRadius: 'var(--radius-md)' }}>
            Ω
          </div>
          <h2 className="auth-title">Aether ERP Portal</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Enter details or select a quick login profile below
          </p>
        </div>

        {error && (
          <div className="alert-banner alert-banner-error">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Username</label>
            <div style={{ position: 'relative' }}>
              <UserIcon
                size={16}
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '44px' }}
                placeholder="e.g. admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <KeyRound
                size={16}
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: '44px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '8px' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-shortcuts">
          <div className="shortcuts-title">Quick Demo Login</div>
          <div className="shortcuts-grid">
            <button
              className="shortcut-btn"
              onClick={() => handleShortcut('admin', 'admin123')}
            >
              <span style={{ color: 'var(--text-primary)' }}>admin</span>
              <span className="shortcut-role">Administrator</span>
            </button>
            <button
              className="shortcut-btn"
              onClick={() => handleShortcut('sales', 'sales123')}
            >
              <span style={{ color: 'var(--text-primary)' }}>sales</span>
              <span className="shortcut-role">Sales Officer</span>
            </button>
            <button
              className="shortcut-btn"
              onClick={() => handleShortcut('warehouse', 'warehouse123')}
            >
              <span style={{ color: 'var(--text-primary)' }}>warehouse</span>
              <span className="shortcut-role">Warehouse Mgr</span>
            </button>
            <button
              className="shortcut-btn"
              onClick={() => handleShortcut('accounts', 'accounts123')}
            >
              <span style={{ color: 'var(--text-primary)' }}>accounts</span>
              <span className="shortcut-role">Accounts Officer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
