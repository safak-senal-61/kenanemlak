
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Ad, E-posta ve Telefon zorunludur.' },
        { status: 400 }
      );
    }

    const session = await prisma.chatSession.create({
      data: {
        userName: name,
        userEmail: email,
        userPhone: phone,
        status: 'bot',
        messages: {
          create: {
            content: `Merhaba ${name}, Kenan Kadıoğlu Gayrimenkul'e hoş geldiniz. Size nasıl yardımcı olabilirim?`,
            sender: 'bot',
            senderName: 'Kenan Emlak Asistanı',
          },
        },
      },
      include: {
        messages: true,
      },
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error('Chat session creation error:', error);
    return NextResponse.json(
      { error: 'Sohbet başlatılamadı.' },
      { status: 500 }
    );
  }
}