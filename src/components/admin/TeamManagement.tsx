'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Upload } from 'lucide-react';
import Image from 'next/image';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  slug: string;
  image: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  location: string | null;
  bio: string | null;
  order: number;
  isActive: boolean;
}

export default function TeamManagement() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: '',
    role: '',
    slug: '',
    image: '',
    email: '',
    phone: '',
    whatsapp: '',
    location: '',
    bio: '',
    order: 0,
    isActive: true,
  });
  const [uploading, setUploading] = useState(false);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/team');
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleOpenModal = (member?: TeamMember) => {
    if (member) {
      setEditingMember(member);
      setFormData(member);
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        role: '',
        slug: '',
        image: '',
        email: '',
        phone: '',
        whatsapp: '',
        location: '',
        bio: '',
        order: members.length,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
    setFormData({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      // Auto-generate slug from name if slug is empty or we are adding new member
      if (name === 'name' && !editingMember) {
        newData.slug = value
          .toLowerCase()
          .replace(/ğ/g, 'g')
          .replace(/ü/g, 'u')
          .replace(/ş/g, 's')
          .replace(/ı/g, 'i')
          .replace(/ö/g, 'o')
          .replace(/ç/g, 'c')
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-');
      }
      return newData;
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append('file', file);
    
    // Use slug or name for folder, fallback to 'temp'
    const folderName = formData.slug || 
                      (formData.name ? formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'temp');
    data.append('folder', `team/${folderName}`);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        const result = await res.json();
        setFormData(prev => ({ ...prev, image: result.url }));
      } else {
        alert('Resim yüklenemedi');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Resim yüklenirken hata oluştu');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    
    try {
      const url = editingMember ? `/api/team/${editingMember.id}` : '/api/team';
      const method = editingMember ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        handleCloseModal();
        fetchMembers();
      } else {
        const error = await res.json();
        alert(error.error || 'Bir hata oluştu');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('İşlem sırasında bir hata oluştu');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu üyeyi silmek istediğinize emin misiniz?')) return;

    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/team/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        fetchMembers();
      } else {
        alert('Silme işlemi başarısız');
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  if (loading) return <div className="text-white">Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Ekip Yönetimi</h2>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary-gold text-black px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-primary-gold-dark transition-colors"
        >
          <Plus size={20} />
          <span>Yeni Üye Ekle</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map(member => (
          <div key={member.id} className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden group hover:border-primary-gold/30 transition-all">
            <div className="relative h-48 bg-white/5">
              {member.image ? (
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20">
                  <span className="text-4xl font-bold">{member.name.charAt(0)}</span>
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleOpenModal(member)}
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white backdrop-blur-sm"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="bg-red-500/80 hover:bg-red-500 p-2 rounded-lg text-white backdrop-blur-sm"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-white">{member.name}</h3>
              <p className="text-primary-gold text-sm">{member.role}</p>
              <div className="mt-4 space-y-2 text-sm text-white/60">
                {member.phone && <p>{member.phone}</p>}
                {member.email && <p>{member.email}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#141414] z-10">
              <h3 className="text-xl font-bold text-white">
                {editingMember ? 'Üye Düzenle' : 'Yeni Üye Ekle'}
              </h3>
              <button onClick={handleCloseModal} className="text-white/40 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-white/60">Ad Soyad</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-primary-gold outline-none"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-white/60">Unvan / Rol</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role || ''}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-primary-gold outline-none"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-white/60">Slug (URL)</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug || ''}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-primary-gold outline-none"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-white/60">Sıralama</label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order || 0}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-primary-gold outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-white/60">Telefon</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-primary-gold outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-white/60">E-posta</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-primary-gold outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-white/60">WhatsApp (Opsiyonel)</label>
                  <input
                    type="text"
                    name="whatsapp"
                    value={formData.whatsapp || ''}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-primary-gold outline-none"
                    placeholder="905..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-white/60">Konum</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-primary-gold outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/60">Biyografi</label>
                <textarea
                  name="bio"
                  value={formData.bio || ''}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-primary-gold outline-none resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/60">Profil Fotoğrafı</label>
                <div className="flex items-center gap-4">
                  {formData.image && (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white/5">
                      <Image
                        src={formData.image}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <label className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl cursor-pointer transition-colors text-white">
                    <Upload size={20} />
                    <span>{uploading ? 'Yükleniyor...' : 'Fotoğraf Seç'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 rounded-xl text-white hover:bg-white/5 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="bg-primary-gold hover:bg-primary-gold-dark text-black px-6 py-2 rounded-xl font-medium transition-colors"
                >
                  {editingMember ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
