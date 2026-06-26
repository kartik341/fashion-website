'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { totalItems, openCart } = useCart();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Collection' },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
  };

  return (
    <>
      {/* Announcement bar */}
      <div style={{
        background: '#111111',
        color: 'white',
        textAlign: 'center',
        padding: '0.5rem 1rem',
        fontSize: '0.72rem',
        letterSpacing: '0.12em',
        fontWeight: 500,
      }}>
        FREE SHIPPING ON ORDERS ₹999+ &nbsp;·&nbsp; NEW COLLECTION: PRIMAVERA
      </div>

      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          transition: 'all 0.3s ease',
          background: scrolled ? 'rgba(255,255,255,0.96)' : '#FFFFFF',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none',
        }}
      >
        <div className="container" style={{ padding: '0 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>

            {/* Left nav links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="nav-links-desktop">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: '0.5rem 1rem',
                    textDecoration: 'none',
                    fontSize: '0.78rem',
                    fontWeight: isActive(link.href) ? 700 : 500,
                    color: isActive(link.href) ? '#111111' : '#666666',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    borderBottom: isActive(link.href) ? '1.5px solid #111111' : '1.5px solid transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {link.label}
                </Link>
              ))}
              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  style={{
                    padding: '0.5rem 1rem',
                    textDecoration: 'none',
                    fontSize: '0.78rem',
                    fontWeight: pathname.startsWith('/admin') ? 700 : 500,
                    color: pathname.startsWith('/admin') ? '#111111' : '#666666',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    borderBottom: pathname.startsWith('/admin') ? '1.5px solid #111111' : '1.5px solid transparent',
                  }}
                >
                  Admin
                </Link>
              )}
            </div>

            {/* Center Logo */}
            <Link
              href="/"
              style={{
                textDecoration: 'none',
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              <span
                style={{
                  fontSize: '1.6rem',
                  fontWeight: 900,
                  color: '#111111',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  fontFamily: 'Georgia, serif',
                }}
              >
                LUNIVYA
              </span>
            </Link>

            {/* Right actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>

              {/* Cart */}
              <button
                id="cart-btn"
                onClick={openCart}
                style={{
                  position: 'relative',
                  background: 'transparent',
                  border: 'none',
                  padding: '0.5rem',
                  cursor: 'pointer',
                  color: '#111111',
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.opacity = '0.6'}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.opacity = '1'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                {totalItems > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      background: '#111111',
                      color: 'white',
                      borderRadius: '50%',
                      width: 16,
                      height: 16,
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </button>

              {/* Auth */}
              {user ? (
                <div style={{ position: 'relative' }}>
                  <button
                    id="profile-btn"
                    onClick={() => setProfileOpen(!profileOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: 'transparent',
                      border: '1px solid #111111',
                      padding: '0.35rem 0.85rem',
                      cursor: 'pointer',
                      color: '#111111',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = '#111';
                      (e.currentTarget as HTMLElement).style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                      (e.currentTarget as HTMLElement).style.color = '#111';
                    }}
                  >
                    {user.name.split(' ')[0]}
                    <span style={{ fontSize: '0.6rem' }}>▼</span>
                  </button>

                  {profileOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        right: 0,
                        background: '#FFFFFF',
                        border: '1px solid rgba(0,0,0,0.12)',
                        padding: '0.5rem',
                        minWidth: 180,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                        zIndex: 200,
                        animation: 'fadeIn 0.15s ease',
                      }}
                    >
                      <div style={{ padding: '0.5rem 0.75rem', marginBottom: '0.25rem' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111' }}>{user.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#888' }}>{user.email}</div>
                      </div>
                      <div style={{ height: 1, background: 'rgba(0,0,0,0.08)', margin: '0.25rem 0' }} />
                      <Link
                        href="/orders"
                        onClick={() => setProfileOpen(false)}
                        style={{ display: 'block', padding: '0.5rem 0.75rem', textDecoration: 'none', color: '#444', fontSize: '0.8rem', letterSpacing: '0.05em' }}
                      >
                        My Orders
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setProfileOpen(false)}
                          style={{ display: 'block', padding: '0.5rem 0.75rem', textDecoration: 'none', color: '#444', fontSize: '0.8rem', letterSpacing: '0.05em' }}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <div style={{ height: 1, background: 'rgba(0,0,0,0.08)', margin: '0.25rem 0' }} />
                      <button
                        onClick={handleLogout}
                        style={{ width: '100%', padding: '0.5rem 0.75rem', background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer', textAlign: 'left', letterSpacing: '0.05em' }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  style={{
                    textDecoration: 'none',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: '#111111',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    borderBottom: '1px solid transparent',
                    paddingBottom: '1px',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.borderBottomColor = '#111'}
                  onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.borderBottomColor = 'transparent'}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .nav-links-desktop { display: none !important; }
          }
        `}</style>
      </nav>
    </>
  );
}
