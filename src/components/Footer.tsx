'use client'

import Link from 'next/link'
import BrandLogo from './BrandLogo'
import { Facebook, Twitter, Instagram } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function Footer() {
  const t = useTranslations('Footer')
  const tNav = useTranslations('Navigation')
  const tHero = useTranslations('Hero')

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <BrandLogo />
            </div>
            <p className="text-gray-300 leading-relaxed">
              {tHero('description')}
            </p>
            <div className="flex space-x-4 items-center">
              <a href="https://www.facebook.com/share/17Yg5oyP98/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://x.com/6KENANKADIOGLU1?t=MiK8QArC0sV_cTCNmZJmjw&s=09" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/trabzonrealestatebroker?utm_source=qr&igsh=MTJkcmp3dTdqMnNycQ==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://shbd.io/s/kyfllczE" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors font-bold text-xs border border-gray-600 rounded px-2 py-0.5 hover:border-yellow-400">
                SAHIBINDEN
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-yellow-400">{t('quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  {tNav('home')}
                </Link>
              </li>
              <li>
                <Link href="/properties" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  {tNav('properties')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  {tNav('about')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  {tNav('contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-yellow-400">{t('services')}</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-300">{t('serviceList.sale')}</span>
              </li>
              <li>
                <span className="text-gray-300">{t('serviceList.rent')}</span>
              </li>
              <li>
                <span className="text-gray-300">{t('serviceList.valuation')}</span>
              </li>
              <li>
                <span className="text-gray-300">{t('serviceList.investment')}</span>
              </li>
              <li>
                <span className="text-gray-300">{t('serviceList.portfolio')}</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-yellow-400">{t('contactInfo')}</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:+905334115147" className="flex items-center space-x-3 text-gray-300 hover:text-yellow-400 transition-colors">
                  {/* Phone icon would be here, but using existing code structure which likely had it or implied it */}
                  <span>0533 411 51 47</span>
                </a>
              </li>
               <li>
                 <a href="mailto:61kenankadioglu61@gmail.com" className="flex items-center space-x-3 text-gray-300 hover:text-yellow-400 transition-colors">
                   <span>61kenankadioglu61@gmail.com</span>
                 </a>
               </li>
               <li>
                 <div className="flex items-center space-x-3 text-gray-300">
                   <span>Trabzon, Türkiye</span>
                 </div>
               </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Kenan Kadıoğlu. {t('rights')}</p>
        </div>
      </div>
    </footer>
  )
}
