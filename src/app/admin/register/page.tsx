'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Lock, Eye, EyeOff, ShieldCheck, Mail, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

function RegisterForm() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [adminSecret, setAdminSecret] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isValid, setIsValid] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      // Token yoksa, Admin Secret ile kayıt moduna geç
      setValidating(false)
      setIsValid(true) // Formu göster
      return
    }

    // Validate invitation token
    const validateToken = async () => {
      try {
        const response = await fetch(`/api/admin/invite?token=${token}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Geçersiz davet')
        }

        setEmail(data.invitation.email)
        setIsValid(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Davet doğrulanamadı')
        setIsValid(false)
      } finally {
        setValidating(false)
      }
    }

    validateToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor')
      return
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalı')
      return
    }

    if (!token && !adminSecret) {
      setError('Admin Secret anahtarı gereklidir')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token || undefined,
          adminSecret: !token ? adminSecret : undefined,
          email: !token ? email : undefined,
          name,
          password
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Kayıt başarısız')
      }

      setSuccess('Admin hesabınız başarıyla oluşturuldu! Giriş sayfasına yönlendiriliyorsunuz...')
      
      setTimeout(() => {
        router.push('/admin/login')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  if (validating) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-primary-gold border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-white/60">Davet doğrulanıyor...</p>
      </div>
    )
  }

  if (!isValid && token) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl mx-auto mb-6 flex items-center justify-center border border-red-500/20">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Geçersiz Davet</h2>
        <p className="text-white/60 mb-8">{error || 'Bu davet bağlantısı geçersiz veya süresi dolmuş.'}</p>
        <Link
          href="/admin/login"
          className="inline-flex items-center justify-center px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all duration-300 group"
        >
          <span>Giriş Sayfasına Dön</span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-16 h-16 bg-gradient-to-br from-primary-gold to-primary-gold-dark rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-primary-gold/20"
        >
          <ShieldCheck className="w-8 h-8 text-white" />
        </motion.div>
        <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Admin Kaydı</h1>
        <p className="text-white/40 text-sm">Kenan Kadıoğlu Gayrimenkul</p>
      </div>

      {/* Success Message */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          {success}
        </motion.div>
      )}

      {/* Error Message */}
      {error && !success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
        >
          {error}
        </motion.div>
      )}

      {!success && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {token ? (
              <div className="md:col-span-2 p-4 rounded-xl bg-primary-gold/5 border border-primary-gold/10">
                <div className="flex items-center gap-3 text-primary-gold/80">
                  <Mail className="w-5 h-5" />
                  <span className="text-sm font-medium">{email}</span>
                </div>
                <p className="text-xs text-white/30 mt-2 ml-8">
                  Bu e-posta adresi için hesap oluşturuluyor
                </p>
              </div>
            ) : (
              <>
                <div className="group">
                  <label className="block text-xs font-medium text-white/40 mb-1.5 ml-1">Admin Secret Key</label>
                  <div className="relative transition-all duration-300 focus-within:scale-[1.02]">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-white/30 group-focus-within:text-primary-gold transition-colors" />
                    </div>
                    <input
                      type="password"
                      value={adminSecret}
                      onChange={(e) => setAdminSecret(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-primary-gold/50 focus:ring-1 focus:ring-primary-gold/50 transition-all"
                      placeholder="Admin Secret Key"
                      required
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-xs font-medium text-white/40 mb-1.5 ml-1">E-posta Adresi</label>
                  <div className="relative transition-all duration-300 focus-within:scale-[1.02]">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-white/30 group-focus-within:text-primary-gold transition-colors" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-primary-gold/50 focus:ring-1 focus:ring-primary-gold/50 transition-all"
                      placeholder="E-posta Adresi"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div className="group md:col-span-2">
              <label className="block text-xs font-medium text-white/40 mb-1.5 ml-1">Ad Soyad</label>
              <div className="relative transition-all duration-300 focus-within:scale-[1.02]">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-white/30 group-focus-within:text-primary-gold transition-colors" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-primary-gold/50 focus:ring-1 focus:ring-primary-gold/50 transition-all"
                  placeholder="Adınız Soyadınız"
                  required
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-medium text-white/40 mb-1.5 ml-1">Şifre</label>
              <div className="relative transition-all duration-300 focus-within:scale-[1.02]">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/30 group-focus-within:text-primary-gold transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-primary-gold/50 focus:ring-1 focus:ring-primary-gold/50 transition-all"
                  placeholder="En az 6 karakter"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-white/30 hover:text-white/60 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-white/30 hover:text-white/60 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-medium text-white/40 mb-1.5 ml-1">Şifre Tekrar</label>
              <div className="relative transition-all duration-300 focus-within:scale-[1.02]">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/30 group-focus-within:text-primary-gold transition-colors" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-11 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-primary-gold/50 focus:ring-1 focus:ring-primary-gold/50 transition-all"
                  placeholder="Şifrenizi tekrar girin"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-white/30 hover:text-white/60 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-white/30 hover:text-white/60 transition-colors" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-gold to-primary-gold-dark text-white py-4 rounded-xl font-semibold shadow-lg shadow-primary-gold/20 hover:shadow-primary-gold/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Kayıt Ol</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>

          <div className="text-center">
            <p className="text-white/40 text-sm">
              Zaten hesabınız var mı?{' '}
              <Link href="/admin/login" className="text-primary-gold hover:text-primary-gold-light transition-colors font-medium">
                Giriş Yap
              </Link>
            </p>
          </div>
        </form>
      )}
    </>
  )
}

export default function AdminRegister() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f0f0f] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-gold/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary-gold-dark/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl mx-4 relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-primary-gold border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-white/60">Yükleniyor...</p>
            </div>
          }>
            <RegisterForm />
          </Suspense>
        </div>
      </motion.div>
    </div>
  )
}