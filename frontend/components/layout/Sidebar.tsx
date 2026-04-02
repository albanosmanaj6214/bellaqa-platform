'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingCart, FileText,
  Users, BarChart3, Settings, LogOut, ChevronRight,
  Building2, Globe
} from 'lucide-react';
import { LANGUAGES, t, Lang } from '@/lib/i18n';

const navItems = [
  { key: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
  { key: 'orders', href: '/orders', icon: ShoppingCart },
  { key: 'products', href: '/products', icon: Package },
  { key: 'invoices', href: '/invoices', icon: FileText },
  { key: 'customers', href: '/customers', icon: Users },
  { key: 'analytics', href: '/analytics', icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [lang, setLang] = useState<Lang>('de');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [channel, setChannel] = useState<'b2b' | 'b2c'>('b2b');

  useEffect(() => {
    setLang((localStorage.getItem('bellaqa_lang') as Lang) || 'de');
    setChannel((localStorage.getItem('bellaqa_channel') as any) || 'b2b');
  }, []);

  const switchLang = (l: Lang) => {
    localStorage.setItem('bellaqa_lang', l);
    setLang(l);
    setShowLangMenu(false);
    window.location.reload();
  };

  const toggleChannel = () => {
    const next = channel === 'b2b' ? 'b2c' : 'b2b';
    localStorage.setItem('bellaqa_channel', next);
    setChannel(next);
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = '/auth/login';
  };

  return (
    <aside className="w-64 flex-shrink-0 h-screen flex flex-col" style={{
      background: 'linear-gradient(180deg, #0d1220 0%, #0a0e1a 100%)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
    }}>
      {/* Logo */}
      <div className="px-6 py-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{
            background: 'linear-gradient(135deg, #4f6ef7, #a78bfa)',
            boxShadow: '0 0 20px rgba(79,110,247,0.4)',
          }}>
            <Building2 size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-white tracking-tight text-sm">BELLAQA</p>
            <p className="text-xs" style={{ color: '#64748b' }}>GmbH Distribution</p>
          </div>
        </div>
      </div>

      {/* Channel Toggle */}
      <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <button
          onClick={toggleChannel}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{
            background: channel === 'b2b'
              ? 'rgba(79,110,247,0.15)' : 'rgba(34,197,94,0.12)',
            border: channel === 'b2b'
              ? '1px solid rgba(79,110,247,0.3)' : '1px solid rgba(34,197,94,0.3)',
            color: channel === 'b2b' ? '#4f6ef7' : '#22c55e',
          }}
        >
          <span>{channel === 'b2b' ? t('b2b_portal', lang) : t('b2c_shop', lang)}</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ key, href, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={key} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium group"
              style={{
                background: active ? 'rgba(79,110,247,0.12)' : 'transparent',
                border: active ? '1px solid rgba(79,110,247,0.2)' : '1px solid transparent',
                color: active ? '#4f6ef7' : '#94a3b8',
              }}
            >
              <Icon size={16} style={{ opacity: active ? 1 : 0.7 }} />
              <span>{t(key, lang)}</span>
              {active && <ChevronRight size={12} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Language Selector */}
      <div className="px-3 py-3 border-t relative" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <button
          onClick={() => setShowLangMenu(!showLangMenu)}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all"
          style={{
            color: '#94a3b8',
            background: showLangMenu ? 'rgba(255,255,255,0.06)' : 'transparent',
          }}
        >
          <Globe size={15} />
          <span>{LANGUAGES.find(l => l.code === lang)?.flag}</span>
          <span>{LANGUAGES.find(l => l.code === lang)?.label}</span>
        </button>
        {showLangMenu && (
          <div className="absolute bottom-full left-3 right-3 mb-2 rounded-xl overflow-hidden z-50"
            style={{
              background: '#1e2740',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 -8px 32px rgba(0,0,0,0.5)',
            }}>
            {LANGUAGES.map(l => (
              <button key={l.code} onClick={() => switchLang(l.code as Lang)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors text-left"
                style={{
                  color: l.code === lang ? '#4f6ef7' : '#94a3b8',
                  background: l.code === lang ? 'rgba(79,110,247,0.1)' : 'transparent',
                }}>
                <span>{l.flag}</span>
                <span>{l.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="px-3 pb-4">
        <button onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all"
          style={{ color: '#ef4444' }}>
          <LogOut size={15} />
          <span>{t('logout', lang)}</span>
        </button>
      </div>
    </aside>
  );
}
