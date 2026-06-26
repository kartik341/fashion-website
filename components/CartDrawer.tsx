'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, totalItems } = useCart();
  const shipping = subtotal > 0 ? (subtotal >= 999 ? 0 : 99) : 0;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 200,
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Drawer */}
      <div
        id="cart-drawer"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: 420,
          background: '#FFFFFF',
          borderLeft: '1px solid rgba(0,0,0,0.08)',
          zIndex: 201,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.3s ease',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#111' }}>
              Your Bag
            </h2>
            <p style={{ fontSize: '0.75rem', color: '#888', marginTop: 2, letterSpacing: '0.06em' }}>
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            onClick={closeCart}
            style={{
              background: 'transparent',
              border: '1px solid rgba(0,0,0,0.12)',
              width: 34,
              height: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#111',
              fontSize: '0.9rem',
              transition: 'all 0.2s',
            }}
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.3 }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </div>
              <p style={{ color: '#888', marginBottom: '1.5rem', fontSize: '0.85rem', letterSpacing: '0.06em' }}>
                Your bag is empty
              </p>
              <button onClick={closeCart} className="btn-primary" style={{ fontSize: '0.78rem' }}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '1rem 0',
                    borderBottom: idx < items.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                  }}
                >
                  {/* Image */}
                  <div style={{
                    width: 80,
                    height: 100,
                    background: '#F5F4F0',
                    flexShrink: 0,
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'center top' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                        👗
                      </div>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 4, color: '#111', lineHeight: 1.3 }}>
                      {item.name}
                    </p>
                    <p style={{ fontSize: '0.9rem', color: '#111', fontWeight: 700, marginBottom: 10 }}>
                      ₹{item.price.toLocaleString('en-IN')}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {/* Qty */}
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(0,0,0,0.12)', gap: 0 }}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{ width: 30, height: 30, background: 'none', border: 'none', color: '#111', cursor: 'pointer', fontSize: '1rem' }}
                        >
                          −
                        </button>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, minWidth: 24, textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          style={{ width: 30, height: 30, background: 'none', border: 'none', color: item.quantity >= item.stock ? '#CCC' : '#111', cursor: item.quantity >= item.stock ? 'not-allowed' : 'pointer', fontSize: '1rem' }}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        style={{
                          background: 'none', border: 'none',
                          color: '#999', cursor: 'pointer', fontSize: '0.72rem',
                          letterSpacing: '0.06em', textTransform: 'uppercase',
                          textDecoration: 'underline',
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.08)', background: '#FFFFFF' }}>
            {/* Free shipping progress */}
            {subtotal < 999 && (
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.72rem', color: '#888', marginBottom: '0.5rem', letterSpacing: '0.06em' }}>
                  Add ₹{(999 - subtotal).toLocaleString('en-IN')} more for free shipping
                </p>
                <div style={{ height: 2, background: 'rgba(0,0,0,0.08)', borderRadius: 2 }}>
                  <div style={{ height: '100%', width: `${Math.min((subtotal / 999) * 100, 100)}%`, background: '#C9A227', transition: 'width 0.3s ease' }} />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.82rem' }}>
              <span style={{ color: '#888' }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.82rem' }}>
              <span style={{ color: '#888' }}>Shipping</span>
              <span style={{ color: shipping === 0 ? '#22a06b' : '#111', fontWeight: 600 }}>
                {shipping === 0 ? 'FREE' : `₹${shipping}`}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid rgba(0,0,0,0.08)', marginBottom: '1.25rem' }}>
              <span style={{ fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '0.82rem' }}>Total</span>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111' }}>
                ₹{(subtotal + shipping).toLocaleString('en-IN')}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="btn-primary"
                style={{ textAlign: 'center' }}
              >
                Proceed to Checkout
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="btn-secondary"
                style={{ textAlign: 'center' }}
              >
                View Full Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
