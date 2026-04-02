'use client';
import { useEffect, useState } from 'react';
import { ShoppingCart, Package, FileText, TrendingUp, Users, Euro } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { t, useLanguage } from '@/lib/i18n';
import api from '@/lib/api';

export default function DashboardPage() {
  const lang = useLanguage();
  const [analytics, setAnalytics] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/orders/analytics').catch(() => ({ data: {} })),
      api.get('/orders?limit=8').catch(() => ({ data: [] })),
    ]).then(([anaRes, ordRes]) => {
      setAnalytics(anaRes.data);
      setOrders(Array.isArray(ordRes.data) ? ordRes.data.slice(0, 8) : []);
      setLoading(false);
    });
  }, []);

  const statusCounts = analytics?.statusCounts?.reduce((acc: any, s: any) => {
    acc[s.status] = parseInt(s.count);
    return acc;
  }, {}) || {};

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#f1f5f9' }}>
          {t('dashboard', lang)}
        </h1>
        <p className="text-sm mt-1" style={{ color: '#64748b' }}>
          BELLAQA GmbH — Lebensmittelvertrieb Deutschland
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          title={t('total_revenue', lang)}
          value={loading ? '...' : `€${parseFloat(analytics?.totalRevenue || 0).toLocaleString('de-DE', { minimumFractionDigits: 2 })}`}
          icon={<Euro size={16} />}
          accent="blue"
          trend={{ value: 12.4, label: 'ggü. Vormonat' }}
        />
        <StatCard
          title="B2B Bestellungen"
          value={loading ? '...' : analytics?.b2bOrders || 0}
          icon={<Users size={16} />}
          accent="purple"
          trend={{ value: 8.1, label: 'ggü. Vormonat' }}
        />
        <StatCard
          title="B2C Bestellungen"
          value={loading ? '...' : analytics?.b2cOrders || 0}
          icon={<ShoppingCart size={16} />}
          accent="green"
          trend={{ value: 22.7, label: 'ggü. Vormonat' }}
        />
        <StatCard
          title="Geliefert"
          value={loading ? '...' : statusCounts.delivered || 0}
          icon={<TrendingUp size={16} />}
          accent="amber"
          subtitle="Dieser Monat"
        />
      </div>

      {/* Order Status Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="xl:col-span-2 rounded-2xl p-6" style={{
          background: '#0f1524',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
        }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold" style={{ color: '#f1f5f9' }}>{t('orders', lang)}</h2>
            <a href="/orders" className="text-xs font-medium" style={{ color: '#4f6ef7' }}>
              Alle anzeigen →
            </a>
          </div>
          <div className="space-y-2">
            {loading ? (
              [1,2,3,4].map(i => (
                <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: '#161d30' }} />
              ))
            ) : orders.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: '#64748b' }}>Keine Bestellungen vorhanden</p>
            ) : orders.map((o: any) => (
              <div key={o.id} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{
                background: '#161d30', border: '1px solid rgba(255,255,255,0.04)',
              }}>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-8 rounded-full" style={{
                    background: o.channel === 'b2b' ? '#4f6ef7' : '#22c55e',
                  }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#f1f5f9' }}>{o.orderNumber}</p>
                    <p className="text-xs" style={{ color: '#64748b' }}>
                      {new Date(o.createdAt).toLocaleDateString('de-DE')} · {o.channel?.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={o.status} lang={lang} />
                  <p className="text-sm font-semibold" style={{ color: '#f1f5f9' }}>
                    €{parseFloat(o.totalGross || 0).toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="rounded-2xl p-6" style={{
          background: '#0f1524',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
        }}>
          <h2 className="font-semibold mb-5" style={{ color: '#f1f5f9' }}>Bestellstatus</h2>
          <div className="space-y-3">
            {[
              { key: 'pending', label: t('pending', lang) },
              { key: 'accepted', label: t('accepted', lang) },
              { key: 'picking', label: t('picking', lang) },
              { key: 'delivered', label: t('delivered', lang) },
              { key: 'cancelled', label: t('cancelled', lang) },
            ].map(({ key, label }) => {
              const count = statusCounts[key] || 0;
              const total = Object.values(statusCounts).reduce((a: any, b: any) => a + b, 0) as number;
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={key}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: '#94a3b8' }}>{label}</span>
                    <span style={{ color: '#f1f5f9' }}>{count}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full transition-all" style={{
                      width: `${pct}%`,
                      background: 'linear-gradient(90deg, #4f6ef7, #a78bfa)',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
