'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Plus, Building, MapPin, Calendar, Eye, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'

const projects = [
  {
    id: 1,
    title: 'Vadi Trabzon Konakları',
    developer: 'Özdemir İnşaat',
    status: 'Devam Ediyor',
    location: 'Yomra, Trabzon',
    deliveryDate: 'Haziran 2025',
    totalUnits: 120,
    availableUnits: 45,
    createdAt: '2024-11-15',
  },
  {
    id: 2,
    title: 'Mavi Şehir Residence',
    developer: 'Yıldız Yapı',
    status: 'Plan Aşamasında',
    location: 'Akçaabat, Trabzon',
    deliveryDate: 'Aralık 2026',
    totalUnits: 250,
    availableUnits: 200,
    createdAt: '2024-12-05',
  },
  {
    id: 3,
    title: 'Bozoğlu Plaza',
    developer: 'Bozoğlu Group',
    status: 'Tamamlandı',
    location: 'Ortahisar, Trabzon',
    deliveryDate: 'Teslim Edildi',
    totalUnits: 40,
    availableUnits: 2,
    createdAt: '2024-10-20',
  },
]

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('Tümü')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Konut Projeleri</h1>
          <p className="text-gray-600">Devam eden ve tamamlanan projeleri yönetin</p>
        </div>
        <Link
          href="/admin/projects/add"
          className="mt-4 sm:mt-0 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Yeni Proje Ekle</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Proje ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="Tümü">Tüm Durumlar</option>
            <option value="Plan Aşamasında">Plan Aşamasında</option>
            <option value="Devam Ediyor">Devam Ediyor</option>
            <option value="Tamamlandı">Tamamlandı</option>
          </select>
          
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors">
            <Filter className="w-5 h-5" />
            <span>Filtrele</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="flex">
              {/* Project Image Placeholder */}
              <div className="w-32 bg-gray-200 flex-shrink-0 flex items-center justify-center">
                <Building className="w-12 h-12 text-gray-400" />
              </div>
              
              {/* Project Details */}
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{project.title}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {project.location}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full border ${
                    project.status === 'Devam Ediyor' 
                      ? 'bg-blue-50 text-blue-600 border-blue-200' 
                      : project.status === 'Tamamlandı'
                      ? 'bg-green-50 text-green-600 border-green-200'
                      : 'bg-yellow-50 text-yellow-600 border-yellow-200'
                  }`}>
                    {project.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="text-sm text-gray-600 flex items-center justify-between">
                     <span className="font-medium text-gray-900">{project.developer}</span>
                     <span className="flex items-center gap-1 text-xs">
                        <Calendar className="w-3 h-3" />
                        {project.deliveryDate}
                     </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 bg-gray-50 p-2 rounded-lg">
                    <div className="flex-1 text-center border-r border-gray-200">
                        <div className="text-xs">Toplam</div>
                        <div className="font-bold text-gray-900">{project.totalUnits}</div>
                    </div>
                    <div className="flex-1 text-center">
                        <div className="text-xs">Müsait</div>
                        <div className="font-bold text-green-600">{project.availableUnits}</div>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center justify-end border-t pt-3 mt-2">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/projects/${project.id}`}
                      className="text-gray-600 hover:text-gray-800 p-2"
                      title="Görüntüle"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
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
    </div>
  )
}
