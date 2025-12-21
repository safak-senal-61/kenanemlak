'use client'

import { motion } from 'framer-motion'
import { ChevronDown, Search, MapPin, Home, Star, Award, Shield } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/routing'
import { fetchWithCache } from '@/utils/apiCache'

interface Property {
  id: string
  title: string
  isActive: boolean
  location: string
  category: string
  [key: string]: unknown
}

export default function HeroSection() {
  const t = useTranslations('Hero')
  const router = useRouter()
  const [searchType, setSearchType] = useState('all')
  const [searchLocation, setSearchLocation] = useState('')
  const [searchCategory, setSearchCategory] = useState('all')
  const [scrollY, setScrollY] = useState(0)
  const [availableLocations, setAvailableLocations] = useState<string[]>([])
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [isLocationOpen, setIsLocationOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    
    // Fetch available filters from properties
    const fetchFilters = async () => {
      try {
        const data = await fetchWithCache<Property[]>('/api/properties')
        if (data) {
          const active = data.filter((p: Property) => p.isActive)
          // Extract unique locations (simple distinct)
          const locations = Array.from(new Set(active.map((p: Property) => p.location))).filter(Boolean) as string[]
          // Extract unique categories
          const categories = Array.from(new Set(active.map((p: Property) => p.category))).filter(Boolean) as string[]
          
          setAvailableLocations(locations)
          setAvailableCategories(categories)
        }
      } catch (e) {
        console.error('Error fetching filters:', e)
      }
    }
    fetchFilters()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchType !== 'all') {
      params.set('type', searchType)
    }
    if (searchLocation.trim()) {
      params.set('location', searchLocation.trim())
    }
    if (searchCategory !== 'all') {
      params.set('category', searchCategory)
    }
    
    router.push(`/properties?${params.toString()}`)
  }

  const heroVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12
      }
    }
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-charcoal via-charcoal-light to-primary-gold-dark overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <motion.div 
          className="absolute inset-0"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-gold/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-bronze/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent-silver/10 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-10 text-primary-gold/30"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" as const }}
      >
        <Home className="w-16 h-16" />
      </motion.div>
      
      <motion.div
        className="absolute bottom-32 right-16 text-primary-gold/20"
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -15, 0]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" as const }}
      >
        <Star className="w-20 h-20" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-32 pb-20">
        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Main Heading */}
          <motion.div variants={itemVariants} className="mb-8">
            <motion.h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              <motion.span 
                className="bg-gradient-to-r from-primary-gold via-primary-gold-light to-primary-gold-dark bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {t('mainTitle1')}
              </motion.span>
              <br />
              <span className="text-2xl md:text-4xl lg:text-5xl font-light text-off-white">
                {t('mainTitle2')}
              </span>
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-off-white/90 max-w-3xl mx-auto leading-relaxed font-light"
              variants={itemVariants}
            >
              {t('description')}
            </motion.p>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 mb-12 text-white"
          >
            <motion.div 
              className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-primary-gold/20 hover:border-primary-gold/40 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <motion.div 
                className="text-3xl md:text-4xl font-bold text-primary-gold mb-2"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                15+
              </motion.div>
              <div className="text-sm md:text-base text-off-white/80 flex items-center justify-center space-x-2">
                <Award className="w-4 h-4" />
                <span>{t('stats.experience')}</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-primary-gold/20 hover:border-primary-gold/40 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <motion.div 
                className="text-3xl md:text-4xl font-bold text-primary-gold mb-2"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              >
                500+
              </motion.div>
              <div className="text-sm md:text-base text-off-white/80 flex items-center justify-center space-x-2">
                <Home className="w-4 h-4" />
                <span>{t('stats.successfulTransactions')}</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-primary-gold/20 hover:border-primary-gold/40 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <motion.div 
                className="text-3xl md:text-4xl font-bold text-primary-gold mb-2"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              >
                100%
              </motion.div>
              <div className="text-sm md:text-base text-off-white/80 flex items-center justify-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>{t('stats.customerSatisfaction')}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Search Form */}
          <motion.div
            variants={itemVariants}
            className="max-w-4xl mx-auto mb-16 px-4"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-primary-gold/30 shadow-2xl">
              <motion.h3 
                className="text-xl md:text-2xl font-semibold text-white mb-6 flex items-center justify-center space-x-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Search className="w-6 h-6 text-primary-gold" />
                <span>{t('search.title')}</span>
              </motion.h3>
              
              {/* Search Tabs */}
              <div className="flex justify-center mb-8">
                <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-2xl flex gap-1 border border-white/10">
                  {['all', 'sale', 'rent'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSearchType(type)}
                      className={`px-6 py-2.5 rounded-xl transition-all duration-300 text-sm md:text-base font-medium ${
                        searchType === type 
                          ? 'bg-primary-gold text-black shadow-lg scale-105' 
                          : 'text-white hover:bg-white/10'
                      }`}
                    >
                      {t(`search.type.${type}`)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
                {/* Location Input with Autocomplete */}
                <motion.div 
                  className="relative md:col-span-5 z-50"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                >
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-gold w-5 h-5 z-10" />
                  <input
                    type="text"
                    placeholder={t('search.placeholder')}
                    value={searchLocation}
                    onChange={(e) => {
                      setSearchLocation(e.target.value)
                      setIsLocationOpen(true)
                    }}
                    onFocus={() => setIsLocationOpen(true)}
                    onBlur={() => setTimeout(() => setIsLocationOpen(false), 200)}
                    className="w-full pl-12 pr-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:ring-2 focus:ring-primary-gold focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/25"
                  />
                  
                  {/* Autocomplete Dropdown */}
                  {isLocationOpen && availableLocations.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden shadow-2xl max-h-60 overflow-y-auto z-50">
                      {availableLocations
                        .filter(loc => loc.toLowerCase().includes(searchLocation.toLowerCase()))
                        .map((loc, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSearchLocation(loc)
                              setIsLocationOpen(false)
                            }}
                            className="w-full text-left px-4 py-3 text-white/80 hover:bg-white/10 hover:text-primary-gold transition-colors border-b border-white/5 last:border-0 flex items-center gap-2"
                          >
                            <MapPin size={14} className="opacity-50" />
                            {loc}
                          </button>
                        ))}
                    </div>
                  )}
                </motion.div>
                
                {/* Category Dropdown */}
                <motion.div 
                  className="relative md:col-span-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                >
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
                    <Home className="text-primary-gold w-5 h-5" />
                  </div>
                  <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="w-full pl-12 pr-10 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:ring-2 focus:ring-primary-gold focus:border-transparent appearance-none backdrop-blur-sm transition-all duration-300 hover:bg-white/25 [&>option]:text-black cursor-pointer"
                  >
                    <option value="all" className="bg-white text-black">Tüm Kategoriler</option>
                    {availableCategories.map((cat, index) => (
                      <option key={index} value={cat} className="bg-white text-black">{cat}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="text-white/50 w-4 h-4" />
                  </div>
                </motion.div>
                
                {/* Search Button */}
                <motion.button 
                  onClick={handleSearch}
                  className="md:col-span-3 group bg-gradient-to-r from-primary-gold to-primary-gold-dark hover:from-primary-gold-dark hover:to-primary-gold text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl transform hover:scale-105 relative overflow-hidden"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="relative z-10">{t('search.button')}</span>
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </motion.button>
              </div>
              
              <motion.div 
                className="flex flex-wrap justify-center gap-4 text-sm text-off-white/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                <span className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full border border-primary-gold/20">
                  <Search className="w-4 h-4 text-primary-gold" />
                  <span>{t('badges.fastSearch')}</span>
                </span>
                <span className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full border border-primary-gold/20">
                  <MapPin className="w-4 h-4 text-primary-gold" />
                  <span>{t('badges.allRegions')}</span>
                </span>
                <span className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full border border-primary-gold/20">
                  <Star className="w-4 h-4 text-primary-gold" />
                  <span>{t('badges.affordablePrices')}</span>
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            variants={itemVariants}
            className="mb-12"
          >
            <motion.button 
              className="group bg-gradient-to-r from-primary-gold to-primary-gold-dark hover:from-primary-gold-dark hover:to-primary-gold text-white px-8 md:px-12 py-4 md:py-5 rounded-2xl text-lg md:text-xl font-bold transition-all duration-300 shadow-2xl hover:shadow-2xl transform hover:scale-105 relative overflow-hidden"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>{t('cta')}</span>
                <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-2xl"></div>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-8 h-8 text-white/50" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
