export type OrderStatus = 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const steps: { key: OrderStatus; label: string; icon: string; description: string }[] = [
  { key: 'placed', label: 'Order Placed', icon: '📋', description: 'Your order has been received' },
  { key: 'processing', label: 'Processing', icon: '⚙️', description: 'We are preparing your order' },
  { key: 'shipped', label: 'Shipped', icon: '🚚', description: 'Your order is on the way' },
  { key: 'delivered', label: 'Delivered', icon: '✅', description: 'Package delivered successfully' },
];

function getStepIndex(status: OrderStatus): number {
  if (status === 'cancelled') return -1;
  return steps.findIndex((s) => s.key === status);
}

export default function OrderTimeline({ status, createdAt, updatedAt }: {
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}) {
  const currentIdx = getStepIndex(status);
  const isCancelled = status === 'cancelled';

  if (isCancelled) {
    return (
      <div
        style={{
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 12,
          padding: '1.5rem',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>❌</div>
        <h3 style={{ color: '#fca5a5', fontWeight: 700, marginBottom: 4 }}>Order Cancelled</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          This order was cancelled on {new Date(updatedAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}
        </p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {steps.map((step, idx) => {
        const isCompleted = idx <= currentIdx;
        const isCurrent = idx === currentIdx;
        const isUpcoming = idx > currentIdx;

        return (
          <div key={step.key} style={{ display: 'flex', gap: '1.25rem', marginBottom: idx < steps.length - 1 ? '0.25rem' : 0 }}>
            {/* Indicator column */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  transition: 'all 0.3s ease',
                  background: isCompleted
                    ? isCurrent
                      ? 'var(--gradient-1)'
                      : 'rgba(139,92,246,0.2)'
                    : 'var(--bg-card)',
                  border: isCompleted
                    ? isCurrent
                      ? '2px solid var(--accent)'
                      : '2px solid rgba(139,92,246,0.4)'
                    : '2px solid var(--border)',
                  boxShadow: isCurrent ? '0 0 20px rgba(139,92,246,0.4)' : 'none',
                  animation: isCurrent ? 'pulse-glow 2s ease-in-out infinite' : 'none',
                }}
              >
                {step.icon}
              </div>
              {idx < steps.length - 1 && (
                <div
                  style={{
                    width: 2,
                    flex: 1,
                    minHeight: 40,
                    margin: '4px 0',
                    background: idx < currentIdx
                      ? 'var(--gradient-1)'
                      : 'var(--border)',
                    transition: 'background 0.3s ease',
                    borderRadius: 1,
                  }}
                />
              )}
            </div>

            {/* Content */}
            <div style={{ paddingBottom: idx < steps.length - 1 ? '1.5rem' : 0, paddingTop: '0.6rem' }}>
              <h4
                style={{
                  fontSize: '0.975rem',
                  fontWeight: 700,
                  color: isCompleted ? 'var(--text-primary)' : 'var(--text-muted)',
                  marginBottom: 2,
                }}
              >
                {step.label}
                {isCurrent && (
                  <span
                    className="badge badge-purple"
                    style={{ marginLeft: 8, fontSize: '0.7rem' }}
                  >
                    Current
                  </span>
                )}
              </h4>
              <p style={{ fontSize: '0.8rem', color: isUpcoming ? 'var(--text-muted)' : 'var(--text-secondary)' }}>
                {step.description}
              </p>
              {isCurrent && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  Updated: {new Date(updatedAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                </p>
              )}
              {step.key === 'placed' && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  {new Date(createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
