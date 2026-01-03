'use client'

import BrandLogo from '@/components/BrandLogo'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="flex flex-col items-center">
        <BrandLogo animated={true} />
        <div className="mt-8 flex gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  )
}