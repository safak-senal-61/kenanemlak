import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, date, time, note, propertyTitle, propertyId } = body;

    if (!name || !phone || !email || !date || !time) {
      return NextResponse.json(
        { error: 'Zorunlu alanları doldurunuz.' },
        { status: 400 }
      );
    }

    // Email content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; }
          .header { background-color: #D4AF37; color: white; padding: 15px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 20px; }
          .field { margin-bottom: 10px; }
          .label { font-weight: bold; color: #555; }
          .footer { margin-top: 20px; font-size: 12px; color: #888; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Yeni Randevu Talebi</h2>
          </div>
          <div class="content">
            <p><strong>${propertyTitle}</strong> ilanı için yeni bir randevu talebi oluşturuldu.</p>
            
            <div class="field">
              <span class="label">İlan ID:</span> ${propertyId}
            </div>
            
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            
            <h3>Müşteri Bilgileri</h3>
            <div class="field">
              <span class="label">Ad Soyad:</span> ${name}
            </div>
            <div class="field">
              <span class="label">Telefon:</span> ${phone}
            </div>
            <div class="field">
              <span class="label">E-posta:</span> ${email}
            </div>
            
            <h3>Randevu Detayları</h3>
            <div class="field">
              <span class="label">Tarih:</span> ${date}
            </div>
            <div class="field">
              <span class="label">Saat:</span> ${time}
            </div>
            ${note ? `
            <div class="field">
              <span class="label">Not:</span>
              <p style="background: #f9f9f9; padding: 10px; border-radius: 5px;">${note}</p>
            </div>
            ` : ''}
          </div>
          <div class="footer">
            <p>Bu e-posta Kenan Emlak web sitesinden gönderilmiştir.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send to admin (SMTP_USER)
    await sendEmail({
      to: process.env.SMTP_USER || '',
      subject: `Randevu Talebi: ${name} - ${propertyTitle}`,
      html: htmlContent,
    });

    return NextResponse.json({ message: 'Randevu talebi başarıyla iletildi.' });
  } catch (error) {
    console.error('Appointment error:', error);
    return NextResponse.json(
      { error: 'Randevu talebi işlenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
