'use client'

import { useEffect } from 'react'

interface PageTitleProps {
  title: string
}

export default function PageTitle({ title }: PageTitleProps) {
  useEffect(() => {
    const baseTitle = "Kenan Kadıoğlu Gayrimenkul"
    document.title = `${title} | ${baseTitle}`
  }, [title])

  return null
}
