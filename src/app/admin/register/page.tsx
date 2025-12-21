'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, User, AlertCircle, CheckCircle } from 'lucide-react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Initialize state based on token presence to avoid effect update
  const [status, setStatus] = useState<'loading' | 'idle' | 'success' | 'error'>(() => 
    !token ? 'error' : 'loading'
  );
  const [message, setMessage] = useState(() => 
    !token ? 'Geçersiz davet bağlantısı.' : ''
  );
  
  const [invitation, setInvitation] = useState<{ email: string } | null>(null);

  useEffect(() => {
    if (!token) return;

    const verifyToken = async () => {
      try {
        const res = await fetch(`/api/admin/register?token=${token}`);
        if (res.ok) {
          const data = await res.json();
          setInvitation(data);
          setStatus('idle');
        } else {
          const data = await res.json();
          setStatus('error');
          setMessage(data.error || 'Davet bağlantısı geçersiz veya süresi dolmuş.');
        }
      } catch {
        setStatus('error');
        setMessage('Bir hata oluştu.');
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Şifreler eşleşmiyor.');
      return;
    }

    if (password.length < 6) {
      setMessage('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          name,
          password
        })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setTimeout(() => {
          router.push('/admin/login');
        }, 2000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Kayıt başarısız.');
      }
    } catch {
      setStatus('error');
      setMessage('Bir hata oluştu.');
    }
  };

  if (status === 'loading' && !invitation) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0F0F0F] text-white">
        <div className="w-8 h-8 border-2 border-primary-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === 'error' && !invitation) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4">
        <div className="bg-[#1A1A1A] border border-white/5 p-8 rounded-2xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Davet Geçersiz</h2>
          <p className="text-white/60 mb-6">{message}</p>
          <button
            onClick={() => router.push('/')}
            className="text-primary-gold hover:text-white transition-colors"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-gold/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Hesabı Oluştur</h1>
          <p className="text-white/40">
            <span className="text-white">{invitation?.email}</span> adresi için davet kabul ediliyor.
          </p>
        </div>

        <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
          {status === 'success' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Hesap Oluşturuldu!</h2>
              <p className="text-white/60">Giriş sayfasına yönlendiriliyorsunuz...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {status === 'error' && message && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  {message}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-white/60 mb-1">Ad Soyad</label>
                <div className="relative">
                  <User className="w-5 h-5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary-gold/50 transition-colors"
                    placeholder="Adınız Soyadınız"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-1">Şifre</label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary-gold/50 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-1">Şifre Tekrar</label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary-gold/50 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-primary-gold text-black font-bold py-3.5 rounded-xl hover:bg-primary-gold-dark transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? 'İşleniyor...' : 'Hesabı Oluştur'}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F0F0F]"></div>}>
      <RegisterForm />
    </Suspense>
  );
}
