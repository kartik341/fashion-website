'use client';

import { useEffect, useState } from 'react';

interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    fetch('/api/users')
      .then((r) => r.json())
      .then(setUsers)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUser = async (id: string, updates: { role?: string; name?: string }) => {
    await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    fetchUsers();
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) alert(data.error || 'Failed to delete');
    fetchUsers();
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 4 }}>Users</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{users.length} registered users</p>

      {loading ? (
        <div className="spinner" />
      ) : (
        <div className="glass-card" style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Email</th>
                <th style={{ padding: '1rem' }}>Role</th>
                <th style={{ padding: '1rem' }}>Joined</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{user.name}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{user.email}</td>
                  <td style={{ padding: '1rem' }}>
                    <select
                      className="input"
                      style={{ width: 'auto', fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
                      value={user.role}
                      onChange={(e) => updateUser(user.id, { role: e.target.value })}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                    {new Date(user.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button className="btn-danger" onClick={() => deleteUser(user.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
