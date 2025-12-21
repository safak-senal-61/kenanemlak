
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getGeminiResponse } from '@/lib/gemini';
import { Prisma } from '@prisma/client';

const SENDER_NAMES: { [key: string]: string } = {
  tr: 'Kenan Emlak Asistanı',
  en: 'Kenan Real Estate Assistant',
  ar: 'مساعد كنان للعقارات'
};

const SWITCH_MESSAGES: { [key: string]: string } = {
  tr: 'Sizi canlı destek ekibimize aktarıyorum. Lütfen hatta kalın, en kısa sürede bir temsilcimiz sizinle ilgilenecektir.',
  en: 'I am transferring you to our live support team. Please hold, a representative will be with you shortly.',
  ar: 'أقوم بنقلك إلى فريق الدعم المباشر لدينا. يرجى الانتظار، سيكون معك ممثل في وقت قصير.'
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, message, locale = 'tr' } = body;

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
    
    let aiResponseText = await getGeminiResponse(historyForGemini, message, locale || 'tr');

    // Check if AI wants to search properties
    if (aiResponseText.trim().startsWith('{') && aiResponseText.includes('search_properties')) {
      try {
        const actionData = JSON.parse(aiResponseText);
        if (actionData.action === 'search_properties') {
          const { criteria } = actionData;
          
          // Build search query
          const whereClause: Prisma.PropertyWhereInput = {
            isActive: true,
          };

          // Handle rooms criteria (only if specific value provided)
          if (criteria.rooms && criteria.rooms !== 'oda sayısı' && criteria.rooms !== '0') {
             whereClause.rooms = { contains: criteria.rooms, mode: 'insensitive' };
          }

          // Handle text query across multiple fields
           if (criteria.query) {
              whereClause.OR = [
               { title: { contains: criteria.query, mode: 'insensitive' } },
               { description: { contains: criteria.query, mode: 'insensitive' } },
               { location: { contains: criteria.query, mode: 'insensitive' } },
               { heating: { contains: criteria.query, mode: 'insensitive' } },
               { type: { contains: criteria.query, mode: 'insensitive' } },
               { category: { contains: criteria.query, mode: 'insensitive' } },
               { kitchen: { contains: criteria.query, mode: 'insensitive' } }
             ];
           }

           // Handle area filtering
           const areaFilter: Prisma.IntFilter = {};
           if (criteria.minArea && criteria.minArea > 0) areaFilter.gte = criteria.minArea;
           if (criteria.maxArea && criteria.maxArea > 0) areaFilter.lte = criteria.maxArea;
           
           if (Object.keys(areaFilter).length > 0) {
              whereClause.area = areaFilter;
           }
 
            const properties = await prisma.property.findMany({
            where: whereClause,
            include: { photos: true },
            take: 1
          });

          if (properties.length > 0) {
            const p = properties[0];
            const propertyJson = JSON.stringify({
              id: p.id,
              title: p.title,
              price: p.price,
              location: p.location,
              rooms: p.rooms,
              bathrooms: p.bathrooms,
              area: p.area,
              image: p.photos[0]?.url || null
            });

            const texts: Record<string, string> = {
              tr: `Aradığınız kriterlere en uygun ilanı buldum:\n\n🏠 İlan: **${p.title}**\n📍 Konum: ${p.location}\n💰 Fiyat: ${p.price}\n\nDaha detaylı incelemek için aşağıdaki butonu kullanabilirsiniz.`,
              en: `I found the best property matching your criteria:\n\n🏠 Property: **${p.title}**\n📍 Location: ${p.location}\n💰 Price: ${p.price}\n\nYou can use the button below to view details.`,
              ar: `وجدت أفضل عقار يطابق معاييرك:\n\n🏠 العقار: **${p.title}**\n📍 الموقع: ${p.location}\n💰 السعر: ${p.price}\n\nيمكنك استخدام الزر أدناه لعرض التفاصيل.`
            };

            aiResponseText = `${texts[locale] || texts['tr']} [PROPERTY_DATA]${propertyJson}[/PROPERTY_DATA]`;
          } else {
             const texts: Record<string, string> = {
              tr: `Üzgünüm, "${criteria.query}" kriterlerine uygun bir ilan bulamadım. İsterseniz "İlanlar" sayfamızdan tüm portföyümüzü inceleyebilirsiniz.`,
              en: `Sorry, I couldn't find a property matching "${criteria.query}". You can browse our full portfolio on the "Properties" page.`,
              ar: `عذراً، لم أتمكن من العثور على عقار يطابق "${criteria.query}". يمكنك تصفح محفظتنا الكاملة على صفحة "العقارات".`
            };
            aiResponseText = texts[locale] || texts['tr'];
          }
        }
      } catch (e) {
        console.error('Property search error:', e);
        // Fallback to generic error message or keep original if it was just a json parse error
      }
    }

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

      const switchMsgContent = SWITCH_MESSAGES[locale] || SWITCH_MESSAGES['tr'];

      const switchMsg = await prisma.message.create({
        data: {
          content: switchMsgContent,
          sender: 'bot',
          senderName: SENDER_NAMES[locale] || SENDER_NAMES['tr'],
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
        senderName: SENDER_NAMES[locale] || SENDER_NAMES['tr'],
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
