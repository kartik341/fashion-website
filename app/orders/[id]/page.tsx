'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import OrderTimeline from '@/components/OrderTimeline';
import type { Order, OrderStatus } from '@/lib/db';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/orders/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="section">
        <div className="container"><div className="spinner" /></div>
      </div>
    );
  }

  if (!order) notFound();

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 900 }}>
        <Link href="/orders" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '1.5rem', display: 'inline-block' }}>
          ← Back to Orders
        </Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 8 }}>
              Order #{order.id.slice(-8).toUpperCase()}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-light)' }}>
              ₹{order.total.toLocaleString('en-IN')}
            </p>
            <p style={{ fontSize: '0.8rem', color: order.payment.status === 'paid' ? 'var(--success)' : 'var(--text-muted)' }}>
              Payment: {order.payment.status}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="order-detail-grid">
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Order Status</h2>
            <OrderTimeline status={order.status as OrderStatus} createdAt={order.createdAt} updatedAt={order.updatedAt} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Items</h2>
              {order.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: idx < order.items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</p>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--accent-light)' }}>
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
              <div className="divider" />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: 4 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                <span>{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Delivery Address</h2>
              <p style={{ fontWeight: 600 }}>{order.address.name}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>
                {order.address.line1}
                {order.address.line2 && `, ${order.address.line2}`}
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                {order.address.city}, {order.address.state} — {order.address.pincode}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 8 }}>
                📞 {order.address.phone}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .order-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
