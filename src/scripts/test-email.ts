
import fs from 'fs';
import path from 'path';

// Manually load .env file since we are running a standalone script
const envPath = path.resolve(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  });
  console.log('Environment variables loaded from .env');
} else {
  console.error('.env file not found at', envPath);
}

async function test() {
  // Dynamically import to ensure process.env is set first
  const { sendEmail } = await import('../lib/email');

  console.log('Testing email sending...');
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  
  console.log('Admin Email:', adminEmail);
  console.log('Resend API Key:', process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.substring(0, 5) + '...' : 'Missing');
  console.log('Resend From:', process.env.RESEND_FROM);

  if (!adminEmail) {
    console.error('ADMIN_EMAIL is not set');
    return;
  }

  try {
    await sendEmail({
      to: adminEmail,
      subject: 'Test Email from Script',
      html: '<p>This is a test email sent via script to verify Resend configuration.</p>'
    });
    console.log('Email sent successfully!');
  } catch (error: unknown) {
    console.error('Failed to send email:', error);
    if (typeof error === 'object' && error !== null && 'response' in error) {
      console.error('Response data:', (error as { response: { data: unknown } }).response.data);
    }
  }
}

test();
