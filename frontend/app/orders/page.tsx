'use client';
import { useEffect, useState } from 'react';
import { ShoppingCart, Filter } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { t, useLanguage, Lang } from '@/lib/i18n';
import api from '@/lib/api';

const STATUS_OPTIONS = ['all', 'pending', 'accepted', 'picking', 'shipped', 'delivered', 'cancelled'];

export default function OrdersPage() {
  const lang = useLanguage();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [channel, setChannel] = useState('');

  useEffect(() => {
    const ch = typeof window !== 'undefined' ? localStorage.getItem('bellaqa_channel') || '' : '';
    setChannel(ch);
    const params = new URLSearchParams();
    if (ch) params.set('channel', ch);
    api.get(`/orders?${params}`)
      .then(r => { setOrders(r.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? orders : orders.filter((o: any) => o.status === filter);

  const updateStatus = async (id: string, status: string) => {
    await api.patch(`/orders/${id}/status`, { status });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>{t('orders', lang)}</h1>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>{filtered.length} Bestellungen</p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {STATUS_OPTIONS.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: filter === s ? 'rgba(79,110,247,0.15)' : 'rgba(255,255,255,0.04)',
              border: filter === s ? '1px solid rgba(79,110,247,0.3)' : '1px solid rgba(255,255,255,0.06)',
              color: filter === s ? '#4f6ef7' : '#64748b',
            }}>
            {s === 'all' ? 'Alle' : t(s, lang)}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl overflow-hidden" style={{
        background: '#0f1524',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Bestellnr.', 'Kanal', 'Status', 'Netto', 'MwSt.', 'Pfand', 'Brutto', 'Datum', 'Aktion'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: '#64748b' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1,2,3,4,5].map(i => (
                <tr key={i}>
                  <td colSpan={9} className="px-4 py-3">
                    <div className="h-8 rounded-lg animate-pulse" style={{ background: '#161d30' }} />
                  </td>
                </tr>
              ))
            ) : filtered.map((o: any) => (
              <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                className="transition-colors hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <span className="text-sm font-medium" style={{ color: '#f1f5f9' }}>{o.orderNumber}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-md text-xs font-bold uppercase" style={{
                    background: o.channel === 'b2b' ? 'rgba(79,110,247,0.12)' : 'rgba(34,197,94,0.1)',
                    color: o.channel === 'b2b' ? '#4f6ef7' : '#22c55e',
                  }}>{o.channel}</span>
                </td>
                <td className="px-4 py-3"><StatusBadge status={o.status} lang={lang} /></td>
                <td className="px-4 py-3 text-sm" style={{ color: '#94a3b8' }}>
                  €{parseFloat(o.subtotalNet || 0).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: '#f59e0b' }}>
                  €{parseFloat(o.totalVat || 0).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: '#64748b' }}>
                  €{parseFloat(o.totalPfand || 0).toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-semibold" style={{ color: '#f1f5f9' }}>
                    €{parseFloat(o.totalGross || 0).toFixed(2)}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: '#64748b' }}>
                  {new Date(o.createdAt).toLocaleDateString('de-DE')}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="text-xs rounded-lg px-2 py-1 outline-none"
                    style={{
                      background: '#1e2740', color: '#94a3b8',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}>
                    {STATUS_OPTIONS.filter(s => s !== 'all').map(s => (
                      <option key={s} value={s}>{t(s, lang)}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filtered.length === 0 && (
          <p className="text-center py-12 text-sm" style={{ color: '#64748b' }}>
            Keine Bestellungen gefunden
          </p>
        )}
      </div>
    </div>
  );
}
