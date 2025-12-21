import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'Kenan Kadıoğlu Emlak <noreply@kenankadioglu.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    })
  } catch (error) {
    console.error('Email sending failed:', error)
    throw error
  }
}

export function generateAdminInvitationEmail(invitationUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Kenan Kadıoğlu - Admin Daveti</title>
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
          <p>Kenan Kadıoğlu Gayrimenkul admin paneline davet edildiniz.</p>
          <p>Aşağıdaki butona tıklayarak admin hesabınızı oluşturabilirsiniz:</p>
          <div style="text-align: center;">
            <a href="${invitationUrl}" class="button">Admin Hesabı Oluştur</a>
          </div>
          <p>Bu davet 24 saat içinde geçerlidir.</p>
          <p>Eğer bu daveti beklemiyordunuz, lütfen bu e-postayı dikkate almayın.</p>
        </div>
        <div class="footer">
          <p>Kenan Kadıoğlu Gayrimenkul Danışmanlığı</p>
          <p>Trabzon, Türkiye</p>
        </div>
      </div>
    </body>
    </html>
  `
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
          <p>İlgilenebileceğinizi düşündüğümüz yeni bir ilan portföyümüze eklendi.</p>
          
          <div class="property-details">
            <h3 style="margin-top: 0; color: #D4AF37;">${propertyTitle}</h3>
            <p><strong>Fiyat:</strong> ${propertyPrice}</p>
            <p><strong>Konum:</strong> ${propertyLocation}</p>
          </div>

          <p>Daha detaylı bilgi almak ve fotoğrafları incelemek için aşağıdaki butona tıklayın:</p>
          
          <div style="text-align: center;">
            <a href="${propertyUrl}" class="button">İlanı İncele</a>
          </div>
          
          <p>İyi günler dileriz.</p>
        </div>
        <div class="footer">
          <p>Kenan Kadıoğlu Gayrimenkul Danışmanlığı</p>
          <p>Trabzon, Türkiye</p>
          <p><a href="${process.env.SITE_URL || 'http://localhost:3000'}/unsubscribe" style="color: #999;">Abonelikten Ayrıl</a></p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function generateContactFormEmail(data: { name: string; email: string; phone: string; subject: string; message: string }): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Yeni İletişim Formu Mesajı</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #D4AF37, #B8860B); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .field { margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 15px; }
        .label { font-weight: bold; color: #D4AF37; display: block; margin-bottom: 5px; }
        .value { color: #333; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Kenan Kadıoğlu Gayrimenkul</h1>
          <p>Yeni İletişim Formu Mesajı</p>
        </div>
        <div class="content">
          <div class="field">
            <span class="label">Ad Soyad:</span>
            <span class="value">${data.name}</span>
          </div>
          <div class="field">
            <span class="label">E-posta:</span>
            <span class="value">${data.email}</span>
          </div>
          <div class="field">
            <span class="label">Telefon:</span>
            <span class="value">${data.phone || 'Belirtilmedi'}</span>
          </div>
          <div class="field">
            <span class="label">Konu:</span>
            <span class="value">${data.subject || 'Belirtilmedi'}</span>
          </div>
          <div class="field">
            <span class="label">Mesaj:</span>
            <div class="value" style="white-space: pre-wrap;">${data.message}</div>
          </div>
        </div>
        <div class="footer">
          <p>Bu mesaj web sitesi iletişim formundan gönderilmiştir.</p>
        </div>
      </div>
    </body>
    </html>
  `
}