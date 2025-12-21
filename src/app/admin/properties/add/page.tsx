'use client'

import { useRouter } from 'next/navigation'
import PropertyForm from '@/components/admin/PropertyForm'

export default function AddPropertyPage() {
  const router = useRouter()

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <PropertyForm 
        onCancel={() => router.push('/admin/properties')}
        onSuccess={() => router.push('/admin/properties')}
      />
    </div>
  )
}
