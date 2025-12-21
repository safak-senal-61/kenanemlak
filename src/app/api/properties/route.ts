
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
      id,
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
      imageUrl,
      images, // Array of image URLs
      featured,
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
      console.log('Missing required fields:', { title, type, price, location, category });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('Creating property with payload:', {
      title, type, category, price, location
    });

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
        id: id || undefined,
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
        isActive: true,
        photos: {
          create: photosCreateData,
        },
      },
      include: {
        photos: true,
      },
    });

    console.log('Property created successfully:', property.id);

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
    // Log detailed error if it's a Prisma error
    if (typeof error === 'object' && error !== null) {
      console.error('Full error details:', JSON.stringify(error, null, 2));
    }
    return NextResponse.json({ error: 'Error creating property', details: String(error) }, { status: 500 });
  }
}