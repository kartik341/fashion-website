'use client';

import { useEffect, useState } from 'react';
import type { Order, OrderStatus } from '@/lib/db';

const statuses: OrderStatus[] = ['placed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = () => {
    fetch('/api/orders')
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: OrderStatus) => {
    setUpdating(id);
    await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
    setUpdating(null);
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 4 }}>Orders</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{orders.length} total orders</p>

      {loading ? (
        <div className="spinner" />
      ) : orders.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No orders yet
        </div>
      ) : (
        <div className="glass-card" style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>Order</th>
                <th style={{ padding: '1rem' }}>Customer</th>
                <th style={{ padding: '1rem' }}>Items</th>
                <th style={{ padding: '1rem' }}>Total</th>
                <th style={{ padding: '1rem' }}>Payment</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>#{order.id.slice(-8).toUpperCase()}</td>
                  <td style={{ padding: '1rem' }}>
                    <div>{order.address.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.address.phone}</div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{order.items.length}</td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>₹{order.total.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge ${order.payment.status === 'paid' ? 'badge-green' : 'badge-yellow'}`}>
                      {order.payment.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <select
                      className="input"
                      style={{ width: 'auto', fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
                      value={order.status}
                      disabled={updating === order.id}
                      onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
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
