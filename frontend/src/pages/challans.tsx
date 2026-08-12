import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/auth-context';
import apiClient from '../api/client';
import { exportChallanPDF } from '../utils/exportPDF';
import {
  Plus,
  FileText,
  X,
  PlusCircle,
  Trash2,
  Calendar,
  Building,
  User,
  Notebook,
  Download,
  Eye,
  Check,
  ArrowRight,
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stockQuantity: number;
}

interface Customer {
  id: string;
  name: string;
  companyName: string;
  email?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  gstNumber?: string;
}

interface ChallanItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  product: Product;
}

interface Challan {
  id: string;
  challanNumber: string;
  customerId: string;
  customer: Customer;
  salesUserId: string;
  salesUser: { name: string };
  status: 'draft' | 'confirmed' | 'delivered' | 'invoiced' | 'cancelled';
  deliveryDate: string | null;
  notes: string | null;
  totalAmount: number;
  items: ChallanItem[];
  createdAt: string;
}

export const Challans: React.FC = () => {
  const { hasRole } = useAuth();
  const [challans, setChallans] = useState<Challan[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Drawer states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedChallan, setSelectedChallan] = useState<Challan | null>(null);

  // Form states for creation
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<{ productId: string; quantity: number; unitPrice?: number }[]>([
    { productId: '', quantity: 1 },
  ]);

  const [error, setError] = useState<string | null>(null);

  const canCreateChallan = hasRole(['admin', 'sales']);

  const fetchChallans = async () => {
    try {
      const response = await apiClient.get<Challan[]>('/challans');
      setChallans(response.data);
    } catch (err) {
      console.error('Error fetching challans', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        await fetchChallans();
        
        // If user can create, preload customers and products
        if (canCreateChallan) {
          const [custRes, prodRes] = await Promise.all([
            apiClient.get<Customer[]>('/customers'),
            apiClient.get<Product[]>('/products'),
          ]);
          setCustomers(custRes.data);
          setProducts(prodRes.data);
        }
      } catch (err) {
        console.error('Initialization error', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const openCreateDrawer = () => {
    setSelectedCustomerId('');
    setNotes('');
    setItems([{ productId: '', quantity: 1 }]);
    setError(null);
    setIsCreateOpen(true);
  };

  const handleAddItemRow = () => {
    setItems([...items, { productId: '', quantity: 1 }]);
  };

  const handleRemoveItemRow = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems.length > 0 ? newItems : [{ productId: '', quantity: 1 }]);
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    if (field === 'productId') {
      newItems[index].productId = value;
      // Auto-populate price
      const prod = products.find((p) => p.id === value);
      newItems[index].unitPrice = prod ? Number(prod.price) : 0;
    } else if (field === 'quantity') {
      newItems[index].quantity = Number(value);
    } else if (field === 'unitPrice') {
      newItems[index].unitPrice = Number(value);
    }
    setItems(newItems);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate entries
    const invalidItem = items.find((item) => !item.productId || item.quantity < 1);
    if (invalidItem) {
      setError('Please select a valid product and quantity of 1 or more for all rows');
      return;
    }

    if (!selectedCustomerId) {
      setError('Please select a customer');
      return;
    }

    try {
      await apiClient.post('/challans', {
        customerId: selectedCustomerId,
        notes,
        items,
      });
      setIsCreateOpen(false);
      fetchChallans();
    } catch (err: any) {
      const messages = err.response?.data?.messages;
      const errorMsg = messages
        ? (Array.isArray(messages) ? messages.join(', ') : messages)
        : (err.response?.data?.message || 'Failed to create challan');
      setError(errorMsg);
    }
  };

  // State actions
  const handleConfirm = async (id: string) => {
    try {
      await apiClient.put(`/challans/${id}/confirm`);
      fetchChallans();
      if (selectedChallan?.id === id) {
        const refreshed = await apiClient.get<Challan>(`/challans/${id}`);
        setSelectedChallan(refreshed.data);
      }
    } catch (err: any) {
      const messages = err.response?.data?.messages;
      const errorMsg = messages
        ? (Array.isArray(messages) ? messages.join(', ') : messages)
        : (err.response?.data?.message || 'Confirmation error');
      alert(errorMsg);
    }
  };

  const handleDeliver = async (id: string) => {
    try {
      await apiClient.put(`/challans/${id}/deliver`);
      fetchChallans();
      if (selectedChallan?.id === id) {
        // Refresh details modal
        const refreshed = await apiClient.get<Challan>(`/challans/${id}`);
        setSelectedChallan(refreshed.data);
      }
    } catch (err: any) {
      const messages = err.response?.data?.messages;
      const errorMsg = messages
        ? (Array.isArray(messages) ? messages.join(', ') : messages)
        : (err.response?.data?.message || 'Fulfillment error');
      alert(errorMsg);
    }
  };

  const handleInvoice = async (id: string) => {
    try {
      await apiClient.put(`/challans/${id}/invoice`);
      fetchChallans();
      if (selectedChallan?.id === id) {
        const refreshed = await apiClient.get<Challan>(`/challans/${id}`);
        setSelectedChallan(refreshed.data);
      }
    } catch (err: any) {
      const messages = err.response?.data?.messages;
      const errorMsg = messages
        ? (Array.isArray(messages) ? messages.join(', ') : messages)
        : (err.response?.data?.message || 'Invoicing error');
      alert(errorMsg);
    }
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this challan? This action will reverse stock/balances.')) {
      return;
    }
    try {
      await apiClient.put(`/challans/${id}/cancel`);
      fetchChallans();
      if (selectedChallan?.id === id) {
        const refreshed = await apiClient.get<Challan>(`/challans/${id}`);
        setSelectedChallan(refreshed.data);
      }
    } catch (err: any) {
      const messages = err.response?.data?.messages;
      const errorMsg = messages
        ? (Array.isArray(messages) ? messages.join(', ') : messages)
        : (err.response?.data?.message || 'Cancellation error');
      alert(errorMsg);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return <div style={{ color: 'var(--text-secondary)' }}>Loading challans...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Sales Challans</h1>
          <p className="page-subtitle">Track delivery logs, dispatch items, invoice bills, and manage order status.</p>
        </div>
        {canCreateChallan && (
          <button className="btn btn-primary" onClick={openCreateDrawer}>
            <Plus size={16} />
            <span>New Challan</span>
          </button>
        )}
      </div>

      {challans.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <FileText className="empty-state-icon" />
            <h3>No Challans Logged</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '400px', marginTop: '8px' }}>
              Create draft challans to outline products sold. Fulfill them in the warehouse to dispatch stock.
            </p>
            {canCreateChallan && (
              <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={openCreateDrawer}>
                New Challan
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Challan ID / Number</th>
                <th>Client / Organization</th>
                <th>Order Date</th>
                <th>Created By</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {challans.map((c) => (
                <tr key={c.id}>
                  <td>
                    <button
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-primary)',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        padding: 0,
                        textAlign: 'left',
                      }}
                      onClick={() => setSelectedChallan(c)}
                    >
                      {c.challanNumber}
                    </button>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{c.customer?.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Building size={12} />
                      {c.customer?.companyName}
                    </div>
                  </td>
                  <td style={{ fontSize: '13px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={12} />
                      <span>{formatDate(c.createdAt)}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={12} />
                      <span>{c.salesUser?.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${c.status}`}>{c.status}</span>
                  </td>
                  <td style={{ fontWeight: 700 }}>{formatCurrency(c.totalAmount)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'nowrap' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => setSelectedChallan(c)} title="View">
                        <Eye size={14} />
                      </button>

                      {c.status === 'draft' && hasRole(['admin', 'sales']) && (
                        <button className="btn btn-success btn-sm" onClick={() => handleConfirm(c.id)} title="Confirm">
                          <Check size={14} />
                        </button>
                      )}

                      {(c.status === 'draft' || c.status === 'confirmed') && hasRole(['admin', 'sales', 'warehouse']) && (
                        <button className="btn btn-primary btn-sm" onClick={() => handleDeliver(c.id)} title="Dispatch">
                          <ArrowRight size={14} />
                        </button>
                      )}

                      {c.status === 'delivered' && hasRole(['admin', 'sales', 'accounts']) && (
                        <button className="btn btn-primary btn-sm" onClick={() => handleInvoice(c.id)} title="Invoice">
                          <FileText size={14} />
                        </button>
                      )}

                      {c.status !== 'cancelled' && (
                        (c.status === 'draft' && hasRole(['admin', 'sales'])) ||
                        (c.status === 'confirmed' && hasRole(['admin', 'sales', 'warehouse'])) ||
                        (c.status === 'delivered' && hasRole(['admin', 'warehouse'])) ||
                        (c.status === 'invoiced' && hasRole(['admin', 'accounts']))
                      ) && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleCancel(c.id)} title="Cancel">
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Challan Details Modal overlay */}
      {selectedChallan && (
        <div className="drawer-backdrop" onClick={() => setSelectedChallan(null)}>
          <div className="drawer" style={{ width: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h2 className="drawer-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText style={{ color: 'var(--color-primary)' }} />
                <span>{selectedChallan.challanNumber}</span>
              </h2>
              <button className="drawer-close" onClick={() => setSelectedChallan(null)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Summary Metadata */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'rgba(255,255,255,0.02)', padding: '20px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Client Account</span>
                  <div style={{ fontWeight: 600, fontSize: '15px', marginTop: '4px' }}>{selectedChallan.customer?.name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{selectedChallan.customer?.companyName}</div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Status</span>
                  <div style={{ marginTop: '4px' }}>
                    <span className={`badge badge-${selectedChallan.status}`}>{selectedChallan.status}</span>
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Order Date</span>
                  <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '4px' }}>{formatDate(selectedChallan.createdAt)}</div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Fulfillment Date</span>
                  <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '4px' }}>
                    {selectedChallan.deliveryDate ? formatDate(selectedChallan.deliveryDate) : 'Not Dispatched'}
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h3 style={{ fontSize: '15px', marginBottom: '12px' }}>Ordered Items</h3>
                <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                  <table className="table" style={{ fontSize: '13px' }}>
                    <thead>
                      <tr style={{ background: 'rgba(0,0,0,0.1)' }}>
                        <th style={{ padding: '10px 16px' }}>Item Description</th>
                        <th style={{ padding: '10px 16px' }}>Price</th>
                        <th style={{ padding: '10px 16px' }}>Qty</th>
                        <th style={{ padding: '10px 16px' }}>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedChallan.items.map((item) => (
                        <tr key={item.id}>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ fontWeight: 600 }}>{item.product?.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>SKU: {item.product?.sku}</div>
                          </td>
                          <td style={{ padding: '12px 16px' }}>{formatCurrency(item.unitPrice)}</td>
                          <td style={{ padding: '12px 16px' }}>{item.quantity}</td>
                          <td style={{ padding: '12px 16px', fontWeight: 600 }}>{formatCurrency(item.unitPrice * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px', borderTop: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.15)' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Invoice Total:</span>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-primary)' }}>
                        {formatCurrency(selectedChallan.totalAmount)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedChallan.notes && (
                <div>
                  <h3 style={{ fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Notebook size={14} style={{ color: 'var(--text-muted)' }} />
                    <span>Reference Notes</span>
                  </h3>
                  <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    "{selectedChallan.notes}"
                  </div>
                </div>
              )}

              {/* Transition actions */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '20px', flexWrap: 'wrap' }}>
                {selectedChallan.status === 'draft' && hasRole(['admin', 'sales']) && (
                  <button className="btn btn-success" style={{ flex: 1 }} onClick={() => handleConfirm(selectedChallan.id)}>
                    ✓ Confirm Challan
                  </button>
                )}

                {(selectedChallan.status === 'draft' || selectedChallan.status === 'confirmed') && hasRole(['admin', 'warehouse']) && (
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleDeliver(selectedChallan.id)}>
                    Dispatch Delivery
                  </button>
                )}

                {selectedChallan.status === 'delivered' && hasRole(['admin', 'accounts']) && (
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleInvoice(selectedChallan.id)}>
                    Invoice Customer
                  </button>
                )}

                {selectedChallan.status !== 'cancelled' && (
                  (selectedChallan.status === 'draft' && hasRole(['admin', 'sales'])) ||
                  (selectedChallan.status === 'confirmed' && hasRole(['admin', 'sales', 'warehouse'])) ||
                  (selectedChallan.status === 'delivered' && hasRole(['admin', 'warehouse'])) ||
                  (selectedChallan.status === 'invoiced' && hasRole(['admin', 'accounts']))
                ) && (
                  <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => handleCancel(selectedChallan.id)}>
                    Cancel Challan
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  onClick={() => exportChallanPDF(selectedChallan)}
                >
                  <Download size={14} />
                  Download PDF
                </button>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setSelectedChallan(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Challan Creation Drawer */}
      {isCreateOpen && (
        <div className="drawer-backdrop" onClick={() => setIsCreateOpen(false)}>
          <div className="drawer" style={{ width: '560px' }} onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h2 className="drawer-title">Generate Delivery Challan</h2>
              <button className="drawer-close" onClick={() => setIsCreateOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="alert-banner alert-banner-error">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
              <div className="form-group">
                <label className="form-label">Customer Account</label>
                <select
                  className="form-select"
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  required
                >
                  <option value="">Select client...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.companyName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Items Table Row */}
              <div>
                <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Challan Products</label>
                <div className="challan-items-list">
                  {items.map((item, index) => (
                    <div key={index} className="challan-item-row">
                      <select
                        className="form-select"
                        value={item.productId}
                        onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                        required
                      >
                        <option value="">Choose item...</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (Qty: {p.stockQuantity})
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="Qty"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        required
                      />
                      <input
                        type="number"
                        className="form-input"
                        placeholder="Price"
                        min="0"
                        step="0.01"
                        value={item.unitPrice || ''}
                        onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn-remove-item"
                        onClick={() => handleRemoveItemRow(index)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddItemRow}>
                  <PlusCircle size={14} />
                  <span>Add Another Item</span>
                </button>
              </div>

              <div className="form-group">
                <label className="form-label">Reference Notes (Optional)</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="e.g. Backorder instructions, delivery address overrides..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Create Challan (Draft)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
