'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { Search, Filter } from 'lucide-react'
import PropertyCard from '@/components/PropertyCard'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

function PropertiesContent() {
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('Tümü')
  const [filterCategory, setFilterCategory] = useState('Tümü')
  const [filterLocation, setFilterLocation] = useState('Tümü')
  const [sortBy, setSortBy] = useState('Yeni İlanlar')

  useEffect(() => {
    const type = searchParams.get('type')
    const location = searchParams.get('location')
    
    if (type && ['Satılık', 'Kiralık'].includes(type)) {
      setFilterType(type)
    }
    
    if (location) {
      setSearchTerm(location)
    }
  }, [searchParams])

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch('/api/properties')
        if (res.ok) {
          const data = await res.json()
          const activeProperties = data.filter((p: any) => p.isActive)
          setProperties(activeProperties.map((p: any) => ({
            ...p,
            image: p.photos?.[0]?.url
          })))
        }
      } catch (error) {
        console.error('Error fetching properties:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  // Extract unique values for filters
  const uniqueLocations = ['Tümü', ...Array.from(new Set(properties.map(p => p.location.split(',')[0].trim())))]
  const uniqueCategories = ['Tümü', ...Array.from(new Set(properties.map(p => p.category)))]
  const types = ['Tümü', 'Satılık', 'Kiralık']

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'Tümü' || property.type === filterType
    const matchesCategory = filterCategory === 'Tümü' || property.category === filterCategory
    const matchesLocation = filterLocation === 'Tümü' || property.location.includes(filterLocation)
    
    return matchesSearch && matchesType && matchesCategory && matchesLocation
  })

  // Sorting
  filteredProperties.sort((a, b) => {
    if (sortBy === 'Yeni İlanlar') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else if (sortBy === 'Fiyat: Artan') {
      const priceA = parseInt(a.price.replace(/[^0-9]/g, '')) || 0
      const priceB = parseInt(b.price.replace(/[^0-9]/g, '')) || 0
      return priceA - priceB
    } else if (sortBy === 'Fiyat: Azalan') {
      const priceA = parseInt(a.price.replace(/[^0-9]/g, '')) || 0
      const priceB = parseInt(b.price.replace(/[^0-9]/g, '')) || 0
      return priceB - priceA
    } else if (sortBy === 'Boyut: Büyükten Küçüğe') {
      return b.area - a.area
    }
    return 0
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gray-900 pt-32 pb-40 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/90 to-gray-900" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight">
              Hayalinizdeki <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                Yaşam Alanı
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
              Trabzon'un en seçkin gayrimenkul portföyü ile tanışın. 
              Modern, konforlu ve size özel seçenekler.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Search and Filters Container */}
      <section className="relative z-20 -mt-24 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8"
          >
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-3xl mx-auto">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="İlan başlığı, konum veya özellik ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-gray-50 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-shadow shadow-sm"
                />
              </div>
            </div>
            
            {/* Filters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">İlan Türü</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all cursor-pointer hover:bg-gray-100"
                >
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Kategori</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all cursor-pointer hover:bg-gray-100"
                >
                  {uniqueCategories.map((category: any) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Konum</label>
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all cursor-pointer hover:bg-gray-100"
                >
                  {uniqueLocations.map((location: any) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Sıralama</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all cursor-pointer hover:bg-gray-100"
                >
                  <option value="Yeni İlanlar">En Yeniler</option>
                  <option value="Fiyat: Artan">Fiyat (Artan)</option>
                  <option value="Fiyat: Azalan">Fiyat (Azalan)</option>
                  <option value="Boyut: Büyükten Küçüğe">Genişlik</option>
                </select>
              </div>
            </div>
            
            {/* Active Filters & Count */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-100 gap-4">
              <p className="text-gray-600 font-medium">
                Toplam <span className="text-yellow-600 font-bold text-lg">{filteredProperties.length}</span> ilan listeleniyor
              </p>
              
              {(searchTerm || filterType !== 'Tümü' || filterCategory !== 'Tümü' || filterLocation !== 'Tümü') && (
                <button 
                  onClick={() => {
                    setSearchTerm('')
                    setFilterType('Tümü')
                    setFilterCategory('Tümü')
                    setFilterLocation('Tümü')
                    setSortBy('Yeni İlanlar')
                  }}
                  className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtreleri Temizle
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Properties Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20">
               <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
               <p className="text-gray-500 animate-pulse">İlanlar Yükleniyor...</p>
             </div>
          ) : filteredProperties.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto"
            >
              <div className="bg-yellow-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Sonuç Bulunamadı</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-8">
                Arama kriterlerinize uygun ilan bulamadık. Lütfen filtreleri değiştirerek tekrar deneyin.
              </p>
              <button 
                onClick={() => {
                  setSearchTerm('')
                  setFilterType('Tümü')
                  setFilterCategory('Tümü')
                  setFilterLocation('Tümü')
                  setSortBy('Yeni İlanlar')
                }}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all"
              >
                Tüm İlanları Göster
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {filteredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <PropertyCard {...property} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Aradığınızı Bulamadınız mı?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Size özel gayrimenkul arayışınızda yardımcı olalım. 
              Hemen iletişime geçin!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                İletişime Geçin
              </a>
              <a
                href="tel:+904622300000"
                className="border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Hemen Arayın
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Yükleniyor...</div>}>
      <PropertiesContent />
    </Suspense>
  )
}