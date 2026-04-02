'use client';
import { useEffect, useState } from 'react';
import { FileText, CheckCircle } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { t, useLanguage } from '@/lib/i18n';
import api from '@/lib/api';

export default function InvoicesPage() {
  const lang = useLanguage();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/invoices')
      .then(r => { setInvoices(r.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const markPaid = async (id: string) => {
    await api.patch(`/invoices/${id}/paid`);
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status: 'paid' } : i));
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>{t('invoices', lang)}</h1>
        <p className="text-sm mt-1" style={{ color: '#64748b' }}>Deutsche MwSt.-konforme Rechnungen (7% / 19%)</p>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{
        background: '#0f1524', border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Rechnungsnr.', 'Status', 'Netto', 'MwSt. 7%', 'MwSt. 19%', 'Pfand', 'Brutto', 'Fällig', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: '#64748b' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1,2,3].map(i => (
                <tr key={i}><td colSpan={9} className="px-4 py-3">
                  <div className="h-8 rounded-lg animate-pulse" style={{ background: '#161d30' }} />
                </td></tr>
              ))
            ) : invoices.map((inv: any) => (
              <tr key={inv.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                className="transition-colors hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <span className="text-sm font-medium" style={{ color: '#f1f5f9' }}>{inv.invoiceNumber}</span>
                </td>
                <td className="px-4 py-3"><StatusBadge status={inv.status} lang={lang} /></td>
                <td className="px-4 py-3 text-sm" style={{ color: '#94a3b8' }}>€{parseFloat(inv.subtotalNet||0).toFixed(2)}</td>
                <td className="px-4 py-3 text-sm" style={{ color: '#f59e0b' }}>€{parseFloat(inv.vat7Amount||0).toFixed(2)}</td>
                <td className="px-4 py-3 text-sm" style={{ color: '#f59e0b' }}>€{parseFloat(inv.vat19Amount||0).toFixed(2)}</td>
                <td className="px-4 py-3 text-sm" style={{ color: '#64748b' }}>€{parseFloat(inv.totalPfand||0).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className="text-sm font-bold" style={{ color: '#f1f5f9' }}>€{parseFloat(inv.totalGross||0).toFixed(2)}</span>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: inv.status === 'overdue' ? '#ef4444' : '#64748b' }}>
                  {inv.dueDate || '—'}
                </td>
                <td className="px-4 py-3">
                  {inv.status !== 'paid' && (
                    <button onClick={() => markPaid(inv.id)}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-all"
                      style={{
                        background: 'rgba(34,197,94,0.1)', color: '#22c55e',
                        border: '1px solid rgba(34,197,94,0.2)',
                      }}>
                      <CheckCircle size={12} /> Bezahlt
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && invoices.length === 0 && (
          <p className="text-center py-12 text-sm" style={{ color: '#64748b' }}>Keine Rechnungen vorhanden</p>
        )}
      </div>
    </div>
  );
}
