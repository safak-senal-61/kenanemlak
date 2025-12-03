'use client'

import { Suspense } from 'react'
import { AdminRegisterForm } from '@/components/AdminRegisterForm'

export default function AdminRegister() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-charcoal via-charcoal-light to-primary-gold-dark flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-gold mx-auto mb-4"></div>
          <p className="text-charcoal">Yükleniyor...</p>
        </div>
      </div>
    }>
      <AdminRegisterForm />
    </Suspense>
  )
}