'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { clearCache } from '@/utils/apiCache';
import { Property } from '../types/property';
import PropertyForm, { PropertyFormData } from './admin/PropertyForm';
import SubscribersList from './admin/SubscribersList';
import AdminManagement from './admin/AdminManagement';
import TeamManagement from './admin/TeamManagement';
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
  Trash2,
  Edit,
  MapPin,
  MessageSquare,
  Send,
  Shield,
  Menu,
  X,
  ArrowLeft
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

// Admin User Type
interface AdminUser {
  email: string;
  role: string;
}

// Chat Component for Admin
const MessagesPanel = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const selectedSession = sessions.find(s => s.id === selectedSessionId) || null;

  const fetchSessions = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSessions();
    }, 0);
    const interval = setInterval(fetchSessions, 10000); // Poll every 10s
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [fetchSessions]);

  useEffect(() => {
    if (selectedSessionId) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [selectedSessionId, selectedSession?.messages.length]);

  const updateTypingStatus = async (status: boolean) => {
    if (!selectedSessionId) return;
    try {
        await fetch('/api/chat/typing', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId: selectedSessionId, isTyping: status })
        });
    } catch (e) {
        console.error(e);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !selectedSessionId) return;

    // Stop typing indicator
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    updateTypingStatus(false);

    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/admin/chats/reply', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sessionId: selectedSessionId,
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
    <div className="flex flex-col md:flex-row h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] bg-[#141414] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
      {/* Sessions List */}
      <div className={`w-full md:w-1/3 border-r border-white/5 flex flex-col ${selectedSessionId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-white/5 bg-[#141414]">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary-gold" />
            Canlı Destek
          </h2>
          <p className="text-xs text-white/40 mt-1">Aktif görüşmeleri buradan yönetin</p>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-white/30 space-y-4">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                <MessageSquare className="w-8 h-8 opacity-50" />
              </div>
              <p>Bekleyen mesaj yok.</p>
            </div>
          ) : (
            sessions.map(session => (
              <div
                key={session.id}
                onClick={() => setSelectedSessionId(session.id)}
                className={`p-4 border-b border-white/5 cursor-pointer transition-all hover:bg-white/5 ${
                  selectedSessionId === session.id 
                    ? 'bg-white/5 border-l-4 border-l-primary-gold pl-[12px]' 
                    : 'border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-semibold ${selectedSessionId === session.id ? 'text-white' : 'text-white/80'}`}>
                    {session.userName}
                  </h3>
                  <span className="text-[10px] text-white/40 bg-white/5 px-2 py-1 rounded-full">
                    {new Date(session.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-white/50 truncate pr-4">
                  {session.messages[session.messages.length - 1]?.content || 'Mesaj yok'}
                </p>
                <div className="mt-3 flex gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    session.status === 'live_waiting' 
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                      : 'bg-green-500/10 text-green-400 border border-green-500/20'
                  }`}>
                    {session.status === 'live_waiting' ? '• Bekliyor' : '• Aktif'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col bg-[#0a0a0a] ${selectedSessionId ? 'flex' : 'hidden md:flex'}`}>
        {selectedSession ? (
          <>
            <div className="p-4 border-b border-white/5 bg-[#141414] flex items-center gap-4 shadow-sm z-10">
              <button 
                onClick={() => setSelectedSessionId(null)}
                className="md:hidden p-2 -ml-2 text-white/60 hover:text-white hover:bg-white/5 rounded-full transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-gold/20 to-primary-gold/5 border border-primary-gold/20 flex items-center justify-center text-primary-gold font-bold">
                  {selectedSession.userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-white leading-tight">{selectedSession.userName}</h3>
                  <p className="text-xs text-white/40">{selectedSession.userEmail}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-dots-pattern">
              {selectedSession.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[70%] p-3 md:p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${
                      msg.sender === 'admin'
                        ? 'bg-primary-gold text-black rounded-tr-none font-medium'
                        : msg.sender === 'bot'
                        ? 'bg-white/5 text-white/70 border border-white/10 text-xs italic'
                        : 'bg-[#1a1a1a] text-white border border-white/10 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                    <div className={`text-[10px] mt-1 ${msg.sender === 'admin' ? 'text-black/50' : 'text-white/30'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/5 bg-[#141414]">
              <form onSubmit={handleSendReply} className="flex gap-3">
                <input
                  type="text"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Cevap yazın..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary-gold/50 focus:ring-1 focus:ring-primary-gold/50 transition-all"
                />
                <button
                  type="submit"
                  disabled={!reply.trim()}
                  className="bg-primary-gold hover:bg-primary-gold-dark text-black p-3 rounded-xl transition-all shadow-lg shadow-primary-gold/20 disabled:opacity-50 disabled:shadow-none"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-white/20 p-8 text-center">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 animate-pulse">
              <MessageSquare size={48} className="opacity-50" />
            </div>
            <h3 className="text-xl font-bold text-white/40 mb-2">Görüşme Seçilmedi</h3>
            <p className="max-w-xs mx-auto">Detayları görüntülemek ve yanıtlamak için sol menüden bir sohbet seçin.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'properties');
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tab !== activeTab) {
      setTimeout(() => {
        setActiveTab(tab);
      }, 0);
    }
  }, [searchParams, activeTab]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Avoid synchronous state update in effect
      setTimeout(() => {
        setAdmin({ 
          email: payload.email,
          role: payload.role || 'admin' // Default to admin if not present
        });
      }, 0);
    } catch (error) {
      console.error('Token decode error:', error);
      router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const allMenuItems = [
    { id: 'properties', label: 'Emlaklar', icon: Building, description: 'İlanları Yönet', roles: ['admin', 'editor'] },
    { id: 'add-property', label: 'Emlak Ekle', icon: Plus, description: 'Yeni İlan Oluştur', roles: ['admin', 'editor'] },
    { id: 'messages', label: 'Mesajlar', icon: MessageSquare, description: 'Canlı Destek', roles: ['admin'] },
    { id: 'subscribers', label: 'Aboneler', icon: Bell, description: 'Bülten Aboneleri', roles: ['admin'] },
    { id: 'team', label: 'Danışmanlar', icon: Users, description: 'Ekip Üyeleri', roles: ['admin'] },
    { id: 'admins', label: 'Yöneticiler', icon: Shield, description: 'Sistem Yöneticileri', roles: ['admin'] },
    { id: 'settings', label: 'Ayarlar', icon: Settings, description: 'Sistem Ayarları', roles: ['admin'] },
  ];

  const menuItems = admin 
    ? allMenuItems.filter(item => item.roles.includes(admin.role))
    : [];

  const renderContent = () => {
    switch (activeTab) {
      case 'properties':
        return <PropertiesList editId={searchParams?.get('edit')} />;
      case 'add-property':
        return <PropertyForm 
          onCancel={() => setActiveTab('properties')} 
          onSuccess={() => setActiveTab('properties')} 
        />;
      case 'messages':
        return admin?.role === 'admin' ? <MessagesPanel /> : null;
      case 'subscribers':
        return admin?.role === 'admin' ? <SubscribersList /> : null;
      case 'team':
        return admin?.role === 'admin' ? <TeamManagement /> : null;
      case 'admins':
        return admin?.role === 'admin' ? <AdminManagement /> : null;
      case 'settings':
        return admin?.role === 'admin' ? <SettingsPanel /> : null;
      default:
        // Use a wrapper component or handle null safely if needed
        return <PropertiesList editId={searchParams?.get('edit')} />;
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
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div 
        initial={false}
        animate={{ 
          width: isMobile ? 280 : (isSidebarOpen ? 280 : 80),
          x: isMobile ? (isSidebarOpen ? 0 : -280) : 0
        }}
        className={`bg-[#141414] border-r border-white/5 flex flex-col h-screen z-50 transition-all duration-300 ${
          isMobile ? 'fixed inset-y-0 left-0' : 'sticky top-0'
        }`}
      >
        {/* Logo Area */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-gold to-primary-gold-dark rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary-gold/10">
              <Home className="w-5 h-5 text-white" />
            </div>
            {(!isMobile && isSidebarOpen || isMobile) && (
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
          {isMobile && (
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="text-white/50 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
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
                onClick={() => {
                  setActiveTab(item.id);
                  if (isMobile) setIsSidebarOpen(false);
                }}
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
                {(!isMobile && isSidebarOpen || isMobile) && (
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
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-red-400 hover:bg-red-500/10 transition-colors ${!isMobile && !isSidebarOpen && 'justify-center'}`}
          >
            <LogOut className="w-5 h-5" />
            {(!isMobile && isSidebarOpen || isMobile) && <span>Çıkış Yap</span>}
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-auto min-h-[5rem] py-4 md:py-0 bg-[#141414]/50 backdrop-blur-xl border-b border-white/5 flex flex-col md:flex-row items-center justify-between px-4 md:px-8 sticky top-0 z-40 gap-4">
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden text-white/50 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex flex-col">
                <h1 className="text-xl font-semibold text-white/80 leading-tight">
                  {menuItems.find(i => i.id === activeTab)?.label}
                </h1>
                <p className="text-xs text-white/40 hidden md:block">
                  {menuItems.find(i => i.id === activeTab)?.description}
                </p>
              </div>
            </div>
            
            {/* Mobile Profile Icon */}
            <div className="md:hidden flex items-center gap-3">
               <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors">
                <Bell className="w-5 h-5 text-white/60" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-gold rounded-full"></span>
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center text-xs font-bold">
                {admin.email[0].toUpperCase()}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Search className="w-5 h-5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Ara..." 
                className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-primary-gold/50 w-full md:w-64 transition-all focus:w-full md:focus:w-80"
              />
            </div>
            
            {/* Desktop Profile Area */}
            <div className="hidden md:flex items-center gap-6">
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
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-0 overflow-y-auto custom-scrollbar">
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

function PropertiesList({ editId }: { editId?: string | null }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingData, setEditingData] = useState<PropertyFormData | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
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

  const handleEdit = (property: Property) => {
    const formattedData = {
      title: property.title,
      type: property.type,
      category: property.category || '',
      subCategory: property.subCategory || '',
      price: property.price.toString(),
      location: property.location,
      description: property.description || '',
      features: {
        rooms: property.rooms?.toString() || '',
        bathrooms: property.bathrooms?.toString() || '',
        area: property.area?.toString() || '',
        areaNet: property.areaNet?.toString() || '',
        floor: property.floorNumber?.toString() || '',
        totalFloors: property.totalFloors?.toString() || '',
        buildingAge: property.buildingAge?.toString() || '',
        heating: property.heating || '',
        kitchen: property.kitchen || '',
        parking: property.parking || '',
        usageStatus: property.usageStatus || '',
        zoningStatus: property.zoningStatus || '',
        block: property.block || '',
        parcel: property.parcel || '',
        sheet: property.sheet || '',
        kaks: property.kaks || '',
        gabari: property.gabari || '',
        titleDeedStatus: property.titleDeedStatus || '',
        furnished: property.furnished || false,
        balcony: property.balcony || false,
        elevator: property.elevator || false,
        inComplex: property.inComplex || false,
        featured: property.featured || false,
        creditSuitable: property.credit || false,
        swap: property.swap || false,
      },
      photos: property.photos || [],
      id: property.id // Keep ID for reference
    };
    setEditingData(formattedData);
  };

  useEffect(() => {
    if (editId && properties.length > 0 && !editingData) {
      const property = properties.find(p => p.id === editId);
      if (property) {
        handleEdit(property);
        // Clear the URL param without reloading to avoid re-triggering or stuck state
        window.history.replaceState(null, '', '/admin');
      }
    }
  }, [editId, properties, editingData]);

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ilanı silmek istediğinize emin misiniz?')) return;
    
    try {
      const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' });
      if (res.ok) {
        clearCache('/api/properties');
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

  if (editingData) {
    return <PropertyForm 
      initialData={editingData} 
      isEditMode={true}
      propertyId={editingData.id}
      onCancel={() => setEditingData(null)} 
      onSuccess={() => { setEditingData(null); fetchProperties(); }} 
    />;
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
                  <Image 
                    src={property.photos[0].url} 
                    alt={property.title} 
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
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
                      onClick={() => handleEdit(property)}
                      className="p-2 hover:bg-yellow-500/10 text-white/40 hover:text-yellow-400 rounded-lg transition-colors"
                      title="Düzenle"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
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
    } catch {
      setSettings({ ...settings, maintenanceMode: !newState }); // Revert
    }
  };

  if (loading) {
    return (
      <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-4 md:p-8 m-4 md:m-6">
        <div className="border-b border-white/5 pb-6 mb-8">
          <h2 className="text-2xl font-bold text-white">Ayarlar</h2>
          <p className="text-white/40 mt-1">Sistem genel ayarlarını buradan yapılandırabilirsiniz.</p>
        </div>
        <div className="text-white/40">Ayarlar yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-4 md:p-8 m-4 md:m-6">
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

