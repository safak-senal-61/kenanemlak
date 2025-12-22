'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  Plus, 
  Settings, 
  Menu, 
  X,
  Building,
  BarChart3,
  Layers
} from 'lucide-react'

const menuItems = [
  { href: '/admin', icon: Home, label: 'Dashboard' },
  { href: '/admin/properties', icon: Building, label: 'Emlaklar' },
  { href: '/admin/projects', icon: Layers, label: 'Projeler' },
  { href: '/admin/properties/add', icon: Plus, label: 'Yeni İlan' },
  { href: '/admin/analytics', icon: BarChart3, label: 'Analitik' },
  { href: '/admin/settings', icon: Settings, label: 'Ayarlar' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const isFirstRender = useRef(true)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const publicPaths = ['/admin/login', '/admin/register', '/admin/setup']
    
    if (!token && !publicPaths.includes(pathname)) {
      router.push('/admin/login')
    }
  }, [pathname, router])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    // Close sidebar on route change for mobile
    // Using setTimeout to avoid synchronous state update warning during effect
    const timer = setTimeout(() => {
      setSidebarOpen(false)
    }, 0)
    
    return () => clearTimeout(timer)
  }, [pathname])

  // Login, Register ve Setup sayfaları için dashboard layout'unu gösterme
  if (pathname === '/admin/login' || pathname === '/admin/register' || pathname === '/admin/setup' || pathname === '/admin') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-900 to-black text-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-yellow-400">Admin Panel</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-white lg:hidden"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-yellow-500 text-black'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:pl-64 transition-all duration-300">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-500 hover:text-gray-700 lg:hidden mr-4"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-semibold text-gray-800">
                Kenan Kadıoğlu Gayrimenkul - Admin
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-yellow-600 hover:text-yellow-700 font-medium"
              >
                Siteye Git
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}