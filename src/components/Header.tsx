'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone, Mail, MapPin, Home, Building, User, MessageCircle, Bell, Users } from 'lucide-react'
import Logo from '@/components/Logo'
import SubscriptionModal from './SubscriptionModal'
import { useTranslations } from 'next-intl'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header() {
  const t = useTranslations('Navigation')
  const tHeader = useTranslations('Header')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false)

  const navigation = [
    { name: t('home'), href: '/', icon: Home },
    { name: t('properties'), href: '/properties', icon: Building },
    { name: t('team'), href: '/team', icon: Users },
    { name: t('about'), href: '/about', icon: User },
    { name: t('contact'), href: '/contact', icon: MessageCircle },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menuVariants = {
    closed: {
      x: '100%',
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 30
      }
    },
    open: {
      x: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 30
      }
    }
  }

  const backdropVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 }
  }

  return (
    <>
      {/* Top Bar - Hidden on mobile */}
      <div className="hidden lg:block bg-charcoal text-white py-3 relative z-[100]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <motion.span 
                className="flex items-center space-x-2 hover:text-primary-gold transition-colors cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <Phone className="w-4 h-4" />
                <span>{tHeader('phone')}</span>
              </motion.span>
              <motion.span 
                className="flex items-center space-x-2 hover:text-primary-gold transition-colors cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <Mail className="w-4 h-4" />
                <span>{tHeader('email')}</span>
              </motion.span>
            </div>
            <div className="flex items-center space-x-6">
              <motion.div 
                className="flex items-center space-x-2 hover:text-primary-gold transition-colors cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <MapPin className="w-4 h-4" />
                <span>{tHeader('location')}</span>
              </motion.div>
              <div className="border-l border-gray-600 pl-6">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <motion.header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-black/95 backdrop-blur-md shadow-xl border-b border-primary-gold/20' 
            : 'bg-black shadow-lg border-b border-white/5'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-4 group">
              <Logo />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link
                    href={item.href}
                    className="text-white hover:text-primary-gold font-medium transition-all duration-300 relative group py-2"
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-gold to-primary-gold-dark transition-all duration-300 group-hover:w-full"></span>
                    <span className="absolute top-0 right-0 w-0 h-0.5 bg-gradient-to-r from-primary-gold to-primary-gold-dark transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  onClick={() => setIsSubscribeModalOpen(true)}
                  className="group relative bg-gradient-to-r from-primary-gold to-primary-gold-dark text-white px-6 py-3 rounded-xl font-medium hover:from-primary-gold-dark hover:to-primary-gold transition-all duration-300 shadow-lg hover:shadow-2xl overflow-hidden flex items-center"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <Bell className="w-4 h-4" />
                    <span>Abone Ol</span>
                  </span>
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
              </motion.div>
            </nav>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center gap-4">
              <LanguageSwitcher />
              <motion.button
                type="button"
                className="p-3 text-white hover:text-primary-gold transition-all duration-300 rounded-lg hover:bg-primary-gold/10"
                onClick={() => setMobileMenuOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Menu className="w-6 h-6" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <SubscriptionModal 
        isOpen={isSubscribeModalOpen} 
        onClose={() => setIsSubscribeModalOpen(false)} 
      />

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Drawer */}
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed right-0 top-0 h-full w-80 bg-gradient-to-b from-off-white to-cream shadow-2xl z-50"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-primary-gold/20 bg-white">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-lg overflow-hidden">
                      <Image
                        src="/logo.png"
                        alt="Kenan Kadıoğlu"
                        width={120}
                        height={40}
                        className="h-8 w-auto object-contain rounded-lg"
                      />
                    </div>
                  </div>
                  <motion.button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-charcoal hover:text-primary-gold transition-colors rounded-full hover:bg-primary-gold/10"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>

                {/* Menu Items */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                  {navigation.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          className="flex items-center space-x-4 p-4 rounded-xl text-charcoal hover:bg-white hover:shadow-md hover:text-primary-gold transition-all duration-300 group"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-primary-gold/10 transition-colors">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Footer Info */}
                <div className="p-6 bg-white border-t border-gray-100">
                  <div className="space-y-4">
                    <a href="tel:+905334115147" className="flex items-center space-x-3 text-gray-600 hover:text-primary-gold transition-colors">
                      <Phone className="w-5 h-5" />
                      <span>0533 411 51 47</span>
                    </a>
                    <a href="mailto:61kenankadioglu61@gmail.com" className="flex items-center space-x-3 text-gray-600 hover:text-primary-gold transition-colors">
                      <Mail className="w-5 h-5" />
                      <span>61kenankadioglu61@gmail.com</span>
                    </a>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <MapPin className="w-5 h-5" />
                      <span>{tHeader('location')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
