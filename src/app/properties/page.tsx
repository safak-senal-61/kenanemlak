'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter } from 'lucide-react'
import PropertyCard from '@/components/PropertyCard'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const allProperties = [
  {
    id: 1,
    title: 'Deniz Manzaralı Lüks Daire',
    type: 'Satılık' as const,
    category: 'Konut',
    price: '1.250.000 TL',
    location: 'Ortahisar, Trabzon',
    area: 140,
    rooms: 3,
    bathrooms: 2,
    parking: true,
    image: '/api/placeholder/400/300',
    featured: true,
    views: 156
  },
  {
    id: 2,
    title: 'Merkezi Konumda Ofis',
    type: 'Kiralık' as const,
    category: 'Ticari',
    price: '8.500 TL',
    location: 'Meydan, Trabzon',
    area: 85,
    rooms: 2,
    bathrooms: 1,
    parking: false,
    image: '/api/placeholder/400/300',
    featured: false,
    views: 89
  },
  {
    id: 3,
    title: 'Bahçeli Müstakil Ev',
    type: 'Satılık' as const,
    category: 'Konut',
    price: '2.100.000 TL',
    location: 'Yomra, Trabzon',
    area: 220,
    rooms: 4,
    bathrooms: 3,
    parking: true,
    image: '/api/placeholder/400/300',
    featured: true,
    views: 234
  },
  {
    id: 4,
    title: 'Modern Site Dairesi',
    type: 'Satılık' as const,
    category: 'Konut',
    price: '950.000 TL',
    location: 'Akçaabat, Trabzon',
    area: 120,
    rooms: 3,
    bathrooms: 2,
    parking: true,
    image: '/api/placeholder/400/300',
    featured: false,
    views: 178
  },
  {
    id: 5,
    title: 'Sahil Kenarı Dükkan',
    type: 'Kiralık' as const,
    category: 'Ticari',
    price: '15.000 TL',
    location: 'Beşikdüzü, Trabzon',
    area: 60,
    rooms: 1,
    bathrooms: 1,
    parking: false,
    image: '/api/placeholder/400/300',
    featured: false,
    views: 67
  },
  {
    id: 6,
    title: 'Köşe Başı Arsa',
    type: 'Satılık' as const,
    category: 'Arsa',
    price: '850.000 TL',
    location: 'Arsin, Trabzon',
    area: 500,
    rooms: 0,
    bathrooms: 1,
    parking: false,
    image: '/api/placeholder/400/300',
    featured: false,
    views: 123
  }
]

export default function PropertiesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('Tümü')
  const [filterCategory, setFilterCategory] = useState('Tümü')
  const [filterLocation, setFilterLocation] = useState('Tümü')
  const [sortBy, setSortBy] = useState('Yeni İlanlar')

  const locations = ['Tümü', 'Ortahisar', 'Meydan', 'Yomra', 'Akçaabat', 'Beşikdüzü', 'Arsin']
  const categories = ['Tümü', 'Konut', 'Ticari', 'Arsa']
  const types = ['Tümü', 'Satılık', 'Kiralık']

  const filteredProperties = allProperties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'Tümü' || property.type === filterType
    const matchesCategory = filterCategory === 'Tümü' || property.category === filterCategory
    const matchesLocation = filterLocation === 'Tümü' || property.location.includes(filterLocation)
    
    return matchesSearch && matchesType && matchesCategory && matchesLocation
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                Tüm İlanlar
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Trabzon&apos;un en güncel ve kapsamlı gayrimenkul ilanlarını keşfedin
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-12 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="İlan başlığı veya konum ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İlan Türü
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konum
                </label>
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sırala
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="Yeni İlanlar">Yeni İlanlar</option>
                  <option value="Fiyat: Artan">Fiyat: Artan</option>
                  <option value="Fiyat: Azalan">Fiyat: Azalan</option>
                  <option value="Boyut: Büyükten Küçüğe">Boyut: Büyükten Küçüğe</option>
                </select>
              </div>
            </div>
            
            {/* Results Count */}
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                <span className="font-semibold">{filteredProperties.length}</span> ilan bulundu
              </p>
              <button className="flex items-center space-x-2 text-yellow-600 hover:text-yellow-700">
                <Filter className="w-4 h-4" />
                <span>Filtreleri Temizle</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProperties.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="bg-gray-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">İlan Bulunamadı</h3>
              <p className="text-gray-600">Arama kriterlerinize uygun ilan bulunamadı.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
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