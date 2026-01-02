'use client'

import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function AgentProfile() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] pb-20">
      {/* Header */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/70 backdrop-blur-xl backdrop-saturate-150 border-b border-white/20 sticky top-0 z-50 shadow-sm transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-slate-600 hover:text-slate-900 transition-colors group">
            <div className="w-10 h-10 rounded-full bg-white/80 border border-slate-200 flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:border-slate-300 transition-all duration-300">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-300" />
            </div>
            <span className="font-semibold text-sm tracking-wide hidden sm:block">ANA SAYFA</span>
          </Link>
          
          <Link href="/" className="text-2xl font-bold tracking-tight text-slate-800 hover:opacity-80 transition-opacity">
            Kenan<span className="text-primary-gold">Emlak</span>
          </Link>

          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>
      </motion.div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Profile Card */}
          <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="px-6 md:px-8 py-8">
              <div className="relative flex flex-col md:flex-row justify-between items-center md:items-end mb-6 gap-6 md:gap-0">
                <div className="relative">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden relative">
                    <Image
                      src="/kenan-kadıglu.jpeg"
                      alt="Kenan Kadıoğlu"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute bottom-2 right-2 w-6 h-6 md:w-8 md:h-8 bg-green-500 border-4 border-white rounded-full" title="Online"></div>
                </div>
                <div className="flex flex-wrap justify-center gap-3 w-full md:w-auto md:mb-4">
                  <a href="tel:05334115147" className="bg-primary-gold hover:bg-primary-gold-dark text-white px-5 py-2.5 md:px-6 md:py-3 rounded-xl font-semibold shadow-lg shadow-primary-gold/20 transition-all hover:-translate-y-1 flex items-center gap-2 text-sm md:text-base flex-1 md:flex-none justify-center min-w-[120px]">
                    <Phone className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Ara</span>
                  </a>
                  <a href="https://wa.me/905334115147" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] hover:bg-[#128C7E] text-white px-5 py-2.5 md:px-6 md:py-3 rounded-xl font-semibold shadow-lg shadow-green-500/20 transition-all hover:-translate-y-1 flex items-center gap-2 text-sm md:text-base flex-1 md:flex-none justify-center min-w-[120px]">
                    <MessageCircleIcon />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-charcoal mb-2">Kenan Kadıoğlu</h1>
                <p className="text-lg md:text-xl text-primary-gold font-medium mb-6">Profesyonel Gayrimenkul Danışmanı & Broker</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-100 pt-6">
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase">Lokasyon</p>
                      <p className="font-semibold">Trabzon, Türkiye</p>
                    </div>
                  </div>
                  
                  <a href="mailto:info@kenanemlak.com" className="flex items-center gap-3 text-gray-600 group transition-all duration-300 hover:-translate-y-1">
                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-100 group-hover:scale-110 transition-all duration-300">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase">E-posta</p>
                      <p className="font-semibold group-hover:text-purple-600 transition-colors">info@kenanemlak.com</p>
                    </div>
                  </a>

                  <a href="tel:05334115147" className="flex items-center gap-3 text-gray-600 group transition-all duration-300 hover:-translate-y-1">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-100 group-hover:scale-110 transition-all duration-300">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase">Telefon</p>
                      <p className="font-semibold group-hover:text-orange-600 transition-colors">0533 411 51 47</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats & Bio Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Bio */}
            <motion.div variants={itemVariants} className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-charcoal mb-6">Hakkımda</h3>
              <div className="prose max-w-none text-gray-600 leading-relaxed space-y-4">
                <p>
                  Gayrimenkul, yalnızca alım–satım değil; doğru analiz, doğru zamanlama ve güven üzerine kurulu bir süreçtir. 
                  15 yılı aşkın sektör deneyimimizle, müşterilerimize yalnızca bir işlem değil; emin, kontrollü ve sonuç odaklı bir yol sunmak amacıyla bu firmayı kurduk.
                </p>
                <p>
                  Piyasayı sadece rakamlar üzerinden değil; insan davranışları, ihtiyaçlar ve süreç yönetimi ile birlikte değerlendiriyoruz. 
                  Bu bakış açısı sayesinde her portföyü, her alıcıyı ve her satıcıyı kendi dinamiği içinde ele alıyor; standart çözümler yerine kişiye ve duruma özel stratejiler geliştiriyoruz.
                </p>
                <p>
                  Bölge uzmanlığımız öncelikle ilimiz Trabzon ve ilçeleri olmak üzere şekillenmiştir. 
                  İlimizde, güvenilirliği kanıtlanmış farklı emlak firmalarıyla şeffaf, etik ve profesyonel iş birlikleri yürütüyor; portföy paylaşımı ve alıcı–satıcı eşleşmelerini hızlı, sağlıklı ve hakkaniyetli şekilde sonuçlandırıyoruz.
                </p>
                <p>
                  İl dışı ve yurt dışı gayrimenkul süreçlerinde de aktif rol alırken, yerel pazardaki güçlü ağımızı her zaman temel alıyoruz. 
                  Bizim için rekabetten çok, doğru iş birliği ve sürdürülebilir güven esastır.
                </p>
                <p>
                  Hizmet anlayışımız; kısa vadeli kazançlar yerine uzun vadeli memnuniyet, güçlü referanslar ve kalıcı ilişkiler üzerine kuruludur. 
                  Müşterilerimizi acele ettirmeden, her adımı açık, ölçülü ve kontrol altında yönetiyoruz.
                </p>
                <p>
                  Sessiz ama kararlı ilerliyor, üstlendiğimiz her sürecin sorumluluğunu başından sonuna kadar taşıyoruz.
                </p>
                <div className="pt-4 font-semibold text-charcoal">
                  <p>Kenan Kadıoğlu</p>
                  <p className="text-primary-gold">Kurucu & Firma Sahibi</p>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-charcoal mb-4">Uzmanlık Alanları</h3>
                <div className="flex flex-wrap gap-2">
                  {['Lüks Konut', 'Ticari Gayrimenkul', 'Arsa & Arazi', 'Yatırım Danışmanlığı', 'Ekspertiz', 'Proje Pazarlama'].map((tag) => (
                    <span key={tag} className="bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-100">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-primary-gold text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-2">Hayalinizdeki Eve Ulaşın</h3>
                  <p className="text-white/80 mb-6 text-sm">Size en uygun gayrimenkulü bulmak için hemen iletişime geçin.</p>
                  <a href="tel:05334115147" className="w-full bg-white text-primary-gold font-bold py-3 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors">
                    Hemen Ara
                  </a>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-10 -mb-10 blur-xl"></div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

function MessageCircleIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="w-5 h-5"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  )
}
