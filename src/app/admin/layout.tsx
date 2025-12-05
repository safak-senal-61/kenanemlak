'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Home, 
  Plus, 
  Settings, 
  Menu, 
  X,
  Building,
  BarChart3
} from 'lucide-react'

const menuItems = [
  { href: '/admin', icon: Home, label: 'Dashboard' },
  { href: '/admin/properties', icon: Building, label: 'Emlaklar' },
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

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const publicPaths = ['/admin/login', '/admin/register']
    
    if (!token && !publicPaths.includes(pathname)) {
      router.push('/admin/login')
    }
  }, [pathname, router])

  // Login ve Register sayfaları için dashboard layout'unu gösterme
  if (pathname === '/admin/login' || pathname === '/admin/register' || pathname === '/admin') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: sidebarOpen ? 256 : 0 }}
        className="bg-gradient-to-b from-gray-900 to-black shadow-xl overflow-hidden fixed h-full z-50"
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
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-500 hover:text-gray-700 lg:hidden"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="ml-4 text-xl font-semibold text-gray-800">
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