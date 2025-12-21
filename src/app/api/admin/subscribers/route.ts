import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const authResult = authenticateToken(request);
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const subscribers = await prisma.subscriber.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(subscribers);
  } catch (error) {
    console.error('Subscribers fetch error:', error);
    return NextResponse.json(
      { error: 'Aboneler getirilemedi.' },
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

    await prisma.subscriber.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Abone silindi' });
  } catch (error) {
    console.error('Subscriber delete error:', error);
    return NextResponse.json(
      { error: 'Abone silinemedi.' },
      { status: 500 }
    );
  }
}
