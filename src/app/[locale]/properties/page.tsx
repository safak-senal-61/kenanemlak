'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { Filter, SlidersHorizontal } from 'lucide-react'
import PropertyCard from '@/components/PropertyCard'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PropertyFilters from '@/components/PropertyFilters'
import { useTranslations } from 'next-intl'
import { Property, PropertyFilters as IPropertyFilters } from '@/types/property'
import { fetchWithCache } from '@/utils/apiCache'

function PropertiesContent() {
  const t = useTranslations('PropertiesPage')
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [filters, setFilters] = useState<IPropertyFilters>({})

  useEffect(() => {
    const type = searchParams.get('type')
    const location = searchParams.get('location')
    
    // Map URL params
    if (type) {
       if (type === 'Satılık' || type === 'sale') setFilters((prev) => ({ ...prev, type: 'Satılık' }))
       else if (type === 'Kiralık' || type === 'rent') setFilters((prev) => ({ ...prev, type: 'Kiralık' }))
    }
    
    if (location) {
      setSearchTerm(location)
      setFilters((prev) => ({ ...prev, locationSearch: location }))
    }
  }, [searchParams])


  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await fetchWithCache<Property[]>('/api/properties')
        if (data) {
          const activeProperties = (data as Property[]).filter((p) => p.isActive)
          setProperties(activeProperties)
        }
      } catch (error) {
        console.error('Error fetching properties:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  const filteredProperties = properties.filter(property => {
    // 1. Text Search (Location, Title)
    const matchesSearch = 
      (filters.locationSearch ? property.location.toLowerCase().includes(filters.locationSearch.toLowerCase()) : true) &&
      (searchTerm ? (
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase())
      ) : true)

    // 2. Category Hierarchy
    const matchesCategory = !filters.category || property.category === filters.category
    const matchesType = !filters.type || property.type === filters.type
    const matchesSubCategory = !filters.subCategory || property.subCategory === filters.subCategory

    // 3. Price Range
    const priceVal = parseInt(property.price.toString().replace(/[^0-9]/g, '') || '0')
    const matchesMinPrice = !filters.minPrice || priceVal >= parseInt(filters.minPrice)
    const matchesMaxPrice = !filters.maxPrice || priceVal <= parseInt(filters.maxPrice)

    // 4. Area Range
    const matchesMinArea = !filters.minArea || property.area >= parseInt(filters.minArea)
    const matchesMaxArea = !filters.maxArea || property.area <= parseInt(filters.maxArea)

    // 5. Room Count
    const matchesRooms = !filters.rooms || filters.rooms.length === 0 || filters.rooms.includes(property.rooms)

    // 6. Building Age
    const matchesAge = !filters.buildingAge || property.buildingAge === filters.buildingAge

    // 7. Boolean Features
    const matchesFeatures = 
      (!filters.inComplex || property.inComplex) &&
      (!filters.furnished || property.furnished) &&
      (!filters.balcony || property.balcony) &&
      (!filters.elevator || property.elevator) &&
      (!filters.credit || property.credit) && // Assuming credit field exists or will be added
      (!filters.swap || property.swap) // Assuming swap field exists or will be added

    return matchesSearch && matchesCategory && matchesType && matchesSubCategory &&
           matchesMinPrice && matchesMaxPrice &&
           matchesMinArea && matchesMaxArea &&
           matchesRooms && matchesAge && matchesFeatures
  })

  // Sorting
  filteredProperties.sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else if (sortBy === 'priceAsc') {
      const priceA = parseInt(a.price.toString().replace(/[^0-9]/g, '')) || 0
      const priceB = parseInt(b.price.toString().replace(/[^0-9]/g, '')) || 0
      return priceA - priceB
    } else if (sortBy === 'priceDesc') {
      const priceA = parseInt(a.price.toString().replace(/[^0-9]/g, '')) || 0
      const priceB = parseInt(b.price.toString().replace(/[^0-9]/g, '')) || 0
      return priceB - priceA
    } else if (sortBy === 'sizeDesc') {
      return b.area - a.area
    }
    return 0
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section - Smaller */}
      <section className="relative bg-gray-900 pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/90 to-gray-900" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            {t('title')}
          </motion.h1>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
             <PropertyFilters filters={filters} setFilters={setFilters} properties={properties} />
          </div>

          {/* Product Grid */}
          <div className="mt-6 lg:mt-0 lg:col-span-3">
             {/* Sort Bar */}
             <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-gray-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-primary-gold" />
                  {filteredProperties.length} ilan bulundu
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <SlidersHorizontal className="w-4 h-4" />
                    Sıralama:
                  </div>
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 sm:flex-none bg-gray-50 border-none rounded-lg px-4 py-2 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-primary-gold/50 cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <option value="newest">{t('sortOptions.newest')}</option>
                    <option value="priceAsc">{t('sortOptions.priceAsc')}</option>
                    <option value="priceDesc">{t('sortOptions.priceDesc')}</option>
                    <option value="sizeDesc">{t('sortOptions.size')}</option>
                  </select>
                </div>
             </div>
             
             {/* Grid */}
             {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-gold"></div>
                </div>
             ) : filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProperties.map((property, index) => (
                    <motion.div
                      key={property.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <PropertyCard 
                        {...property} 
                        type={property.type as "Satılık" | "Kiralık"}
                        category={property.category || ''}
                        price={property.price.toString()}
                        rooms={property.rooms.toString()}
                        bathrooms={Number(property.bathrooms)}
                      />
                    </motion.div>
                  ))}
                </div>
             ) : (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Sonuç Bulunamadı</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Aradığınız kriterlere uygun ilan bulunamadı. Lütfen filtreleri değiştirerek tekrar deneyin.
                  </p>
                  <button 
                    onClick={() => setFilters({})}
                    className="mt-6 px-6 py-2.5 bg-primary-gold text-white font-medium rounded-xl hover:bg-primary-gold-dark transition-colors shadow-lg shadow-primary-gold/20"
                  >
                    Filtreleri Temizle
                  </button>
                </div>
             )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">...</div>}>
      <PropertiesContent />
    </Suspense>
  )
}
