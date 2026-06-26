export default function StatsCard({
  title,
  value,
  icon,
  change,
  color = 'purple',
}: {
  title: string;
  value: string | number;
  icon: string;
  change?: string;
  color?: 'purple' | 'green' | 'blue' | 'yellow';
}) {
  const colors = {
    purple: { bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)', icon: 'rgba(139,92,246,0.2)', text: 'var(--accent-light)' },
    green: { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)', icon: 'rgba(34,197,94,0.2)', text: '#86efac' },
    blue: { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)', icon: 'rgba(59,130,246,0.2)', text: '#93c5fd' },
    yellow: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', icon: 'rgba(245,158,11,0.2)', text: '#fcd34d' },
  };

  const c = colors[color];

  return (
    <div
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 16,
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        transition: 'all 0.3s ease',
      }}
    >
      <div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
          {title}
        </p>
        <p style={{ fontSize: '2rem', fontWeight: 800, color: c.text, lineHeight: 1 }}>
          {value}
        </p>
        {change && (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6 }}>
            {change}
          </p>
        )}
      </div>
      <div
        style={{
          width: 50,
          height: 50,
          borderRadius: 12,
          background: c.icon,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
        }}
      >
        {icon}
      </div>
    </div>
  );
}
