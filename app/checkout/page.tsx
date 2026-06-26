'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface AddressForm {
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const shipping = subtotal > 0 ? (subtotal >= 999 ? 0 : 99) : 0;
  const total = subtotal + shipping;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [address, setAddress] = useState<AddressForm>({
    name: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    if (user?.name) {
      setAddress((prev) => ({ ...prev, name: user.name }));
    }
  }, [user]);

  const updateField = (field: keyof AddressForm, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handlePayment = async (e: FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    setError('');

    try {
      const amountPaise = Math.round(total * 100);
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountPaise }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create payment order');

      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!keyId) throw new Error('Payment is not configured. Add NEXT_PUBLIC_RAZORPAY_KEY_ID to .env.local');

      if (typeof window.Razorpay === 'undefined') {
        throw new Error('Razorpay checkout script failed to load. Please refresh and try again.');
      }

      const options: RazorpayOptions = {
        key: keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Lunivya',
        description: `Order for ${items.length} item${items.length > 1 ? 's' : ''}`,
        order_id: data.orderId,
        theme: { color: '#8b5cf6' },
        prefill: {
          name: address.name,
          email: user?.email,
          contact: address.phone,
        },
        handler: async (response) => {
          try {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.verified) {
              throw new Error('Payment verification failed');
            }

            const orderRes = await fetch('/api/orders', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                items: items.map((i) => ({
                  productId: i.id,
                  name: i.name,
                  price: i.price,
                  quantity: i.quantity,
                  image: i.image,
                })),
                subtotal,
                shipping,
                total,
                address: {
                  ...address,
                  line2: address.line2 || undefined,
                },
                payment: {
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  status: 'paid',
                },
              }),
            });
            const order = await orderRes.json();
            if (!orderRes.ok) throw new Error(order.error || 'Failed to create order');

            clearCart();
            router.push(`/orders/${order.id}`);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Order failed after payment');
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        setError('Payment failed. Please try again.');
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Your cart is empty</p>
          <Link href="/products" className="btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 1000 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Checkout</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem' }} className="checkout-grid">
          <form onSubmit={handlePayment} className="glass-card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Shipping Address</h2>

            {error && (
              <div style={{ padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, color: '#fca5a5', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: 6 }}>Full Name</label>
                <input className="input" value={address.name} onChange={(e) => updateField('name', e.target.value)} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: 6 }}>Phone</label>
                <input className="input" type="tel" value={address.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="10-digit mobile" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: 6 }}>Pincode</label>
                <input className="input" value={address.pincode} onChange={(e) => updateField('pincode', e.target.value)} pattern="[0-9]{6}" required />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: 6 }}>Address Line 1</label>
                <input className="input" value={address.line1} onChange={(e) => updateField('line1', e.target.value)} required />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: 6 }}>Address Line 2 (optional)</label>
                <input className="input" value={address.line2} onChange={(e) => updateField('line2', e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: 6 }}>City</label>
                <input className="input" value={address.city} onChange={(e) => updateField('city', e.target.value)} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: 6 }}>State</label>
                <input className="input" value={address.state} onChange={(e) => updateField('state', e.target.value)} required />
              </div>
            </div>

            <div className="divider" style={{ margin: '2rem 0' }} />

            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Payment</h2>
            <div style={{ padding: '1rem', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 10, marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                💳 Secure payment powered by <strong style={{ color: 'var(--accent-light)' }}>Razorpay</strong>
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                UPI, Cards, Net Banking, and Wallets accepted
              </p>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Processing...' : `Pay ₹${total.toLocaleString('en-IN')}`}
            </button>
          </form>

          <div className="glass-card" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Order Summary</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.name} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
              <span style={{ color: shipping === 0 ? 'var(--success)' : 'inherit' }}>
                {shipping === 0 ? 'FREE' : `₹${shipping}`}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700 }}>Total</span>
              <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--accent-light)' }}>
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
