import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/auth-context';
import apiClient from '../api/client';
import {
  Plus,
  Edit2,
  Package,
  X,
  ArrowUpRight,
  ArrowDownRight,
  Tag,
  Search,
  AlertTriangle,
  MapPin,
  Grid3X3,
  Warehouse,
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  price: number;
  cost: number;
  stockQuantity: number;
  minimumStock: number;
  location: string;
}

export const Products: React.FC = () => {
  const { hasRole } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Drawer states
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);
  const [isStockDrawerOpen, setIsStockDrawerOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProductForStock, setSelectedProductForStock] = useState<Product | null>(null);

  // Product Form states
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('0');
  const [cost, setCost] = useState('0');
  const [initialStock, setInitialStock] = useState('0');
  const [minimumStock, setMinimumStock] = useState('0');
  const [location, setLocation] = useState('');

  // Stock Adjustment Form states
  const [adjustmentQty, setAdjustmentQty] = useState('1');
  const [adjustmentType, setAdjustmentType] = useState<'IN' | 'OUT'>('IN');
  const [adjustmentRef, setAdjustmentRef] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const canEditProduct = hasRole(['admin', 'warehouse']);

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get<Product[]>('/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Unique categories
  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];

  const filtered = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.location && p.location.toLowerCase().includes(q));
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const lowStockCount = products.filter((p) => p.minimumStock > 0 && p.stockQuantity <= p.minimumStock).length;

  const openAddProductDrawer = () => {
    setEditingProduct(null);
    setName('');
    setSku('');
    setDescription('');
    setCategory('');
    setPrice('0');
    setCost('0');
    setInitialStock('0');
    setMinimumStock('0');
    setLocation('');
    setError(null);
    setIsProductDrawerOpen(true);
  };

  const openEditProductDrawer = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setSku(product.sku);
    setDescription(product.description || '');
    setCategory(product.category || '');
    setPrice(product.price.toString());
    setCost(product.cost.toString());
    setInitialStock(product.stockQuantity.toString());
    setMinimumStock((product.minimumStock || 0).toString());
    setLocation(product.location || '');
    setError(null);
    setIsProductDrawerOpen(true);
  };

  const openStockAdjustmentDrawer = (product: Product) => {
    setSelectedProductForStock(product);
    setAdjustmentQty('1');
    setAdjustmentType('IN');
    setAdjustmentRef('Manual Stock Adjustment');
    setError(null);
    setIsStockDrawerOpen(true);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload: any = {
      name,
      sku,
      description: description || undefined,
      category: category || undefined,
      price: Number(price),
      cost: Number(cost),
      minimumStock: Number(minimumStock),
      location: location || undefined,
      stockQuantity: editingProduct ? undefined : Number(initialStock),
    };

    try {
      if (editingProduct) {
        await apiClient.put(`/products/${editingProduct.id}`, payload);
      } else {
        await apiClient.post('/products', payload);
      }
      setIsProductDrawerOpen(false);
      fetchProducts();
    } catch (err: any) {
      const messages = err.response?.data?.messages;
      const errorMsg = messages
        ? (Array.isArray(messages) ? messages.join(', ') : messages)
        : (err.response?.data?.message || 'Failed to save product');
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    if (!selectedProductForStock) return;

    const payload = {
      productId: selectedProductForStock.id,
      quantity: Number(adjustmentQty),
      type: adjustmentType,
      reference: adjustmentRef,
    };

    try {
      await apiClient.post('/stock-movements', payload);
      setIsStockDrawerOpen(false);
      fetchProducts();
    } catch (err: any) {
      const messages = err.response?.data?.messages;
      const errorMsg = messages
        ? (Array.isArray(messages) ? messages.join(', ') : messages)
        : (err.response?.data?.message || 'Failed to record stock movement');
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', padding: '40px 0' }}>
        <div className="spinner" />
        <span>Loading catalog...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventory Catalog</h1>
          <p className="page-subtitle">Track stock levels, pricing, categories, and warehouse locations.</p>
        </div>
        {canEditProduct && (
          <button className="btn btn-primary" onClick={openAddProductDrawer}>
            <Plus size={16} />
            <span>Add Product</span>
          </button>
        )}
      </div>

      {/* Low stock alert banner */}
      {lowStockCount > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '10px',
            marginBottom: '16px',
            fontSize: '13px',
            color: 'var(--color-warning)',
          }}
        >
          <AlertTriangle size={16} />
          <span>
            <strong>{lowStockCount} product{lowStockCount > 1 ? 's' : ''}</strong> {lowStockCount > 1 ? 'are' : 'is'} at or below minimum stock level
          </span>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search by name, SKU, category, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>
        <select
          className="form-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ minWidth: '160px' }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Package className="empty-state-icon" />
            <h3>{searchQuery || categoryFilter !== 'all' ? 'No products match your filters' : 'Inventory Catalog is Empty'}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '400px', marginTop: '8px' }}>
              {searchQuery ? 'Try a different search term.' : 'Add items to your catalog to enable stock tracking and create delivery challans.'}
            </p>
            {canEditProduct && !searchQuery && (
              <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={openAddProductDrawer}>
                Add Product
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Product / SKU</th>
                <th>Category / Location</th>
                <th>Cost</th>
                <th>Price</th>
                <th>Stock</th>
                {canEditProduct && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const isLowStock = p.minimumStock > 0 && p.stockQuantity <= p.minimumStock;
                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Tag size={11} />
                        <span style={{ fontFamily: 'monospace' }}>{p.sku}</span>
                      </div>
                      {p.description && (
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.description}
                        </div>
                      )}
                    </td>
                    <td>
                      {p.category && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
                          <Grid3X3 size={12} style={{ color: 'var(--text-muted)' }} />
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-lg)', /* Phase 7: was 20px */
                              fontSize: '11px',
                              fontWeight: 600,
                              background: 'rgba(99, 102, 241, 0.15)',
                              color: '#818cf8',
                              border: '1px solid rgba(99,102,241,0.3)',
                            }}
                          >
                            {p.category}
                          </span>
                        </div>
                      )}
                      {p.location && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                          <Warehouse size={11} style={{ color: 'var(--text-muted)' }} />
                          <span>{p.location}</span>
                        </div>
                      )}
                    </td>
                    <td>{formatCurrency(p.cost)}</td>
                    <td>{formatCurrency(p.price)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span
                          style={{
                            fontWeight: 700,
                            color: isLowStock ? 'var(--color-warning)' : p.stockQuantity > (p.minimumStock * 2 || 20) ? 'var(--color-success)' : 'var(--text-primary)',
                          }}
                        >
                          {p.stockQuantity} units
                        </span>
                        {isLowStock && (
                          <span title={`Low stock! Min: ${p.minimumStock}`}>
                            <AlertTriangle size={13} style={{ color: 'var(--color-warning)' }} />
                          </span>
                        )}
                      </div>
                      {p.minimumStock > 0 && (
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Min: {p.minimumStock}
                        </div>
                      )}
                    </td>
                    {canEditProduct && (
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '6px 8px' }}
                            title="Edit product"
                            onClick={() => openEditProductDrawer(p)}
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '6px 10px', color: 'var(--color-accent)' }}
                            title="Adjust stock"
                            onClick={() => openStockAdjustmentDrawer(p)}
                          >
                            Adjust
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Add/Edit Drawer */}
      {isProductDrawerOpen && (
        <div className="drawer-backdrop" onClick={() => setIsProductDrawerOpen(false)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h2 className="drawer-title">{editingProduct ? 'Edit Product' : 'Add Catalog Product'}</h2>
              <button className="drawer-close" onClick={() => setIsProductDrawerOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="alert-banner alert-banner-error">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflowY: 'auto' }}>
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input type="text" className="form-input" placeholder="e.g. Dell Latitude 5420" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">SKU / Code *</label>
                  <input type="text" className="form-input" placeholder="e.g. LAP-DELL-001" value={sku} onChange={(e) => setSku(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input type="text" className="form-input" placeholder="e.g. Computers, Audio" value={category} onChange={(e) => setCategory(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" rows={2} placeholder="Technical specs, product details..." value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Cost Price (₹) *</label>
                  <input type="number" className="form-input" step="0.01" min="0" value={cost} onChange={(e) => setCost(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Selling Price (₹) *</label>
                  <input type="number" className="form-input" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>
              </div>

              {!editingProduct && (
                <div className="form-group">
                  <label className="form-label">Initial Stock Quantity</label>
                  <input type="number" className="form-input" min="0" value={initialStock} onChange={(e) => setInitialStock(e.target.value)} />
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Minimum Stock Alert</label>
                  <input type="number" className="form-input" min="0" value={minimumStock} onChange={(e) => setMinimumStock(e.target.value)} placeholder="0 = no alert" />
                </div>
                <div className="form-group">
                  <label className="form-label">Location / Warehouse</label>
                  <input type="text" className="form-input" placeholder="e.g. Warehouse A - Shelf 1" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', gap: '12px', paddingTop: '16px' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setIsProductDrawerOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>{saving ? 'Saving...' : 'Save Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Adjustment Drawer */}
      {isStockDrawerOpen && selectedProductForStock && (
        <div className="drawer-backdrop" onClick={() => setIsStockDrawerOpen(false)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h2 className="drawer-title">Stock Ledger Entry</h2>
              <button className="drawer-close" onClick={() => setIsStockDrawerOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div
              style={{
                padding: '16px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)', /* Phase 7: was 8px */
                marginBottom: '4px',
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '15px' }}>{selectedProductForStock.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <span>SKU: <strong>{selectedProductForStock.sku}</strong></span>
                <span>Current Stock: <strong style={{ color: selectedProductForStock.stockQuantity <= (selectedProductForStock.minimumStock || 0) ? 'var(--color-warning)' : 'var(--color-success)' }}>{selectedProductForStock.stockQuantity} units</strong></span>
                {selectedProductForStock.location && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={11} />{selectedProductForStock.location}</span>
                )}
              </div>
            </div>

            {error && (
              <div className="alert-banner alert-banner-error">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleStockSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
              <div className="form-group">
                <label className="form-label">Movement Type</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    className={`btn ${adjustmentType === 'IN' ? 'btn-success' : 'btn-secondary'}`}
                    style={{ flex: 1 }}
                    onClick={() => setAdjustmentType('IN')}
                  >
                    <ArrowUpRight size={16} />
                    <span>Inward (IN)</span>
                  </button>
                  <button
                    type="button"
                    className={`btn ${adjustmentType === 'OUT' ? 'btn-danger' : 'btn-secondary'}`}
                    style={{ flex: 1 }}
                    onClick={() => setAdjustmentType('OUT')}
                  >
                    <ArrowDownRight size={16} />
                    <span>Outward (OUT)</span>
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input type="number" className="form-input" min="1" value={adjustmentQty} onChange={(e) => setAdjustmentQty(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Reason / Reference</label>
                <input type="text" className="form-input" placeholder="e.g. Manual count, Supplier receipt, Damaged goods" value={adjustmentRef} onChange={(e) => setAdjustmentRef(e.target.value)} required />
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setIsStockDrawerOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>{saving ? 'Processing...' : 'Commit Adjustment'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
