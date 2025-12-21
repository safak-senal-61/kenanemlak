
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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      title,
      type,
      category,
      subCategory,
      price,
      location,
      area,
      areaNet,
      rooms,
      bathrooms,
      buildingAge,
      floorNumber,
      totalFloors,
      heating,
      balcony,
      elevator,
      furnished,
      inComplex,
      kitchen,
      parking,
      usageStatus,
      description,
      featured,
      images,
      zoningStatus,
      block,
      parcel,
      sheet,
      kaks,
      gabari,
      titleDeedStatus,
    } = body;

    // Basic validation
    if (!title || !type || !price || !location || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Handle photos update logic
    // 1. Delete existing photos (or you could be smarter and diff them)
    // For simplicity, we can replace them if new images are provided
    
    // However, usually we want to keep existing ones if they are still in the list
    // The client sends 'images' array which contains all URLs (existing + new)
    
    // First, delete all photos for this property
    await prisma.propertyPhoto.deleteMany({
      where: { propertyId: id }
    });

    // Then create new photo entries
    const photosCreateData = (images || []).map((url: string, index: number) => ({
      url,
      isMain: index === 0,
      order: index,
    }));

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: {
        title,
        type,
        category,
        subCategory: subCategory || null,
        price: String(price),
        location,
        area: parseInt(area) || 0,
        areaNet: areaNet ? parseInt(areaNet) : null,
        rooms: String(rooms || '0'),
        bathrooms: bathrooms ? parseInt(bathrooms) : 0,
        buildingAge: buildingAge ? String(buildingAge) : null,
        floorNumber: floorNumber ? parseInt(floorNumber) : null,
        totalFloors: totalFloors ? parseInt(totalFloors) : null,
        heating,
        balcony: Boolean(balcony),
        elevator: Boolean(elevator),
        furnished: Boolean(furnished),
        inComplex: Boolean(inComplex),
        kitchen,
        parking,
        usageStatus,
        zoningStatus,
        block,
        parcel,
        sheet,
        kaks,
        gabari,
        titleDeedStatus,
        description,
        featured: featured || false,
        photos: {
          create: photosCreateData,
        },
      },
      include: {
        photos: true,
      },
    });

    return NextResponse.json(updatedProperty);
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json({ error: 'Error updating property', details: String(error) }, { status: 500 });
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