'use client'

import { motion } from 'framer-motion'
import { MapPin, Bed, Square, Heart, Eye, Bath, Maximize2, Home } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface PropertyCardProps {
  id: number
  title: string
  type: 'Satılık' | 'Kiralık'
  category: string
  price: string
  location: string
  area: number
  rooms: number
  bathrooms: number
  featured?: boolean
  views?: number
}

export default function PropertyCard({
  id,
  title,
  type,
  category,
  price,
  location,
  area,
  rooms,
  bathrooms,
  featured = false,
  views = 0
}: PropertyCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [imageHovered, setImageHovered] = useState(false)

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    },
    hover: {
      y: -12,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    }
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 group relative"
    >
      {/* Image Container */}
      <div 
        className="relative h-64 md:h-72 overflow-hidden"
        onMouseEnter={() => setImageHovered(true)}
        onMouseLeave={() => setImageHovered(false)}
      >
        {/* Gradient Background with Pattern */}
        <div className="w-full h-full bg-gradient-to-br from-cream via-off-white to-primary-gold-light relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/10 to-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="text-primary-gold/30 text-center"
              animate={{ scale: imageHovered ? 1.1 : 1 }}
            transition={{ duration: 0.3, ease: "easeOut" as const }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-primary-gold to-primary-gold-dark rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg">
                <Home className="w-10 h-10 text-white" />
              </div>
              <span className="text-charcoal/60 font-medium">Fotoğraf</span>
            </motion.div>
          </div>
          
          {/* Shimmer Effect */}
          <div className="absolute inset-0 animate-shimmer opacity-20"></div>
        </div>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 space-y-2 z-10">
          {featured && (
            <motion.span 
              className="bg-gradient-to-r from-primary-gold to-primary-gold-dark text-white px-4 py-2 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" as const, stiffness: 300 }}
            >
              <span>⭐</span>
              <span>Öne Çıkan</span>
            </motion.span>
          )}
          <motion.span 
            className={`px-4 py-2 rounded-full text-xs font-bold backdrop-blur-sm ${
              type === 'Satılık' 
                ? 'bg-green-500/90 text-white shadow-lg' 
                : 'bg-blue-500/90 text-white shadow-lg'
            }`}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1, ease: "easeOut" as const }}
          >
            {type}
          </motion.span>
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2 z-10">
          <motion.button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-3 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg ${
              isLiked 
                ? 'bg-red-500 text-white scale-110' 
                : 'bg-white/80 text-charcoal hover:bg-red-500 hover:text-white hover:scale-110'
            }`}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </motion.button>
        </div>
        
        {/* Hover Overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent flex items-end justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: imageHovered ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" as const }}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: imageHovered ? 0 : 20, opacity: imageHovered ? 1 : 0 }}
            transition={{ delay: 0.1, ease: "easeOut" as const }}
            className="w-full"
          >
            <Link
              href={`/properties/${id}`}
              className="bg-primary-gold hover:bg-primary-gold-dark text-white px-6 py-3 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 w-full text-center block transform hover:scale-105"
            >
              <div className="flex items-center justify-center space-x-2">
                <Maximize2 className="w-4 h-4" />
                <span>İncele</span>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        {/* Title and Location */}
        <div className="mb-6">
          <motion.h3 
            className="text-xl md:text-2xl font-bold text-charcoal mb-3 group-hover:text-primary-gold-dark transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {title}
          </motion.h3>
          <motion.div 
            className="flex items-center text-charcoal/70 text-sm md:text-base"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <MapPin className="w-4 h-4 md:w-5 md:h-5 mr-2 text-primary-gold" />
            <span className="font-medium">{location}</span>
          </motion.div>
        </div>

        {/* Features */}
        <motion.div 
          className="grid grid-cols-3 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-col items-center p-3 bg-cream rounded-xl hover:bg-primary-gold-light transition-colors duration-300">
            <Bed className="w-6 h-6 text-primary-gold mb-2" />
            <span className="text-sm font-bold text-charcoal">{rooms}</span>
            <span className="text-xs text-charcoal/70">Oda</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-cream rounded-xl hover:bg-primary-gold-light transition-colors duration-300">
            <Bath className="w-6 h-6 text-primary-gold mb-2" />
            <span className="text-sm font-bold text-charcoal">{bathrooms}</span>
            <span className="text-xs text-charcoal/70">Banyo</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-cream rounded-xl hover:bg-primary-gold-light transition-colors duration-300">
            <Square className="w-6 h-6 text-primary-gold mb-2" />
            <span className="text-sm font-bold text-charcoal">{area}</span>
            <span className="text-xs text-charcoal/70">m²</span>
          </div>
        </motion.div>

        {/* Category and Views */}
        <motion.div 
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span className="bg-primary-gold-light text-charcoal px-4 py-2 rounded-full text-xs md:text-sm font-bold">
            {category}
          </span>
          <div className="flex items-center text-charcoal/60 text-xs md:text-sm">
            <Eye className="w-4 h-4 md:w-5 md:h-5 mr-2 text-primary-gold" />
            <span className="font-medium">{views}</span>
          </div>
        </motion.div>

        {/* Price and CTA */}
        <motion.div 
          className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-2xl md:text-3xl font-bold text-charcoal">
            <span className="bg-gradient-to-r from-primary-gold to-primary-gold-dark bg-clip-text text-transparent">
              {price}
            </span>
          </div>
          <Link
            href={`/properties/${id}`}
            className="group bg-gradient-to-r from-primary-gold to-primary-gold-dark hover:from-primary-gold-dark hover:to-primary-gold text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 w-full md:w-auto text-center"
          >
            <span className="relative z-10">Detaylar</span>
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-xl"></div>
          </Link>
        </motion.div>
      </div>

      {/* Bottom Accent */}
      <div className="h-1 bg-gradient-to-r from-primary-gold to-primary-gold-dark"></div>
    </motion.div>
  )
}