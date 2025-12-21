'use client'

import { useRouter } from 'next/navigation'
import ProjectForm from '@/components/admin/ProjectForm'

export default function AddProjectPage() {
  const router = useRouter()

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <ProjectForm 
        onCancel={() => router.push('/admin/projects')}
        onSuccess={() => router.push('/admin/projects')}
      />
    </div>
  )
}
