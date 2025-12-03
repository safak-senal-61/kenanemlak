import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'

export interface AuthenticatedRequest extends NextRequest {
  admin?: {
    adminId: string
    email: string
    role: string
  }
}

export function authenticateToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return {
      error: 'Token gerekli',
      status: 401
    }
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return {
      error: 'Geçersiz token',
      status: 401
    }
  }

  return {
    admin: decoded,
    status: 200
  }
}

export function withAuth(handler: (request: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const result = authenticateToken(request)
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      )
    }

    ;(request as AuthenticatedRequest).admin = result.admin
    return handler(request as AuthenticatedRequest)
  }
}