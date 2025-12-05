import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const authResult = authenticateToken(request);
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(admins);
  } catch (error) {
    console.error('Admin list fetch error:', error);
    return NextResponse.json(
      { error: 'Admin listesi getirilemedi.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const authResult = authenticateToken(request);
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });
    }

    // Prevent self-deletion
    if (authResult.admin?.adminId === id) {
      return NextResponse.json({ error: 'Kendinizi silemezsiniz' }, { status: 400 });
    }

    // Prevent deleting the last super admin (optional safety check, skipping for now)

    await prisma.admin.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Admin silindi' });
  } catch (error) {
    console.error('Admin delete error:', error);
    return NextResponse.json(
      { error: 'Admin silinemedi.' },
      { status: 500 }
    );
  }
}
