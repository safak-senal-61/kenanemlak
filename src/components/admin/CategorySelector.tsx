'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Check } from 'lucide-react'
import { PROPERTY_CATEGORIES } from '@/constants/propertyData'

interface CategorySelectorProps {
  onSelect: (selection: { category: string, type: string, subCategory: string }) => void
  initialSelection?: { category: string, type: string, subCategory: string }
}

export default function CategorySelector({ onSelect, initialSelection }: CategorySelectorProps) {
  const [category, setCategory] = useState(initialSelection?.category || '')
  const [type, setType] = useState(initialSelection?.type || '')
  const [subCategory, setSubCategory] = useState(initialSelection?.subCategory || '')

  const handleCategorySelect = (cat: string) => {
    setCategory(cat)
    setType('')
    setSubCategory('')
  }

  const handleTypeSelect = (t: string) => {
    setType(t)
    setSubCategory('')
  }

  const handleSubCategorySelect = (sub: string) => {
    setSubCategory(sub)
  }

  const handleComplete = () => {
    if (category && type && subCategory) {
      onSelect({ category, type, subCategory })
    }
  }

  const categories = Object.keys(PROPERTY_CATEGORIES)
  const types = category ? Object.keys(PROPERTY_CATEGORIES[category] || {}) : []
  const subCategories = (category && type) ? (PROPERTY_CATEGORIES[category][type] || []) : []

  const isComplete = category && type && subCategory

  return (
    <div className="w-full bg-[#1A1A1A] border border-white/10 rounded-2xl p-3 md:p-6 shadow-2xl overflow-hidden">
      <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6 flex items-center gap-2">
        <span className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary-gold text-black flex items-center justify-center text-xs md:text-sm">1</span>
        Adım Adım Kategori Seç
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:h-[500px]">
        {/* Column 1: Main Category */}
        <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden flex flex-col min-h-[200px] md:min-h-0">
          <div className="p-3 bg-white/5 border-b border-white/5 font-semibold text-white/60 text-sm">
            Kategori
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-1 custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between group transition-all ${
                  category === cat 
                    ? 'bg-primary-gold text-black font-bold shadow-lg shadow-primary-gold/20' 
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>{cat}</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${category === cat ? 'rotate-90 md:rotate-0' : 'opacity-0 group-hover:opacity-50'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Column 2: Type (Satılık/Kiralık) */}
        <div className={`bg-white/5 rounded-xl border border-white/5 overflow-hidden flex flex-col min-h-[200px] md:min-h-0 transition-opacity duration-300 ${!category ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
          <div className="p-3 bg-white/5 border-b border-white/5 font-semibold text-white/60 text-sm">
            İşlem Tipi
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-1 custom-scrollbar">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => handleTypeSelect(t)}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between group transition-all ${
                  type === t 
                    ? 'bg-primary-gold text-black font-bold shadow-lg shadow-primary-gold/20' 
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>{t}</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${type === t ? 'rotate-90 md:rotate-0' : 'opacity-0 group-hover:opacity-50'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Column 3: SubCategory */}
        <div className={`bg-white/5 rounded-xl border border-white/5 overflow-hidden flex flex-col min-h-[200px] md:min-h-0 transition-opacity duration-300 ${!type ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
          <div className="p-3 bg-white/5 border-b border-white/5 font-semibold text-white/60 text-sm">
            Emlak Tipi
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-1 custom-scrollbar">
            {subCategories.map((sub) => (
              <button
                key={sub}
                onClick={() => handleSubCategorySelect(sub)}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between group transition-all ${
                  subCategory === sub 
                    ? 'bg-primary-gold text-black font-bold shadow-lg shadow-primary-gold/20' 
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>{sub}</span>
                {subCategory === sub && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>

        {/* Column 4: Confirmation */}
        <div className="bg-white/5 rounded-xl border border-white/5 p-6 flex flex-col items-center justify-center text-center min-h-[200px] md:min-h-0">
          <AnimatePresence mode="wait">
            {isComplete ? (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                  <Check className="w-10 h-10 text-white" strokeWidth={3} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Seçim Tamamlandı</h4>
                  <p className="text-white/60 text-sm">
                    {category} &gt; {type} &gt; {subCategory}
                  </p>
                </div>
                <button
                  onClick={handleComplete}
                  className="w-full bg-primary-gold hover:bg-primary-gold-dark text-black font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-primary-gold/20"
                >
                  Devam Et
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="incomplete"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white/20"
              >
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/20 mx-auto mb-4" />
                <p>Lütfen tüm adımları tamamlayın</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
