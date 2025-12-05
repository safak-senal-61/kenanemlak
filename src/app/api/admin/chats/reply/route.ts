
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateToken } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const authResult = authenticateToken(request);
  if (authResult.error || !authResult.admin) {
    return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: authResult.status || 401 });
  }

  try {
    const body = await request.json();
    const { sessionId, message } = body;

    // Admin bilgisini al
    const adminId = authResult.admin.adminId;
    const admin = await prisma.admin.findUnique({
      where: { id: adminId }
    });

    // Mesajı kaydet
    const newMsg = await prisma.message.create({
      data: {
        content: message,
        sender: 'admin',
        senderName: admin?.name || 'Yetkili',
        sessionId: sessionId,
      },
    });

    // Session durumunu aktif yap ve okundu işaretle
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: {
        status: 'live_active',
        isRead: true,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(newMsg);

  } catch (error) {
    return NextResponse.json({ error: 'Mesaj gönderilemedi' }, { status: 500 });
  }
}


