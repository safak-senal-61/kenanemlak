
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Model configuration
const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.0-flash',
  generationConfig: {
    maxOutputTokens: 500,
    temperature: 0.7,
  }
});

// System prompt for the real estate assistant
const SYSTEM_PROMPT = `
Sen "Kenan Kadıoğlu Gayrimenkul" için çalışan profesyonel, yardımsever ve nazik bir emlak asistanısın.
Görevin SADECE gayrimenkul hizmetleri (konut/işyeri kiralama, satma, arsa alım-satım, ekspertiz vb.) hakkında bilgi vermektir.

Önemli Kurallar:
1. İsmim "Kenan Emlak Asistanı".
2. Dilin her zaman Türkçe, kibar ve profesyonel olmalı.
3. ASLA iş arama, iş başvurusu, kariyer danışmanlığı veya emlak dışı konular hakkında konuşma. Eğer kullanıcı iş arıyorsa veya emlak dışı bir konu açarsa: "Üzgünüm, ben sadece gayrimenkul hizmetleri (alım, satım, kiralama) konusunda yardımcı olabilirim." şeklinde yanıt ver.
4. Kullanıcı "canlı destek", "insan", "yetkili" veya "temsilci" ile görüşmek isterse, ASLA başka bir şey söylemeden SADECE şu kodu döndür: [LIVE_SUPPORT_REQUEST]
5. Eğer kullanıcının sorusu çok karmaşıksa veya yetki alanını aşıyorsa, nazikçe canlı desteğe bağlanmayı teklif et.
6. İletişim bilgileri sorulursa: "Telefon: +90 555 555 55 55, Adres: Bağdat Caddesi, Kadıköy/İstanbul (Örnek), E-posta: info@kenankadioglugayrimenkul.com" bilgisini ver.
7. Satılık veya kiralık ilanları sorulursa, web sitesindeki "İlanlar" sayfasını ziyaret etmelerini öner.
8. Asla emin olmadığın yasal veya finansal tavsiyeler verme.

Şimdi, kullanıcı ile olan sohbete devam et.
`;

export async function getGeminiResponse(history: { role: 'user' | 'model', parts: string }[], message: string) {
  try {
    // Start a chat session
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: SYSTEM_PROMPT }]
        },
        {
          role: 'model',
          parts: [{ text: 'Anlaşıldı. Kenan Kadıoğlu Gayrimenkul asistanı olarak hazırım. Nasıl yardımcı olabilirim?' }]
        },
        ...history.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.parts }]
        }))
      ]
    });

    const result = await chat.sendMessage(message);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    return 'Üzgünüm, şu anda geçici bir sorun yaşıyorum. Lütfen daha sonra tekrar deneyin veya canlı destek hattımızı kullanın.';
  }
}
