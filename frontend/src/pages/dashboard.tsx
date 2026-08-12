import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/auth-context';
import apiClient from '../api/client';
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react';

interface MetricData {
  customerCount: number;
  productCount: number;
  totalReceivables: number;
  totalRevenue: number;
  challanCount: number;
  deliveredCount: number;
  draftCount: number;
}

interface Challan {
  id: string;
  challanNumber: string;
  customer: { name: string; companyName: string };
  totalAmount: number;
  status: 'draft' | 'delivered' | 'invoiced' | 'cancelled';
  createdAt: string;
}

export const Dashboard: React.FC = () => {
  const { user, hasRole } = useAuth();
  const [metrics, setMetrics] = useState<MetricData>({
    customerCount: 0,
    productCount: 0,
    totalReceivables: 0,
    totalRevenue: 0,
    challanCount: 0,
    deliveredCount: 0,
    draftCount: 0,
  });
  const [recentChallans, setRecentChallans] = useState<Challan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const promises = [];

        // Load customers if role allowed
        const canSeeCustomers = hasRole(['admin', 'sales', 'accounts']);
        const canSeeStock = hasRole(['admin', 'warehouse', 'sales', 'accounts']);
        const canSeeChallans = hasRole(['admin', 'sales', 'warehouse', 'accounts']);

        promises.push(canSeeCustomers ? apiClient.get('/customers') : Promise.resolve({ data: [] }));
        promises.push(canSeeStock ? apiClient.get('/products') : Promise.resolve({ data: [] }));
        promises.push(canSeeChallans ? apiClient.get('/challans') : Promise.resolve({ data: [] }));

        const [custRes, prodRes, chalRes] = await Promise.all(promises);

        const customers = custRes.data;
        const products = prodRes.data;
        const challans = chalRes.data;

        // Metrics calculations
        const totalReceivables = customers.reduce(
          (sum: number, c: any) => sum + Number(c.balance || 0),
          0
        );

        const invoicedChallans = challans.filter((c: any) => c.status === 'invoiced');
        const totalRevenue = invoicedChallans.reduce(
          (sum: number, c: any) => sum + Number(c.totalAmount || 0),
          0
        );

        const deliveredCount = challans.filter((c: any) => c.status === 'delivered').length;
        const draftCount = challans.filter((c: any) => c.status === 'draft').length;

        setMetrics({
          customerCount: customers.length,
          productCount: products.length,
          totalReceivables,
          totalRevenue,
          challanCount: challans.length,
          deliveredCount,
          draftCount,
        });

        setRecentChallans(challans.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val);
  };

  if (loading) {
    return <div style={{ color: 'var(--text-secondary)' }}>Loading analytical metrics...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Operational Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.name}. Here is your enterprise summary.</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4">
        {hasRole(['admin', 'sales', 'accounts']) && (
          <div className="card card-primary metric-card">
            <div className="metric-info">
              <span className="metric-label">Active Clients</span>
              <span className="metric-value">{metrics.customerCount}</span>
            </div>
            <div className="metric-icon-box">
              <Users size={24} />
            </div>
          </div>
        )}

        {hasRole(['admin', 'sales', 'warehouse', 'accounts']) && (
          <div className="card card-info metric-card">
            <div className="metric-info">
              <span className="metric-label">Catalog Products</span>
              <span className="metric-value">{metrics.productCount}</span>
            </div>
            <div className="metric-icon-box">
              <Package size={24} />
            </div>
          </div>
        )}

        {hasRole(['admin', 'sales', 'warehouse', 'accounts']) && (
          <div className="card card-success metric-card">
            <div className="metric-info">
              <span className="metric-label">Invoiced Value</span>
              <span className="metric-value">{formatCurrency(metrics.totalRevenue)}</span>
            </div>
            <div className="metric-icon-box">
              <DollarSign size={24} style={{ color: 'var(--color-success)' }} />
            </div>
          </div>
        )}

        {hasRole(['admin', 'accounts']) && (
          <div className="card card-danger metric-card">
            <div className="metric-info">
              <span className="metric-label">Accounts Receivable</span>
              <span className="metric-value">{formatCurrency(metrics.totalReceivables)}</span>
            </div>
            <div className="metric-icon-box">
              <TrendingUp size={24} style={{ color: 'var(--color-danger)' }} />
            </div>
          </div>
        )}
      </div>

      {/* Operational Status Grid */}
      <div className="grid grid-cols-2">
        {/* State Summary Card */}
        <div className="card">
          <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Delivery & Invoicing Lifecycle</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Clock size={20} style={{ color: 'var(--color-warning)' }} />
                <span style={{ fontWeight: 600 }}>Draft Challans (Pending Dispatch)</span>
              </div>
              <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-warning)' }}>
                {metrics.draftCount}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <TrendingUp size={20} style={{ color: 'var(--color-success)' }} />
                <span style={{ fontWeight: 600 }}>Delivered Challans (Pending Invoice)</span>
              </div>
              <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-success)' }}>
                {metrics.deliveredCount}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle size={20} style={{ color: 'var(--color-info)' }} />
                <span style={{ fontWeight: 600 }}>Completed Transactions</span>
              </div>
              <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-info)' }}>
                {metrics.challanCount - metrics.draftCount - metrics.deliveredCount}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Challans Card */}
        <div className="card">
          <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Recent Sales Challans</h3>
          {recentChallans.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px' }}>
              <span style={{ fontSize: '14px' }}>No challans recorded yet.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentChallans.map((c) => (
                <div
                  key={c.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255,255,255,0.01)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{c.challanNumber}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {c.customer?.name} • {formatCurrency(c.totalAmount)}
                    </div>
                  </div>
                  <span className={`badge badge-${c.status}`}>{c.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
