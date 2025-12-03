import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { verifyInvitationToken } from '@/lib/jwt'

export async function POST(request: NextRequest) {
  try {
    const { token, name, password } = await request.json()

    if (!token || !name || !password) {
      return NextResponse.json(
        { error: 'Tüm alanlar gerekli' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Şifre en az 6 karakter olmalı' },
        { status: 400 }
      )
    }

    const invitation = await prisma.adminInvitation.findUnique({
      where: { token }
    })

    if (!invitation) {
      return NextResponse.json(
        { error: 'Geçersiz davet' },
        { status: 404 }
      )
    }

    if (invitation.isUsed) {
      return NextResponse.json(
        { error: 'Bu davet zaten kullanılmış' },
        { status: 400 }
      )
    }

    if (invitation.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Bu davetin süresi dolmuş' },
        { status: 400 }
      )
    }

    const existingAdmin = await prisma.admin.findUnique({
      where: { email: invitation.email }
    })

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Bu email ile zaten bir admin hesabı var' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const admin = await prisma.admin.create({
      data: {
        email: invitation.email,
        password: hashedPassword,
        name,
        role: invitation.role
      }
    })

    await prisma.adminInvitation.update({
      where: { id: invitation.id },
      data: { isUsed: true }
    })

    return NextResponse.json({
      message: 'Admin hesabı başarıyla oluşturuldu',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Kayıt oluşturulurken bir hata oluştu' },
      { status: 500 }
    )
  }
}