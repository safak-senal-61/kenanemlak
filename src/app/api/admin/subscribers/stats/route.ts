import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const authResult = authenticateToken(request);
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const totalSubscribers = await prisma.subscriber.count();
    
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const newSubscribersThisMonth = await prisma.subscriber.count({
      where: {
        createdAt: {
          gte: firstDayOfMonth
        }
      }
    });

    return NextResponse.json({
      total: totalSubscribers,
      newThisMonth: newSubscribersThisMonth,
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json(
      { error: 'İstatistikler getirilemedi.' },
      { status: 500 }
    );
  }
}
