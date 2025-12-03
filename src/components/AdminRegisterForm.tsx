'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Lock, Eye, EyeOff, Shield, Mail, CheckCircle } from 'lucide-react'

export function AdminRegisterForm() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isValid, setIsValid] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setError('Geçersiz davet bağlantısı')
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

    setLoading(true)

    try {
      const response = await fetch('/api/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
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

  if (!isValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-charcoal via-charcoal-light to-primary-gold-dark flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 text-center max-w-md border border-red-200"
        >
          <div className="text-red-500 mb-4">
            <Shield className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-charcoal mb-4">Geçersiz Davet</h2>
          <p className="text-charcoal/70 mb-6">{error || 'Bu davet bağlantısı geçersiz veya süresi dolmuş.'}</p>
          <button
            onClick={() => router.push('/admin/login')}
            className="bg-gradient-to-r from-primary-gold to-primary-gold-dark text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-gold-dark hover:to-primary-gold transition-all duration-300"
          >
            Giriş Sayfasına Dön
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-charcoal-light to-primary-gold-dark flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-md border border-primary-gold/20"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            className="bg-gradient-to-br from-primary-gold to-primary-gold-dark p-4 rounded-2xl w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Shield className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-charcoal to-charcoal-light bg-clip-text text-transparent mb-2">
            Admin Kaydı
          </h1>
          <p className="text-charcoal/70">Kenan Kadıoğlu Emlak</p>
          <div className="mt-4 p-3 bg-primary-gold-light rounded-xl">
            <div className="flex items-center justify-center space-x-2">
              <Mail className="w-4 h-4 text-primary-gold" />
              <span className="text-sm text-charcoal font-medium">{email}</span>
            </div>
          </div>
        </motion.div>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          </motion.div>
        )}

        {/* Form */}
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-2">
                Adınız Soyadınız
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-primary-gold" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-4 border border-primary-gold/30 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-primary-gold focus:border-transparent transition-all duration-300 placeholder-charcoal/50"
                  placeholder="Adınız ve soyadınız"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-charcoal mb-2">
                Şifre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-primary-gold" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-4 border border-primary-gold/30 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-primary-gold focus:border-transparent transition-all duration-300 placeholder-charcoal/50"
                  placeholder="En az 6 karakter"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-charcoal/50 hover:text-charcoal transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-charcoal/50 hover:text-charcoal transition-colors" />
                  )}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-charcoal mb-2">
                Şifre Tekrar
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-primary-gold" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-4 border border-primary-gold/30 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-primary-gold focus:border-transparent transition-all duration-300 placeholder-charcoal/50"
                  placeholder="Şifrenizi tekrar girin"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-charcoal/50 hover:text-charcoal transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-charcoal/50 hover:text-charcoal transition-colors" />
                  )}
                </button>
              </div>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4"
              >
                <p className="text-red-600 text-sm">{error}</p>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className="group w-full bg-gradient-to-r from-primary-gold to-primary-gold-dark hover:from-primary-gold-dark hover:to-primary-gold text-white py-4 px-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Kayıt Olunuyor...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>Admin Hesabı Oluştur</span>
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-xl"></div>
            </motion.button>
          </form>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-charcoal/60">
            Zaten hesabınız var mı?{' '}
            <button
              onClick={() => router.push('/admin/login')}
              className="text-primary-gold hover:text-primary-gold-dark font-medium transition-colors"
            >
              Giriş Yapın
            </button>
          </p>
        </motion.div>
      </motion.div>

      {/* Background Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-primary-gold/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-primary-gold-dark/20 rounded-full blur-xl"></div>
    </div>
  )
}