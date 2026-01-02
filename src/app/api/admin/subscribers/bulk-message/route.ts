import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  const authResult = authenticateToken(request);
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const body = await request.json();
    const { emails, subject, message, isHtml } = body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ error: 'Alıcı listesi boş olamaz.' }, { status: 400 });
    }

    if (!subject || !message) {
      return NextResponse.json({ error: 'Konu ve mesaj alanları zorunludur.' }, { status: 400 });
    }

    // Basic HTML Template for Custom Messages
    let htmlContent = message;

    if (!isHtml) {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #D4AF37, #B8860B); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Kenan Kadıoğlu Gayrimenkul</h1>
            </div>
            <div class="content">
              <h2>${subject}</h2>
              <div style="white-space: pre-wrap;">${message}</div>
            </div>
            <div class="footer">
              <p>Kenan Kadıoğlu Gayrimenkul Danışmanlığı</p>
              <p>Trabzon, Türkiye</p>
              <p><a href="${process.env.SITE_URL || 'http://localhost:3000'}/unsubscribe" style="color: #999;">Abonelikten Ayrıl</a></p>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    // Send emails in parallel (be careful with rate limits if using a real SMTP service)
    const sendPromises = emails.map(email => 
      sendEmail({
        to: email,
        subject: subject,
        html: htmlContent
      }).catch(err => {
        console.error(`Failed to send to ${email}:`, err);
        // We continue even if one fails
        return null; 
      })
    );

    await Promise.all(sendPromises);

    return NextResponse.json({ message: `${emails.length} kişiye mesaj gönderimi başlatıldı.` });
  } catch (error) {
    console.error('Bulk message error:', error);
    return NextResponse.json(
      { error: 'Mesaj gönderimi sırasında bir hata oluştu.' },
      { status: 500 }
    );
  }
}
