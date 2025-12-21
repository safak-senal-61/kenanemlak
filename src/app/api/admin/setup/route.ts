import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, adminSecret } = await request.json();

    // Verify Admin Secret
    const validSecret = process.env.ADMIN_SECRET || "kenan-admin-2024-secret-key";
    
    if (adminSecret !== validSecret) {
      return NextResponse.json(
        { error: 'Geçersiz Admin Gizli Anahtarı. Kurulum yetkiniz yok.' },
        { status: 403 }
      );
    }

    // Check if email already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email }
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Bu e-posta adresi zaten kullanımda.' },
        { status: 400 }
      );
    }

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Tüm alanlar zorunludur.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Şifre en az 6 karakter olmalıdır.' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'admin', // Created via setup with secret key is always super admin
      },
    });

    return NextResponse.json({ message: 'Ana yönetici başarıyla oluşturuldu.', admin });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'Kurulum sırasında bir hata oluştu.' },
      { status: 500 }
    );
  }
}
