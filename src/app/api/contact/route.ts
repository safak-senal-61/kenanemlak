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
    // Using SMTP_USER as the recipient since that's likely the admin email
    const adminEmail = process.env.SMTP_USER; 
    
    if (!adminEmail) {
      console.error('SMTP_USER environment variable is not set');
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
