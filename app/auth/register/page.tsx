'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { register, loading: authLoading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '85vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      background: '#FFFFFF',
    }} className="auth-grid">

      {/* Left — editorial panel */}
      <div style={{
        background: '#F5F4F0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '4rem',
        position: 'relative',
        overflow: 'hidden',
        borderRight: '1px solid rgba(0,0,0,0.08)',
      }} className="auth-editorial">
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 200, height: 200,
          borderRadius: '50%',
          border: '1px solid rgba(201,162,39,0.25)',
        }} />
        <div style={{
          fontSize: '0.68rem', fontWeight: 700,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: '#C9A227', marginBottom: '1.5rem',
        }}>
          Lunivya
        </div>
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          fontWeight: 900,
          lineHeight: 1.05,
          textTransform: 'uppercase',
          fontFamily: 'Georgia, serif',
          color: '#111111',
          marginBottom: '1.5rem',
        }}>
          Join the<br />Collection.
        </h2>
        <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 300 }}>
          Create an account to unlock early access to new arrivals, wishlist management, and exclusive member offers.
        </p>

        <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {['Free shipping on ₹999+', 'Early access to new collections', 'Easy returns & exchanges'].map((perk) => (
            <div key={perk} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#C9A227', fontSize: '0.8rem', fontWeight: 700 }}>✓</span>
              <span style={{ fontSize: '0.8rem', color: '#555', letterSpacing: '0.04em' }}>{perk}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '4rem',
        background: '#FFFFFF',
      }}>
        <div style={{ maxWidth: 380, width: '100%' }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: '#111',
            marginBottom: '0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            fontFamily: 'Georgia, serif',
          }}>
            Create Account
          </h1>
          <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '2rem', letterSpacing: '0.04em' }}>
            Already have an account?{' '}
            <Link href="/auth/login" style={{ color: '#C9A227', textDecoration: 'none', fontWeight: 600 }}>
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {error && (
              <div style={{
                padding: '0.75rem 1rem',
                background: 'rgba(239,68,68,0.05)',
                border: '1px solid rgba(239,68,68,0.2)',
                color: '#ef4444',
                fontSize: '0.82rem',
                letterSpacing: '0.04em',
              }}>
                {error}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#444', marginBottom: 8 }}>
                Full Name
              </label>
              <input type="text" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" required />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#444', marginBottom: 8 }}>
                Email
              </label>
              <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#444', marginBottom: 8 }}>
                Password
              </label>
              <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" minLength={6} required />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ marginTop: '0.5rem', padding: '0.875rem' }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .auth-grid { grid-template-columns: 1fr !important; }
          .auth-editorial { display: none !important; }
        }
      `}</style>
    </div>
  );
}
