'use client'

import { useRouter, useParams } from 'next/navigation'
import PropertyForm, { PropertyFormData } from '@/components/admin/PropertyForm'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function EditPropertyPage() {
  const router = useRouter()
  const params = useParams()
  const [initialData, setInitialData] = useState<PropertyFormData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`/api/properties/${params.id}`)
        if (res.ok) {
          const data = await res.json()
          
          // Format data to match PropertyForm structure
          const formattedData = {
            title: data.title,
            type: data.type,
            category: data.category,
            subCategory: data.subCategory || '',
            price: data.price,
            location: data.location,
            description: data.description || '',
            features: {
              rooms: data.rooms || '',
              bathrooms: data.bathrooms?.toString() || '',
              area: data.area?.toString() || '',
              areaNet: data.areaNet?.toString() || '',
              floor: data.floorNumber?.toString() || '',
              totalFloors: data.totalFloors?.toString() || '',
              buildingAge: data.buildingAge || '',
              heating: data.heating || '',
              kitchen: data.kitchen || '',
              parking: data.parking || '',
              usageStatus: data.usageStatus || '',
              // Land specific
              zoningStatus: data.zoningStatus || '', // Assuming these exist in DB or are mapped correctly
              block: data.block || '',
              parcel: data.parcel || '',
              sheet: data.sheet || '',
              kaks: data.kaks || '',
              gabari: data.gabari || '',
              titleDeedStatus: data.titleDeedStatus || '',
              // Booleans
              furnished: data.furnished || false,
              balcony: data.balcony || false,
              elevator: data.elevator || false,
              inComplex: data.inComplex || false,
              featured: data.featured || false,
              creditSuitable: data.creditSuitable || false,
              swap: data.swap || false,
            },
            // Photos
            photos: data.photos || []
          }
          
          setInitialData(formattedData)
        }
      } catch (error) {
        console.error('Error fetching property:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProperty()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-gold" />
      </div>
    )
  }

  if (!initialData) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        İlan bulunamadı.
      </div>
    )
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <PropertyForm 
        initialData={initialData}
        isEditMode={true}
        propertyId={params.id as string}
        onCancel={() => router.push('/admin/properties')}
        onSuccess={() => {
          router.refresh()
          router.push('/admin/properties')
        }}
      />
    </div>
  )
}
