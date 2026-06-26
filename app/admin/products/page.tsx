'use client';

import { FormEvent, useEffect, useState } from 'react';
import type { Product } from '@/lib/db';

const emptyProduct = {
  name: '',
  description: '',
  price: 0,
  originalPrice: 0,
  category: 'Electronics',
  images: [''],
  stock: 0,
  rating: 4,
  reviewCount: 0,
  tags: [] as string[],
  featured: false,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [error, setError] = useState('');

  const fetchProducts = () => {
    fetch('/api/products')
      .then((r) => r.json())
      .then(setProducts)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyProduct);
    setShowForm(true);
    setError('');
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      images: product.images,
      stock: product.stock,
      rating: product.rating,
      reviewCount: product.reviewCount,
      tags: product.tags,
      featured: product.featured,
    });
    setShowForm(true);
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const payload = {
      ...form,
      tags: typeof form.tags === 'string' ? (form.tags as unknown as string).split(',').map((t) => t.trim()) : form.tags,
    };

    const url = editing ? `/api/products/${editing.id}` : '/api/products';
    const method = editing ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Failed to save product');
      return;
    }

    setShowForm(false);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 4 }}>Products</h1>
          <p style={{ color: 'var(--text-muted)' }}>{products.length} products in catalog</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>+ Add Product</button>
      </div>

      {showForm && (
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            {editing ? 'Edit Product' : 'New Product'}
          </h2>
          {error && <p style={{ color: '#fca5a5', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</p>}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Name</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Description</label>
              <textarea className="input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Price (₹)</label>
              <input type="number" className="input" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required />
            </div>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Original Price (₹)</label>
              <input type="number" className="input" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })} required />
            </div>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Category</label>
              <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {['Electronics', 'Fashion', 'Furniture', 'Wearables', 'Photography'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Stock</label>
              <input type="number" className="input" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} required />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Tags (comma-separated)</label>
              <input className="input" value={Array.isArray(form.tags) ? form.tags.join(', ') : ''} onChange={(e) => setForm({ ...form, tags: e.target.value.split(',').map((t) => t.trim()) })} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              <label htmlFor="featured" style={{ fontSize: '0.875rem' }}>Featured product</label>
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn-primary">{editing ? 'Save Changes' : 'Create Product'}</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="spinner" />
      ) : (
        <div className="glass-card" style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>Product</th>
                <th style={{ padding: '1rem' }}>Category</th>
                <th style={{ padding: '1rem' }}>Price</th>
                <th style={{ padding: '1rem' }}>Stock</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600 }}>{product.name}</div>
                    {product.featured && <span className="badge badge-purple" style={{ marginTop: 4 }}>Featured</span>}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{product.category}</td>
                  <td style={{ padding: '1rem' }}>₹{product.price.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '1rem', color: product.stock <= 5 ? '#fcd34d' : 'inherit' }}>{product.stock}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-ghost" onClick={() => openEdit(product)}>Edit</button>
                      <button className="btn-danger" onClick={() => handleDelete(product.id)}>Delete</button>
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
}
