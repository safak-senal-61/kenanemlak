import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/prisma'
import { Phone, Mail, MapPin, ArrowLeft, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Footer from '@/components/Footer'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{
    slug: string
    locale: string
  }>
}

async function getTeamMember(slug: string) {
  const member = await prisma.teamMember.findUnique({
    where: { slug },
  })
  return member
}

export default async function TeamMemberPage({ params }: PageProps) {
  const { slug, locale } = await params;
  const t = await getTranslations({locale, namespace: 'TeamPage'})
  const member = await getTeamMember(slug)

  if (!member) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] pb-20">
      {/* Header - Custom for this page or reuse global Header? 
          The reference file used a custom motion header, but we can use the global Header for consistency 
          or stick to the reference design. The reference design had a specific back button behavior.
          Let's try to match the reference design but adapted for dynamic content.
      */}
      
      <div className="bg-white/70 backdrop-blur-xl backdrop-saturate-150 border-b border-white/20 sticky top-0 z-50 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/team" className="flex items-center gap-3 text-slate-600 hover:text-slate-900 transition-colors group">
            <div className="w-10 h-10 rounded-full bg-white/80 border border-slate-200 flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:border-slate-300 transition-all duration-300">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-300" />
            </div>
            <span className="font-semibold text-sm tracking-wide hidden sm:block">{t('backToTeam')}</span>
          </Link>
          
          <Link href="/" className="text-2xl font-bold tracking-tight text-slate-800 hover:opacity-80 transition-opacity">
            Kenan<span className="text-primary-gold">Emlak</span>
          </Link>

          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="h-48 bg-gradient-to-r from-charcoal to-gray-800 relative">
              <div className="absolute inset-0 bg-primary-gold/10 pattern-grid-lg opacity-20"></div>
            </div>
            <div className="px-6 md:px-8 pb-8">
              <div className="relative flex flex-col md:flex-row justify-between items-center md:items-end -mt-20 mb-6 gap-6 md:gap-4">
                <div className="relative">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center overflow-hidden relative">
                    {member.image ? (
                      <Image 
                        src={member.image} 
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-charcoal to-gray-700 flex items-center justify-center text-white text-5xl font-bold">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 w-6 h-6 md:w-8 md:h-8 bg-green-500 border-4 border-white rounded-full" title="Online"></div>
                </div>
                <div className="flex flex-wrap justify-center gap-3 w-full md:w-auto mb-4 md:mb-4">
                  {member.phone && (
                    <a href={`tel:${member.phone.replace(/\s/g, '')}`} className="flex-1 md:flex-none bg-primary-gold hover:bg-primary-gold-dark text-white px-5 py-2.5 md:px-6 md:py-3 rounded-xl font-semibold shadow-lg shadow-primary-gold/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 text-sm md:text-base min-w-[120px]">
                      <Phone className="w-4 h-4 md:w-5 md:h-5" />
                      <span>{t('call')}</span>
                    </a>
                  )}
                  {member.whatsapp && (
                    <a href={`https://wa.me/${member.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex-1 md:flex-none bg-[#25D366] hover:bg-[#128C7E] text-white px-5 py-2.5 md:px-6 md:py-3 rounded-xl font-semibold shadow-lg shadow-green-500/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 text-sm md:text-base min-w-[120px]">
                      <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                      <span>{t('whatsapp')}</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-charcoal mb-2">{member.name}</h1>
                <p className="text-lg md:text-xl text-primary-gold font-medium mb-6">{member.role}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-100 pt-6">
                  {member.location && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase">{t('location')}</p>
                        <p className="font-semibold">{member.location}</p>
                      </div>
                    </div>
                  )}
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="flex items-center gap-3 text-gray-600 group transition-all duration-300 hover:-translate-y-1">
                      <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-100 group-hover:scale-110 transition-all duration-300">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase">{t('email')}</p>
                        <p className="font-semibold text-sm group-hover:text-purple-600 transition-colors">{member.email}</p>
                      </div>
                    </a>
                  )}
                  {member.phone && (
                    <a href={`tel:${member.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-gray-600 group transition-all duration-300 hover:-translate-y-1">
                      <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-100 group-hover:scale-110 transition-all duration-300">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase">{t('phone')}</p>
                        <p className="font-semibold group-hover:text-orange-600 transition-colors">{member.phone}</p>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          {member.bio && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                  <h2 className="text-2xl font-bold text-charcoal mb-6 flex items-center gap-3">
                    <span className="w-8 h-1 bg-primary-gold rounded-full"></span>
                    {t('about')}
                  </h2>
                  <div className="prose prose-lg text-gray-600 leading-relaxed whitespace-pre-line">
                    {member.bio}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
