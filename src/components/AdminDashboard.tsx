'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import PropertyForm from './admin/PropertyForm';
import { 
  Plus, 
  Home, 
  Users, 
  Settings, 
  LogOut, 
  Building,
  Search,
  Bell,
  ChevronRight,
  LayoutDashboard,
  Mail,
  Trash2,
  MapPin,
  Minus,
  Upload,
  X,
  MessageSquare,
  Send
} from 'lucide-react';

// Chat Types
interface ChatSession {
  id: string;
  userName: string;
  userEmail: string;
  status: string;
  messages: {
    id: string;
    content: string;
    sender: string;
    createdAt: string;
  }[];
  updatedAt: string;
}

// Chat Component for Admin
const MessagesPanel = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/chats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedSession) {
      // Update selected session with new data if available
      const updated = sessions.find(s => s.id === selectedSession.id);
      if (updated) setSelectedSession(updated);
      
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [sessions, selectedSession?.id]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !selectedSession) return;

    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/admin/chats/reply', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sessionId: selectedSession.id,
          message: reply
        })
      });

      if (res.ok) {
        setReply('');
        fetchSessions(); // Refresh immediately
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-100px)] bg-[#141414] rounded-2xl border border-white/5 overflow-hidden">
      {/* Sessions List */}
      <div className="w-1/3 border-r border-white/5 flex flex-col">
        <div className="p-4 border-b border-white/5">
          <h2 className="text-lg font-bold text-white">Canlı Destek Talepleri</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="p-8 text-center text-white/30">
              Bekleyen mesaj yok.
            </div>
          ) : (
            sessions.map(session => (
              <div
                key={session.id}
                onClick={() => setSelectedSession(session)}
                className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${
                  selectedSession?.id === session.id ? 'bg-white/5 border-l-2 border-l-primary-gold' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-white">{session.userName}</h3>
                  <span className="text-xs text-white/40">
                    {new Date(session.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-white/60 truncate">
                  {session.messages[session.messages.length - 1]?.content || 'Mesaj yok'}
                </p>
                <div className="mt-2 flex gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    session.status === 'live_waiting' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                  }`}>
                    {session.status === 'live_waiting' ? 'Bekliyor' : 'Aktif'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-[#0a0a0a]">
        {selectedSession ? (
          <>
            <div className="p-4 border-b border-white/5 bg-[#141414] flex justify-between items-center">
              <div>
                <h3 className="font-bold text-white">{selectedSession.userName}</h3>
                <p className="text-xs text-white/40">{selectedSession.userEmail}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedSession.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                      msg.sender === 'admin'
                        ? 'bg-primary-gold text-black rounded-tr-none'
                        : msg.sender === 'bot'
                        ? 'bg-white/5 text-white/70 border border-white/10'
                        : 'bg-white/10 text-white rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/5 bg-[#141414]">
              <form onSubmit={handleSendReply} className="flex gap-2">
                <input
                  type="text"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Cevap yazın..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-primary-gold/50"
                />
                <button
                  type="submit"
                  disabled={!reply.trim()}
                  className="bg-primary-gold hover:bg-primary-gold-dark text-black p-2 rounded-xl transition-colors"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-white/30">
            <MessageSquare size={48} className="mb-4 opacity-20" />
            <p>Görüntülemek için bir sohbet seçin</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('properties');
  const [admin, setAdmin] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setAdmin({ email: payload.email });
    } catch (error) {
      console.error('Token decode error:', error);
      router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const menuItems = [
    { id: 'properties', label: 'Emlaklar', icon: Building, description: 'İlanları Yönet' },
    { id: 'add-property', label: 'Emlak Ekle', icon: Plus, description: 'Yeni İlan Oluştur' },
    { id: 'messages', label: 'Mesajlar', icon: MessageSquare, description: 'Canlı Destek' },
    { id: 'admins', label: 'Adminler', icon: Users, description: 'Ekip Yönetimi' },
    { id: 'settings', label: 'Ayarlar', icon: Settings, description: 'Sistem Ayarları' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'properties':
        return <PropertiesList />;
      case 'add-property':
        return <PropertyForm 
          onCancel={() => setActiveTab('properties')} 
          onSuccess={() => setActiveTab('properties')} 
        />;
      case 'messages':
        return <MessagesPanel />;
      case 'admins':
        return <AdminList />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <PropertiesList />;
    }
  };

  if (!admin) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-12 h-12 border-4 border-primary-gold border-t-transparent rounded-full"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex font-sans selection:bg-primary-gold selection:text-black">
      {/* Sidebar */}
      <motion.div 
        initial={{ width: 280 }}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-[#141414] border-r border-white/5 flex flex-col h-screen sticky top-0 z-50 transition-all duration-300"
      >
        {/* Logo Area */}
        <div className="p-6 border-b border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-gold to-primary-gold-dark rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary-gold/10">
            <Home className="w-5 h-5 text-white" />
          </div>
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <h2 className="font-bold text-lg tracking-tight">Kenan Kadıoğlu</h2>
              <p className="text-xs text-white/40">Admin Paneli</p>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200 group relative overflow-hidden ${
                  isActive
                    ? 'bg-white/5 text-white shadow-inner'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-primary-gold/10 to-transparent border-l-2 border-primary-gold"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 relative z-10 transition-colors ${isActive ? 'text-primary-gold' : 'group-hover:text-white'}`} />
                {isSidebarOpen && (
                  <span className="font-medium relative z-10">{item.label}</span>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-red-400 hover:bg-red-500/10 transition-colors ${!isSidebarOpen && 'justify-center'}`}
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span>Çıkış Yap</span>}
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-[#141414]/50 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-white/80">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h1>
            <span className="text-white/20">/</span>
            <span className="text-sm text-white/40">
              {menuItems.find(i => i.id === activeTab)?.description}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="w-5 h-5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Ara..." 
                className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-primary-gold/50 w-64 transition-all focus:w-80"
              />
            </div>
            <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors">
              <Bell className="w-5 h-5 text-white/60" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-gold rounded-full"></span>
            </button>
            <div className="h-8 w-px bg-white/10"></div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center text-xs font-bold">
                {admin.email[0].toUpperCase()}
              </div>
              <span className="text-sm font-medium text-white/80 hidden sm:block">{admin.email}</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function PropertiesList() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/properties');
      if (res.ok) {
        const data = await res.json();
        setProperties(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ilanı silmek istediğinize emin misiniz?')) return;
    
    try {
      const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProperties();
      } else {
        const data = await res.json();
        alert(`Silme işlemi başarısız oldu: ${data.error || 'Bilinmeyen hata'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Bir hata oluştu.');
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  if (showAddForm) {
    return <PropertyForm onCancel={() => setShowAddForm(false)} onSuccess={() => { setShowAddForm(false); fetchProperties(); }} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Emlak Listesi</h2>
          <p className="text-white/40 text-sm mt-1">Sistemdeki tüm emlakları buradan yönetebilirsiniz.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-primary-gold text-white px-6 py-2.5 rounded-xl hover:bg-primary-gold-dark transition-all shadow-lg shadow-primary-gold/20 flex items-center gap-2 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          <span>Yeni Emlak</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Toplam Emlak', value: properties.length.toString(), icon: Building },
          { label: 'Aktif İlanlar', value: properties.filter(p => p.isActive).length.toString(), icon: LayoutDashboard },
          { label: 'Öne Çıkanlar', value: properties.filter(p => p.featured).length.toString(), icon: Plus },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#1A1A1A] border border-white/5 p-6 rounded-2xl hover:border-primary-gold/30 transition-colors group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/40 text-sm mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary-gold/20 transition-colors">
                <stat.icon className="w-5 h-5 text-white/60 group-hover:text-primary-gold transition-colors" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-primary-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/40">Yükleniyor...</p>
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building className="w-10 h-10 text-white/20" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Henüz İlan Yok</h3>
          <p className="text-white/40 max-w-md mx-auto mb-8">
            Sistemde henüz kayıtlı bir emlak ilanı bulunmuyor. Yeni bir ilan ekleyerek başlayabilirsiniz.
          </p>
          <button 
            onClick={() => setShowAddForm(true)}
            className="text-primary-gold hover:text-white transition-colors font-medium flex items-center justify-center gap-2 mx-auto"
          >
            <span>İlk İlanı Ekle</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-[#1A1A1A] border border-white/5 rounded-2xl overflow-hidden group hover:border-primary-gold/30 transition-all"
            >
              <div className="relative h-48 bg-white/5">
                {property.photos?.[0]?.url ? (
                  <img src={property.photos[0].url} alt={property.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building className="w-12 h-12 text-white/10" />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white font-medium">
                  {property.type}
                </div>
                {property.featured && (
                  <div className="absolute top-4 left-4 bg-primary-gold px-3 py-1 rounded-full text-xs text-white font-medium">
                    Öne Çıkan
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{property.title}</h3>
                    <div className="flex items-center gap-2 text-white/40 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">{property.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-primary-gold font-bold text-lg">{property.price}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-white/40 text-sm">{property.category}</span>
                    <button 
                      onClick={() => handleDelete(property.id)}
                      className="p-2 hover:bg-red-500/10 text-white/40 hover:text-red-400 rounded-lg transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminList() {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [admins, setAdmins] = useState<any[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/list', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAdmins(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAdmins(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: inviteEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Davet gönderilemedi');
      }

      setSuccess('Davet başarıyla gönderildi');
      setInviteEmail('');
      fetchAdmins();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setInviteLoading(false);
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    if (!confirm('Bu yöneticiyi silmek istediğinize emin misiniz?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/list?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        fetchAdmins();
      } else {
        const data = await res.json();
        alert(data.error || 'Silme işlemi başarısız');
      }
    } catch (err) {
      console.error(err);
      alert('Bir hata oluştu');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Admin Yönetimi</h2>
          <p className="text-white/40 text-sm mt-1">Yönetici hesaplarını ve davetleri buradan yönetin.</p>
        </div>
      </div>

      <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-8">
        <div className="max-w-2xl">
          <h3 className="text-lg font-semibold text-white mb-2">Yeni Admin Davet Et</h3>
          <p className="text-white/40 text-sm mb-6">
            Yeni bir yönetici eklemek için e-posta adresini girin. Kişiye özel bir kayıt bağlantısı gönderilecektir.
          </p>
          
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary-gold transition-colors" />
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:border-primary-gold/50 focus:bg-white/[0.07] transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={inviteLoading}
                className="bg-primary-gold text-white px-8 py-3.5 rounded-xl hover:bg-primary-gold-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-lg shadow-primary-gold/20"
              >
                {inviteLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Users className="w-5 h-5" />
                    <span>Davet Gönder</span>
                  </>
                )}
              </button>
            </div>
            
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {error}
                </motion.div>
              )}
              
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {success}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>

      <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h3 className="font-semibold text-white">Mevcut Adminler</h3>
        </div>
        {loadingAdmins ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-primary-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/30">Admin listesi yükleniyor...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-white/40">Admin</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-white/40">Rol</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-white/40">Durum</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-white/40">Kayıt Tarihi</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-white/40">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/60">
                          {admin.email[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-white">{admin.name || 'İsimsiz'}</div>
                          <div className="text-sm text-white/40">{admin.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 rounded-lg bg-primary-gold/10 text-primary-gold text-xs font-medium uppercase">
                        {admin.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        admin.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {admin.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-white/40">
                      {new Date(admin.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDeleteAdmin(admin.id)}
                        className="p-2 hover:bg-red-500/10 text-white/40 hover:text-red-400 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {admins.length === 0 && (
              <div className="p-12 text-center text-white/30">
                Henüz başka admin bulunmuyor.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsPanel() {
  const [settings, setSettings] = useState<{ maintenanceMode: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const toggleMaintenance = async () => {
    if (!settings) return;
    
    const newState = !settings.maintenanceMode;
    setSettings({ ...settings, maintenanceMode: newState }); // Optimistic update
    
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maintenanceMode: newState })
      });
      
      if (!res.ok) {
        setSettings({ ...settings, maintenanceMode: !newState }); // Revert
      }
    } catch (err) {
      setSettings({ ...settings, maintenanceMode: !newState }); // Revert
    }
  };

  if (loading) {
    return (
      <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-8">
        <div className="border-b border-white/5 pb-6 mb-8">
          <h2 className="text-2xl font-bold text-white">Ayarlar</h2>
          <p className="text-white/40 mt-1">Sistem genel ayarlarını buradan yapılandırabilirsiniz.</p>
        </div>
        <div className="text-white/40">Ayarlar yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-8">
      <div className="border-b border-white/5 pb-6 mb-8">
        <h2 className="text-2xl font-bold text-white">Ayarlar</h2>
        <p className="text-white/40 mt-1">Sistem genel ayarlarını buradan yapılandırabilirsiniz.</p>
      </div>
      
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
          <div>
            <h4 className="font-medium text-white">Site Bakım Modu</h4>
            <p className="text-sm text-white/40">Siteyi ziyaretçilere kapatın ve bakım mesajı gösterin</p>
          </div>
          <button 
            onClick={toggleMaintenance}
            className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ${settings?.maintenanceMode ? 'bg-primary-gold' : 'bg-white/10 hover:bg-white/20'}`}
          >
            <motion.div 
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`w-4 h-4 rounded-full absolute top-1 shadow-sm ${settings?.maintenanceMode ? 'bg-white right-1' : 'bg-white/40 left-1'}`} 
            />
          </button>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
          <div>
            <h4 className="font-medium text-white">E-posta Bildirimleri</h4>
            <p className="text-sm text-white/40">Yeni ilan eklendiğinde bildirim al</p>
          </div>
          <div className="w-12 h-6 bg-primary-gold rounded-full relative cursor-pointer">
            <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
