'use client'

import { motion } from 'framer-motion'
import { MapPin, Bed, Square, Heart, Eye, Bath, ArrowRight, Home } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface PropertyCardProps {
  id: string
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
  image?: string
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
  views = 0,
  image
}: PropertyCardProps) {
  const [isLiked, setIsLiked] = useState(false)

  return (
    <div className="group h-full">
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full border border-gray-100 hover:border-primary-gold/30 flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Link href={`/properties/${id}`} className="block w-full h-full">
            {image ? (
              <div className="w-full h-full relative">
                <img 
                  src={image} 
                  alt={title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
              </div>
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center relative overflow-hidden">
                <Home className="w-12 h-12 text-gray-300" />
              </div>
            )}
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {featured && (
              <span className="bg-primary-gold text-white px-3 py-1 rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1">
                <span>⭐</span> Öne Çıkan
              </span>
            )}
            <span className={`px-3 py-1 rounded-lg text-xs font-semibold shadow-sm backdrop-blur-md ${
              type === 'Satılık' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-blue-500 text-white'
            }`}>
              {type}
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
            <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-white/50 flex items-center justify-between">
              <span className="text-lg font-bold text-primary-gold-dark">
                {price}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          {/* Category & Location */}
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2">
            <span className="bg-primary-gold/10 text-primary-gold-dark px-2 py-1 rounded-md">{category}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <div className="flex items-center truncate">
              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/properties/${id}`} className="block mb-4 group-hover:text-primary-gold transition-colors duration-300">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{title}</h3>
          </Link>

          {/* Features Grid */}
          <div className="grid grid-cols-3 gap-2 py-3 border-t border-gray-100 mt-auto">
            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-gray-50 group-hover:bg-primary-gold/5 transition-colors">
              <div className="flex items-center gap-1 mb-1">
                <Bed className="w-4 h-4 text-gray-400 group-hover:text-primary-gold transition-colors" />
                <span className="text-sm font-bold text-gray-900">{rooms}</span>
              </div>
              <span className="text-[10px] text-gray-500">Oda</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-gray-50 group-hover:bg-primary-gold/5 transition-colors">
              <div className="flex items-center gap-1 mb-1">
                <Bath className="w-4 h-4 text-gray-400 group-hover:text-primary-gold transition-colors" />
                <span className="text-sm font-bold text-gray-900">{bathrooms}</span>
              </div>
              <span className="text-[10px] text-gray-500">Banyo</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-gray-50 group-hover:bg-primary-gold/5 transition-colors">
              <div className="flex items-center gap-1 mb-1">
                <Square className="w-4 h-4 text-gray-400 group-hover:text-primary-gold transition-colors" />
                <span className="text-sm font-bold text-gray-900">{area}</span>
              </div>
              <span className="text-[10px] text-gray-500">m²</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center text-gray-400 text-xs">
              <Eye className="w-3 h-3 mr-1" />
              {views} görüntülenme
            </div>
            <Link 
              href={`/properties/${id}`}
              className="flex items-center text-sm font-semibold text-primary-gold hover:text-primary-gold-dark transition-colors gap-1 group/link"
            >
              İncele
              <ArrowRight className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
