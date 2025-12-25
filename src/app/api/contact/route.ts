import { NextResponse } from 'next/server';
import { sendEmail, generateContactFormEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Simple validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required fields.' },
        { status: 400 }
      );
    }

    // Generate email content
    const emailHtml = generateContactFormEmail({
      name,
      email,
      phone,
      subject,
      message
    });

    // Send email to admin
    // Using ADMIN_EMAIL as the recipient
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER; 
    
    if (!adminEmail) {
      console.error('ADMIN_EMAIL environment variable is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    await sendEmail({
      to: adminEmail,
      subject: `Yeni İletişim Formu Mesajı: ${subject || 'Konusuz'}`,
      html: emailHtml
    });

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
