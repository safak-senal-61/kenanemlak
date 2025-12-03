'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Building, Search, Filter, Edit, Trash2, Eye, Plus } from 'lucide-react'
import Link from 'next/link'

const properties = [
  {
    id: 1,
    title: 'Deniz Manzaralı Lüks Daire',
    type: 'Satılık',
    category: 'Konut',
    price: '1.250.000 TL',
    location: 'Ortahisar, Trabzon',
    status: 'Aktif',
    views: 156,
    createdAt: '2024-12-01',
    image: '/api/placeholder/100/75'
  },
  {
    id: 2,
    title: 'Merkezi Konumda Ofis',
    type: 'Kiralık',
    category: 'Ticari',
    price: '8.500 TL',
    location: 'Meydan, Trabzon',
    status: 'Aktif',
    views: 89,
    createdAt: '2024-11-30',
    image: '/api/placeholder/100/75'
  },
  {
    id: 3,
    title: 'Bahçeli Müstakil Ev',
    type: 'Satılık',
    category: 'Konut',
    price: '2.100.000 TL',
    location: 'Yomra, Trabzon',
    status: 'Aktif',
    views: 234,
    createdAt: '2024-11-28',
    image: '/api/placeholder/100/75'
  },
  {
    id: 4,
    title: 'Yatırımlık Arsa',
    type: 'Satılık',
    category: 'Arsa',
    price: '850.000 TL',
    location: 'Akçaabat, Trabzon',
    status: 'Aktif',
    views: 67,
    createdAt: '2024-11-25',
    image: '/api/placeholder/100/75'
  },
]

export default function PropertiesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('Tümü')
  const [filterStatus, setFilterStatus] = useState('Tümü')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Emlak İlanları</h1>
          <p className="text-gray-600">Tüm gayrimenkul ilanlarınızı yönetin</p>
        </div>
        <Link
          href="/admin/properties/add"
          className="mt-4 sm:mt-0 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Yeni İlan Ekle</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="İlan ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="Tümü">Tüm Türler</option>
            <option value="Satılık">Satılık</option>
            <option value="Kiralık">Kiralık</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="Tümü">Tüm Durumlar</option>
            <option value="Aktif">Aktif</option>
            <option value="Pasif">Pasif</option>
            <option value="Satıldı">Satıldı</option>
            <option value="Kiralandı">Kiralandı</option>
          </select>
          
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors">
            <Filter className="w-5 h-5" />
            <span>Filtrele</span>
          </button>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {properties.map((property, index) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="flex">
              {/* Property Image */}
              <div className="w-32 h-32 bg-gray-200 flex-shrink-0 flex items-center justify-center">
                <Building className="w-12 h-12 text-gray-400" />
              </div>
              
              {/* Property Details */}
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{property.title}</h3>
                    <p className="text-sm text-gray-600">{property.location}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    property.type === 'Satılık' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {property.type}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">{property.price}</span>
                    <span className="text-sm text-gray-500">{property.category}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{property.views} görüntülenme</span>
                    </span>
                    <span>{property.createdAt}</span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    {property.status}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/properties/${property.id}`}
                      className="text-gray-600 hover:text-gray-800 p-2"
                      title="Görüntüle"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/properties/${property.id}/edit`}
                      className="text-yellow-600 hover:text-yellow-700 p-2"
                      title="Düzenle"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      className="text-red-600 hover:text-red-700 p-2"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          1-4 / 4 ilan gösteriliyor
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>
            Önceki
          </button>
          <button className="px-3 py-2 bg-yellow-600 text-white rounded-lg">
            1
          </button>
          <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>
            Sonraki
          </button>
        </div>
      </div>
    </div>
  )
}