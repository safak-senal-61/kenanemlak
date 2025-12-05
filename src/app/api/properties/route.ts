
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail, generateNewPropertyEmail } from '@/lib/email';
import { Subscriber } from '@prisma/client';

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      where: {
        isActive: true,
      },
      include: {
        photos: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({ error: 'Error fetching properties' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      type,
      category,
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
      imageUrl,
      images, // Array of image URLs
      featured,
    } = body;

    // Basic validation
    if (!title || !type || !price || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let photosCreateData: { url: string; isMain: boolean; order: number }[] = [];
    
    if (images && Array.isArray(images) && images.length > 0) {
      photosCreateData = images.map((url: string, index: number) => ({
        url,
        isMain: index === 0,
        order: index,
      }));
    } else if (imageUrl) {
      photosCreateData = [{
        url: imageUrl,
        isMain: true,
        order: 0,
      }];
    }

    const property = await prisma.property.create({
      data: {
        title,
        type,
        category,
        price,
        location,
        area: parseInt(area),
        areaNet: areaNet ? parseInt(areaNet) : null,
        rooms: rooms,
        bathrooms: parseInt(bathrooms),
        buildingAge,
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
        description,
        featured: featured || false,
        isActive: true,
        photos: {
          create: photosCreateData,
        },
      },
      include: {
        photos: true,
      },
    });

    // Send email notifications to subscribers
    try {
      const subscribers = await prisma.subscriber.findMany();
      
      if (subscribers.length > 0) {
        const emailPromises = subscribers.map((subscriber: Subscriber) => {
          const html = generateNewPropertyEmail(
            subscriber.name,
            property.title,
            property.id,
            property.price,
            property.location
          );

          return sendEmail({
            to: subscriber.email,
            subject: `Yeni İlan: ${property.title}`,
            html,
          }).catch(err => {
            console.error(`Failed to send email to ${subscriber.email}:`, err);
          });
        });

        // Don't await all promises to finish before returning response
        // to keep the UI responsive. In a production environment,
        // this should be handled by a background job queue.
        Promise.allSettled(emailPromises);
      }
    } catch (emailError) {
      console.error('Error in email notification process:', emailError);
      // Don't fail the request if email sending fails
    }

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json({ error: 'Error creating property' }, { status: 500 });
  }
}