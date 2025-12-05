'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { Upload, MapPin, Building, DollarSign, Bed, Square, ArrowLeft, Check, Save, Info, Layout, Home, Layers, FileText, ChevronDown, X, Locate, Loader2 } from 'lucide-react'
import Link from 'next/link'

const TRABZON_LOCATIONS = [
  "Trabzon, Ortahisar", "Trabzon, Akçaabat", "Trabzon, Yomra", "Trabzon, Arsin", 
  "Trabzon, Araklı", "Trabzon, Sürmene", "Trabzon, Of", "Trabzon, Vakfıkebir", 
  "Trabzon, Beşikdüzü", "Trabzon, Çarşıbaşı", "Trabzon, Maçka", "Trabzon, Tonya",
  "Trabzon, Düzköy", "Trabzon, Şalpazarı", "Trabzon, Köprübaşı", "Trabzon, Dernekpazarı", 
  "Trabzon, Hayrat", "Trabzon, Çaykara",
  "Trabzon, Ortahisar, Çukurçayır", "Trabzon, Ortahisar, Pelitli", "Trabzon, Ortahisar, Konaklar",
  "Trabzon, Ortahisar, Kalkınma", "Trabzon, Ortahisar, Bostancı", "Trabzon, Ortahisar, Üniversite",
  "Trabzon, Ortahisar, 1 Nolu Beşirli", "Trabzon, Ortahisar, 2 Nolu Beşirli", "Trabzon, Ortahisar, Toklu",
  "Trabzon, Ortahisar, Soğuksu", "Trabzon, Ortahisar, Bahçecik", "Trabzon, Ortahisar, Aydınlıkevler",
  "Trabzon, Ortahisar, Yeşiltepe", "Trabzon, Ortahisar, Boztepe", "Trabzon, Ortahisar, Yenicuma",
  "Trabzon, Ortahisar, Erdoğdu", "Trabzon, Ortahisar, Karşıyaka",
  "Trabzon, Akçaabat, Söğütlü", "Trabzon, Akçaabat, Yıldızlı", "Trabzon, Akçaabat, Yaylacık",
  "Trabzon, Akçaabat, Darıca", "Trabzon, Akçaabat, Mersin", "Trabzon, Akçaabat, Akçakale",
  "Trabzon, Yomra, Kaşüstü", "Trabzon, Yomra, Sancak", "Trabzon, Yomra, Gürsel", "Trabzon, Yomra, Namıkkemal"
];

// Reusable Modern Components

const FloatingInput = ({ 
  label, 
  name, 
  value, 
  onChange, 
  type = "text", 
  required = false, 
  className = "",
  prefix = null,
  suffix = null,
  ...props 
}: any) => {
  const [isFocused, setIsFocused] = useState(false)
  const hasValue = value !== '' && value !== null && value !== undefined

  return (
    <div className={`relative group ${className}`}>
      <div className={`absolute inset-0 bg-gradient-to-r from-primary-gold/10 to-transparent opacity-0 transition-opacity duration-500 rounded-xl pointer-events-none ${isFocused ? 'opacity-100' : ''}`} />
      <div 
        className={`
          relative flex items-center bg-white/5 border rounded-xl overflow-hidden transition-all duration-300
          ${isFocused ? 'border-primary-gold ring-1 ring-primary-gold/30 bg-white/10 scale-[1.01]' : 'border-white/10 hover:border-white/20 hover:bg-white/[0.07]'}
        `}
      >
        {prefix && (
          <div className={`pl-4 transition-colors duration-300 ${isFocused ? 'text-primary-gold' : 'text-white/40'}`}>
            {prefix}
          </div>
        )}
        <div className="relative flex-1">
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`
              w-full px-4 py-4 bg-transparent border-none outline-none text-white placeholder-transparent transition-all
              ${prefix ? 'pl-3' : ''}
              ${suffix ? 'pr-2' : ''}
              pt-6 pb-2 font-medium
            `}
            placeholder={label}
            required={required}
            {...props}
          />
          <label
            className={`
              absolute left-4 transition-all duration-300 pointer-events-none
              ${prefix ? 'left-3' : ''}
              ${isFocused || hasValue
                ? 'top-2 text-[10px] text-primary-gold font-bold uppercase tracking-wider transform-none'
                : 'top-1/2 -translate-y-1/2 text-white/40 font-normal text-base'}
            `}
          >
            {label}
          </label>
        </div>
        {suffix && (
          <div className="pr-3 pl-1">
            {suffix}
          </div>
        )}
      </div>
    </div>
  )
}

const ModernSelect = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options, 
  icon: Icon 
}: any) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="relative group">
      <div className={`absolute inset-0 bg-gradient-to-r from-primary-gold/10 to-transparent opacity-0 transition-opacity duration-500 rounded-xl pointer-events-none ${isFocused ? 'opacity-100' : ''}`} />
      <div 
        className={`
          relative flex items-center bg-white/5 border rounded-xl overflow-hidden transition-all duration-300
          ${isFocused ? 'border-primary-gold ring-1 ring-primary-gold/30 bg-white/10' : 'border-white/10 hover:border-white/20 hover:bg-white/[0.07]'}
        `}
      >
        <div className="relative flex-1">
           <select
            name={name}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full px-4 py-4 bg-transparent border-none outline-none appearance-none text-white pt-6 pb-2 font-medium cursor-pointer [&>option]:bg-zinc-900"
          >
            {options.map((opt: any) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <label
            className="absolute left-4 top-2 text-[10px] text-primary-gold font-bold uppercase tracking-wider pointer-events-none"
          >
            {label}
          </label>
          <div className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 ${isFocused ? 'rotate-180 text-primary-gold' : 'text-white/40'}`}>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  )
}

const ModernCheckbox = ({ label, name, checked, onChange }: any) => (
  <label className="relative flex items-center gap-3 p-3 rounded-xl border border-transparent hover:bg-white/5 transition-all cursor-pointer group overflow-hidden">
    <div className={`
      w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300
      ${checked 
        ? 'bg-primary-gold border-primary-gold shadow-[0_0_10px_rgba(212,175,55,0.4)]' 
        : 'border-white/30 group-hover:border-white/60 bg-transparent'}
    `}>
      <Check className={`w-3.5 h-3.5 text-black font-bold transition-all duration-300 ${checked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} strokeWidth={3} />
    </div>
    <span className={`font-medium transition-colors duration-300 ${checked ? 'text-white' : 'text-white/60 group-hover:text-white/90'}`}>
      {label}
    </span>
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="hidden"
    />
    {checked && (
      <motion.div 
        layoutId={`active-bg-${name}`}
        className="absolute inset-0 bg-white/5 rounded-xl -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
    )}
  </label>
)

interface PropertyFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function PropertyForm({ onCancel, onSuccess }: PropertyFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Satılık',
    category: 'Konut',
    price: '',
    location: '',
    description: '',
    features: {
      rooms: '',
      bathrooms: '',
      area: '',
      areaNet: '',
      floor: '',
      totalFloors: '',
      buildingAge: '',
      heating: '',
      kitchen: '',
      parking: '',
      usageStatus: '',
      // boolean features
      furnished: false,
      balcony: false,
      elevator: false,
      inComplex: false,
      featured: false,
    },
  })
  
  // State for image handling
  const [images, setImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Location Autocomplete & Geolocation State
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)
  const [filteredLocations, setFilteredLocations] = useState<string[]>([])
  const [locationLoading, setLocationLoading] = useState(false)

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      if (name.includes('.')) {
        const [parent, child] = name.split('.')
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...(prev as Record<string, unknown>)[parent] as Record<string, string | boolean>,
            [child]: checked
          }
        }))
      } else {
        setFormData(prev => ({ ...prev, [name]: checked }))
      }
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as Record<string, unknown>)[parent] as Record<string, string | boolean>,
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const uploadFiles = async (filesToUpload: File[]) => {
    if (filesToUpload.length === 0) return

    setUploading(true)
    const newUrls: string[] = []

    try {
      for (const file of filesToUpload) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', file)

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        })

        if (res.ok) {
          const data = await res.json()
          newUrls.push(data.url)
        }
      }
      setImageUrls(prev => [...prev, ...newUrls])
    } catch (err) {
      console.error('Upload error:', err)
      setError('Görsel yüklenirken bir hata oluştu.')
    } finally {
      setUploading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const fileArray = Array.from(files)
      setImages(prev => [...prev, ...fileArray])
      await uploadFiles(fileArray)
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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files) {
      const fileArray = Array.from(files)
      setImages(prev => [...prev, ...fileArray])
      await uploadFiles(fileArray)
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImageUrls(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Prepare data for API
    const payload = {
      title: formData.title,
      type: formData.type,
      category: formData.category,
      price: formData.price,
      location: formData.location,
      description: formData.description,
      
      // Flatten features with type conversion
      area: parseInt(formData.features.area) || 0,
      areaNet: parseInt(formData.features.areaNet) || 0,
      rooms: formData.features.rooms,
      bathrooms: parseInt(formData.features.bathrooms) || 0,
      buildingAge: formData.features.buildingAge,
      floorNumber: parseInt(formData.features.floor) || 0,
      totalFloors: parseInt(formData.features.totalFloors) || 0,
      heating: formData.features.heating,
      kitchen: formData.features.kitchen,
      parking: formData.features.parking,
      usageStatus: formData.features.usageStatus,
      
      // Booleans
      furnished: formData.features.furnished,
      balcony: formData.features.balcony,
      elevator: formData.features.elevator,
      inComplex: formData.features.inComplex,
      featured: formData.features.featured,
      
      images: imageUrls
    }

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Emlak eklenirken bir hata oluştu')
      
      if (onSuccess) onSuccess()
    } catch (err) {
      console.error(err)
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 20 }
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-10 font-sans selection:bg-primary-gold/30">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            {onCancel ? (
              <button onClick={onCancel} className="inline-flex items-center gap-2 text-white/50 hover:text-primary-gold transition-colors mb-2 group">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary-gold/30 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="font-medium text-sm">Geri Dön</span>
              </button>
            ) : (
              <Link href="/admin/properties" className="inline-flex items-center gap-2 text-white/50 hover:text-primary-gold transition-colors mb-2 group">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary-gold/30 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="font-medium text-sm">İlanlara Dön</span>
              </Link>
            )}
            <h1 className="text-4xl font-bold tracking-tight text-white mt-2">Yeni İlan Ekle</h1>
            <p className="text-white/50 mt-1 font-light">Gayrimenkul portföyünüze yeni bir ilan ekleyin.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors shadow-sm backdrop-blur-sm">
              Taslak
            </button>
            <button 
              onClick={handleSubmit}
              disabled={loading || uploading}
              className="px-6 py-3 bg-primary-gold text-black rounded-xl font-bold hover:bg-primary-gold-dark transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {loading ? 'Kaydediliyor...' : 'İlanı Yayınla'}
            </button>
          </div>
        </motion.div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Section 1: Basic Info */}
            <motion.div variants={itemVariants} className="relative z-20 bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-gold to-primary-gold-dark rounded-2xl flex items-center justify-center text-black shadow-lg shadow-primary-gold/20">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Temel Bilgiler</h2>
                  <p className="text-sm text-white/40">İlanın başlığı ve ana özellikleri</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-8">
                <FloatingInput 
                  label="İlan Başlığı"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <ModernSelect 
                     label="İlan Tipi"
                     name="type"
                     value={formData.type}
                     onChange={handleInputChange}
                     options={[
                       { value: 'Satılık', label: 'Satılık' },
                       { value: 'Kiralık', label: 'Kiralık' },
                     ]}
                   />
                   <ModernSelect 
                     label="Kategori"
                     name="category"
                     value={formData.category}
                     onChange={handleInputChange}
                     options={[
                       { value: 'Konut', label: 'Konut' },
                       { value: 'Ticari', label: 'Ticari' },
                       { value: 'Arsa', label: 'Arsa' },
                       { value: 'Turistik Tesis', label: 'Turistik Tesis' },
                     ]}
                   />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FloatingInput 
                    label="Fiyat"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    type="number"
                    prefix={<span className="text-sm font-bold">₺</span>}
                    required
                  />
                  <div className="relative">
                    <FloatingInput 
                      label="Konum"
                      name="location"
                      value={formData.location}
                      onChange={handleLocationChange}
                      prefix={<MapPin className="w-4 h-4" />}
                      suffix={
                        <button
                          type="button"
                          onClick={getCurrentLocation}
                          disabled={locationLoading}
                          className="p-2 hover:bg-white/10 rounded-full transition-colors text-primary-gold group/btn relative"
                          title="Mevcut Konumu Kullan"
                        >
                          {locationLoading ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <MapPin className="w-4 h-4" />
                          )}
                        </button>
                      }
                      required
                    />
                    
                    <AnimatePresence>
                      {showLocationSuggestions && filteredLocations.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-50 left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto"
                        >
                          {filteredLocations.map((loc, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => selectLocation(loc)}
                              className="w-full text-left px-4 py-3 text-sm text-white/80 hover:bg-white/5 hover:text-primary-gold transition-colors flex items-center gap-2 border-b border-white/5 last:border-none"
                            >
                              <MapPin className="w-3 h-3 opacity-50" />
                              {loc}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Section 2: Images */}
            <motion.div variants={itemVariants} className="relative z-10 bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                   <Layers className="w-6 h-6" />
                 </div>
                 <div>
                   <h2 className="text-xl font-bold text-white">Medya & Görseller</h2>
                   <p className="text-sm text-white/40">İlanınız için yüksek kaliteli görseller yükleyin</p>
                 </div>
              </div>

              <div 
                className={`
                  relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-500 group cursor-pointer overflow-hidden
                  ${isDragging 
                    ? 'border-primary-gold bg-primary-gold/10 scale-[1.01]' 
                    : 'border-white/10 hover:border-primary-gold/50 hover:bg-white/5'}
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />
                
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-white/30 group-hover:text-primary-gold group-hover:scale-110 transition-all duration-500 border border-white/5 group-hover:border-primary-gold/30">
                  <Upload className="w-8 h-8" />
                </div>
                <p className="text-xl font-medium text-white mb-2 group-hover:text-primary-gold transition-colors">Görselleri buraya sürükleyin</p>
                <p className="text-sm text-white/40 mb-8">veya dosya seçmek için tıklayın</p>
                <label className="relative inline-block px-8 py-3 bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/20 hover:text-primary-gold cursor-pointer transition-all shadow-sm hover:shadow-lg hover:-translate-y-0.5">
                  Dosya Seç
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Uploading Indicator */}
              {uploading && (
                <div className="mt-4 flex items-center justify-center gap-2 text-primary-gold text-sm">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>Görseller yükleniyor...</span>
                </div>
              )}

              {/* Image Preview List */}
              <AnimatePresence>
                {images.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
                  >
                    {images.map((file, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative aspect-square bg-black/40 rounded-2xl overflow-hidden group border border-white/10 hover:border-primary-gold/50 transition-colors"
                      >
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt="Preview" 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                           <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="p-3 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg transform hover:scale-110"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-[10px] text-white/80 truncate">{file.name}</p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Section 3: Details Grid */}
            <motion.div variants={itemVariants} className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                   <Layout className="w-6 h-6" />
                 </div>
                 <div>
                   <h2 className="text-xl font-bold text-white">Detaylar</h2>
                   <p className="text-sm text-white/40">Metrekare, oda sayısı ve diğer özellikler</p>
                 </div>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <FloatingInput label="Metrekare (Brüt)" name="features.area" value={formData.features.area} onChange={handleInputChange} type="number" />
                  <FloatingInput label="Metrekare (Net)" name="features.areaNet" value={formData.features.areaNet} onChange={handleInputChange} type="number" />
                  <FloatingInput label="Oda Sayısı" name="features.rooms" value={formData.features.rooms} onChange={handleInputChange} />
                  <FloatingInput label="Banyo Sayısı" name="features.bathrooms" value={formData.features.bathrooms} onChange={handleInputChange} type="number" />
                  <FloatingInput label="Bina Yaşı" name="features.buildingAge" value={formData.features.buildingAge} onChange={handleInputChange} />
                  <FloatingInput label="Bulunduğu Kat" name="features.floor" value={formData.features.floor} onChange={handleInputChange} type="number" />
                  <FloatingInput label="Kat Sayısı" name="features.totalFloors" value={formData.features.totalFloors} onChange={handleInputChange} type="number" />
                  
                  <ModernSelect 
                    label="Isıtma" 
                    name="features.heating" 
                    value={formData.features.heating} 
                    onChange={handleInputChange}
                    options={[
                      { value: '', label: 'Seçiniz' },
                      { value: 'Kombi (Doğalgaz)', label: 'Kombi (Doğalgaz)' },
                      { value: 'Merkezi', label: 'Merkezi' },
                      { value: 'Klima', label: 'Klima' },
                      { value: 'Soba', label: 'Soba' },
                      { value: 'Yerden Isıtma', label: 'Yerden Isıtma' },
                      { value: 'Yok', label: 'Yok' }
                    ]} 
                  />

                  <ModernSelect 
                    label="Mutfak" 
                    name="features.kitchen" 
                    value={formData.features.kitchen} 
                    onChange={handleInputChange}
                    options={[
                      { value: '', label: 'Seçiniz' },
                      { value: 'Açık (Amerikan)', label: 'Açık (Amerikan)' },
                      { value: 'Kapalı', label: 'Kapalı' },
                      { value: 'Ankastre', label: 'Ankastre' }
                    ]} 
                  />

                  <ModernSelect 
                    label="Otopark" 
                    name="features.parking" 
                    value={formData.features.parking} 
                    onChange={handleInputChange}
                    options={[
                      { value: '', label: 'Seçiniz' },
                      { value: 'Açık Otopark', label: 'Açık Otopark' },
                      { value: 'Kapalı Otopark', label: 'Kapalı Otopark' },
                      { value: 'Yok', label: 'Yok' }
                    ]} 
                  />

                  <ModernSelect 
                    label="Kullanım Durumu" 
                    name="features.usageStatus" 
                    value={formData.features.usageStatus} 
                    onChange={handleInputChange}
                    options={[
                      { value: '', label: 'Seçiniz' },
                      { value: 'Boş', label: 'Boş' },
                      { value: 'Kiracılı', label: 'Kiracılı' },
                      { value: 'Mülk Sahibi', label: 'Mülk Sahibi' }
                    ]} 
                  />
               </div>
            </motion.div>

            {/* Section 4: Features & Description */}
            <motion.div variants={itemVariants} className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
                   <Check className="w-6 h-6" />
                 </div>
                 <div>
                   <h2 className="text-xl font-bold text-white">Özellikler & Açıklama</h2>
                   <p className="text-sm text-white/40">Ek özellikler ve detaylı açıklama</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
                 {[
                   { label: 'Balkon', name: 'balcony' },
                   { label: 'Asansör', name: 'elevator' },
                   { label: 'Eşyalı', name: 'furnished' },
                   { label: 'Site İçinde', name: 'inComplex' },
                   { label: 'Öne Çıkan', name: 'featured' },
                 ].map((item) => (
                   <ModernCheckbox
                     key={item.name}
                     label={item.label}
                     name={`features.${item.name}`}
                     checked={(formData.features as any)[item.name]}
                     onChange={handleInputChange}
                   />
                 ))}
              </div>

              <div className="relative">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white placeholder-white/30 focus:outline-none focus:border-primary-gold/50 focus:bg-white/[0.07] transition-all resize-none"
                  placeholder="İlan hakkında detaylı açıklama yazın..."
                />
              </div>
            </motion.div>
          </motion.div>
        </form>
      </div>
    </div>
  )
}
