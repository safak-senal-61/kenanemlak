'use client'

import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import PropertyCard from '@/components/PropertyCard'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import { Building, Users, Award, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { fetchWithCache } from '@/utils/apiCache'

interface Property {
  id: string
  title: string
  type: 'Satılık' | 'Kiralık'
  isActive: boolean
  featured: boolean
  location: string
  category: string
  price: string
  rooms: string
  bathrooms: number
  area: number
  image?: string
  photos?: { url: string }[]
  [key: string]: unknown
}

export default function Home() {
  const t = useTranslations('HomePage')
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([])
  const [stats, setStats] = useState([
    { icon: Building, label: 'activeListings', value: '0' },
    { icon: Users, label: 'happyCustomers', value: '500+' },
    { icon: Award, label: 'yearsExperience', value: '15+' },
    { icon: TrendingUp, label: 'successRate', value: '%98' },
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchWithCache<Property[]>('/api/properties')
        if (data) {
          // Show featured properties, or if none, show the latest 6 active properties
          const activeProperties = data.filter((p: Property) => p.isActive)
          const featured = activeProperties.filter((p: Property) => p.featured)
          const displayProps = featured.length > 0 ? featured : activeProperties.slice(0, 6)
          
          setFeaturedProperties(displayProps.map((p: Property) => ({
            ...p,
            image: p.photos?.[0]?.url,
            type: p.type as "Satılık" | "Kiralık"
          })))

          setStats(prev => prev.map(s => 
            s.label === 'activeListings' ? { ...s, value: activeProperties.length.toString() } : s
          ))
        }
      } catch (error) {
        console.error('Error fetching properties:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      
      {/* Featured Properties Section */}
      {!loading && featuredProperties.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {featuredProperties.some(p => p.featured) ? t('featuredTitle') : t('latestTitle')}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t('subtitle')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PropertyCard {...property} />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link
                href="/properties"
                className="inline-block bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {t('viewAll')}
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              {t('whyChooseUs')}
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {t('whyChooseUsSubtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-yellow-400 mb-2">{stat.value}</div>
                  <div className="text-gray-300">{t(`stats.${stat.label}`)}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                {t('aboutPreview.title')}
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {t('aboutPreview.description1')}
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {t('aboutPreview.description2')}
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700">{t('aboutPreview.features.trust')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700">{t('aboutPreview.features.professionalism')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700">{t('aboutPreview.features.pricing')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700">{t('aboutPreview.features.solutions')}</span>
                </div>
              </div>
              <Link
                href="/about"
                className="inline-block bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                {t('aboutPreview.moreButton')}
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[500px] bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{t('testimonials.title')}</h3>
                <div className="w-16 h-1 bg-yellow-500 mx-auto mt-2 rounded-full"></div>
              </div>
              
              <div className="relative h-[380px] overflow-hidden">
                <motion.div
                  animate={{
                    y: ["0%", "-50%"]
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="space-y-4"
                >
                  {[1, 2, 3, 4, 1, 2, 3, 4].map((id, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-2">
                         <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold">
                            {t(`testimonials.items.${id}.name`).charAt(0)}
                         </div>
                         <div>
                           <div className="font-semibold text-gray-900">{t(`testimonials.items.${id}.name`)}</div>
                           <div className="text-xs text-yellow-600 font-medium">{t(`testimonials.items.${id}.role`)}</div>
                         </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">&quot;{t(`testimonials.items.${id}.comment`)}&quot;</p>
                      <div className="flex text-yellow-400 mt-2 text-xs">
                        {'★'.repeat(5)}
                      </div>
                    </div>
                  ))}
                </motion.div>
                
                {/* Fade gradients */}
                <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-600 to-yellow-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              {t('ctaTitle')}
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {t('ctaDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-yellow-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                {t('ctaButtonContact')}
              </Link>
              <a
                href="tel:+904622300000"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-yellow-600 transition-colors"
              >
                {t('ctaButtonCall')}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

