'use client'

import { motion } from 'framer-motion'
import { ChevronDown, Search, MapPin, Home, Star, Award, Shield } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HeroSection() {
  const router = useRouter()
  const [searchType, setSearchType] = useState('Tümü')
  const [searchLocation, setSearchLocation] = useState('')
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchType !== 'Tümü') {
      params.set('type', searchType)
    }
    if (searchLocation.trim()) {
      params.set('location', searchLocation.trim())
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
                Kenan Kadıoğlu
              </motion.span>
              <br />
              <span className="text-2xl md:text-4xl lg:text-5xl font-light text-off-white">
                Gayrimenkul Danışmanlığı
              </span>
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-off-white/90 max-w-3xl mx-auto leading-relaxed font-light"
              variants={itemVariants}
            >
              15 yıllık sektör tecrübesiyle Trabzon ve çevresinde güvenilir, şeffaf ve profesyonel 
              gayrimenkul danışmanlık hizmetleri sunuyoruz.
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
                <span>Yıllık Tecrübe</span>
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
                <span>Başarılı İşlem</span>
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
                <span>Müşteri Memnuniyeti</span>
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
                <span>Hayalinizdeki Evi Bulun</span>
              </motion.h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                >
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="w-full px-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:ring-2 focus:ring-primary-gold focus:border-transparent appearance-none backdrop-blur-sm transition-all duration-300 hover:bg-white/25"
                  >
                    <option value="Tümü" className="text-charcoal">Tüm İlanlar</option>
                    <option value="Satılık" className="text-charcoal">Satılık</option>
                    <option value="Kiralık" className="text-charcoal">Kiralık</option>
                  </select>
                </motion.div>
                
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                >
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-gold w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Konum, semt, ilçe..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:ring-2 focus:ring-primary-gold focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/25"
                  />
                </motion.div>
                
                <motion.button 
                  onClick={handleSearch}
                  className="group bg-gradient-to-r from-primary-gold to-primary-gold-dark hover:from-primary-gold-dark hover:to-primary-gold text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl transform hover:scale-105 relative overflow-hidden"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="relative z-10">Ara</span>
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
                  <span>Hızlı Arama</span>
                </span>
                <span className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full border border-primary-gold/20">
                  <MapPin className="w-4 h-4 text-primary-gold" />
                  <span>Trabzon&apos;un Her Bölgesi</span>
                </span>
                <span className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full border border-primary-gold/20">
                  <Star className="w-4 h-4 text-primary-gold" />
                  <span>Uygun Fiyatlar</span>
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
                <span>Tüm İlanları İnceleyin</span>
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
            className="text-primary-gold"
          >
            <ChevronDown className="w-8 h-8" />
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-primary-gold/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-accent-bronze/15 rounded-full blur-3xl"></div>
    </section>
  )
}