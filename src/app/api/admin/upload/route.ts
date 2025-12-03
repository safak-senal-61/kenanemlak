import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

async function saveUploadedFile(buffer: Buffer, originalName: string, propertyId: string): Promise<string> {
  const uploadDir = join(process.cwd(), 'public', 'uploads', propertyId);
  await mkdir(uploadDir, { recursive: true });

  const ext = originalName.split('.').pop();
  const fileName = `${randomUUID()}.${ext}`;
  const filePath = join(uploadDir, fileName);

  await writeFile(filePath, buffer);

  return `/uploads/${propertyId}/${fileName}`;
}
import { verifyToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded || !decoded.adminId) {
      return NextResponse.json(
        { error: 'Geçersiz token' },
        { status: 401 }
      );
    }

    // Verify admin exists
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.adminId }
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin bulunamadı' },
        { status: 404 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const propertyId = formData.get('propertyId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'Dosya bulunamadı' },
        { status: 400 }
      );
    }

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Emlak ID\'si gerekli' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file
    const fileUrl = await saveUploadedFile(buffer, file.name, propertyId);

    // Save to database
    const propertyPhoto = await prisma.propertyPhoto.create({
      data: {
        propertyId,
        url: fileUrl
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: propertyPhoto.id,
        url: fileUrl
      }
    });

  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Dosya yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Emlak ID\'si gerekli' },
        { status: 400 }
      );
    }

    const photos = await prisma.propertyPhoto.findMany({
      where: { propertyId },
      orderBy: { id: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: photos
    });

  } catch (error) {
    console.error('Get photos error:', error);
    return NextResponse.json(
      { error: 'Fotoğraflar getirilirken hata oluştu' },
      { status: 500 }
    );
  }
}