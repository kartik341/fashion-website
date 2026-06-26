'use client';

import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: '#111111', color: '#FFFFFF' }}>

      {/* Marquee ticker */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '0.75rem 0',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}>
        <div className="animate-marquee" style={{ display: 'inline-flex', gap: '3rem' }}>
          {Array(6).fill(null).map((_, i) => (
            <span key={i} style={{ fontSize: '0.72rem', letterSpacing: '0.15em', fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>
              LUNIVYA &nbsp;·&nbsp; NEW COLLECTION &nbsp;·&nbsp; PRIMAVERA &nbsp;·&nbsp; FREE SHIPPING ₹999+
            </span>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="container" style={{ padding: '4rem 2rem 3rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          marginBottom: '4rem',
        }}>

          {/* Brand */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: 900,
              letterSpacing: '0.15em',
              fontFamily: 'Georgia, serif',
              marginBottom: '1rem',
              color: '#FFFFFF',
            }}>
              LUNIVYA
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: 280 }}>
              Timeless clothing designed for comfort, confidence, and everyday style. Discover pieces that fit your lifestyle.
            </p>
          </div>

          {/* Collection */}
          <div>
            <h3 style={{ fontSize: '0.7rem', fontWeight: 700, marginBottom: '1.25rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Collection</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { href: '/products', label: 'All Pieces' },
                { href: '/products?category=Fashion', label: 'Clothing' },
                { href: '/products?sort=newest', label: 'New Arrivals' },
                { href: '/products?featured=true', label: 'Featured' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', textDecoration: 'none', letterSpacing: '0.04em', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A227')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 style={{ fontSize: '0.7rem', fontWeight: 700, marginBottom: '1.25rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Account</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { href: '/auth/login', label: 'Sign In' },
                { href: '/auth/register', label: 'Register' },
                { href: '/orders', label: 'My Orders' },
                { href: '/cart', label: 'My Cart' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', textDecoration: 'none', letterSpacing: '0.04em', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A227')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', letterSpacing: '0.06em' }}>
            © {year} LUNIVYA. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {['Razorpay Secured', 'Free Returns', 'Worldwide Shipping'].map((item) => (
              <span key={item} style={{
                fontSize: '0.7rem',
                color: 'rgba(255,255,255,0.4)',
                letterSpacing: '0.06em',
              }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
