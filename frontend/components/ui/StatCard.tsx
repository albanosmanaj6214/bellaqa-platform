'use client';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: number; label: string };
  accent?: 'blue' | 'green' | 'amber' | 'purple';
}

const accentMap = {
  blue:   { bg: 'rgba(79,110,247,0.08)',  border: 'rgba(79,110,247,0.15)',  icon: 'rgba(79,110,247,0.15)',  color: '#4f6ef7' },
  green:  { bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.15)',   icon: 'rgba(34,197,94,0.12)',   color: '#22c55e' },
  amber:  { bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.15)',  icon: 'rgba(245,158,11,0.12)',  color: '#f59e0b' },
  purple: { bg: 'rgba(139,92,246,0.08)',  border: 'rgba(139,92,246,0.15)',  icon: 'rgba(139,92,246,0.12)',  color: '#8b5cf6' },
};

export function StatCard({ title, value, subtitle, icon, trend, accent = 'blue' }: StatCardProps) {
  const a = accentMap[accent];
  return (
    <div className="rounded-2xl p-5" style={{
      background: a.bg,
      border: `1px solid ${a.border}`,
      boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
    }}>
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium" style={{ color: '#94a3b8' }}>{title}</p>
        {icon && (
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: a.icon }}>
            <span style={{ color: a.color }}>{icon}</span>
          </div>
        )}
      </div>
      <p className="text-3xl font-bold tracking-tight" style={{ color: '#f1f5f9' }}>{value}</p>
      {subtitle && <p className="text-xs mt-1" style={{ color: '#64748b' }}>{subtitle}</p>}
      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          <span className="text-xs font-semibold" style={{ color: trend.value >= 0 ? '#22c55e' : '#ef4444' }}>
            {trend.value >= 0 ? '+' : ''}{trend.value}%
          </span>
          <span className="text-xs" style={{ color: '#64748b' }}>{trend.label}</span>
        </div>
      )}
    </div>
  );
}
