
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('Fetching property with ID:', id);

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        photos: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!property) {
      console.log('Property not found for ID:', id);
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json({ error: 'Error fetching property' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Manually delete related photos first to ensure deletion works even if DB cascade is missing
    await prisma.propertyPhoto.deleteMany({
      where: {
        propertyId: id,
      },
    });
    
    const property = await prisma.property.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Property deleted successfully', property });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json({ error: 'Error deleting property' }, { status: 500 });
  }
}