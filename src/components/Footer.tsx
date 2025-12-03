'use client'

import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-3 rounded-lg">
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                  <span className="text-yellow-600 font-bold text-lg">KK</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold">Kenan Kadıoğlu</h3>
                <p className="text-gray-400 text-sm">Gayrimenkul Danışmanlığı</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              15 yıllık sektör tecrübesiyle Trabzon ve çevresinde güvenilir, 
              şeffaf ve profesyonel gayrimenkul danışmanlık hizmetleri.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-yellow-400">Hızlı Erişim</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/properties" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  İlanlar
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Hizmetlerimiz
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-yellow-400">Hizmetlerimiz</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-300">Satılık Gayrimenkul</span>
              </li>
              <li>
                <span className="text-gray-300">Kiralık Gayrimenkul</span>
              </li>
              <li>
                <span className="text-gray-300">Gayrimenkul Değerleme</span>
              </li>
              <li>
                <span className="text-gray-300">Yatırım Danışmanlığı</span>
              </li>
              <li>
                <span className="text-gray-300">Portföy Yönetimi</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-yellow-400">İletişim Bilgileri</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-gray-300">+90 462 230 00 00</p>
                  <p className="text-gray-400 text-sm">Pazartesi - Cumartesi: 09:00 - 18:00</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300">info@kenankadioglu.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300">Trabzon, Türkiye</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold text-yellow-400 mb-3">Misyonumuz</h4>
            <p className="text-gray-300">
              Müşterilerimizin hayallerindeki yaşam alanına ulaşmasını sağlamak ve 
              yatırım süreçlerinde doğru kararlar almalarına yardımcı olmak.
            </p>
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold text-yellow-400 mb-3">Vizyonumuz</h4>
            <p className="text-gray-300">
              Trabzon&apos;da ve Karadeniz bölgesinde gayrimenkul danışmanlığında lider 
              ve örnek gösterilen bir marka olmak.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black/50 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              © 2024 Kenan Kadıoğlu Gayrimenkul. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">
                Gizlilik Politikası
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">
                Kullanım Şartları
              </Link>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Clock className="w-4 h-4" />
                <span>7/24 Hizmet</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}