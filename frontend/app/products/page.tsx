'use client';
import { useEffect, useState } from 'react';
import { Package, Euro, Tag } from 'lucide-react';
import { t, useLanguage, Lang } from '@/lib/i18n';
import api from '@/lib/api';

export default function ProductsPage() {
  const lang = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [channel, setChannel] = useState<'b2b' | 'b2c'>('b2b');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setChannel((localStorage.getItem('bellaqa_channel') as any) || 'b2b');
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    api.get(`/products?channel=${channel}&lang=${lang}`)
      .then(r => { setProducts(r.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [channel, lang]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#f1f5f9' }}>
            {t('products', lang)}
          </h1>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>
            {channel === 'b2b'
              ? 'Netto-Preise zzgl. MwSt. (B2B-Ansicht)'
              : 'Brutto-Preise inkl. MwSt. & Pfand (B2C-Ansicht)'}
          </p>
        </div>
        <div className="flex gap-2">
          {(['b2b', 'b2c'] as const).map(ch => (
            <button key={ch} onClick={() => setChannel(ch)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all uppercase tracking-wide"
              style={{
                background: channel === ch ? 'rgba(79,110,247,0.15)' : 'rgba(255,255,255,0.04)',
                border: channel === ch ? '1px solid rgba(79,110,247,0.3)' : '1px solid rgba(255,255,255,0.08)',
                color: channel === ch ? '#4f6ef7' : '#64748b',
              }}>
              {ch}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          [1,2,3,4,5,6].map(i => (
            <div key={i} className="h-44 rounded-2xl animate-pulse" style={{ background: '#0f1524' }} />
          ))
        ) : products.map((p: any) => (
          <div key={p.id} className="rounded-2xl p-5 transition-all hover:scale-[1.01]" style={{
            background: '#0f1524',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
          }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-sm" style={{ color: '#f1f5f9' }}>{p.name}</p>
                <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>{p.sku}</p>
              </div>
              <span className="px-2 py-0.5 rounded-lg text-xs font-medium capitalize" style={{
                background: p.category === 'food'
                  ? 'rgba(34,197,94,0.1)' : 'rgba(6,182,212,0.1)',
                color: p.category === 'food' ? '#22c55e' : '#06b6d4',
                border: `1px solid ${p.category === 'food' ? 'rgba(34,197,94,0.2)' : 'rgba(6,182,212,0.2)'}`,
              }}>
                {p.category}
              </span>
            </div>

            <div className="space-y-2">
              {channel === 'b2b' ? (
                <>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#94a3b8' }}>Netto</span>
                    <span className="font-semibold" style={{ color: '#f1f5f9' }}>
                      €{parseFloat(p.unitNetPrice || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: '#64748b' }}>MwSt. ({Math.round(p.vatRate * 100)}%)</span>
                    <span style={{ color: '#f59e0b' }}>
                      +€{parseFloat(p.vatAmount || 0).toFixed(2)}
                    </span>
                  </div>
                  {p.pfand > 0 && (
                    <div className="flex justify-between text-xs">
                      <span style={{ color: '#64748b' }}>Pfand</span>
                      <span style={{ color: '#94a3b8' }}>+€{parseFloat(p.pfand).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t flex justify-between text-sm" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <span style={{ color: '#94a3b8' }}>Brutto gesamt</span>
                    <span className="font-bold" style={{ color: '#4f6ef7' }}>
                      €{parseFloat(p.unitGrossPrice || 0).toFixed(2)}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>
                      €{parseFloat(p.displayPrice || 0).toFixed(2)}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>{p.priceLabel}</p>
                  </div>
                  {p.pfand && (
                    <span className="text-xs px-2 py-1 rounded-lg" style={{
                      background: 'rgba(245,158,11,0.1)', color: '#f59e0b',
                    }}>
                      Pfand: €{parseFloat(p.pfand).toFixed(2)}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs" style={{ color: p.unitInStock > 0 ? '#22c55e' : '#ef4444' }}>
                {p.unitInStock > 0 ? `${p.unitInStock} auf Lager` : 'Nicht verfügbar'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
