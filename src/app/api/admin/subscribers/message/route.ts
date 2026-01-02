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
    const { email, subject, message, isHtml } = body;

    if (!email || !subject || !message) {
      return NextResponse.json(
        { error: 'Email, konu ve mesaj alanları zorunludur.' },
        { status: 400 }
      );
    }

    let htmlContent = message;

    if (!isHtml) {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${subject}</title>
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
              <p>${message.replace(/\n/g, '<br>')}</p>
            </div>
            <div class="footer">
              <p>Kenan Kadıoğlu Gayrimenkul Danışmanlığı</p>
              <p>Trabzon, Türkiye</p>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    await sendEmail({
      to: email,
      subject: subject,
      html: htmlContent,
    });

    return NextResponse.json({ message: 'E-posta başarıyla gönderildi.' });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { error: 'E-posta gönderilirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
