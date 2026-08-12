import React, { useEffect, useState } from 'react';
import apiClient from '../api/client';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Calendar, User, Package, Bookmark } from 'lucide-react';

interface StockMovement {
  id: string;
  productId: string;
  quantity: number;
  type: 'IN' | 'OUT';
  reference: string;
  createdAt: string;
  product: { name: string; sku: string };
  user: { name: string } | null;
}

export const StockMovements: React.FC = () => {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        const response = await apiClient.get<StockMovement[]>('/stock-movements');
        setMovements(response.data);
      } catch (error) {
        console.error('Error fetching stock movements', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovements();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div style={{ color: 'var(--text-secondary)' }}>Loading ledger logs...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Stock Ledger Log</h1>
          <p className="page-subtitle">Real-time trace of all warehouse stock movements, inward receipts, and outward sales deliveries.</p>
        </div>
      </div>

      {movements.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <TrendingUp className="empty-state-icon" />
            <h3>No Movement Logged</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '400px', marginTop: '8px' }}>
              Any manual adjustments or delivery fulfillments will be logged here to maintain an audit trail.
            </p>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date / Time</th>
                <th>Product Information</th>
                <th>Direction</th>
                <th>Quantity</th>
                <th>Reference Description</th>
                <th>Processed By</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                      <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                      <span>{formatDate(m.createdAt)}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Package size={14} style={{ color: 'var(--color-primary)' }} />
                      <div>
                        <div style={{ fontWeight: 600 }}>{m.product.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          SKU: {m.product.sku}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${m.type === 'IN' ? 'badge-delivered' : 'badge-cancelled'}`}>
                      {m.type === 'IN' ? 'Inward' : 'Outward'}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, fontSize: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: m.type === 'IN' ? 'var(--color-success)' : 'var(--color-danger)' }}>
                      {m.type === 'IN' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      <span>{m.quantity} units</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '13px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Bookmark size={12} style={{ color: 'var(--text-muted)' }} />
                      <span>{m.reference}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '13px', color: m.user ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={12} />
                      <span>{m.user ? m.user.name : 'System / Auto'}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
