import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/auth-context';
import apiClient from '../api/client';
import {
  Plus,
  Edit2,
  X,
  Users,
  Mail,
  Phone,
  MapPin,
  Building,
  Briefcase,
  Search,
  ChevronRight,
  ArrowLeft,
  Calendar,
  FileText,
  Hash,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';

export type CustomerType = 'Retail' | 'Wholesale' | 'Distributor';
export type CustomerStatus = 'Lead' | 'Active' | 'Inactive';

interface Customer {
  id: string;
  name: string;
  companyName: string;
  mobile: string;
  email: string;
  phone: string;
  address: string;
  gstNumber: string;
  customerType: CustomerType;
  status: CustomerStatus;
  followUpDate: string | null;
  notes: string;
  balance: number;
  assignedSalesId: string | null;
  assignedSales: { name: string } | null;
  createdAt: string;
}

const STATUS_COLORS: Record<CustomerStatus, string> = {
  Lead: 'badge-draft',
  Active: 'badge-delivered',
  Inactive: 'badge-cancelled',
};

const STATUS_ICON: Record<CustomerStatus, React.FC<any>> = {
  Lead: Clock,
  Active: CheckCircle,
  Inactive: AlertCircle,
};

const TYPE_COLORS: Record<CustomerType, string> = {
  Retail: '#3b82f6',
  Wholesale: '#8b5cf6',
  Distributor: '#f59e0b',
};

export const Customers: React.FC = () => {
  const { hasRole } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<CustomerType | 'all'>('all');

  // Views: 'list' | 'detail'
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [detailCustomer, setDetailCustomer] = useState<Customer | null>(null);

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [customerType, setCustomerType] = useState<CustomerType>('Retail');
  const [status, setStatus] = useState<CustomerStatus>('Lead');
  const [followUpDate, setFollowUpDate] = useState('');
  const [notes, setNotes] = useState('');
  const [balance, setBalance] = useState('0');
  const [assignedSalesId, setAssignedSalesId] = useState('');

  // Follow-up note to add in detail view
  const [followUpNote, setFollowUpNote] = useState('');
  const [followUpDateEdit, setFollowUpDateEdit] = useState('');

  const [salesStaff, setSalesStaff] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isSalesOrAdmin = hasRole(['admin', 'sales']);

  const fetchCustomers = async () => {
    try {
      const response = await apiClient.get<Customer[]>('/customers');
      setCustomers(response.data);
    } catch (err) {
      console.error('Error fetching customers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    if (hasRole(['admin'])) {
      apiClient
        .get('/users')
        .then((res) => {
          const salesOnly = res.data.filter((u: any) => u.role === 'sales');
          setSalesStaff(salesOnly);
        })
        .catch((e) => console.error(e));
    }
  }, []);

  // Filtered list
  const filtered = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.companyName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.mobile && c.mobile.includes(q)) ||
      (c.gstNumber && c.gstNumber.toLowerCase().includes(q));
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesType = typeFilter === 'all' || c.customerType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const openAddDrawer = () => {
    setEditingCustomer(null);
    setName('');
    setCompanyName('');
    setMobile('');
    setEmail('');
    setPhone('');
    setAddress('');
    setGstNumber('');
    setCustomerType('Retail');
    setStatus('Lead');
    setFollowUpDate('');
    setNotes('');
    setBalance('0');
    setAssignedSalesId('');
    setError(null);
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (customer: Customer) => {
    setEditingCustomer(customer);
    setName(customer.name);
    setCompanyName(customer.companyName);
    setMobile(customer.mobile || '');
    setEmail(customer.email);
    setPhone(customer.phone);
    setAddress(customer.address);
    setGstNumber(customer.gstNumber || '');
    setCustomerType(customer.customerType || 'Retail');
    setStatus(customer.status || 'Lead');
    setFollowUpDate(customer.followUpDate || '');
    setNotes(customer.notes || '');
    setBalance(customer.balance.toString());
    setAssignedSalesId(customer.assignedSalesId || '');
    setError(null);
    setIsDrawerOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload: any = {
      name,
      companyName,
      mobile: mobile || undefined,
      email,
      phone,
      address,
      gstNumber: gstNumber || undefined,
      customerType,
      status,
      followUpDate: followUpDate || undefined,
      notes: notes || undefined,
      balance: Number(balance),
      assignedSalesId: assignedSalesId || undefined,
    };

    try {
      if (editingCustomer) {
        await apiClient.put(`/customers/${editingCustomer.id}`, payload);
      } else {
        await apiClient.post('/customers', payload);
      }
      setIsDrawerOpen(false);
      await fetchCustomers();
      // If editing from detail view, refresh detail
      if (detailCustomer && editingCustomer && detailCustomer.id === editingCustomer.id) {
        const refreshed = customers.find((c) => c.id === editingCustomer.id);
        if (refreshed) setDetailCustomer(refreshed);
      }
    } catch (err: any) {
      const messages = err.response?.data?.messages;
      const errorMsg = messages
        ? (Array.isArray(messages) ? messages.join(', ') : messages)
        : (err.response?.data?.message || 'Failed to save customer');
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleAddFollowUpNote = async () => {
    if (!detailCustomer) return;
    setSaving(true);
    try {
      const payload: any = {
        name: detailCustomer.name,
        companyName: detailCustomer.companyName,
        email: detailCustomer.email,
        phone: detailCustomer.phone,
        address: detailCustomer.address,
        customerType: detailCustomer.customerType,
        status: detailCustomer.status,
        notes: followUpNote || detailCustomer.notes,
        followUpDate: followUpDateEdit || detailCustomer.followUpDate || undefined,
      };
      const res = await apiClient.put<Customer>(`/customers/${detailCustomer.id}`, payload);
      setDetailCustomer(res.data);
      setFollowUpNote('');
      setFollowUpDateEdit('');
      await fetchCustomers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const openDetailView = (customer: Customer) => {
    setDetailCustomer(customer);
    setFollowUpNote(customer.notes || '');
    setFollowUpDateEdit(customer.followUpDate || '');
    setView('detail');
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', padding: '40px 0' }}>
        <div className="spinner" />
        <span>Loading customers...</span>
      </div>
    );
  }

  // ---- Detail View ----
  if (view === 'detail' && detailCustomer) {
    const StatusIcon = STATUS_ICON[detailCustomer.status] || Clock;
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setView('list')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowLeft size={14} />
            Back to List
          </button>
          <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{detailCustomer.name}</span>
          <span style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            {isSalesOrAdmin && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => openEditDrawer(detailCustomer)}
              >
                <Edit2 size={14} />
                Edit Profile
              </button>
            )}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Profile card */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${TYPE_COLORS[detailCustomer.customerType] || '#3b82f6'}, ${TYPE_COLORS[detailCustomer.customerType] || '#3b82f6'}aa)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '20px',
                    flexShrink: 0,
                    color: '#fff',
                  }}
                >
                  {detailCustomer.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '2px' }}>{detailCustomer.name}</h2>
                  <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                    <Building size={13} />
                    {detailCustomer.companyName}
                  </div>
                </div>
                <span className={`badge ${STATUS_COLORS[detailCustomer.status]}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <StatusIcon size={11} />
                  {detailCustomer.status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Customer Type</div>
                  <span
                    style={{
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-lg)', /* Phase 7: was 20px */
                      fontSize: '12px',
                      fontWeight: 600,
                      background: `${TYPE_COLORS[detailCustomer.customerType]}22`,
                      color: TYPE_COLORS[detailCustomer.customerType],
                      border: `1px solid ${TYPE_COLORS[detailCustomer.customerType]}44`,
                    }}
                  >
                    {detailCustomer.customerType}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Outstanding</div>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: detailCustomer.balance > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>
                    {formatCurrency(detailCustomer.balance)}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact card */}
            <div className="card">
              <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                  <Mail size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  <a href={`mailto:${detailCustomer.email}`} style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>{detailCustomer.email}</a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                  <Phone size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  <span>{detailCustomer.phone}</span>
                </div>
                {detailCustomer.mobile && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                    <Phone size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <span>{detailCustomer.mobile} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>(mobile)</span></span>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px' }}>
                  <MapPin size={14} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '1px' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{detailCustomer.address}</span>
                </div>
                {detailCustomer.gstNumber && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                    <Hash size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <span>GST: <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)', fontWeight: 600 }}>{detailCustomer.gstNumber}</span></span>
                  </div>
                )}
                {detailCustomer.assignedSales && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                    <Briefcase size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <span>Sales Rep: <strong>{detailCustomer.assignedSales.name}</strong></span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Follow-up card */}
            <div className="card">
              <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Follow-Up Schedule
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Calendar size={16} style={{ color: 'var(--color-primary)' }} />
                <span style={{ fontSize: '15px', fontWeight: 600 }}>
                  {detailCustomer.followUpDate ? formatDate(detailCustomer.followUpDate) : 'No follow-up scheduled'}
                </span>
              </div>
              {isSalesOrAdmin && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="date"
                    className="form-input"
                    value={followUpDateEdit}
                    onChange={(e) => setFollowUpDateEdit(e.target.value)}
                    style={{ flex: 1, fontSize: '13px' }}
                  />
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleAddFollowUpNote}
                    disabled={saving}
                  >
                    Update
                  </button>
                </div>
              )}
            </div>

            {/* Notes card */}
            <div className="card" style={{ flex: 1 }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MessageSquare size={14} />
                CRM Notes
              </h3>

              <div
                style={{
                  minHeight: '80px',
                  padding: '14px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)', /* Phase 7: was 8px */
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: '16px',
                  fontStyle: detailCustomer.notes ? 'normal' : 'italic',
                }}
              >
                {detailCustomer.notes || 'No notes added yet.'}
              </div>

              {isSalesOrAdmin && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Add or update CRM notes..."
                    value={followUpNote}
                    onChange={(e) => setFollowUpNote(e.target.value)}
                  />
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleAddFollowUpNote}
                    disabled={saving || !followUpNote.trim()}
                    style={{ alignSelf: 'flex-end' }}
                  >
                    <MessageSquare size={14} />
                    Save Notes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- List View ----
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">CRM Clients</h1>
          <p className="page-subtitle">Manage customer profiles, follow-up schedules, and sales assignments.</p>
        </div>
        {isSalesOrAdmin && (
          <button className="btn btn-primary" onClick={openAddDrawer}>
            <Plus size={16} />
            <span>Add Customer</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search by name, company, email, phone, GST..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>
        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          style={{ minWidth: '140px' }}
        >
          <option value="all">All Statuses</option>
          <option value="Lead">Lead</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <select
          className="form-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as any)}
          style={{ minWidth: '140px' }}
        >
          <option value="all">All Types</option>
          <option value="Retail">Retail</option>
          <option value="Wholesale">Wholesale</option>
          <option value="Distributor">Distributor</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Users className="empty-state-icon" />
            <h3>{searchQuery || statusFilter !== 'all' || typeFilter !== 'all' ? 'No customers match your filters' : 'No Customers Registered'}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '400px', marginTop: '8px' }}>
              {searchQuery ? 'Try a different search term.' : 'Create profiles to track follow-ups, sales challans, and assign representatives.'}
            </p>
            {isSalesOrAdmin && !searchQuery && (
              <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={openAddDrawer}>
                Add Customer
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Customer / Company</th>
                <th>Contact</th>
                <th>Type / Status</th>
                <th>Follow-Up</th>
                {hasRole(['admin']) && <th>Sales Rep</th>}
                <th>Balance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const StatusIcon = STATUS_ICON[c.status] || Clock;
                return (
                  <tr key={c.id}>
                    <td>
                      <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${TYPE_COLORS[c.customerType] || '#3b82f6'}, ${TYPE_COLORS[c.customerType] || '#3b82f6'}88)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '13px',
                            color: '#fff',
                            flexShrink: 0,
                          }}
                        >
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div>{c.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Building size={11} />
                            {c.companyName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                        <Mail size={12} style={{ color: 'var(--text-muted)' }} />
                        <span>{c.email}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        <Phone size={12} style={{ color: 'var(--text-muted)' }} />
                        <span>{c.mobile || c.phone}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-lg)', /* Phase 7: was 20px */
                            fontSize: '11px',
                            fontWeight: 600,
                            background: `${TYPE_COLORS[c.customerType]}22`,
                            color: TYPE_COLORS[c.customerType],
                            border: `1px solid ${TYPE_COLORS[c.customerType]}44`,
                          }}
                        >
                          {c.customerType}
                        </span>
                        <span className={`badge ${STATUS_COLORS[c.status]}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', alignSelf: 'flex-start' }}>
                          <StatusIcon size={10} />
                          {c.status}
                        </span>
                      </div>
                    </td>
                    <td style={{ fontSize: '13px' }}>
                      {c.followUpDate ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={12} style={{ color: 'var(--color-warning)' }} />
                          <span>{formatDate(c.followUpDate)}</span>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>Not set</span>
                      )}
                    </td>
                    {hasRole(['admin']) && (
                      <td style={{ fontSize: '13px', color: c.assignedSales ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Briefcase size={12} />
                          <span>{c.assignedSales ? c.assignedSales.name : 'Unassigned'}</span>
                        </div>
                      </td>
                    )}
                    <td style={{ fontWeight: 700, color: c.balance > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>
                      {formatCurrency(c.balance)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => openDetailView(c)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <FileText size={12} />
                          View
                        </button>
                        {isSalesOrAdmin && (
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '6px 8px' }}
                            onClick={() => openEditDrawer(c)}
                          >
                            <Edit2 size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Slide Drawer for creation / edit */}
      {isDrawerOpen && (
        <div className="drawer-backdrop" onClick={() => setIsDrawerOpen(false)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h2 className="drawer-title">{editingCustomer ? 'Edit Client Profile' : 'Register New Client'}</h2>
              <button className="drawer-close" onClick={() => setIsDrawerOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="alert-banner alert-banner-error">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflowY: 'auto' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input type="text" className="form-input" placeholder="e.g. John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Business / Company Name *</label>
                <input type="text" className="form-input" placeholder="e.g. Acme Corp" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input type="email" className="form-input" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone *</label>
                  <input type="text" className="form-input" placeholder="e.g. 9876543210 (10 digits)" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Mobile</label>
                  <input type="text" className="form-input" placeholder="e.g. 9876543210 (10 digits)" value={mobile} onChange={(e) => setMobile(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">GST Number</label>
                  <input type="text" className="form-input" placeholder="e.g. 27ABCDE1234F1Z5 (15 chars)" value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Address *</label>
                <textarea className="form-textarea" rows={2} placeholder="Full street address, city, state, ZIP" value={address} onChange={(e) => setAddress(e.target.value)} required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Customer Type</label>
                  <select className="form-select" value={customerType} onChange={(e) => setCustomerType(e.target.value as CustomerType)}>
                    <option value="Retail">Retail</option>
                    <option value="Wholesale">Wholesale</option>
                    <option value="Distributor">Distributor</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value as CustomerStatus)}>
                    <option value="Lead">Lead</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Follow-Up Date</label>
                <input type="date" className="form-input" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea className="form-textarea" rows={3} placeholder="Customer notes, requirements, special instructions..." value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>

              {hasRole(['admin']) && (
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Outstanding Balance (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      step="0.01"
                      value={balance}
                      onChange={(e) => setBalance(e.target.value)}
                      disabled={!!editingCustomer}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Assigned Sales Rep</label>
                    <select className="form-select" value={assignedSalesId} onChange={(e) => setAssignedSalesId(e.target.value)}>
                      <option value="">Unassigned</option>
                      {salesStaff.map((staff) => (
                        <option key={staff.id} value={staff.id}>{staff.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div style={{ marginTop: 'auto', display: 'flex', gap: '12px', paddingTop: '16px' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setIsDrawerOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
