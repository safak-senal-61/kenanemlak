'use client'

import { useState } from 'react'
import { MapPin, Filter, X, ChevronDown, Check } from 'lucide-react'
import { PROPERTY_CATEGORIES } from '@/constants/propertyData'
import { Property, PropertyFilters as IPropertyFilters } from '@/types/property'
import { useTranslations } from 'next-intl'

interface PropertyFiltersProps {
  filters: IPropertyFilters
  setFilters: React.Dispatch<React.SetStateAction<IPropertyFilters>>
  properties?: Property[]
}

export default function PropertyFilters({ filters, setFilters }: PropertyFiltersProps) {
  const t = useTranslations('PropertyFilters')
  const tCats = useTranslations('categories')
  const [isOpen, setIsOpen] = useState(false) // Mobile toggle

  // Extract unique locations from properties for "İl, İlçe, Mahalle" simulation
  // In a real app, this would come from a database or API
  // const locations = Array.from(new Set(properties.map(p => p.location))).filter(Boolean)

  const handleInputChange = (name: string, value: string | number | boolean) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const toggleArrayFilter = (name: string, value: string) => {
    setFilters((prev) => {
      const current = prev[name]
      const currentArray = Array.isArray(current) ? current : []
      const updated = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value]
      return { ...prev, [name]: updated }
    })
  }

  // Cascading Logic
  const categoryOptions = Object.keys(PROPERTY_CATEGORIES)
  const typeOptions = filters.category ? Object.keys(PROPERTY_CATEGORIES[filters.category as keyof typeof PROPERTY_CATEGORIES] || {}) : []
  const subCategoryOptions = (filters.category && filters.type) 
    ? (PROPERTY_CATEGORIES[filters.category as keyof typeof PROPERTY_CATEGORIES]?.[filters.type as string] || []) 
    : []

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-primary-gold text-black px-6 py-3 rounded-full shadow-lg font-bold flex items-center gap-2"
      >
        <Filter className="w-5 h-5" />
        {t('filterBtn')}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto
        lg:translate-x-0 lg:static lg:h-auto lg:shadow-none lg:bg-transparent lg:w-full lg:block
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 space-y-8">
          <div className="flex items-center justify-between lg:hidden mb-6">
            <h2 className="text-xl font-bold text-gray-900">{t('filtersTitle')}</h2>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Location Search */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{t('location')}</h3>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder={t('locationPlaceholder')} 
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-gold/50 focus:border-primary-gold outline-none transition-all text-sm"
                value={filters.locationSearch || ''}
                onChange={(e) => handleInputChange('locationSearch', e.target.value)}
              />
            </div>
          </div>

          {/* Category Hierarchy */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{t('category')}</h3>
            
            <div className="space-y-3">
              {/* Main Category */}
              <div className="relative">
                <select
                  value={filters.category || ''}
                  onChange={(e) => {
                    handleInputChange('category', e.target.value)
                    handleInputChange('type', '')
                    handleInputChange('subCategory', '')
                  }}
                  className="w-full appearance-none pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-gold/50 focus:border-primary-gold outline-none text-sm cursor-pointer"
                >
                  <option value="">{t('allCategories')}</option>
                  {categoryOptions.map(opt => <option key={opt} value={opt}>{tCats(opt)}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Type */}
              <div className="relative">
                <select
                  value={filters.type || ''}
                  onChange={(e) => {
                    handleInputChange('type', e.target.value)
                    handleInputChange('subCategory', '')
                  }}
                  disabled={!filters.category}
                  className="w-full appearance-none pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-gold/50 focus:border-primary-gold outline-none text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">{t('selectType')}</option>
                  {typeOptions.map(opt => <option key={opt} value={opt}>{tCats(opt)}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Sub Category */}
              <div className="relative">
                <select
                  value={filters.subCategory || ''}
                  onChange={(e) => handleInputChange('subCategory', e.target.value)}
                  disabled={!filters.type}
                  className="w-full appearance-none pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-gold/50 focus:border-primary-gold outline-none text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">{t('selectSubType')}</option>
                  {subCategoryOptions.map(opt => <option key={opt} value={opt}>{tCats(opt)}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{t('priceRange')}</h3>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input 
                  type="number" 
                  placeholder={t('min')} 
                  className="w-full pl-3 pr-2 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-primary-gold outline-none"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleInputChange('minPrice', e.target.value)}
                />
              </div>
              <div className="relative flex-1">
                <input 
                  type="number" 
                  placeholder={t('max')} 
                  className="w-full pl-3 pr-2 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-primary-gold outline-none"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Area Range */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{t('area')}</h3>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input 
                  type="number" 
                  placeholder={t('min')} 
                  className="w-full pl-3 pr-2 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-primary-gold outline-none"
                  value={filters.minArea || ''}
                  onChange={(e) => handleInputChange('minArea', e.target.value)}
                />
              </div>
              <div className="relative flex-1">
                <input 
                  type="number" 
                  placeholder={t('max')} 
                  className="w-full pl-3 pr-2 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-primary-gold outline-none"
                  value={filters.maxArea || ''}
                  onChange={(e) => handleInputChange('maxArea', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Room Count */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{t('rooms')}</h3>
            <div className="grid grid-cols-2 gap-2">
              {["1+0", "1+1", "2+1", "3+1", "4+1", "5+1", "5+2"].map((room) => (
                <label key={room} className="flex items-center gap-2 cursor-pointer group">
                  <div className={`
                    w-5 h-5 rounded border flex items-center justify-center transition-all
                    ${(filters.rooms || []).includes(room) ? 'bg-primary-gold border-primary-gold text-white' : 'border-gray-300 group-hover:border-primary-gold'}
                  `}>
                    {(filters.rooms || []).includes(room) && <Check className="w-3 h-3" />}
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={(filters.rooms || []).includes(room)}
                    onChange={() => toggleArrayFilter('rooms', room)}
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900">{room}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Building Age */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{t('buildingAge')}</h3>
            <div className="space-y-2">
              {["0 (Yeni)", "1-5", "6-10", "11-15", "16-20", "21+"].map((age) => (
                <label key={age} className="flex items-center gap-2 cursor-pointer group">
                  <div className={`
                    w-4 h-4 rounded-full border flex items-center justify-center transition-all
                    ${filters.buildingAge === age ? 'border-primary-gold' : 'border-gray-300 group-hover:border-primary-gold'}
                  `}>
                    {filters.buildingAge === age && <div className="w-2 h-2 rounded-full bg-primary-gold" />}
                  </div>
                  <input 
                    type="radio" 
                    name="buildingAge"
                    className="hidden" 
                    checked={filters.buildingAge === age}
                    onChange={() => handleInputChange('buildingAge', filters.buildingAge === age ? '' : age)}
                    onClick={(e) => {
                        if(filters.buildingAge === age) {
                            handleInputChange('buildingAge', '');
                            e.currentTarget.checked = false;
                        }
                    }}
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900">{age}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            {[
              { label: t('features.credit'), key: 'credit' },
              { label: t('features.inComplex'), key: 'inComplex' },
              { label: t('features.swap'), key: 'swap' },
              { label: t('features.furnished'), key: 'furnished' },
              { label: t('features.balcony'), key: 'balcony' },
              { label: t('features.elevator'), key: 'elevator' },
            ].map((toggle) => (
              <label key={toggle.key} className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm font-medium text-gray-700">{toggle.label}</span>
                <div className={`
                  w-10 h-6 rounded-full p-1 transition-colors duration-300
                  ${filters[toggle.key] ? 'bg-primary-gold' : 'bg-gray-200'}
                `}>
                  <div className={`
                    w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300
                    ${filters[toggle.key] ? 'translate-x-4' : 'translate-x-0'}
                  `} />
                </div>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={!!filters[toggle.key]}
                  onChange={(e) => handleInputChange(toggle.key, e.target.checked)}
                />
              </label>
            ))}
          </div>

          <button 
            onClick={() => setFilters({})}
            className="w-full py-3 text-sm font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
          >
            {t('clearFilters')}
          </button>
        </div>
      </div>
    </>
  )
}
