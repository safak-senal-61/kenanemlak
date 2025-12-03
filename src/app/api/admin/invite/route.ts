import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateInvitationToken } from '@/lib/jwt'
import { sendEmail, generateAdminInvitationEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email, role = 'admin' } = await request.json()
    const adminSecret = request.headers.get('x-admin-secret')

    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 403 }
      )
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email gerekli' },
        { status: 400 }
      )
    }

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email }
    })

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Bu email ile zaten bir admin hesabı var' },
        { status: 400 }
      )
    }

    // Check if invitation already exists
    const existingInvitation = await prisma.adminInvitation.findFirst({
      where: { 
        email,
        isUsed: false,
        expiresAt: { gt: new Date() }
      }
    })

    if (existingInvitation) {
      return NextResponse.json(
        { error: 'Bu email için zaten aktif bir davet var' },
        { status: 400 }
      )
    }

    const token = generateInvitationToken()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    const invitation = await prisma.adminInvitation.create({
      data: {
        email,
        token,
        role,
        expiresAt
      }
    })

    const invitationUrl = `${process.env.NEXTAUTH_URL}/admin/register?token=${token}`

    try {
      await sendEmail({
        to: email,
        subject: 'Kenan Kadıoğlu - Admin Paneli Daveti',
        html: generateAdminInvitationEmail(invitationUrl)
      })
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // Delete invitation if email fails
      await prisma.adminInvitation.delete({
        where: { id: invitation.id }
      })
      return NextResponse.json(
        { error: 'Davet emaili gönderilemedi' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Admin daveti başarıyla gönderildi',
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        expiresAt: invitation.expiresAt
      }
    })
  } catch (error) {
    console.error('Invitation creation error:', error)
    return NextResponse.json(
      { error: 'Davet oluşturulurken bir hata oluştu' },
      { status: 500 }
    )
  }
}

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

    return NextResponse.json({
      invitation: {
        email: invitation.email,
        role: invitation.role,
        expiresAt: invitation.expiresAt
      }
    })
  } catch (error) {
    console.error('Invitation validation error:', error)
    return NextResponse.json(
      { error: 'Davet doğrulanırken bir hata oluştu' },
      { status: 500 }
    )
  }
}