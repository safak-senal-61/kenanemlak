'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react'
import { fetchWithCache } from '@/utils/apiCache'

interface TeamMember {
  id: string;
  name: string;
  role: string;
  slug: string;
  image: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  location: string | null;
}

export default function TeamPage() {
  const t = useTranslations('TeamPage')
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // Cache for 1 minute only
        const data = await fetchWithCache<TeamMember[]>('/api/team', undefined, 60 * 1000)
        if (data) {
          setMembers(data)
        }
      } catch (error) {
        console.error('Error fetching team:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [])

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-charcoal mb-4">{t('title')}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow"
              >
                <div className="relative h-80 bg-gray-100">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                      <span className="text-6xl font-bold">{member.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-charcoal mb-1">{member.name}</h3>
                  <p className="text-primary-gold font-medium text-sm mb-4">{member.role}</p>
                  
                  <div className="space-y-2 mb-6">
                    {member.phone && (
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Phone size={16} className="text-primary-gold" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                    {member.email && (
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Mail size={16} className="text-primary-gold" />
                        <span>{member.email}</span>
                      </div>
                    )}
                    {member.location && (
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <MapPin size={16} className="text-primary-gold" />
                        <span>{member.location}</span>
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/team/${member.slug}`}
                    className="block w-full text-center bg-gray-50 hover:bg-primary-gold hover:text-white text-gray-700 font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <span>{t('viewProfile')}</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
