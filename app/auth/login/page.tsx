'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

function LoginForm() {
  const { login, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem 0' }}>
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
        background: '#111111',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '4rem',
        position: 'relative',
        overflow: 'hidden',
      }} className="auth-editorial">
        <div style={{
          position: 'absolute', bottom: -40, right: -40,
          width: 200, height: 200,
          borderRadius: '50%',
          border: '1px solid rgba(201,162,39,0.2)',
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
          color: '#FFFFFF',
          marginBottom: '1.5rem',
        }}>
          Welcome<br />Back.
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 300 }}>
          Sign in to access your wardrobe, track your orders, and discover new arrivals.
        </p>
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
            Sign In
          </h1>
          <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '2rem', letterSpacing: '0.04em' }}>
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" style={{ color: '#C9A227', textDecoration: 'none', fontWeight: 600 }}>
              Create one
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
                Email
              </label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#444', marginBottom: 8 }}>
                Password
              </label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ marginTop: '0.5rem', padding: '0.875rem' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: '#F5F4F0',
            fontSize: '0.78rem',
            color: '#888',
            lineHeight: 1.7,
            borderLeft: '3px solid #C9A227',
          }}>
            <strong style={{ color: '#444' }}>Demo accounts:</strong><br />
            Admin: admin@shop.com / admin123<br />
            User: user@shop.com / user123
          </div>
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" style={{ margin: '0 auto' }} />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
