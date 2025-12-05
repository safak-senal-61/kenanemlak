
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateToken } from '@/lib/auth'; // Admin kontrolü için
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Admin yetkisi kontrolü
  const authResult = authenticateToken(request);
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const sessions = await prisma.chatSession.findMany({
      where: {
        status: {
          in: ['live_waiting', 'live_active']
        }
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Admin chat fetch error:', error);
    return NextResponse.json(
      { error: 'Sohbetler getirilemedi.' },
      { status: 500 }
    );
  }
}
