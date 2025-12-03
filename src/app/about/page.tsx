'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import { Shield, Users, TrendingUp, Award, Phone, Mail, MapPin } from 'lucide-react'

const values = [
  {
    icon: Shield,
    title: 'Güven ve Şeffaflık',
    description: 'Tüm işlemlerimizde şeffaflık ve güven ilkelerinden ödün vermeyiz.'
  },
  {
    icon: Users,
    title: 'Profesyonellik',
    description: 'Deneyimli ve uzman kadromuzla profesyonel hizmet sunuyoruz.'
  },
  {
    icon: TrendingUp,
    title: 'Doğru Fiyatlandırma',
    description: 'Piyasa analizleriyle gerçek değer üzerinden fiyatlandırma yapıyoruz.'
  },
  {
    icon: Award,
    title: 'Müşteri Memnuniyeti',
    description: 'Müşteri memnuniyetini her zaman önceliğimiz olarak görüyoruz.'
  }
]

const features = [
  '15 yıllık sektörel bilgi birikimi',
  'Trabzon ve çevresinde güçlü portföy',
  'Hızlı sonuç odaklı çalışma sistemi',
  'Doğru değerleme ve gerçek piyasa analizi',
  'Profesyonel danışmanlık ve satış sonrası destek',
  'Yüzlerce başarılı işlem ve müşteri memnuniyeti'
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                Hakkımızda
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Kenan Kadıoğlu Gayrimenkul, 15 yıllık sektör tecrübesiyle Trabzon ve çevresinde 
              güvenilir, şeffaf ve profesyonel hizmet sunan bir gayrimenkul danışmanlık şirketidir.
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Trabzon&apos;un Güvenilir Emlak Danışmanı
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Kurulduğumuz günden bu yana; doğru yatırım, doğru değerleme ve doğru iletişim 
                prensipleriyle, müşterilerimizin ihtiyaçlarına en uygun çözümleri üretiyoruz.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Portföyümüzde konut, arsa, ticari gayrimenkul ve yatırım amaçlı projeler yer alırken; 
                her müşterimize özel analiz, doğru fiyatlandırma ve sonuç odaklı çalışma modeliyle 
                hizmet veriyoruz.
              </p>
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 w-full h-96 rounded-2xl flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award className="w-16 h-16" />
                  </div>
                  <p className="text-2xl font-bold mb-2">15 Yıllık Tecrübe</p>
                  <p className="text-lg opacity-90">Güvenilir Hizmet</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Misyonumuz</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Müşterilerimizin hayallerindeki yaşam alanına ulaşmasını sağlamak ve yatırım 
                süreçlerinde doğru kararlar almalarına yardımcı olmak. Güveni, şeffaflığı 
                ve profesyonelliği her işimizin merkezine koymak.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Vizyonumuz</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Trabzon&apos;da ve Karadeniz bölgesinde gayrimenkul danışmanlığında lider ve örnek 
                gösterilen bir marka olmak; teknolojiyi, yenilikçi çözümleri ve müşteri 
                memnuniyetini temel alarak hizmet kalitesini sürekli yükseltmek.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Değerlerimiz</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tüm faaliyetlerimizde benimsediğimiz temel değerlerimiz
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center group"
                >
                  <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Sizinle Tanışmak İsteriz
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Hayalinizdeki gayrimenkule ulaşmanız için buradayız. Hemen iletişime geçin!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="flex flex-col items-center space-y-3">
                <div className="bg-yellow-500 w-12 h-12 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-black" />
                </div>
                <div>
                  <p className="font-semibold">Telefon</p>
                  <p className="text-gray-300">+90 462 230 00 00</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-3">
                <div className="bg-yellow-500 w-12 h-12 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-black" />
                </div>
                <div>
                  <p className="font-semibold">E-posta</p>
                  <p className="text-gray-300">info@kenankadioglu.com</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-3">
                <div className="bg-yellow-500 w-12 h-12 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-black" />
                </div>
                <div>
                  <p className="font-semibold">Adres</p>
                  <p className="text-gray-300">Trabzon, Türkiye</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                İletişim Formu
              </a>
              <a
                href="tel:+904622300000"
                className="border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black px-8 py-3 rounded-lg font-semibold transition-colors"
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