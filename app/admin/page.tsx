import { getProducts, getOrders, getUsers } from '@/lib/db';
import StatsCard from '@/components/admin/StatsCard';
import Link from 'next/link';

export default function AdminDashboard() {
  const products = getProducts();
  const orders = getOrders();
  const users = getUsers();
  const revenue = orders
    .filter((o) => o.payment.status === 'paid')
    .reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === 'placed' || o.status === 'processing').length;

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 8 }}>Dashboard</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Overview of your store performance</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <StatsCard title="Total Revenue" value={`₹${revenue.toLocaleString('en-IN')}`} icon="💰" color="green" change={`${orders.length} total orders`} />
        <StatsCard title="Products" value={products.length} icon="📦" color="purple" />
        <StatsCard title="Orders" value={orders.length} icon="🛍️" color="blue" change={`${pendingOrders} pending`} />
        <StatsCard title="Users" value={users.length} icon="👥" color="yellow" />
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Orders</h2>
          <Link href="/admin/orders" style={{ color: 'var(--accent-light)', fontSize: '0.875rem', textDecoration: 'none' }}>
            View all →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No orders yet</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem 0' }}>Order</th>
                  <th style={{ padding: '0.75rem 0' }}>Status</th>
                  <th style={{ padding: '0.75rem 0' }}>Total</th>
                  <th style={{ padding: '0.75rem 0' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem 0', fontWeight: 600 }}>#{order.id.slice(-8).toUpperCase()}</td>
                    <td style={{ padding: '0.75rem 0' }}>
                      <span className="badge badge-purple">{order.status}</span>
                    </td>
                    <td style={{ padding: '0.75rem 0' }}>₹{order.total.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '0.75rem 0', color: 'var(--text-muted)' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
