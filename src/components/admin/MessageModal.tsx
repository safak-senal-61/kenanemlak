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
  const [isHtml, setIsHtml] = useState(false)
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
        ? { emails, subject, message, isHtml }
        : { email: subscriberEmail, subject, message, isHtml }

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
                      className="w-full px-4 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Mesaj konusu..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mesaj</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={`w-full px-4 py-2 text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 min-h-[200px] resize-y ${isHtml ? 'font-mono text-sm bg-gray-50' : 'bg-white'}`}
                      placeholder={isHtml ? '<html>\n  <body>\n    <h1>Merhaba</h1>\n    <p>İçeriğinizi buraya yazın...</p>\n  </body>\n</html>' : "Mesajınızı buraya yazın..."}
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2 mb-6">
                    <input
                      type="checkbox"
                      id="isHtml"
                      checked={isHtml}
                      onChange={(e) => setIsHtml(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500 cursor-pointer"
                    />
                    <label htmlFor="isHtml" className="text-sm text-gray-700 cursor-pointer select-none">
                      HTML Formatında Gönder (Manuel Editör)
                    </label>
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
