
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getGeminiResponse } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, message } = body;

    if (!sessionId || !message) {
      return NextResponse.json(
        { error: 'Session ID ve mesaj gereklidir.' },
        { status: 400 }
      );
    }

    // 1. Kullanıcı mesajını kaydet
    await prisma.message.create({
      data: {
        content: message,
        sender: 'user',
        sessionId: sessionId,
      },
    });

    // 2. Session durumunu kontrol et
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 20 // Son 20 mesajı al (context için)
        }
      }
    });

    if (!session) {
      return NextResponse.json({ error: 'Session bulunamadı' }, { status: 404 });
    }

    // Eğer zaten canlı destekteyse veya bekliyorsa, bot cevap vermez (Admin cevaplayacak)
    if (session.status === 'live_active' || session.status === 'live_waiting') {
      // Admin paneline bildirim gitmesi için isRead false yapılır
      await prisma.chatSession.update({
        where: { id: sessionId },
        data: { isRead: false, updatedAt: new Date() }
      });
      
      return NextResponse.json({ status: 'sent_to_live' });
    }

    // 3. Bot cevabını oluştur (Gemini ile)
    
    // Geçmiş mesajları Gemini formatına dönüştür
    const history = session.messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model' as 'user' | 'model',
      parts: msg.content
    })).filter(msg => msg.parts); // Boş mesajları filtrele

    // Gemini'ye gönder (son kullanıcı mesajı zaten DB'ye eklendi ama history içinde de olacak, 
    // fakat Gemini chat history'sinde son mesajı ayrıca `sendMessage` ile gönderiyoruz.
    // Bu yüzden history'den son mesajı çıkarmalıyız veya history'yi son mesaj hariç oluşturmalıyız.
    // Ancak `session.messages` son eklenen mesajı da içeriyor mu?
    // Evet, `prisma.message.create` await ediliyor, sonra `findUnique` çağrılıyor.
    // Yani son mesaj `session.messages` içinde var.
    // Gemini `startChat` history'si geçmişi içermeli, son soruyu `sendMessage` ile sormalıyız.
    // O yüzden son mesajı history'den çıkaralım.
    
    const historyForGemini = history.slice(0, -1); 
    
    let aiResponseText = await getGeminiResponse(historyForGemini, message);

    // Canlı desteğe geçiş kontrolü
    if (aiResponseText.includes('[LIVE_SUPPORT_REQUEST]')) {
      await prisma.chatSession.update({
        where: { id: sessionId },
        data: { 
          status: 'live_waiting',
          isRead: false, // Admin bildirimi için
          updatedAt: new Date()
        },
      });

      const switchMsgContent = 'Sizi canlı destek ekibimize aktarıyorum. Lütfen hatta kalın, en kısa sürede bir temsilcimiz sizinle ilgilenecektir.';

      const switchMsg = await prisma.message.create({
        data: {
          content: switchMsgContent,
          sender: 'bot',
          senderName: 'Kenan Emlak Asistanı',
          sessionId: sessionId,
        },
      });

      return NextResponse.json(switchMsg);
    }

    // Normal Bot Cevabı
    const botMsg = await prisma.message.create({
      data: {
        content: aiResponseText,
        sender: 'bot',
        senderName: 'Kenan Emlak Asistanı',
        sessionId: sessionId,
      },
    });

    return NextResponse.json(botMsg);

  } catch (error) {
    console.error('Message error:', error);
    return NextResponse.json(
      { error: 'Mesaj gönderilemedi.' },
      { status: 500 }
    );
  }
}
