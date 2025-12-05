import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
  }

  try {
    const messages = await prisma.message.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        content: true,
        sender: true,
        senderName: true,
        createdAt: true
      }
    });

    return NextResponse.json({ messages });

  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
