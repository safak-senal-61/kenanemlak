import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID gereklidir.' },
        { status: 400 }
      );
    }

    // Sohbeti bitir ve bot moduna geri döndür
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { 
        status: 'bot',
        adminTyping: false,
        updatedAt: new Date()
      }
    });

    // İsteğe bağlı: Bot'tan bir kapanış mesajı eklenebilir
    // Ancak şimdilik sadece durumu değiştiriyoruz.

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('End chat error:', error);
    return NextResponse.json(
      { error: 'Sohbet sonlandırılamadı.' },
      { status: 500 }
    );
  }
}
