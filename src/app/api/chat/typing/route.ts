import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, isTyping } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID gereklidir.' },
        { status: 400 }
      );
    }

    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { 
        adminTyping: isTyping,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Typing status update error:', error);
    return NextResponse.json(
      { error: 'Yazıyor durumu güncellenemedi.' },
      { status: 500 }
    );
  }
}
