'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Send, Loader2 } from 'lucide-react'

interface MessageModalProps {
  isOpen: boolean
  onClose: () => void
  subscriberEmail?: string
  subscriberName?: string
  emails?: string[]
}

export default function MessageModal({ isOpen, onClose, subscriberEmail, subscriberName, emails }: MessageModalProps) {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [feedback, setFeedback] = useState('')

  const isBulk = !!emails && emails.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const token = localStorage.getItem('adminToken')
      
      const endpoint = isBulk 
        ? '/api/admin/subscribers/bulk-message'
        : '/api/admin/subscribers/message'
        
      const body = isBulk
        ? { emails, subject, message }
        : { email: subscriberEmail, subject, message }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Mesaj gönderilemedi')
      }

      setStatus('success')
      setFeedback('Mesaj başarıyla gönderildi!')
      setTimeout(() => {
        onClose()
        setStatus('idle')
        setSubject('')
        setMessage('')
        setFeedback('')
      }, 2000)
    } catch (error) {
      setStatus('error')
      setFeedback(error instanceof Error ? error.message : 'Bir hata oluştu')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-lg bg-white rounded-2xl shadow-2xl z-[70] overflow-hidden"
          >
            <div className="relative p-6">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-yellow-600" />
                  {isBulk ? 'Toplu Mesaj Gönder' : 'Mesaj Gönder'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {isBulk ? (
                    <span><span className="font-medium text-gray-900">{emails?.length}</span> aboneye gönderilecek</span>
                  ) : (
                    <span>Alıcı: <span className="font-medium text-gray-900">{subscriberName}</span> ({subscriberEmail})</span>
                  )}
                </p>
              </div>

              {status === 'success' ? (
                <div className="bg-green-50 text-green-600 p-4 rounded-xl text-center font-medium">
                  {feedback}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Konu</label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Mesaj konusu..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mesaj</label>
                    <textarea
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                      placeholder="Mesajınızı yazın..."
                    />
                  </div>

                  {status === 'error' && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                      {feedback}
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Gönderiliyor...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Gönder
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
