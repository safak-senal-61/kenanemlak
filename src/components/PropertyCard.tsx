'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Bed, Square, Heart, Bath, ArrowRight, Home, ChevronLeft, ChevronRight, Building2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface PropertyCardProps {
  id: string
  title: string
  type: 'Satılık' | 'Kiralık'
  category: string
  subCategory?: string
  price: string
  location: string
  area: number
  rooms: string
  bathrooms: number
  featured?: boolean
  image?: string
  photos?: { url: string }[]
  createdAt?: string
}

export default function PropertyCard({
  id,
  title,
  type,
  category,
  subCategory,
  price,
  location,
  area,
  rooms,
  bathrooms,
  featured = false,
  image,
  photos = [],
  createdAt,
}: PropertyCardProps) {
  const t = useTranslations('PropertyCard')
  const tCats = useTranslations('categories')
  const [isLiked, setIsLiked] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Combine image prop and photos array
  const displayImages = photos && photos.length > 0 
    ? photos.map(p => p.url) 
    : (image ? [image] : [])

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length)
  }

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)
  }

  const isNew = createdAt && (new Date().getTime() - new Date(createdAt).getTime()) < (7 * 24 * 60 * 60 * 1000)

  return (
    <div 
      className="group h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 h-full border border-gray-100 hover:border-primary-gold/30 flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <Link href={`/properties/${id}`} className="block w-full h-full">
            {displayImages.length > 0 ? (
              <div className="w-full h-full relative">
                <AnimatePresence mode='wait'>
                  <motion.img 
                    key={currentImageIndex}
                    src={displayImages[currentImageIndex]} 
                    alt={title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                <Home className="w-12 h-12 text-gray-300" />
              </div>
            )}
          </Link>

          {/* Slider Controls */}
          {displayImages.length > 1 && isHovered && (
            <>
              <button 
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm transition-all z-20"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm transition-all z-20"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              {/* Dots */}
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                {displayImages.slice(0, 5).map((_, idx) => (
                  <div 
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {featured && (
              <span className="bg-primary-gold text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg shadow-primary-gold/20 flex items-center gap-1 uppercase tracking-wider">
                <span>★</span> {t('opportunity')}
              </span>
            )}
            {isNew && (
              <span className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg shadow-blue-500/20 uppercase tracking-wider">
                {t('new')}
              </span>
            )}
            <span className={`px-3 py-1 rounded-lg text-xs font-bold shadow-lg backdrop-blur-md uppercase tracking-wider ${
              type === 'Satılık' 
                ? 'bg-emerald-500/90 text-white shadow-emerald-500/20' 
                : 'bg-purple-500/90 text-white shadow-purple-500/20'
            }`}>
              {tCats(type)}
            </span>
          </div>

          {/* Like Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsLiked(!isLiked)
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white transition-all duration-300 group/btn z-10"
          >
            <Heart className={`w-4 h-4 transition-colors ${
              isLiked ? 'fill-red-500 text-red-500' : 'text-white group-hover/btn:text-red-500'
            }`} />
          </button>

          {/* Price Tag */}
          <div className="absolute bottom-3 left-3 right-3 z-10">
            <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl shadow-lg border border-white/50 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide block mb-0.5">{t('price')}</span>
                <span className="text-lg font-bold text-primary-gold-dark leading-none">
                  {price}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          {/* Category & Location */}
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-3">
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md border border-gray-200">
              {tCats(subCategory || category)}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <div className="flex items-center truncate text-gray-400">
              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/properties/${id}`} className="block mb-4 group-hover:text-primary-gold transition-colors duration-300">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 min-h-[3.5rem]">{title}</h3>
          </Link>

          {/* Features Grid */}
          <div className="grid grid-cols-3 gap-2 py-4 border-t border-gray-100 mt-auto">
            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-gray-50 group-hover:bg-primary-gold/5 transition-colors">
              <div className="flex items-center gap-1.5 mb-1">
                <Bed className="w-4 h-4 text-gray-400 group-hover:text-primary-gold transition-colors" />
                <span className="text-sm font-bold text-gray-900">{rooms}</span>
              </div>
              <span className="text-[10px] text-gray-500 font-medium">{t('room')}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-gray-50 group-hover:bg-primary-gold/5 transition-colors">
              <div className="flex items-center gap-1.5 mb-1">
                <Bath className="w-4 h-4 text-gray-400 group-hover:text-primary-gold transition-colors" />
                <span className="text-sm font-bold text-gray-900">{bathrooms}</span>
              </div>
              <span className="text-[10px] text-gray-500 font-medium">{t('bathroom')}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-gray-50 group-hover:bg-primary-gold/5 transition-colors">
              <div className="flex items-center gap-1.5 mb-1">
                <Square className="w-4 h-4 text-gray-400 group-hover:text-primary-gold transition-colors" />
                <span className="text-sm font-bold text-gray-900">{area}</span>
              </div>
              <span className="text-[10px] text-gray-500 font-medium">{t('size')}</span>
            </div>
          </div>

          {/* Agent Footer */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                <Building2 className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-medium uppercase">{t('owner')}</span>
                <span className="text-xs font-bold text-gray-900">Kenan Emlak</span>
              </div>
            </div>
            
            <Link 
              href={`/properties/${id}`}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-gold/10 text-primary-gold hover:bg-primary-gold hover:text-white transition-all group/link"
            >
              <ArrowRight className="w-4 h-4 transform group-hover/link:-rotate-45 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
