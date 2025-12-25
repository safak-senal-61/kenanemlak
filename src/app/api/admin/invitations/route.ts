import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateToken } from '@/lib/auth';
import { sendEmail, generateAdminInvitationEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  const authResult = authenticateToken(request);
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  // Check if requester is super admin
  if (authResult.admin!.role !== 'admin') {
    return NextResponse.json({ error: 'Bu işlem için yetkiniz yok.' }, { status: 403 });
  }

  try {
    const { email, role } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'E-posta adresi gerekli.' }, { status: 400 });
    }

    // Check if email already exists in Admin
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      return NextResponse.json({ error: 'Bu e-posta adresi zaten kullanımda.' }, { status: 400 });
    }

    // Check if invitation already exists
    const existingInvitation = await prisma.adminInvitation.findUnique({
      where: { email },
    });

    if (existingInvitation && !existingInvitation.isUsed && existingInvitation.expiresAt > new Date()) {
       return NextResponse.json({ error: 'Bu e-posta için zaten aktif bir davet var.' }, { status: 400 });
    }

    // Delete expired or old invitation if exists
    if (existingInvitation) {
      await prisma.adminInvitation.delete({ where: { id: existingInvitation.id } });
    }

    // Create new invitation
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const invitation = await prisma.adminInvitation.create({
      data: {
        email,
        token,
        role: role || 'editor',
        expiresAt,
      },
    });

    // Get base URL from request headers to support both localhost and production domains
    const host = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const baseUrl = `${protocol}://${host}`;
    
    const inviteUrl = `${baseUrl}/admin/register?token=${token}`;
    
    await sendEmail({
      to: email,
      subject: 'Admin Paneli Daveti - Kenan Kadıoğlu Gayrimenkul',
      html: generateAdminInvitationEmail(inviteUrl),
    });

    return NextResponse.json({ message: 'Davet gönderildi.', invitation });
  } catch (error) {
    console.error('Invitation error:', error);
    return NextResponse.json({ error: 'Davet gönderilirken bir hata oluştu.' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const authResult = authenticateToken(request);
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  if (authResult.admin!.role !== 'admin') {
    return NextResponse.json({ error: 'Bu işlem için yetkiniz yok.' }, { status: 403 });
  }

  try {
    const invitations = await prisma.adminInvitation.findMany({
      where: {
        isUsed: false,
        expiresAt: { gt: new Date() }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(invitations);
  } catch (error) {
    console.error('Fetch invitations error:', error);
    return NextResponse.json({ error: 'Davetler getirilemedi.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authResult = authenticateToken(request);
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  if (authResult.admin!.role !== 'admin') {
    return NextResponse.json({ error: 'Bu işlem için yetkiniz yok.' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID gerekli.' }, { status: 400 });
    }

    await prisma.adminInvitation.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Davet silindi.' });
  } catch (error) {
    console.error('Delete invitation error:', error);
    return NextResponse.json({ error: 'Davet silinemedi.' }, { status: 500 });
  }
}
