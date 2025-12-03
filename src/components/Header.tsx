'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone, Mail, MapPin, Home, Building, User, MessageCircle, Settings } from 'lucide-react'

const navigation = [
  { name: 'Ana Sayfa', href: '/', icon: Home },
  { name: 'İlanlar', href: '/properties', icon: Building },
  { name: 'Hakkımızda', href: '/about', icon: User },
  { name: 'İletişim', href: '/contact', icon: MessageCircle },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

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
      <div className="hidden lg:block bg-charcoal text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <motion.span 
                className="flex items-center space-x-2 hover:text-primary-gold transition-colors cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <Phone className="w-4 h-4" />
                <span>+90 462 230 00 00</span>
              </motion.span>
              <motion.span 
                className="flex items-center space-x-2 hover:text-primary-gold transition-colors cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <Mail className="w-4 h-4" />
                <span>info@kenankadioglu.com</span>
              </motion.span>
            </div>
            <motion.div 
              className="flex items-center space-x-2 hover:text-primary-gold transition-colors cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <MapPin className="w-4 h-4" />
              <span>Trabzon, Türkiye</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <motion.header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-xl border-b border-primary-gold/20' 
            : 'bg-white shadow-lg'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-4 group">
              <motion.div 
                className="relative bg-gradient-to-br from-primary-gold to-primary-gold-dark p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-inner">
                  <span className="bg-gradient-to-r from-primary-gold to-primary-gold-dark bg-clip-text text-transparent font-bold text-xl">
                    KK
                  </span>
                </div>
                <div className="absolute inset-0 rounded-xl animate-shimmer opacity-30"></div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-charcoal to-charcoal-light bg-clip-text text-transparent">
                  Kenan Kadıoğlu
                </h1>
                <p className="text-sm text-accent-silver font-medium">Gayrimenkul Danışmanlığı</p>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link
                    href={item.href}
                    className="text-charcoal hover:text-primary-gold font-medium transition-all duration-300 relative group py-2"
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
                <Link
                  href="/admin"
                  className="group relative bg-gradient-to-r from-primary-gold to-primary-gold-dark text-white px-6 py-3 rounded-xl font-medium hover:from-primary-gold-dark hover:to-primary-gold transition-all duration-300 shadow-lg hover:shadow-2xl overflow-hidden"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>Admin Paneli</span>
                  </span>
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </Link>
              </motion.div>
            </nav>

            {/* Mobile menu button */}
            <motion.button
              type="button"
              className="lg:hidden p-3 text-charcoal hover:text-primary-gold transition-all duration-300 rounded-lg hover:bg-primary-gold/10"
              onClick={() => setMobileMenuOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </motion.header>

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
                    <div className="bg-gradient-to-br from-primary-gold to-primary-gold-dark p-2 rounded-lg">
                      <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                        <span className="bg-gradient-to-r from-primary-gold to-primary-gold-dark bg-clip-text text-transparent font-bold">
                          KK
                        </span>
                      </div>
                    </div>
                    <h2 className="text-lg font-bold text-charcoal">Menü</h2>
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

                {/* Navigation */}
                <nav className="flex-1 p-6 space-y-2">
                  {navigation.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center space-x-4 text-charcoal hover:text-primary-gold p-4 rounded-xl hover:bg-primary-gold/10 transition-all duration-300 group"
                      >
                        <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">{item.name}</span>
                        <div className="ml-auto w-2 h-2 bg-primary-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Footer */}
                <div className="p-6 border-t border-primary-gold/20 bg-white">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-primary-gold to-primary-gold-dark text-white p-4 rounded-xl font-medium hover:from-primary-gold-dark hover:to-primary-gold transition-all duration-300 shadow-lg"
                    >
                      <Settings className="w-5 h-5" />
                      <span>Admin Paneli</span>
                    </Link>
                  </motion.div>
                  
                  {/* Contact Info */}
                  <div className="mt-6 space-y-3 text-sm text-charcoal/70">
                    <motion.div 
                      className="flex items-center space-x-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Phone className="w-4 h-4 text-primary-gold" />
                      <span>+90 462 230 00 00</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center space-x-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Mail className="w-4 h-4 text-primary-gold" />
                      <span>info@kenankadioglu.com</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center space-x-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      <MapPin className="w-4 h-4 text-primary-gold" />
                      <span>Trabzon, Türkiye</span>
                    </motion.div>
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