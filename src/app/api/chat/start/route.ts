
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const WELCOME_MESSAGES: { [key: string]: (name: string) => string } = {
  tr: (name) => `Merhaba ${name}, Kenan Kadıoğlu Gayrimenkul'e hoş geldiniz. Size nasıl yardımcı olabilirim?`,
  en: (name) => `Hello ${name}, welcome to Kenan Kadıoğlu Real Estate. How can I help you?`,
  ar: (name) => `مرحباً ${name}، أهلاً بك في كنان كاديوغلو للعقارات. كيف يمكنني مساعدتك؟`
};

const SENDER_NAMES: { [key: string]: string } = {
  tr: 'Kenan Emlak Asistanı',
  en: 'Kenan Real Estate Assistant',
  ar: 'مساعد كنان للعقارات'
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, locale = 'tr' } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Ad, E-posta ve Telefon zorunludur.' },
        { status: 400 }
      );
    }

    const initialMessage = WELCOME_MESSAGES[locale] ? WELCOME_MESSAGES[locale](name) : WELCOME_MESSAGES['tr'](name);
    const senderName = SENDER_NAMES[locale] || SENDER_NAMES['tr'];

    const session = await prisma.chatSession.create({
      data: {
        userName: name,
        userEmail: email,
        userPhone: phone,
        status: 'bot',
        messages: {
          create: {
            content: initialMessage,
            sender: 'bot',
            senderName: senderName,
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