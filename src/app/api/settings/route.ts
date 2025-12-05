import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Get or create default settings
    let settings = await prisma.systemSettings.findFirst();
    
    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: {
          maintenanceMode: false
        }
      });
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { maintenanceMode } = body;
    
    // Update the first record (singleton)
    const settings = await prisma.systemSettings.findFirst();
    
    let updated;
    if (settings) {
      updated = await prisma.systemSettings.update({
        where: { id: settings.id },
        data: { maintenanceMode }
      });
    } else {
      updated = await prisma.systemSettings.create({
        data: { maintenanceMode }
      });
    }
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
