'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊', exact: true },
  { href: '/admin/products', label: 'Products', icon: '📦', exact: false },
  { href: '/admin/orders', label: 'Orders', icon: '🛍️', exact: false },
  { href: '/admin/users', label: 'Users', icon: '👥', exact: false },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside
      style={{
        width: 240,
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        minHeight: 'calc(100vh - 4.5rem)',
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        flexShrink: 0,
      }}
    >
      {/* Admin header */}
      <div
        style={{
          padding: '0.75rem',
          marginBottom: '1rem',
          background: 'rgba(139,92,246,0.08)',
          border: '1px solid rgba(139,92,246,0.2)',
          borderRadius: 12,
        }}
      >
        <div style={{ fontSize: '0.75rem', color: 'var(--accent-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
          Admin Panel
        </div>
        <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.name || 'Admin'}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</div>
      </div>

      {/* Nav items */}
      {navItems.map((item) => {
        const active = isActive(item.href, item.exact);
        return (
          <Link
            key={item.href}
            href={item.href}
            id={`admin-nav-${item.label.toLowerCase()}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.65rem 0.875rem',
              borderRadius: 10,
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: active ? 600 : 400,
              color: active ? 'var(--accent-light)' : 'var(--text-secondary)',
              background: active ? 'rgba(139,92,246,0.12)' : 'transparent',
              border: `1px solid ${active ? 'rgba(139,92,246,0.25)' : 'transparent'}`,
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
            {item.label}
            {active && (
              <div
                style={{
                  marginLeft: 'auto',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--accent)',
                }}
              />
            )}
          </Link>
        );
      })}

      {/* Back to store */}
      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.65rem 0.875rem',
            borderRadius: 10,
            textDecoration: 'none',
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            transition: 'all 0.2s ease',
          }}
        >
          ← Back to Store
        </Link>
      </div>
    </aside>
  );
}
