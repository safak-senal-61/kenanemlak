'use client'

import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import PropertyCard from '@/components/PropertyCard'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import { Building, Users, Award, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Home() {
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([])
  const [stats, setStats] = useState([
    { icon: Building, label: 'Aktif İlan', value: '0' },
    { icon: Users, label: 'Mutlu Müşteri', value: '500+' },
    { icon: Award, label: 'Yıllık Tecrübe', value: '15+' },
    { icon: TrendingUp, label: 'Başarı Oranı', value: '%98' },
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/properties')
        if (res.ok) {
          const data = await res.json()
          // Show featured properties, or if none, show the latest 6 active properties
          const activeProperties = data.filter((p: any) => p.isActive)
          const featured = activeProperties.filter((p: any) => p.featured)
          const displayProps = featured.length > 0 ? featured : activeProperties.slice(0, 6)
          
          setFeaturedProperties(displayProps.map((p: any) => ({
            ...p,
            image: p.photos?.[0]?.url
          })))

          setStats(prev => prev.map(s => 
            s.label === 'Aktif İlan' ? { ...s, value: activeProperties.length.toString() } : s
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
                {featuredProperties.some(p => p.featured) ? 'Öne Çıkan İlanlar' : 'Son Eklenen İlanlar'}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Trabzon&apos;un en güzel ve değerli gayrimenkullerini keşfedin
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
              <a
                href="/properties"
                className="inline-block bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Tüm İlanları Görüntüle
              </a>
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
              Neden Bizi Tercih Etmelisiniz?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              15 yıllık deneyimimiz ve güçlü referanslarımızla hizmetinizdeyiz
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
                  <div className="text-gray-300">{stat.label}</div>
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
                Trabzon&apos;un Güvenilir Emlak Danışmanı
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                15 yıllık sektör tecrübesiyle Trabzon ve çevresinde güvenilir, şeffaf ve profesyonel 
                hizmet sunan bir gayrimenkul danışmanlık şirketiyiz.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Kurulduğumuz günden bu yana; doğru yatırım, doğru değerleme ve doğru iletişim 
                prensipleriyle, müşterilerimizin ihtiyaçlarına en uygun çözümleri üretiyoruz.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700">Güven ve Şeffaflık</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700">Profesyonellik</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700">Doğru Fiyatlandırma ve Piyasa Analizi</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700">Hızlı ve Etkin Çözüm Üretme</span>
                </div>
              </div>
              <a
                href="/about"
                className="inline-block bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                Hakkımızda Daha Fazla
              </a>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 w-full h-80 rounded-2xl flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building className="w-12 h-12" />
                  </div>
                  <p className="text-lg font-semibold">Ofis Görseli</p>
                  <p className="text-sm opacity-90">Trabzon / Türkiye</p>
                </div>
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
              Hayalinizdeki Eve Ulaşın
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Profesyonel ekibimizle birlikte, size en uygun gayrimenkulü bulmak için 
              çalışalım. Hemen iletişime geçin!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-yellow-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                İletişime Geçin
              </a>
              <a
                href="tel:+904622300000"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-yellow-600 transition-colors"
              >
                Hemen Arayın
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
