'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { OrderStatus } from '@/lib/db';

interface Order {
  id: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  payment: { status: string };
}

const statusBadge: Record<OrderStatus, string> = {
  placed: 'badge-blue',
  processing: 'badge-yellow',
  shipped: 'badge-purple',
  delivered: 'badge-green',
  cancelled: 'badge-red',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders')
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 900 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>My Orders</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Track and manage your orders</p>

        {loading ? (
          <div className="spinner" />
        ) : orders.length === 0 ? (
          <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>No orders yet</p>
            <Link href="/products" className="btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: 8 }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        Order #{order.id.slice(-8).toUpperCase()}
                      </span>
                      <span className={`badge ${statusBadge[order.status]}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''} ·{' '}
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent-light)' }}>
                      ₹{order.total.toLocaleString('en-IN')}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: order.payment.status === 'paid' ? 'var(--success)' : 'var(--text-muted)' }}>
                      {order.payment.status === 'paid' ? 'Paid' : order.payment.status}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
