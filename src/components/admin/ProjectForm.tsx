'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, MapPin, Building, DollarSign, ArrowLeft, Save, Info, Layout, Home, Layers, FileText, Locate, Loader2, Calendar, Users, X, Check } from 'lucide-react'
import { TRABZON_LOCATIONS } from '@/constants/propertyData'
import { FloatingInput, ModernSelect, ModernCheckbox } from './FormElements'

interface ProjectFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function ProjectForm({ onCancel, onSuccess }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    developer: '',
    status: 'Devam Ediyor',
    deliveryDate: '',
    totalUnits: '',
    availableUnits: '',
    priceRange: '',
    location: '',
    description: '',
    features: {
      pool: false,
      gym: false,
      parking: false,
      security: false,
      playground: false,
      sauna: false,
      turkishBath: false,
      elevator: false,
      generator: false,
      smartHome: false,
    },
  })
  
  // State for image handling
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  // Location Autocomplete & Geolocation State
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)
  const [filteredLocations, setFilteredLocations] = useState<string[]>([])
  const [locationLoading, setLocationLoading] = useState(false)

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value
    handleInputChange(e)
    
    if (value.length > 1) {
      const filtered = TRABZON_LOCATIONS.filter(loc => 
        loc.toLocaleLowerCase('tr').includes(value.toLocaleLowerCase('tr'))
      )
      setFilteredLocations(filtered)
      setShowLocationSuggestions(true)
    } else {
      setShowLocationSuggestions(false)
    }
  }

  const selectLocation = (location: string) => {
    setFormData(prev => ({ ...prev, location }))
    setShowLocationSuggestions(false)
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Tarayıcınız konum özelliğini desteklemiyor.')
      return
    }

    setLocationLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&accept-language=tr`)
          const data = await response.json()
          
          if (data.address) {
            const city = data.address.province || data.address.city
            const district = data.address.town || data.address.district || data.address.suburb
            const suburb = data.address.neighbourhood || data.address.quarter || data.address.suburb
            
            const parts = []
            if (city) parts.push(city)
            if (district && district !== city) parts.push(district)
            if (suburb && suburb !== district) parts.push(suburb)
            
            const address = parts.join(', ')
            setFormData(prev => ({ ...prev, location: address || `${latitude}, ${longitude}` }))
          } else {
             setFormData(prev => ({ ...prev, location: `${latitude}, ${longitude}` }))
          }
        } catch (error) {
          console.error('Konum alınamadı:', error)
          setFormData(prev => ({ ...prev, location: `${position.coords.latitude}, ${position.coords.longitude}` }))
        } finally {
          setLocationLoading(false)
        }
      },
      (error) => {
        console.error('Konum hatası:', error)
        setLocationLoading(false)
        alert('Konum bilgisine erişilemedi.')
      }
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        features: {
          ...prev.features,
          [name]: checked
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      
      const newUrls = newFiles.map(file => URL.createObjectURL(file))
      setImageUrls(prev => [...prev, ...newUrls])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files)
      
      const newUrls = newFiles.map(file => URL.createObjectURL(file))
      setImageUrls(prev => [...prev, ...newUrls])
    }
  }

  const removeImage = (index: number) => {
    setImageUrls(prev => {
      const newUrls = prev.filter((_, i) => i !== index)
      URL.revokeObjectURL(prev[index]) // Cleanup
      return newUrls
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    setError('')
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      if (onSuccess) {
        onSuccess()
      } else {
        alert('Proje başarıyla eklendi!')
      }
    } catch {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setUploading(false)
    }
  }

  const statusOptions = [
    { value: 'Plan Aşamasında', label: 'Plan Aşamasında' },
    { value: 'Devam Ediyor', label: 'Devam Ediyor' },
    { value: 'Tamamlandı', label: 'Tamamlandı' },
    { value: 'Satışta', label: 'Satışta' },
    { value: 'Tükendi', label: 'Tükendi' },
  ]

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onCancel}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Building className="w-8 h-8 text-primary-gold" />
              Yeni Proje Ekle
            </h1>
            <p className="text-white/40 mt-1">Yeni bir konut projesi oluşturun ve yönetin.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            type="button"
            onClick={onCancel}
            className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors text-center"
          >
            İptal
          </button>
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="flex-1 md:flex-none px-8 py-3 rounded-xl bg-primary-gold hover:bg-primary-gold-dark text-white font-bold shadow-lg shadow-primary-gold/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Projeyi Yayınla
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Basic Info Card */}
          <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Info className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-lg font-bold text-white">Temel Bilgiler</h2>
            </div>

            <div className="grid gap-6">
              <FloatingInput
                label="Proje Başlığı"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                prefix={<Building className="w-5 h-5" />}
              />

              <FloatingInput
                label="Yapımcı Firma"
                name="developer"
                value={formData.developer}
                onChange={handleInputChange}
                required
                prefix={<Users className="w-5 h-5" />}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ModernSelect
                  label="Proje Durumu"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  options={statusOptions}
                />
                
                <FloatingInput
                  label="Teslim Tarihi"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleInputChange}
                  placeholder="Örn: Aralık 2025"
                  prefix={<Calendar className="w-5 h-5" />}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FloatingInput
                  label="Fiyat Aralığı"
                  name="priceRange"
                  value={formData.priceRange}
                  onChange={handleInputChange}
                  placeholder="Örn: 3.000.000 - 15.000.000 TL"
                  prefix={<DollarSign className="w-5 h-5" />}
                />
                 <div className="grid grid-cols-2 gap-4">
                    <FloatingInput
                        label="Toplam Konut"
                        name="totalUnits"
                        type="number"
                        value={formData.totalUnits}
                        onChange={handleInputChange}
                        prefix={<Home className="w-5 h-5" />}
                    />
                    <FloatingInput
                        label="Uygun Konut"
                        name="availableUnits"
                        type="number"
                        value={formData.availableUnits}
                        onChange={handleInputChange}
                        prefix={<Check className="w-5 h-5" />}
                    />
                 </div>
              </div>
            </div>
          </div>

          {/* Location Card */}
          <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-lg font-bold text-white">Konum Bilgileri</h2>
              </div>
              <button 
                type="button"
                onClick={getCurrentLocation}
                disabled={locationLoading}
                className="text-xs flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg text-white/60 hover:text-white transition-colors"
              >
                {locationLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Locate className="w-3 h-3" />}
                Konumumu Bul
              </button>
            </div>

            <div className="relative">
              <FloatingInput
                label="Konum / Adres"
                name="location"
                value={formData.location}
                onChange={handleLocationChange}
                required
                prefix={<MapPin className="w-5 h-5" />}
                autoComplete="off"
              />
              
              <AnimatePresence>
                {showLocationSuggestions && filteredLocations.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute z-50 left-0 right-0 mt-2 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto"
                  >
                    {filteredLocations.map((loc, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => selectLocation(loc)}
                        className="w-full text-left px-4 py-3 text-white/80 hover:bg-white/5 hover:text-primary-gold transition-colors border-b border-white/5 last:border-0"
                      >
                        {loc}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Description Card */}
          <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-lg font-bold text-white">Proje Açıklaması</h2>
            </div>

            <div className="relative">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-primary-gold focus:ring-1 focus:ring-primary-gold/30 transition-all resize-none"
                placeholder="Proje hakkında detaylı bilgi, avantajlar ve özellikler..."
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Images Card */}
          <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Layout className="w-5 h-5 text-orange-400" />
              </div>
              <h2 className="text-lg font-bold text-white">Görseller</h2>
            </div>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer relative overflow-hidden group
                ${isDragging ? 'border-primary-gold bg-primary-gold/10' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}
              `}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="relative z-0">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-8 h-8 text-white/40 group-hover:text-primary-gold transition-colors" />
                </div>
                <p className="text-white font-medium mb-1">Görselleri Sürükleyin</p>
                <p className="text-white/40 text-xs">veya seçmek için tıklayın</p>
              </div>
            </div>

            {imageUrls.length > 0 && (
              <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {imageUrls.map((url, index) => (
                  <div 
                    key={index} 
                    className="relative group aspect-square overflow-hidden border border-white/10 rounded-lg"
                  >
                    <Image
                      src={url}
                      alt={`Project image ${index + 1}`}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-primary-gold text-black text-[10px] font-bold uppercase rounded tracking-wider">
                        Kapak
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Features Card */}
          <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Layers className="w-5 h-5 text-green-400" />
              </div>
              <h2 className="text-lg font-bold text-white">Özellikler</h2>
            </div>

            <div className="space-y-3">
              <ModernCheckbox label="Yüzme Havuzu" name="pool" checked={formData.features.pool} onChange={handleInputChange} />
              <ModernCheckbox label="Spor Salonu" name="gym" checked={formData.features.gym} onChange={handleInputChange} />
              <ModernCheckbox label="Otopark" name="parking" checked={formData.features.parking} onChange={handleInputChange} />
              <ModernCheckbox label="7/24 Güvenlik" name="security" checked={formData.features.security} onChange={handleInputChange} />
              <ModernCheckbox label="Çocuk Parkı" name="playground" checked={formData.features.playground} onChange={handleInputChange} />
              <ModernCheckbox label="Sauna" name="sauna" checked={formData.features.sauna} onChange={handleInputChange} />
              <ModernCheckbox label="Türk Hamamı" name="turkishBath" checked={formData.features.turkishBath} onChange={handleInputChange} />
              <ModernCheckbox label="Asansör" name="elevator" checked={formData.features.elevator} onChange={handleInputChange} />
              <ModernCheckbox label="Jeneratör" name="generator" checked={formData.features.generator} onChange={handleInputChange} />
              <ModernCheckbox label="Akıllı Ev Sistemi" name="smartHome" checked={formData.features.smartHome} onChange={handleInputChange} />
            </div>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="fixed bottom-8 right-8 bg-red-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right">
          <Info className="w-5 h-5" />
          {error}
        </div>
      )}
    </div>
  )
}
