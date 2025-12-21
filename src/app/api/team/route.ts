import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateToken } from '@/lib/auth';

export async function GET() {
  try {
    const members = await prisma.teamMember.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json({ error: 'Error fetching team members' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authResult = authenticateToken(request);
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const body = await request.json();
    const {
      name,
      role,
      slug,
      image,
      email,
      phone,
      whatsapp,
      location,
      bio,
      socialMedia,
      order,
    } = body;

    if (!name || !role || !slug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingSlug = await prisma.teamMember.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const member = await prisma.teamMember.create({
      data: {
        name,
        role,
        slug,
        image,
        email,
        phone,
        whatsapp,
        location,
        bio,
        socialMedia,
        order: order ? parseInt(order) : 0,
      },
    });

    return NextResponse.json(member);
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json({ error: 'Error creating team member' }, { status: 500 });
  }
}
