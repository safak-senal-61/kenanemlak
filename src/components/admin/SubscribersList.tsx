'use client'

import { useState, useEffect } from 'react'
import { Search, Mail, Trash2, Phone, Calendar, Loader2, Users, TrendingUp, CheckSquare, Square, Send } from 'lucide-react'
import MessageModal from './MessageModal'

interface Subscriber {
  id: string
  email: string
  name: string
  phone: string | null
  createdAt: string
}

interface SubscriberStats {
  total: number
  newThisMonth: number
}

export default function SubscribersList() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [stats, setStats] = useState<SubscriberStats>({ total: 0, newThisMonth: 0 })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null)
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'single' | 'bulk'>('single')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  
  // Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  useEffect(() => {
    fetchSubscribers()
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch('/api/admin/subscribers/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const fetchSubscribers = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch('/api/admin/subscribers', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setSubscribers(data)
      }
    } catch (error) {
      console.error('Failed to fetch subscribers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu aboneyi silmek istediğinizden emin misiniz?')) return

    setDeletingId(id)
    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch(`/api/admin/subscribers?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (res.ok) {
        setSubscribers(subscribers.filter(s => s.id !== id))
        setSelectedIds(selectedIds.filter(sid => sid !== id))
        fetchStats() // Refresh stats
      } else {
        alert('Abone silinemedi')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Bir hata oluştu')
    } finally {
      setDeletingId(null)
    }
  }

  const handleSendMessage = (subscriber: Subscriber) => {
    setSelectedSubscriber(subscriber)
    setModalMode('single')
    setIsMessageModalOpen(true)
  }

  const handleBulkSend = () => {
    if (selectedIds.length === 0) return
    setSelectedSubscriber(null)
    setModalMode('bulk')
    setIsMessageModalOpen(true)
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredSubscribers.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredSubscribers.map(s => s.id))
    }
  }

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (subscriber.phone && subscriber.phone.includes(searchTerm))
  )

  const isAllSelected = filteredSubscribers.length > 0 && selectedIds.length === filteredSubscribers.length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Aboneler</h2>
          <p className="text-white/60">Bülten abonelerinizi yönetin ve iletişim kurun</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-white/40 text-sm font-medium">Toplam Abone</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-green-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-white/40 text-sm font-medium">Bu Ay Eklenen</p>
            <p className="text-2xl font-bold text-white">+{stats.newThisMonth}</p>
          </div>
        </div>

        {/* Placeholder for Email Status or other stat */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <p className="text-white/40 text-sm font-medium">İletişim Durumu</p>
            <p className="text-white text-sm">Sistem Aktif</p>
          </div>
        </div>
      </div>

      {/* Action Bar & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
          <input
            type="text"
            placeholder="İsim, e-posta veya telefon ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
          />
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-4 bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-xl w-full md:w-auto animate-in fade-in slide-in-from-top-2">
            <span className="text-yellow-500 font-medium whitespace-nowrap">
              {selectedIds.length} abone seçildi
            </span>
            <div className="h-4 w-px bg-yellow-500/20" />
            <button
              onClick={handleBulkSend}
              className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors text-sm font-medium"
            >
              <Send className="w-4 h-4" />
              Toplu Mesaj Gönder
            </button>
          </div>
        )}
      </div>

      {/* List */}
      <div className="bg-[#141414] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 w-10">
                  <div className="flex items-center">
                    <button
                      onClick={toggleSelectAll}
                      className="text-white/40 hover:text-white transition-colors"
                    >
                      {isAllSelected ? (
                        <CheckSquare className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-white/60 uppercase tracking-wider">Abone Bilgileri</th>
                <th className="px-6 py-4 text-xs font-semibold text-white/60 uppercase tracking-wider">İletişim</th>
                <th className="px-6 py-4 text-xs font-semibold text-white/60 uppercase tracking-wider">Kayıt Tarihi</th>
                <th className="px-6 py-4 text-xs font-semibold text-white/60 uppercase tracking-wider text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/40">
                    Kayıtlı abone bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((subscriber) => {
                  const isSelected = selectedIds.includes(subscriber.id)
                  return (
                    <tr 
                      key={subscriber.id} 
                      className={`
                        transition-colors
                        ${isSelected ? 'bg-yellow-500/[0.03]' : 'hover:bg-white/[0.02]'}
                      `}
                    >
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleSelect(subscriber.id)}
                          className="text-white/40 hover:text-white transition-colors"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-yellow-500" />
                          ) : (
                            <Square className="w-5 h-5" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-yellow-500/10 rounded-full flex items-center justify-center text-yellow-500 font-bold mr-3 border border-yellow-500/20">
                            {subscriber.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-white">{subscriber.name}</div>
                            <div className="text-sm text-white/40 font-mono">ID: {subscriber.id.slice(0, 8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-white/60">
                            <Mail className="w-4 h-4 mr-2 text-white/40" />
                            {subscriber.email}
                          </div>
                          {subscriber.phone && (
                            <div className="flex items-center text-sm text-white/60">
                              <Phone className="w-4 h-4 mr-2 text-white/40" />
                              {subscriber.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-white/60">
                          <Calendar className="w-4 h-4 mr-2 text-white/40" />
                          {new Date(subscriber.createdAt).toLocaleDateString('tr-TR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleSendMessage(subscriber)}
                            className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="Mesaj Gönder"
                          >
                            <Mail className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(subscriber.id)}
                            disabled={deletingId === subscriber.id}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                            title="Abonelikten Çıkar"
                          >
                            {deletingId === subscriber.id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        subscriberEmail={selectedSubscriber?.email}
        subscriberName={selectedSubscriber?.name}
        emails={modalMode === 'bulk' ? subscribers.filter(s => selectedIds.includes(s.id)).map(s => s.email) : undefined}
      />
    </div>
  )
}
