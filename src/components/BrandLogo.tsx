'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

interface BrandLogoProps {
  className?: string
  animated?: boolean
  lightMode?: boolean // If true, optimized for light background (dark text). If false/undefined, optimized for dark background (white text).
  src?: string
  imageSize?: number
}

export default function BrandLogo({ className = "", animated = false, lightMode = false, src = "/logo.jpeg", imageSize = 48 }: BrandLogoProps) {
  const pathname = usePathname()
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Icon */}
      <motion.div 
        key={`logo-icon-${pathname}`}
        className="relative flex items-center justify-center shrink-0"
        style={{ width: imageSize, height: imageSize }}
        initial={animated ? { scale: 0, rotate: -180 } : {}}
        animate={animated ? { scale: 1, rotate: 0 } : {}}
        transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
      >
        <Image
          src={src}
          alt="Kenan Kadıoğlu Logo"
          width={imageSize}
          height={imageSize}
          className="w-full h-full object-contain rounded-lg shadow-lg"
        />
      </motion.div>

      {/* Text */}
      <div className="flex flex-col">
        <motion.span 
          className={`text-lg md:text-xl font-bold leading-none tracking-wide ${lightMode ? 'text-gray-900' : 'text-white'}`}
          initial={animated ? { x: -20, opacity: 0 } : {}}
          animate={animated ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          KENAN KADIOĞLU
        </motion.span>
        <motion.span 
          className={`text-[0.6rem] md:text-xs font-semibold tracking-[0.2em] uppercase ${lightMode ? 'text-yellow-600' : 'text-yellow-400'}`}
          initial={animated ? { x: -20, opacity: 0 } : {}}
          animate={animated ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          GAYRİMENKUL
        </motion.span>
      </div>
    </div>
  )
}