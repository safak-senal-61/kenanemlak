import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Token gerekli' },
        { status: 400 }
      )
    }

    const invitation = await prisma.adminInvitation.findUnique({
      where: { token }
    })

    if (!invitation) {
      return NextResponse.json(
        { error: 'Geçersiz davet bağlantısı' },
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

    return NextResponse.json({
      email: invitation.email,
      role: invitation.role
    })
  } catch (error) {
    console.error('Verify token error:', error)
    return NextResponse.json(
      { error: 'Davet kontrol edilirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { token, adminSecret, name, password, email } = await request.json()

    if (!name || !password) {
      return NextResponse.json(
        { error: 'Ad ve şifre gereklidir' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Şifre en az 6 karakter olmalı' },
        { status: 400 }
      )
    }

    let userEmail = email
    let userRole = 'admin'

    // Senaryo 1: Davet token'ı ile kayıt
    if (token) {
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
      
      userEmail = invitation.email
      userRole = invitation.role
    } 
    // Senaryo 2: Admin Secret ile kayıt
    else if (adminSecret) {
      if (adminSecret !== process.env.ADMIN_SECRET) {
        return NextResponse.json(
          { error: 'Geçersiz Admin Secret anahtarı' },
          { status: 403 }
        )
      }

      if (!email) {
        return NextResponse.json(
          { error: 'Email adresi gereklidir' },
          { status: 400 }
        )
      }
    } 
    // Senaryo 3: Ne token ne de secret var
    else {
      return NextResponse.json(
        { error: 'Kayıt için davet tokenı veya Admin Secret gereklidir' },
        { status: 400 }
      )
    }

    // Email kontrolü (Her iki senaryo için de geçerli)
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: userEmail }
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
        email: userEmail,
        password: hashedPassword,
        name,
        role: userRole
      }
    })

    // Eğer token ile geldiyse daveti kullanıldı olarak işaretle
    if (token) {
      const invitation = await prisma.adminInvitation.findUnique({ where: { token } })
      if (invitation) {
        await prisma.adminInvitation.update({
          where: { id: invitation.id },
          data: { isUsed: true }
        })
      }
    }

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