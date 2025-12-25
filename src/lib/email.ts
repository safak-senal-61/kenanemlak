import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    throw new Error('Email service configuration error');
  }

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM || 'Kenan Kadıoğlu Emlak <info@kenankadioglu.com.tr>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}

export function generateContactFormEmail(data: { name: string; email: string; phone: string; subject: string; message: string }): string {
  return `
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
          <h2>Yeni İletişim Formu Mesajı</h2>
        </div>
        <div class="content">
          <div class="field">
            <span class="label">Ad Soyad:</span> ${data.name}
          </div>
          <div class="field">
            <span class="label">E-posta:</span> ${data.email}
          </div>
          <div class="field">
            <span class="label">Telefon:</span> ${data.phone || 'Belirtilmedi'}
          </div>
          <div class="field">
            <span class="label">Konu:</span> ${data.subject || 'Belirtilmedi'}
          </div>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <div class="field">
            <span class="label">Mesaj:</span>
            <p style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 5px;">${data.message}</p>
          </div>
        </div>
        <div class="footer">
          <p>Bu mesaj web sitenizdeki iletişim formundan gönderilmiştir.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateNewPropertyEmail(userName: string, propertyTitle: string, propertyId: string, propertyPrice: string, propertyLocation: string): string {
  const propertyUrl = `${process.env.SITE_URL || 'http://localhost:3000'}/properties/${propertyId}`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Yeni İlan: ${propertyTitle}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #D4AF37, #B8860B); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #D4AF37; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        .property-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #D4AF37; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Kenan Kadıoğlu Gayrimenkul</h1>
          <p>Yeni Fırsat Alarmı</p>
        </div>
        <div class="content">
          <h2>Merhaba,</h2>
          <p>İlginizi çekebilecek yeni bir portföyümüz var:</p>
          
          <div class="property-details">
            <h3 style="margin-top: 0; color: #D4AF37;">${propertyTitle}</h3>
            <p><strong>Fiyat:</strong> ${propertyPrice}</p>
            <p><strong>Konum:</strong> ${propertyLocation}</p>
          </div>
          
          <div style="text-align: center;">
            <a href="${propertyUrl}" class="button">İlanı İncele</a>
          </div>
          
          <p>Daha fazla bilgi için bizimle iletişime geçebilirsiniz.</p>
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

export function generateAdminInvitationEmail(inviteUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Admin Paneli Daveti</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #D4AF37, #B8860B); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #D4AF37; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Kenan Kadıoğlu Gayrimenkul</h1>
          <p>Admin Paneli Daveti</p>
        </div>
        <div class="content">
          <h2>Merhaba,</h2>
          <p>Kenan Kadıoğlu Gayrimenkul yönetim paneline erişiminiz için davet edildiniz.</p>
          
          <p>Hesabınızı oluşturmak ve panele erişmek için aşağıdaki butona tıklayın:</p>
          
          <div style="text-align: center;">
            <a href="${inviteUrl}" class="button">Daveti Kabul Et</a>
          </div>
          
          <p>Bu davet 24 saat süreyle geçerlidir.</p>
          <p>Eğer bu daveti siz talep etmediyseniz, lütfen dikkate almayınız.</p>
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
