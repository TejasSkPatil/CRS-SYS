import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  TrendingUp,
  FileText,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../auth/auth-context';

export const Layout: React.FC = () => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="app-container">
      {/* Sidebar navigation */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">Ω</div>
          <span className="logo-text">AETHER ERP</span>
        </div>

        <nav className="sidebar-menu">
          <NavLink
            to="/"
            className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
            end
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          {hasRole(['admin', 'sales', 'accounts']) && (
            <NavLink
              to="/customers"
              className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
            >
              <Users size={20} />
              <span>Customers (CRM)</span>
            </NavLink>
          )}

          {hasRole(['admin', 'sales', 'warehouse', 'accounts']) && (
            <NavLink
              to="/products"
              className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
            >
              <Package size={20} />
              <span>Inventory</span>
            </NavLink>
          )}

          {hasRole(['admin', 'warehouse']) && (
            <NavLink
              to="/stock-movements"
              className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
            >
              <TrendingUp size={20} />
              <span>Stock Movements</span>
            </NavLink>
          )}

          {hasRole(['admin', 'sales', 'warehouse', 'accounts']) && (
            <NavLink
              to="/challans"
              className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
            >
              <FileText size={20} />
              <span>Sales Challans</span>
            </NavLink>
          )}
        </nav>

        <div className="sidebar-footer">
          {user && (
            <div className="user-profile-badge">
              <div className="user-avatar">{getInitials(user.name)}</div>
              <div className="user-info">
                <div className="user-name" title={user.name}>{user.name}</div>
                <div className="user-role">{user.role}</div>
              </div>
            </div>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content body */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};
