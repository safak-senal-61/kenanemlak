'use client'

import Image from 'next/image'

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Image
        src="/logo.png"
        alt="Kenan Kadıoğlu Gayrimenkul"
        width={250}
        height={100}
        className="w-auto h-auto max-w-[180px] md:max-w-[220px] object-contain"
        priority
      />
    </div>
  )
}

