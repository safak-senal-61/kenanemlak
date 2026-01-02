import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const authResult = authenticateToken(request);
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  // Only admin can list other admins
  if (authResult.admin!.role !== 'admin') {
    return NextResponse.json({ error: 'Bu işlem için yetkiniz yok.' }, { status: 403 });
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
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(admins);
  } catch (error) {
    console.error('Fetch admins error:', error);
    return NextResponse.json({ error: 'Yöneticiler getirilemedi.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authResult = authenticateToken(request);
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  // Only admin can delete other admins
  if (authResult.admin!.role !== 'admin') {
    return NextResponse.json({ error: 'Bu işlem için yetkiniz yok.' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID gerekli.' }, { status: 400 });
    }

    // Prevent deleting self
    if (id === authResult.admin!.adminId) {
      return NextResponse.json({ error: 'Kendi hesabınızı silemezsiniz.' }, { status: 400 });
    }

    await prisma.admin.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Yönetici silindi.' });
  } catch (error) {
    console.error('Delete admin error:', error);
    return NextResponse.json({ error: 'Yönetici silinemedi.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const authResult = authenticateToken(request);
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  // Only admin can update roles
  if (authResult.admin!.role !== 'admin') {
    return NextResponse.json({ error: 'Bu işlem için yetkiniz yok.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, role } = body;

    if (!id || !role) {
      return NextResponse.json({ error: 'ID ve Rol bilgisi gerekli.' }, { status: 400 });
    }

    if (role !== 'admin' && role !== 'editor') {
      return NextResponse.json({ error: 'Geçersiz rol.' }, { status: 400 });
    }

    // Prevent changing self role (to avoid locking oneself out)
    if (id === authResult.admin!.adminId) {
      return NextResponse.json({ error: 'Kendi rolünüzü değiştiremezsiniz.' }, { status: 400 });
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updatedAdmin);
  } catch (error) {
    console.error('Update admin role error:', error);
    return NextResponse.json({ error: 'Rol güncellenemedi.' }, { status: 500 });
  }
}
