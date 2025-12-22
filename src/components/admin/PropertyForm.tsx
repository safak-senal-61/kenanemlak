'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { Upload, MapPin, Building, DollarSign, Bed, Square, ArrowLeft, Save, Layout, Layers, FileText, X, Locate, Loader2, Ruler, FileCheck, Mountain } from 'lucide-react'
import Image from 'next/image'
import { TRABZON_LOCATIONS } from '@/constants/propertyData'
import CategorySelector from './CategorySelector'
import { FloatingInput, ModernSelect, ModernCheckbox } from './FormElements'

export interface PropertyFormData {
  title: string;
  type: string;
  category: string;
  subCategory: string;
  price: string;
  location: string;
  description: string;
  features: {
    rooms: string;
    bathrooms: string;
    area: string;
    areaNet: string;
    floor: string;
    totalFloors: string;
    buildingAge: string;
    heating: string;
    kitchen: string;
    parking: string;
    usageStatus: string;
    zoningStatus: string;
    block: string;
    parcel: string;
    sheet: string;
    kaks: string;
    gabari: string;
    titleDeedStatus: string;
    furnished: boolean;
    balcony: boolean;
    elevator: boolean;
    inComplex: boolean;
    featured: boolean;
    creditSuitable: boolean;
    swap: boolean;
  };
  photos?: { url: string }[];
  id?: string;
}

interface PropertyFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
  initialData?: Partial<PropertyFormData>;
  isEditMode?: boolean;
  propertyId?: string;
}

export default function PropertyForm({ onCancel, onSuccess, initialData, isEditMode = false, propertyId }: PropertyFormProps) {
  const [step, setStep] = useState(isEditMode ? 2 : 1) // If editing, skip category selection
  
  // Generate a draft ID for new properties to use for image folders
  const draftId = useRef(
    isEditMode ? null : Math.random().toString(36).substring(2, 10).toUpperCase()
  ).current
  
  const [formData, setFormData] = useState<PropertyFormData>(() => {
    const defaultData: PropertyFormData = {
      title: '',
      type: '',
      category: '',
      subCategory: '',
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
        zoningStatus: '', // İmar Durumu
        block: '', // Ada
        parcel: '', // Parsel
        sheet: '', // Pafta
        kaks: '', // Kaks/Emsal
        gabari: '', // Gabari
        titleDeedStatus: '', // Tapu Durumu
        // boolean features
        furnished: false,
        balcony: false,
        elevator: false,
        inComplex: false,
        featured: false,
        creditSuitable: false, // Krediye Uygun
        swap: false, // Takas
      },
      photos: []
    };
    return { ...defaultData, ...initialData } as PropertyFormData;
  })
  
  // State for image handling
  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.photos?.map(p => p.url) || [])
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Location Autocomplete & Geolocation State
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)
  const [filteredLocations, setFilteredLocations] = useState<string[]>([])
  const [locationLoading, setLocationLoading] = useState(false)

  const handleCategorySelect = (selection: { category: string, type: string, subCategory: string }) => {
    setFormData(prev => ({
      ...prev,
      category: selection.category,
      type: selection.type,
      subCategory: selection.subCategory
    }))
    setStep(2)
  }

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
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      if (parent === 'features') {
        setFormData(prev => ({
          ...prev,
          features: {
            ...prev.features,
            [child]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
          }
        }))
      }
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value 
      }))
    }
  }

  const uploadFiles = async (filesToUpload: File[]) => {
    if (filesToUpload.length === 0) return

    setUploading(true)

    try {
      const newUrls: string[] = []
      
      for (const file of filesToUpload) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', file)
        
        // Determine folder: properties/{id}
        const folderId = isEditMode && propertyId ? propertyId : draftId
        if (folderId) {
            uploadFormData.append('folder', `properties/${folderId}`)
        }

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        })

        if (res.ok) {
          const data = await res.json()
          newUrls.push(data.url)
        } else {
           console.error('Upload failed for file:', file.name)
        }
      }
      
      if (newUrls.length > 0) {
        setImageUrls(prev => [...prev, ...newUrls])
      }
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
      await uploadFiles(fileArray)
    }
  }

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Prepare data for API
    const payload = {
      id: isEditMode ? undefined : draftId,
      title: formData.title,
      type: formData.type,
      category: formData.category,
      subCategory: formData.subCategory,
      price: parseInt(formData.price),
      location: formData.location,
      description: formData.description,
      // Spread features to top level as expected by API
      ...formData.features,
      // Map specific feature names if they differ
      floorNumber: formData.features.floor,
      // Images
      images: imageUrls
    }

    try {
      const url = isEditMode && propertyId 
        ? `/api/properties/${propertyId}` 
        : '/api/properties'
      
      const method = isEditMode ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        console.error('Server error details:', data)
        throw new Error(data.details || data.error || 'Emlak eklenirken bir hata oluştu')
      }
      
      if (onSuccess) onSuccess()
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Bir hata oluştu. Lütfen tekrar deneyin.')
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

  // Helper to determine if fields should be shown based on category
  const isLand = formData.category?.trim() === 'Arsa'
  const isCommercial = formData.category?.trim() === 'İş Yeri'

  const heatingOptions = [
    { value: 'Yok', label: 'Yok' },
    { value: 'Soba', label: 'Soba' },
    { value: 'Doğalgaz Soba', label: 'Doğalgaz Soba' },
    { value: 'Kat Kaloriferi', label: 'Kat Kaloriferi' },
    { value: 'Merkezi', label: 'Merkezi' },
    { value: 'Merkezi (Pay Ölçer)', label: 'Merkezi (Pay Ölçer)' },
    { value: 'Kombi (Doğalgaz)', label: 'Kombi (Doğalgaz)' },
    { value: 'Kombi (Elektrik)', label: 'Kombi (Elektrik)' },
    { value: 'Yerden Isıtma', label: 'Yerden Isıtma' },
    { value: 'Klima', label: 'Klima' },
    { value: 'Şömine', label: 'Şömine' },
    { value: 'VRV', label: 'VRV' },
    { value: 'Isı Pompası', label: 'Isı Pompası' },
  ]

  const kitchenOptions = [
    { value: 'Kapalı', label: 'Kapalı Mutfak' },
    { value: 'Açık (Amerikan)', label: 'Açık (Amerikan) Mutfak' },
    { value: 'Yarı Açık', label: 'Yarı Açık Mutfak' },
    { value: 'Ankastre', label: 'Ankastre Mutfak' },
  ]

  const parkingOptions = [
    { value: 'Yok', label: 'Yok' },
    { value: 'Açık Otopark', label: 'Açık Otopark' },
    { value: 'Kapalı Otopark', label: 'Kapalı Otopark' },
    { value: 'Açık ve Kapalı', label: 'Açık ve Kapalı Otopark' },
  ]

  const usageStatusOptions = [
    { value: 'Boş', label: 'Boş' },
    { value: 'Kiracılı', label: 'Kiracılı' },
    { value: 'Mülk Sahibi', label: 'Mülk Sahibi Oturuyor' },
    { value: 'İnşaat Halinde', label: 'İnşaat Halinde' },
  ]

  const zoningOptions = [
    { value: 'Konut', label: 'Konut' },
    { value: 'Ticari', label: 'Ticari' },
    { value: 'Ticari + Konut', label: 'Ticari + Konut' },
    { value: 'Sanayi', label: 'Sanayi' },
    { value: 'Turizm', label: 'Turizm' },
    { value: 'Bağ & Bahçe', label: 'Bağ & Bahçe' },
    { value: 'Tarla', label: 'Tarla' },
    { value: 'Depo', label: 'Depo' },
    { value: 'Eğitim', label: 'Eğitim' },
    { value: 'Sağlık', label: 'Sağlık' },
    { value: 'Diğer', label: 'Diğer' },
  ]

  const deedOptions = [
    { value: 'Müstakil Parsel', label: 'Müstakil Parsel' },
    { value: 'Hisseli', label: 'Hisseli' },
    { value: 'Zilyetlik', label: 'Zilyetlik' },
    { value: 'Tahsis', label: 'Tahsis' },
  ]

  if (step === 1) {
    return (
      <div className="min-h-full bg-[#0a0a0a] text-white p-2 md:p-10 font-sans selection:bg-primary-gold/30 overflow-x-hidden">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4"
          >
             <button onClick={onCancel} className="inline-flex items-center gap-2 text-white/50 hover:text-primary-gold transition-colors w-fit group">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary-gold/30 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="font-medium text-sm">Geri Dön</span>
             </button>
             <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mt-2">Kategori Seçimi</h1>
                <p className="text-white/50 mt-1 font-light">İlanınız için doğru kategoriyi seçerek başlayın.</p>
             </div>
          </motion.div>
          
          <CategorySelector onSelect={handleCategorySelect} initialSelection={{ category: formData.category, type: formData.type, subCategory: formData.subCategory }} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-[#0a0a0a] text-white p-2 md:p-10 font-sans selection:bg-primary-gold/30 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <button onClick={() => setStep(1)} className="inline-flex items-center gap-2 text-white/50 hover:text-primary-gold transition-colors mb-2 group">
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary-gold/30 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span className="font-medium text-sm">Kategori Değiştir</span>
            </button>
            <h1 className="text-4xl font-bold tracking-tight text-white mt-2">İlan Detayları</h1>
            <p className="text-white/50 mt-1 font-light">
              <span className="text-primary-gold font-medium">{formData.category}</span> &gt; {formData.type} &gt; {formData.subCategory}
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors shadow-sm backdrop-blur-sm">
              Taslak
            </button>
            <button 
              type="submit"
              form="property-form"
              disabled={loading || uploading}
              className="px-6 py-3 bg-primary-gold text-black rounded-xl font-bold hover:bg-primary-gold-dark transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {loading ? 'Kaydediliyor...' : (isEditMode ? 'İlanı Güncelle' : 'İlanı Yayınla')}
            </button>
          </div>
        </motion.div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            {error}
          </div>
        )}

        <form id="property-form" onSubmit={handleSubmit}>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Section 1: Basic Info */}
            <motion.div variants={itemVariants} className="relative z-20 bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-3xl p-6 md:p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-gold to-primary-gold-dark rounded-2xl flex items-center justify-center text-black shadow-lg shadow-primary-gold/20">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Temel Bilgiler</h2>
                  <p className="text-sm text-white/40">İlanın başlığı ve fiyatı</p>
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                   <FloatingInput 
                     label="Fiyat (TL)"
                     name="price"
                     value={formData.price}
                     onChange={handleInputChange}
                     type="number"
                     required
                     prefix={<DollarSign className="w-5 h-5" />}
                   />
                   <div className="relative">
                      <FloatingInput
                        label="Konum / Adres"
                        name="location"
                        value={formData.location}
                        onChange={handleLocationChange}
                        required
                        prefix={<MapPin className="w-5 h-5" />}
                        autoComplete="off"
                        suffix={
                          <button 
                            type="button"
                            onClick={getCurrentLocation}
                            disabled={locationLoading}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                            title="Konumumu Bul"
                          >
                            {locationLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Locate className="w-4 h-4" />}
                          </button>
                        }
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
              </div>
            </motion.div>

            {/* Section 2: Features (Dynamic) */}
            <motion.div variants={itemVariants} className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Detaylar ve Özellikler</h2>
                  <p className="text-sm text-white/40">Kategoriye özel detaylar</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Common Fields */}
                <FloatingInput 
                  label={isLand ? "Metrekare (m²)" : "Brüt Metrekare (m²)"}
                  name="features.area"
                  value={formData.features.area}
                  onChange={handleInputChange}
                  type="number"
                  prefix={<Square className="w-5 h-5" />}
                  required
                />

                {!isLand && (
                  <FloatingInput 
                    label="Net Metrekare (m²)"
                    name="features.areaNet"
                    value={formData.features.areaNet}
                    onChange={handleInputChange}
                    type="number"
                    prefix={<Square className="w-5 h-5" />}
                  />
                )}

                {/* Residential / Commercial Specific */}
                {!isLand && (
                  <>
                    <FloatingInput 
                      label={isCommercial ? "Bölüm Sayısı" : "Oda Sayısı"}
                      name="features.rooms"
                      value={formData.features.rooms}
                      onChange={handleInputChange}
                      placeholder={isCommercial ? "Örn: 3" : "Örn: 3+1"}
                      prefix={<Bed className="w-5 h-5" />}
                      required
                    />
                    <FloatingInput 
                      label="Bina Yaşı"
                      name="features.buildingAge"
                      value={formData.features.buildingAge}
                      onChange={handleInputChange}
                      type="number"
                      prefix={<Building className="w-5 h-5" />}
                      required
                    />
                    <FloatingInput 
                      label="Bulunduğu Kat"
                      name="features.floor"
                      value={formData.features.floor}
                      onChange={handleInputChange}
                      type="number"
                      prefix={<Layers className="w-5 h-5" />}
                      required
                    />
                    <FloatingInput 
                      label="Kat Sayısı"
                      name="features.totalFloors"
                      value={formData.features.totalFloors}
                      onChange={handleInputChange}
                      type="number"
                      prefix={<Building className="w-5 h-5" />}
                      required
                    />
                    <ModernSelect 
                      label="Isıtma"
                      name="features.heating"
                      value={formData.features.heating}
                      onChange={handleInputChange}
                      options={heatingOptions}
                    />
                    <FloatingInput 
                      label="Banyo Sayısı"
                      name="features.bathrooms"
                      value={formData.features.bathrooms}
                      onChange={handleInputChange}
                      type="number"
                      required
                    />
                    <ModernSelect 
                      label="Mutfak Tipi"
                      name="features.kitchen"
                      value={formData.features.kitchen}
                      onChange={handleInputChange}
                      options={kitchenOptions}
                    />
                    <ModernSelect 
                      label="Otopark"
                      name="features.parking"
                      value={formData.features.parking}
                      onChange={handleInputChange}
                      options={parkingOptions}
                    />
                    <ModernSelect 
                      label="Kullanım Durumu"
                      name="features.usageStatus"
                      value={formData.features.usageStatus}
                      onChange={handleInputChange}
                      options={usageStatusOptions}
                    />
                  </>
                )}

                {/* Land Specific */}
                {isLand && (
                  <>
                    <ModernSelect 
                      label="İmar Durumu"
                      name="features.zoningStatus"
                      value={formData.features.zoningStatus}
                      onChange={handleInputChange}
                      options={zoningOptions}
                    />
                    <FloatingInput 
                      label="Ada No"
                      name="features.block"
                      value={formData.features.block}
                      onChange={handleInputChange}
                      prefix={<MapPin className="w-5 h-5" />}
                    />
                    <FloatingInput 
                      label="Parsel No"
                      name="features.parcel"
                      value={formData.features.parcel}
                      onChange={handleInputChange}
                      prefix={<MapPin className="w-5 h-5" />}
                    />
                    <FloatingInput 
                      label="Pafta No"
                      name="features.sheet"
                      value={formData.features.sheet}
                      onChange={handleInputChange}
                      prefix={<FileCheck className="w-5 h-5" />}
                    />
                    <FloatingInput 
                      label="Kaks (Emsal)"
                      name="features.kaks"
                      value={formData.features.kaks}
                      onChange={handleInputChange}
                      placeholder="Örn: 1.20"
                      prefix={<Ruler className="w-5 h-5" />}
                    />
                    <FloatingInput 
                      label="Gabari"
                      name="features.gabari"
                      value={formData.features.gabari}
                      onChange={handleInputChange}
                      placeholder="Örn: 12.50"
                      prefix={<Mountain className="w-5 h-5" />}
                    />
                    <ModernSelect 
                      label="Tapu Durumu"
                      name="features.titleDeedStatus"
                      value={formData.features.titleDeedStatus}
                      onChange={handleInputChange}
                      options={deedOptions}
                    />
                  </>
                )}
              </div>
              
              {/* Boolean Features */}
              <div className="mt-8 pt-8 border-t border-white/5">
                <h3 className="text-lg font-semibold text-white mb-4">Ek Özellikler</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <ModernCheckbox label="Krediye Uygun" name="features.creditSuitable" checked={formData.features.creditSuitable} onChange={handleInputChange} />
                  <ModernCheckbox label="Takas" name="features.swap" checked={formData.features.swap} onChange={handleInputChange} />
                  
                  {!isLand && (
                    <>
                      <ModernCheckbox label="Eşyalı" name="features.furnished" checked={formData.features.furnished} onChange={handleInputChange} />
                      <ModernCheckbox label="Balkon" name="features.balcony" checked={formData.features.balcony} onChange={handleInputChange} />
                      <ModernCheckbox label="Asansör" name="features.elevator" checked={formData.features.elevator} onChange={handleInputChange} />
                      <ModernCheckbox label="Site İçinde" name="features.inComplex" checked={formData.features.inComplex} onChange={handleInputChange} />
                    </>
                  )}
                  
                  <ModernCheckbox label="Öne Çıkan" name="features.featured" checked={formData.features.featured} onChange={handleInputChange} />
                </div>
              </div>
            </motion.div>

            {/* Section 3: Description */}
            <motion.div variants={itemVariants} className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Açıklama</h2>
                  <p className="text-sm text-white/40">İlan hakkında detaylı bilgi</p>
                </div>
              </div>

              <div className="relative group">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={8}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white placeholder-white/20 focus:outline-none focus:border-primary-gold focus:ring-1 focus:ring-primary-gold/30 transition-all resize-none font-medium leading-relaxed"
                  placeholder="İlanın tüm detaylarını, avantajlarını ve özelliklerini buraya yazabilirsiniz..."
                />
                <div className="absolute bottom-4 right-4 text-xs text-white/30 font-medium">
                  {formData.description.length} karakter
                </div>
              </div>
            </motion.div>

            {/* Section 4: Images */}
            <motion.div variants={itemVariants} className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-400">
                  <Layout className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Görseller</h2>
                  <p className="text-sm text-white/40">İlan fotoğraflarını yükleyin</p>
                </div>
              </div>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  border-3 border-dashed rounded-3xl p-12 text-center transition-all duration-300 cursor-pointer relative overflow-hidden group
                  ${isDragging ? 'border-primary-gold bg-primary-gold/10 scale-[1.02]' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}
                `}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer z-50"
                />
                <div className="relative z-10 pointer-events-none">
                  <div className="w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                    <Upload className="w-10 h-10 text-white/60 group-hover:text-primary-gold transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Fotoğrafları Sürükleyin</h3>
                  <p className="text-white/40">veya dosya seçmek için tıklayın</p>
                  <p className="text-white/20 text-xs mt-4">JPG, PNG, WEBP (Max 5MB)</p>
                </div>
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500" 
                     style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
              </div>

              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8">
                  <AnimatePresence>
                    {imageUrls.map((url, index) => (
                      <motion.div
                        key={url}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        layout
                        className="relative group aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-lg"
                      >
                        <Image 
                          src={url} 
                          alt={`Preview ${index}`} 
                          fill 
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                           <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="p-2 bg-red-500/80 hover:bg-red-500 rounded-xl text-white transition-colors backdrop-blur-sm"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        {index === 0 && (
                          <div className="absolute top-2 left-2 px-3 py-1 bg-primary-gold text-black text-[10px] font-bold uppercase rounded-lg tracking-wider shadow-lg">
                            Kapak
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </motion.div>
        </form>
      </div>
    </div>
  )
}
