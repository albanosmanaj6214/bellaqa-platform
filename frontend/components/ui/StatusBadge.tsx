'use client';
import { t, Lang } from '@/lib/i18n';

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  pending:   { bg: 'rgba(245,158,11,0.12)',  text: '#f59e0b', dot: '#f59e0b' },
  accepted:  { bg: 'rgba(79,110,247,0.12)',  text: '#4f6ef7', dot: '#4f6ef7' },
  picking:   { bg: 'rgba(139,92,246,0.12)',  text: '#8b5cf6', dot: '#8b5cf6' },
  shipped:   { bg: 'rgba(6,182,212,0.12)',   text: '#06b6d4', dot: '#06b6d4' },
  delivered: { bg: 'rgba(34,197,94,0.12)',   text: '#22c55e', dot: '#22c55e' },
  cancelled: { bg: 'rgba(239,68,68,0.12)',   text: '#ef4444', dot: '#ef4444' },
  draft:     { bg: 'rgba(100,116,139,0.12)', text: '#64748b', dot: '#64748b' },
  sent:      { bg: 'rgba(79,110,247,0.12)',  text: '#4f6ef7', dot: '#4f6ef7' },
  paid:      { bg: 'rgba(34,197,94,0.12)',   text: '#22c55e', dot: '#22c55e' },
  overdue:   { bg: 'rgba(239,68,68,0.12)',   text: '#ef4444', dot: '#ef4444' },
};

export function StatusBadge({ status, lang = 'de' }: { status: string; lang?: Lang }) {
  const cfg = statusConfig[status] || statusConfig['pending'];
  const statusKeyMap: Record<string, string> = {
    pending: 'pending', accepted: 'accepted', picking: 'picking',
    shipped: 'shipped', delivered: 'delivered', cancelled: 'cancelled',
  };
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
      style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.dot}30` }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot, boxShadow: `0 0 6px ${cfg.dot}` }} />
      {t(statusKeyMap[status] || status, lang) || status}
    </span>
  );
}
