'use client'

import BrandLogo from './BrandLogo'

interface LogoProps {
  className?: string
  lightMode?: boolean
}

export default function Logo({ className = "", lightMode = false }: LogoProps) {
  return (
    <BrandLogo className={className} lightMode={lightMode} />
  )
}


