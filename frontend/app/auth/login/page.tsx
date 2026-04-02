'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Mail, Lock, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@bellaqa.de');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('bellaqa_token', res.data.access_token);
      localStorage.setItem('bellaqa_user', JSON.stringify(res.data.user));
      localStorage.setItem('bellaqa_lang', res.data.user.language || 'de');
      router.push('/dashboard');
    } catch {
      setError('Ungültige Anmeldedaten / Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'radial-gradient(ellipse at center, #0d1220 0%, #0a0e1a 100%)',
    }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{
            background: 'linear-gradient(135deg, #4f6ef7, #a78bfa)',
            boxShadow: '0 0 40px rgba(79,110,247,0.4)',
          }}>
            <Building2 size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#f1f5f9' }}>BELLAQA GmbH</h1>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>Distribution Portal</p>
        </div>

        {/* Form */}
        <div className="rounded-2xl p-8" style={{
          background: '#0f1524',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
        }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#64748b' }}>
                E-Mail
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#64748b' }} />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: '#161d30', border: '1px solid rgba(255,255,255,0.08)',
                    color: '#f1f5f9',
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#64748b' }}>
                Passwort
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#64748b' }} />
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: '#161d30', border: '1px solid rgba(255,255,255,0.08)',
                    color: '#f1f5f9',
                  }}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-center py-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                {error}
              </p>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
              style={{
                background: loading ? 'rgba(79,110,247,0.5)' : 'linear-gradient(135deg, #4f6ef7, #3b5af5)',
                color: 'white',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(79,110,247,0.35)',
              }}>
              {loading ? <Loader2 size={15} className="animate-spin" /> : null}
              {loading ? 'Anmelden...' : 'Anmelden'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-xs" style={{ color: '#64748b' }}>
          Standard: admin@bellaqa.de | Passwort: Admin@2024
        </p>
      </div>
    </div>
  );
}
