'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Plus, Home, Users, Settings, LogOut, Building } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('properties');
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    // Decode token to get admin info
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
    { id: 'properties', label: 'Emlaklar', icon: Building },
    { id: 'add-property', label: 'Emlak Ekle', icon: Plus },
    { id: 'admins', label: 'Adminler', icon: Users },
    { id: 'settings', label: 'Ayarlar', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'properties':
        return <PropertiesList />;
      case 'add-property':
        return <AddPropertyForm />;
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
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Building className="w-12 h-12 text-primary-gold" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-64 bg-white shadow-lg"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-gold rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-charcoal">Kenan Kadıoğlu</h2>
              <p className="text-sm text-gray-600">Admin Paneli</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-primary-gold text-white'
                    : 'text-charcoal hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </motion.button>
            );
          })}
          
          <motion.button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors mt-8"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className="w-5 h-5" />
            <span>Çıkış Yap</span>
          </motion.button>
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-charcoal mb-2">
              Hoş Geldiniz, {admin.email}
            </h1>
            <p className="text-gray-600">
              Kenan Kadıoğlu Gayrimenkul Admin Paneli
            </p>
          </div>

          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
}

function PropertiesList() {
  const [properties, setProperties] = useState([]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-charcoal">Emlak Listesi</h2>
        <button className="bg-primary-gold text-white px-4 py-2 rounded-lg hover:bg-accent-bronze transition-colors">
          Yeni Emlak Ekle
        </button>
      </div>
      
      <div className="text-center py-12">
        <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Henüz emlak eklenmemiş</p>
      </div>
    </motion.div>
  );
}

function AddPropertyForm() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-charcoal mb-6">Yeni Emlak Ekle</h2>
      <p className="text-gray-600">Emlak ekleme formu burada yer alacak.</p>
    </motion.div>
  );
}

function AdminList() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-charcoal mb-6">Admin Listesi</h2>
      <p className="text-gray-600">Admin yönetimi burada yer alacak.</p>
    </motion.div>
  );
}

function SettingsPanel() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-charcoal mb-6">Ayarlar</h2>
      <p className="text-gray-600">Site ayarları burada yer alacak.</p>
    </motion.div>
  );
}