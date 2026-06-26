import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 4.5rem)' }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: '2rem', overflow: 'auto' }}>
        {children}
      </div>
    </div>
  );
}
