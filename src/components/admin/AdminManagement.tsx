'use client';

import { useState, useEffect } from 'react';
import { Trash2, UserPlus, Mail, Shield, X } from 'lucide-react';

interface Admin {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  expiresAt: string;
  createdAt: string;
}

export default function AdminManagement() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('editor'); // Default to editor (restricted)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      
      const [adminsRes, invitesRes] = await Promise.all([
        fetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/admin/invitations', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (adminsRes.ok) setAdmins(await adminsRes.json());
      if (invitesRes.ok) setInvitations(await invitesRes.json());

    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole })
      });

      const data = await res.json();

      if (res.ok) {
        setFeedback({ type: 'success', message: 'Davet gönderildi.' });
        setInviteEmail('');
        setIsInviteModalOpen(false);
        fetchData();
      } else {
        setFeedback({ type: 'error', message: data.error || 'Davet gönderilemedi.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Bir hata oluştu.' });
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    if (!confirm('Bu yöneticiyi silmek istediğinize emin misiniz?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch {
      alert('Silme işlemi başarısız.');
    }
  };

  const handleDeleteInvitation = async (id: string) => {
    if (!confirm('Bu daveti iptal etmek istediğinize emin misiniz?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/invitations?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-white/40">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Yönetici Ekibi</h2>
          <p className="text-white/40 text-sm mt-1">Admin ve editörleri yönetin.</p>
        </div>
        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="bg-primary-gold text-white px-6 py-2.5 rounded-xl hover:bg-primary-gold-dark transition-all shadow-lg shadow-primary-gold/20 flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          <span>Yeni Davet</span>
        </button>
      </div>

      {feedback && (
        <div className={`p-4 rounded-xl border ${
          feedback.type === 'success' 
            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {feedback.message}
        </div>
      )}

      {/* Admins List */}
      <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h3 className="font-semibold text-white">Aktif Yöneticiler</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/60">
            <thead className="bg-white/5 text-white/40 uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Kullanıcı</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4">Durum</th>
                <th className="px-6 py-4">Kayıt Tarihi</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center text-xs font-bold text-white">
                        {admin.name?.[0]?.toUpperCase() || admin.email[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-white">{admin.name}</div>
                        <div className="text-xs text-white/40">{admin.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      admin.role === 'admin' 
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {admin.role === 'admin' ? 'Süper Admin' : 'Editör'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      Aktif
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(admin.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteAdmin(admin.id)}
                      className="text-white/40 hover:text-red-400 transition-colors p-2"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invitations List */}
      {invitations.length > 0 && (
        <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h3 className="font-semibold text-white">Bekleyen Davetler</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/60">
              <thead className="bg-white/5 text-white/40 uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">E-posta</th>
                  <th className="px-6 py-4">Rol</th>
                  <th className="px-6 py-4">Geçerlilik</th>
                  <th className="px-6 py-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {invitations.map((invite) => (
                  <tr key={invite.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white">{invite.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        invite.role === 'admin' 
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {invite.role === 'admin' ? 'Süper Admin' : 'Editör'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(invite.expiresAt).toLocaleString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteInvitation(invite.id)}
                        className="text-white/40 hover:text-red-400 transition-colors p-2"
                        title="İptal Et"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Yeni Yönetici Davet Et</h3>
              <button 
                onClick={() => setIsInviteModalOpen(false)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1">E-posta Adresi</label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-primary-gold/50"
                    placeholder="ornek@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-1">Rol</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${
                    inviteRole === 'editor' 
                      ? 'bg-primary-gold/10 border-primary-gold text-primary-gold' 
                      : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                  }`}>
                    <input 
                      type="radio" 
                      name="role" 
                      value="editor" 
                      checked={inviteRole === 'editor'} 
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="hidden" 
                    />
                    <Shield className="w-6 h-6" />
                    <span className="font-medium">Editör</span>
                    <span className="text-xs text-center opacity-70">Sadece ilan paylaşabilir</span>
                  </label>

                  <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${
                    inviteRole === 'admin' 
                      ? 'bg-primary-gold/10 border-primary-gold text-primary-gold' 
                      : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                  }`}>
                    <input 
                      type="radio" 
                      name="role" 
                      value="admin" 
                      checked={inviteRole === 'admin'} 
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="hidden" 
                    />
                    <Shield className="w-6 h-6" />
                    <span className="font-medium">Admin</span>
                    <span className="text-xs text-center opacity-70">Tam yetkili erişim</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary-gold text-white font-bold py-3 rounded-xl hover:bg-primary-gold-dark transition-colors mt-2"
              >
                Davet Gönder
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
