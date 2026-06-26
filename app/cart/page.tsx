'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, totalItems, clearCart } = useCart();
  const shipping = subtotal > 0 ? (subtotal >= 999 ? 0 : 99) : 0;
  const total = subtotal + shipping;

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 900 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>Shopping Cart</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
        </p>

        {items.length === 0 ? (
          <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Your cart is empty</p>
            <Link href="/products" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }} className="cart-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map((item) => (
                <div key={item.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem' }}>
                  <div style={{ width: 80, height: 80, borderRadius: 10, background: 'var(--gradient-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', flexShrink: 0 }}>
                    📦
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 4 }}>{item.name}</h3>
                    <p style={{ color: 'var(--accent-light)', fontWeight: 700, marginBottom: 12 }}>
                      ₹{item.price.toLocaleString('en-IN')}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '2px' }}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ width: 28, height: 28, background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>−</button>
                        <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock} style={{ width: 28, height: 28, background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>+</button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="btn-danger">Remove</button>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--accent-light)' }}>
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}

              <button onClick={clearCart} className="btn-ghost" style={{ alignSelf: 'flex-start', color: '#fca5a5' }}>
                Clear Cart
              </button>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', height: 'fit-content', position: 'sticky', top: '5.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Order Summary</h2>
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
              {subtotal < 999 && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                  Add ₹{(999 - subtotal).toLocaleString('en-IN')} more for free shipping
                </p>
              )}
              <div className="divider" />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <span style={{ fontWeight: 700 }}>Total</span>
                <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--accent-light)' }}>
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
              <Link href="/checkout" className="btn-primary" style={{ width: '100%', textAlign: 'center', marginBottom: '0.75rem' }}>
                Proceed to Checkout
              </Link>
              <Link href="/products" className="btn-secondary" style={{ width: '100%', textAlign: 'center' }}>
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
